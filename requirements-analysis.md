# Requirement Analysis

## Selected Project Option

**Support Ticket Management System** (Core tier only)

A small internal application for managing support tickets. Users create, update, comment on, search, and progress tickets through a defined lifecycle. Stretch features (authentication, user CRUD, pagination, Docker/CI, etc.) are explicitly out of scope for the first delivery.

## My Understanding (in your own words)

The system persists tickets, comments, and seeded users in MySQL. There is no login or user-management UI — users are pre-seeded in the database and selected via dropdowns when creating or editing tickets.

Tickets have a title, description, priority, status, assignee, and creator. Comments are attached to tickets. Users can list all tickets, open a detail view, edit ticket fields (except status via the edit form), change status through a dedicated status-action control, and add comments.

Status changes are the most judgment-heavy part of Core: only specific transitions are allowed, enforced by the backend. Invalid transitions must be rejected with clear errors surfaced in the UI.

Search filters tickets by keyword (title and description only) and by status. All data survives application restart. Backend validation rejects invalid input; the frontend shows meaningful error states.

## Functional Requirements

### Tickets

- Create a ticket with title, description, priority, created-by (seeded user), and optional assignee.
- List all tickets from the database.
- View ticket details including comments (ordered by `createdAt` ascending).
- Update ticket fields: title, description, priority, assignee (not status via this path).
- Change ticket status via a dedicated action, separate from field editing.
- Add comments to a ticket.

### Search and Filter

- Keyword search across ticket **title and description only** (comments excluded; case-insensitive).
- Filter tickets by status.

### Users

- Users exist as seeded records only.
- UI exposes seeded users in dropdowns for **Created By** and **Assigned To**.
- No user management (create, update, delete users) in Core.

### Status State Machine

| From          | Allowed To                    |
|---------------|-------------------------------|
| Open          | In Progress, Cancelled        |
| In Progress   | Resolved, Cancelled           |
| Resolved      | Closed                        |

All other transitions are invalid and must be rejected by the backend.

### Data Persistence

- All entities stored in MySQL.
- Schema/migration scripts and seed data provided.
- Data persists across application restarts.

## Non-Functional Requirements

- README with clear local setup instructions.
- Environment variable example for database configuration (no secrets committed).
- Input validation on the backend; meaningful error handling in the UI.
- Integration tests (Jest) proving state-machine rules.
- Feature-based commits with clear messages.
- Full lifecycle documentation and prompt history in the repository.

## Constraints

- React frontend
- Node.js + Express backend
- MySQL database
- Core scope only
- No authentication
- Seeded users only
- Backend-enforced ticket status state machine
- No user management functionality

## Business Rules

- Ticket status transitions are enforced only by the backend.
- Status cannot be modified through the general ticket update endpoint.
- Status updates are performed through a dedicated status transition endpoint.
- Users are read-only reference data.
- Created By cannot be modified after ticket creation.
- Assigned To is optional.
- Search includes only ticket title and description.
- Comments are ordered by creation time (createdAt ascending).

## Assumptions

| # | Area | Decision |
|---|------|----------|
| 1 | Project option | Support Ticket Management (Core only) |
| 2 | Technology stack | React (frontend), Node.js + Express (backend), MySQL (database) |
| 3 | Database | MySQL with migration/seed scripts and setup notes |
| 4 | User behavior | Seeded users only; dropdowns for Created By and Assigned To; no user-management UI |
| 5 | Status change UX | Dedicated status-change action, separate from ticket field editing; backend is source of truth |
| 6 | Keyword search | Title and description only; comments excluded |
| 7 | Assignee | `assignedTo` is optional; when set, must reference an existing seeded user |
| 8 | Priority values | `Low`, `Medium`, `High`, `Critical` |
| 9 | Acceptance criteria files | Root `acceptance-criteria.md` and `tool-specific/cursor-workflow/acceptance-criteria.md` maintained in sync; Cursor copy serves as persistent AI context |
| 10 | Additional spec docs | `data-model.md` and `ui-flow.md` are required artifacts |
| 11 | Testing | Jest; Core mandates integration tests for the state machine |
| 12 | Candidate metadata | Placeholders in `candidate-info.md` until submission |
| 13 | Git workflow | Feature-based commits with clear messages; no special branching strategy |
| 14 | Scope | Core only for first delivery; Stretch deferred |

## Clarifications (questions for a product owner)

_None outstanding — decisions recorded above were confirmed before specification._

## Edge Cases

- **Invalid status transition:** Backend returns an error; UI shows a clear message without changing displayed status.
- **Missing required fields on create/update:** Backend rejects; UI highlights or displays field-level or form-level errors.
- **Assignee references non-existent user:** Backend rejects invalid foreign key / validation error.
- **Empty search keyword:** Treat as no keyword filter (show all, subject to status filter).
- **Ticket with no assignee:** Allowed — `assignedTo` is optional.
- **Comment on non-existent ticket:** Backend returns 404 or equivalent error.
- **Concurrent status updates:** Last write wins unless otherwise designed; document behavior in implementation.
- **Search with special characters:** Backend should handle safely (parameterized queries).
