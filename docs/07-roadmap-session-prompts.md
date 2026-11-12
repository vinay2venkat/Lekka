# 07 – Roadmap and Session Prompts

Seven phases, each ending in an app a household could actually use. Each phase is split into vertical slices, and each slice is one chat. Phases 0–2 need no backend. Order reflects ADR-019: because every member uses their own phone, App Lock and family sync come right after the core MVP. The live status of every slice is in 08-progress.md; this file only changes when the plan itself changes.

## Phases, slices and gates

### Phase 0 – Foundations

| Slice | Goal |
| --- | --- |
| 0.1 | Specification review: contradictions, gaps, edge cases, questions with recommended defaults, pinned package list |
| 0.2 | Repo scaffold (Vite, TS strict, Tailwind, shadcn/ui), ESLint, Prettier, Vitest, Playwright, GitHub Actions CI |
| 0.3 | Design tokens, light/dark theme, app shell and navigation layout, logo and PWA icons |
| 0.4 | `domain/money` (paise, parsing "1.5k"/"2 lakh", en-IN formatting, largest-remainder) and `domain/periods` (budget start day, FY) with property tests |
| 0.5 | Dexie schema v1 (including sync outbox and device tables, unused until Phase 3), record envelope, repositories, identity codec, migration test harness |
| 0.6 | i18n setup (English), PWA manifest and service worker (app shell only), CSP, install prompt |

**Gate:** CI green; money and period tests pass including property tests; the app installs and opens offline.

### Phase 1 – Core MVP (single device)

| Slice | Goal |
| --- | --- |
| 1.1 | Onboarding ("Start a new household" / "Just me on this phone"), household, members, colours, device owner, solo mode UI, opt-in shared-device mode with profile switcher |
| 1.2 | Categories and subcategories (defaults from 01), payment methods, basic accounts, merchants |
| 1.3 | Quick Add |
| 1.4 | Transaction list, search, filters, edit, delete with undo, Recently deleted |
| 1.5 | Household and category budgets, alerts, alert state |
| 1.6 | Home screen |
| 1.7 | JSON backup and restore, Data safety screen, storage persistence, backup reminders |
| 1.8 | Demo mode with separate database |

**Gate:** Playwright journey passes: onboard, add an expense offline, reload, see it on Home, trigger a budget alert, back up, clear data, restore. Deployed as static files.

### Phase 2 – App Lock

| Slice | Goal |
| --- | --- |
| 2.1 | Key hierarchy, passphrase, recovery key |
| 2.2 | Encrypt and decrypt migrations |
| 2.3 | Passkey (PRF) biometric unlock |
| 2.4 | Auto-lock and multi-tab lock; App Lock required when shared-device mode is on |
| 2.5 | `.lekka` encrypted backup format |
| 2.6 | CSP and security header audit |

**Gate:** a raw IndexedDB scan after enabling finds no plaintext payload fields; a wrong passphrase fails; the recovery key restores access; locking wipes the cache.

### Phase 3 – Family sync (India-hosted backend)

| Slice | Goal |
| --- | --- |
| 3.1 | Backend scaffold (FastAPI, Postgres, Docker), auth (passkeys + magic link), device registration |
| 3.2 | Household creation on the server, invitations, "Join my family's household" onboarding, key envelopes, safety code |
| 3.3 | Outbox, push, pull, idempotency; generic over record kinds so later features sync automatically |
| 3.4 | Conflicts UI and duplicate merge |
| 3.5 | Roles enforced across devices, revocation and key rotation, Devices screen |
| 3.6 | Snapshots and household recovery |
| 3.7 | Optional push reminders |
| 3.8 | Solo-to-family upgrade and multiple spaces per device (personal + family) |

**Gate:** two-browser Playwright test: two members on separate devices, offline edits on both, reconnect, data converges; a same-field conflict is surfaced; a Viewer's edit is rejected by other devices; a revoked device is refused and cannot decrypt the new epoch; a dump of the server database contains none of the test's canary strings; a solo space upgrades to a family household without data loss; a personal space on the same phone never appears on another member's device.

### Phase 4 – Full money model

| Slice | Goal |
| --- | --- |
| 4.1 | Income |
| 4.2 | Transfers and ATM withdrawals |
| 4.3 | Refunds (full and partial) |
| 4.4 | Card accounts, statements, bill payments |
| 4.5 | Loans and EMIs |
| 4.6 | Recurring rules, occurrences, reminders, mark as paid |
| 4.7 | Savings goals and sinking funds |
| 4.8 | CSV/XLSX import (mapping, preview, duplicates) and export |
| 4.9 | Insights screen and charts |

**Gate:** property tests prove transfers never change spending and refunds never exceed originals; a 3-month golden ledger fixture reproduces expected report figures exactly; every new record kind syncs between two devices.

### Phase 5 – Intelligence

| Slice | Goal |
| --- | --- |
| 5.1 | Advisor engine with golden scenarios from 06 (no AI) |
| 5.2 | Advisor UI and wishlist with cooling-off |
| 5.3 | Local NL parser and Android share target |
| 5.4 | AI gateway on the existing backend, OpenAI-compatible adapter, Groq configuration, BYOK |
| 5.5 | Ask Lekka: tools, consent, pseudonymisation, number verification, offline presets |
| 5.6 | AI phrasing for insights and advisor reasons |

**Gate:** advisor golden tests pass; with the backend down every non-AI, non-sync feature works; verifier tests catch an injected wrong number; gateway logs contain no request bodies.

### Phase 6 – Languages and refinement

| Slice | Goal |
| --- | --- |
| 6.1 | Tamil translation, fonts, layout checks |
| 6.2 | Hindi |
| 6.3 | Kannada |
| 6.4 | Telugu |
| 6.5 | Expense splits and member balances (ADR-014) |
| 6.6 | Member, subcategory and custom-period budgets |
| 6.7 | Receipt photos and OCR |
| 6.8 | Bank statement import |
| 6.9 | Trips with foreign currency |
| 6.10 | Performance and accessibility audits on a real mid-range Android phone |
| 6.11 | External security review and fixes |

**Gate:** each language reviewed by a native speaker; performance budgets in 05 met; axe reports no serious issues; security review findings resolved.

## Definition of done (every slice)

- Code and tests exist and pass; no placeholder buttons or TODOs in the UI.
- Works offline; no console errors; strings go through i18n.
- Automated accessibility check (axe) passes for new screens.
- Financial behaviour matches 03; any new rule is added to 03.
- 08-progress.md regenerated by Claude.

## Session prompts

Normally you only type **continue**. Claude reads 08, picks the next slice, plans, and waits for your OK. The templates below are for when you want to steer.

### Specific slice

```markdown
Phase <N>, slice <N.M>: <name>.
Existing files you will touch: <paste or attach>.
Extra acceptance criteria or constraints: <optional>.
Plan first, then wait for my OK.
```

### Fix after a test run

```markdown
Test output for slice <N.M>:
<paste>
Fix the failures. Then regenerate 08-progress.md.
```

### Phase report

```markdown
phase report
<paste the full test output>
```

Claude responds with: features completed (with the tests that prove each), files and components created, test results, known limitations, remaining tasks, new ADRs, which knowledge files need updating (with replacement text), and a regenerated 08-progress.md.

### Changing a decision

```markdown
Decision change: <what and why>.
Record it as an ADR in 08, tell me which knowledge files and sections change, and give the replacement text.
```
