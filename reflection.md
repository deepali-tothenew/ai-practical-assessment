# Reflection

Personal reflection on delivering the **Support Ticket Management System (Core)** as part of the AI Capability Exercise, using Cursor for spec-driven, AI-assisted development.

**Candidate:** Deepali Bansal  
**Stack:** React, Node.js, Express, MySQL  
**Assessment period:** 2026-07-16 → 2026-07-19  
**Related artifacts:** `tool-workflow.md`, `debugging-notes.md`, `code-review-notes.md`

---

## What Was Built

A full-stack support ticket application with:

- **Backend:** REST API with layered architecture (routes → controllers → services → repositories), backend-enforced status state machine, server-side search and filter, and structured validation/error responses
- **Frontend:** React SPA with ticket list, create, detail, edit, dedicated status action, and comment flows
- **Database:** MySQL schema and user seed data
- **Tests:** 54 Jest integration tests covering the state machine, CRUD, search/filter, comments, and users
- **Documentation:** Full lifecycle artifacts from requirements through API contract, design notes, test strategy, and workflow documentation

Core scope was delivered without authentication, user CRUD, or Stretch features.

---

## Key Implementation Decisions

These decisions were recorded early and held throughout implementation:

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Backend-enforced state machine** | Status rules are business-critical; frontend cannot be the authority | `statusService` + 54 integration tests prove behavior |
| **Dedicated status endpoint** | Separates lifecycle changes from field edits per spec | `PATCH /api/tickets/:id/status` only; general PATCH rejects `status` |
| **Seeded users only** | Simplifies Core scope; no auth or user management | `GET /api/users` for dropdowns; no write endpoints |
| **Server-side search** | Consistent with backend as source of truth | Debounced `q` + `status` params to `GET /api/tickets` |
| **Layer-by-layer backend build** | Keeps diffs reviewable and enforces separation of concerns | Repositories → services → controllers → validators in sequence |
| **Separate test database** | Prevents test runs from polluting development data | `support_tickets_test` via `.env.test` and `NODE_ENV=test` |
| **Monorepo under `src/`** | Matches assessment structure; clear frontend/backend split | `src/backend`, `src/frontend`, `tests/integration`, `database/` |
| **Self-contained env files** | Each package owns its configuration | `src/backend/.env`, `src/frontend/.env` (Vite) |
| **Status action on Detail only** | Aligns with `ui-flow.md`; edit form excludes status | `StatusAction` component; `TicketForm` has no status field in edit mode |
| **Comments excluded from search** | Explicit business rule in requirements | Repository query joins title/description only; SF-05 test verifies |

Decisions that were **considered and deferred** (Stretch): pagination, sorting, priority/assignee filters, Docker, CI, OpenAPI, authentication.

---

## What Worked Well

### 1. Specification before code

Substantial upfront investment in planning artifacts (`api-contract.md`, `design-notes.md`, `test-strategy.md`, `ui-flow.md`) before writing business logic paid off. When implementation questions arose — for example, whether `createdBy` is mutable on update, or how search handles empty keywords — the answer was already documented. AI-generated code had a clear target to match.

### 2. Narrow, scoped prompts

Prompts like “implement the repository layer only” or “identify only required corrections” kept the AI from over-building. Each phase produced a reviewable diff instead of a monolithic dump that would be hard to validate.

### 3. Review at phase boundaries

Reviewing after scaffold, after backend, after first tests, and after frontend caught issues early:

- Environment file path mismatch (Phase 1)
- Service layering violation (Phase 3)
- Test database isolation (Phase 3)
- UX bugs from manual testing (Phase 4)

Fixing these in isolation was faster than discovering them at submission time.

### 4. Integration tests as proof

The assessment’s emphasis on state machine tests was appropriate. AI can generate plausible transition logic, but only tests prove invalid transitions are rejected and the database is unchanged. Building the status transition suite first, then expanding to full `test-strategy.md` coverage, gave confidence that backend behavior matched the contract.

### 5. Human refinement of AI-generated specs

The first pass of specification documents was useful but not final. Targeted refinement prompts — adding Constraints and Business Rules sections, syncing acceptance criteria, clarifying search trim semantics — improved consistency without regenerating entire files. This mirrors how specs evolve on real projects.

---

## Challenges and How They Were Addressed

### Architecture drift

**Problem:** After backend implementation, review found `TicketService` calling `CommentRepository` directly, bypassing `CommentService`.

**Lesson:** Even with layer-by-layer prompts, cross-service access needs explicit review. AI follows the immediate task (fetch comments for a ticket) without always respecting service boundaries.

**Resolution:** Fix-only prompt; one-line change with architectural significance.

### Test environment confusion

**Problem:** Early integration tests risked running against the development database because `NODE_ENV` was not set consistently and `.env.test` did not exist.

**Lesson:** Test infrastructure is part of the deliverable, not an afterthought. It deserves the same review discipline as application code.

**Resolution:** Dedicated `.env.test`, `NODE_ENV=test` in npm scripts, removal of hardcoded test config.

### Configuration that “looked right” but wasn’t

**Problem:** `src/backend/.env` existed but `env.js` loaded from the repository root. The backend appeared configured but ignored local settings.

**Lesson:** Verify configuration with a runtime check, not just file presence.

**Resolution:** Point `dotenv` at `src/backend/.env`; align `.env.example` locations with actual loading behavior.

### UX issues invisible to API tests

**Problem:** Manual testing revealed search focus loss, unexpected period insertion on macOS, and comment form not resetting — none caught by 54 integration tests.

**Lesson:** Automated API tests validate contracts; they do not replace manual UI walkthrough for interaction quality.

**Resolution:** Targeted frontend fixes without changing API contracts or backend behavior.

### Build vs dev discrepancies

**Problem:** Duplicate `validateCreateComment` in `validation.js` broke `npm run build` while `npm run dev` appeared fine.

**Lesson:** Run production builds during frontend development, not only the dev server.

**Resolution:** Remove duplicate export; add build verification to review checklist.

---

## Lessons Learned

### About AI-assisted development

1. **AI accelerates drafting; humans must validate.** Specs, code, and tests all benefited from AI speed, but every phase needed human review against approved documentation.

2. **Constraints in prompts matter more than model capability.** “Core only,” “do not implement business logic yet,” and “required corrections only” prevented the most common failure modes: scope creep and unsolicited refactors.

3. **AI output should be treated like a junior PR.** Read it, test it, review it against the contract — do not merge because it compiles.

4. **Documentation is a deliverable, not overhead.** `tool-workflow.md`, `debugging-notes.md`, and `code-review-notes.md` capture decisions that would otherwise live only in chat history.

### About technical design

1. **Put business rules in one place.** Centralizing validation in `validationService` and transitions in `statusService` made reviews and tests straightforward.

2. **Separate structural validation from business validation.** Request validators check types and shapes; services enforce enums, user existence, and state machine rules. This avoided duplication without blurring layers.

3. **Frontend state machine mirror is UX, not authority.** `ALLOWED_TRANSITIONS` in `constants.js` pre-filters status buttons, but the backend remains the source of truth. Invalid attempts still show API errors.

4. **Incremental loading states improve UX.** Splitting initial load from list refresh fixed search focus issues without changing API behavior.

### About process

1. **Phase gates reduce rework.** Completing `api-contract.md` and `design-notes.md` before coding prevented mid-implementation contract debates.

2. **Fix-only follow-ups are efficient.** After review identifies a specific issue, narrowing the next prompt to that issue produced minimal, correct diffs.

3. **Track test case IDs explicitly.** Mapping `test-strategy.md` case IDs (SM-V01, CR-03, SF-05) to test files made coverage gaps visible during review.

---

## What I Would Do Differently

| Area | Current approach | Improvement |
|------|------------------|---------------|
| **Prompt history** | Populated under `ai-prompts/` by phase | Log significant prompts incrementally per phase, not at submission |
| **README** | Database setup deferred to Phase 5 | Write DB setup instructions when schema is created, not at submission |
| **Frontend builds** | Build failure found late | Run `npm run build` after each major frontend feature |
| **Manual test checklist** | Ad hoc manual testing | Walk `test-strategy.md` M-01–M-10 checklist systematically before sign-off |
| **Phase 1 cleanup** | Removed `asyncHandler` as unused | Keep thin utilities until the phase that needs them is complete |

None of these represent fundamental process failures — they are refinements for the next project.

---

## AI Tool Assessment (Cursor)

### Strengths observed

- Fast generation of specification artifacts from assessment requirements
- Consistent scaffolding aligned with `design-notes.md` structure
- Effective layer-by-layer backend implementation when prompts were scoped
- Useful compliance reviews when asked to compare code against `api-contract.md`
- Good at targeted edits (“refine only these sections”) without regenerating documents

### Limitations observed

- Occasional architecture shortcuts (direct repository access across services)
- Tendency to suggest optional improvements during reviews unless explicitly constrained
- Cannot replace manual UX testing or production build verification
- Generated code requires the same scrutiny as any other contribution

### How I used Cursor effectively

- As a **drafting partner** for specs and boilerplate
- As a **review assistant** against documented contracts
- As an **implementation accelerator** for repetitive, well-specified layers
- **Not** as an autonomous author — I directed scope, reviewed output, and owned accept/reject decisions

---

## Final State and Confidence

| Dimension | Status |
|-----------|--------|
| Core functional requirements | Met |
| API contract compliance | Verified via review and tests |
| Status state machine | Backend-enforced; 54 tests passing |
| Frontend flows per `ui-flow.md` | Implemented; manual UX issues resolved |
| Integration test coverage | Full `test-strategy.md` automated tier |
| Required code corrections | None remaining |
| Submission documentation | Complete |

I am confident the **Core application** meets the approved specification. The state machine is proven by tests, not assertions. The frontend integrates correctly with the API. Known issues from development were documented and resolved.

All submission artifacts are complete. The Core application meets the approved specification.

---

## Closing Thought

The assessment reinforced that AI-assisted engineering is most effective when treated as **spec-driven collaboration**, not code generation on demand. The valuable output was not just a working app, but a traceable path from requirements → design → implementation → test → review → fix.

The discipline of writing decisions down, reviewing against those decisions, and proving critical behavior with tests mattered more than any single AI capability. Cursor accelerated execution; the specification and review process ensured correctness.
