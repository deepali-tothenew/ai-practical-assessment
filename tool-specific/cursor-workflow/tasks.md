# Task Breakdown

> Spec-driven task list. Check off as completed. Do not start implementation until planning artifacts are reviewed.

## Phase 0 — Specification

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
- [x] Write `tool-workflow.md`
- [x] Finalize `cursor-rules-or-instructions.md`

## Phase 1 — Project Scaffolding

- [x] Initialize Node.js backend project structure
- [x] Initialize React frontend project structure
- [x] Add `.env.example` for MySQL connection
- [x] Configure Jest for integration tests
- [x] Add root `README.md` skeleton

## Phase 2 — Database

- [x] Create MySQL schema/migration script (`database/`)
- [x] Create seed data script (users only)
- [x] Write `database/setup-notes.md`
- [x] DB connection module in backend (`config/database.js`)

## Phase 3 — Backend API

- [x] Users: GET list (seeded users)
- [x] Tickets: CRUD endpoints per `api-contract.md`
- [x] Tickets: dedicated PATCH status endpoint with state machine
- [x] Tickets: list with `q` and `status` query params
- [x] Comments: POST on ticket
- [x] Input validation and error responses
- [x] Integration tests — valid status transitions
- [x] Integration tests — invalid status transitions

## Phase 4 — Frontend

- [x] Ticket List (search + status filter)
- [x] Create Ticket form (user dropdowns, priority)
- [x] Ticket Detail (comments, dedicated status action)
- [x] Edit Ticket form (no status field)
- [x] Add comment form
- [x] Error state handling across flows

## Phase 5 — Documentation & Submission

- [x] Complete `README.md` setup instructions
- [x] Run tests; record in `test-results.md`
- [x] Fill `ai-prompts/` with prompt history
- [x] Write `code-review-notes.md`
- [x] Write `reflection.md`
- [x] Write `debugging-notes.md`
- [x] Write `pr-description.md`
- [x] Write `final-ai-usage-summary.md`
- [x] Complete `candidate-info.md` setup summary

## Deferred (Stretch — not Phase 1 delivery)

- Authentication
- User CRUD
- Pagination, sorting, extra filters
- Docker / CI / OpenAPI
