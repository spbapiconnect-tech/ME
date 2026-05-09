# PSI Module Standardization Plan

This document defines the cleanup and standardization path for the PSI module.

Branch, Task, and Reports are the current reference modules.

PSI is not a blank module. It is a multi-surface business module covering procurement, supplier, inventory, issues, actions, receiving, reports, lifecycle, and detail workspaces.

## Current PSI Module Status

Current route structure:

- app/psi/page.tsx
- app/psi/procurement/page.tsx
- app/psi/procurement/[id]/page.tsx
- app/psi/supplier/page.tsx
- app/psi/supplier/[id]/page.tsx
- app/psi/inventory/page.tsx
- app/psi/inventory/[id]/page.tsx
- app/psi/issues/page.tsx
- app/psi/actions/page.tsx
- app/psi/actions/[actionKey]/page.tsx
- app/psi/receiving/page.tsx
- app/psi/receiving/[receivingId]/page.tsx

Current main PSI components:

- components/psi/psi-home-page.tsx
- components/psi/psi-workspace-page.tsx
- components/psi/psi-detail-page.tsx
- components/psi/psi-issues-page.tsx
- components/psi/psi-inventory-page.tsx
- components/psi/psi-supplier-page.tsx

Current shared/detail components:

- components/psi/detail/x2.tsx
- components/psi/detail/x1.tsx
- components/psi/detail/psi-lifecycle-strip.tsx
- components/psi/detail/psi-linked-records-card.tsx
- components/psi/detail/psi-insights-card.tsx
- components/psi/detail/psi-related-actions-card.tsx
- components/psi/detail/psi-related-tasks-card.tsx
- components/psi/detail/psi-timeline.tsx

Current actions components:

- components/psi/actions/psi-actions-page.tsx
- components/psi/actions/psi-action-detail-page.tsx
- components/psi/actions/psi-action-card.tsx
- components/psi/actions/psi-action-preview-card.tsx
- components/psi/actions/psi-action-form-preview.tsx
- components/psi/actions/psi-action-source-card.tsx
- components/psi/actions/psi-action-chip.tsx

Current config/data/service boundaries:

- config/psi/action-drafts.ts
- config/psi/lifecycle.ts
- data/psi/procurement.ts
- data/psi/supplier.ts
- data/psi/inventory.ts
- lib/page-data/psi/procurement-page-data.ts
- lib/page-data/psi/supplier-page-data.ts
- lib/page-data/psi/inventory-page-data.ts
- lib/page-data/psi/issues-page-data.ts
- lib/page-data/psi/reports-page-data.ts
- lib/display-adapters/psi/procurement.adapter.ts
- lib/display-adapters/psi/supplier.adapter.ts
- lib/display-adapters/psi/inventory.adapter.ts
- lib/display-adapters/psi/reports.adapter.ts

## Standardization Direction

PSI should follow the Branch, Task, and Reports module standards, but it must be standardized in layers.

Do not rebuild PSI from zero.

Use this route:

1. Preserve existing PSI data, page-data, display adapters, action drafts, and lifecycle configs.
2. Create a PSI language copy map.
3. Standardize /psi overview first.
4. Standardize shared workspace layout used by procurement.
5. Standardize issues page.
6. Standardize actions page.
7. Standardize detail shell.
8. Standardize supplier and inventory detail pages.
9. Create final audit doc only after build/test passes.

## Key Issues Found

### 1. PSI Has Multiple Surfaces

PSI is not a single page. It includes:

- PSI overview
- Procurement workspace
- Supplier workspace
- Inventory workspace
- Issues queue
- Action draft center
- Detail records
- Receiving route
- Reports integration

This means a single cleanup pass is too risky.

### 2. Hardcoded UI Copy Exists

Hardcoded UI copy appears in:

- components/psi/psi-home-page.tsx
- components/psi/detail/x2.tsx
- components/psi/detail/x1.tsx
- components/psi/psi-issues-page.tsx
- components/psi/actions/psi-actions-page.tsx
- app/psi/procurement/page.tsx
- app/psi/procurement/[id]/page.tsx
- app/psi/supplier/[id]/page.tsx
- app/psi/inventory/[id]/page.tsx

### 3. Existing PSI Data Already Has zh/en Fields

Many PSI data/config areas already support zh/en:

- config/psi/action-drafts.ts
- config/psi/lifecycle.ts
- data/psi/procurement.ts
- data/psi/supplier.ts
- data/psi/inventory.ts
- lib/display-adapters/psi/*.adapter.ts
- lib/display-adapters/psi/reports.adapter.ts

Do not duplicate this data into page JSX.

### 4. Reports Integration Already Exists

Reports already consume PSI through:

- lib/page-data/psi/reports-page-data.ts
- lib/display-adapters/psi/reports.adapter.ts
- components/reports/psi-report-dashboard-panel.tsx

Do not break this boundary.

## Target New File

Recommended new file:

- config/psi-language-copy.ts

## PSI Language Copy Scope

The copy map should include:

### Shared

- procurement
- supplier
- inventory
- receiving
- issues
- actions
- reports
- overview
- activity
- attachments
- linkedRecords
- lifecycle
- source
- status
- priority
- detail

### PSI Overview

- eyebrow
- title
- description
- notice
- operation modules
- overview sections
- right rail sections
- action labels
- tab labels
- workspace note

### PSI Workspace

- workspace context
- issue watch
- main records
- selected record
- issue queue
- open PSI actions
- open issues
- open reports
- related actions
- record fields

### PSI Issues

- issue context
- issue and incident queue
- issue queue
- issue activity
- columns

### PSI Actions

- actions title
- filters
- action drafts
- no action draft found
- preview labels
- source labels

## Implementation Phases

### L1 Plan

Create this plan document.

### L2 PSI Language Copy

Create:

- config/psi-language-copy.ts

No UI changes yet.

### L3 PSI Overview Language Wiring

Update:

- components/psi/psi-home-page.tsx

Required changes:

- mark/use client only if reading UI preference store directly
- read locale
- resolve copy with getPsiCopy(locale)
- replace hardcoded overview labels
- keep static sample values as mock data for now

### L4 Shared Workspace Language Wiring

Update:

- components/psi/detail/x2.tsx
- components/psi/psi-workspace-page.tsx if needed

Required changes:

- replace workspace shell labels
- replace shared tabs
- replace Main Records / Selected Record / Issue Queue labels
- keep passed-in record values unchanged

### L5 Issues Page Language Wiring

Update:

- components/psi/psi-issues-page.tsx

Required changes:

- page header labels
- action bar labels
- table columns
- section labels
- right rail labels

### L6 Actions Page Language Wiring

Update:

- components/psi/actions/psi-actions-page.tsx

Required changes:

- page header labels
- filter labels
- action draft list labels
- empty state label
- preview/source labels where appropriate

### L7 Detail Shell Language Wiring

Update:

- components/psi/detail/x1.tsx
- components/psi/psi-detail-page.tsx

Required changes:

- page header labels
- key information labels
- related records labels
- insights labels
- related action placeholder labels

### L8 Supplier / Inventory Detail Pages

Update:

- components/psi/psi-supplier-page.tsx
- components/psi/psi-inventory-page.tsx

Required changes:

- only after shared shell is stable

### L9 Audit Doc

Create:

- docs/PSI_MODULE_STANDARD_AUDIT.md

Only after:

- npm run build passes
- npm test passes

## Do Not Do

Do not:

- rebuild PSI from zero
- delete PSI data files
- remove page-data helpers
- remove display adapters
- duplicate PSI data into JSX
- connect real procurement writes
- connect real inventory writes
- connect real supplier writes
- submit real action forms
- execute workflows
- send notifications
- add database queries
- add API calls
- break Reports PSI preview

## Validation Rule

Every phase must run:

- npm run build
- npm test

Commit only after both pass.
