# UI Flow

## Application Views

1. **Ticket List** — primary landing view
2. **Create Ticket** — form to add a new ticket
3. **Ticket Detail** — full ticket view with comments and actions
4. **Edit Ticket** — update ticket fields (excludes status)

No login screen, user profile, or user-management views in Core.

## Ticket List Flow

```
[Landing / Ticket List]
  ├── Search box (keyword → title + description)
  ├── Status filter dropdown (All | Open | In Progress | …)
  ├── [Create Ticket] button → Create Ticket form
  └── Click row/card → Ticket Detail
```

**Display per ticket (suggested):** title, status, priority, assignee name (or "Unassigned"), created-by, updated date.

**Loading:** Show a loading indicator while tickets are being fetched.

**Empty states:**
- No tickets in database → "No tickets available"
- Search/filter returns no matches → "No matching search results"

## Create Ticket Flow

```
[Create Ticket Form]
  Fields:
    - Title (required)
    - Description (required)
    - Priority (required) — Low | Medium | High | Critical
    - Created By (required) — dropdown of seeded users
    - Assigned To (optional) — dropdown of seeded users + empty option
  Actions:
    - Submit → POST ticket → success → Ticket Detail or List
    - Cancel → return to List
  Errors:
    - Show API validation errors inline or as banner

  Loading:
    - Disable submit / show loading indicator while create request is in progress
```

## Ticket Detail Flow

```
[Ticket Detail]
  Sections:
    - Ticket metadata (title, description, status, priority, assignee, created-by, dates)
    - Status action (dedicated control — see below)
    - Comments list (chronological, createdAt ascending)
    - Add comment form

  Loading:
    - Show loading indicator while ticket details and comments are being fetched

  Empty state:
    - No comments yet → "No comments yet"

  Actions:
    - [Edit Ticket] → Edit Ticket form (fields only, no status)
    - Status change control → see Status Change Flow
    - Add comment → POST comment → refresh comments
    - Back to List
```

## Edit Ticket Flow

```
[Edit Ticket Form]
  Editable fields:
    - Title, Description, Priority, Assigned To
  NOT editable here:
    - Status (use dedicated status action on Detail view)
    - Created By (immutable after create)
  Actions:
    - Save → PATCH/PUT ticket → success → Ticket Detail
    - Cancel → Ticket Detail
  Errors:
    - Validation errors from backend displayed clearly

  Loading:
    - Disable save / show loading indicator while update request is in progress
```

## Status Change Flow (Dedicated Action)

Status is **not** changed through the Edit Ticket form. It uses a separate control on the Ticket Detail view.

```
[Ticket Detail — Status Action]
  Current status displayed prominently.

  UI shows only valid next statuses for current state:
    Open         → buttons/options: "In Progress", "Cancelled"
    In Progress  → buttons/options: "Resolved", "Cancelled"
    Resolved     → button/option: "Closed"
    Closed       → no transitions (control disabled or hidden)
    Cancelled    → no transitions (control disabled or hidden)

  On select:
    → PATCH dedicated status endpoint
    → Success: refresh detail, update displayed status
    → Failure (invalid transition): show error message, status unchanged in UI

  Loading:
    - Disable status action / show loading indicator while transition request is in progress
```

**Principle:** Backend is source of truth. Frontend may pre-filter valid options, but invalid attempts must still be handled gracefully if the API rejects them.

## Comment Flow

```
[Ticket Detail — Add Comment]
  Fields:
    - Message (required)
    - Created By (required) — dropdown of seeded users
  Submit → POST comment → append to list or refresh; newly added comment appears immediately
  Errors → display validation message

  Loading:
    - Disable submit / show loading indicator while comment request is in progress
```

## Search and Filter Interaction

- Keyword and status filter apply together (AND logic).
- Empty keyword = no text filter applied (returns all tickets, subject to status filter).
- Search is case-insensitive on title and description.
- Changing filter/search refreshes the list (client-side or server-side — to be decided in implementation; server-side preferred for consistency).

## Error States (UI)

| Scenario                    | Expected UI behavior                                      |
|-----------------------------|-----------------------------------------------------------|
| Required field missing      | Inline or form-level error before/at submit               |
| Invalid status transition   | Banner or inline error on status action; status unchanged |
| Network / server error      | Generic error message with retry option where sensible    |
| Ticket not found            | Redirect to list with message or dedicated not-found view |

## Loading States (Summary)

| Action              | Loading behavior                                      |
|---------------------|-------------------------------------------------------|
| Load ticket list    | Loading indicator until list data arrives             |
| Load ticket details | Loading indicator until ticket and comments arrive    |
| Create ticket       | Submit disabled / loading indicator during request    |
| Update ticket       | Save disabled / loading indicator during request      |
| Add comment         | Submit disabled / loading indicator during request    |
| Change status       | Status action disabled / loading indicator during request |

## Empty States (Summary)

| Context                  | Message                      |
|--------------------------|------------------------------|
| No tickets in database   | "No tickets available"       |
| No search/filter matches | "No matching search results" |
| No comments on ticket    | "No comments yet"            |

## Out of Scope (UI)

- Login / logout
- User CRUD screens
- Pagination, sorting beyond Core list (Stretch)
- Filter by priority or assignee (Stretch)
