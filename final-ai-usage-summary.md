# Final AI Usage Summary

Summary of how **Cursor (Agent mode)** was used to deliver the **Support Ticket Management System (Core)** for the AI Capability Exercise.

**Candidate:** Deepali Bansal  
**Primary AI tool:** Cursor  
**Approach:** Specification-driven development — documents and rules before code  
**Assessment period:** 2026-07-16 → 2026-07-19  
**Prompt history:** [`ai-prompts/`](ai-prompts/) (56 prompts across 7 lifecycle files)

---

## Executive summary

AI was used as a **drafting, implementation, and review assistant** — not as an autonomous author. The candidate retained control through:

- Explicit scope constraints in every prompt (“Core only”, “do not implement business logic yet”, “identify only required corrections”)
- Human approval of specifications before any application code
- Layer-by-layer backend construction with review at each boundary
- Integration tests as independent proof of backend behavior
- Manual testing to surface UX issues invisible to API tests

The result is a working Core application (54/54 integration tests passing), a complete specification set, and traceable lifecycle documentation from requirements through submission.

---

## Tool and workflow

| Aspect | Detail |
|--------|--------|
| **Tool** | Cursor Agent mode |
| **Workflow** | Phased delivery per `implementation-plan.md` (Phases 0–5) |
| **Persistent context** | `project-context.md`, `spec.md`, `cursor-rules-or-instructions.md` |
| **Contract** | `api-contract.md`, `ui-flow.md`, `design-notes.md`, `acceptance-criteria.md` |
| **Proof layer** | Jest integration tests + manual walkthrough |

### Prompt patterns that worked

| Pattern | Purpose | Example |
|---------|---------|---------|
| Scoped implementation | Keep diffs reviewable | “Implement the repository layer only.” |
| Spec-targeted generation | Align output to approved docs | “Generate api-contract.md based on …” |
| Targeted refinement | Avoid wholesale regeneration | “Make ONLY the refinements listed below.” |
| Correction-only review | Focus on compliance, not redesign | “Identify only required corrections.” |
| Fix-only follow-up | Narrow changes to one issue | “Fix the environment configuration only.” |
| UX fix without contract change | Separate UI fixes from API rules | “Do not modify business logic or API contracts.” |

Full prompt text and outcomes are recorded in [`ai-prompts/`](ai-prompts/).

---

## Planning (Phase 0)

**AI role:** Draft specifications, cross-reference artifacts, apply targeted refinements.

### What AI produced

| Artifact | AI contribution |
|----------|-----------------|
| `requirements-analysis.md` | Initial requirements, constraints, business rules, assumptions |
| `data-model.md` | Entity definitions, enums, state machine, search semantics |
| `ui-flow.md` | Screen flows, loading/empty/error states |
| `implementation-plan.md` | Phased delivery plan, milestones, AI usage plan |
| `design-notes.md` | Architecture, layering, component structure |
| `api-contract.md` | REST endpoints, request/response shapes, error codes |
| `test-strategy.md` | Integration test matrix (SM-V, SM-I, CR, SF, CM, etc.) |
| Cursor workflow copies | `project-context.md`, `spec.md`, `acceptance-criteria.md`, `tasks.md` |

### Human role

- Recorded 14 implementation decisions (stack, seeded users, dedicated status UX, search scope, Jest tier, Core-only scope)
- Manually reviewed all specs before coding
- Issued structured refinement prompts — **rejected** wholesale document regeneration
- Directed second-pass updates to `design-notes.md` (search trim, layer responsibilities, error handling, `NODE_ENV`)

### Outcome

Phase 0 gate passed: all planning documents internally consistent. **No application code until `api-contract.md` and `design-notes.md` were complete.**

**Prompts:** 4 planning + 4 design — see [`ai-prompts/planning.md`](ai-prompts/planning.md) and [`ai-prompts/design.md`](ai-prompts/design.md)

---

## Implementation

### Scaffolding (Phase 1)

**AI role:** Generate minimal backend and frontend project structure.

| Deliverable | AI output |
|-------------|-----------|
| Backend | Express app, health endpoint, middleware, env stub, folder structure |
| Frontend | Vite + React, `VITE_API_URL`, health-check connectivity page |
| Jest | Root test runner, `tests/integration/` structure |
| README | Skeleton with install, env, and run commands |

**Human interventions:**

- **Changed** env file location — backend must load `src/backend/.env`, not repository root
- **Accepted** scaffold review findings; drove Jest and README completion
- **Accepted** non-functional cleanup (redundant files, unused setup code)

**Prompts:** 4 — see [`ai-prompts/implementation.md`](ai-prompts/implementation.md) (IMPL-01–04)

---

### Database (Phase 2)

**AI role:** Translate approved data model into SQL and connection infrastructure.

| Deliverable | AI output |
|-------------|-----------|
| `database/schema.sql` | `users`, `tickets`, `comments` with FKs, ENUMs, indexes |
| `database/seed.sql` | Three seeded users (no ticket/comment seed data) |
| `config/database.js` | Connection pool, startup verification, graceful shutdown |

**Human role:** Verified schema matches `data-model.md` enums, immutability rules, and relationships.

**Prompts:** 3 — see [`ai-prompts/implementation.md`](ai-prompts/implementation.md) (IMPL-05–07)

---

### Backend API (Phase 3)

**AI role:** Layer-by-layer implementation from `api-contract.md` and `design-notes.md`.

| Layer | AI output |
|-------|-----------|
| Repositories | Parameterized SQL; persistence only |
| Services | Business rules, `statusService` state machine, validation |
| Controllers | Thin HTTP handlers |
| Validators | Structural request validation per contract |

**Key human interventions:**

| Issue | AI behavior | Human decision |
|-------|-------------|----------------|
| Layering violation | `TicketService` called `CommentRepository` directly | **Changed** — route through `CommentService` |
| Scope creep in reviews | Suggested optional improvements | **Rejected** — “required corrections only” |
| Auth / Stretch features | Occasionally implied in generic patterns | **Rejected** throughout |

**Prompts:** 4 implementation + 5 testing + 2 review — see [`ai-prompts/implementation.md`](ai-prompts/implementation.md), [`ai-prompts/testing.md`](ai-prompts/testing.md), [`ai-prompts/code-review.md`](ai-prompts/code-review.md)

---

### Frontend (Phase 4)

**AI role:** Build React SPA from `ui-flow.md` in feature order.

| Feature | AI output |
|---------|-----------|
| API client | `client.js`, `tickets.js`, `users.js`, `comments.js` with `ApiError` parsing |
| Ticket List | Search, status filter, debounce, loading/empty states |
| Create / Edit | Forms, dropdowns, validation, immutable `createdBy` on edit |
| Ticket Detail | Metadata, comments, dedicated `StatusAction` |
| Comments | Chronological display, immediate append after POST |

**Manual testing drove UX fixes (AI implemented, human identified):**

| Issue | Fix | Scope |
|-------|-----|-------|
| Comment form not clearing | Reset form state on successful submit | Frontend only |
| Search losing focus | Split initial load vs list refresh loading | Frontend only |
| Unexpected `.` in search | `type="search"` → `type="text"` on macOS | Frontend only |
| UI polish | Header, focus styles, refresh indicator | Frontend only |

AI did not modify business logic, API contracts, or backend behavior for these fixes.

**Prompts:** 7 implementation + 3 review/debug — see [`ai-prompts/implementation.md`](ai-prompts/implementation.md), [`ai-prompts/code-review.md`](ai-prompts/code-review.md), [`ai-prompts/debugging.md`](ai-prompts/debugging.md)

---

## Testing

**AI role:** Generate integration test suites from `test-strategy.md`; refine test environment configuration.

### Automated testing

| Stage | AI contribution | Result |
|-------|-----------------|--------|
| First suite | Status transition tests (SM-V, SM-I, SM-E, SU) | State machine proven |
| Test env fix | `.env.test`, `NODE_ENV=test` in Jest scripts | Isolated `support_tickets_test` |
| Remaining suites | CRUD, search/filter, comments, users | **54/54 tests passing** |
| Verification | Confirmed coverage vs `test-strategy.md` | Manual-only cases documented |

### Human role

- Directed dedicated test database — **rejected** tests running against development DB
- Required test case IDs mapped to `test-strategy.md` (not ad hoc assertions)
- Recorded results in `test-results.md`

### What AI could not replace

- Proof that the state machine is correct (tests are the authority, not AI claims)
- Manual UX verification (focus loss, platform input behavior)
- Production build verification (`npm run build` caught a duplicate export)

---

## Debugging

**AI role:** Diagnose issues, propose fixes, document resolutions.

Ten significant issues were encountered and resolved with AI assistance. Documented in [`debugging-notes.md`](debugging-notes.md):

| # | Area | Resolution |
|---|------|------------|
| 1 | Backend env path wrong | Point `env.js` at `src/backend/.env` |
| 2 | Port 3001 in use | Free port or set `PORT` |
| 3 | `TicketService` bypassed `CommentService` | Layering corrected |
| 4 | Tests used development database | `.env.test` + `NODE_ENV=test` |
| 5 | Incomplete test coverage | Remaining suites per `test-strategy.md` |
| 6 | `asyncHandler` removed prematurely | Re-created when needed |
| 7 | Duplicate `validateCreateComment` export | Removed duplicate in `validation.js` |
| 8 | Comment form not cleared | Form reset on success |
| 9 | Search focus loss | Separate initial vs refresh loading |
| 10 | Unexpected `.` in search | `type="text"` with autocorrect off |

**Human role:** Identified symptoms through review prompts and manual testing; accepted or rejected AI-proposed fixes based on scope and spec compliance.

---

## Review

**AI role:** Spec-compliance reviews after each major milestone.

### Review workflow

```
Implement → Review against approved docs → Identify only required corrections → Fix → Re-review
```

### Review sessions (documented in `code-review-notes.md`)

| Session | Focus | Outcome |
|---------|-------|---------|
| R1 | Phase 1 scaffold | Config issues found; env fix applied |
| R2 | Backend layering | `TicketService` → `CommentService` fix |
| R3 | Backend compliance | Architecture and contract aligned |
| R4 | Ticket List | No required corrections |
| R5 | Frontend UX fixes | Fixes verified, no regressions |
| R6 | Backend test completeness | 54 tests; gaps closed |
| R7 | Full application | **Core approved — no required code corrections** |

### What was rejected during reviews

- Optional refactors and unsolicited redesigns
- Stretch features (auth, pagination, Docker, CI, OpenAPI)
- Frontend-only state machine authority
- Status changes via general `PATCH /api/tickets/:id`

**Human role:** Owned all accept/reject decisions. Reviews constrained to “required corrections only” to prevent scope creep.

---

## Documentation (Phase 5)

**AI role:** Generate lifecycle artifacts from completed implementation; synchronize checklists.

| Artifact | AI contribution |
|----------|-----------------|
| `tool-workflow.md` | Actual AI-assisted workflow narrative |
| `debugging-notes.md` | Issue diagnosis and resolution log |
| `code-review-notes.md` | Review sessions R1–R7, issue register, final outcome |
| `reflection.md` | Implementation decisions and lessons learned |
| `pr-description.md` | PR-style implementation summary |
| `database/setup-notes.md` | Database setup and verification guide |
| `README.md` | Full setup, env, run, and test instructions |
| `ai-prompts/` | 56 prompts organized by lifecycle phase |
| `final-ai-usage-summary.md` | This document |

**Human role:** Directed document accuracy reviews; rejected unsupported claims; synchronized progress checklists against actual implementation.

**Prompts:** 13 — see [`ai-prompts/documentation.md`](ai-prompts/documentation.md)

---

## Human vs AI responsibilities

| Responsibility | Human (candidate) | AI (Cursor) |
|----------------|-------------------|-------------|
| Scope and decisions | Owns all 14 implementation decisions | Drafts from requirements |
| Specification approval | Reviews and approves before coding | Generates and refines docs |
| Architecture | Enforces layering, rejects shortcuts | Implements per `design-notes.md` |
| Code review | Accept/reject all output | Compares code to contracts |
| Testing proof | Requires 54 integration tests green | Generates test suites |
| UX quality | Manual testing, reports issues | Implements frontend fixes |
| Secrets | Never commits credentials | Uses `.env.example` only |
| Submission | Owns final deliverable quality | Accelerates artifact generation |

---

## Acceptance and rejection summary

### Accepted

- Spec-first workflow with phased gates
- Layer-by-layer backend prompts
- Targeted document refinements (not regeneration)
- Integration tests as proof of state machine behavior
- Frontend UX fixes within scope
- AI-assisted compliance reviews

### Changed (human-directed)

- Environment file self-containment (`src/backend/`, `src/frontend/`)
- Test database isolation (`.env.test`, `NODE_ENV=test`)
- Service layering (`TicketService` → `CommentService`)
- Search input type and loading UX
- Comment form reset behavior

### Rejected

- Wholesale spec regeneration
- Auth, user CRUD, and Stretch features
- Optional refactors during review prompts
- AI assertions without test proof
- Status changes on general ticket update endpoint

---

## Effectiveness assessment

### Where AI added the most value

1. **Specification drafting** — Fast, consistent artifacts from assessment requirements
2. **Boilerplate and scaffolding** — Express/React/Jest setup aligned to `design-notes.md`
3. **Repetitive implementation** — Repositories, validators, API client, form components
4. **Compliance reviews** — Comparing code against `api-contract.md` when constrained to required corrections
5. **Documentation** — Lifecycle artifacts and prompt history from completed work

### Where human judgment was essential

1. **Implementation decisions** — 14 decisions recorded before coding
2. **Spec approval gate** — No code until contracts were complete
3. **Layering enforcement** — Caught and fixed service boundary violation
4. **Test environment** — Prevented dev/test database collision
5. **Manual UX testing** — Found focus, input, and form issues invisible to API tests
6. **Scope control** — Repeated “Core only” and “required corrections only” constraints

### Net assessment

Cursor **accelerated execution** without replacing engineering judgment. The specification, review discipline, and integration tests ensured correctness. The most effective pattern was **narrow prompts + human gates + test proof** — not open-ended code generation.

---

## Deliverables map

| Phase | AI-assisted outputs | Human gate |
|-------|---------------------|------------|
| 0 | 8 planning artifacts + refinements | Spec approval before code |
| 1 | Backend/frontend scaffold, Jest, README skeleton | Env fix, cleanup review |
| 2 | Schema, seed, connection pool | Schema verification |
| 3 | Full REST API, 54 integration tests | Layering fix, test env fix |
| 4 | React SPA (4 routes, 6 features) | Manual UX testing |
| 5 | Lifecycle docs, prompt history, this summary | Accuracy review, checklist sync |

---

## Related artifacts

| Document | Content |
|----------|---------|
| [`tool-workflow.md`](tool-workflow.md) | Detailed workflow narrative |
| [`ai-prompts/`](ai-prompts/) | Verbatim prompts and outcomes by phase |
| [`reflection.md`](reflection.md) | Personal lessons learned |
| [`debugging-notes.md`](debugging-notes.md) | Issue log with resolutions |
| [`code-review-notes.md`](code-review-notes.md) | Review sessions and final outcome |
| [`implementation-plan.md`](implementation-plan.md) | Planned AI usage (vs actual, above) |
| [`test-results.md`](test-results.md) | 54/54 integration tests passing |
