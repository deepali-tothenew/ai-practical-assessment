# Debugging Prompts

Targeted fix prompts issued after review findings or manual testing. Each resolved a specific issue without scope creep.

---

## DEBUG-01 — Fix environment configuration

**Date:** 2026-07-17  
**Related:** `debugging-notes.md` Issue #1, `review-fixes.md` R1-01

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

Updated `src/backend/config/env.js` to load from `src/backend/.env`. Relocated `.env.example` files.

### Outcome

**Accepted**

---

## DEBUG-02 — Fix service layering issue

**Date:** 2026-07-18  
**Related:** `debugging-notes.md` Issue #3, `review-fixes.md` R2-01

### Prompt

```
Review the service layer and fix only the layering issue.

Comment-related repository access should remain within CommentService.

Update the implementation so TicketService retrieves comments through CommentService instead of accessing CommentRepository directly.
```

### Response summary

Refactored `ticketService.js` to call `commentService.listCommentsByTicketId(id)`.

### Outcome

**Accepted**

---

## DEBUG-03 — Manual testing UX fixes

**Date:** 2026-07-18  
**Related:** `debugging-notes.md` Issues #8–10, `review-fixes.md` R5-01–R5-04

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

- Comment form reset on successful submit
- Split initial vs refresh loading in `TicketListPage.jsx`
- `TicketSearchBar`: `type="text"` with autocorrect off
- UI polish: header, focus styles, refresh indicator

### Outcome

**Accepted** — frontend-only changes.

---

## DEBUG-04 — Generate debugging notes (documentation)

**Date:** 2026-07-19

### Prompt

```
Generate debugging-notes.md documenting the significant issues encountered and how they were resolved.
```

### Response summary

Documented 10 issues with symptoms, root cause, resolution, and prevention.

### Outcome

**Accepted** — see also `documentation.md` DOC-02.
