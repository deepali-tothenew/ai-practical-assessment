# Phase 0 — Planning Prompts

Specification and planning phase. No application code was generated until `api-contract.md` and `design-notes.md` were complete.

---

## P0-01 — Assessment intake

**Date:** 2026-07-16

### Prompt

```
Read the attached assessment document carefully.

This conversation will be used throughout the project.

Before generating any code, I want to follow a specification-driven development approach.

Understand:
- Project requirements
- Mandatory deliverables
- Repository structure
- Documentation expectations
- Cursor-specific workflow requirements

Do not generate any code.

Acknowledge your understanding and summarize the project in your own words.
Mention any ambiguities or assumptions that should be clarified before implementation.
```

### Response summary

Cursor read the assessment brief (Word document), summarized Core vs Stretch scope, mandatory lifecycle artifacts, repository structure, testing expectations, and Cursor-specific workflow requirements. Listed ambiguities (search location, status UX, user seeding, test tier).

### Outcome

**Accepted** — established spec-first approach. No code generated.

---

## P0-02 — Record implementation decisions

**Date:** 2026-07-16

### Prompt

```
These are the implementation decisions for this assessment.

1. Project option: Proceed with "Support Ticket Management"
2. Technology stack: React, Node.js, MySQL
3. Database choice: MySQL
4. User entity behavior: Users are seeded only.
   The UI will display seeded users in dropdowns for Created By and Assigned To.
   No user management functionality will be implemented.
5. Status change UX: Status changes will be implemented as a dedicated action separate from ticket editing.
   The backend remains the source of truth and validates all transitions.
6. Keyword search scope: Keyword search will apply to ticket title and description only.
   Comments are excluded from keyword search.
7. Assignee semantics: assignedTo is optional.
   If provided, it must reference an existing seeded user.
8. Priority values: Low, Medium, High, Critical
9. Duplicate artifact files: Maintain both acceptance-criteria.md and tool-specific/cursor-workflow/acceptance-criteria.md
10. data-model.md and ui-flow.md: treat them as required
11. Test framework & tier: Jest
12. Candidate metadata: use placeholders
13. Git workflow: Use feature-based commits with clear commit messages.
14. Stretch scope: Core-only for the first delivery

Record these decisions as project assumptions where appropriate.
```

### Response summary

Created and updated specification artifacts: `requirements-analysis.md`, `data-model.md`, `ui-flow.md`, `candidate-info.md`, `tool-specific/cursor-workflow/project-context.md`, `spec.md`, `acceptance-criteria.md` (root + cursor-workflow copy), and related planning files. Recorded all 14 decisions in assumptions and supporting docs.

### Outcome

**Accepted** — decisions became the source of truth for all subsequent phases.

---

## P0-03 — Targeted specification refinements

**Date:** 2026-07-16

### Prompt

```
I have manually reviewed the current specification documents and identified several improvements before moving to the remaining planning artifacts.

Review the existing documents and make ONLY the refinements listed below.

Do not regenerate the documents.
Do not change the overall structure.
Do not introduce new requirements or assumptions.
Only update the relevant sections while keeping all documents consistent with each other.

[Refinements for requirements-analysis.md, acceptance-criteria.md, data-model.md, ui-flow.md, and cross-document consistency — including Constraints, Business Rules, search/comment/not-found criteria, INT AUTO_INCREMENT, loading/empty states, priority values, search scope, chronological comments, dedicated status endpoint, and backend as source of truth.]
```

### Response summary

Applied targeted edits across `requirements-analysis.md`, `acceptance-criteria.md`, `data-model.md`, and `ui-flow.md`. Added Constraints and Business Rules sections, expanded acceptance criteria, concretized PK types, and added loading/empty states to UI flow.

### Outcome

**Accepted** — human-reviewed refinements only; no wholesale regeneration.

---

## P0-04 — Generate implementation plan

**Date:** 2026-07-17

### Prompt

```
Generate implementation-plan.md based on the assessment document and the existing project artifacts (project-context.md, spec.md, tasks.md, requirements-analysis.md, acceptance-criteria.md).
```

### Response summary

Created phased delivery plan (Phases 0–5), milestones, AI usage plan, risks, and definition of done aligned with existing specs.

### Outcome

**Accepted**

---

## P0-05 — Generate design notes

**Date:** 2026-07-17

### Prompt

```
Generate design-notes.md based on the assessment document and the existing project artifacts (project-context.md, spec.md, requirements-analysis.md, data-model.md, ui-flow.md, and implementation-plan.md).

Ensure it remains consistent with all previously created artifacts.
```

### Response summary

Created architecture document: repository layout, layered backend design, state machine, frontend component structure, search design, error handling approach.

### Outcome

**Accepted**

---

## P0-06 — Generate API contract

**Date:** 2026-07-17

### Prompt

```
Generate api-contract.md based on the assessment document and the existing project artifacts (spec.md, design-notes.md, acceptance-criteria.md, and data-model.md).

Ensure every endpoint aligns with the documented business rules and acceptance criteria.
```

### Response summary

Defined all REST endpoints, request/response shapes, error codes, status state machine rules, and validation contracts for 7 business endpoints plus health check.

### Outcome

**Accepted** — became the implementation contract for backend and frontend API layer.

---

## P0-07 — Generate test strategy

**Date:** 2026-07-17

### Prompt

```
Generate test-strategy.md based on the assessment document and the existing project artifacts (acceptance-criteria.md, api-contract.md, design-notes.md, and implementation-plan.md).

Ensure the strategy covers the mandatory state transition validation and all documented business rules.
```

### Response summary

Created test case matrix (SM-V, SM-I, SM-E, SU, CR, SF, CM, US, EC IDs), manual checklist, and integration test scope aligned with acceptance criteria.

### Outcome

**Accepted**

---

## P0-08 — Refine design notes

**Date:** 2026-07-17

### Prompt

```
Review design-notes.md and make only the following refinements.

Do not regenerate the document.
Do not change the existing structure.
Do not introduce new requirements or assumptions.

1. Search Design — trim input; case-insensitive without modifying stored data
2. Repository Layer — data access only; business rules in Service layer
3. Error Handling — HTTP 500 for unhandled errors with logging
4. Environment Configuration — NODE_ENV usage; ports overridable via env

Only update the relevant sections and provide a brief summary of the changes.
```

### Response summary

Updated targeted sections in `design-notes.md` for search trim semantics, layer responsibilities, error handling, and environment configuration.

### Outcome

**Accepted** — closed Phase 0 planning gate before implementation.
