# Settings / Integration Center Standardization Plan

Latest stable reference point:

- `036d724 docs: add navigation ia ownership final`

## Goal

This phase turns Settings and Integration into a professional SaaS administration center while keeping the current system preview-only and metadata-first.

The goal is not to connect real APIs.

The goal is to organize:

- company settings
- display and language settings
- branch setup
- approval rules
- security review
- POS connector preview
- printer / label bridge preview
- API connector preview
- webhook mapping preview
- sync health and logs
- access / audit / reports links

## Current Finding

Current routes:

- `/settings`
- `/integration`
- `/integration/[connectorId]`

Current implementation:

- `/settings` loads `getRestaurantModuleByKey("settings")`
- `/integration` loads `getRestaurantModuleByKey("integration")`
- `/integration/[connectorId]` loads `getRestaurantModuleByKey("integration")` and renders `RestaurantModuleDetailPage`

Main content source:

- `config/restaurant-modules.ts`

Main renderer:

- `components/operations/restaurant-module-page.tsx`
- `components/operations/restaurant-module-detail-page.tsx`

This means Settings and Integration already share the restaurant module preview framework.

## Phase Boundary

This phase must not add:

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

Everything remains UI preview and metadata-only.

## Target IA

Settings and Integration should be treated as one administration cluster.

Recommended naming:

- Settings Center
- Integration Center
- Display Settings
- Access Control
- Audit Trail
- System Foundation

## Settings Center Responsibilities

Settings should frame:

- company profile
- branch setup
- theme / display preference
- language preference
- approval rules
- security review
- admin activity
- related links to roles, access, audit, integration, reports

Current `/settings` already covers:

- display preferences
- branch setup
- approval rules
- language
- security review
- recent changes

Recommended polish:

- Make it clearer that Save / Test / Add Rule / Reset are preview actions only.
- Surface direct links to Display Settings, Access Control, Integration, Audit Trail.
- Keep activity timeline as preview-only.
- Keep all values static.

## Integration Center Responsibilities

Integration should frame:

- POS connector
- printer / label bridge
- supplier API
- webhook mapping
- connector health
- latency
- sync logs
- warning state
- connector owner
- environment

Current `/integration` already covers:

- POS
- printer
- API
- webhooks
- sync
- logs
- connector health
- admin actions

Recommended polish:

- Make connector types more explicit: POS, Printer, API, Webhook.
- Make route cards easier to scan.
- Add clearer right-rail sections for Admin Actions, Connector Health, Related Surfaces.
- Preserve no real sync behavior.

## Detail Route Responsibilities

`/integration/[connectorId]` should eventually show:

- connector identity
- connector type
- branch scope
- sync status
- latency
- last sync
- mapping summary
- logs preview
- related audit events
- related reports
- admin actions preview

Current route exists and uses shared detail page.

Recommended polish:

- Audit detail page after main center page.
- Do not add real connector detail fetching.
- Use static recordId from route param only.

## Copy / Language Direction

Current Settings / Integration content in `config/restaurant-modules.ts` is mostly English preview copy.

For this phase, choose one of two approaches:

### Option A: Restaurant module config remains bilingual only at module label level

Pros:

- Fast
- Consistent with current restaurant module preview framework
- Less risk

Cons:

- Deep preview content remains English-heavy

### Option B: Add settings/integration copy map

Pros:

- Cleaner long-term
- Better customer-facing bilingual support
- Matches PSI standardization pattern

Cons:

- Larger refactor

Recommended for current phase:

- Start with documentation and structure polish.
- Only introduce a copy map if we decide Settings / Integration should become reference-module-ready like PSI.

## Relationship With Display Settings

`/display-settings` is separate and already has a dedicated page.

Recommended:

- Keep `/display-settings` as a focused preview for density, layout mode, sidebar, right rail, tables, and breakpoints.
- Link it from `/settings`.
- Do not merge it into `/settings` yet.

## Relationship With Access / Audit

Settings should link to:

- `/access-control`
- `/roles`
- `/audit-trail`

But should not enforce permissions.

Integration should link to:

- `/audit-trail`
- `/reports`
- `/settings`

But should not execute sync or audit capture.

## Recommended L3 Next Step

Run a focused audit of Settings / Integration visible copy and action behavior.

Check:

1. Are preview action labels too real?
2. Are "Save Changes" and "Sync Now" clearly preview-only?
3. Are POS / Printer / API / Webhook represented clearly?
4. Are there enough admin links?
5. Does Integration detail route look useful?
6. Does the current restaurant module renderer support enough polish?

## Validation

After each change:

- `npm run build`
- `npm test`
- do not commit `.write_test`
- confirm `/settings` renders
- confirm `/integration` renders
- confirm `/integration/POS-KCH-PRIMARY` renders
- confirm no fetch / axios / prisma / supabase / storage usage is added
