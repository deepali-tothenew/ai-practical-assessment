# AI-Assisted Workflow

Documentation of the **actual** Cursor-assisted workflow used to deliver the Support Ticket Management System (Core) for the AI Capability Exercise.

**Primary tool:** Cursor (Agent mode)  
**Approach:** Specification-driven development — documents and rules before code  
**Repository:** `ai-practical-assessment`  
**Assessment period:** 2026-07-16 → 2026-07-19

---

## Overview

The project was delivered in deliberate phases aligned with `implementation-plan.md`. Cursor was used as an implementation and review partner, not as an autonomous author. The candidate retained control through:

- Explicit scope constraints in every prompt (e.g. “do not implement business logic yet”, “only required corrections”)
- Human review of all specification documents before coding began
- Layer-by-layer backend construction (repository → service → controller → validation → tests)
- Spec-compliance reviews after major milestones
- Manual testing feedback loop before final sign-off

The workflow demonstrates **spec → scaffold → layered implementation → tests → frontend → review → fix** rather than one-shot code generation.

---

## Guiding Principles

| Principle | How it was applied |
|-----------|-------------------|
| Spec before code | No application features until `api-contract.md` and `design-notes.md` were complete |
| Narrow prompts | Each implementation prompt targeted one layer or one view |
| Human owns decisions | Candidate reviewed specs, rejected scope creep, directed refinements |
| Backend authority | State machine and validation enforced server-side; tests prove behavior |
| Review against docs | Repeated “identify only required corrections” reviews against approved artifacts |
| No secrets | `.env.example` only; credentials never pasted into prompts |

Persistent context was maintained in:

- `tool-specific/cursor-workflow/project-context.md`
- `tool-specific/cursor-workflow/spec.md`
- `tool-specific/cursor-workflow/cursor-rules-or-instructions.md`
- Root specification artifacts (`requirements-analysis.md`, `data-model.md`, `ui-flow.md`, etc.)

---

## Phase 0 — Specification and Planning

### What happened

1. **Assessment intake** — Cursor read the assessment brief. No code was generated. The agent summarized requirements, deliverables, repository structure, and ambiguities.
2. **Initial specs** — Cursor generated foundational artifacts: `requirements-analysis.md`, `data-model.md`, `ui-flow.md`, `candidate-info.md`, and Cursor-specific copies under `tool-specific/cursor-workflow/`.
3. **Human refinement** — The candidate manually reviewed specs and issued a structured refinement prompt. Cursor applied **targeted edits only** (Constraints, Business Rules, acceptance-criteria sync, cross-document consistency). Documents were not regenerated wholesale.
4. **Planning artifacts** — Cursor generated, in sequence:
   - `implementation-plan.md`
   - `design-notes.md`
   - `api-contract.md`
   - `test-strategy.md`
5. **Design-notes refinement** — Candidate directed a second targeted update (search trim semantics, repository vs service responsibilities, error handling, `NODE_ENV` configuration).

### AI role

Drafting, consistency checking, and cross-referencing between documents.

### Human role

Final approval of business rules, scope boundaries, and implementation decisions before any code.

### Checkpoint

Phase 0 complete when all planning documents existed and were internally consistent. **No application code until this gate passed.**

---

## Phase 1 — Project Scaffolding

### What happened

1. **Backend scaffold** — Express app with health endpoint, middleware, env loading, and folder structure. Explicitly **no** business logic.
2. **Frontend scaffold** — React (Vite) app with health-check page verifying backend connectivity.
3. **Scaffold review** — Cursor reviewed setup against `implementation-plan.md`, `design-notes.md`, `api-contract.md`, and `test-strategy.md`. Findings were configuration-only.
4. **Env fix** — Candidate directed env self-containment: backend loads `src/backend/.env`; frontend uses `src/frontend/.env` (Vite default).
5. **Jest setup** — Root test runner, `tests/integration/` structure, README skeleton.
6. **Cleanup** — Non-functional tidy-up (redundant files, unused setup code).

### Prompt pattern

> “Using the existing project specification… generate [X] only. Do not implement [excluded scope].”

### Outcome

Backend and frontend start locally; Jest runs with zero tests; environment configuration matches design notes.

---

## Phase 2 — Database

### What happened

1. **`database/schema.sql`** — Generated from `data-model.md` (users, tickets, comments, FKs, indexes).
2. **`database/seed.sql`** — Users only, per spec.
3. **Database infrastructure** — MySQL connection pool, initialization, graceful shutdown, startup error handling in `src/backend/config/database.js`.

### AI role

Translate approved data model into SQL and connection module.

### Human role

Verify schema matches enums, immutability rules, and relationships in `data-model.md`.

---

## Phase 3 — Backend API

### Layered implementation

The backend was built **one layer at a time**, each prompt referencing approved documentation:

| Step | Prompt focus | Output |
|------|--------------|--------|
| 1 | Repository layer only | `repositories/` — SQL and persistence only |
| 2 | Service layer only | `services/` — business rules, validation, state machine |
| 3 | Controller layer only | `controllers/` — thin HTTP handlers |
| 4 | Request validation | `validators/` — structural validation per `api-contract.md` |

This sequencing prevented controllers from accumulating business logic and kept SQL out of services.

### Reviews and corrections

1. **Backend code review** — Cursor reviewed architecture against `api-contract.md` and `design-notes.md`.
2. **Layering fix** — Review identified `TicketService` calling `CommentRepository` directly. Candidate issued a fix-only prompt; `TicketService` now uses `CommentService`.
3. **First integration tests** — Status transition suite only (SM-V, SM-I cases).
4. **Test environment refinement** — Candidate directed `.env.test` usage, `NODE_ENV=test` in Jest scripts, removal of hardcoded test env vars.
5. **Full backend review** — Confirmed compliance; gaps were test coverage, not application code.
6. **Remaining integration tests** — All cases from `test-strategy.md` implemented (54 tests total).

### Validation discipline

- State machine logic isolated in `statusService.js`
- Status rejected on general `PATCH /api/tickets/:id`
- `createdBy` / `createdAt` immutable on update
- Search trimmed and case-insensitive in service layer; comments excluded
- Integration tests are the proof layer — not AI assertions

### Outcome

All 7 API endpoints implemented. **54/54 integration tests passing.** Results recorded in `test-results.md`.

---

## Phase 4 — Frontend

### What happened

Implementation followed `ui-flow.md` and `design-notes.md` in feature order:

| Step | Feature | Key spec references |
|------|---------|---------------------|
| 1 | API client layer | `api-contract.md` — `client.js`, `tickets.js`, `users.js`, `comments.js` |
| 2 | Ticket List | Search, status filter, loading/empty states, server-side `q` + `status` |
| 3 | Create Ticket | Form, user/priority dropdowns, validation, navigate on success |
| 4 | Ticket Detail | Metadata, comments (chronological), status action, add comment |
| 5 | Edit Ticket | Editable fields only; `createdBy` read-only; no status field |
| 6 | Status action | Dedicated control; valid transitions only; error on API rejection |
| 7 | Comments | Immediate append; form loading state |

React Router routes: `/`, `/tickets/new`, `/tickets/:id`, `/tickets/:id/edit`.

### Reviews

- **Ticket List review** — Verified against `ui-flow.md`; no required corrections.
- **Manual testing fixes** — Candidate reported UX issues; Cursor fixed:
  - Comment form reset after successful submit
  - Search field focus loss (removed disable-during-load behavior)
  - Unexpected `.` in search (`type="search"` → `type="text"` with autocorrect off)
  - Non-functional UI polish (header, focus styles, refresh indicator)
- **Frontend change review** — Confirmed fixes without regressions.

### Frontend ↔ API integration

- `VITE_API_URL` points to backend (`http://localhost:3001`)
- `ApiError` parses contract error shape (`code`, `message`, `details`)
- Response shapes match contract (e.g. `{ tickets }`, `{ ticket, comments }`, `{ comment }`)
- No business logic duplicated beyond client-side form validation for UX

---

## Phase 5 — Verification (complete)

### Completed

| Activity | Result |
|----------|--------|
| Full application review | Frontend, backend, API integration, UI — **no required corrections** |
| Integration test run | 54 passed |
| `test-results.md` | Documented |
| `README.md` | Full setup, database, env, run, and test instructions |
| `database/setup-notes.md` | Database setup and verification guide |
| `debugging-notes.md`, `code-review-notes.md`, `reflection.md`, `pr-description.md` | Process and review documentation complete |
| `final-ai-usage-summary.md` | AI usage summary across planning through submission |
| Acceptance criteria (Core) | All items verified |
| `ai-prompts/` | 56 prompts organized by lifecycle phase (`planning.md` through `documentation.md`) |

All Phase 5 submission artifacts are complete.

---

## Review Workflow

A consistent review pattern was used throughout:

```
Implement → Review against approved docs → Identify only required corrections → Fix → Re-review
```

Review prompts explicitly excluded optional improvements and refactoring. This kept the AI focused on spec compliance rather than unsolicited redesign.

**Example review areas:**

- Architecture layering (routes → controllers → services → repositories)
- API contract alignment (methods, status codes, response shapes)
- Business rules (state machine, search scope, immutability)
- UI flows (loading, empty, error states)
- Test coverage vs `test-strategy.md`

---

## Human Interventions (Accepted / Rejected / Changed)

| Topic | Decision |
|-------|----------|
| Spec regeneration | **Rejected** — targeted refinements only |
| Scope (auth, user CRUD, Stretch) | **Rejected** — Core only throughout |
| Backend layering | **Changed** — `TicketService` must use `CommentService` |
| Test DB configuration | **Changed** — dedicated `.env.test`, `NODE_ENV=test` in scripts |
| Env file location | **Changed** — self-contained under `src/backend/` and `src/frontend/` |
| Search input `type="search"` | **Changed** — `type="text"` after manual testing on macOS |
| List loading UX | **Changed** — separate initial load from refresh to preserve focus |
| AI-suggested refactors | **Rejected** unless required for spec compliance |

---

## Prompt Patterns That Worked

### 1. Scoped implementation

> “Implement the [layer/feature] only. Use the approved project documentation. Do not [excluded scope].”

Prevents scope creep and keeps diffs reviewable.

### 2. Spec-targeted generation

> “Generate [artifact] based on [source documents]. Ensure consistency with [related docs].”

Used for `api-contract.md`, `test-strategy.md`, `schema.sql`.

### 3. Correction-only review

> “Identify only required corrections. Ignore optional improvements.”

Forces compliance checking over open-ended critique.

### 4. Fix-only follow-up

> “Fix only the layering issue…” / “Fix the environment configuration only…”

Narrows AI changes to a single known problem.

### 5. Manual-test-driven fix

> “Address the issues found during manual testing. Do not modify business logic, API contracts, or backend behavior.”

Separates UX fixes from contract changes.

---

## Context Provided to Cursor

At implementation time, the agent was directed to read:

| Document | When used |
|----------|-----------|
| `project-context.md` | Every session — stack, scope, decisions |
| `cursor-rules-or-instructions.md` | Non-negotiable business rules |
| `api-contract.md` | Backend endpoints, frontend API layer |
| `ui-flow.md` | Frontend views and states |
| `design-notes.md` | Architecture, layering, component structure |
| `test-strategy.md` | Integration test cases |
| `acceptance-criteria.md` | Definition of done |

---

## Risks and Mitigations (Observed)

| Risk | Mitigation applied |
|------|-------------------|
| Frontend-only state machine | Backend `statusService` + integration tests first |
| Status via general PATCH | Explicit rejection in service; SU integration tests |
| AI scope creep | Repeated “Core only” constraints; review prompts |
| Layer violations | Layer-by-layer prompts; explicit layering fix |
| Test/dev DB collision | Separate `support_tickets_test` via `.env.test` |
| Unreviewed AI output | Mandatory review prompts after each phase |
| Shallow documentation | Lifecycle artifacts maintained alongside code |

---

## Deliverables Map

| Phase | Primary outputs |
|-------|-----------------|
| 0 | `requirements-analysis.md`, `data-model.md`, `ui-flow.md`, `api-contract.md`, `design-notes.md`, `test-strategy.md`, `implementation-plan.md` |
| 1 | `src/backend/`, `src/frontend/`, Jest harness, README skeleton |
| 2 | `database/schema.sql`, `database/seed.sql`, DB connection module |
| 3 | Full REST API, 54 integration tests, `test-results.md` |
| 4 | React SPA — list, create, detail, edit, status, comments |
| 5 | `tool-workflow.md`, `README.md`, `database/setup-notes.md`, `ai-prompts/`, `final-ai-usage-summary.md`, process docs |

---

## Summary

This assessment used Cursor as a **spec-driven implementation assistant** across the full lifecycle:

1. **Plan** — AI drafted specs; human refined and approved them.
2. **Scaffold** — Minimal, reviewable project setup with explicit exclusions.
3. **Build** — Layer-by-layer backend, then feature-by-feature frontend.
4. **Prove** — Integration tests validate business rules independently of AI claims.
5. **Review** — Repeated compliance checks against approved documentation.
6. **Fix** — Manual testing surfaced real UX issues; fixes stayed within scope.

The workflow’s strength was **constraint and sequencing**: narrow prompts, human gates between phases, and tests as the source of truth for backend behavior. The candidate’s role was directing scope, reviewing output, and rejecting changes that did not serve the approved specification.

---

## Related Artifacts

- `implementation-plan.md` — Phased delivery plan and AI usage plan
- `tool-specific/cursor-workflow/project-context.md` — Persistent project context
- `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` — Non-negotiable rules for AI sessions
- `tool-specific/cursor-workflow/tasks.md` — Executable task checklist
- `test-results.md` — Automated test evidence
- `ai-prompts/` — Prompt history by lifecycle phase (`planning.md`, `design.md`, `implementation.md`, `testing.md`, `debugging.md`, `code-review.md`, `documentation.md`)
