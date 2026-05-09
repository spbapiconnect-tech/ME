# UI P1 Unification Final Audit

Latest stable reference point:

- `56f21a2 docs: add tasks legacy ui cleanup audit`

## Purpose

This document closes the P1 UI unification pass.

The goal was to unify core product/admin pages before manual UI bug testing, so UI review can be based on a clear standard instead of subjective guessing.

## Final Audit Result

Final audit returned:

- `P1 UI CLEAN = True`

Confirmed P1 routes:

- `/`
- `/branches`
- `/packages`
- `/access-control`
- `/tasks`
- `/tasks/[taskId]`

## Confirmed Standard

Each audited P1 page now uses or routes into components using:

- `MeDashboardShell`
- `MePageHeader`

## Completed P1 Work

### `/`

Changed homepage from old ERP workbench route to unified business workspace route.

Current route:

- `app/page.tsx`

Current page component:

- `components/business/business-workspace-page.tsx`

Current data helper:

- `lib/page-data/business-workspace-page-data.ts`

Result:

- homepage now uses unified `BusinessWorkspacePage`
- homepage now uses `MeDashboardShell`
- homepage now uses `MePageHeader`
- old `WorkbenchErpPage / ErpShell` is no longer the active root route

### `/branches`

Changed branches route from old ERP/Figma style page to unified branch workspace page.

Current route:

- `app/branches/page.tsx`

Current page component:

- `components/branches/branch-workspace-page.tsx`

Current config source:

- `config/branches.ts`
- `meBranchProfiles`

Result:

- `/branches` now uses unified `BranchWorkspacePage`
- `/branches` now uses `MeDashboardShell`
- `/branches` now uses `MePageHeader`
- old `BranchErpPage` is no longer the active `/branches` route

### `/packages`

Migrated packages page from standalone `<main>` to shared dashboard shell/header.

Current page component:

- `components/packages/packages-page.tsx`

Result:

- `/packages` now uses `MeDashboardShell`
- `/packages` now uses `MePageHeader`
- package stats, filters, catalog, preview, source, and group cards were preserved
- preview-safe package wording was preserved

### `/access-control`

Migrated access control page from standalone `<main>` to shared dashboard shell/header.

Current page component:

- `components/access/access-control-page.tsx`

Result:

- `/access-control` now uses `MeDashboardShell`
- `/access-control` now uses `MePageHeader`
- access stats, filters, role registry, plan registry, access rules, and preview cards were preserved
- metadata-only / no auth / no API / no production enforcement boundary was preserved

### `/tasks`

Audited task route and confirmed no immediate migration needed.

Current route:

- `app/tasks/page.tsx`

Current page component:

- `components/tasks/task-engine-page.tsx`

Result:

- `/tasks` already uses `MeDashboardShell`
- `/tasks` already uses `MePageHeader`
- active route is accepted for P1 manual UI walkthrough

### `/tasks/[taskId]`

Audited task detail route and confirmed no immediate migration needed.

Current route:

- `app/tasks/[taskId]/page.tsx`

Current page component:

- `components/tasks/task-detail-page.tsx`

Result:

- `/tasks/[taskId]` already uses `MeDashboardShell`
- `/tasks/[taskId]` already uses `MePageHeader`
- active route is accepted for P1 manual UI walkthrough

## Deferred Legacy Cleanup

Legacy task components still exist:

- `components/tasks/task-card.tsx`
- `components/tasks/task-board.tsx`
- `components/tasks/task-source-card.tsx`
- `components/tasks/task-stats-row.tsx`
- `components/tasks/task-list.tsx`
- `components/tasks/task-detail-panel.tsx`

These contain older class patterns such as:

- `task-card`
- `task-board`
- `module-chip`
- `me-panel-card`
- `template-kpi-grid`

Decision:

- defer cleanup
- do not block P1 manual UI walkthrough
- clean later only if these components become active route dependencies or are intentionally removed

## Validation

Latest validation before this audit:

- `npm run build` passed
- `npm test` passed
- 293 tests passed

## Boundary

This P1 UI unification pass did not add:

- API calls
- DB writes
- auth/session
- billing
- workflow execution
- notification sending
- browser automation
- Playwright
- Cypress
- CI
- monitoring
- analytics

## Next Step

Proceed to manual UI walkthrough for P1 routes first:

1. `/`
2. `/branches`
3. `/packages`
4. `/access-control`
5. `/tasks`
6. `/tasks/[taskId]`

Manual UI review should now check:

- route loading
- visual consistency
- sidebar/topbar behavior
- card spacing
- header hierarchy
- preview-safe wording
- responsive layout
- no real runtime implication
