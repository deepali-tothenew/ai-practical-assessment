# Phase 4 — Frontend Prompts

React SPA implementation, reviews, and manual testing fixes.

---

## P4-01 — API client layer

**Date:** 2026-07-18

### Prompt

```
Implement the frontend API layer using the existing backend endpoints.

Follow the approved API contract.
```

### Response summary

Created `src/frontend/src/api/client.js` with `ApiError` parsing, plus `tickets.js`, `users.js`, `comments.js`, and `health.js` modules aligned to `api-contract.md` response shapes.

### Outcome

**Accepted**

---

## P4-02 — Ticket List page

**Date:** 2026-07-18

### Prompt

```
Implement the Ticket List page using the existing backend APIs.

Follow the approved specifications.
```

### Response summary

Created `TicketListPage`, `TicketList`, `TicketSearchBar`, `TicketStatusFilter` with server-side search (`q`), status filter, loading/empty states, and debounced search.

### Outcome

**Accepted**

---

## P4-03 — Create Ticket page

**Date:** 2026-07-18

### Prompt

```
Implement the Create Ticket page using the existing APIs.

Follow the approved validation rules.
```

### Response summary

Created `CreateTicketPage` and `TicketForm` with priority select, user dropdowns, client-side validation, error display, and navigation to detail on success.

### Outcome

**Accepted**

---

## P4-04 — Ticket Detail page

**Date:** 2026-07-18

### Prompt

```
Implement the Ticket Detail page.

Display ticket information and comments.
```

### Response summary

Created `TicketDetailPage`, `TicketDetailHeader`, metadata display, and comment list. Routed at `/tickets/:id`.

### Outcome

**Accepted**

---

## P4-05 — Edit Ticket page

**Date:** 2026-07-18

### Prompt

```
Implement ticket editing using the existing APIs.

Respect immutable fields and existing validation.
```

### Response summary

Created `EditTicketPage` with editable title, description, priority, and assignee. `createdBy` read-only; no status field per `ui-flow.md`.

### Outcome

**Accepted**

---

## P4-06 — Status action

**Date:** 2026-07-18

### Prompt

```
Implement the dedicated ticket status action.

Use the existing status endpoint only.
```

### Response summary

Created `StatusAction` component on Ticket Detail. Calls `PATCH /api/tickets/:id/status`. Shows valid transitions from `constants.js`; displays API errors on rejection.

### Outcome

**Accepted**

---

## P4-07 — Comments

**Date:** 2026-07-18

### Prompt

```
Implement ticket comments using the existing APIs.

Display comments in ascending createdAt order.
```

### Response summary

Created `CommentForm` and `CommentList`. Comments appended immediately after successful POST. Chronological display by `createdAt`.

### Outcome

**Accepted** — form reset fix applied later in P4-09.

---

## P4-08 — Ticket List review

**Date:** 2026-07-18

### Prompt

```
Review the Ticket List implementation against the approved documentation.

Identify only required corrections.
Ignore optional improvements.
```

### Response summary

Ticket List compliant with `ui-flow.md` and `acceptance-criteria.md`. No required corrections.

### Outcome

**Accepted**

---

## P4-09 — Manual testing fixes

**Date:** 2026-07-18

### Prompt

```
Address the issues found during manual testing.

- Improve the overall UI/UX while staying within the approved project scope.
- Clear the comment form after a successful comment submission.
- Fix the search field so it retains focus while typing.
- Fix the issue where a full stop (.) is inserted into the search field unexpectedly.

Do not modify business logic, API contracts, or backend behavior.
```

### Response summary

- Comment form reset on successful submit (`CommentForm.jsx`, `TicketDetailPage.jsx`)
- Split initial vs refresh loading in `TicketListPage.jsx` to preserve search focus
- Changed `TicketSearchBar` from `type="search"` to `type="text"` with autocorrect off
- UI polish: app header, focus styles, refresh indicator (`App.jsx`, `App.css`, `index.css`)

### Outcome

**Accepted** — documented as Issues #8–10 in `debugging-notes.md`. Frontend-only changes.

---

## P4-10 — Review frontend fixes

**Date:** 2026-07-18

### Prompt

```
Review the recent frontend changes.

Verify that the reported UI/UX and search issues have been resolved without introducing regressions.
Identify only required corrections.
```

### Response summary

All reported UX issues resolved. No regressions or required corrections.

### Outcome

**Accepted**

---

## P4-11 — Full application review

**Date:** 2026-07-18

### Prompt

```
Review the complete application against the approved project documentation.

Verify the frontend, backend, API integration, and UI behavior.

Identify only required corrections. Ignore optional enhancements or refactoring.
```

### Response summary

Core application approved. All 7 API endpoints integrated. Frontend flows match `ui-flow.md`. **No required code corrections** for Core scope.

### Outcome

**Accepted** — documented in `code-review-notes.md` (Review R7).
