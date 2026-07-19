# Design Prompts

Architecture, API contract, and test strategy design. Phase 0 gate: no application code until `api-contract.md` and `design-notes.md` were complete.

**Assessment period:** 2026-07-17

---

## DESIGN-01 — Generate design notes

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

## DESIGN-02 — Generate API contract

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

## DESIGN-03 — Generate test strategy

**Date:** 2026-07-17

### Prompt

```
Generate test-strategy.md based on the assessment document and the existing project artifacts (acceptance-criteria.md, api-contract.md, design-notes.md, and implementation-plan.md).

Ensure the strategy covers the mandatory state transition validation and all documented business rules.
```

### Response summary

Created test case matrix (SM-V, SM-I, SM-E, SU, CR, SF, CM, US, EC IDs), manual checklist, and integration test scope.

### Outcome

**Accepted**

---

## DESIGN-04 — Refine design notes

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

**Accepted** — closed Phase 0 design gate before implementation.
