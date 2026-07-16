# Data Model

## Overview

Three entities: **User** (seeded), **Ticket**, and **Comment**. MySQL with foreign-key relationships. Users are read-only from the application perspective in Core.

## Entity: User

Seeded only — no application-level create/update/delete.

| Field  | Type        | Constraints              | Notes                          |
|--------|-------------|--------------------------|--------------------------------|
| id     | INT AUTO_INCREMENT | PK                  |                                |
| name   | VARCHAR     | NOT NULL                 | Display name                   |
| email  | VARCHAR     | NOT NULL, UNIQUE         |                                |
| role   | VARCHAR/ENUM| NOT NULL                 | e.g. Agent, Admin (seed values)|

**Application usage:** Populates Created By and Assigned To dropdowns.

## Entity: Ticket

| Field       | Type        | Constraints                          | Notes                                      |
|-------------|-------------|--------------------------------------|--------------------------------------------|
| id          | INT AUTO_INCREMENT | PK                              |                                            |
| title       | VARCHAR     | NOT NULL                             | Included in keyword search                 |
| description | TEXT        | NOT NULL                             | Included in keyword search                 |
| priority    | ENUM        | NOT NULL                             | `Low`, `Medium`, `High`, `Critical`        |
| status      | ENUM        | NOT NULL, default `Open`             | See state machine below                    |
| assignedTo  | FK → User   | NULLABLE                             | Optional; must reference seeded user if set|
| createdBy   | FK → User   | NOT NULL                             | Must reference seeded user                 |
| createdAt   | TIMESTAMP   | NOT NULL, default now                |                                            |
| updatedAt   | TIMESTAMP   | NOT NULL, on update                  |                                            |

### Status Values

`Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`

### Status State Machine

```
Open         → In Progress
Open         → Cancelled
In Progress  → Resolved
In Progress  → Cancelled
Resolved     → Closed
```

All other transitions are **invalid** and must be rejected by the backend.

## Entity: Comment

| Field     | Type        | Constraints              | Notes                    |
|-----------|-------------|--------------------------|--------------------------|
| id        | INT AUTO_INCREMENT | PK                  |                          |
| ticketId  | FK → Ticket | NOT NULL                 |                          |
| message   | TEXT        | NOT NULL                 | **Excluded** from search |
| createdBy | FK → User   | NOT NULL                 | Seeded user reference    |
| createdAt | TIMESTAMP   | NOT NULL, default now    | Ordered createdAt ascending when displayed |

**Display ordering:** Comments are returned and displayed in chronological order (`createdAt` ascending).

## Relationships

```
User 1 ──< Ticket (createdBy)
User 1 ──< Ticket (assignedTo, optional)
Ticket 1 ──< Comment
User 1 ──< Comment (createdBy)
```

## Validation Rules (Backend)

- **Ticket create:** `title`, `description`, `priority`, `createdBy` required; `priority` must be one of four allowed values; `createdBy` and `assignedTo` (if provided) must exist in User table.
- **Ticket update (fields):** Same field validation; status **not** updated through this endpoint.
- **Ticket status change:** Only via dedicated endpoint; transition must be valid per state machine.
- **Comment create:** `message` and `createdBy` required; `ticketId` must exist.

## Search Semantics

- Keyword search: `LIKE` on `Ticket.title` and `Ticket.description` only (case-insensitive).
- Status filter: exact match on `Ticket.status`.
- Comments are never included in keyword search results.

## Seed Data Expectations

- At least 2–3 seeded users with varied roles for realistic dropdowns and assignment scenarios.
- Sample tickets across statuses and priorities for demo and manual testing.
- Sample comments on at least one ticket.
