# ME Master Project Scope

## Positioning

ME is a **restaurant company operating system** and **branch ERP platform**.

- Chinese subtitle: `餐饮企业运营系统 / 门店 ERP 平台`
- English subtitle: `Restaurant Company Operating System / Branch ERP Platform`

ME should support:

- Branch / Store management
- CRM-style customer and record detail pages
- Staff / HR
- Schedule
- Tasks / approvals
- Inspection / audit
- Training / SOP
- Sales / POS reporting
- Inventory / procurement / supplier
- Finance / costing / margin review
- Roles / permission / settings / integration

## Product Governance

Branch is the **context layer**.

Modules remain independent.

UI must be customer-facing and production-ready.

The governance docs are the source of truth for:

- roadmap
- UI metrics
- visual system
- module architecture
- page templates
- maintenance rules
- data / formula / brain / permission separation

See:

- [DESIGN.md](./DESIGN.md)
- [ME_REAL_PRODUCT_ROADMAP.md](./ME_REAL_PRODUCT_ROADMAP.md)
- [ME_UI_METRICS.md](./ME_UI_METRICS.md)
- [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
- [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
- [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
- [ME_MAINTENANCE_GUIDE.md](./ME_MAINTENANCE_GUIDE.md)

## Current Delivery Scope

The current repository delivers:

- a governed B-end shell for desktop, tablet, and mobile
- shared navigation, layout, and detail-page primitives
- a restaurant module registry and navigation structure
- UI-only restaurant module coverage
- planning-only data, formula, brain/rules, and permission metadata
- schema-driven and renderer-compatible architectural boundaries

## Current Phase

The current major task belongs to **Phase 1 — Final B-end UI governance and production UI cleanup**.

The goal is to lock the customer-facing UI direction before real backend integration starts.

No more random UI exploration should happen after this phase.

Future UI work must follow:

- [ME_UI_METRICS.md](./ME_UI_METRICS.md)
- [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
- [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
- [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
- [ME_MAINTENANCE_GUIDE.md](./ME_MAINTENANCE_GUIDE.md)

## Architecture Boundaries

The project remains **planning-only** for backend-connected capability.

- No real database
- No real API
- No implementation is included yet for production backend, auth, permission enforcement, write execution, workflow automation, stock posting, or notification sending

Rules:

- UI must stay separate from formula logic
- UI must stay separate from permission logic
- page components must not directly couple to backend clients
- modules must remain config-driven and replaceable
- mock-to-real migration must preserve the shell and component contracts

## Explicit Exclusions

The current milestone does not include:

- real database connection
- real POS integration
- real procurement execution
- inventory transaction engine
- auth/session runtime
- permission enforcement
- approval execution
- workflow / automation execution
- notification sending
- direct database calls from React pages

## Working References

- [ME_UI_ARCHITECTURE.md](./ME_UI_ARCHITECTURE.md)
- [ME_NAVIGATION_IA.md](./ME_NAVIGATION_IA.md)
- [ME_BRANCH_CONTEXT_PLACEHOLDERS.md](./ME_BRANCH_CONTEXT_PLACEHOLDERS.md)
- [ME_ROLE_WORKSPACE_PLACEHOLDERS.md](./ME_ROLE_WORKSPACE_PLACEHOLDERS.md)
- [ME_REAL_DATA_MAPPING_PLAN.md](./ME_REAL_DATA_MAPPING_PLAN.md)
