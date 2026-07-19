# Implementation Plan

## Overview

This plan describes how to deliver the **Support Ticket Management System (Core)** for the AI Capability Exercise. The goal is a working React + Node.js + Express + MySQL application with full lifecycle documentation — not just a runnable app, but visible evidence of spec-driven, AI-assisted engineering.

**Primary references:**

| Document | Role in implementation |
|----------|------------------------|
| `requirements-analysis.md` | Functional requirements, constraints, business rules |
| `data-model.md` | Schema, validation, search semantics |
| `ui-flow.md` | Screens, loading/empty/error states |
| `acceptance-criteria.md` | Definition of done |
| `tool-specific/cursor-workflow/spec.md` | API surface, architecture target |
| `tool-specific/cursor-workflow/tasks.md` | Executable task checklist |

**Delivery scope:** Core only. Authentication, user CRUD, and Stretch features are deferred.

**Signature technical focus:** Backend-enforced ticket status state machine with Jest integration tests proving valid and invalid transitions.

**Suggested repository layout:**

```
ai-practical-assessment/
  src/
    backend/          # Express API, services, validation, state machine
    frontend/         # React SPA
  tests/
    integration/      # Jest state-machine tests
  database/
    schema.sql        # or migrations/
    seed.sql
    setup-notes.md
```

Final structure will be confirmed in `design-notes.md` and `api-contract.md` before coding begins.

---

## Task Breakdown

Tasks are grouped by phase. Each phase ends with a verifiable checkpoint mapped to `acceptance-criteria.md`.

### Phase 0 — Complete Planning Artifacts (pre-implementation)

| # | Task | Output | Status |
|---|------|--------|--------|
| 0.1 | Finalize requirement and design specs | `requirements-analysis.md`, `data-model.md`, `ui-flow.md` | Done |
| 0.2 | Write API contract | `api-contract.md` | Done |
| 0.3 | Write architecture and design notes | `design-notes.md` | Done |
| 0.4 | Write test strategy | `test-strategy.md` | Done |
| 0.5 | Write implementation plan | `implementation-plan.md` | Done |
| 0.6 | Document AI workflow | `tool-workflow.md` | Done |

**Checkpoint:** All planning docs reviewed. No application code until `api-contract.md` and `design-notes.md` are complete.

---

### Phase 1 — Project Scaffolding

| # | Task | Details |
|---|------|---------|
| 1.1 | Initialize backend | Node.js + Express; folder under `src/backend/`; health route |
| 1.2 | Initialize frontend | React app under `src/frontend/`; dev proxy or env for API base URL |
| 1.3 | Environment config | `.env.example` with MySQL host, port, user, password, database name |
| 1.4 | Git hygiene | `.gitignore` for `node_modules`, `.env`, build output |
| 1.5 | Jest setup | Integration test harness; test DB config (separate DB or reset strategy) |
| 1.6 | README skeleton | Prerequisites, install, env setup, run commands (filled in Phase 5) |

**Checkpoint:** Backend and frontend start locally; empty API responds; test runner executes (even with zero tests).

**Commit examples:** `chore: scaffold Express backend`, `chore: scaffold React frontend`, `chore: configure Jest for integration tests`

---

### Phase 2 — Database

| # | Task | Details |
|---|------|---------|
| 2.1 | Schema script | `users`, `tickets`, `comments` per `data-model.md`; `INT AUTO_INCREMENT` PKs; FKs; ENUMs for priority and status |
| 2.2 | Seed data | 2–3 users only (no ticket or comment seed data) |
| 2.3 | Setup notes | `database/setup-notes.md` — create DB, run schema, run seed |
| 2.4 | DB connection module | Parameterized queries; connection pool in backend |

**Checkpoint:** Schema and seed run cleanly; seeded data visible in MySQL; data survives restart.

**Commit examples:** `feat: add MySQL schema and seed data`, `feat: add database connection module`

---

### Phase 3 — Backend API

Implement endpoints per `api-contract.md` (to align with `spec.md`):

| # | Endpoint | Task |
|---|----------|------|
| 3.1 | `GET /api/users` | List seeded users for dropdowns |
| 3.2 | `GET /api/tickets` | List with `q` (case-insensitive title/description) and `status` filter; empty `q` returns all |
| 3.3 | `POST /api/tickets` | Create with validation; default status `Open` |
| 3.4 | `GET /api/tickets/:id` | Detail with comments ordered `createdAt` ASC; 404 if missing |
| 3.5 | `PATCH /api/tickets/:id` | Update title, description, priority, assignee only; reject status changes; 404 if missing |
| 3.6 | `PATCH /api/tickets/:id/status` | Dedicated transition endpoint; state machine enforcement; 404 if missing |
| 3.7 | `POST /api/tickets/:id/comments` | Add comment; 404 if ticket missing |

**Supporting tasks:**

| # | Task | Details |
|---|------|---------|
| 3.8 | Validation layer | Required fields, priority enum, user FK checks, immutable `createdBy` on update |
| 3.9 | State machine module | Isolated transition logic; unit-testable; reject invalid transitions with 4xx |
| 3.10 | Error handling middleware | Consistent JSON error responses; appropriate HTTP status codes |
| 3.11 | Integration tests | Jest: all valid transitions succeed; representative invalid transitions rejected and status unchanged |

**Checkpoint:** All API endpoints pass manual smoke tests; state-machine integration tests green; 404 behavior verified.

**Commit examples:** `feat: add ticket list with search and status filter`, `feat: implement status transition state machine`, `test: add state machine integration tests`

---

### Phase 4 — Frontend

Build views per `ui-flow.md`:

| # | View / Feature | Details |
|---|----------------|---------|
| 4.1 | Ticket List | Search box, status filter, loading/empty states, navigate to detail |
| 4.2 | Create Ticket | Form with priority enum, user dropdowns; loading on submit; validation errors |
| 4.3 | Ticket Detail | Metadata, comments (`createdAt` ASC), dedicated status action, add comment form |
| 4.4 | Edit Ticket | Editable fields only (no status, no createdBy); loading on save |
| 4.5 | Status action | Show valid next statuses; call dedicated endpoint; error on invalid transition |
| 4.6 | Comments | Immediate append/refresh after submit; loading on submit |
| 4.7 | Error handling | API errors surfaced across all flows; 404 → redirect/message |
| 4.8 | API client | Centralized fetch layer; consistent error parsing |

**Checkpoint:** Full Core user flows work end-to-end against live API and MySQL; acceptance criteria for UI, search, comments, and status machine met manually.

**Commit examples:** `feat: add ticket list with search and filter`, `feat: add dedicated status transition UI`, `feat: add comment form with immediate display`

---

### Phase 5 — Documentation, Review & Submission

| # | Task | Output | Status |
|---|------|--------|--------|
| 5.1 | Complete README | Full local setup from clean clone | Done |
| 5.2 | Run tests | Record output in `test-results.md` | Done |
| 5.3 | Prompt history | Populate `ai-prompts/` (planning, design, implementation, testing, debugging, code-review, documentation) | Done |
| 5.4 | Debugging notes | `debugging-notes.md` — real issues encountered | Done |
| 5.5 | Code review | `code-review-notes.md` | Done |
| 5.6 | Reflection | `reflection.md`, `final-ai-usage-summary.md` | Done |
| 5.7 | PR description | `pr-description.md` | Done |
| 5.8 | Candidate info | `candidate-info.md` metadata and setup summary | Done |
| 5.9 | Acceptance review | Walk `acceptance-criteria.md` checklist; fix gaps | Done (Core items verified) |
| 5.10 | Database setup notes | `database/setup-notes.md` | Done |

**Checkpoint:** Repository is submission-ready; all mandatory artifacts present; app runs from README instructions.

---

## Milestones

| Milestone | Phase complete | Key deliverable | Acceptance signal |
|-----------|----------------|-----------------|-------------------|
| **M0 — Spec ready** | Phase 0 | `api-contract.md`, `design-notes.md`, `test-strategy.md` | Team can implement without ambiguity |
| **M1 — Runnable skeleton** | Phase 1 | Backend + frontend + Jest scaffold | Both apps start; tests run |
| **M2 — Data layer** | Phase 2 | Schema, seed, setup notes | DB populated; persists across restart |
| **M3 — API complete** | Phase 3 | All endpoints + state machine tests | Integration tests pass |
| **M4 — UI complete** | Phase 4 | All Core views and flows | Manual walkthrough of acceptance criteria |
| **M5 — Submission ready** | Phase 5 | Docs, prompts, reflection | Full checklist green |

**Recommended sequencing:** Phases are sequential (0 → 5). Within Phase 3, implement state machine and its tests before frontend status UI. Within Phase 4, build List → Create → Detail → Edit → Status → Comments.

**Estimated effort (Core):** ~8–12 focused hours on the application; additional time on lifecycle artifacts per assessment guidance.

---

## AI Usage Plan

Cursor is the primary AI tool. Usage follows spec-driven development — documents and rules before code.

### Before implementation

| Activity | AI role | Artifact |
|----------|---------|----------|
| Requirement analysis | Refine understanding, surface edge cases | `requirements-analysis.md` |
| API design | Draft endpoints from data model and business rules | `api-contract.md` |
| Architecture | Propose folder structure, layers, DB access pattern | `design-notes.md` |
| Test planning | Define integration test cases for state machine | `test-strategy.md` |
| Task breakdown | Maintain phased checklist | `tasks.md` |

### During implementation

| Activity | AI role | Prompt capture |
|----------|---------|----------------|
| Scaffolding | Generate project structure; human reviews and trims | `ai-prompts/phase-1-scaffolding.md` |
| State machine | Generate transition logic; **must** be validated against rules manually and by tests | `ai-prompts/phase-3-backend.md` |
| API endpoints | Generate handlers from `api-contract.md`; reject if contract diverges | `ai-prompts/phase-3-backend.md` |
| React components | Generate from `ui-flow.md`; verify loading/empty/error states | `ai-prompts/phase-4-frontend.md` |
| Tests | Generate integration test suites from `test-strategy.md` | `ai-prompts/phase-3-backend.md` |
| Debugging | Investigate failures; document what was accepted vs rejected | `ai-prompts/` + `debugging-notes.md` |
| Code review | AI-assisted review; human owns final decisions | `ai-prompts/` + `code-review-notes.md` |

### Context provided to AI

- `tool-specific/cursor-workflow/project-context.md` — stack, scope, decisions
- `tool-specific/cursor-workflow/spec.md` — implementation spec
- `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` — non-negotiable rules
- Relevant sections of `data-model.md`, `ui-flow.md`, `api-contract.md`

### Validation discipline

- Never merge AI output without reading it.
- Compare generated code against the acceptance criteria before implementation is considered complete.
- State machine and validation logic require test proof, not just AI assertion.
- Reject suggestions that add auth, user CRUD, or Stretch scope.
- Reject status changes on the general update endpoint.
- Update spec docs if implementation reveals a necessary design change.

### Prompt history expectations

Each significant prompt records: prompt text/summary, AI response summary, what was accepted, changed, or rejected, and why. Group by lifecycle phase under `ai-prompts/`.

---

## Risks

| Risk | Impact | Likelihood |
|------|--------|------------|
| State machine implemented only in frontend | Invalid transitions could persist; fails Core acceptance | Medium |
| Status change allowed via general update endpoint | Violates business rules; tests may miss if not targeted | Medium |
| AI generates auth or user CRUD | Scope creep; wasted effort | Medium |
| Shallow prompt history | Weak assessment feedback on AI workflow | High |
| Database setup friction | Reviewer cannot run app from README | Medium |
| Search includes comments | Violates spec; incorrect test expectations | Low |
| `createdBy` editable on update | Violates business rules | Low |
| Secrets committed in `.env` | Security failure; assessment penalty | Low |
| Over-investing in Stretch / UI polish | Lifecycle artifacts incomplete | Medium |
| Integration tests coupled to dev DB | Flaky or destructive test runs | Medium |

---

## Mitigation

| Risk | Mitigation |
|------|------------|
| Frontend-only state machine | Implement `statusService` / transition map in backend first; integration tests before UI |
| Status via update endpoint | Explicitly exclude `status` in PATCH handler; test that direct status update is rejected |
| Scope creep | Enforce `cursor-rules-or-instructions.md`; check every AI suggestion against `acceptance-criteria.md` |
| Shallow prompt history | Log prompts incrementally per phase; do not batch at end |
| DB setup friction | Test README from clean clone; document MySQL version and commands in `database/setup-notes.md` |
| Search scope errors | Implement search in one shared query function; test that comment text does not match |
| `createdBy` mutation | Whitelist updatable fields in PATCH handler; omit `createdBy` from update DTO |
| Secrets exposure | `.env.example` only; verify `.gitignore`; never paste credentials in prompts |
| Artifact neglect | Reserve time in Phase 5; treat docs as deliverables, not afterthoughts |
| Flaky tests | Use dedicated test database or transaction rollback; seed minimal fixtures per test suite |

---

## Definition of Done

The Core implementation is complete when:

1. All items in `acceptance-criteria.md` are satisfied.
2. Jest state-machine integration tests pass and are recorded in `test-results.md`.
3. The application runs locally following `README.md` with MySQL schema and seed applied.
4. Mandatory lifecycle artifacts and `ai-prompts/` are populated.
5. No secrets are committed; Stretch features are not partially introduced.
6. All generated documentation is reviewed for consistency with the project specification.

See `tool-specific/cursor-workflow/tasks.md` for the detailed checkbox list aligned to this plan.
