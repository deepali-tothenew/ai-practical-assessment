# Cursor Rules and Instructions

> Guidance for AI-assisted development on this assessment. May be promoted to `.cursor/rules/` when implementation begins.

## Before Writing Code

1. Read `tool-specific/cursor-workflow/project-context.md` and `spec.md`.
2. Read `data-model.md`, `ui-flow.md`, and `api-contract.md` for the area being implemented.
3. Check `acceptance-criteria.md` for the feature being built.
4. Do not implement Stretch scope unless explicitly requested.

## Stack Constraints

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Tests:** Jest (integration tests for state machine are mandatory)

## Non-Negotiable Business Rules

### Status state machine

```
Open         → In Progress | Cancelled
In Progress  → Resolved    | Cancelled
Resolved     → Closed
```

- Enforce on the **backend**; integration tests must cover valid and invalid transitions.
- Status changes use a **dedicated API endpoint**, not the general ticket update endpoint.
- Frontend status control is separate from the Edit Ticket form.

### Search

- Keyword search: ticket `title` and `description` only (case-insensitive).
- Do not include comments in search.

### Comments

- Display in chronological order (`createdAt` ascending).

### Users

- Seeded only — no user-management UI or API in Core.
- Dropdowns for Created By, Assigned To, and comment author.

### Priority

- Allowed values: `Low`, `Medium`, `High`, `Critical`.

### Assignee

- Optional (`assignedTo` nullable).
- When provided, must reference an existing seeded user.

## Code Quality

- Follow existing patterns within the repo once established.
- Minimal, reviewable diffs — no unrelated refactors.
- No secrets in code, tests, or commits.
- Parameterized SQL queries — no string concatenation for user input.
- Meaningful HTTP status codes and error messages from the API.

## Documentation Discipline

- Update spec/tasks when design decisions change.
- Keep root and `tool-specific/cursor-workflow/acceptance-criteria.md` in sync.
- Capture significant prompts under `ai-prompts/` with: prompt, response summary, accepted/rejected/changed and why.

## Git

- Feature-based commits with clear messages describing the change.
- No special branching strategy required.

## What to Avoid

- Adding authentication or Stretch features without approval.
- Allowing status changes through the general ticket update endpoint.
- Copy-pasting AI output without validation.
- Expanding the app at the expense of lifecycle artifacts.
