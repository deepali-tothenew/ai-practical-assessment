# Phase 3 — Backend Prompts

Layered backend API implementation, code reviews, and integration tests.

---

## P3-01 — Repository layer

**Date:** 2026-07-18

### Prompt

```
Implement the repository layer only.

Create repositories according to the approved architecture.

Repositories should contain only database access and persistence logic.
```

### Response summary

Created `userRepository.js`, `ticketRepository.js`, and `commentRepository.js` with parameterized SQL queries. No business rules in repositories.

### Outcome

**Accepted**

---

## P3-02 — Service layer

**Date:** 2026-07-18

### Prompt

```
Implement the service layer only.

Use the existing repository layer.

Move all business rules into services.
```

### Response summary

Created services including `statusService.js` (state machine), `validationService.js`, `ticketService.js`, `commentService.js`, and `userService.js`. Business rules centralized in services.

### Outcome

**Accepted** — initial implementation had a layering issue corrected in P3-05.

---

## P3-03 — Controller layer

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

Created thin controllers for users, tickets, comments, and health. Routes wired in `routes/`.

### Outcome

**Accepted**

---

## P3-04 — Request validation

**Date:** 2026-07-18

### Prompt

```
Implement request validation according to api-contract.md.

Validate request parameters and payloads before invoking services.

Do not duplicate business rules already handled by the service layer.
```

### Response summary

Created validators for tickets, comments, and route params. Structural validation in middleware; business rules remain in services.

### Outcome

**Accepted**

---

## P3-05 — Backend code review

**Date:** 2026-07-18

### Prompt

```
Review the generated backend code.

Verify it is consistent with:
- api-contract.md
- design-notes.md
- implementation-plan.md
- acceptance-criteria.md

Check for:
- architecture violations
- duplicated business logic
- SQL in controllers
- business rules outside services
- unnecessary complexity

Suggest only corrections required for consistency.
Do not introduce new features.
```

### Response summary

Identified layering violation: `TicketService` accessed `CommentRepository` directly instead of through `CommentService`.

### Outcome

**Changed** — fix applied in P3-06.

---

## P3-06 — Fix layering issue

**Date:** 2026-07-18

### Prompt

```
Review the service layer and fix only the layering issue.

Comment-related repository access should remain within CommentService.

Update the implementation so TicketService retrieves comments through CommentService instead of accessing CommentRepository directly.
```

### Response summary

Refactored `ticketService.js` to call `commentService` for comment retrieval. `CommentRepository` access confined to `CommentService`.

### Outcome

**Accepted** — documented as Issue #3 in `debugging-notes.md` and R3-01 in `code-review-notes.md`.

---

## P3-07 — First integration test suite

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

Created `tests/integration/ticketStatusTransitions.test.js` covering SM-V, SM-I, SM-E, and SU test cases from `test-strategy.md`.

### Outcome

**Accepted**

---

## P3-08 — Refine test environment

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

Updated `env.js` for `.env.test` selection, root `package.json` scripts with `NODE_ENV=test`, and removed hardcoded test env vars. Dedicated `support_tickets_test` database.

### Outcome

**Accepted** — resolved Issue #4 in `debugging-notes.md` (tests using development database).

---

## P3-09 — Full backend review

**Date:** 2026-07-18

### Prompt

```
Review the backend against the approved project documentation.

Verify architecture, API contract, business rules, validation, and integration tests.
Identify only required corrections. Ignore optional improvements.
```

### Response summary

Backend compliant with spec. Remaining gap was incomplete integration test coverage (not application code defects).

### Outcome

**Accepted** — drove P3-10 and P3-11.

---

## P3-10 — Complete remaining integration tests

**Date:** 2026-07-18

### Prompt

```
Complete the remaining integration tests defined in test-strategy.md.
```

### Response summary

Implemented `tickets.test.js`, `searchFilter.test.js`, `comments.test.js`, and `users.test.js`. Total: 54 integration tests passing.

### Outcome

**Accepted** — results recorded in `test-results.md`.

---

## P3-11 — Verify test completeness

**Date:** 2026-07-18

### Prompt

```
Verify that all required backend integration tests and test documentation are complete.

Identify only remaining specification gaps, if any.
```

### Response summary

Confirmed all automated integration cases from `test-strategy.md` implemented. Manual-only cases (EC-08–EC-10) documented as skipped in `test-results.md`.

### Outcome

**Accepted** — Phase 3 backend complete.
