# Implementation Spec — Support Ticket Management (Core)

## 1. Purpose

Build a small full-stack support ticket application demonstrating spec-driven, AI-assisted engineering. The signature technical requirement is a **backend-enforced status state machine** with integration test coverage.

## 2. Architecture (Target)

```
[React SPA]  ←→  [Node.js + Express REST API]  ←→  [MySQL]
```

- Monorepo `src/` layout (frontend + backend) — confirmed in `design-notes.md`.
- Environment-based DB config via `.env.example` (no secrets committed).

## 3. Data Model

See `data-model.md`. Summary:

- **User** — seeded; id, name, email, role
- **Ticket** — id, title, description, priority, status, assignedTo?, createdBy, timestamps
- **Comment** — id, ticketId, message, createdBy, createdAt

**Priority enum:** Low | Medium | High | Critical

**Status enum:** Open | In Progress | Resolved | Closed | Cancelled

## 4. API Surface (High Level)

Detailed contract in `api-contract.md`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/users` | List seeded users (for dropdowns) |
| GET | `/api/tickets` | List tickets; query: `q`, `status` |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Ticket detail + comments |
| PUT/PATCH | `/api/tickets/:id` | Update fields (no status) |
| PATCH | `/api/tickets/:id/status` | Dedicated status transition |
| POST | `/api/tickets/:id/comments` | Add comment |

## 5. Business Rules

### Status transitions (mandatory)

Only these transitions succeed; all others return an error (4xx):

| Current     | Allowed next                          |
|-------------|---------------------------------------|
| Open        | In Progress, Cancelled                |
| In Progress | Resolved, Cancelled                   |
| Resolved    | Closed                                |

Terminal states: `Closed`, `Cancelled` — no further transitions.

### Search

- Query param `q` matches `title` OR `description` (case-insensitive).
- Comments are **not** searchable.
- Query param `status` filters by exact status value.

### Comments

- Displayed in chronological order (`createdAt` ascending).
- Newly added comments appear immediately after successful submission.

### Validation

- Required on create: title, description, priority, createdBy.
- `assignedTo` optional; if present, user must exist.
- Priority must be one of four values.
- Status changes only via `/status` endpoint with transition validation.

## 6. Frontend Requirements

See `ui-flow.md`. Key points:

- Ticket List with search + status filter
- Create / Edit / Detail views
- **Dedicated status action** on Detail — not in Edit form
- Seeded user dropdowns for createdBy, assignedTo, comment author
- Clear error display for API failures

## 7. Database

- MySQL with migration or schema script in `database/`
- Seed data: users, sample tickets, sample comments
- `database/setup-notes.md` with local setup steps

## 8. Testing (Core)

**Framework:** Jest

**Mandatory tier:** Integration tests for state machine

- Each valid transition: request succeeds, status updated in DB
- Representative invalid transitions: request rejected, status unchanged

Document results in `test-results.md`.

## 9. Repository Artifacts

All paths per assessment brief. Lifecycle docs and `ai-prompts/` filled as work progresses.

## 10. Explicit Non-Goals (Core)

- Authentication / JWT / sessions
- User CRUD
- Pagination, sorting, priority/assignee filters
- Docker, CI, OpenAPI
- Search in comments

## 11. Project Assumptions

Recorded in `requirements-analysis.md` § Assumptions. Do not contradict without updating spec and acceptance criteria.
