# Code Review Prompts

AI-assisted spec-compliance reviews. All reviews used the pattern: identify **required corrections only**; ignore optional improvements.

---

## REVIEW-01 — Scaffold review

**Date:** 2026-07-17  
**Session:** R1

### Prompt

```
Review the generated project setup.

Verify that it is consistent with implementation-plan.md, design-notes.md, api-contract.md, and test-strategy.md.

Check for unnecessary complexity, architectural inconsistencies, missing configuration, or files that should not exist yet.

Do not add new features.
```

### Response summary

Identified env path issue, missing Jest/README, redundant files.

### Outcome

**Accepted** — fixes applied (see `debugging.md` DEBUG-01, `implementation.md` IMPL-03).

---

## REVIEW-02 — Backend implementation review

**Date:** 2026-07-18  
**Session:** R2

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

Identified `TicketService` → `CommentRepository` layering violation.

### Outcome

**Changed** — fix in `debugging.md` DEBUG-02.

---

## REVIEW-03 — Full backend review

**Date:** 2026-07-18  
**Session:** R3

### Prompt

```
Review the backend against the approved project documentation.

Verify architecture, API contract, business rules, validation, and integration tests.
Identify only required corrections. Ignore optional improvements.
```

### Response summary

Backend compliant; remaining gap was test coverage (not application code).

### Outcome

**Accepted** — drove `testing.md` TEST-04 and TEST-05.

---

## REVIEW-04 — Ticket List review

**Date:** 2026-07-18  
**Session:** R4

### Prompt

```
Review the Ticket List implementation against the approved documentation.

Identify only required corrections.
Ignore optional improvements.
```

### Response summary

No required corrections. Compliant with `ui-flow.md`.

### Outcome

**Accepted**

---

## REVIEW-05 — Frontend regression review

**Date:** 2026-07-18  
**Session:** R6

### Prompt

```
Review the recent frontend changes.

Verify that the reported UI/UX and search issues have been resolved without introducing regressions.
Identify only required corrections.
```

### Response summary

All UX fixes verified. No regressions.

### Outcome

**Accepted**

---

## REVIEW-06 — Full application review

**Date:** 2026-07-18  
**Session:** R7

### Prompt

```
Review the complete application against the approved project documentation.

Verify the frontend, backend, API integration, and UI behavior.

Identify only required corrections. Ignore optional enhancements or refactoring.
```

### Response summary

Core application approved. **No required code corrections.**

### Outcome

**Accepted**

---

## REVIEW-07 — Document accuracy review

**Date:** 2026-07-19

### Prompt

```
Review the documents against the completed project.

Verify that it reflects the actual implementation and contains no assumptions or unsupported statements.
Identify only required corrections.
```

### Response summary

Identified stale claims in README, reflection, pr-description, and other docs. No code corrections required.

### Outcome

**Accepted** — corrections applied in subsequent documentation prompts.

---

## REVIEW-08 — Generate code review notes (documentation)

**Date:** 2026-07-19

### Prompt

```
Generate code-review-notes.md summarizing the issues found, fixes applied, and final review outcome.
```

### Response summary

Created review sessions R1–R7, consolidated issue register, final outcome.

### Outcome

**Accepted** — see also `documentation.md` DOC-03, `review-fixes.md`.
