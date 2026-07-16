# Project Context — Support Ticket Management

> Persistent context for Cursor-assisted, spec-driven development.

## Project

**AI Capability Exercise — Support Ticket Management System (Core only)**

Repository: `ai-practical-assessment`

## Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React      |
| Backend  | Node.js + Express |
| Database | MySQL      |
| Tests    | Jest (integration tests for state machine) |

## Scope

**In scope (Core):** Ticket CRUD, comments, dedicated status transitions, keyword search (title + description), status filter, seeded users in dropdowns, backend validation, MySQL persistence, lifecycle documentation.

**Out of scope (first delivery):** Authentication, user CRUD, Stretch features (pagination, Docker, CI, OpenAPI, etc.).

## Confirmed Implementation Decisions

1. **Project:** Support Ticket Management
2. **Stack:** React + Node.js + Express + MySQL
3. **Users:** Seeded only; dropdowns for Created By and Assigned To; no user-management UI
4. **Status UX:** Dedicated status-change action on Ticket Detail; separate from Edit Ticket form; backend enforces state machine
5. **Search:** Keyword on title and description only; comments excluded
6. **Assignee:** Optional; must reference existing seeded user when provided
7. **Priority:** Low, Medium, High, Critical
8. **Tests:** Jest integration tests for valid/invalid status transitions
9. **Git:** Feature-based commits, clear messages
10. **Artifacts:** Maintain synced `acceptance-criteria.md` (root + `tool-specific/cursor-workflow/`)

## State Machine (Backend Source of Truth)

```
Open         → In Progress | Cancelled
In Progress  → Resolved    | Cancelled
Resolved     → Closed
```

## Key Spec Documents

| Document | Purpose |
|----------|---------|
| `requirements-analysis.md` | Requirements and assumptions |
| `data-model.md` | Entities, fields, relationships |
| `ui-flow.md` | Screens and user flows |
| `api-contract.md` | REST endpoints (to be written) |
| `design-notes.md` | Architecture (to be written) |
| `tool-specific/cursor-workflow/spec.md` | Implementation spec |
| `tool-specific/cursor-workflow/tasks.md` | Task breakdown |
| `acceptance-criteria.md` | Checklist for completion |

## AI Workflow Expectations

- Read spec documents before generating code.
- Do not expand scope beyond Core without explicit approval.
- Update spec/tasks when design decisions change.
- Capture prompts under `ai-prompts/` as work progresses.
- No secrets in code or commits.
- Validate all AI-generated code; especially state-machine and validation logic.

## Candidate Metadata

Placeholders in `candidate-info.md` until submission.
