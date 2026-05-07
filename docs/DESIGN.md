# ME Design System / B-End Operational UI Direction

ME is a **restaurant company operating system / branch ERP platform**.

ME is not:

- a developer playground
- a design board
- a landing page
- a PSI-only prototype
- a mock dashboard made of concept cards

ME must feel like a **real customer-facing B-end enterprise SaaS product** used by branch managers, operations teams, HR, finance, purchasing, warehouse, and headquarters.

## Product UI Direction

The visible product UI must be closer to:

- branch / store detail pages
- customer / CRM detail pages
- employee / candidate detail pages
- task / approval detail pages
- supplier / inventory detail pages
- order / finance detail pages

The app shell remains stable:

```text
Left Sidebar
+ Breadcrumb / Topbar
+ Main Workspace
+ Right Context Rail
```

The middle workspace is the product. It must use realistic business detail sections, tables, tabs, logs, timelines, related records, and action bars.

## Final UI Direction: Real B-End Major Pages

The following page types must use realistic enterprise detail-page layouts, not marketing cards or conceptual dashboards:

- Customer detail
- Branch detail
- Employee detail
- Candidate detail
- Task detail
- Approval detail
- Order detail
- Finance / account detail
- Supplier detail
- Inventory item detail
- Procurement request detail

Major pages should include:

- left sidebar navigation
- breadcrumb
- page / record title
- status badge
- summary metadata
- primary and secondary actions
- tabs
- main detail sections
- related records table
- activity timeline or log
- right-side context / activity rail

## Customer-Facing Rules

Customer-visible operational pages must avoid:

- `mock`
- `demo`
- `placeholder`
- `dev`
- `sample`
- fake-customer wording
- landing-page card layouts
- oversized decorative dashboards inside the app shell

If a capability is not implemented yet, the UI should frame it as current release scope, operational context, or preview behavior without exposing internal/developer language to customers.

## Governance References

Future UI changes must follow:

- [ME_UI_METRICS.md](./ME_UI_METRICS.md)
- [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
- [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
- [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
- [ME_MAINTENANCE_GUIDE.md](./ME_MAINTENANCE_GUIDE.md)

Supporting governance docs:

- [ME_MASTER_PROJECT_SCOPE.md](./ME_MASTER_PROJECT_SCOPE.md)
- [ME_REAL_PRODUCT_ROADMAP.md](./ME_REAL_PRODUCT_ROADMAP.md)
- [ME_DATA_FORMULA_BRAIN_SEPARATION.md](./ME_DATA_FORMULA_BRAIN_SEPARATION.md)
- [README.md](./README.md)

## Operating Rule

No future task should treat ME as an open-ended demo surface.

From this point forward:

- page structure follows the approved templates
- layout dimensions follow the UI metrics
- enterprise styling follows the visual system
- modules follow the module architecture
- changes are maintained through the maintenance guide
