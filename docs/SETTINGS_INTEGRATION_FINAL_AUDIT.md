# Settings / Integration Final Audit

Latest stable reference point:

- `ff2b151 ui: make settings integration actions preview safe`

## Validation

- `npm run build` passed
- `npm test` passed
- 293 tests passed

## Scope

This audit closes the current Settings / Integration polish phase.

Covered routes:

- `/settings`
- `/integration`
- `/integration/[connectorId]`
- `/display-settings` as related settings surface
- `/access-control` as related access surface
- `/audit-trail` as related audit surface
- `/system-foundation` as related system surface

## Current Implementation

Settings and Integration are rendered through the restaurant module preview framework.

Routes:

- `/settings` loads `getRestaurantModuleByKey("settings")`
- `/integration` loads `getRestaurantModuleByKey("integration")`
- `/integration/[connectorId]` loads `getRestaurantModuleByKey("integration")` and passes the connector id into `RestaurantModuleDetailPage`

Primary config source:

- `config/restaurant-modules.ts`

Primary renderers:

- `components/operations/restaurant-module-page.tsx`
- `components/operations/restaurant-module-detail-page.tsx`

## Completed Work

### L1: Audit Inspect

Confirmed:

- `/settings` is not an empty placeholder.
- `/integration` is not an empty placeholder.
- `/integration/[connectorId]` already exists.
- Both main pages use the shared restaurant module preview framework.

### L2: Standardization Plan

Created:

- `docs/SETTINGS_INTEGRATION_STANDARDIZATION_PLAN.md`

Purpose:

- Define Settings / Integration as a SaaS administration cluster.
- Keep the phase UI/config-only.
- Preserve no real POS, printer, API, webhook, database, auth, or storage behavior.

### L3: Visible Copy + Action Behavior Audit

Found risky action labels:

- `Save Changes`
- `Test Setting`
- `Add Rule`
- `Reset`
- `Add Connector`
- `Test Connection`
- `Sync Now`
- `Disable`
- `Post to Inventory`

Also found shared renderer wording:

- `Changes saved to the current workspace view.`
- `Save Changes`

### L4: Preview-Safe Action Wording

Updated:

- `config/restaurant-modules.ts`
- `components/operations/restaurant-module-page.tsx`

Changes:

- `Save Changes` → `Preview Changes`
- `Test Setting` → `Preview Setting Test`
- `Add Rule` → `Preview Rule Draft`
- `Reset` → `Reset Preview`
- `Add Connector` → `Preview Connector Draft`
- `Test Connection` → `Preview Connection Test`
- `Sync Now` → `Preview Sync`
- `Disable` → `Preview Disable`
- `Post to Inventory` → `Preview Inventory Posting`
- shared drawer `Save Changes` → `Apply Preview`
- shared toast `Changes saved...` → `Preview changes updated...`
- Chinese shared drawer copy changed to preview wording.

### L5: Final Action Wording Audit

Confirmed:

- No remaining risky action wording in `components/operations/restaurant-module-page.tsx`.
- Preview-safe labels exist in `config/restaurant-modules.ts`.
- Remaining `Disabled` values are accepted as status/metadata labels.
- `Preview Disable` is accepted as preview-safe wording.

## Boundary Rules Preserved

This phase did not add:

- real POS integration
- printer bridge connection
- barcode runtime
- API calls
- webhook execution
- database writes
- auth enforcement
- permission runtime
- workflow execution
- notification sending
- setting persistence
- localStorage / sessionStorage usage

Settings / Integration remains:

- UI preview only
- metadata-first
- mock/static config driven
- read-only from a business runtime perspective
- safe for demo and admin presentation

## Accepted Residuals

Accepted visible values:

- `Disabled`
- `Healthy`
- `Warning`
- `Production`
- `POS`
- `Printer`
- `API`
- connector ids such as `POS-KCH-PRIMARY`
- sample latency and sync timestamps

These are demo metadata values, not execution behavior.

## Current Status

Settings / Integration is stable for this phase.

It now communicates:

- Settings Center as administration preview
- Integration Center as connector health and sync preview
- no real save/sync/disable behavior
- admin-related routes remain connected through navigation

## Recommended Next Work

After this phase, recommended next phases:

1. Role / Access polish
2. Package / Plan surface polish
3. Demo Readiness / Stakeholder Summary recap
4. Legacy shell migration plan
5. Optional Settings / Integration bilingual copy-map pass
