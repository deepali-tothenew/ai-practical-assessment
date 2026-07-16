# Acceptance Criteria

## Core — Ticket CRUD

- [ ] A user can create a ticket via the UI with title, description, priority, created-by, and optional assignee.
- [ ] A user can view all tickets loaded from the database.
- [ ] A user can open a ticket detail view showing ticket fields and comments.
- [ ] A user can update ticket fields (title, description, priority, assignee) via the edit flow — not status.
- [ ] A user can add comments to a ticket from the detail view.

## Core — Status State Machine

- [ ] Status changes use a dedicated UI action, separate from the ticket edit form.
- [ ] Valid transitions succeed: Open → In Progress; In Progress → Resolved; Resolved → Closed; Open → Cancelled; In Progress → Cancelled.
- [ ] Invalid transitions are rejected by the backend with a clear error response.
- [ ] The frontend handles rejected transitions with a meaningful error state (no silent failure).

## Core — Search and Filter

- [ ] Keyword search matches ticket title and description only (comments excluded).
- [ ] Search is case-insensitive.
- [ ] Empty search returns all tickets.
- [ ] Status filter narrows the ticket list by selected status.
- [ ] Search and filter can be used together.

## Core — Comments

- [ ] Newly added comments appear immediately after successful submission.
- [ ] Comments are displayed in chronological order (createdAt ascending).

## Core — Users

- [ ] Seeded users appear in Created By and Assigned To dropdowns.
- [ ] No user-management UI (create, edit, delete users).
- [ ] Optional assignee may be left empty; when set, must be a valid seeded user.

## Core — Priority

- [ ] Priority accepts only: Low, Medium, High, Critical.

## Validation

- [ ] Backend validates required fields on create and update.
- [ ] Backend rejects invalid priority values.
- [ ] Backend rejects invalid assignee references.
- [ ] Backend rejects invalid status transitions.
- [ ] Invalid input never persists to the database.

## Error Handling

- [ ] API returns appropriate HTTP status codes and error messages for validation failures.
- [ ] UI displays meaningful error states for failed operations (create, update, status change, comment).

## Not Found

- [ ] Viewing a non-existent ticket returns HTTP 404.
- [ ] Updating a non-existent ticket returns HTTP 404.
- [ ] Changing the status of a non-existent ticket returns HTTP 404.

## Data Persistence

- [ ] MySQL stores users, tickets, and comments.
- [ ] Migration/schema scripts and seed data are provided under `database/`.
- [ ] Data remains available after application restart.

## Testing

- [ ] Jest integration tests prove valid status transitions succeed.
- [ ] Jest integration tests prove invalid status transitions are rejected.
- [ ] Test results documented in `test-results.md`.

## Documentation

- [ ] README includes local setup and run instructions.
- [ ] Environment variable example provided (no secrets in repo).
- [ ] All required lifecycle artifacts present in repository structure.
- [ ] Prompt history captured under `ai-prompts/`.
- [ ] `data-model.md` and `ui-flow.md` completed.

## Out of Scope (Core — confirmed)

- [ ] Authentication / authorization — not implemented.
- [ ] User CRUD — not implemented.
- [ ] Stretch features (pagination, Docker, CI, OpenAPI, etc.) — deferred.
