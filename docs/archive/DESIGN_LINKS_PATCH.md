# Suggested Patch for Existing Docs

This file is not meant to replace existing docs. It gives clean sections to paste into existing project docs.

---

## Add to `docs/DESIGN.md`

```md
## ME Governance References

The ME design system is governed by the following specification docs:

- `docs/ME_UI_METRICS.md` — desktop/tablet/mobile layout metrics, B-end density rules, table/card/button sizing, and acceptance checklist.
- `docs/ME_VISUAL_SYSTEM.md` — color tokens, typography, spacing, radius, shadow, button, badge, table, tab, timeline, right rail, and responsive behavior.
- `docs/ME_PAGE_TEMPLATES.md` — dashboard, list, detail, major B-end detail, report, settings, tablet manager, and mobile staff templates.
- `docs/ME_MODULE_ARCHITECTURE.md` — module registry, route mapping, metadata, permission, formula, brain/rules, and API boundaries.
- `docs/ME_MODULE_ADD_GUIDE.md` — safe process for adding new modules without breaking the platform.
- `docs/ME_DATA_FORMULA_BRAIN_SEPARATION.md` — required separation between UI, data, formula, brain/rules, permission, and API layers.
- `docs/ME_MAINTENANCE_GUIDE.md` — safe UI changes, module changes, mock-to-real migration, tests/build, and release workflow.
- `docs/ME_REAL_PRODUCT_ROADMAP.md` — roadmap from current UI foundation to real data, permission, write actions, workflow, and multi-device productization.
```

---

## Add to `docs/ME_MASTER_PROJECT_SCOPE.md`

```md
## Product Governance

ME is governed as a modular restaurant operations platform, not a collection of hand-written pages.

The roadmap and implementation rules are defined in:

- `docs/ME_REAL_PRODUCT_ROADMAP.md`
- `docs/ME_MODULE_ARCHITECTURE.md`
- `docs/ME_PAGE_TEMPLATES.md`
- `docs/ME_MODULE_ADD_GUIDE.md`
- `docs/ME_DATA_FORMULA_BRAIN_SEPARATION.md`
- `docs/ME_MAINTENANCE_GUIDE.md`

The visual and UI rules are defined in:

- `docs/ME_UI_METRICS.md`
- `docs/ME_VISUAL_SYSTEM.md`

All future modules must be added through module registry, page templates, metadata, permission boundaries, and page-data adapters before real API/backend integration.
```
