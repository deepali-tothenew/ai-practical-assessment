# API Contract

REST API for the Support Ticket Management System (Core). Base URL: `http://localhost:3001/api` (local development).

**Related documents:** `data-model.md`, `design-notes.md`, `acceptance-criteria.md`, `tool-specific/cursor-workflow/spec.md`

**Conventions:**
- Request and response bodies use `application/json`.
- JSON property names use **camelCase** (e.g. `createdBy`, `assignedTo`).
- Timestamps are ISO 8601 strings (e.g. `"2026-07-17T10:30:00.000Z"`).
- No authentication headers required in Core.

---

## Shared Types

### Enums

**Priority:** `Low` | `Medium` | `High` | `Critical`

**Status:** `Open` | `In Progress` | `Resolved` | `Closed` | `Cancelled`

### User (response)

```json
{
  "id": 1,
  "name": "Jane Agent",
  "email": "jane@example.com",
  "role": "Agent"
}
```

### Ticket (response)

```json
{
  "id": 1,
  "title": "Cannot log in",
  "description": "User reports login failure on mobile app.",
  "priority": "High",
  "status": "Open",
  "assignedTo": 2,
  "assignedToUser": {
    "id": 2,
    "name": "Bob Support",
    "email": "bob@example.com",
    "role": "Agent"
  },
  "createdBy": 1,
  "createdByUser": {
    "id": 1,
    "name": "Jane Agent",
    "email": "jane@example.com",
    "role": "Agent"
  },
  "createdAt": "2026-07-17T08:00:00.000Z",
  "updatedAt": "2026-07-17T08:00:00.000Z"
}
```

`assignedTo` is `null` when unassigned. `assignedToUser` is `null` when unassigned. Nested user objects are included for display convenience.

### Comment (response)

```json
{
  "id": 1,
  "ticketId": 1,
  "message": "Investigating the issue.",
  "createdBy": 1,
  "createdByUser": {
    "id": 1,
    "name": "Jane Agent",
    "email": "jane@example.com",
    "role": "Agent"
  },
  "createdAt": "2026-07-17T09:15:00.000Z"
}
```

### Error (response)

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

`details` is optional. Error codes: `VALIDATION_ERROR`, `INVALID_TRANSITION`, `NOT_FOUND`, `INTERNAL_ERROR`.

---

## Business Rules (API)

| Rule | Enforcement |
|------|-------------|
| Status transitions | Backend state machine only via `PATCH /api/tickets/:id/status` |
| Status on general update | `status` field rejected or ignored on `PATCH /api/tickets/:id` |
| Created By | Set on create only; immutable on update |
| Created At | Set on create only; immutable on update |
| Assigned To | Optional; must reference existing user when provided |
| Search scope | `title` and `description` only; case-insensitive; comments excluded |
| Empty search | Omitting `q` or empty/whitespace `q` returns all tickets (subject to `status` filter) |
| Comments order | Returned `createdAt` ascending |
| Users | Read-only; list endpoint only in Core |

### Status state machine

| Current status | Allowed next statuses |
|----------------|----------------------|
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | _(none — terminal)_ |
| Cancelled | _(none — terminal)_ |

All other transitions return **400** with code `INVALID_TRANSITION`. Ticket status in the database must remain unchanged.

---

## Endpoint Index

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/users` | List seeded users |
| GET | `/api/tickets` | List tickets with search and filter |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Get ticket detail with comments |
| PATCH | `/api/tickets/:id` | Update ticket fields (not status) |
| PATCH | `/api/tickets/:id/status` | Transition ticket status |
| POST | `/api/tickets/:id/comments` | Add comment to ticket |

---

## Endpoint: List Users

**Method:** `GET`  
**Path:** `/api/users`  
**Purpose:** Return seeded users for Created By, Assigned To, and comment author dropdowns.

### Request

No body. No query parameters.

### Response `200 OK`

```json
{
  "users": [
    {
      "id": 1,
      "name": "Jane Agent",
      "email": "jane@example.com",
      "role": "Agent"
    }
  ]
}
```

### Validation Rules

_None._

### Error Responses

| Status | Code | When |
|--------|------|------|
| 500 | `INTERNAL_ERROR` | Database or server failure |

**Acceptance criteria:** Seeded users available for dropdowns; no user-management endpoints in Core.

---

## Endpoint: List Tickets

**Method:** `GET`  
**Path:** `/api/tickets`  
**Purpose:** List tickets with optional keyword search and status filter.

### Request

**Query parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | string | No | Case-insensitive keyword; matches `title` OR `description`. Empty or omitted → no text filter. |
| `status` | string | No | Exact status filter. Must be valid status enum if provided. |

**Example:** `GET /api/tickets?q=login&status=Open`

### Response `200 OK`

```json
{
  "tickets": [
    {
      "id": 1,
      "title": "Cannot log in",
      "description": "User reports login failure.",
      "priority": "High",
      "status": "Open",
      "assignedTo": null,
      "assignedToUser": null,
      "createdBy": 1,
      "createdByUser": {
        "id": 1,
        "name": "Jane Agent",
        "email": "jane@example.com",
        "role": "Agent"
      },
      "createdAt": "2026-07-17T08:00:00.000Z",
      "updatedAt": "2026-07-17T08:00:00.000Z"
    }
  ]
}
```

Returns empty array when no tickets match. Comments are **not** included in list response or search.

### Validation Rules

- `q`: optional; whitespace-only treated as empty (no keyword filter).
- `status`: if provided, must be one of: `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`.

### Error Responses

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid `status` value |
| 500 | `INTERNAL_ERROR` | Database or server failure |

**Acceptance criteria:** Keyword search on title/description only; case-insensitive; empty search returns all; combinable with status filter.

---

## Endpoint: Create Ticket

**Method:** `POST`  
**Path:** `/api/tickets`  
**Purpose:** Create a new ticket. Status defaults to `Open`.

### Request

```json
{
  "title": "Cannot log in",
  "description": "User reports login failure on mobile app.",
  "priority": "High",
  "createdBy": 1,
  "assignedTo": 2
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Non-empty |
| `description` | string | Yes | Non-empty |
| `priority` | string | Yes | `Low`, `Medium`, `High`, or `Critical` |
| `createdBy` | integer | Yes | Must reference existing user |
| `assignedTo` | integer \| null | No | Optional; must reference existing user if provided |
| `status` | string | No | **Not accepted from client.** Ignored or rejected if sent. Server sets `Open`. |

### Response `201 Created`

Returns created **Ticket** object with `status: "Open"`.

### Validation Rules

- `title` — required, non-empty after trim.
- `description` — required, non-empty after trim.
- `priority` — required; must be `Low`, `Medium`, `High`, or `Critical`.
- `createdBy` — required; user must exist.
- `assignedTo` — optional; if provided (non-null), user must exist.
- `status` — must not be set by client; server defaults to `Open`.

### Error Responses

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing/invalid fields; non-existent `createdBy` or `assignedTo` |
| 500 | `INTERNAL_ERROR` | Database or server failure |

**Acceptance criteria:** Create ticket with title, description, priority, created-by, optional assignee; backend validation; priority enum enforced.

---

## Endpoint: Get Ticket Detail

**Method:** `GET`  
**Path:** `/api/tickets/:id`  
**Purpose:** Retrieve a single ticket with comments ordered by `createdAt` ascending.

### Request

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | integer | Ticket ID |

### Response `200 OK`

```json
{
  "ticket": {
    "id": 1,
    "title": "Cannot log in",
    "description": "User reports login failure.",
    "priority": "High",
    "status": "Open",
    "assignedTo": 2,
    "assignedToUser": {
      "id": 2,
      "name": "Bob Support",
      "email": "bob@example.com",
      "role": "Agent"
    },
    "createdBy": 1,
    "createdByUser": {
      "id": 1,
      "name": "Jane Agent",
      "email": "jane@example.com",
      "role": "Agent"
    },
    "createdAt": "2026-07-17T08:00:00.000Z",
    "updatedAt": "2026-07-17T08:00:00.000Z"
  },
  "comments": [
    {
      "id": 1,
      "ticketId": 1,
      "message": "Investigating.",
      "createdBy": 1,
      "createdByUser": {
        "id": 1,
        "name": "Jane Agent",
        "email": "jane@example.com",
        "role": "Agent"
      },
      "createdAt": "2026-07-17T09:00:00.000Z"
    }
  ]
}
```

Comments array is ordered **`createdAt` ascending**. Empty array when ticket has no comments.

### Validation Rules

- `id` — must be a valid integer.

### Error Responses

| Status | Code | When |
|--------|------|------|
| 404 | `NOT_FOUND` | Ticket does not exist |
| 500 | `INTERNAL_ERROR` | Database or server failure |

**Acceptance criteria:** Ticket detail with comments in chronological order; 404 for non-existent ticket.

---

## Endpoint: Update Ticket

**Method:** `PATCH`  
**Path:** `/api/tickets/:id`  
**Purpose:** Update ticket fields. Does **not** change status or `createdBy`.

### Request

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | integer | Ticket ID |

**Body** (at least one field required):

```json
{
  "title": "Updated title",
  "description": "Updated description.",
  "priority": "Critical",
  "assignedTo": null
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No* | Non-empty if provided |
| `description` | string | No* | Non-empty if provided |
| `priority` | string | No* | Valid priority enum if provided |
| `assignedTo` | integer \| null | No* | Valid user id or `null` to unassign |
| `status` | string | No | **Rejected or ignored.** Use status endpoint. |
| `createdBy` | integer | No | **Rejected or ignored.** Immutable after create. |
| `createdAt` | string | No | **Rejected or ignored.** Immutable after create. |

\*At least one updatable field must be present in the request body.

### Response `200 OK`

Returns updated **Ticket** object. `status` and `createdBy` unchanged.

### Validation Rules

- Ticket must exist.
- At least one of: `title`, `description`, `priority`, `assignedTo` must be provided.
- `title` / `description` — if provided, non-empty after trim.
- `priority` — if provided, must be `Low`, `Medium`, `High`, or `Critical`.
- `assignedTo` — if provided, must be valid user id or `null`.
- `status` — must not be updated via this endpoint; return 400 if explicitly sent (recommended).
- `createdBy` — must not be updated; return 400 if explicitly sent (recommended).

### Error Responses

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid fields; empty body; `status`/`createdBy` in body; invalid `assignedTo` |
| 404 | `NOT_FOUND` | Ticket does not exist |
| 500 | `INTERNAL_ERROR` | Database or server failure |

**Acceptance criteria:** Update title, description, priority, assignee; not status; `createdBy` and `createdAt` immutable; 404 for non-existent ticket.

---

## Endpoint: Transition Ticket Status

**Method:** `PATCH`  
**Path:** `/api/tickets/:id/status`  
**Purpose:** Change ticket status via the backend-enforced state machine. **Dedicated endpoint** — the only way to change status.

### Request

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | integer | Ticket ID |

**Body:**

```json
{
  "status": "In Progress"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | Target status; transition must be valid from current status |

### Response `200 OK`

Returns updated **Ticket** object with new `status` and updated `updatedAt`.

### Validation Rules

- Ticket must exist.
- `status` — required; must be valid status enum.
- Transition must be allowed:

| From | To |
|------|-----|
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |

- All other transitions are **invalid**. Database status must **not** change on invalid attempt.

### Error Responses

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing or invalid `status` value |
| 400 | `INVALID_TRANSITION` | Transition not allowed from current status |
| 404 | `NOT_FOUND` | Ticket does not exist |
| 500 | `INTERNAL_ERROR` | Database or server failure |

**Example — invalid transition:**

```json
HTTP/1.1 400 Bad Request

{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Cannot transition from Open to Closed"
  }
}
```

**Acceptance criteria:** Valid transitions succeed; invalid transitions rejected with clear error; backend is source of truth; 404 for non-existent ticket; status not changeable via general update endpoint.

---

## Endpoint: Add Comment

**Method:** `POST`  
**Path:** `/api/tickets/:id/comments`  
**Purpose:** Add a comment to an existing ticket.

### Request

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | integer | Ticket ID |

**Body:**

```json
{
  "message": "Customer confirmed the issue is resolved.",
  "createdBy": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | Non-empty |
| `createdBy` | integer | Yes | Must reference existing user |

### Response `201 Created`

Returns created **Comment** object. Client may append to list immediately; `createdAt` determines display order.

```json
{
  "comment": {
    "id": 3,
    "ticketId": 1,
    "message": "Customer confirmed the issue is resolved.",
    "createdBy": 1,
    "createdByUser": {
      "id": 1,
      "name": "Jane Agent",
      "email": "jane@example.com",
      "role": "Agent"
    },
    "createdAt": "2026-07-17T11:00:00.000Z"
  }
}
```

### Validation Rules

- Ticket (`:id`) must exist.
- `message` — required, non-empty after trim.
- `createdBy` — required; user must exist.

### Error Responses

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing/invalid `message` or `createdBy`; non-existent user |
| 404 | `NOT_FOUND` | Ticket does not exist |
| 500 | `INTERNAL_ERROR` | Database or server failure |

**Acceptance criteria:** Add comment from detail view; newly created comment returned for immediate display; comments ordered by `createdAt` ascending on detail fetch.

---

## Acceptance Criteria Mapping

| Acceptance area | Endpoints |
|-----------------|-----------|
| Ticket CRUD | `POST /api/tickets`, `GET /api/tickets`, `GET /api/tickets/:id`, `PATCH /api/tickets/:id` |
| Status state machine | `PATCH /api/tickets/:id/status` |
| Search and filter | `GET /api/tickets?q=&status=` |
| Comments | `GET /api/tickets/:id`, `POST /api/tickets/:id/comments` |
| Users (dropdowns) | `GET /api/users` |
| Priority validation | `POST /api/tickets`, `PATCH /api/tickets/:id` |
| Not found | `GET`, `PATCH` ticket endpoints; `PATCH` status; `POST` comment |
| No auth / no user CRUD | No auth headers; no user write endpoints |

---

## Out of Scope (no endpoints)

- `POST` / `PUT` / `PATCH` / `DELETE` on `/api/users`
- Authentication (`/api/login`, tokens, sessions)
- Pagination, sorting, priority/assignee filters on list
- Bulk operations
- Webhooks or real-time subscriptions
