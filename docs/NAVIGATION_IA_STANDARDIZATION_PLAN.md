# Navigation / IA Standardization Plan

This document defines the next navigation cleanup pass for ME.

Latest stable reference point before this plan:

- `2959c5c docs: add psi module standard audit`

## Goal

ME should have one clear product navigation system that feels like a real SaaS platform, not a collection of demo routes.

The navigation should support:

- business-first entry
- module discovery
- operations routing
- PSI as a reference module
- reports as a shared reporting center
- system foundation routes as secondary/admin surfaces
- future module expansion without rewriting sidebar code

## Current Findings

The current codebase has multiple navigation surfaces:

- `config/navigation.ts`
- `components/navigation/me-sidebar.tsx`
- `components/navigation/me-navigation-page.tsx`
- `components/shell/sidebar.tsx`
- `components/erp/erp-sidebar.tsx`
- `lib/erp/erp-module-schema.ts`
- `lib/erp/erp-i18n.ts`
- `components/dashboard-home.tsx`

This means navigation is currently partly standardized, but not yet fully unified.

## Source of Truth Rule

The primary source of truth should be:

- `config/navigation.ts`

The following should become consumers or legacy candidates:

- `components/navigation/me-sidebar.tsx` should consume `config/navigation.ts`.
- `components/navigation/me-navigation-page.tsx` should visualize `config/navigation.ts`.
- `components/shell/sidebar.tsx` should be reviewed as legacy.
- `components/erp/erp-sidebar.tsx` should be reviewed as legacy or ERP-only.
- `lib/erp/erp-module-schema.ts` should not compete with the main navigation IA.

## Recommended Top-Level Sidebar Groups

The ME sidebar should prioritize these groups:

1. Business
2. Store Operations
3. PSI
4. Tasks / Workforce
5. Reports & Finance
6. Food Operations
7. System
8. Demo / Presentation

## Primary Routes

Primary routes should remain limited.

Recommended primary items:

- `/`
- `/psi`
- `/reports`
- `/branches`
- `/navigation` or `/system-foundation`

Do not make every module a primary item.

## Business Group

Purpose:

- daily business overview
- portfolio view
- branch-level visibility

Recommended items:

- Dashboard
- Branches
- PSI Workspace
- Reports

## Store Operations Group

Purpose:

- operational execution
- issues
- inspections
- task follow-up

Recommended items:

- Branches
- Inspection
- Issues
- Tasks

## PSI Group

Purpose:

- procurement, supplier, inventory, receiving, issues, actions

Recommended items:

- PSI Overview
- Procurement
- Supplier
- Inventory
- Receiving
- PSI Issues
- PSI Actions
- PSI Reports

Status:

- PSI is reference-module-ready after `docs/PSI_MODULE_STANDARD_AUDIT.md`.

## Reports & Finance Group

Purpose:

- management reporting
- POS reports
- sales analytics
- financial preview

Recommended items:

- Reports Overview
- POS Reports
- Sales Analytics
- Branch Performance
- Export Center
- Finance / Costing

Placeholder items can remain visible only if they are clearly marked as coming soon or preview.

## Workforce Group

Purpose:

- staff, schedule, training, roles

Recommended items:

- Staff / HR
- Schedule
- Training
- Roles

Roles may also appear under System depending on permission context, but it should not be duplicated without reason.

## Food Operations Group

Purpose:

- restaurant-specific operating content

Recommended items:

- SOP / Recipes
- Product Standards
- Expiry / Labels
- Food Safety

## System Group

Purpose:

- admin, integration, platform foundation, governance

Recommended items:

- Settings
- Integration
- Access Control
- Action Contracts
- Audit Trail
- Workflow
- Notifications
- Rules
- Packages
- Layout Engine
- Real Data Mapping
- Display Settings
- System Foundation

System routes should stay accessible but not compete with daily business routes.

## Demo / Presentation Group

Purpose:

- sales demo
- stakeholder presentation
- readiness checks

Recommended items:

- Demo Story
- Demo Mode
- Stakeholder Summary
- Demo Readiness
- Modules
- Templates
- Components

These should not be mixed into the daily operator navigation.

## Duplicate / Conflict Review

Potential conflicts to clean in later steps:

### Dashboard / Business Workspace

Both route to `/`.

Need a single sidebar label or a clear alias rule.

### Reports / Reports Foundation

Both point to `/reports`.

Use one main report item in Reports group, and only show foundation link inside System if needed.

### Training / Education

Both exist conceptually.

Need naming decision:

- Training = staff-facing learning
- Education = module/placeholder/future capability

### Roles

Currently appears as business/report/system-related depending context.

Need one main group plus cross-link.

### Legacy Sidebars

Review these files:

- `components/shell/sidebar.tsx`
- `components/erp/erp-sidebar.tsx`
- `lib/erp/erp-module-schema.ts`

Decision options:

1. Keep as legacy only.
2. Replace with ME sidebar.
3. Convert to wrappers around `config/navigation.ts`.

## Hard Rules

1. Do not hardcode new navigation arrays in page components.
2. Add new modules through `config/navigation.ts`.
3. Every navigation label must have `zh` and `en`.
4. Every sidebar item should have a route key when possible.
5. Placeholder routes must be visibly marked.
6. Demo routes must stay separate from daily business routes.
7. System foundation routes should be secondary.
8. No navigation change should add auth, database, API, workflow, or permission enforcement.

## L3 Recommended Next Step

Next implementation step:

- Create a navigation audit helper or checklist.
- Confirm duplicate hrefs and group ownership.
- Mark legacy sidebar files as candidates.
- Do not delete legacy sidebar files until routes are confirmed.

## Validation

After each navigation change:

- `npm run build`
- `npm test`
- confirm no `.write_test` committed
- confirm `/navigation` still renders
- confirm sidebar active states still work
- confirm PSI, Reports, Branches, Tasks routes remain accessible
