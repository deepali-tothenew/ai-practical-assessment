# Task Breakdown

> Spec-driven task list. Check off as completed. Do not start implementation until planning artifacts are reviewed.

## Phase 0 — Specification (current)

- [x] Record implementation decisions in `requirements-analysis.md`
- [x] Create `data-model.md`
- [x] Create `ui-flow.md`
- [x] Create `tool-specific/cursor-workflow/project-context.md`
- [x] Create `tool-specific/cursor-workflow/spec.md`
- [x] Sync acceptance criteria (root + cursor-workflow)
- [x] Write `api-contract.md`
- [x] Write `design-notes.md`
- [x] Write `implementation-plan.md`
- [x] Write `test-strategy.md`
- [ ] Write `tool-workflow.md`
- [ ] Finalize `cursor-rules-or-instructions.md`

## Phase 1 — Project Scaffolding

- [x] Initialize Node.js backend project structure
- [x] Initialize React frontend project structure
- [x] Add `.env.example` for MySQL connection
- [x] Configure Jest for integration tests
- [x] Add root `README.md` skeleton

## Phase 2 — Database

- [x] Create MySQL schema/migration script (`database/`)
- [x] Create seed data script (users only)
- [ ] Write `database/setup-notes.md`
- [x] DB connection module in backend (`config/database.js`)

## Phase 3 — Backend API

- [ ] Users: GET list (seeded users)
- [ ] Tickets: CRUD endpoints per `api-contract.md`
- [ ] Tickets: dedicated PATCH status endpoint with state machine
- [ ] Tickets: list with `q` and `status` query params
- [ ] Comments: POST on ticket
- [ ] Input validation and error responses
- [ ] Integration tests — valid status transitions
- [ ] Integration tests — invalid status transitions

## Phase 4 — Frontend

- [ ] Ticket List (search + status filter)
- [ ] Create Ticket form (user dropdowns, priority)
- [ ] Ticket Detail (comments, dedicated status action)
- [ ] Edit Ticket form (no status field)
- [ ] Add comment form
- [ ] Error state handling across flows

## Phase 5 — Documentation & Submission

- [ ] Complete `README.md` setup instructions
- [ ] Run tests; record in `test-results.md`
- [ ] Fill `ai-prompts/` with prompt history
- [ ] Write `debugging-notes.md`, `code-review-notes.md`, `reflection.md`
- [ ] Write `pr-description.md`, `final-ai-usage-summary.md`
- [ ] Replace placeholders in `candidate-info.md`

## Deferred (Stretch — not Phase 1 delivery)

- Authentication
- User CRUD
- Pagination, sorting, extra filters
- Docker / CI / OpenAPI
