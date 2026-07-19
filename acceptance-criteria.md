# Acceptance Criteria

## Core — Ticket CRUD

- [x] A user can create a ticket via the UI with title, description, priority, created-by, and optional assignee.
- [x] A user can view all tickets loaded from the database.
- [x] A user can open a ticket detail view showing ticket fields and comments.
- [x] A user can update ticket fields (title, description, priority, assignee) via the edit flow — not status.
- [x] A user can add comments to a ticket from the detail view.

## Core — Status State Machine

- [x] Status changes use a dedicated UI action, separate from the ticket edit form.
- [x] Valid transitions succeed: Open → In Progress; In Progress → Resolved; Resolved → Closed; Open → Cancelled; In Progress → Cancelled.
- [x] Invalid transitions are rejected by the backend with a clear error response.
- [x] The frontend handles rejected transitions with a meaningful error state (no silent failure).

## Core — Search and Filter

- [x] Keyword search matches ticket title and description only (comments excluded).
- [x] Search is case-insensitive.
- [x] Empty search returns all tickets.
- [x] Status filter narrows the ticket list by selected status.
- [x] Search and filter can be used together.

## Core — Comments

- [x] Newly added comments appear immediately after successful submission.
- [x] Comments are displayed in chronological order (createdAt ascending).

## Core — Users

- [x] Seeded users appear in Created By and Assigned To dropdowns.
- [x] No user-management UI (create, edit, delete users).
- [x] Optional assignee may be left empty; when set, must be a valid seeded user.

## Core — Priority

- [x] Priority accepts only: Low, Medium, High, Critical.

## Validation

- [x] Backend validates required fields on create and update.
- [x] Backend rejects invalid priority values.
- [x] Backend rejects invalid assignee references.
- [x] Backend rejects invalid status transitions.
- [x] Invalid input never persists to the database.

## Error Handling

- [x] API returns appropriate HTTP status codes and error messages for validation failures.
- [x] UI displays meaningful error states for failed operations (create, update, status change, comment).

## Not Found

- [x] Viewing a non-existent ticket returns HTTP 404.
- [x] Updating a non-existent ticket returns HTTP 404.
- [x] Changing the status of a non-existent ticket returns HTTP 404.

## Data Persistence

- [x] MySQL stores users, tickets, and comments.
- [x] Migration/schema scripts and seed data are provided under `database/`.
- [x] Data remains available after application restart.

## Testing

- [x] Jest integration tests prove valid status transitions succeed.
- [x] Jest integration tests prove invalid status transitions are rejected.
- [x] Test results documented in `test-results.md`.

## Documentation

- [x] README includes local setup and run instructions.
- [x] Environment variable example provided (no secrets in repo).
- [x] All required lifecycle artifacts present in repository structure.
- [x] Prompt history captured under `ai-prompts/`.
- [x] `data-model.md` and `ui-flow.md` completed.

## Out of Scope (Core — confirmed)

- [x] Authentication / authorization — not implemented.
- [x] User CRUD — not implemented.
- [x] Stretch features (pagination, Docker, CI, OpenAPI, etc.) — deferred.
