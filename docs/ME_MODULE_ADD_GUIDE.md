# ME Module Add Guide

## Purpose

This guide defines the safe SOP for adding a new module to **ME Branch ERP**.

A module should be added through architecture, templates, and metadata first. Do not start by hardcoding a page.

## Add-module SOP

1. Register module
2. Add route
3. Choose page template
4. Define list fields
5. Define detail fields
6. Define actions
7. Define permissions
8. Define formula / rules if needed
9. Define mock data boundary
10. Define future API boundary
11. Add tests
12. Run build

## Detailed Flow

### 1. Register module

Add the module to:

- `config/restaurant-modules.ts`

Define:

- module key
- label
- route
- group
- page template
- future layer requirements

### 2. Add route

Create the route under `app/*` and ensure the route is represented in navigation if it should be reachable from the shell.

### 3. Choose page template

Select from:

- dashboard workspace
- list workspace
- detail workspace
- report workspace
- settings workspace
- major record detail page
- mobile staff workflow page
- manager tablet workspace

### 4. Define list fields

If the module has a list or queue:

- define the visible columns
- define filter fields
- define status labels
- define sort expectations

### 5. Define detail fields

For detail pages:

- summary metadata
- tabs
- information sections
- related tables
- right rail sections
- timeline / log requirements

### 6. Define actions

Define:

- primary action
- secondary actions
- overflow actions

Actions must remain aligned with the module architecture and permission model.

### 7. Define permissions

Register future scopes in the permission metadata layer before implementing real action enforcement.

### 8. Define formula / rules if needed

If the module needs:

- calculations
- risk scoring
- automation suggestions
- operational alerts

then define them in the formula and brain/rules metadata layers instead of embedding them inside UI.

### 9. Define mock data boundary

Do not scatter business records inside page JSX.

Use:

- config
- `data/mock/*`
- `lib/page-data/*`

### 10. Define future API boundary

Document the repository/service/API boundary before real backend work begins.

### 11. Add tests

At minimum:

- route import safety
- module config presence
- navigation safety
- no forbidden backend coupling

### 12. Run build

Run:

```bash
npm test
npm run build
```

## What Not To Do

- do not hardcode the module directly in the sidebar
- do not put formulas inside React components
- do not put permissions inside button components
- do not fetch data directly from page components
- do not create broken routes
- do not expose developer wording to customer-facing surfaces

## Example Future Modules

Use this same SOP for:

- Delivery
- Franchise
- Customer CRM
- Kitchen Display
- Finance
- Maintenance

## Release Gate For New Modules

A new module is not ready unless:

- it is registered in config
- it uses an approved template
- it has metadata boundaries
- it has route coverage
- it builds and tests cleanly
