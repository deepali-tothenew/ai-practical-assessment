# Pull Request: Support Ticket Management System (Core)

## Summary

Delivers the **Core tier** of the AI Capability Exercise — a full-stack Support Ticket Management System built with React, Node.js/Express, and MySQL. Users can create, view, update, search, filter, comment on, and progress tickets through a **backend-enforced status state machine**.

This PR includes the working application, integration test suite, and full lifecycle documentation produced via spec-driven, AI-assisted development with Cursor.

**Scope:** Core only — no authentication, user CRUD, or Stretch features.

---

## What Was Implemented

### Backend (`src/backend/`)

Layered Express API following `design-notes.md`:

```
Routes → Controllers → Services → Repositories → MySQL
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users` | GET | List seeded users for dropdowns |
| `/api/tickets` | GET | List tickets with `q` and `status` filters |
| `/api/tickets` | POST | Create ticket (status defaults to Open) |
| `/api/tickets/:id` | GET | Ticket detail with comments |
| `/api/tickets/:id` | PATCH | Update fields (not status) |
| `/api/tickets/:id/status` | PATCH | Dedicated status transition |
| `/api/tickets/:id/comments` | POST | Add comment |
| `/health` | GET | Health check |

**Key business rules enforced server-side:**

- Status state machine in `statusService` (Open → In Progress/Cancelled → Resolved → Closed)
- Status rejected on general `PATCH /api/tickets/:id`
- `createdBy` and `createdAt` immutable after create
- Case-insensitive search on title/description only (comments excluded)
- Structured validation errors per `api-contract.md`

### Frontend (`src/frontend/`)

React (Vite) SPA with React Router:

| Route | Page | Features |
|-------|------|----------|
| `/` | Ticket List | Server-side search, status filter, loading/empty states |
| `/tickets/new` | Create Ticket | Form with priority and user dropdowns |
| `/tickets/:id` | Ticket Detail | Metadata, comments, status action, add comment |
| `/tickets/:id/edit` | Edit Ticket | Editable fields only; no status; createdBy read-only |

Shared components: `StatusAction`, `TicketForm`, `CommentForm`, `UserSelect`, `ErrorBanner`, `LoadingSpinner`, `EmptyState`.

API client layer in `src/frontend/src/api/` with `ApiError` parsing aligned to contract error shape.

### Database (`database/`)

- `schema.sql` — `users`, `tickets`, `comments` with FKs and indexes
- `seed.sql` — three seeded users (Agents + Admin)
- Connection pool, initialization, and graceful shutdown in `src/backend/config/database.js`

### Tests (`tests/integration/`)

**54 integration tests passing** (Jest + Supertest + MySQL test database):

| Suite | Coverage |
|-------|----------|
| `ticketStatusTransitions.test.js` | Valid/invalid transitions, edge cases, status isolation |
| `tickets.test.js` | CRUD, validation, 404 handling |
| `searchFilter.test.js` | Keyword search, status filter, AND logic |
| `comments.test.js` | Create comment, ordering, validation |
| `users.test.js` | Seeded user list |

Test environment: `support_tickets_test` via `src/backend/.env.test` and `NODE_ENV=test`.

---

## Documentation Delivered

### Specification and planning (Phase 0)

| Artifact | Description |
|----------|-------------|
| `requirements-analysis.md` | Requirements, constraints, business rules, assumptions |
| `data-model.md` | Entities, fields, relationships, search semantics |
| `ui-flow.md` | Screens, loading/empty/error states, user flows |
| `api-contract.md` | REST endpoint contracts, error shapes, business rules |
| `design-notes.md` | Architecture, layering, frontend/backend design |
| `implementation-plan.md` | Phased delivery plan |
| `test-strategy.md` | Test cases and coverage matrix |
| `acceptance-criteria.md` | Definition of done checklist |
| `tool-specific/cursor-workflow/` | Cursor context, spec, tasks, rules |

### Lifecycle and process (Phase 5)

| Artifact | Description |
|----------|-------------|
| `tool-workflow.md` | AI-assisted development workflow |
| `debugging-notes.md` | Significant issues and resolutions |
| `review-fixes.md` | Review findings, fixes applied, and final verification |
| `code-review-notes.md` | Full review session narrative (R1–R7) |
| `reflection.md` | Implementation decisions and lessons learned |
| `test-results.md` | Automated test run evidence |
| `candidate-info.md` | Candidate metadata and setup summary |
| `README.md` | Setup, database, env, run, and test instructions |
| `database/setup-notes.md` | Detailed database setup and verification |
| `ai-prompts/` | Lifecycle-organized prompt history (`planning.md` through `documentation.md`) |
| `final-ai-usage-summary.md` | AI usage summary across the full lifecycle |

---

## Notable Fixes During Development

| Issue | Resolution |
|-------|------------|
| Backend env loaded from wrong path | `env.js` reads `src/backend/.env` |
| `TicketService` bypassed `CommentService` | Layering corrected per `design-notes.md` |
| Tests used development database | Dedicated `.env.test` + `NODE_ENV=test` |
| Comment form not clearing after submit | Form reset on successful submission |
| Search field lost focus during refresh | Split initial load vs refresh loading states |
| Unexpected `.` in search on macOS | `type="search"` → `type="text"` with autocorrect off |

Details in `debugging-notes.md` and `code-review-notes.md`.

---

## Test Plan

### Automated

```bash
# From repository root — requires MySQL and src/backend/.env.test configured
npm test
```

**Expected:** 5 suites, 54 tests passed.

### Manual verification

Walk Core acceptance criteria per `test-strategy.md` manual checklist (M-01 – M-10):

- [x] Ticket list loads with search and status filter
- [x] Create ticket with validation errors displayed
- [x] Ticket detail shows comments in chronological order
- [x] Edit ticket excludes status and createdBy fields
- [x] Status action shows valid transitions only; errors on invalid attempts
- [x] New comment appears immediately after submit; form clears
- [x] Non-existent ticket shows not-found view
- [x] Seeded users appear in dropdowns

### Build verification

```bash
cd src/frontend && npm run build   # Frontend production build
cd src/backend && node -e "require('./app')"  # Backend loads without error
```

---

## How to Run Locally

See [`README.md`](README.md) and [`database/setup-notes.md`](database/setup-notes.md) for full setup. Summary:

```bash
# Install dependencies
npm install
cd src/backend && npm install
cd src/frontend && npm install

# Configure environment
cp src/backend/.env.example src/backend/.env
cp src/backend/.env.test.example src/backend/.env.test
cp src/frontend/.env.example src/frontend/.env

# Create databases and apply schema/seed (see database/setup-notes.md)
mysql -u <user> -p -e "CREATE DATABASE IF NOT EXISTS support_tickets ..."
mysql -u <user> -p support_tickets < database/schema.sql
mysql -u <user> -p support_tickets < database/seed.sql

# Start services
cd src/backend && npm run dev    # http://localhost:3001
cd src/frontend && npm run dev   # http://localhost:3000

# Run tests (from repository root)
npm test
```

---

## Out of Scope (Confirmed Deferred)

- Authentication / authorization
- User CRUD
- Pagination, sorting, priority/assignee filters
- Docker, CI/CD, OpenAPI
- E2E browser automation

---

## Submission Status

All Core application and Phase 5 submission artifacts are complete.

---

## Reviewer Notes

- **State machine is the signature requirement** — proven by integration tests, not UI alone
- **Backend is source of truth** — frontend transition map is UX convenience only
- **No secrets in repo** — `.env.example` only; `.env` and `.env.test` gitignored
- **Spec-driven delivery** — implementation traceable to `api-contract.md`, `ui-flow.md`, and `acceptance-criteria.md`

For full review history, see `code-review-notes.md`. Final application review: **no required code corrections** for Core scope.

---

## Checklist

- [x] Core ticket CRUD implemented
- [x] Backend-enforced status state machine
- [x] Dedicated status endpoint (not general PATCH)
- [x] Search and filter (server-side)
- [x] Comments with chronological display
- [x] Seeded users in dropdowns
- [x] Integration tests (54 passing)
- [x] Lifecycle documentation artifacts
- [x] AI workflow documented
- [x] `ai-prompts/` populated
- [x] README database setup finalized
- [x] Candidate submission metadata complete
