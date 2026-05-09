# Navigation / IA Audit

Latest stable reference point before this audit:

- `adfecaa docs: add navigation ia standardization plan`

## Validation Before Audit

- `npm run build` passed
- `npm test` passed
- 293 tests passed

## Purpose

This audit records the current navigation state before implementation changes.

The goal is to prevent ME navigation from becoming fragmented across multiple sidebars, duplicate routes, and competing module maps.

## Current Navigation Source of Truth

Primary intended source of truth:

- `config/navigation.ts`

Current consumers:

- `components/navigation/me-sidebar.tsx`
- `components/navigation/me-navigation-page.tsx`
- `components/navigation/me-topbar.tsx`
- `components/navigation/me-mobile-nav.tsx`
- `lib/navigation.ts`

## Current Duplicate Hrefs

Detected duplicate hrefs in `config/navigation.ts`:

| Href | Count | Current Meaning | Recommendation |
|---|---:|---|---|
| `/` | 2 | Dashboard + Business Workspace | Keep Dashboard as main route, treat Business Workspace as alias/copy only |
| `/reports` | 2 | Reports + Reports Foundation | Keep Reports in Reports group, keep Reports Foundation as secondary system reference only if needed |
| `/training` | 2 | Training + Education alias | Decide naming: Training for staff learning, Education for future module/package concept |

## Current Primary Items

Current primary items:

- Dashboard
- Business Workspace
- PSI Workspace
- Reports
- System Foundation
- Navigation IA

Assessment:

| Item | Status | Recommendation |
|---|---|---|
| Dashboard | Good | Keep primary |
| Business Workspace | Duplicate route | Remove from primary or treat as Dashboard alias |
| PSI Workspace | Good | Keep primary |
| Reports | Good | Keep primary |
| System Foundation | Too system-heavy | Consider demoting from primary in daily operator IA |
| Navigation IA | Preview/admin concept | Consider demoting from primary and keeping under System or Demo |

## Current Sidebar Groups

Current sidebar groups in `config/navigation.ts`:

1. Dashboard
2. Store Operations
3. PSI
4. Sales & Reports
5. People
6. Food Operations
7. Finance
8. Demo & Presentation
9. System

Assessment:

The group shape is broadly correct, but the system group is large and should remain secondary. Daily business modules should remain above system/admin tooling.

## Legacy Sidebar Findings

The audit found multiple sidebar systems still present:

### New ME Sidebar

- `components/navigation/me-sidebar.tsx`
- Used by `components/layout/me-dashboard-shell.tsx`
- Used by detail/story/role/branch shells
- Consumes `lib/navigation.ts` and `config/navigation.ts`

Status:

- Keep as primary ME sidebar.

### Legacy Shell Sidebar

- `components/shell/sidebar.tsx`
- Used by `components/shell/main-shell.tsx`

Status:

- Legacy candidate.
- Do not delete yet.
- Review whether `main-shell.tsx` is still used by any active route.

### ERP Sidebar

- `components/erp/erp-sidebar.tsx`
- Used by `components/erp/erp-shell.tsx`
- Uses ERP-specific navigation array.
- `lib/erp/erp-module-schema.ts` also exports `erpNavigation`.

Status:

- ERP-only candidate.
- Should not compete with main ME navigation.
- Later decision: either keep ERP shell isolated or convert it to consume `config/navigation.ts`.

## Route Ownership Snapshot

Important route ownership:

| Route Key | Current Location |
|---|---|
| dashboard | `config/navigation.ts` |
| psi-workspace | `config/navigation.ts` |
| reports | `config/navigation.ts` |
| branches | `config/navigation.ts` |
| tasks | `config/navigation.ts` |
| roles | `config/navigation.ts` |
| settings | `config/navigation.ts` |
| navigation-ia | `config/navigation.ts` |
| reports-foundation | `config/navigation.ts` |

## Recommended Decisions Before Code Changes

### Decision 1: Dashboard vs Business Workspace

Recommended:

- Keep `dashboard` as the route item for `/`.
- Keep `business-workspace` as descriptive alias only, not primary.
- Avoid showing both in primary navigation.

### Decision 2: Reports vs Reports Foundation

Recommended:

- Keep `reports` as customer-facing reporting route.
- Keep `reports-foundation` only as system/foundation reference if useful.
- Avoid duplicate visible links with identical wording.

### Decision 3: Training vs Education

Recommended:

- `Training`: staff training route `/training`.
- `Education`: future module/package concept, not a duplicate sidebar link unless it has a separate route.

### Decision 4: System Foundation and Navigation IA

Recommended:

- Keep accessible.
- Demote from business primary route list if operator-facing IA becomes too crowded.
- Keep under System or Demo/Presentation context.

### Decision 5: Legacy Sidebar

Recommended:

- Do not delete now.
- First audit active imports.
- If `components/shell/main-shell.tsx` is unused by routes, mark as legacy.
- If still used, convert later to `MeSidebar`.

### Decision 6: ERP Sidebar

Recommended:

- Keep isolated until ERP shell migration is planned.
- Do not mix ERP sidebar with ME sidebar.
- Later convert ERP navigation to read from config if needed.

## Next Implementation Step

Recommended L5:

- Add a small navigation audit utility or test to detect duplicate hrefs and primary route overgrowth.
- Add notes to `config/navigation.ts` for intentional duplicates.
- Optionally demote `business-workspace` from `isPrimary: true` to `false`.
- Optionally demote `navigation-ia` from `isPrimary: true` to `false`.

## Guardrails

Do not add:

- auth enforcement
- permission runtime
- database access
- API calls
- route middleware
- workflow execution
- analytics tracking

Navigation IA should remain UI/config-only for this phase.
