# 05 – UX and Design

The home screen answers one question, "how are we doing this month?", and Add Expense is one tap from every screen. Every screen has one job; charts live in Insights, not on Home.

## Quick Add

Target: a repeat expense in 3 taps, a new expense in 6 taps or fewer, both under 5 seconds.

- Opens as a bottom sheet (dialog on desktop) with a large amount field and a custom rupee keypad already focused. The keypad supports simple sums ("120+80").
- Below the amount: the 8 most-used categories for this member as chips, then "More".
- Defaults: date today, paid by you (or the selected profile in shared-device mode), payment method last used by that member for this category. Item, merchant, notes, tags and date sit behind "Add details".
- "Repeat" row: the household's most frequent recent expenses as one-tap templates ("Milk ₹60 · Cash"): tap, then Save.
- Save shows a toast with Undo (5 seconds) and "Add another", plus inline budget feedback: "Groceries: ₹3,200 left this month."
- Works identically offline.
- Phase 5 adds a natural-language line at the top of the sheet; Android share-to-Lekka opens the sheet prefilled from shared payment text.
- Manifest shortcut "Add expense" on long-press of the app icon; keyboard shortcut N on desktop, / for search.

## Onboarding (under 2 minutes, every step skippable except the essentials)

The first screen asks: **Start a new household** or **Just me on this phone** (ADR-023). **Join my family's household** is added in Phase 3 (slice 3.2).

**Start a new household**

1. Welcome and the privacy promise in three short lines.
2. Your name and household name; add other members by name now (they join later from their phones, or stay as non-phone members).
3. How you pay: tick Cash, UPI, cards. Cash creates a "Cash in hand" account and "Cash" method; UPI creates a Bank account and "UPI" method; cards create one Credit card account (no balance tracking) and "Card" method. All renameable later.
4. Monthly budget: one number, plus budget start day.
5. Data safety: install the app (with iOS Home Screen instructions) and why backups matter.
6. Family sync: set it up now (sign in, App Lock, invite members) or later. Available from Phase 3.
7. Land on Home with one clear action: "Add your first expense".

**Join my family's household**

1. Open the invitation link (or scan the QR) sent by a household admin.
2. Sign in, set up App Lock (biometric unlock in one touch).
3. Confirm the 6-digit safety code with the admin.
4. Pick which member you are (if the admin already added you) and land on Home with the household's data synced.

Until Phase 3 ships, only "Start a new household" exists and every device works on its own.

## Solo users and spaces

- Choosing "Just me on this phone" in onboarding skips members; the space is named "My money" (editable).
- With one member: no member charts, no "paid by" field, no profile switcher, no invitation prompts. Everything else is identical.
- Settings → Family → "Invite family" upgrades the space: preview what will be shared, confirm, then the invitation flow. Requires Phase 3.
- Settings → Spaces → "Add a space" creates a separate space (for example personal alongside family). A space switcher appears at the top of Home only when there is more than one space, and every screen shows the current space name.
- Quick Add saves to the current space and shows its name, so an expense never lands in the wrong space by accident.

## Devices and members

- Default: the phone belongs to one member. No profile switcher; Quick Add records "paid by you", changeable to any member.
- Settings → Shared device: turns on a profile switcher for this device. Requires App Lock from Phase 2 (ADR-021). Shows the note "Everyone who can unlock this device can see and switch between profiles."
- Settings → Devices: each member's devices, last synced, and (for admins) revoke.

"Explore with sample data" opens a separate, clearly bannered demo database that is wiped on exit. Demo data never mixes with real data.

## Navigation

| Mobile bottom bar | Desktop sidebar |
| --- | --- |
| Home | Home |
| Activity (transactions) | Transactions |
| Add (centre button) | Budgets |
| Plan (budgets, bills, goals, wishlist) | Bills & recurring |
| More (insights, Ask Lekka, settings) | Goals & wishlist |
| | Insights |
| | Ask Lekka (assistant and "Should I Buy This?") |
| | Settings |

## Home screen, top to bottom

1. Period dates, your avatar (colour and initials) and sync status; profile switcher only in shared-device mode.
2. Hero: "Spent ₹X of ₹Y", progress bar, "₹Z left · N days to go", and a daily safe-to-spend amount.
3. At most two alerts, then bills due in the next 7 days.
4. Top 5 category budgets by consumption.
5. Last 5 transactions.
6. One insight card, only when it meets the data thresholds below.
7. A "Should I Buy This?" entry card (from Phase 5).

## Insights and alerts

- Insights include: income vs spending, category breakdown, spending by member (paid by), payment mode mix, daily and weekly trend, budget consumption, savings trend, merchant spending, month-over-month comparison. Every chart has an accessible table view.
- Data thresholds: comparisons need 2 complete periods, trends need 3, and no category insight is generated from fewer than 5 transactions. Below threshold, say "Not enough data yet" and why.
- Budget alerts at 70%, 85%, 100% and over, configurable. Each threshold shows once per budget per period; several are bundled into one banner.
- Tone is neutral and forward-looking: "Groceries is at 85% with 9 days to go", never "You overspent!". Red is reserved for over-budget only.

## Visual identity

- "Lekka" means account or calculation in Kannada and Telugu; the identity leans on balance and clarity. Logo direction: a simple geometric mark suggesting a balanced ledger line or a lowercase l with a level beam; must read at 16 px. Deliver as SVG plus PWA icon sizes (192, 512, maskable).
- Palette: a deep teal or ink primary, one warm accent (saffron or marigold) used sparingly, calm neutrals. Green, amber and red are reserved for budget status.
- Typography: a humanist sans that pairs with Noto Sans Tamil, Devanagari, Kannada and Telugu, so Phase 6 translations look consistent. Tabular figures for all amounts. Self-hosted.
- Motion 150–250 ms, purposeful only; respect `prefers-reduced-motion`.
- Light and dark themes from day one.
- Member colours: a 10-hue palette tested for colour-blindness and for contrast in both themes. Members always show initials or avatar too, never colour alone.

## Copy rules

- Plain words: "Money moved between accounts", "Bill paid", "Refund received". Avoid debit, credit, ledger, liability in the UI.
- Never shame or moralise. The advisor informs; the household decides.
- Amounts as ₹1,50,000; dates as "Today", "Yesterday", then "12 Nov".
- Every error says what happened and what to do next; storage errors always offer a backup.
- Every empty state has one friendly line and one action.

## Accessibility

- WCAG 2.2 AA. Touch targets at least 44 × 44 px. Text contrast 4.5:1, graphics 3:1.
- Usable at 200% text size; an in-app "Large text" setting for parents.
- Full keyboard support, managed focus in sheets and dialogs, labelled controls, chart table alternatives.

## Localisation (ADR-017)

v1 ships in English only. All strings still go through i18next from Phase 0, with keys organised by feature, so Phase 6 can add Tamil, Hindi, Kannada and Telugu without touching components. Dates and numbers via `Intl`. Default category names are translation keys; names the user typed stay exactly as typed. Avoid string concatenation; use interpolation and plural rules.

## Performance budgets

| Measure | Target |
| --- | --- |
| Initial JS for shell + Quick Add | ≤ 200 KB gzipped; charts, XLSX and crypto WASM lazy-loaded |
| Cold start to interactive, mid-range Android on 4G | ≤ 2 s |
| Warm start | ≤ 1 s |
| Quick Add save, perceived | ≤ 100 ms |
| Home render with 20,000 transactions | ≤ 500 ms, using cached per-period aggregates |
| Long lists | Virtualised |
| Any aggregation over 50 ms | Moved to a Web Worker |
