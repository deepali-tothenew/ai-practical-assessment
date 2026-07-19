# Candidate Information

Name: Deepali Bansal
Role: Full Stack JS Developer
Primary Technology Stack: React, Node.js, MySQL

Primary AI Tool Used: Cursor  
Project Option Selected: Core

Assessment Start Date: 2026-07-16
Submission Date: 2026-07-19

## Project Summary

A full-stack Support Ticket Management System built as part of the AI Capability Exercise. The application allows internal users to create, view, update, comment on, search, and filter support tickets. Ticket status changes follow a strict backend-enforced state machine. Core scope only — no authentication or Stretch features in the first delivery.

## Tools Used

- **Frontend:** React
- **Backend:** Node.js
- **Database:** MySQL
- **Testing:** Jest (integration tests for state machine; Core tier)
- **AI Tool:** Cursor (spec-driven workflow)

## Setup Summary

1. Install dependencies at repository root, `src/backend/`, and `src/frontend/`.
2. Copy `src/backend/.env.example` → `.env` and `src/backend/.env.test.example` → `.env.test`; copy `src/frontend/.env.example` → `.env`.
3. Create `support_tickets` and `support_tickets_test` MySQL databases; import `database/schema.sql` and `database/seed.sql` into each.
4. Start backend (`cd src/backend && npm run dev`), then frontend (`cd src/frontend && npm run dev`).
5. Run integration tests from repository root: `npm test` (requires `.env.test` configured).

See [`README.md`](README.md) and [`database/setup-notes.md`](database/setup-notes.md) for full instructions and verification steps.
