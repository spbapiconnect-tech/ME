# Navigation / IA Ownership Final

Latest stable reference point:

- `b11ce05 fix: keep navigation ia resolvable outside primary nav`

## Validation

- `npm run build` passed
- `npm test` passed
- 293 tests passed

## Final Navigation Ownership

The ME navigation ownership pass is complete for this phase.

Primary source of truth:

- `config/navigation.ts`

Primary consumers:

- `lib/navigation.ts`
- `components/navigation/me-sidebar.tsx`
- `components/navigation/me-topbar.tsx`
- `components/navigation/me-mobile-nav.tsx`
- `components/navigation/me-navigation-page.tsx`

## Primary Navigation

Final primary route list:

- Dashboard: `/`
- PSI Workspace: `/psi`
- Reports: `/reports`
- System Foundation: `/system-foundation`

Intent:

- Keep daily business routes limited.
- Avoid making every module a primary item.
- Keep system foundation visible but secondary in tone.

## Footer / Presentation Navigation

Final footer items include:

- Navigation IA: `/navigation`
- Demo Story: `/demo-story`
- Demo Mode: `/demo-mode`
- Stakeholder Summary: `/stakeholder-summary`
- Demo Readiness: `/demo-readiness`
- Modules: `/modules`
- Demo: `/demo`
- Templates: `/templates`

Important rule:

- `navigation-ia` is not a primary route.
- `navigation-ia` remains resolvable through `footerItems`.
- `getNavigationItemByKey("navigation-ia")` must continue to return `/navigation`.

## Intentional Duplicate Hrefs

The final audit still shows these duplicate hrefs. They are accepted for this phase.

| Href | Owners | Decision |
|---|---|---|
| `/` | `dashboard`, `business-workspace` | Dashboard is primary. Business Workspace is an alias only. |
| `/reports` | `reports`, `reports-foundation` | Reports is customer-facing. Reports Foundation is secondary system reference. |
| `/training` | `training`, `education` | Training is staff learning. Education remains future/package naming overlap. |

## Legacy Sidebar Status

The following files still exist and are intentionally not deleted in this phase:

- `components/shell/sidebar.tsx`
- `components/shell/main-shell.tsx`
- `components/erp/erp-sidebar.tsx`
- `components/erp/erp-shell.tsx`
- `lib/erp/erp-module-schema.ts`
- `lib/erp/erp-i18n.ts`

Decision:

- New ME shell should use `components/navigation/me-sidebar.tsx`.
- Legacy shell sidebar remains as a legacy candidate.
- ERP sidebar remains ERP-only until a separate ERP shell migration is planned.
- Do not delete or rewrite these files until route usage is confirmed.

## Completed Navigation / IA Work

### L1: Navigation Audit Inspect

Confirmed:

- `config/navigation.ts` is the intended source of truth.
- Multiple sidebar systems still exist.
- Navigation groups and route hierarchy are mostly in place.

### L2: Standardization Plan

Created:

- `docs/NAVIGATION_IA_STANDARDIZATION_PLAN.md`

Purpose:

- Define navigation source-of-truth rules.
- Define top-level sidebar groups.
- Define duplicate route decisions.
- Define legacy sidebar guardrails.

### L3: Duplicate Route + Legacy Sidebar Audit

Confirmed duplicates:

- `/`
- `/reports`
- `/training`

Confirmed legacy sidebar usage:

- `components/shell/main-shell.tsx` imports `Sidebar`
- `components/erp/erp-shell.tsx` imports `ErpSidebar`

### L4: Audit Report

Created:

- `docs/NAVIGATION_IA_AUDIT.md`

Purpose:

- Record duplicate routes.
- Record primary item overgrowth.
- Record legacy shell and ERP shell status.
- Record recommended decisions before code changes.

### L5: Primary Ownership Cleanup

Updated:

- `config/navigation.ts`

Changes:

- `business-workspace` changed from primary to non-primary alias.
- `navigation-ia` changed from primary to non-primary preview/system route.
- `navigation-ia` removed from `primaryItems`.

### L5 Fix: Navigation IA Resolvable Outside Primary

Updated:

- `config/navigation.ts`

Changes:

- Added `navigationIa` to `footerItems`.
- Preserved helper resolution.
- Fixed failing navigation test.

### L6: Final Ownership Audit

Confirmed:

- `primaryItems` now only contains dashboard, PSI, reports, and system foundation.
- `navigation-ia` is available through footer items.
- Remaining duplicate hrefs are intentional.
- Legacy sidebar files remain intentionally untouched.

## Guardrails Preserved

This navigation pass did not add:

- auth enforcement
- permission runtime
- middleware
- database access
- API calls
- workflow execution
- analytics tracking
- route write behavior

Navigation remains UI/config-only.

## Next Recommended Work

After Navigation / IA, recommended next phases:

1. Settings / Integration center polish
2. Role / Access polish
3. Package / Plan surface polish
4. Demo readiness / stakeholder summary recap
5. Legacy shell migration plan

## Final Status

Navigation / IA is now stable enough for the current ME reference-module phase.

Current status:

- source-of-truth documented
- duplicate ownership documented
- primary navigation trimmed
- navigation helper tests passing
- legacy sidebar not deleted
- ERP sidebar isolated
