# Database Setup Notes

Local MySQL setup for the **Support Ticket Management System** — development database, test database, environment configuration, and verification.

**Scripts in this directory:**

| File | Purpose |
|------|---------|
| `schema.sql` | Creates `users`, `tickets`, and `comments` tables (drops existing tables first) |
| `seed.sql` | Inserts three seeded users (no ticket or comment data) |

**Source of truth:** `data-model.md`, `design-notes.md`

---

## Prerequisites

- **MySQL 8.x** (verified with MySQL 8.3.0 during integration testing)
- A MySQL user with permission to create databases (for initial setup) and read/write the application databases
- Node.js 18+ and npm dependencies installed (see root `README.md`)

The application uses the `mysql2` connection pool in `src/backend/config/database.js`. The backend will not start until it can connect to the configured database.

---

## Databases

Use **two separate databases** so integration tests do not affect development data:

| Environment | Default database name | Env file |
|-------------|----------------------|----------|
| Development | `support_tickets` | `src/backend/.env` |
| Integration tests | `support_tickets_test` | `src/backend/.env.test` |

`schema.sql` does **not** create databases — only tables. Create each database manually before importing scripts.

---

## Step 1 — Create databases

From a MySQL client or the command line (adjust user/host as needed):

```sql
CREATE DATABASE IF NOT EXISTS support_tickets
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS support_tickets_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Command-line equivalent:

```bash
mysql -u YOUR_USER -p -e "
  CREATE DATABASE IF NOT EXISTS support_tickets
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE DATABASE IF NOT EXISTS support_tickets_test
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"
```

---

## Step 2 — Import schema

Run `schema.sql` against each database. **Warning:** this script drops and recreates `users`, `tickets`, and `comments`. All ticket and comment data in that database will be lost.

**Development database:**

```bash
mysql -u YOUR_USER -p support_tickets < database/schema.sql
```

**Test database:**

```bash
mysql -u YOUR_USER -p support_tickets_test < database/schema.sql
```

### Tables created

| Table | Description |
|-------|-------------|
| `users` | Seeded reference users (`id`, `name`, `email`, `role`) |
| `tickets` | Support tickets with status enum, priority enum, FKs to `users` |
| `comments` | Ticket comments with FK to `tickets` (cascade delete) and `users` |

Key constraints:

- `tickets.status` — `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled` (default `Open`)
- `tickets.priority` — `Low`, `Medium`, `High`, `Critical`
- `tickets.created_by` → `users.id` (RESTRICT on delete)
- `tickets.assigned_to` → `users.id` (SET NULL on delete)
- `comments.ticket_id` → `tickets.id` (CASCADE on delete)

---

## Step 3 — Import seed data

Run `seed.sql` after `schema.sql`. Seed data is **users only** — tickets and comments are created through the API or integration tests.

```bash
mysql -u YOUR_USER -p support_tickets < database/seed.sql
mysql -u YOUR_USER -p support_tickets_test < database/seed.sql
```

### Seeded users

| id | name | email | role |
|----|------|-------|------|
| 1 | Jane Agent | jane.agent@example.com | Agent |
| 2 | Bob Support | bob.support@example.com | Agent |
| 3 | Alice Admin | alice.admin@example.com | Admin |

`seed.sql` uses `ON DUPLICATE KEY UPDATE`, so re-running it is safe if users already exist.

---

## Step 4 — Environment configuration

Environment files live under `src/backend/`. The loader in `src/backend/config/env.js` reads:

- **Development / production:** `src/backend/.env`
- **Tests:** `src/backend/.env.test` when `NODE_ENV=test`

Copy the examples and set your MySQL credentials:

```bash
cp src/backend/.env.example src/backend/.env
cp src/backend/.env.test.example src/backend/.env.test
```

### Development (`src/backend/.env`)

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=support_tickets
PORT=3001
```

### Tests (`src/backend/.env.test`)

```env
NODE_ENV=test
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=support_tickets_test
PORT=3001
```

### Required variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DB_HOST` | Yes | Defaults to `localhost` if omitted |
| `DB_USER` | Yes | Must have access to the target database |
| `DB_PASSWORD` | No | May be empty for local MySQL without a password |
| `DB_NAME` | Yes | `support_tickets` (dev) or `support_tickets_test` (tests) |
| `DB_PORT` | No | Defaults to `3306` |
| `PORT` | No | API port; defaults to `3001` |

> Do not commit `.env` or `.env.test`. Both are listed in `.gitignore`. Only `.env.example` and `.env.test.example` are tracked.

---

## Step 5 — Verify development database

### 5a. MySQL checks

```sql
USE support_tickets;

SHOW TABLES;
-- Expected: comments, tickets, users

SELECT id, name, email, role FROM users ORDER BY id;
-- Expected: 3 rows (Jane Agent, Bob Support, Alice Admin)

SELECT COUNT(*) FROM tickets;
-- Expected: 0 (seed does not insert tickets)
```

### 5b. Backend connectivity

From `src/backend/`:

```bash
npm run dev
```

On successful connection, the server logs:

```text
[database] Connected to localhost:3306/support_tickets
API server running on port 3001 (development)
```

If configuration is missing or the database is unreachable, startup fails with a clear error and the process exits.

### 5c. API health check

With the backend running:

```bash
curl http://localhost:3001/health
```

Expected: HTTP 200 with a JSON health response.

### 5d. Seeded users via API

```bash
curl http://localhost:3001/api/users
```

Expected: HTTP 200 with three users (ids 1–3) for frontend dropdowns.

### 5e. Frontend (optional)

With the backend running, start the frontend (`cd src/frontend && npm run dev`) and open `http://localhost:3000`. The ticket list loads from the API; create a ticket to confirm end-to-end persistence.

---

## Step 6 — Verify test database

Integration tests run from the **repository root** with `NODE_ENV=test` (set in root `package.json` scripts). Jest loads `src/backend/.env.test` automatically.

### 6a. One-time test env setup

Ensure `support_tickets_test` exists and has schema + seed applied (Steps 1–3). Configure `src/backend/.env.test` with credentials for that database.

### 6b. Run integration tests

From the repository root:

```bash
npm test
```

Expected output (as recorded in `test-results.md`):

```text
Test Suites: 5 passed, 5 total
Tests:       54 passed, 54 total
```

### How tests use the database

Each integration suite calls `setupIntegrationTests()` in `beforeAll`, which:

1. Re-applies `database/schema.sql` and `database/seed.sql` to the **test** database (resets tables and users)
2. Initializes the backend connection pool against `support_tickets_test`

Tests then create tickets and comments as needed. The development database (`support_tickets`) is not touched when `NODE_ENV=test`.

---

## Resetting data

### Re-apply full schema and seed (wipes all tickets and comments)

```bash
mysql -u YOUR_USER -p support_tickets < database/schema.sql
mysql -u YOUR_USER -p support_tickets < database/seed.sql
```

Use the same commands with `support_tickets_test` to reset the test database manually.

### Integration test reset

Running `npm test` resets the test database automatically via `applySchemaAndSeed()` at the start of the first suite.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `Database configuration error: missing DB_USER` | `.env` not created or incomplete | Copy `.env.example` and set `DB_USER`, `DB_NAME` |
| `Database connection failed: Access denied` | Wrong credentials or missing grants | Verify user/password; grant privileges on the database |
| `Unknown database 'support_tickets'` | Database not created | Run Step 1 |
| `Table 'support_tickets.users' doesn't exist` | Schema not imported | Run Step 2 |
| Empty user dropdowns in UI | Seed not applied | Run Step 3 |
| Tests connect to development DB | `NODE_ENV` not `test` or missing `.env.test` | Use `npm test` from repo root; configure `.env.test` |
| Port 3001 in use | Another process on default API port | Stop conflicting process or set `PORT` in `.env` |

---

## Related documentation

| Document | Content |
|----------|---------|
| `data-model.md` | Entity definitions and validation rules |
| `design-notes.md` | Architecture and database access patterns |
| `test-results.md` | Recorded integration test run |
| `debugging-notes.md` | Env path and test DB isolation fixes |
| `README.md` | Application install, env files, and run commands |
