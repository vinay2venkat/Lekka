# 04 – Security, Privacy and Sync

Lekka protects data at rest with an opt-in App Lock, between devices with end-to-end encryption, and from its own server by design: the server stores ciphertext it has no key for. Before public launch, the App Lock and sync designs need an independent security review.

## Threat model

| Threat | Control | Residual risk |
| --- | --- | --- |
| Someone picks up an unlocked phone | App Lock, auto-lock on inactivity and when hidden | None once locked |
| Someone copies the browser profile or IndexedDB files | Records encrypted at rest when App Lock is on | Weak passphrases can be brute-forced offline |
| Sync server breach or curious operator | End-to-end encryption; server holds ciphertext and minimal metadata | Metadata: who, when, how many events, approximate size |
| Network attacker | HTTPS plus end-to-end encryption | None for content |
| AI provider | Consent, minimal aggregates, pseudonymised member names, non-training tier only | Provider sees the aggregates the user approved |
| XSS or malicious extension | Strict CSP, Trusted Types, no raw HTML, minimal dependencies, no third-party scripts | Code running in the page while unlocked can read data |
| Malware or compromised OS | Out of scope | Total |

**Devices and locks (ADR-019, ADR-013).** By default each member uses their own phone, protected by that phone's own App Lock, and members see each other's entries through sync. Roles are enforced across devices (see Event log). On an opt-in shared device there is one App Lock for that device; profiles there are for attribution, not security, because anyone who unlocks can switch profiles. Say so in the UI. Lekka has no member-private entries inside a household: everyone in it sees all its data. For private finances, a person keeps a separate personal space on their own phone (ADR-020); it has its own key and is never synced to the family. One App Lock on a device protects all spaces on that device.

## App Lock (local encryption, Phase 2)

- Required on every device in a synced household and on shared devices (enforced from slice 2.4; in Phase 1 shared-device mode shows a note that anyone using the device sees every profile, ADR-021); optional for a single person in Local Only mode (recommended at onboarding and after the first week). Biometric unlock keeps this to one touch.
- A random 256-bit **data encryption key (DEK)** encrypts records with AES-256-GCM. After unlock it lives in memory as a non-extractable `CryptoKey`.
- The DEK is stored only in wrapped form, wrapped separately by each unlock method:
  - Passphrase (minimum 8 characters, strength meter): Argon2id, about 64 MiB memory, parameters tuned to roughly 500 ms on a mid-range phone, per-household salt.
  - Passkey with the WebAuthn PRF extension for biometric unlock, derived through HKDF. Detect support at runtime and fall back to passphrase.
  - Recovery key: a 24-word phrase shown once at setup, which the user must re-enter correctly before setup finishes.
- A short numeric PIN is never the only factor: an attacker with the files can try every 6-digit PIN offline.
- Each record gets a fresh 96-bit IV. Additional authenticated data binds the ciphertext to `id`, `kind`, `householdId` and schema version, so encrypted payloads cannot be swapped between records.
- Auto-lock after inactivity (default 5 minutes) and on manual lock. Locking wipes the decrypted cache and key references; a BroadcastChannel message locks every open tab.
- Turning App Lock on or off is a resumable batch migration under a Web Lock, with progress shown.
- Plain-language warning with a required checkbox: "If you forget your passphrase and lose your recovery key, nobody, including us, can recover your data."

## Frontend security controls (from Phase 0)

- CSP, sent as an HTTP header (not a meta tag): `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; connect-src 'self' <api-origin>`. `'wasm-unsafe-eval'` is added in Phase 2 for libsodium (ADR-032); `'unsafe-inline'` applies to styles only, for Radix scroll lock, and is revisited in 2.6 (ADR-033). No inline scripts; Trusted Types where supported.
- Never use `dangerouslySetInnerHTML`. Render AI output as plain text or through a Markdown renderer with HTML disabled.
- Self-host fonts and assets; no runtime CDNs, analytics SDKs or third-party scripts.
- Parse imports in a Web Worker with size limits and Zod validation.
- CSV and XLSX exports escape cells beginning with `=`, `+`, `-`, `@`, tab or carriage return, to prevent formula injection.
- Lockfile committed; dependency audits in CI (npm audit, pip-audit); Dependabot or Renovate.

## Backups

- Phase 1: JSON backup with a clear warning that it is unencrypted; store it somewhere private.
- Phase 2: the `.lekka` format becomes the default: a JSON envelope with format name, format version, schema version, app version, creation time, Argon2id parameters, salt, IV and AES-GCM ciphertext of the full export. Encrypted with a backup passphrase or the recovery key.
- Restore validates the file, shows a preview (record counts by type, date range, members), then offers Replace (after automatically backing up current data) or Merge (by record id; higher `rev` wins, ties broken by `updatedAt` then device id; every record changed on both sides is listed as a conflict for review).
- Reminders when the last backup is older than the user's chosen interval (default 14 days) or after 50 new transactions.

## Encrypted sync (Phase 3)

### Keys

- **Household key (HK)**: a random symmetric key that encrypts sync events, versioned by epoch.
- **Device keys**: an X25519 key pair for receiving key envelopes and an Ed25519 key pair for signing events. Private keys are stored encrypted under the local DEK.
- **Key envelopes**: the HK sealed (libsodium sealed box) to each authorised device's public key, stored on the server per device and epoch. The server can deliver envelopes but cannot open them.
- **Household recovery key**: wraps the HK so a household that loses every device can recover after signing in.

### Invitations and new devices

1. An admin creates an invitation. The server records an invite id; the admin's device generates a one-time secret placed in the link's `#fragment`, which browsers never send to the server.
2. The invitee signs in; their device registers its public keys and posts a join request with proof of the secret (an HMAC over its public keys).
3. An admin device verifies the proof and shows a 6-digit safety code derived from both devices' public keys; both people compare it in person or by phone.
4. On confirmation, the admin device seals the HK to the new device. Invitations expire after 48 hours and are single-use.

Adding your own second device follows the same flow, approved from your existing device.

### Revocation and rotation

Revoking a device or removing a member stops the server serving that device immediately, and an admin device starts a new HK epoch sealed only to remaining devices. Data a revoked device already downloaded cannot be recalled; the UI must say this plainly.

### Event log

- Every local change writes a sync event to an outbox in the same Dexie transaction as the record change.
- Event plaintext: `eventId` (UUID v7), `recordId`, `kind`, `op` (upsert or delete), changed fields and values, `baseRev`, `newRev`, hybrid logical clock timestamp, author member and device.
- Encrypted with XChaCha20-Poly1305 under the current HK epoch, additional data `householdId + eventId + epoch`, signed with the device's Ed25519 key, and padded to size buckets (512 B, 2 KB, 8 KB).
- The server stores `householdId`, monotonic `seq`, unique `eventId` (repeated pushes are idempotent), `deviceId`, `epoch`, ciphertext and received time.
- Devices pull by `seq` cursor and apply in order, skipping event ids already applied.
- Receiving devices verify signatures and reject events whose author's role does not permit the change (for example, a viewer editing a budget). The server additionally rejects pushes from viewer devices.
- Push on save, on reconnect, on app focus, and every few minutes while open, with exponential backoff and jitter. iOS has no Background Sync, so sync happens while the app is open; show "Last synced" clearly.
- Periodic encrypted snapshots let new devices bootstrap quickly and let the log be compacted.

### Conflicts

- Different fields edited concurrently: merge per field.
- Same field edited concurrently (both events share a `baseRev`): keep both values, create a conflict item, and ask the user in Sync → Conflicts.
- Delete on one device, edit on another: surface as a conflict, never resolve silently.
- The same expense entered on two phones: the duplicate detector (same amount and date, same category, within a time window) suggests merging.
- Tombstones are kept until every active device has pulled past them, plus 90 days.

MLS (RFC 9420) is the standard for group key agreement but is heavyweight for a 2–6 person household; the envelope design above is the simpler pattern used by family vaults in password managers.

## Reminders and notifications

Without a server, reminders appear only when the app is opened (plus an app badge where the Badging API is supported). Web Push needs a server and, on iOS, an installed PWA. In Phase 3, offer opt-in push where the device registers only reminder times; the server sends a generic "You have bills due" message and never learns which bill.

## Hosting (ADR-016)

The sync backend and its database are hosted in an India region (for example AWS Mumbai ap-south-1 or GCP asia-south1). The AI gateway runs in the same region, but the AI provider it calls may process data outside India; disclose this in the AI consent screen.

## Privacy boundaries (show this table in-app)

| Data | On your device | Sync server (India) | AI provider |
| --- | --- | --- | --- |
| Transactions, amounts, notes, merchants | Yes | Ciphertext only | Only aggregates you approved, per question |
| Member names | Yes | Ciphertext only | No; replaced with "Member 1", "Member 2" and mapped back on device |
| Account email, device names | No | Yes | No |
| When and how often you sync | Yes | Yes | No |
| Budgets, goals, wishlist | Yes | Ciphertext only | Only aggregates you approved |

## Compliance

Server-side personal data (emails, device records, ciphertext) and any data sent to AI providers fall under India's Digital Personal Data Protection Act, 2023. Provide a privacy notice, explicit consent for AI, account deletion that erases all server data including ciphertext, and a grievance contact, and disclose when an AI provider processes data outside India. Confirm current obligations with a lawyer before launch.

## Backend security checklist

HTTPS with HSTS; HttpOnly, Secure, SameSite cookies or short-lived tokens; CORS allowlist; rate limits per account and device; request size limits; logs without request bodies, tokens or long IP retention; secrets from environment or a secret manager; containers run as non-root; pip-audit in CI.
