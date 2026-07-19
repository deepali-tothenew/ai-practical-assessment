# Testing Prompts

Jest integration test setup, test environment configuration, and test suite implementation.

---

## TEST-01 — Jest harness setup

**Date:** 2026-07-17

### Prompt

```
Complete the remaining Phase 1 setup tasks only.

Implement:
1. Jest project setup.
2. Create the tests/integration/ directory structure.
3. Configure the test runner so Jest executes successfully even when no tests exist.
...

Do not implement business logic, database schema, ticket APIs, or application tests.
```

### Response summary

Added `jest.config.js`, `tests/integration/` structure, and root `package.json` test scripts with `passWithNoTests: true`.

### Outcome

**Accepted** — see also `implementation.md` IMPL-03 for full Phase 1 setup prompt.

---

## TEST-02 — First integration test suite (status transitions)

**Date:** 2026-07-18

### Prompt

```
Implement the first integration test suite for the backend.

Use the approved project documentation as the source of truth.

Create Jest and Supertest integration tests covering only ticket status transitions.

Verify:
- Valid transitions succeed.
- Invalid transitions return HTTP 400 with INVALID_TRANSITION.
- The database state remains unchanged after invalid transitions.

Do not add tests for other endpoints yet.
Do not modify application code unless required to support the existing implementation.

Summarize the tests added.
```

### Response summary

Created `tests/integration/ticketStatusTransitions.test.js` covering SM-V, SM-I, SM-E, and SU cases.

### Outcome

**Accepted**

---

## TEST-03 — Refine test environment

**Date:** 2026-07-18

### Prompt

```
Refine the backend test environment configuration.

- Use src/backend/.env.test for test configuration.
- Load .env.test automatically when NODE_ENV=test; otherwise load .env.
- Set NODE_ENV=test via the Jest test script.
- Remove hardcoded environment variables from tests/integration/setup.js.
```

### Response summary

Updated `env.js` for `.env.test` selection; `NODE_ENV=test` in root test scripts; dedicated `support_tickets_test` database.

### Outcome

**Accepted** — resolved test/dev database collision (see `debugging.md` DEBUG-02).

---

## TEST-04 — Complete remaining integration tests

**Date:** 2026-07-18

### Prompt

```
Complete the remaining integration tests defined in test-strategy.md.
```

### Response summary

Implemented `tickets.test.js`, `searchFilter.test.js`, `comments.test.js`, and `users.test.js`. **54/54 tests passing.**

### Outcome

**Accepted** — results recorded in `test-results.md`.

---

## TEST-05 — Verify test completeness

**Date:** 2026-07-18

### Prompt

```
Verify that all required backend integration tests and test documentation are complete.

Identify only remaining specification gaps, if any.
```

### Response summary

Confirmed all automated integration cases from `test-strategy.md` implemented. Manual-only cases (EC-08–EC-10) documented in `test-results.md`.

### Outcome

**Accepted**
