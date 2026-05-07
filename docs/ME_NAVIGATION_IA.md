# ME Navigation IA

## Purpose

Define the real B-end navigation structure for ME Branch ERP.

Navigation must feel like a practical restaurant ERP / CRM product, not a route playground.

## Source of Truth

- Route and item source: `config/navigation.ts`
- Navigation helpers: `lib/navigation.ts`
- Navigation types: `types/navigation.ts`
- Sidebar / topbar / mobile nav UI: `components/navigation/*`

Hard rule:

- never hard-code module lists directly inside sidebar or topbar components

## Current Major Groups

- Dashboard
- Store Operations
- PSI
- Sales & Reports
- People
- Food Operations
- Finance
- System
- Demo & Presentation

## Route Policy

- If a navigation item links to a route, that route must exist
- If a route is not ready, the item must remain disabled / preview-only
- Do not create broken hrefs
- Do not expose internal route experiments through the customer-facing shell

## Customer-Facing Navigation Rules

- labels must be short and operational
- active states must be obvious
- group structure must follow module logic, not implementation history
- business routes should dominate the app shell
- system routes should remain accessible but secondary
- customer-visible navigation must avoid developer labels such as `mock`, `demo`, `placeholder`, or `dev`

## Current Product Navigation Direction

The app should guide users toward realistic workflows:

- branch operations
- PSI
- staff and schedule
- training and SOP
- issue / inspection / task handling
- sales, reports, and finance review
- access, workflow, audit, and system configuration

## Future Migration

Future work may add:

- role-aware visibility
- branch-aware visibility
- permission-aware hiding
- mobile-specific nav refinements

But those must still preserve the shared config-driven IA model.
