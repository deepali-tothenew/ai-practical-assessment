# AI Prompt History

Prompt history for the **Support Ticket Management System (Core)** assessment, captured from actual Cursor Agent sessions.

**Primary tool:** Cursor (Agent mode)  
**Approach:** Specification-driven development  
**Assessment period:** 2026-07-16 → 2026-07-19

---

## Repository structure

Prompts are organized by lifecycle phase per the assessment brief:

| File | Focus | Prompts |
|------|-------|---------|
| [`planning.md`](planning.md) | Requirements, decisions, refinements, implementation plan | 4 |
| [`design.md`](design.md) | Architecture, API contract, test strategy | 4 |
| [`implementation.md`](implementation.md) | Scaffold, database, backend layers, frontend features | 18 |
| [`testing.md`](testing.md) | Jest setup, integration tests, test environment | 5 |
| [`debugging.md`](debugging.md) | Targeted fix prompts after review or manual testing | 4 |
| [`code-review.md`](code-review.md) | Spec-compliance reviews | 8 |
| [`documentation.md`](documentation.md) | Lifecycle docs and submission artifacts | 13 |

**Total:** 56 prompt entries across 7 lifecycle files.

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
| Targeted refinement | “Make ONLY the refinements listed below.” |
| Correction-only review | “Identify only required corrections.” |
| Fix-only follow-up | “Fix the environment configuration only.” |
| UX fix without contract change | “Do not modify business logic or API contracts.” |

---

## Related artifacts

| Document | Purpose |
|----------|---------|
| [`tool-workflow.md`](../tool-workflow.md) | AI-assisted workflow narrative |
| [`final-ai-usage-summary.md`](../final-ai-usage-summary.md) | AI usage summary by lifecycle phase |
| [`review-fixes.md`](../review-fixes.md) | Review findings and fixes applied |
| [`code-review-notes.md`](../code-review-notes.md) | Full review session detail (R1–R7) |
| [`debugging-notes.md`](../debugging-notes.md) | Issue diagnosis and resolution |
