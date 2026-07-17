# Design Notes

## Architecture Overview

### System context

A three-tier full-stack application for internal support ticket management. No authentication layer in Core — users are seeded reference data selected via UI dropdowns.

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React SPA)                      │
│  Ticket List │ Create │ Detail │ Edit │ Status │ Comments   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON (REST)
┌──────────────────────────▼──────────────────────────────────┐
│              Node.js + Express API (port 3001)               │
│  Routes → Controllers → Services → Repositories              │
│  Validation │ State Machine │ Error Middleware               │
└──────────────────────────┬──────────────────────────────────┘
                           │ mysql2 (parameterized queries)
┌──────────────────────────▼──────────────────────────────────┐
│                         MySQL                                │
│              users │ tickets │ comments                      │
└─────────────────────────────────────────────────────────────┘
```

### Repository layout

Confirmed monorepo structure (per `implementation-plan.md`):

```
ai-practical-assessment/
  src/
    backend/
      app.js                 # Express app setup
      server.js              # Entry point
      config/                # DB config from env
      routes/                # Route definitions
      controllers/           # Request/response handling
      services/              # Business logic (state machine, validation)
      repositories/          # SQL data access
      middleware/            # Error handler, request validation
      utils/                 # Shared helpers
    frontend/
      src/
        api/                 # API client (fetch wrapper)
        components/          # Reusable UI pieces
        pages/               # Route-level views
        hooks/               # Data-fetching hooks (optional)
        utils/               # Status helpers, constants
  tests/
    integration/             # Jest API + state machine tests
  database/
    schema.sql
    seed.sql
    setup-notes.md
```

### Cross-cutting decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API style | REST, JSON | Matches `spec.md`; simple for Core scope |
| Search location | Server-side | Consistent with persisted data; `ui-flow.md` preference |
| Status authority | Backend state machine | Business rule; frontend mirrors valid options only |
| DB access | `mysql2` connection pool | Standard for Node + MySQL; supports parameterized queries |
| Frontend routing | React Router | Maps cleanly to four views in `ui-flow.md` |
| CORS | Enabled in development | React dev server talks to Express API on separate port |
| Auth | None | Core constraint; users are read-only seed data |

### Runtime ports (local development)

| Service | Default port |
|---------|--------------|
| Express API | 3001 |
| React dev server | 3000 |

These are **default development ports** and can be overridden via environment variables (e.g. `PORT` for the API; frontend dev server port via its own config or env).

The frontend reads the backend API base URL from the `VITE_API_URL` environment variable. This value is configured in the frontend `.env` file and can be changed for different environments without modifying application code.

### Related documents

| Document | Relationship |
|----------|--------------|
| `data-model.md` | Entity definitions and validation rules |
| `ui-flow.md` | Screen flows, loading/empty/error states |
| `api-contract.md` | Endpoint request/response contracts |
| `implementation-plan.md` | Phased delivery sequence |
| `test-strategy.md` | Test plan and cases |

---

## Frontend Design

### View map

| Route (suggested) | Page component | Purpose |
|-------------------|----------------|---------|
| `/` | `TicketListPage` | List, search, status filter |
| `/tickets/new` | `CreateTicketPage` | Create ticket form |
| `/tickets/:id` | `TicketDetailPage` | Detail, status action, comments |
| `/tickets/:id/edit` | `EditTicketPage` | Update fields (no status) |

### Component structure

```
pages/
  TicketListPage.jsx
  CreateTicketPage.jsx
  TicketDetailPage.jsx
  EditTicketPage.jsx

components/
  TicketList.jsx              # Renders ticket rows/cards
  TicketSearchBar.jsx         # Keyword input
  TicketStatusFilter.jsx      # Status dropdown
  TicketForm.jsx              # Shared create/edit fields
  TicketDetailHeader.jsx      # Metadata display
  StatusAction.jsx            # Dedicated status transition control
  CommentList.jsx             # Comments ordered createdAt ASC
  CommentForm.jsx             # Add comment
  UserSelect.jsx              # Seeded user dropdown
  PrioritySelect.jsx          # Low | Medium | High | Critical
  LoadingSpinner.jsx
  EmptyState.jsx
  ErrorBanner.jsx

api/
  client.js                   # fetch wrapper, error parsing
  tickets.js                  # ticket API calls
  users.js                    # user list for dropdowns
  comments.js                 # comment API calls
```

### Data flow

1. **Mount** — Page components fetch data via API client on load.
2. **Search/filter** — Ticket list debounces keyword input (optional) and sends `q` + `status` query params to `GET /api/tickets`. Empty `q` omits text filter.
3. **Mutations** — Create, update, status change, and comment submit call API; on success, navigate or refresh local state.
4. **Comments** — After successful `POST`, append returned comment to list or re-fetch; order preserved (`createdAt` ascending).

### Status action (UI)

`StatusAction` component on `TicketDetailPage` only — **not** on `EditTicketPage`.

- Reads current ticket status.
- Renders only valid next statuses per state machine (UX convenience).
- Calls `PATCH /api/tickets/:id/status` with `{ status: "<target>" }`.
- On error: show `ErrorBanner`; do not update displayed status.
- On success: update ticket state in UI.
- Terminal states (`Closed`, `Cancelled`): hide or disable control.

Frontend transition map (mirrors backend; not authoritative):

```
Open         → [In Progress, Cancelled]
In Progress  → [Resolved, Cancelled]
Resolved     → [Closed]
Closed       → (none)
Cancelled    → (none)
```

### Loading and empty states

Per `ui-flow.md`:

| Context | Behavior |
|---------|----------|
| List loading | `LoadingSpinner` until `GET /api/tickets` resolves |
| Detail loading | `LoadingSpinner` until ticket + comments load |
| Create/update/comment/status submit | Disable submit; show inline loading |
| No tickets | `EmptyState`: "No tickets available" |
| No search matches | `EmptyState`: "No matching search results" |
| No comments | `EmptyState`: "No comments yet" |

### Form fields by view

| Field | Create | Edit | Detail | Comment |
|-------|--------|------|--------|---------|
| Title | ✓ | ✓ | display | — |
| Description | ✓ | ✓ | display | — |
| Priority | ✓ | ✓ | display | — |
| Created By | ✓ (dropdown) | — (immutable) | display | — |
| Assigned To | ✓ (optional) | ✓ (optional) | display | — |
| Status | — | — | dedicated action | — |
| Message | — | — | — | ✓ |

### Out of scope (frontend)

- Login, protected routes, session handling
- User management screens
- Pagination, sorting, priority/assignee filters (Stretch)

---

## Backend Design

### Layered architecture

```
Request
  → Route          # HTTP method + path, param extraction
  → Controller     # Parse body/query; call service; map to HTTP response
  → Service        # Business rules, validation, state machine
  → Repository     # Parameterized SQL — data access and persistence only
  → MySQL
```

The **Repository layer** is responsible only for data access and persistence (queries, inserts, updates). It must not contain business rules or validation logic — those remain in the **Service layer**.

### Route modules

| Module | Endpoints |
|--------|-----------|
| `userRoutes` | `GET /api/users` |
| `ticketRoutes` | `GET/POST /api/tickets`, `GET/PATCH /api/tickets/:id`, `PATCH /api/tickets/:id/status` |
| `commentRoutes` | `POST /api/tickets/:id/comments` |

Mount all under `/api`. See `api-contract.md` for full contracts.

### Service layer

| Service | Responsibility |
|---------|----------------|
| `userService` | List seeded users |
| `ticketService` | CRUD, search/filter, orchestration |
| `commentService` | Create comment; verify ticket exists |
| `statusService` | **State machine** — `canTransition(from, to)`, `transition(ticketId, toStatus)` |
| `validationService` | Shared field validation (priority enum, user FK checks) |

### State machine module (`statusService`)

Isolated transition map — single source of truth on the backend:

```javascript
const ALLOWED_TRANSITIONS = {
  'Open':         ['In Progress', 'Cancelled'],
  'In Progress':  ['Resolved', 'Cancelled'],
  'Resolved':     ['Closed'],
  'Closed':       [],
  'Cancelled':    [],
};
```

`transition(ticketId, targetStatus)`:

1. Load ticket; return 404 if missing.
2. Check `canTransition(current, target)`; return 400 if invalid.
3. Update status in DB; return updated ticket.

**Not accepted via `PATCH /api/tickets/:id`:** any `status` field in request body is ignored or rejected.

### Ticket update whitelist

`PATCH /api/tickets/:id` accepts only:

- `title`
- `description`
- `priority`
- `assignedTo` (nullable)

Explicitly **excluded:** `status`, `createdBy`, `createdAt`.

### Search implementation

`GET /api/tickets?q=&status=` — search input is **trimmed** before processing (in the Service or Controller layer before calling the Repository).

- If `q` is empty or whitespace after trim → no text filter.
- If `q` present → case-insensitive match via `WHERE (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)` with parameterized `%q%`. Search is case-insensitive for matching only — **stored data is never modified**.
- If `status` present → `AND status = ?`.
- Comments table is **not** joined for search.

The Repository executes the parameterized query; filter rules and trimmed values are prepared in the Service layer.

### User endpoints

`GET /api/users` — read-only list for dropdowns. No create/update/delete routes in Core.

### Concurrency

Per `requirements-analysis.md` edge case: concurrent status updates use **last write wins**. No optimistic locking in Core.

---

## Database Design

### Schema summary

Aligned with `data-model.md`. Table names: `users`, `tickets`, `comments`.

#### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| name | VARCHAR(255) NOT NULL | |
| email | VARCHAR(255) NOT NULL UNIQUE | |
| role | VARCHAR(50) NOT NULL | e.g. Agent, Admin |

#### `tickets`

| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| title | VARCHAR(255) NOT NULL | Searchable |
| description | TEXT NOT NULL | Searchable |
| priority | ENUM('Low','Medium','High','Critical') NOT NULL | |
| status | ENUM('Open','In Progress','Resolved','Closed','Cancelled') NOT NULL DEFAULT 'Open' | |
| assigned_to | INT NULL | FK → users.id, ON DELETE SET NULL |
| created_by | INT NOT NULL | FK → users.id |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

#### `comments`

| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| ticket_id | INT NOT NULL | FK → tickets.id, ON DELETE CASCADE |
| message | TEXT NOT NULL | Excluded from search |
| created_by | INT NOT NULL | FK → users.id |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Order ASC for display |

### Indexes (recommended)

| Index | Column(s) | Purpose |
|-------|-----------|---------|
| PK | id on all tables | Primary access |
| FK | tickets.created_by, tickets.assigned_to | Join efficiency |
| FK | comments.ticket_id | Comment lookup by ticket |
| Optional | tickets.status | Status filter performance |

### Seed data

Scripts in `database/seed.sql`:

- 2–3 users with varied roles
- Sample tickets across all statuses and priorities
- Comments on at least one ticket

### Environment configuration

Use `NODE_ENV` where appropriate (`development`, `test`, `production`) — e.g. test database selection during Jest runs, error detail verbosity, and logging behavior.

`.env.example` (no secrets committed):

```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=support_tickets
PORT=3001
```

`PORT` overrides the default API port (3001). Frontend dev server port is configured separately and is not fixed to 3000 if the scaffold tool or env overrides it.

Test database may use a separate `DB_NAME` (e.g. `support_tickets_test`) — detailed in `test-strategy.md`.

---

## Validation Strategy

Validation is enforced on the **backend** as the authority. Frontend may perform basic required-field checks for UX but must not rely on client-only validation.

### Ticket create (`POST /api/tickets`)

| Field | Rule |
|-------|------|
| title | Required, non-empty string |
| description | Required, non-empty string |
| priority | Required; one of: Low, Medium, High, Critical |
| createdBy | Required; must exist in `users` |
| assignedTo | Optional; if provided, must exist in `users` |
| status | Not accepted from client; defaults to `Open` |

### Ticket update (`PATCH /api/tickets/:id`)

| Field | Rule |
|-------|------|
| title | If provided, non-empty |
| description | If provided, non-empty |
| priority | If provided, valid enum value |
| assignedTo | If provided, valid user id or null to unassign |
| createdBy | **Rejected / ignored** — immutable |
| status | **Rejected / ignored** — use status endpoint |

### Status transition (`PATCH /api/tickets/:id/status`)

| Field | Rule |
|-------|------|
| status | Required; valid enum; transition must be allowed by state machine |

### Comment create (`POST /api/tickets/:id/comments`)

| Field | Rule |
|-------|------|
| message | Required, non-empty string |
| createdBy | Required; must exist in `users` |
| ticketId | From URL; ticket must exist (404 otherwise) |

### Search query params

| Param | Rule |
|-------|------|
| q | Optional; if empty, no keyword filter |
| status | Optional; if provided, must be valid status enum |

### Implementation approach

- **Repository layer:** parameterized queries only (no string concatenation of user input).
- **Service layer:** business rule checks before write operations.
- **Controller layer:** map validation failures to HTTP 400 with structured error body.

---

## Error Handling Strategy

### API error response format

Consistent JSON shape across endpoints:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [
      { "field": "priority", "message": "Invalid priority value" }
    ]
  }
}
```

`details` is optional; include when field-level errors apply.

### HTTP status code mapping

| Situation | Status | Example |
|-----------|--------|---------|
| Success (read) | 200 | GET ticket |
| Success (create) | 201 | POST ticket, POST comment |
| Success (update) | 200 | PATCH ticket, PATCH status |
| Validation failure | 400 | Missing title, invalid priority, invalid transition |
| Not found | 404 | Ticket/user id does not exist |
| Server error | 500 | Unexpected DB or runtime failure |

### Error codes (suggested)

| Code | When |
|------|------|
| `VALIDATION_ERROR` | Missing or invalid field values |
| `INVALID_TRANSITION` | Status change violates state machine |
| `NOT_FOUND` | Resource does not exist |
| `INTERNAL_ERROR` | Unhandled server error |

### Express error middleware

- Central `errorHandler` middleware catches thrown/forwarded errors.
- **Unhandled promise rejections** and unexpected server errors result in an **HTTP 500** response with code `INTERNAL_ERROR`; they are **logged appropriately** (server-side) with enough context for debugging.
- Logs server errors internally; returns safe message to client (no stack traces in production response).
- Controllers use `try/catch` or async wrapper; pass errors to `next(err)`.

### Frontend error handling

| API result | UI behavior |
|------------|-------------|
| 400 validation | Show `ErrorBanner` or inline field errors from `details` |
| 400 invalid transition | Show message on status action; status unchanged |
| 404 ticket | Redirect to list with message or not-found view |
| Network failure | Generic error with retry where appropriate |
| 500 | Generic "something went wrong" message |

Per `ui-flow.md`, all mutation flows disable submit during request and re-enable on completion (success or error).

---

## Testing Strategy Link

Detailed test cases, fixtures, and coverage boundaries are defined in **`test-strategy.md`**.

### Core testing scope (summary)

| Tier | Scope | Framework |
|------|-------|-----------|
| Integration (mandatory) | Status state machine — valid transitions succeed; invalid transitions rejected; DB state verified | Jest + HTTP client against test API |
| Manual | Full UI flows per `acceptance-criteria.md` | Browser |

### State machine test focus

Integration tests must cover at minimum:

- Open → In Progress ✓
- In Progress → Resolved ✓
- Resolved → Closed ✓
- Open → Cancelled ✓
- In Progress → Cancelled ✓
- Open → Closed ✗ (rejected, status unchanged)
- Closed → In Progress ✗ (rejected)
- Resolved → Cancelled ✗ (rejected)

Results recorded in `test-results.md` after test runs.

### What Core does not require

- Unit tests for every component (Stretch evidence)
- E2E browser automation (optional; manual walkthrough sufficient for Core)
- Auth or authorization tests (out of scope)

---

## Design constraints checklist

Quick reference to ensure implementation stays aligned:

- [ ] React frontend, Node.js + Express backend, MySQL database
- [ ] No authentication or user management
- [ ] Status changes only via `PATCH /api/tickets/:id/status`
- [ ] Backend state machine is source of truth
- [ ] Search: title + description only, case-insensitive, server-side
- [ ] Comments: `createdAt` ascending; excluded from search
- [ ] Priority: Low, Medium, High, Critical
- [ ] `assignedTo` optional; `createdBy` immutable after create
- [ ] 404 for missing ticket on view, update, and status change
- [ ] Parameterized SQL; no secrets in repository
