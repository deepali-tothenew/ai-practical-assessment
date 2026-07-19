# Phase 2 — Database Prompts

MySQL schema, seed data, and database connection infrastructure.

---

## P2-01 — Generate schema

**Date:** 2026-07-18

### Prompt

```
Generate database/schema.sql based on the approved project documentation.

Use data-model.md as the source of truth and ensure the generated schema is consistent with the existing specifications.

Do not generate backend code or modify any documentation.

Summarize the generated tables and relationships.
```

### Response summary

Created `database/schema.sql` with `users`, `tickets`, and `comments` tables, ENUMs for priority and status, foreign keys, and indexes per `data-model.md`.

### Outcome

**Accepted**

---

## P2-02 — Generate seed data

**Date:** 2026-07-18

### Prompt

```
Generate database/seed.sql based on the approved project documentation.

Seed only the Users table as defined in the project specifications.

Summarize the seeded records.
```

### Response summary

Created `database/seed.sql` with three users (Jane Agent, Bob Support, Alice Admin). No ticket or comment seed data.

### Outcome

**Accepted** — aligns with Core scope (users as read-only reference data).

---

## P2-03 — Database infrastructure

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

Implemented connection pool in `src/backend/config/database.js` with `initializeDatabase()`, `getPool()`, `closePool()`, startup connectivity check, and graceful shutdown in `server.js`.

### Outcome

**Accepted** — backend exits cleanly if database is unreachable at startup.
