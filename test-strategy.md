# Test Strategy

Testing plan for the **Support Ticket Management System (Core)**. Framework: **Jest**.

**Related documents:** `acceptance-criteria.md`, `api-contract.md`, `design-notes.md`, `implementation-plan.md`, `data-model.md`

**Core mandate (assessment):** Integration tests that prove state-machine rules — valid transitions succeed, invalid transitions are rejected. Results recorded in `test-results.md`.

---

## Test Scope

### In scope

| Area | What is verified |
|------|------------------|
| Status state machine | All valid transitions via `PATCH /api/tickets/:id/status`; invalid transitions rejected; DB unchanged on failure |
| Status isolation | Status cannot change via `PATCH /api/tickets/:id` |
| Ticket CRUD | Create, list, detail, update with validation |
| Search and filter | Case-insensitive keyword on title/description only; empty `q`; combined with `status` |
| Comments | Create, order (`createdAt` ASC), excluded from search |
| Users | Read-only list; FK validation on references |
| Priority | Enum enforcement on create/update |
| Not found | HTTP 404 for missing ticket on GET, PATCH, status PATCH, comment POST |
| Error responses | Appropriate status codes and error codes per `api-contract.md` |

### Out of scope (Core)

| Area | Reason |
|------|--------|
| Authentication / authorization | Not implemented in Core |
| User CRUD | Seeded users only |
| Pagination, sorting, extra filters | Stretch |
| Docker / CI pipeline tests | Stretch |
| E2E browser automation | Optional; manual walkthrough sufficient for Core UI |
| Load / performance testing | Beyond Core scope |

### Test tiers (Core)

| Tier | Mandatory | Tooling |
|------|-----------|---------|
| API / Integration | **Yes** | Jest + HTTP client (e.g. `supertest`) + MySQL test database |
| Manual UI | **Yes** (walkthrough) | Browser against local dev stack |
| Unit | Optional (recommended for `statusService`) | Jest |
| Component | Optional (Stretch evidence) | Jest + React Testing Library |

---

## Test Environment

### Database

- Use a **dedicated test database** (e.g. `support_tickets_test`) configured via environment variables.
- Apply `database/schema.sql` before test suite.
- **Reset strategy:** truncate tables or re-run schema + minimal fixtures before each test file (or each test) to avoid cross-test pollution.
- Never run integration tests against production or shared development seed data.

### Application under test

- Start Express app in-process for `supertest`, or hit a test server instance bound to a test port.
- Tests exercise real HTTP routes against real MySQL (not mocked repositories) for integration tier.

### Fixtures (minimal)

| Entity | Test data |
|--------|-----------|
| Users | At least 2 users (ids 1, 2) inserted in `beforeAll` / setup script |
| Tickets | Created per test via API or direct insert with known status |
| Comments | Created via API where comment-order tests require them |

### Running tests

```bash
# Example — exact command documented in README after implementation
npm test
```

Record pass/fail output in `test-results.md` at submission.

---

## Unit Tests

**Core status:** Optional but recommended for isolated logic. Not a substitute for mandatory integration tests.

### Candidates

| Module | What to test |
|--------|--------------|
| `statusService.canTransition(from, to)` | Transition map matches business rules |
| `statusService` / transition map | Terminal states (`Closed`, `Cancelled`) have no outgoing transitions |
| `validationService` | Priority enum validation; empty string rejection |

### Example unit cases — state machine

| From | To | Expected |
|------|-----|----------|
| Open | In Progress | `true` |
| Open | Cancelled | `true` |
| Open | Closed | `false` |
| In Progress | Resolved | `true` |
| In Progress | Cancelled | `true` |
| In Progress | Open | `false` |
| Resolved | Closed | `true` |
| Resolved | In Progress | `false` |
| Closed | In Progress | `false` |
| Cancelled | Open | `false` |

Unit tests validate logic in isolation; integration tests prove end-to-end behavior including persistence.

---

## Component Tests

**Core status:** Not mandatory. Optional Stretch evidence if time permits.

### Candidates (if implemented)

| Component | Cases |
|-----------|-------|
| `StatusAction` | Renders only valid next statuses for current state |
| `TicketSearchBar` | Debounce / submit triggers list refresh |
| `CommentList` | Renders comments in order received from API |
| `ErrorBanner` | Displays API error message |

UI error handling for invalid transitions is primarily verified via **manual testing** in Core (acceptance criteria: meaningful error state, no silent failure).

---

## API / Integration Tests

**Core status:** **Mandatory.** Primary automated test tier.

**Location:** `tests/integration/`

**Tooling:** Jest + `supertest` (or equivalent) against Express app + MySQL test DB.

### Business rules coverage matrix

| Business rule | Test approach |
|---------------|---------------|
| Status via dedicated endpoint only | Integration: valid transition on `/status`; invalid via `/status`; status unchanged via `PATCH /api/tickets/:id` with `status` in body |
| Backend enforces state machine | Integration: valid/invalid transition cases below |
| `createdBy` immutable | Integration: PATCH ticket with `createdBy` → 400; value unchanged in DB |
| `assignedTo` optional | Integration: create without assignee; create with assignee; unassign via `null` |
| Search title/description only | Integration: seed ticket + comment with unique keyword only in comment → search does not return ticket |
| Case-insensitive search | Integration: match `LOGIN` against title `login issue` |
| Empty search returns all | Integration: `GET /api/tickets` without `q` returns all (subject to `status` filter) |
| Comments `createdAt` ASC | Integration: create two comments; GET detail asserts order |
| Priority enum | Integration: invalid priority on create → 400 |
| Users read-only | No POST/PATCH/DELETE tests for `/api/users` (endpoints must not exist) |
| 404 not found | Integration: missing ticket id on GET, PATCH, status PATCH, comment POST |

---

### Mandatory — Status state machine (`PATCH /api/tickets/:id/status`)

Each test: create or seed a ticket in the **from** status, call status endpoint, assert HTTP response and **database state**.

#### Valid transitions (must pass)

| ID | From | To | Assert |
|----|------|-----|--------|
| SM-V01 | Open | In Progress | 200; DB status = `In Progress` |
| SM-V02 | In Progress | Resolved | 200; DB status = `Resolved` |
| SM-V03 | Resolved | Closed | 200; DB status = `Closed` |
| SM-V04 | Open | Cancelled | 200; DB status = `Cancelled` |
| SM-V05 | In Progress | Cancelled | 200; DB status = `Cancelled` |

#### Invalid transitions (must fail — status unchanged in DB)

| ID | From | To | Assert |
|----|------|-----|--------|
| SM-I01 | Open | Closed | 400; `error.code` = `INVALID_TRANSITION`; DB status = `Open` |
| SM-I02 | Open | Resolved | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I03 | In Progress | Open | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I04 | In Progress | Closed | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I05 | Resolved | Cancelled | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I06 | Resolved | In Progress | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I07 | Closed | In Progress | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I08 | Closed | Cancelled | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I09 | Cancelled | Open | 400; `INVALID_TRANSITION`; DB unchanged |
| SM-I10 | Cancelled | In Progress | 400; `INVALID_TRANSITION`; DB unchanged |

#### Status endpoint — additional cases

| ID | Scenario | Assert |
|----|----------|--------|
| SM-E01 | Missing `status` in body | 400 `VALIDATION_ERROR` |
| SM-E02 | Invalid status string (e.g. `"Done"`) | 400 `VALIDATION_ERROR` |
| SM-E03 | Non-existent ticket id | 404 `NOT_FOUND` |
| SM-E04 | Full happy path chain Open → In Progress → Resolved → Closed | Each step 200; final DB = `Closed` |

---

### Integration — Status isolation (`PATCH /api/tickets/:id`)

| ID | Scenario | Assert |
|----|----------|--------|
| SU-01 | PATCH with `{ "status": "Closed" }` on Open ticket | 400; DB status still `Open` |
| SU-02 | PATCH with valid field updates only (e.g. title) | 200; status unchanged |

---

### Integration — Ticket CRUD

| ID | Endpoint | Scenario | Assert |
|----|----------|----------|--------|
| CR-01 | POST `/api/tickets` | Valid payload with assignee | 201; `status` = `Open` |
| CR-02 | POST `/api/tickets` | Valid payload without assignee | 201; `assignedTo` = null |
| CR-03 | POST `/api/tickets` | Missing `title` | 400; no row created |
| CR-04 | POST `/api/tickets` | Invalid `priority` | 400 |
| CR-05 | POST `/api/tickets` | Non-existent `createdBy` | 400 |
| CR-06 | POST `/api/tickets` | Non-existent `assignedTo` | 400 |
| CR-07 | POST `/api/tickets` | Body includes `status: "Closed"` | 400 or ignored; created status = `Open` |
| CR-08 | GET `/api/tickets/:id` | Existing ticket | 200; ticket + comments array |
| CR-09 | GET `/api/tickets/:id` | Missing id | 404 |
| CR-10 | PATCH `/api/tickets/:id` | Update title and priority | 200; fields updated |
| CR-11 | PATCH `/api/tickets/:id` | PATCH with `createdBy` | 400; `createdBy` unchanged in DB |
| CR-12 | PATCH `/api/tickets/:id` | Missing ticket | 404 |
| CR-13 | PATCH `/api/tickets/:id` | `assignedTo: null` unassigns | 200; `assignedTo` null in DB |

---

### Integration — Search and filter (`GET /api/tickets`)

| ID | Scenario | Assert |
|----|----------|--------|
| SF-01 | No `q`, no `status` | All tickets returned |
| SF-02 | Empty / whitespace `q` | All tickets (no text filter) |
| SF-03 | `q` matches title (different case) | Ticket included |
| SF-04 | `q` matches description only | Ticket included |
| SF-05 | `q` matches comment text only | Ticket **not** included |
| SF-06 | `status=Open` | Only Open tickets |
| SF-07 | `q` + `status` combined | AND logic — both must match |
| SF-08 | Invalid `status` param | 400 |

---

### Integration — Comments

| ID | Endpoint | Scenario | Assert |
|----|----------|----------|--------|
| CM-01 | POST `.../comments` | Valid comment | 201; returns comment object |
| CM-02 | POST `.../comments` | Missing `message` | 400 |
| CM-03 | POST `.../comments` | Non-existent ticket | 404 |
| CM-04 | GET `/api/tickets/:id` | Two comments created sequentially | `comments` ordered `createdAt` ascending |

---

### Integration — Users

| ID | Scenario | Assert |
|----|----------|--------|
| US-01 | GET `/api/users` | Returns seeded users array | 200; at least one user |

---

## Edge Case Tests

Cases from `requirements-analysis.md` and `api-contract.md`. Implement as integration tests where automatable; otherwise manual.

| ID | Area | Scenario | Expected | Tier |
|----|------|----------|----------|------|
| EC-01 | Search | Special characters in `q` (e.g. `%`, `_`) | No SQL error; parameterized query safe | Integration |
| EC-02 | Search | No matches | 200; empty `tickets` array | Integration |
| EC-03 | Assignee | Optional — create without assignee | 201; `assignedTo` null | Integration |
| EC-04 | Status | Transition on terminal `Closed` ticket | 400 `INVALID_TRANSITION` | Integration |
| EC-05 | Status | Transition on terminal `Cancelled` ticket | 400 `INVALID_TRANSITION` | Integration |
| EC-06 | Update | Empty PATCH body | 400 | Integration |
| EC-07 | Comment | Non-existent `createdBy` | 400 | Integration |
| EC-08 | Concurrency | Two rapid status updates | Last write wins; no server crash | Manual / optional |
| EC-09 | Persistence | Data after API restart | Tickets still in DB | Manual |
| EC-10 | UI | Invalid transition shows error; status unchanged on screen | Error visible; no silent failure | Manual |

---

## Manual Test Checklist (UI)

Walkthrough against `acceptance-criteria.md` and `ui-flow.md`. Document in `test-results.md` or PR notes.

| # | Flow | Verify |
|---|------|--------|
| M-01 | Ticket list | Loads from DB; loading and empty states |
| M-02 | Search | Case-insensitive; title/description only; empty returns all |
| M-03 | Status filter | Narrows list; works with search |
| M-04 | Create ticket | Dropdowns for users/priority; validation errors shown |
| M-05 | Ticket detail | Comments chronological; no-comments empty state |
| M-06 | Edit ticket | Status not editable; createdBy not editable |
| M-07 | Status action | Dedicated control; only valid options; error on failure |
| M-08 | Add comment | Appears immediately after submit |
| M-09 | Not found | Invalid ticket URL handled gracefully |
| M-10 | No user management | No user CRUD screens or routes |

---

## Acceptance Criteria Traceability

| Acceptance section | Automated tests | Manual |
|--------------------|-----------------|--------|
| Core — Ticket CRUD | CR-01 – CR-13 | M-04, M-05, M-06 |
| Core — Status State Machine | SM-V01 – SM-V05, SM-I01 – SM-I10, SM-E01 – SM-E04, SU-01 – SU-02 | M-07 |
| Core — Search and Filter | SF-01 – SF-08 | M-02, M-03 |
| Core — Comments | CM-01 – CM-04 | M-05, M-08 |
| Core — Users | US-01 | M-04, M-10 |
| Core — Priority | CR-04, CR-10 | M-04 |
| Validation | CR-03 – CR-07, CR-11, CM-02 | M-04 |
| Not Found | CR-09, CR-12, SM-E03, CM-03 | M-09 |
| Testing (Jest integration) | All SM-* cases | — |

---

## Tests Not Covered (and why)

| Area | Why not covered in Core automation |
|------|-------------------------------------|
| React component rendering | Not mandatory for Core; manual UI walkthrough sufficient |
| Full E2E (Cypress/Playwright) | Optional; adds setup cost beyond Core 8–12 hour scope |
| Authentication / RBAC | Out of scope — no auth implemented |
| User CRUD | Out of scope — no write endpoints |
| Pagination / sorting | Stretch — not implemented |
| Performance / load | Not required by acceptance criteria |
| Visual regression | Not required |
| CI pipeline execution | Stretch; tests run locally via `npm test` |
| Every possible invalid transition | Representative invalid set (SM-I01 – SM-I10) plus terminal states; full permutation matrix redundant once transition map is unit-tested |
| Frontend-only validation | Backend is authority; client checks are UX-only |

---

## Implementation Order

Per `implementation-plan.md`:

1. Set up Jest + test database + `supertest` harness.
2. Implement `statusService` + unit tests (optional).
3. Implement status endpoint + **mandatory SM-V\*/SM-I\*/SM-E\*/SU-\* integration tests**.
4. Implement remaining endpoints + CR/SF/CM/US integration tests.
5. Run full suite; copy output to `test-results.md`.
6. Complete manual checklist (M-01 – M-10).

**Gate:** Phase 3 checkpoint is not met until all mandatory state-machine integration tests pass.

---

## Test Results Documentation

After running the suite, record in `test-results.md`:

- Date and environment (Node version, MySQL version)
- Command used (`npm test`)
- Total tests / passed / failed
- Summary of state machine test results
- Any known gaps or skipped tests with reason

---

## Related Links

| Document | Purpose |
|----------|---------|
| `api-contract.md` | Expected request/response and error codes |
| `design-notes.md` | Architecture, validation, error handling |
| `acceptance-criteria.md` | Definition of done |
| `implementation-plan.md` | Phase 3 testing tasks |
| `test-results.md` | Record of test runs (populated after implementation) |
