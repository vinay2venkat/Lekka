# 01 – Product Spec

Lekka is a local-first household money companion for Indian families: recording an expense takes seconds, the household sees where money went, and the app helps decide where it goes next.

Philosophy: "Know where your money goes. Decide where it should go."

## Who it is for

| Persona | Profile | What they need | Design implication |
| --- | --- | --- | --- |
| Household manager | 30s, runs groceries and bills, pays mostly by UPI on Android | Fast entry, budget status at a glance, bill reminders | Amount-first Quick Add; Home shows this month |
| Earning partner | 30s, pays rent, card bills and big purchases | Card dues, EMIs, "can we afford this?" | Accounts, card cycles, purchase advisor |
| Parents | 60s, lower tech comfort, often pay cash | Add a cash expense without help | Large text option, plain words, minimal fields |

Design test for every screen: a 65-year-old parent can add a cash expense for milk without assistance.

## How households use Lekka (ADR-019)

- **Default: one person, one phone.** Each member installs Lekka on their own phone and records their own expenses. The household becomes one shared picture through Encrypted Sync: the first member creates the household, the others join by invitation. Members on other phones need sign-in and Encrypted Sync (Phase 3). Members who are only recorded as "paid by", or who use a shared device, do not (ADR-022).
- **Shared device: opt-in.** A household can turn on shared-device mode on a particular phone or tablet (for example, for parents who share one). That device shows a profile switcher and uses one household App Lock (ADR-013).
- **Members without a smartphone** can still be household members; anyone can record an expense as "paid by" them.
- **Individuals (ADR-020):** a single person gets the full app with no sign-in, in Local Only mode. Their space is a household of one, labelled "My money" by default; family-only UI (member charts, profile switcher, invitations) stays hidden until a second member is added.
- **From solo to family:** a solo user can later invite family. Their existing data becomes the family household's history after a preview and confirmation; nothing is re-entered.
- **Personal and family spaces:** one person can have more than one space on their phone, for example "My money" and "Family". Each space has its own data, budgets and members; totals never mix; a personal space is never shared or synced to the family. A switcher at the top changes space.
- **Solo across own devices:** a solo user can sign in and sync their own phone and laptop, with no other members.

## Differentiators

1. Fastest expense entry in the category: three taps for a repeat expense.
2. Built around the household, with member colours and attribution, not around one person.
3. Private by default: data stays on the device; sync is optional and end-to-end encrypted.
4. Budgets that forecast, not just report.
5. "Should I Buy This?": a transparent purchase advisor with a cooling-off wishlist.

## Scope and priorities

MUST = required for the phase to ship. SHOULD = planned for that phase, can slip one phase. LATER = Phase 6.

| Feature | Priority | Phase |
| --- | --- | --- |
| Quick Add expense (amount + category required, rest defaulted) | MUST | 1 |
| Household and members, member colours, device owner | MUST | 1 |
| Shared-device mode with profile switcher (opt-in) | MUST | 1 |
| Solo mode: full app for one person, family-only UI hidden | MUST | 1 |
| Categories, subcategories, merchants, payment methods | MUST | 1 |
| Accounts: cash, bank, card, wallet (basic) | MUST | 1 |
| Transaction list, search, filters, edit, delete with undo | MUST | 1 |
| Monthly household budget and category budgets with alerts | MUST | 1 |
| Home: this month, budget health | MUST | 1 |
| JSON backup and restore, backup reminders, storage persistence | MUST | 1 |
| PWA install, offline, i18n infrastructure (English strings only) | MUST | 0–1 |
| App Lock with local encryption | MUST | 2 |
| Encrypted backup file format | MUST | 2 |
| Accounts, sign-in, invitations, joining a household from your own phone | MUST | 3 |
| Encrypted multi-device sync, conflicts, device revocation | MUST | 3 |
| Upgrade a solo space to a family household | MUST | 3 |
| Multiple spaces per device (personal + family) | SHOULD | 3 |
| Income tracking | MUST | 4 |
| Transfers, ATM withdrawals, refunds, card bill payments | MUST | 4 |
| Recurring bills and income with reminders | MUST | 4 |
| CSV and XLSX import and export | MUST | 4 |
| Insights charts | MUST | 4 |
| Credit card statement cycles, EMIs, loans | SHOULD | 4 |
| Savings goals and sinking funds for annual expenses | SHOULD | 4 |
| Should I Buy This? (deterministic rules engine) | MUST | 5 |
| Wishlist with cooling-off reminders | SHOULD | 5 |
| Natural-language entry, local parser first | SHOULD | 5 |
| AI assistant (optional, consent-gated) | SHOULD | 5 |
| Regional languages: Tamil, Hindi, Kannada, Telugu | MUST | 6 |
| Expense splits and member balances | LATER | 6 |
| Member, subcategory and custom-period budgets | LATER | 6 |
| Receipt photos, OCR, bank statement PDF import | LATER | 6 |
| Trip budgets with foreign currency entries | LATER | 6 |

## India-specific requirements

- Currency INR, locale en-IN, timezone Asia/Kolkata by default; configurable per household.
- Display amounts with lakh/crore grouping (₹1,50,000). Accept input like "1.5k", "2 lakh", "₹1,50,000".
- **Budget month start day** is configurable (1–28), so a household paid on the 25th budgets from the 25th.
- Annual reports default to the Indian financial year (April–March), switchable to calendar year.
- Large irregular costs are first-class: school fees, insurance premiums, property tax, festivals, weddings. Sinking funds spread them across months.
- Cash is still common for domestic help, vegetables and parents' spending; cash must be as easy as UPI.
- Lekka cannot read SMS or UPI notifications (a browser limitation). Capture uses Quick Add, natural-language entry, Android share-to-Lekka (sharing a payment confirmation's text) and statement import.

## Default categories

Categories describe what the money was for. Savings, investments, loan principal and card bill payments are not categories; they are transaction types (see 03).

| Category | Subcategories |
| --- | --- |
| Housing | Rent, Society maintenance, Property tax, Repairs, Furniture & appliances, Household supplies |
| Groceries | Vegetables, Fruits, Milk & dairy, Meat & seafood, Staples, Snacks, Beverages |
| Domestic help | Maid, Cook, Driver, Caretaker, Tips |
| Food & dining | Restaurants, Food delivery, Cafes & snacks |
| Transport | Fuel, Metro & bus, Cab & auto, Vehicle service, Parking & tolls, Vehicle insurance |
| Bills & utilities | Electricity, Water, Broadband, Mobile recharge, LPG & piped gas, DTH & streaming |
| Health | Medicines, Doctor & hospital, Tests, Health insurance |
| Education & kids | School fees, Tuition, Books & stationery, Courses, Activities, Childcare |
| Personal & shopping | Clothing, Personal care, Electronics, Shopping, Entertainment, Hobbies |
| Family & occasions | Gifts, Weddings & functions, Festivals, Religious & donations, Support to relatives |
| Travel | Trips, Stays, Travel tickets |
| Fees & interest | Bank charges, Card fees & interest, Late fees, Loan interest |
| Taxes | Income tax, Other taxes |
| Other | (none) |

Users can rename, reorder, archive, recolour and add categories. Archiving hides a category from Quick Add but keeps its history. Onboarding lets users untick categories they will never use.

## Non-goals

- Not a bank aggregator, tax filing tool, investment portfolio tracker or business accounting system.
- No ads, no selling or sharing data, no analytics that capture transaction content.

## Success measures

- Median time to add a repeat expense under 5 seconds; first-ever expense under 30 seconds after onboarding.
- At least 70% of active households have a backup newer than 30 days.
- Zero discrepancies between dashboard totals and transaction sums in property-based tests.
- Lighthouse accessibility score of at least 95 on every main screen.
