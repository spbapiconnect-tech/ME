# ME Project Tasks & Git Workflow

## Delivery Order

1. Project setup and metadata alignment
2. Theme system foundation
3. Language system foundation
4. Responsive shell placeholders
5. Module registry foundation
6. Dashboard polish and verification
7. Schema-driven page templates
8. Reusable core component library
9. Demo pages and sales readiness
10. Task Engine demo surfaces and navigation
11. Layout Engine / Skin System foundation
12. Procurement + Supplier + Inventory MVP planning
13. Procurement + Supplier + Inventory implementation foundation

## Branch Model

Use a lightweight flow around `main` and `develop`.

- `main`: stable public baseline
- `develop`: integration branch for current work
- `feature/*`: feature delivery branches
- `fix/*`: bug fixes
- `docs/*`: documentation work
- `release/*`: release preparation

## Commit Style

Use Conventional Commits.

- `feat: add ME theme switcher`
- `feat: add ME module registry`
- `feat: add ME page templates`
- `feat: add ME core component library`
- `feat: add ME task engine navigation`
- `fix: prevent ME module card overflow`
- `docs: update ME project scope`

## Pull Request Checks

- Bright, dark, and moon themes render correctly
- Chinese and English labels do not break layout
- Module cards still read from `config/modules.ts`
- No hardcoded component colors bypass CSS variables
- No real business logic or connectors were introduced
- `/tasks` navigation remains reachable from the main demo surfaces
- `/layout-engine` navigation remains reachable from the main demo and foundation surfaces
- `/roles` remains reachable from the homepage, `/navigation`, and `/system-foundation` without changing runtime access rules
- `/branches` remains reachable from the homepage, topbar, `/navigation`, `/roles`, and `/system-foundation` without changing runtime access rules
- `/stakeholder-summary` remains reachable from navigation, homepage, demo story, demo mode, and `/system-foundation` without adding CRM, analytics, tracking, or sharing permissions
- `/demo-readiness` remains reachable from homepage, topbar, demo story, demo mode, stakeholder summary, navigation, and `/system-foundation` without adding monitoring, analytics, tracking, browser automation, runtime crawler, or CI changes

## Module Registry Milestone

- The module registry is the single source of truth for module metadata
- Module Center reads from `config/modules.ts`
- Future modules are registered but not implemented
- No real module business logic is included yet
- Dashboard shows enabled/core modules only
- Module Center can display all modules by category and status
- Future module additions should happen by config first, not by hardcoding pages

## Page Templates Milestone

- Standard module page skeletons are now schema-driven
- Templates include Dashboard / Listing / Detail / Issue / Form / Report / Settings
- Schemas live under `config/page-schemas/`
- Layouts live under `components/layout/`
- `app/templates/page.tsx` is a demo only
- No real business logic is included yet
- No real API is connected
- Future module pages should use schemas first before custom components
- Responsive rules:
  - mobile listing = card list
  - tablet listing = split preview
  - desktop listing = data grid
  - mobile detail = single column
  - tablet/desktop detail = context panel
  - issue pages must support close-loop structure later

## Core Components Milestone

- Reusable components are now centralized under `components/data` and `components/form`
- Page templates should reuse these components before introducing custom UI
- Components are theme-token based
- Components must support bilingual layout and English overflow protection
- Component demo route lives at `/components`
- No real business logic is included yet
- No real API is connected
- Future module pages should compose from these components first

## Task Engine Milestone

- Task Engine route lives at `/tasks`
- Task detail route lives at `/tasks/[taskId]`
- Task mock data lives under `data/tasks/`
- Task pages reuse shared data and form-adjacent UI primitives
- Source-mapping links connect demo module records to Task Engine views
- No real workflow engine, notification service, database, or API is connected

## Layout Engine / Skin System Foundation

- `/layout-engine` route now exists
- `LayoutRegistry` exists under `config/layout-engine/`
- `SkinRegistry` exists under `config/layout-engine/`
- DisplayModel adapters exist under `config/layout-engine/`
- `ModulePageRenderer` foundation exists under `components/layout-engine/`
- This is metadata-first and preview-only for now
- Existing module pages are not fully migrated yet
- No real business logic is included
- No real API/database is connected
- No persisted skin preference is implemented yet
- Future UI redesigns should prefer layout/skin changes before rewriting module pages
- Current foundation status: completed as `v0.5.2-layout-engine-foundation`
- Next recommended milestone: `v0.5.4 Procurement + Supplier + Inventory implementation foundation`

## Procurement Supplier Inventory MVP Planning

- `v0.5.3` is planning-only.
- Covers Procurement + Supplier + Inventory MVP boundaries.
- Includes data model planning.
- Includes mock-to-real migration planning.
- Includes API boundary planning.
- Includes task linkage and layout-engine compatibility rules.
- No implementation is included yet.

## Demo Pages Milestone

- Demo pages are local mock-data only.
- Demo data lives under `data/demo/`.
- `/demo` shows a cross-module demo workspace.
- `/demo/[module]` shows a module-specific demo workspace.
- Demo pages use existing module registry, page templates, and core components.
- No real API is connected.
- No real database is connected.
- No real procurement, inventory, or POS execution logic is included.
- Demo flow is for presentation and validation only.


## Service Layer Foundation (v0.6.0)

- A mock-first service layer and repository contract foundation exists.
- Repository provider defaults to mock mode.
- No real API/database/business implementation is included yet.

## Data Provider Integration / Page Data Boundary

- When updating UI pages, route-level components should read data via `lib/services/*` (or `lib/page-data/*`) instead of importing `data/*`.
- Keep repository provider in mock mode until an API-backed repository is ready.
- Do not add Next.js API routes, fetch/axios, or database code during this milestone.

## Action Source Mapping / Button Contract Foundation (v0.6.2)

- Route: `/action-contracts` (metadata-only contract and registry explorer).
- Registry: `config/actions/`.
- Contract types: `types/action-contract.ts`.
- Helpers: `lib/actions.ts`.
- Reusable UI: `components/actions/` (ActionButton + debug cards).
- No real permission enforcement, audit logging, workflow execution, task creation, API/database integration, or persistence.
- Source mapping keys should remain stable even when layout/skin foundations change.

## Permission Placeholder / Role Access Contract Foundation (v0.6.3)

- Route: `/access-control` is added for metadata preview.
- Access config is centralized in `config/access/`.
- Access UI cards are under `components/access/`.
- Access helper utilities are in `lib/access.ts`.
- No real authentication/authorization middleware is added.
- No real API/database integration is added.
- Action contracts can map to access previews without changing execution behavior.

## Audit Trail Contract Foundation (v0.6.4)

- Route: `/audit-trail`.
- Audit contract types: `types/audit.ts`.
- Audit registries: `config/audit/`.
- Audit helper utilities: `lib/audit.ts`.
- Audit UI components: `components/audit/`.
- Action and access previews can now resolve audit metadata previews without runtime enforcement.
- This milestone is metadata-only and preview-only.
- No real persistence, database, API/backend, session lookup, or middleware is added.
- Audit source mapping keys must remain stable across layout/skin/shell redesigns.

## Workflow Trigger Placeholder / Automation Contract Foundation (v0.6.5)

- Route: `/workflow`.
- Workflow contract types: `types/workflow.ts`.
- Workflow registries: `config/workflow/`.
- Workflow helpers: `lib/workflow.ts`.
- Workflow UI components: `components/workflow/`.
- Action/access/audit previews can resolve workflow metadata previews through stable source keys.
- Workflow source mapping keys must remain stable across layout/skin/shell redesigns.
- Metadata-only preview: no real workflow engine, automation execution, queue/scheduler/background job, notification service, database/API/backend, task/approval creation, session lookup, or middleware.


## ME Notification Contracts Update
- Add `/notifications` metadata preview route.
- Add notification contract registry in `config/notifications/`.
- Add notification preview components in `components/notifications/`.
- Keep notification behavior metadata-only with no real sending/provider/queue/scheduler/database/API/backend/session/middleware.
- Keep source mapping stable across UI shell/layout/skin updates.

## ME Report Widget Contract Foundation (v0.6.7)

- Add `/reports` metadata preview route.
- Add report widget registry in `config/reports/`.
- Add report widget components in `components/reports/`.
- Add report widget helpers in `lib/report-widgets.ts`.
- Keep report widget source mapping stable through UI layout/skin changes.
- No real BI/chart/query/export/schedule/database/API/backend/session/middleware is added.


## ME Rule Contracts Update
- `/rules` route now provides ME Formula / Rule Placeholder Contract Foundation preview.
- Rule metadata registry lives in `config/rules/` and helper APIs in `lib/rules.ts`.
- Rule UI components live in `components/rules/` and are metadata-only previews.
- No real rule/formula calculation or evaluation is implemented yet.
- No SQL/database/API/backend/automation/task creation/notification sending/session lookup is added.
- Rule source mapping must stay stable across layout/skin/UI redesign changes.

## ME Package Contracts Update
- Add `/packages` metadata preview route for Module Package / SaaS Plan Builder contracts.
- Add package registries in `config/packages/` and helpers in `lib/packages.ts`.
- Add package preview components in `components/packages/`.
- Keep package and plan behavior metadata-only: no real billing, payment, subscription enforcement, tenant provisioning, runtime module enable/disable, API/backend/database, or session lookup.
- Keep package source mapping stable across layout/skin/page-template redesigns.


## ME PSI Service MVP Design (v0.7.0)

- Add read-only `/psi` workspace routes for procurement/supplier/inventory.
- Add PSI DTO contracts under `types/psi/` and PSI mock data under `data/psi/`.
- Add PSI mock repositories under `lib/repositories/mock/psi/`.
- Add PSI services under `lib/services/psi/` and page-data helpers under `lib/page-data/psi/`.
- Add PSI display adapters under `lib/display-adapters/psi/`.
- Scope remains mock-only and read-only; no real database/API/write actions/approval/stock posting/supplier portal/POS/task creation.


## ME PSI Action Draft Placeholders (v0.7.1)

- Add `/psi/actions` and `/psi/actions/[actionKey]` as metadata-only action draft/form preview routes.
- Add PSI action draft contracts in `types/psi/actions.ts` and `config/psi/action-drafts.ts`.
- Add UI components under `components/psi/actions/` and helper utilities in `lib/psi-actions.ts`.
- Scope remains placeholder-only: no real submit, no write service/repository method, no database/API, no approval workflow, no stock posting, no supplier portal, no task creation, and no workflow/notification execution.


## ME PSI Detail / Issue / Timeline Placeholder (v0.7.2)

- Add PSI detail placeholder sections: summary header, key fields, lifecycle strip, timeline, linked records, insights, related actions, related tasks, source/mock notice.
- Add `/psi/issues` combined issue placeholder route for procurement/supplier/inventory issue previews.
- Add workspace issue preview badges for status/priority/source/related-action/lifecycle placeholder context.
- Keep all behaviors read-only and preview-only.
- No real status transition, issue update, audit write, task creation, workflow trigger, notification sending, database/API/backend/middleware/session integration.

## ME PSI Report Widget Connection (v0.7.3)
- Add PSI report widget preview integration into existing report contract registry.
- Keep report/PSI milestones mock-only and read-only without BI/SQL/database/API execution.


## ME Business Frontend Experience (v0.8.0)

- Add business-first homepage workspace and keep foundation pages as secondary/admin tools.
- Add `/system-foundation` route for metadata contracts and platform foundations.
- Keep `/layout-engine`, `/action-contracts`, `/access-control`, `/audit-trail`, `/workflow`, `/notifications`, `/reports`, `/rules`, `/packages`, and `/psi` routes available.
- Keep milestone scope UI-only and mock/read-only only with no real database/API/write/auth/session/middleware/billing/workflow execution/notification sending.

## ME Navigation IA (v0.8.1)

- Add `config/navigation.ts` before hardcoding new navigation links into page components.
- Keep `/navigation` reachable from the homepage and `/system-foundation` during reviews.
- Treat `components/navigation/` as the shared navigation layer for sidebar, topbar, mobile nav, and breadcrumbs.
- Verify foundation routes remain reachable and that no auth/session, permission enforcement, database/API, or route guards are introduced.

## ME Role Workspace Placeholders (v0.8.2)

- Add `config/roles.ts`, `types/role-workspace.ts`, `lib/role-workspace.ts`, `components/roles/`, `/roles`, and `/roles/[roleKey]` as placeholder-only role preview surfaces.
- Add shared navigation linkage for `/roles` through `config/navigation.ts` before hardcoding more page-level links.
- Verify no real auth/session, permission enforcement, route guards, database/API, workflow, notification, or write behavior is added.
- Keep `.write_test` untouched, unstaged, and uncommitted.

## ME Branch Context Placeholders (v0.8.3)

- Add `config/branches.ts`, `types/branch-context.ts`, `lib/branch-context.ts`, `components/branches/`, `/branches`, and `/branches/[branchKey]` as placeholder-only branch preview surfaces.
- Add shared navigation linkage for `/branches` through `config/navigation.ts` before hardcoding more page-level links.
- Verify no real tenant model, branch database, selector persistence, auth/session, permission enforcement, route guards, database/API, workflow, notification, task execution, or write behavior is added.
- Keep `.write_test` untouched, unstaged, and uncommitted.

## ME Demo Story Flow (v0.8.4)

- Add `config/demo-story.ts` before hardcoding guided-demo route sequences into page components.
- Add `components/demo-story/` and `/demo-story` routes as static product-tour placeholders only.
- Verify no onboarding engine, persisted progress, analytics, tracking, personalization, database/API, auth/session, or write behavior is introduced.
- Keep `.write_test` untouched, unstaged, and uncommitted.

## ME Demo Mode Screenshot Ready (v0.8.5)

- Add `config/demo-mode.ts` before hardcoding screenshot-ready framing rules into page components.
- Add `components/demo-mode/` and `/demo-mode` as a static presentation layer only.
- Verify no demo toggle, persisted state, localStorage/sessionStorage, analytics, tracking, personalization, database/API, auth/session, or write behavior is introduced.
- Keep `.write_test` untouched, unstaged, and uncommitted.

## ME Stakeholder Summary (v0.8.6)

- Add `config/stakeholder-summary.ts` before hardcoding summary sections or route maps into page components.
- Add `components/stakeholder-summary/` and `/stakeholder-summary` as a static presentation layer only.
- Verify no investor portal, CRM, share tracking, analytics, personalization, storage API, database/API, auth/session, or write behavior is introduced.
- Keep `.write_test` untouched, unstaged, and uncommitted.

## ME Demo Readiness Final Audit (v0.8.7)

- Add `config/demo-readiness.ts` before hardcoding final audit sections or route-check lists into page components.
- Add `components/demo-readiness/` and `/demo-readiness` as a static presentation-QA layer only.
- Verify no monitoring, analytics, tracking, browser automation, runtime crawler, CI, database/API, auth/session, or write behavior is introduced.
- Keep `.write_test` untouched, unstaged, and uncommitted.
