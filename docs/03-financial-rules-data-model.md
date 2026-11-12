# 03 – Financial Rules and Data Model

Every money movement is one transaction of exactly one type, against one or two accounts, and the type alone decides whether it counts as spending, income or neither. This file is the contract for `src/domain`; every rule here needs a unit test.

## Accounts

An account is where money sits or is owed: `cash`, `bank`, `credit_card`, `wallet`, `loan`, `savings` (FD, RD, PPF, goal pots) and `investment`.

A payment method is a named shortcut combining a mode and an account, for example "UPI – HDFC" (mode UPI, account HDFC Savings) or "Cash" (mode cash, account Cash in hand).

Households that do not care about accounts get two implicit ones (Cash, Bank) and never see the word "account" in Quick Add. Balance tracking is opt-in per account and needs an opening balance.

## Transaction types

| Type | Example | Accounts | Counts as spending | Counts as income | Uses budget |
| --- | --- | --- | --- | --- | --- |
| `expense` | Vegetables via UPI | from | Yes | No | Yes |
| `income` | Salary credited | to | No | Yes | No |
| `refund` | Partial refund on a return | to; linked to an expense | Reduces it, in the original category | No | Reduces consumption |
| `transfer` | ATM withdrawal (bank → cash), wallet top-up | from + to | No | No | No |
| `card_payment` | Paying the card bill from bank | bank → card | No | No | No |
| `savings` | Monthly SIP, FD, goal contribution | from + savings/investment account, optional goal | No | No | No |
| `loan_payment` | Home loan EMI | from + loan; carries `principal` and `interest` | Interest only (Fees & interest) | No | Interest only |
| `adjustment` | Balance correction after reconciliation | one account | No | No | No |
| `member_settlement` | Reserved for Phase 6 (splits) | member → member | No | No | No |

Cashback and card rewards are `income` with source "Cashback & rewards", reported separately from salary-type income.

## Metric definitions

- **Spending(period)** = sum of `expense` dated in the period − `refund` dated in the period + `interest` of `loan_payment` dated in the period. Refunds count in the period of the refund date, against the original expense's category, so closed months never change.
- **Income(period)** = sum of `income` dated in the period.
- **Surplus** = Income − Spending. **Savings rate** = Surplus ÷ Income. When Income is 0, the rate is undefined and shown as "–" with an explanation.
- Surplus is broken down for the user as: saved to goals and investments, loan principal repaid, and change in cash and bank balances.
- **Budget consumption(category, period)** = spending in that category and period (full amount; member shares arrive with splits in Phase 6).
- **Committed(period)** = unpaid scheduled occurrences due before the period ends.
- **Available to spend** = budget − consumption − committed, for budgeted categories.
- **Forecast month-end** = actual + committed + projected discretionary. Projected discretionary = median daily discretionary spending over the last 90 days × days remaining, excluding transactions flagged one-off or above 3× the category median. With under 30 days of history, use the current period's run rate. With under 14 days, label the forecast "low confidence".
- **Discretionary** = `expense` without `occurrenceId` and without `oneOff` (ADR-026).
- **Daily safe-to-spend** = floor((household budget − consumption − committed) ÷ days left including today), in whole rupees. Hidden when the result is ≤ 0 or there is no household budget (ADR-027).
- **Net category spending** may go below zero after a refund in a later period; show it as "₹X refunded", never clamp it (ADR-029).
- **Annual reports** use calendar dates (FY 1 Apr – 31 Mar, or Jan – Dec), not budget periods (ADR-028).
- Actual, committed and forecast amounts are always visually distinct and never summed into one unlabelled number.

## Money rules

- Amounts are positive integers in paise. Direction comes from the type. Never store floats or rounded derived values.
- Validate 1 paise ≤ amount ≤ ₹10 crore. Ask for confirmation when an amount is more than 10× the household's largest expense in that category (typo guard). With no history in that category, compare against the household's largest expense; with no history at all, confirm above ₹1 lakh.
- Any division of an amount (for example, spreading an EMI purchase across months, or splits in Phase 6) uses the largest-remainder method so parts always sum exactly: ₹100 in three parts is ₹33.34, ₹33.33, ₹33.33.
- EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), with r the monthly rate. Compute in floating point, round each instalment to paise, and let the last instalment absorb the rounding difference.
- Card EMI and processing fees attract GST on the interest and fee components; keep the GST rate as an editable setting defaulting to 18%. A "no-cost EMI" still has a real cost in GST on interest and any processing fee; show it.

## Time and period rules

- Transaction `date` is a local date string `YYYY-MM-DD` in the household timezone, with optional `time`. Timestamps (`createdAt`, `updatedAt`) are UTC ISO strings. Date-only storage removes midnight timezone bugs.
- Budget periods start on the household's start day (1–28). A period is named by the month in which it starts.
- A budget created mid-period is prorated by days for that first period (setting, default on): `floor(amount × daysLeft ÷ daysInPeriod)` in paise, integer maths.
- Changing the budget start day applies from the next period; current and past periods keep their boundaries.
- Budgets are versioned with `effectiveFrom`; editing a budget applies to the current period and keeps past periods' amounts intact.
- Rollover: unspent amounts carry into the next period when enabled; overspending carries forward only if "carry overspend" is also enabled.
- Backdated entries recalculate the affected period. Alerts are never re-fired for closed periods.

## Credit cards and EMIs

- A card purchase is an `expense` on its purchase date and increases the card's outstanding balance.
- The bill payment is a `card_payment`; it never counts as spending.
- Interest, late fees, annual fees and GST on them are `expense` in Fees & interest.
- Statement totals are computed from transactions between statement dates. The user can enter the actual statement amount; any difference is shown for review, never auto-corrected.
- A purchase converted to EMI is spending in full on the purchase date in reports. For budgets, the user can choose "count the full amount now" (default) or "spread across EMI months", stored as `budgetAllocation`.
- Available credit limit is never treated as money available, in any calculation.

## Recurring items

- Rules support daily, weekly, monthly, quarterly, half-yearly, yearly and custom intervals. A monthly rule on the 31st clamps to the last day of shorter months.
- Occurrences have states: upcoming, due, overdue, paid (linked `transactionId`), skipped.
- Marking an occurrence paid opens Quick Add prefilled; the amount stays editable because bills like electricity vary.
- Nothing is ever created as an actual transaction just because a due date arrived.

## Spaces (households)

- A space is a `Household` record. A solo user's space is a household with one member.
- All spaces live in one IndexedDB database; demo mode has its own separate database (ADR-030).
- A device may hold several spaces. Every record, query, budget, alert, backup and calculation is scoped by `householdId`; no figure ever combines spaces.
- Each space has its own sync setting and its own household key; a personal space is never sent to another space's members.
- Upgrading a solo space to a family household keeps all its records; the solo user becomes its Owner.

## Attribution

- `createdByMemberId` is the member who recorded it: the phone's owner, or the selected profile in shared-device mode.
- `paidByMemberId` defaults to the same member but can be any household member (for example, cash Mother paid, recorded from Vinay's phone).
- Member reports use `paidByMemberId`; the audit trail and sync permissions use `createdByMemberId`.

## Splits and member balances (deferred to Phase 6, ADR-014)

Until Phase 6, every expense is attributed in full to `paidByMemberId`, and member reports show "paid by". `Household.splitsEnabled` and `balancesEnabled` stay `false`. The `Split` table and `member_settlement` type are defined now so no migration is needed later, but have no UI.

Phase 6 rules (for reference): who paid vs how it is shared (equal, by amount, by percentage); largest-remainder allocation; member reports show "paid" and "share" separately; "who owes whom" only when balance tracking is on; repayments are `member_settlement`.

## Edge cases that must have tests

- Refund larger than the remaining refundable amount of the original is blocked.
- Refund in a later month reduces the later month, in the original category.
- Deleting an expense that has refunds asks whether to delete both; never leaves an orphan refund.
- Deleting a category with transactions requires archive or reassignment.
- Deactivating a member keeps their history and colour.
- Changing household base currency after the first transaction is blocked.
- Transfer with identical from and to accounts is rejected.
- Recurring rules on the 29th–31st across February and leap years.
- Income of zero; first month with no history; a single huge one-off expense in forecasts.
- Import duplicates: same date and amount with a similar description are flagged for confirmation, not auto-dropped.
- ATM withdrawal followed by cash spending counts only the spending.
- Budget start day 25: a transaction on 24 Nov belongs to the period starting 25 Oct.
- "Today", default dates and period boundaries use the household timezone, never the device's.
- `date` stays the local date chosen at entry; it is never derived from `createdAt` (expense at 23:59:50 IST viewed after midnight).
- Start day 25: 24 Mar → period 2026-02; 25 Mar → period 2026-03.
- Amount parsing: "1.5k", "2 lakh", "₹1,50,000" give exact paise; more than 2 decimals, scientific notation, negatives and non-ASCII digits are rejected with a message.
- Sums over 20,000 transactions at the ₹10 crore cap stay safe integers (property test).
- Largest remainder: 0 parts or zero total weight throws; 1 part returns the whole amount.
- Two spaces open in two tabs stay independent; writes are scoped by `householdId`.
- Quick Add keeps the space it opened with, even if the space switcher changes meanwhile.
- Toast undo deletes for good; restore from Recently deleted sets `rev + 1`; deleting an already-deleted record does nothing.
- An archived category still shows on old transactions, marked "archived".
- Restoring a backup from a newer schema version is blocked; older versions are migrated on import.

## Data model

All records also carry the storage header from 02 (`id`, `householdId`, `kind`, `month`, `updatedAt`, `deletedAt`, `rev`). IDs are UUID v7 so they sort by creation time.

```ts
type Paise = number;          // positive safe integer
type LocalDate = string;      // 'YYYY-MM-DD', household timezone
type UUID = string;

interface Household { name: string; baseCurrency: 'INR' | string; timezone: string; locale: string;
  budgetStartDay: number; fiscalYearStartMonth: number;
  splitsEnabled: boolean; balancesEnabled: boolean; }   // both false until Phase 6

interface Member { displayName: string; relationship?: string; colour: string; avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer'; status: 'active' | 'inactive'; }

interface Account { name: string; kind: 'cash' | 'bank' | 'credit_card' | 'wallet' | 'loan' | 'savings' | 'investment';
  trackBalance: boolean; openingBalance?: Paise; openingDate?: LocalDate;
  card?: { limit?: Paise; statementDay: number; dueDay: number };
  loan?: { principal: Paise; annualRatePct: number; tenureMonths: number; startDate: LocalDate };
  status: 'active' | 'archived'; }

interface PaymentMethod { name: string;
  mode: 'upi' | 'cash' | 'credit_card' | 'debit_card' | 'netbanking' | 'bank_transfer' | 'wallet' | 'other';
  accountId: UUID; status: 'active' | 'archived'; }

interface Category { name: string; parentId?: UUID; icon: string; colour: string; sortOrder: number;
  status: 'active' | 'archived'; }

interface Merchant { name: string; aliases: string[]; defaultCategoryId?: UUID; defaultSubcategoryId?: UUID; }

interface Transaction {
  type: 'expense' | 'income' | 'refund' | 'transfer' | 'card_payment' | 'savings' | 'loan_payment'
      | 'adjustment' | 'member_settlement';
  date: LocalDate; time?: string; amount: Paise;
  fromAccountId?: UUID; toAccountId?: UUID; paymentMethodId?: UUID;
  categoryId?: UUID; subcategoryId?: UUID; item?: string; merchantId?: UUID;
  paidByMemberId: UUID; tags: string[]; notes?: string;
  linkedTransactionId?: UUID;            // refund -> original expense
  loanBreakdown?: { principal: Paise; interest: Paise };
  incomeSource?: string; goalId?: UUID; occurrenceId?: UUID;
  budgetAllocation?: { mode: 'lump' } | { mode: 'spread'; months: number };
  oneOff?: boolean;                      // excluded from forecasts
  source: 'manual' | 'nl' | 'share' | 'import' | 'recurring';
  createdByMemberId: UUID; createdAt: string; }
  // Required fields per type are a Zod discriminated union in domain/transactions; Phase 1 accepts 'expense' only

interface Split { transactionId: UUID; memberId: UUID; amount: Paise; }   // Phase 6

interface Budget { scope: 'household' | 'category' | 'subcategory' | 'member'; categoryId?: UUID; memberId?: UUID;
  amount: Paise; effectiveFrom: LocalDate; rollover: boolean; carryOverspend: boolean; thresholds: number[]; }
  // v1 UI uses 'household' and 'category' only

interface RecurringRule { label: string; type: 'expense' | 'income' | 'savings' | 'loan_payment';
  amount: Paise; estimated: boolean;
  freq: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'half_yearly' | 'yearly'; interval: number;
  anchorDate: LocalDate; endDate?: LocalDate; categoryId?: UUID; paymentMethodId?: UUID; memberId?: UUID;
  remindDaysBefore: number; status: 'active' | 'paused'; }

interface Occurrence { ruleId: UUID; dueDate: LocalDate;
  state: 'upcoming' | 'due' | 'overdue' | 'paid' | 'skipped'; transactionId?: UUID; }

interface Goal { name: string; kind: 'goal' | 'sinking_fund' | 'emergency_fund'; target: Paise; targetDate?: LocalDate;
  linkedCategoryId?: UUID; priority: 1 | 2 | 3; memberIds: UUID[]; status: 'active' | 'achieved' | 'archived'; }

interface WishlistItem { name: string; price: Paise; categoryId?: UUID; needOrWant: 'need' | 'want';
  addedOn: LocalDate; revisitOn: LocalDate; lastVerdict?: AdvisorVerdict;
  status: 'waiting' | 'bought' | 'dropped'; }

interface AlertState { budgetId: UUID; period: string; highestThresholdShown: number; dismissedAt?: string; }

interface AuditEntry { recordId: UUID; action: 'create' | 'update' | 'delete' | 'restore';
  before?: unknown; after?: unknown; byMemberId: UUID; at: string; }   // before/after are payload fields (encrypted with App Lock)

// Device-local, never synced or included in cross-device backups (ADR-025)
interface DeviceSettings { activeHouseholdId?: UUID; demo: boolean; }
interface SpaceDevice { householdId: UUID; ownerMemberId: UUID; sharedDevice: boolean; }
```

Goal progress is the sum of `savings` transactions with that `goalId`, never a hand-edited number. Deleted records stay as tombstones (`deletedAt`) for 30 days in a Recently deleted view, then are purged (kept longer when sync needs them; see 04).
