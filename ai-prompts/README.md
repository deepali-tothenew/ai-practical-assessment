# AI Prompt History

Prompt history for the **Support Ticket Management System (Core)** assessment, captured from the actual Cursor Agent sessions used during development.

**Primary tool:** Cursor (Agent mode)  
**Approach:** Specification-driven development  
**Assessment period:** 2026-07-16 → 2026-07-19

---

## Organization

Prompts are grouped by development phase, aligned with `implementation-plan.md`:

| File | Phase | Focus |
|------|-------|-------|
| [`phase-0-planning.md`](phase-0-planning.md) | Phase 0 | Assessment intake, implementation decisions, spec generation and refinement |
| [`phase-1-scaffolding.md`](phase-1-scaffolding.md) | Phase 1 | Backend/frontend scaffold, env fix, Jest, cleanup |
| [`phase-2-database.md`](phase-2-database.md) | Phase 2 | Schema, seed, connection pool |
| [`phase-3-backend.md`](phase-3-backend.md) | Phase 3 | Layered API, reviews, integration tests |
| [`phase-4-frontend.md`](phase-4-frontend.md) | Phase 4 | API client, views, manual testing fixes |
| [`phase-5-documentation.md`](phase-5-documentation.md) | Phase 5 | Workflow docs, reviews, submission artifacts |

---

## Entry format

Each entry records:

1. **Prompt** — verbatim or lightly trimmed user message
2. **Response summary** — what the AI produced
3. **Outcome** — accepted, changed, or rejected by the candidate

---

## Cross-cutting patterns

| Pattern | Example |
|---------|---------|
| Scoped implementation | “Implement the repository layer only.” |
| Spec-targeted generation | “Generate api-contract.md based on …” |
| Targeted refinement | “Make ONLY the refinements listed below. Do not regenerate.” |
| Correction-only review | “Identify only required corrections.” |
| Fix-only follow-up | “Fix the environment configuration only.” |
| UX fix without contract change | “Do not modify business logic, API contracts, or backend behavior.” |

See `tool-workflow.md` for the full workflow narrative.
