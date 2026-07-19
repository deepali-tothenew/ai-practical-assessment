# Debugging Notes

Significant issues encountered during the Support Ticket Management System assessment, how they were diagnosed, and how they were resolved.

**Related documents:** `tool-workflow.md`, `test-results.md`, `implementation-plan.md`

---

## Summary

| # | Area | Issue | Severity | Resolution |
|---|------|-------|----------|------------|
| 1 | Configuration | Backend ignored `src/backend/.env` | High | Point `env.js` at `src/backend/.env` |
| 2 | Runtime | Port 3001 already in use | Low | Free port or set `PORT` in `.env` |
| 3 | Architecture | `TicketService` bypassed `CommentService` | Medium | Route comment access through `CommentService` |
| 4 | Testing | Integration tests used development database | High | `.env.test` + `NODE_ENV=test` in Jest scripts |
| 5 | Testing | Incomplete integration test coverage | Medium | Implemented remaining suites per `test-strategy.md` |
| 6 | Scaffold | `asyncHandler` removed prematurely | Low | Re-created when async controllers were added |
| 7 | Frontend build | Duplicate `validateCreateComment` export | High | Removed duplicate function in `validation.js` |
| 8 | Frontend UX | Comment form not cleared after submit | Medium | Reset form state on successful `onSubmit` |
| 9 | Frontend UX | Search input lost focus while typing | Medium | Stop disabling search during list refresh |
| 10 | Frontend UX | Unexpected `.` inserted in search field | Medium | Change `type="search"` to `type="text"` |

---

## 1. Backend environment file not loaded

### Symptoms

- Backend started but did not pick up values from `src/backend/.env`
- Database connection or port configuration appeared ignored
- Frontend env (`src/frontend/.env`) worked; backend did not

### Root cause

Initial scaffold loaded environment variables from the **repository root**:

```javascript
// Original (incorrect for this project layout)
dotenv.config({ path: path.join(projectRoot, '.env') });
```

The candidate had created `src/backend/.env`, but the loader never read that path. Root and backend env files were split inconsistently.

### Diagnosis

Phase 1 scaffold review compared `config/env.js` against where `.env` files actually lived. A quick Node check confirmed `src/backend/.env` was not being loaded.

### Resolution

Updated `src/backend/config/env.js` to load from `src/backend/`:

- Development/production: `src/backend/.env`
- Test: `src/backend/.env.test` when `NODE_ENV=test`

Moved `.env.example` into `src/backend/` and `src/frontend/` respectively so each package is self-contained.

### Prevention

- Verify env loading with a one-line config dump after scaffold changes
- Document env file locations in README (documented in `README.md` and `database/setup-notes.md`)

---

## 2. API port already in use

### Symptoms

- First backend startup attempt on default port 3001 failed
- Error indicated another process was listening on the port

### Root cause

Port 3001 was already occupied by another local process (unrelated dev server).

### Resolution

Either stop the conflicting process or set a different `PORT` in `src/backend/.env`. Health check succeeded on an alternate port during initial verification.

### Prevention

Document default ports and the `PORT` override in setup instructions.

---

## 3. Service layering violation — comments

### Symptoms

No runtime failure initially. Identified during **backend code review** against `design-notes.md`.

### Root cause

`TicketService.getTicketById()` called `CommentRepository` directly instead of going through `CommentService`, breaking the intended layering:

```
Routes → Controllers → Services → Repositories
```

### Diagnosis

Architecture review prompt checked for SQL in controllers and business rules outside services. Cross-service repository access was flagged as a layering violation.

### Resolution

Updated `ticketService.js`:

```javascript
// Before
const comments = await commentRepository.findByTicketId(id);

// After
const comments = await commentService.listCommentsByTicketId(id);
```

### Prevention

- Enforce layer-by-layer implementation prompts
- Include cross-service access in architecture review checklists

---

## 4. Integration tests hitting the development database

### Symptoms

- Risk of test data polluting the development database
- Test runs could interfere with manual development data
- `test-strategy.md` requires a dedicated test database (`support_tickets_test`)

### Root cause

Early test setup did not consistently isolate the test environment:

- `NODE_ENV` was not set to `test` in npm test scripts
- Test configuration was partially hardcoded in test helper files
- `env.js` did not automatically select `.env.test`

### Diagnosis

Backend review against documentation identified test environment gaps. Running tests without `NODE_ENV=test` used development defaults.

### Resolution

1. Added `src/backend/.env.test` (and `.env.test.example`) with `DB_NAME=support_tickets_test`
2. Updated `env.js` to load `.env.test` when `NODE_ENV=test`
3. Set `NODE_ENV=test` in root `package.json` test scripts:

   ```json
   "test": "NODE_ENV=test jest"
   ```

4. Removed hardcoded environment variables from test setup helpers

### Verification

All 54 integration tests pass against `support_tickets_test` (recorded in `test-results.md`).

### Prevention

- Never hardcode DB credentials or database names in test files
- Always run tests via npm scripts that set `NODE_ENV=test`

---

## 5. Incomplete integration test coverage

### Symptoms

- Status transition tests existed and passed
- Broader `test-strategy.md` cases (CRUD, search/filter, comments, users) were not yet implemented

### Root cause

Tests were introduced incrementally — state machine suite first by design — but remaining suites had not been written when the first full backend review ran.

### Resolution

Implemented remaining integration test files:

- `tests/integration/tickets.test.js` — CRUD (CR-01 – CR-13)
- `tests/integration/searchFilter.test.js` — Search and filter (SF-01 – SF-08)
- `tests/integration/comments.test.js` — Comments (CM-01 – CM-04)
- `tests/integration/users.test.js` — Users (US-01)

Final count: **54 tests, all passing**.

### Prevention

Track test case IDs from `test-strategy.md` explicitly; do not consider Phase 3 complete until the matrix is covered.

---

## 6. Premature removal of `asyncHandler`

### Symptoms

No immediate failure in Phase 1 (no async routes yet). Would have blocked Phase 3 controller wiring.

### Root cause

Phase 1 cleanup removed `asyncHandler.js` as “unused” before async route handlers existed. When controllers were implemented, the middleware was needed again.

### Resolution

Re-created `src/backend/middleware/asyncHandler.js` when wiring async controllers and routes.

### Lesson

Do not delete scaffold utilities during cleanup if they are required by the next phase in `implementation-plan.md`. Prefer keeping thin, zero-dependency helpers until routes exist.

---

## 7. Duplicate `validateCreateComment` — frontend build failure

### Symptoms

- Frontend production build (`npm run build`) failed
- Bundler reported duplicate symbol / redeclaration error

### Root cause

`src/frontend/src/utils/validation.js` contained two `validateCreateComment` function definitions — likely introduced during iterative frontend implementation.

### Diagnosis

Build output pointed to `validation.js`. File inspection showed duplicate exports.

### Resolution

Removed the duplicate function, keeping a single `validateCreateComment` implementation.

### Verification

`npm run build` in `src/frontend/` completes successfully.

### Prevention

Run `npm run build` after adding validation utilities, not only `npm run dev`.

---

## 8. Comment form not cleared after successful submission

### Symptoms

- After adding a comment, the message and author fields retained previous values
- Violated expected UX from manual testing (and `ui-flow.md` implicit reset behavior)

### Root cause

`CommentForm` held local state. `TicketDetailPage` appended the new comment to the list on success but never signaled the form to reset.

### Resolution

1. `CommentForm` awaits `onSubmit` and resets local state when it returns `true`
2. `TicketDetailPage.handleAddComment` returns `true` on API success, `false` on validation or API errors

### Files changed

- `src/frontend/src/components/CommentForm.jsx`
- `src/frontend/src/pages/TicketDetailPage.jsx`

---

## 9. Search input lost focus while typing

### Symptoms

- Cursor left the search field during list refresh
- Typing was interrupted when search/filter triggered a new API request

### Root cause

`TicketListPage` disabled search and status controls when `loading && tickets.length === 0`. During debounced search:

1. Debounce fires → `loading` becomes `true`
2. If results were empty, `tickets.length === 0`
3. Search input `disabled` → **focus lost**

### Resolution

1. Removed `disabled` from search and status filter controls
2. Split **initial load** (`loading`) from **refresh** (`refreshing`) so refetch does not replace the entire page state
3. Kept previous results visible during refresh with a toolbar “Updating results…” indicator

### Files changed

- `src/frontend/src/pages/TicketListPage.jsx`

---

## 10. Unexpected full stop (`.`) in search field

### Symptoms

- A period character appeared in the search input unexpectedly while typing
- Reproduced during manual testing on macOS

### Root cause

Search used `type="search"`. On macOS/iOS, search inputs can apply platform-specific behavior (including double-space inserting `.`).

### Resolution

Changed `TicketSearchBar` to `type="text"` with search-oriented attributes:

- `autoComplete="off"`
- `autoCorrect="off"`
- `autoCapitalize="off"`
- `spellCheck={false}`
- `inputMode="search"`

No API or backend search behavior changed.

### Files changed

- `src/frontend/src/components/TicketSearchBar.jsx`

---

## Debugging Approach Used

### 1. Spec-driven review before fixing

Most non-trivial issues were found by reviewing implementation against `api-contract.md`, `design-notes.md`, and `test-strategy.md` — not by random debugging.

### 2. Narrow fix prompts

After identification, fixes used constrained prompts:

- “Fix only the layering issue…”
- “Refine the backend test environment configuration…”
- “Do not modify business logic, API contracts, or backend behavior.”

This avoided unrelated refactors while resolving the root cause.

### 3. Tests as proof

Backend issues were verified with:

```bash
npm test
```

Integration tests confirmed state machine rules, CRUD, search, and comments after each fix.

### 4. Manual testing for UX

Frontend interaction bugs (focus, period insertion, form reset) were not caught by integration tests. They surfaced during manual UI walkthrough and were fixed in a dedicated follow-up pass.

### 5. Build verification for frontend

Frontend issues like the duplicate export required running:

```bash
cd src/frontend && npm run build
```

Dev server alone (`npm run dev`) did not catch the duplicate symbol error.

---

## Issues Not Encountered (by design)

| Risk | Mitigation that worked |
|------|------------------------|
| Frontend-only state machine | Backend `statusService` + integration tests first |
| Status changed via general PATCH | Service rejects `status`; SU tests verify |
| Search including comments | Single repository query; SF-05 test asserts exclusion |
| AI scope creep (auth, Stretch) | Repeated “Core only” constraints in prompts |

---

## Related Artifacts

| Artifact | Relevance |
|----------|-----------|
| `tool-workflow.md` | Overall AI-assisted process and review pattern |
| `test-results.md` | Final test run after debugging test env |
| `test-strategy.md` | Test cases that exposed coverage gaps |
| `api-contract.md` | Contract used to validate fixes did not drift |
| `ai-prompts/debugging.md` | Debugging and fix prompts |
