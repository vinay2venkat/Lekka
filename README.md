# Lekka

A local-first, privacy-first household expense tracker PWA for Indian families. Your financial data stays in your browser's IndexedDB; sync (later) is end-to-end encrypted.

Status: Phase 0 (foundations). See [docs/08-progress.md](docs/08-progress.md).

## Develop

Requires Node 24 LTS (see `frontend/.nvmrc`) and pnpm (`corepack enable`).

```sh
cd frontend
pnpm install
pnpm dev          # http://localhost:5173
pnpm check        # format, lint, typecheck, unit tests, build
pnpm exec playwright install chromium
pnpm e2e          # end-to-end tests against the production build
```

## Docs

The product and engineering specs live in [`docs/`](docs/), numbered 01 to 08.
