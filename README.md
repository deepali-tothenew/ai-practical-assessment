# Support Ticket Management System

A full-stack support ticket application built for the AI Capability Exercise (Core tier). Internal users create, update, comment on, search, and progress tickets through a backend-enforced status state machine.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MySQL |
| Tests | Jest (integration) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [MySQL](https://www.mysql.com/) 8.x (required once database setup is complete)
- npm

## Installation

Clone the repository, then install dependencies for each package:

```bash
# Integration test runner (repository root)
npm install

# Backend API
cd src/backend && npm install

# Frontend
cd src/frontend && npm install
```

## Environment Setup

Each application has its own environment file. Copy the examples and fill in values as needed.

**Backend** (`src/backend/.env`):

```bash
cp src/backend/.env.example src/backend/.env
```

Variables: `NODE_ENV`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`

**Frontend** (`src/frontend/.env`):

```bash
cp src/frontend/.env.example src/frontend/.env
```

Variables: `VITE_API_URL` (default `http://localhost:3001`)

> Do not commit `.env` files. Only `.env.example` files are tracked in version control.

## Run Commands

**Backend API** (default port 3001):

```bash
cd src/backend
npm run dev    # development with nodemon
npm start      # production start
```

**Frontend** (default port 3000):

```bash
cd src/frontend
npm run dev
```

**Tests** (from repository root):

```bash
npm test                  # all Jest tests
npm run test:integration  # integration tests only
```

**Health check:**

- API: `GET http://localhost:3001/health`
- Frontend: open `http://localhost:3000` (connectivity check page)

## Project Structure

```
ai-practical-assessment/
  README.md
  tests/integration/     # Jest integration tests
  src/
    backend/             # Express API
    frontend/            # React (Vite) SPA
  database/              # Schema and seed scripts (to be added)
```

## Documentation

See repository root and `tool-specific/cursor-workflow/` for requirements, API contract, design notes, and implementation plan.
