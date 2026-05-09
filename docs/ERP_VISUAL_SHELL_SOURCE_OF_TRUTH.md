# ERP Visual Shell Source Of Truth

## Decision

The final customer-facing ME UI standard is the ERP visual shell, not the current develop `MeDashboardShell` style.

Source-of-truth visual references:

- `components/erp/erp-shell.tsx`
- `components/erp/erp-sidebar.tsx`
- `components/erp/erp-topbar.tsx`
- `components/erp/erp-page-header.tsx`
- `components/erp/erp-filter-bar.tsx`
- `components/erp/erp-kpi-grid.tsx`
- `components/erp/erp-data-table.tsx`
- `components/erp/erp-right-rail.tsx`
- `components/business/workbench-erp-page.tsx`
- `components/branches/branch-erp-page.tsx`

## Current Restored Routes

- `/` uses `WorkbenchErpPage`
- `/branches` uses `BranchErpPage`

## Rule

Do not replace finished ERP visual pages with `MeDashboardShell`.

`MeDashboardShell` may remain for system, foundation, demo, or internal preview pages, but it is not the visual target for main customer-facing ERP pages.

## Future UI Unification Direction

Unify these pages toward the ERP visual shell:

- `/packages`
- `/access-control`
- `/tasks`
- `/psi`
- `/reports`
- `/settings`
- `/integration`
- `/roles`

The goal is to bring them into the same ERP-style layout language:

- ERP topbar
- ERP sidebar
- ERP filter/control bar
- ERP page header
- ERP KPI grid
- ERP table/list pattern
- ERP right rail where useful
- light premium B2B SaaS canvas
- consistent rounded cards
- manager-ready layout

## Boundary

Do not add real API, DB, auth, billing, workflow execution, monitoring, analytics, browser automation, or CI.
