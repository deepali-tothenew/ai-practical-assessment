# Implementation Prompts

Scaffolding, database, backend API (layered), and frontend feature implementation.

---

## Phase 1 — Scaffolding

### IMPL-01 — Backend scaffold

**Date:** 2026-07-17

### Prompt

```
Using the existing project specification and design documents, generate the backend project setup only.

Create the initial Express project structure, configuration files, middleware registration, environment variable support, database connection configuration, and a simple GET /health endpoint.

Do not implement any business logic, ticket APIs, services, repositories, or database schema.
```

### Response summary

Created `src/backend/` with Express app, middleware, env loading, database config stub, health route, and folder structure per `design-notes.md`.

### Outcome

**Accepted**

---

### IMPL-02 — Frontend scaffold

**Date:** 2026-07-17

### Prompt

```
Using the existing project specification and design documents, generate the initial React (Vite) project setup.

Create the project structure, configure environment variable support, and implement a simple page that verifies communication with the backend health endpoint.

Do not implement ticket management UI or business features.
```

### Response summary

Created `src/frontend/` with Vite, React, `VITE_API_URL` support, and `HealthCheckPage` for backend connectivity verification.

### Outcome

**Accepted**

---

### IMPL-03 — Complete remaining Phase 1 setup

**Date:** 2026-07-17

### Prompt

```
Complete the remaining Phase 1 setup tasks only.

Implement:
1. Jest project setup.
2. Create the tests/integration/ directory structure.
3. Configure the test runner so Jest executes successfully even when no tests exist.
4. Create a minimal README skeleton containing:
   - Project overview
   - Tech stack
   - Prerequisites
   - Installation
   - Environment setup
   - Run commands

Do not implement business logic, database schema, ticket APIs, or application tests.

Summarize the changes made.
```

### Response summary

Added root `jest.config.js`, `tests/integration/` structure, root `package.json` test scripts, and README skeleton.

### Outcome

**Accepted**

---

### IMPL-04 — Scaffold cleanup

**Date:** 2026-07-17

### Prompt

```
Review the Phase 1 scaffold and perform only non-functional cleanup.

Tasks:
- Remove redundant files such as unnecessary .gitkeep files.
- Remove unused setup code if it is not required for the current phase.
- Keep the project consistent with implementation-plan.md and design-notes.md.

Do not introduce new functionality or modify the project architecture.

Provide a summary of the cleanup performed.
```

### Response summary

Removed redundant `.gitkeep` files and unused scaffold code.

### Outcome

**Accepted**

---

## Phase 2 — Database

### IMPL-05 — Generate schema

**Date:** 2026-07-18

### Prompt

```
Generate database/schema.sql based on the approved project documentation.

Use data-model.md as the source of truth and ensure the generated schema is consistent with the existing specifications.

Do not generate backend code or modify any documentation.

Summarize the generated tables and relationships.
```

### Response summary

Created `database/schema.sql` with `users`, `tickets`, and `comments` tables per `data-model.md`.

### Outcome

**Accepted**

---

### IMPL-06 — Generate seed data

**Date:** 2026-07-18

### Prompt

```
Generate database/seed.sql based on the approved project documentation.

Seed only the Users table as defined in the project specifications.

Summarize the seeded records.
```

### Response summary

Created `database/seed.sql` with three seeded users. No ticket or comment seed data.

### Outcome

**Accepted**

---

### IMPL-07 — Database infrastructure

**Date:** 2026-07-18

### Prompt

```
Review the backend foundation and complete only the database infrastructure.

Use the approved project documentation as the source of truth.

Verify and complete:
- MySQL connection pool
- Database configuration
- Connection initialization
- Graceful shutdown
- Error handling related to database startup

Summarize the changes made.
```

### Response summary

Implemented connection pool in `src/backend/config/database.js` with startup verification and graceful shutdown in `server.js`.

### Outcome

**Accepted**

---

## Phase 3 — Backend API

### IMPL-08 — Repository layer

**Date:** 2026-07-18

### Prompt

```
Implement the repository layer only.

Create repositories according to the approved architecture.

Repositories should contain only database access and persistence logic.
```

### Response summary

Created `userRepository.js`, `ticketRepository.js`, and `commentRepository.js` with parameterized SQL.

### Outcome

**Accepted**

---

### IMPL-09 — Service layer

**Date:** 2026-07-18

### Prompt

```
Implement the service layer only.

Use the existing repository layer.

Move all business rules into services.
```

### Response summary

Created services including `statusService.js`, `validationService.js`, `ticketService.js`, `commentService.js`, and `userService.js`.

### Outcome

**Accepted**

---

### IMPL-10 — Controller layer

**Date:** 2026-07-18

### Prompt

```
Implement the controller layer only.

Controllers should:
- receive HTTP requests
- invoke services
- return responses
- delegate errors to middleware
```

### Response summary

Created thin controllers and wired routes.

### Outcome

**Accepted**

---

### IMPL-11 — Request validation

**Date:** 2026-07-18

### Prompt

```
Implement request validation according to api-contract.md.

Validate request parameters and payloads before invoking services.

Do not duplicate business rules already handled by the service layer.
```

### Response summary

Created validators for tickets, comments, and route params.

### Outcome

**Accepted**

---

## Phase 4 — Frontend

### IMPL-12 — API client layer

**Date:** 2026-07-18

### Prompt

```
Implement the frontend API layer using the existing backend endpoints.

Follow the approved API contract.
```

### Response summary

Created `client.js`, `tickets.js`, `users.js`, `comments.js` with `ApiError` parsing.

### Outcome

**Accepted**

---

### IMPL-13 — Ticket List page

**Date:** 2026-07-18

### Prompt

```
Implement the Ticket List page using the existing backend APIs.

Follow the approved specifications.
```

### Response summary

Created `TicketListPage` with server-side search, status filter, loading/empty states.

### Outcome

**Accepted**

---

### IMPL-14 — Create Ticket page

**Date:** 2026-07-18

### Prompt

```
Implement the Create Ticket page using the existing APIs.

Follow the approved validation rules.
```

### Response summary

Created `CreateTicketPage` and `TicketForm` with dropdowns and validation.

### Outcome

**Accepted**

---

### IMPL-15 — Ticket Detail page

**Date:** 2026-07-18

### Prompt

```
Implement the Ticket Detail page.

Display ticket information and comments.
```

### Response summary

Created `TicketDetailPage` with metadata and comment list.

### Outcome

**Accepted**

---

### IMPL-16 — Edit Ticket page

**Date:** 2026-07-18

### Prompt

```
Implement ticket editing using the existing APIs.

Respect immutable fields and existing validation.
```

### Response summary

Created `EditTicketPage`; `createdBy` read-only; no status field.

### Outcome

**Accepted**

---

### IMPL-17 — Status action

**Date:** 2026-07-18

### Prompt

```
Implement the dedicated ticket status action.

Use the existing status endpoint only.
```

### Response summary

Created `StatusAction` calling `PATCH /api/tickets/:id/status`.

### Outcome

**Accepted**

---

### IMPL-18 — Comments

**Date:** 2026-07-18

### Prompt

```
Implement ticket comments using the existing APIs.

Display comments in ascending createdAt order.
```

### Response summary

Created `CommentForm` and `CommentList` with immediate append after POST.

### Outcome

**Accepted**
