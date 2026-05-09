# PSI Module Standard Audit

This document records the completed PSI standardization pass.

Latest stable reference point:

- `894f0f4 fix: add missing psi shared label keys`

Validation:

- `npm run build` passed
- `npm test` passed
- 293 tests passed

## Scope

The PSI module is now standardized as a multi-surface business module.

Covered surfaces:

- `/psi`
- `/psi/procurement`
- `/psi/procurement/[id]`
- `/psi/supplier`
- `/psi/supplier/[id]`
- `/psi/inventory`
- `/psi/inventory/[id]`
- `/psi/issues`
- `/psi/actions`
- `/psi/actions/[actionKey]`
- `/reports` PSI preview integration

## Completed Work

### L1: Standardization Plan

Created:

- `docs/PSI_MODULE_STANDARDIZATION_PLAN.md`

Purpose:

- Define PSI cleanup order.
- Confirm PSI is a multi-surface module, not a single page.
- Protect existing page-data, service, display-adapter, action-draft, lifecycle, and reports boundaries.

### L2: PSI Language Copy Map

Created:

- `config/psi-language-copy.ts`

Purpose:

- Centralize PSI UI copy.
- Support `en` as default fallback.
- Support `zh` optional locale.
- Avoid hardcoded bilingual text inside page components.

### L3: PSI Overview Language Wiring

Updated:

- `components/psi/psi-home-page.tsx`

Result:

- `/psi` overview page uses `getPsiCopy(locale)`.
- Header, badges, action labels, tabs, sections, right rail labels, table labels, and final small labels use the copy map.
- Static sample values remain as mock data.

### L4: Shared Workspace Shell Language Wiring

Updated:

- `components/psi/detail/x2.tsx`

Result:

- Shared workspace shell used by `/psi/procurement` now uses PSI language copy.
- Page title, subtitle, stats, right rail, action labels, tabs, table columns, selected record, and issue queue labels are localized.
- `app/psi/procurement/page.tsx` remains server-side and unchanged except for passing existing props.

### L5: Issues Page Language Wiring

Updated:

- `components/psi/psi-issues-page.tsx`

Result:

- `/psi/issues` header, badges, action bar, tabs, table columns, right rail, and activity title use PSI language copy.
- `lib/page-data/psi/issues-page-data.ts` remains unchanged.

### L6: Actions Page Language Wiring

Updated:

- `components/psi/actions/psi-actions-page.tsx`

Result:

- `/psi/actions` title, description, notice, stats, filters, select options, action draft section, and empty state use PSI language copy.
- Child cards remain with their existing local `locale === "zh"` handling.

### L7: Detail Shell Language Wiring

Updated:

- `components/psi/detail/x1.tsx`

Result:

These shared detail routes now use PSI language copy through the common detail shell:

- `/psi/procurement/[id]`
- `/psi/supplier/[id]`
- `/psi/inventory/[id]`

Localized areas:

- Header
- Badges
- Meta labels
- Record summary labels
- Back link
- Related actions
- Tabs
- Key information
- Related records
- Insights
- Activity timeline
- Right rail

### L8B: Supplier / Inventory Standalone Pages

Updated:

- `components/psi/psi-supplier-page.tsx`
- `components/psi/psi-inventory-page.tsx`

Result:

- `/psi/supplier` and `/psi/inventory` standalone pages use PSI language copy.
- Header, notices, badges, actions, tabs, section labels, table columns, right rail labels, and presentation notes are localized.
- Mock sample values remain intentionally static.

### L8D: PSI Overview Final Label Polish

Updated:

- `components/psi/psi-home-page.tsx`
- `config/psi-language-copy.ts`

Result:

- Remaining true UI labels such as Branch, Item, Qty, Receiving site, Live view, and Current release were moved into copy map.
- Missing shared keys were repaired in `894f0f4`.

## Boundary Rules Preserved

The standardization did not add:

- real database queries
- API calls
- fetch / axios
- Prisma / Supabase runtime
- workflow execution
- notification sending
- stock posting
- supplier write-back
- procurement write behavior
- inventory adjustment behavior
- action submission behavior

The PSI module remains:

- mock-backed
- metadata-first
- read-only preview
- route-complete
- language-map ready
- compatible with the existing reports preview integration

## Current Accepted Residuals

The final audit may still show some strings that are acceptable:

### Mock sample values

Examples:

- `KCH`
- `ABC Food Supply`
- `SKU-KCH-0007`
- `Coated Fries`
- `PR-KCH-0001`
- `RM 3,480`
- timestamps
- sample inventory quantities

These are demo data, not UI copy.

### Technical keys / route keys

Examples:

- `psi.action.*`
- route paths
- module codes
- enum values
- status-like data values

These should not be moved into UI copy unless they become visible customer-facing labels.

### Child card bilingual ternary copy

Some child cards still use direct local ternary copy:

- `locale === "zh" ? "..." : "..."`

This is acceptable for the current PSI pass because they are already bilingual and not English-only.

## Reference Module Status

PSI is now aligned with the current reference-module standard used by:

- Branch
- Tasks
- Reports

PSI can now be treated as reference-module-ready for this phase.

## Next Recommended Work

Recommended next modules after PSI:

1. Navigation / IA polish
2. Settings / Integration center polish
3. Role / Access polish
4. Package / plan surface polish
5. Final stakeholder summary / demo readiness recap

## Validation Checklist

Before using this audit as final reference, confirm:

- `npm run build` passes
- `npm test` passes
- Latest commit is on `develop`
- No `.write_test` is committed
- PSI routes still import without crashing
- Reports PSI preview remains available
