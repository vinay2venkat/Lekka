# 08 – Progress (live)

Last updated: 2026-11-12 · Updated by: Claude (slice 0.2 session)

## Current status

- **Phase:** 0 – Foundations
- **Next slice:** 0.3 Design tokens, theme, shell, logo
- **In progress:** none
- **Blockers:** none. Slice 0.2 is in PR #1 (https://github.com/vinay2venkat/Lekka/pull/1), CI green, awaiting merge.

## Rules for maintaining this file

- Claude regenerates this whole file at the end of every session in which anything changed, and the user replaces it in project knowledge (or Claude Code edits `docs/08-progress.md` directly).
- Statuses: Not started · In progress · Needs test run · Done · Blocked.
- "Done" only when code exists and tests have passed. "Needs test run" when code is delivered but no passing test output has been reported.
- New decisions get the next ADR number. At the end of each phase, ADRs are folded into 02 and any affected knowledge file.

## Slice tracker

| Slice | Name | Status | Tests | Notes |
| --- | --- | --- | --- | --- |
| 0.1 | Specification review | Done | n/a (no code) | All 15 defaults accepted (ADR-021 to 035). Spec edits applied to 01–05. Pinned package list in the review doc "Lekka – Specification review (slice 0.1)". |
| 0.2 | Repo scaffold, lint, CI | Done | Local and GitHub Actions: lint, typecheck, Vitest 5/5, build, Playwright 4/4 pass | PR #1, CI green on first run. |
| 0.3 | Design tokens, theme, shell, logo | Not started | – | – |
| 0.4 | domain/money and domain/periods | Not started | – | – |
| 0.5 | Dexie schema v1, repositories, codec | Not started | – | – |
| 0.6 | i18n, PWA shell, CSP | Not started | – | – |
| 1.1 | Onboarding, household, members, solo mode, shared-device mode | Not started | – | – |
| 1.2 | Categories, payment methods, accounts, merchants | Not started | – | – |
| 1.3 | Quick Add | Not started | – | – |
| 1.4 | Transaction list, search, edit, delete | Not started | – | – |
| 1.5 | Budgets and alerts | Not started | – | – |
| 1.6 | Home screen | Not started | – | – |
| 1.7 | JSON backup, restore, Data safety | Not started | – | – |
| 1.8 | Demo mode | Not started | – | – |
| 2.1 | Key hierarchy, passphrase, recovery | Not started | – | – |
| 2.2 | Encrypt/decrypt migrations | Not started | – | – |
| 2.3 | Passkey unlock | Not started | – | – |
| 2.4 | Auto-lock, multi-tab lock | Not started | – | – |
| 2.5 | .lekka encrypted backup | Not started | – | – |
| 2.6 | CSP and header audit | Not started | – | – |
| 3.1 | Backend scaffold, auth, devices | Not started | – | – |
| 3.2 | Invitations, joining, key envelopes | Not started | – | – |
| 3.3 | Outbox, push, pull | Not started | – | – |
| 3.4 | Conflicts UI | Not started | – | – |
| 3.5 | Roles, revocation, rotation | Not started | – | – |
| 3.6 | Snapshots and recovery | Not started | – | – |
| 3.7 | Push reminders | Not started | – | – |
| 3.8 | Solo-to-family upgrade, multiple spaces | Not started | – | – |
| 4.1 | Income | Not started | – | – |
| 4.2 | Transfers and ATM withdrawals | Not started | – | – |
| 4.3 | Refunds | Not started | – | – |
| 4.4 | Cards, statements, bill payments | Not started | – | – |
| 4.5 | Loans and EMIs | Not started | – | – |
| 4.6 | Recurring and reminders | Not started | – | – |
| 4.7 | Goals and sinking funds | Not started | – | – |
| 4.8 | CSV/XLSX import and export | Not started | – | – |
| 4.9 | Insights and charts | Not started | – | – |
| 5.1 | Advisor engine and golden tests | Not started | – | – |
| 5.2 | Advisor UI and wishlist | Not started | – | – |
| 5.3 | NL parser and share target | Not started | – | – |
| 5.4 | AI gateway, adapter, BYOK | Not started | – | – |
| 5.5 | Ask Lekka | Not started | – | – |
| 5.6 | AI phrasing | Not started | – | – |
| 6.1 | Tamil | Not started | – | – |
| 6.2 | Hindi | Not started | – | – |
| 6.3 | Kannada | Not started | – | – |
| 6.4 | Telugu | Not started | – | – |
| 6.5 | Splits and member balances | Not started | – | – |
| 6.6 | Member/subcategory/custom budgets | Not started | – | – |
| 6.7 | Receipts and OCR | Not started | – | – |
| 6.8 | Bank statement import | Not started | – | – |
| 6.9 | Trips and foreign currency | Not started | – | – |
| 6.10 | Performance and accessibility audits | Not started | – | – |
| 6.11 | External security review | Not started | – | – |

## Test status

| Suite | Last run | Result |
| --- | --- | --- |
| Domain unit + property (Vitest) | – | – |
| Storage (Vitest + fake-indexeddb) | – | – |
| Components (RTL + axe) | 2026-11-12 (CI, PR #1) | Pass: 5/5 (scaffold smoke, harness, cn) |
| End-to-end (Playwright) | 2026-11-12 (CI, PR #1) | Pass: 4/4 (smoke + axe, desktop and Pixel 7) |
| Backend (Pytest, from Phase 3) | – | – |

## Session log (newest first)

| Date | Slice | Summary |
| --- | --- | --- |
| 2026-11-12 | 0.2 | Scaffold in `frontend/`: Vite 8 + React 19 + TS 6 strict, Tailwind 4, shadcn/ui config + `cn`, ESLint 10 (strict type-checked, jsx-a11y, react-hooks, domain/data boundary rules, no dangerouslySetInnerHTML), Prettier, Vitest + fake-indexeddb + RTL + axe, Playwright (desktop + Pixel 7) with axe, GitHub Actions CI, Dependabot. All checks pass locally. ADR-036, 037. |
| 2026-11-12 | 0.1 | Vinay accepted all defaults. ADR-021 to 035 recorded; replacement text applied directly to 01, 02, 03, 04, 05 in project files (gap and edge-case defaults included). 0.1 Done. |
| 2026-11-12 | 0.1 | Spec review delivered. Key findings: 04 CSP would block Radix scroll-lock styles and libsodium WASM; header `period` clashes with budget-period naming; shared-device mode needs App Lock that ships in Phase 2. Packages pinned against live npm (TS 6.0.3 and ESLint 9 for plugin compatibility). |
| 2026-11-12 | Setup | ADR-020: individual users covered: solo mode (1.1), solo-to-family upgrade and personal + family spaces (3.8). |
| 2026-11-12 | Setup | ADR-019: one person per phone by default. Roadmap reordered: App Lock is Phase 2, family sync Phase 3, money model Phase 4, intelligence Phase 5. |
| 2026-11-12 | Setup | Knowledge pack v2 created. Decisions ADR-013 to ADR-018 recorded. |

## Decisions log

| ADR | Date | Decision |
| --- | --- | --- |
| 013 | 2026-11-12 | One App Lock per shared device; profiles there are attribution, not security (amended by ADR-019) |
| 014 | 2026-11-12 | Expense splits and member balances off; deferred to Phase 6 (data model reserved) |
| 015 | 2026-11-12 | AI via provider-independent OpenAI-compatible adapter; default Groq free tier with Zero Data Retention; Gemini free tier for development with synthetic data only; BYOK supported; never send real data to a tier that trains on inputs |
| 016 | 2026-11-12 | Sync backend and AI gateway hosted in an India region |
| 017 | 2026-11-12 | v1 English only; Tamil, Hindi, Kannada, Telugu in Phase 6; i18n infrastructure from Phase 0 |
| 018 | 2026-11-12 | Progress tracked here, regenerated by Claude every session |
| 019 | 2026-11-12 | Each member uses their own phone by default; shared-device mode is opt-in. Multi-member households require sign-in and Encrypted Sync. Phases reordered: 2 App Lock, 3 Family sync, 4 Money model, 5 Intelligence |
| 020 | 2026-11-12 | Individuals fully supported: solo mode without sign-in, solo-to-family upgrade keeping history, multiple spaces per device (personal + family) that never mix or cross-sync |
| 021 | 2026-11-12 | Shared-device mode ships in Phase 1 without App Lock, with a visible note that anyone using the device sees every profile; App Lock becomes mandatory for it in 2.4 |
| 022 | 2026-11-12 | ADR-019 clarified: only members on other phones need sign-in and sync; "paid by"-only members and shared-device members do not |
| 023 | 2026-11-12 | Phase 1 onboarding first screen: Start a new household / Just me on this phone; Join my family's household added in 3.2 |
| 024 | 2026-11-12 | Record header field `period` renamed `month` (YYYY-MM of the record's date, null for undated records); "period" means budget period only |
| 025 | 2026-11-12 | Device owner, active space, shared-device and demo flags live in unsynced `deviceSettings` and `spaceDevices` tables in Dexie schema v1 |
| 026 | 2026-11-12 | Discretionary (for forecasts) = expense without `occurrenceId` and not `oneOff` |
| 027 | 2026-11-12 | Daily safe-to-spend = floor((household budget − consumption − committed) ÷ days left incl. today) in rupees; hidden when ≤ 0 or no household budget |
| 028 | 2026-11-12 | Annual (FY) reports use calendar dates, not budget periods |
| 029 | 2026-11-12 | Net category spending may go negative after a refund; shown as "₹X refunded", never clamped |
| 030 | 2026-11-12 | One IndexedDB database for all spaces, scoped by `householdId`; demo mode keeps a separate database |
| 031 | 2026-11-12 | Hosting Cloudflare Pages (real CSP headers), Node 24 LTS, pnpm |
| 032 | 2026-11-12 | CSP adds `'wasm-unsafe-eval'` to `script-src` from Phase 2 for libsodium WASM |
| 033 | 2026-11-12 | CSP `style-src 'self' 'unsafe-inline'` (styles only) for Radix scroll lock; revisit in 2.6 |
| 034 | 2026-11-12 | Argon2id via libsodium `crypto_pwhash`; hash-wasm dropped |
| 035 | 2026-11-12 | TypeScript 6.0 until typescript-eslint supports TS 7 (ESLint part amended by ADR-036) |
| 036 | 2026-11-12 | ESLint 10.13 instead of 9: ESLint 9 is end-of-life. eslint-plugin-jsx-a11y (last release Oct 2024) is allowed with ESLint 10 through a pnpm peer override, verified to fire rules; replace it if it breaks |
| 037 | 2026-11-12 | Frontend lives in `frontend/` (pnpm, exact pins, `.npmrc` save-exact). Dependabot (not Renovate) with a 14-day cooldown for npm and monthly GitHub Actions updates; CI runs format, lint, typecheck, coverage, build, `pnpm audit --prod`, Playwright |

## Open issues

- 06-ai-purchase-advisor.md is missing from project knowledge (listed in 00, referenced by instructions and `AdvisorVerdict` in 03). Needed before Phase 5.
- `index.html` uses an empty `data:` favicon until the logo lands in 0.3; replace it there (and keep CSP `img-src` in mind in 0.6).
- Initial JS is 68.7 KB gzipped with React alone; budget is 200 KB for shell + Quick Add (05).

## Knowledge file changes pending

- (none) The ADR-021–035 edits were applied directly to 01–05 in project files. If you also keep copies in Claude Project knowledge or the repo `docs/`, replace 01–05 and 08 there.

## Environment notes

- Decided (ADR-031): Node 24 LTS in CI (`frontend/.nvmrc`), pnpm 10.34.9 via `packageManager`, Cloudflare Pages.
- Claude's dev container: Linux, Node 22.23 (engines allow ≥ 22.12), Chromium build 1243 for Playwright 1.64.1. Locally run e2e with `PW_CHROMIUM_PATH` pointing to a Chromium binary, or run `pnpm exec playwright install chromium`.
- Browsers covered by e2e: Desktop Chrome and Pixel 7 (Chromium). Safari/iOS coverage to be added when the shell exists (0.3+).
- Package pins for 0.2 onward: see the 0.1 review doc, section "Pinned package list" (checked against npm on 2026-11-12; each pin ≥ 2 weeks old).
