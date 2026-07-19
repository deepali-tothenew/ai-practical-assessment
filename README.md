# Support Ticket Management System

A full-stack support ticket application built for the AI Capability Exercise (Core tier). Internal users create, update, comment on, search, and filter tickets. Status changes follow a **backend-enforced state machine** — the API is the source of truth for valid transitions.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MySQL 8.x |
| Tests | Jest, Supertest (integration) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [MySQL](https://www.mysql.com/) 8.x (verified with MySQL 8.3.0)
- npm

## Installation

Clone the repository, then install dependencies for each package:

```bash
# Integration test runner (repository root)
npm install

# Backend API
cd src/backend && npm install

# Frontend
cd src/frontend && npm install
```

## Database Setup

The application uses two separate MySQL databases — one for development and one for integration tests.

| Environment | Database name | Env file |
|-------------|---------------|----------|
| Development | `support_tickets` | `src/backend/.env` |
| Integration tests | `support_tickets_test` | `src/backend/.env.test` |

### 1. Create databases

```sql
CREATE DATABASE IF NOT EXISTS support_tickets
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS support_tickets_test
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Import schema and seed

From the repository root (replace `YOUR_USER` with your MySQL user):

```bash
mysql -u YOUR_USER -p support_tickets < database/schema.sql
mysql -u YOUR_USER -p support_tickets < database/seed.sql

mysql -u YOUR_USER -p support_tickets_test < database/schema.sql
mysql -u YOUR_USER -p support_tickets_test < database/seed.sql
```

`schema.sql` creates the `users`, `tickets`, and `comments` tables. **It drops and recreates these tables** — existing ticket and comment data in that database will be lost.

`seed.sql` inserts three reference users (Jane Agent, Bob Support, Alice Admin). Tickets and comments are created through the application or tests.

For detailed setup, verification queries, troubleshooting, and reset steps, see [`database/setup-notes.md`](database/setup-notes.md).

## Environment Configuration

Each application package has its own environment file. Copy the examples and set your values:

```bash
cp src/backend/.env.example src/backend/.env
cp src/backend/.env.test.example src/backend/.env.test
cp src/frontend/.env.example src/frontend/.env
```

### Backend — development (`src/backend/.env`)

Loaded by `src/backend/config/env.js` when `NODE_ENV` is not `test`.

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=support_tickets
PORT=3001
```

Required: `DB_HOST`, `DB_USER`, `DB_NAME`. `DB_PASSWORD` may be empty for local MySQL without a password.

### Backend — tests (`src/backend/.env.test`)

Loaded automatically when `NODE_ENV=test` (set by root test scripts).

```env
NODE_ENV=test
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=support_tickets_test
PORT=3001
```

### Frontend (`src/frontend/.env`)

```env
VITE_API_URL=http://localhost:3001
```

> Do not commit `.env` or `.env.test`. Both are gitignored. Only `.env.example` and `.env.test.example` are tracked.

## Running the Application

Start the backend first — it verifies database connectivity on startup and exits if the connection fails.

**Backend API** (default port 3001):

```bash
cd src/backend
npm run dev    # development with nodemon
npm start      # production start
```

On success, the server logs:

```text
[database] Connected to localhost:3306/support_tickets
API server running on port 3001 (development)
```

**Frontend** (default port 3000):

```bash
cd src/frontend
npm run dev
```

Open `http://localhost:3000` for the ticket list.

### Frontend routes

| Route | Page |
|-------|------|
| `/` | Ticket list (search and status filter) |
| `/tickets/new` | Create ticket |
| `/tickets/:id` | Ticket detail (comments, status action) |
| `/tickets/:id/edit` | Edit ticket fields (not status) |

### API endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/users` | GET | List seeded users for dropdowns |
| `/api/tickets` | GET | List tickets (`q`, `status` query params) |
| `/api/tickets` | POST | Create ticket |
| `/api/tickets/:id` | GET | Ticket detail with comments |
| `/api/tickets/:id` | PATCH | Update fields (not status) |
| `/api/tickets/:id/status` | PATCH | Status transition (state machine) |
| `/api/tickets/:id/comments` | POST | Add comment |

Quick verification with the backend running:

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/users
```

See [`api-contract.md`](api-contract.md) for full request/response contracts.

## Running Tests

Integration tests run from the **repository root** with `NODE_ENV=test`, which loads `src/backend/.env.test`.

Prerequisites:

1. `support_tickets_test` database created and configured in `.env.test`
2. Schema and seed applied at least once (tests also re-apply them automatically)

```bash
# From repository root
npm test                  # all Jest integration tests (54 tests)
npm run test:integration  # same — integration tests only
```

Expected result: **5 test suites, 54 tests passed**. Latest run recorded in [`test-results.md`](test-results.md).

Integration tests reset the test database on suite startup via `database/schema.sql` and `database/seed.sql`. The development database is not modified.

## Project Structure

```
ai-practical-assessment/
  README.md
  api-contract.md              # REST endpoint contracts
  acceptance-criteria.md       # Definition of done checklist
  test-results.md              # Recorded integration test run
  database/
    schema.sql                 # Table definitions
    seed.sql                   # Seeded users
    setup-notes.md             # Detailed database setup guide
  tests/
    integration/               # Jest API integration tests
      helpers/                 # DB setup and test lifecycle utilities
  src/
    backend/
      config/                  # env.js, database.js (connection pool)
      controllers/             # Request/response handlers
      middleware/              # Error handling, validation
      repositories/            # SQL data access
      routes/                  # Express route definitions
      services/                # Business logic (state machine, validation)
      validators/              # Request validation schemas
      server.js                # Entry point
    frontend/
      src/
        api/                   # API client modules
        components/            # Reusable UI components
        hooks/                 # Shared hooks (e.g. useDebounce)
        pages/                 # Route-level views
        utils/                 # Constants, validation, formatting
```

## Documentation

| Document | Description |
|----------|-------------|
| [`database/setup-notes.md`](database/setup-notes.md) | Database setup, env config, verification |
| [`api-contract.md`](api-contract.md) | API request/response contracts |
| [`design-notes.md`](design-notes.md) | Architecture and layering |
| [`ui-flow.md`](ui-flow.md) | Screen flows and UI behavior |
| [`test-strategy.md`](test-strategy.md) | Test cases and coverage matrix |
| [`tool-workflow.md`](tool-workflow.md) | AI-assisted development workflow |
| [`code-review-notes.md`](code-review-notes.md) | Review sessions and findings |
| [`review-fixes.md`](review-fixes.md) | Review fixes and final verification |
| [`final-ai-usage-summary.md`](final-ai-usage-summary.md) | AI usage summary across the full lifecycle |
| [`ai-prompts/`](ai-prompts/) | Lifecycle-organized prompt history (7 files) |
| [`tool-specific/cursor-workflow/`](tool-specific/cursor-workflow/) | Cursor context, spec, and tasks |
