# Branch Module Standard Audit

This document records the current standard achieved by the Branch Management module.

The Branch module is now the reference pattern for future ME modules such as Tasks, Reports, PSI, Staff, Schedule, Training, Settings, and Integration.

## Current Stable Commit

Latest completed milestone:

- 3ebc6a8 refactor: extract branch mock lists

Validation:

- npm run build passed
- npm test passed
- 293 tests passed

## Branch Module Responsibilities

The Branch module is responsible for:

- branch directory
- branch status overview
- branch KPI preview
- branch detail panel
- branch task entry point
- branch report entry point
- branch inventory alert preview
- branch staff on duty preview
- branch quick links
- branch language reference pattern
- branch action contract reference pattern

## Completed Standards

### 1. Responsive Layout

Completed:

- desktop sidebar stays fixed
- desktop main workspace scrolls independently
- mobile sidebar is hidden
- mobile drawer navigation is available
- mobile KPI layout is controlled
- mobile tabs do not overflow the card
- detail tabs use horizontal scroll when needed

### 2. Language System

Completed:

- Branch module uses config/branch-language-copy.ts
- English is default
- Chinese mode uses zh labels
- English mode does not show Chinese beside English
- page header is localized
- actions are localized
- filters are localized
- table labels are localized
- detail labels are localized
- tabs use stable keys with localized labels
- mobile cards are localized
- right rail labels are localized
- KPI labels are localized

Reference files:

- config/branch-language-copy.ts
- components/branches/branch-erp-page.tsx

### 3. Stable Tab Logic

Completed:

- tabs no longer use English text as state logic
- activeTab uses stable keys
- labels are resolved from language copy
- switching language does not break tab matching

Pattern:

- key controls logic
- label controls display

### 4. Action Contract Layer

Completed:

- Branch buttons have action contracts
- current behavior is documented
- future behavior is documented
- permissions are documented
- API boundaries are documented as future placeholders
- audit and notification notes are documented where needed

Reference files:

- config/branch-action-contracts.ts
- docs/BRANCH_ACTION_CONTRACTS.md

Covered actions:

- branch.create
- branch.export
- branch.viewReports
- branch.openTasks
- branch.createTask
- branch.import
- branch.batchEdit
- branch.archive
- branch.filter.more
- branch.region.manage

### 5. Demo Data Separation

Completed:

- KPI sample data moved out of the page component
- branch detail sample data moved out of the page component
- inventory alert mock list moved out of the page component
- staff on duty mock list moved out of the page component
- recent activity mock list moved out of the page component

Reference file:

- config/branch-demo-data.ts

### 6. Page Component Boundary

Current direction:

- components/branches/branch-erp-page.tsx should remain UI, layout, interaction, and language wiring only.
- It should not keep growing as a data storage file.
- Future data should come from config, mock repository, service provider, or API boundary.

## Current File Roles

| File | Role |
|---|---|
| components/branches/branch-erp-page.tsx | UI layout, interaction, language wiring |
| config/branch-language-copy.ts | Branch en/zh copy source |
| config/branch-demo-data.ts | Branch demo and mock data |
| config/branch-action-contracts.ts | Branch button and workflow contracts |
| docs/BRANCH_ACTION_CONTRACTS.md | Branch action planning documentation |

## Remaining Known Mock Content

Some English sample content can remain for now because it represents mock records, not UI copy.

Examples:

- branch names
- staff names
- product names
- task titles
- activity logs
- inventory item names

These should eventually move into a richer mock data catalog or mock repository when real data mapping begins.

## Rules for Future Modules

Future modules should follow this order:

1. Build responsive UI shell.
2. Add action contract map.
3. Add language copy map.
4. Use stable keys for tabs and filters.
5. Keep demo data outside the page component.
6. Run npm run build.
7. Run npm test.
8. Commit only after both pass.

## Recommended Next Modules

Recommended rollout order after Branch:

1. Tasks
2. Reports
3. PSI overview
4. Procurement
5. Supplier
6. Inventory
7. Staff
8. Schedule
9. Training
10. Settings / Integration / Roles

## Do Not Do

Do not:

- hardcode bilingual text inside page JSX
- use English display labels as logic keys
- keep mock records inside large page components
- wire real APIs before service boundaries are ready
- connect buttons directly without action contracts
- add database logic into UI components
- mix module logic into global shell components

## Branch Module Standard Status

Status: reference module ready

The Branch module can now be used as the standard pattern for other ME modules.
