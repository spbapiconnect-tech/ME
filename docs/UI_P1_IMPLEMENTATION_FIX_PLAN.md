# UI P1 Implementation Fix Plan

Latest stable reference point:

- `dc77216 docs: add ui route pattern mapping`

## Purpose

This document records the P1 UI implementation audit and defines the first real UI unification targets.

The goal is to unify core product/admin pages before manual UI bug testing.

This phase does not add API calls, DB writes, auth/session, billing, workflow execution, monitoring, analytics, browser automation, Playwright, Cypress, or CI.

## L4 Audit Result

P1 routes were audited for:

- shell usage
- page header usage
- workspace section usage
- table/list pattern
- preview-safe notice
- standalone main usage
- legacy class usage
- old ERP/template style usage

## P1 Routes That Are Already Mostly Unified

These routes already use the shared ME layout language and should not be the first rewrite target:

- `/psi`
- `/psi/supplier`
- `/psi/inventory`
- `/psi/issues`
- `/reports`
- `/reports/pos`
- `/settings`
- `/integration`
- `/integration/POS-KCH-PRIMARY`
- `/roles`

Reason:

- these already use `MeDashboardShell`, `MePageHeader`, `MeWorkspaceSection`, `MeTabs`, `MeDataTable`, or the shared restaurant module preview pattern.
- they are not visually perfect, but they are consistent enough to delay heavy changes.

## First Batch Fix Targets

### 1. Homepage `/`

Current files:

- `app/page.tsx`
- `components/business/workbench-erp-page.tsx`
- `components/dashboard-home.tsx`

Audit finding:

- `app/page.tsx` currently renders `WorkbenchErpPage`.
- `components/dashboard-home.tsx` still contains older `main-frame`, `hero-metadata`, and `template-link-row` style patterns.
- homepage is the most important first impression, so it should follow the ME Business Workspace standard.

Recommended fix type:

- create or update a homepage that uses `MeDashboardShell` and `MePageHeader`
- keep business dashboard content
- remove homepage dependency on old ERP/Figma visual language
- use shared cards and sections
- keep preview/read-only boundaries where relevant

Priority:

- P1-A

### 2. Branches `/branches`

Current files:

- `app/branches/page.tsx`
- `components/branches/branch-erp-page.tsx`
- `components/branches/branch-workspace-page.tsx`

Audit finding:

- `app/branches/page.tsx` currently renders `BranchErpPage`.
- `BranchErpPage` is old ERP/Figma-style structure.
- `branch-workspace-page.tsx` already exists and uses `MeDashboardShell`, `MePageHeader`, `MeWorkspaceSection`, `MeTabs`, and `MeDataTable`.

Recommended fix type:

- switch `/branches` route to render `BranchWorkspacePage`
- keep `BranchErpPage` in code temporarily as legacy/reference
- do not delete old ERP/Figma page in this pass
- verify route still builds and tests pass

Priority:

- P1-A

### 3. Access Control `/access-control`

Current files:

- `app/access-control/page.tsx`
- `components/access/access-control-page.tsx`

Audit finding:

- `access-control-page.tsx` uses standalone `<main>`
- it uses `Card`, `Button`, and preview-safe wording
- it does not use `MeDashboardShell` or `MePageHeader`

Recommended fix type:

- migrate page wrapper to `MeDashboardShell`
- migrate top hero card to `MePageHeader`
- keep existing registry/filter/content cards
- preserve metadata-only wording
- preserve no auth / no API / no hide / no permission enforcement boundary

Priority:

- P1-B

### 4. Packages `/packages`

Current files:

- `app/packages/page.tsx`
- `components/packages/packages-page.tsx`

Audit finding:

- `packages-page.tsx` uses standalone `<main>`
- it already has safe package wording
- it does not use `MeDashboardShell` or `MePageHeader`

Recommended fix type:

- migrate page wrapper to `MeDashboardShell`
- migrate top hero card to `MePageHeader`
- keep package stats, filters, package catalog, preview, source, and group cards
- preserve Catalog Active, Preview Usable, Billing Placeholder, Future Ref wording
- preserve no billing/payment/subscription/provisioning/module enablement boundary

Priority:

- P1-B

### 5. Tasks `/tasks`

Current files:

- `app/tasks/page.tsx`
- `components/tasks/task-engine-page.tsx`
- `components/tasks/task-card.tsx`
- `components/tasks/task-board.tsx`
- `components/tasks/task-source-card.tsx`
- `components/tasks/task-stats-row.tsx`

Audit finding:

- `task-engine-page.tsx` already uses `MeDashboardShell` and `MePageHeader`
- supporting task components still use legacy classes:
  - `task-card`
  - `task-board`
  - `module-chip`
  - `me-panel-card`
  - `template-kpi-grid`

Recommended fix type:

- do not rewrite `/tasks` first
- first mark as legacy component cleanup target
- after homepage / branches / access / packages, migrate task subcomponents to Card / Badge / MeWorkspaceSection style

Priority:

- P1-C

## First Implementation Order

Recommended order:

1. `/branches`
   - lowest risk
   - likely route swap only
   - shared workspace page already exists

2. `/packages`
   - medium risk
   - simple standalone main to shell/header migration

3. `/access-control`
   - medium risk
   - standalone main to shell/header migration

4. `/`
   - higher visual impact
   - homepage requires careful decision because current route uses WorkbenchErpPage

5. `/tasks` subcomponents
   - defer until after core shell migrations

## Do Not Change Yet

Do not change these in the first implementation pass:

- `/psi`
- `/psi/procurement`
- `/psi/supplier`
- `/psi/inventory`
- `/psi/issues`
- `/reports`
- `/reports/pos`
- `/settings`
- `/integration`
- `/integration/POS-KCH-PRIMARY`
- `/roles`
- `/demo-story`
- `/demo-mode`
- `/stakeholder-summary`
- `/demo-readiness`
- `/navigation`
- `/system-foundation`

Reason:

- these are either already close enough, lower priority, or presentation/foundation surfaces.

## Definition Of Done For First UI Unification Batch

A route is considered unified when:

- it uses `MeDashboardShell` or clearly matches its spacing
- it uses `MePageHeader` or a direct equivalent
- it has preview-safe notice where needed
- it uses shared card spacing/radius conventions
- it does not rely on old ERP/template classes for primary page layout
- build passes
- test suite passes

## Recommended L5 Work

Start with the lowest-risk real UI patch:

- switch `/branches` from `BranchErpPage` to `BranchWorkspacePage`

Then run:

- `npm run build`
- `npm test`

If successful, commit:

- `ui: use unified branch workspace page`
