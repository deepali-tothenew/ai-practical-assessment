# Phase 1 — Scaffolding Prompts

Project scaffolding for backend, frontend, Jest, and environment configuration. No business logic or ticket APIs.

---

## P1-01 — Backend scaffold

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

**Accepted** — backend started with health endpoint only.

---

## P1-02 — Frontend scaffold

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

**Accepted** — frontend scaffold only; ticket UI deferred to Phase 4.

---

## P1-03 — Scaffold review

**Date:** 2026-07-17

### Prompt

```
Review the generated project setup.

Verify that it is consistent with implementation-plan.md, design-notes.md, api-contract.md, and test-strategy.md.

Check for unnecessary complexity, architectural inconsistencies, missing configuration, or files that should not exist yet.

Do not add new features.
```

### Response summary

Identified configuration issues (env file path, missing Jest/README) and premature files. No business logic violations found.

### Outcome

**Accepted** — findings drove P1-04 and P1-05.

---

## P1-04 — Fix environment configuration

**Date:** 2026-07-17

### Prompt

```
Review the Phase 1 project setup and fix the environment configuration only.

Requirements:
- Keep backend environment files in src/backend/.
- Keep frontend environment files in src/frontend/ (Vite default).
- Update the backend environment loading so dotenv reads src/backend/.env instead of a root .env.
- Place .env.example inside src/backend/ and src/frontend/ respectively.
- Ensure backend configuration remains self-contained and does not depend on files outside src/backend.
- Keep the current project architecture unchanged.

Do not implement any new features or modify business logic.

Summarize the files changed.
```

### Response summary

Updated `src/backend/config/env.js` to load from `src/backend/.env`. Moved `.env.example` files into `src/backend/` and `src/frontend/`.

### Outcome

**Accepted** — resolved Issue #1 in `debugging-notes.md` (backend env not loaded).

---

## P1-05 — Complete remaining Phase 1 setup

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

## P1-06 — Scaffold cleanup

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

Removed redundant `.gitkeep` files and unused scaffold code. No architectural changes.

### Outcome

**Accepted** — Phase 1 checkpoint met: both apps start, Jest runs with zero tests.
