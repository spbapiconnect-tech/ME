# ME UI Architecture

## Foundation Layers

1. `app/`: Next.js App Router entry points and global styles
2. `components/`: dashboard, switchers, module cards, shell placeholders, data components, and form components
3. `config/`: typed module registry as the single source for module metadata
4. `messages/`: English and Chinese message catalogs
5. `types/`: platform contracts for modules, page schema, permissions, and source mapping
6. `stores/`: lightweight client preferences for theme and language
7. `lib/`: registry helper utilities, localized helpers, shared UI support logic, and local task helpers

## Key Principles

- Read modules from config, never from hardcoded page arrays
- Read labels from message catalogs, never from scattered inline strings
- Read theme colors from CSS variables, never from component-level hardcoded colors
- Keep shell components responsive and placeholder-only in this milestone
- Keep Task Engine surfaces local-data only until workflow services exist

## Responsive Strategy

- `MobileShell`: compact navigation-first placeholder shell
- `TabletShell`: sidebar + workspace placeholder shell
- `DesktopShell`: sidebar + canvas + rail placeholder shell
- `ResponsiveShell`: chooses the active shell by viewport width while preserving one dashboard content model

## Responsive Shell Milestone

- Mobile breakpoint: `< 768px`
- Tablet breakpoint: `768px - 1199px`
- Desktop breakpoint: `>= 1200px`
- Mobile responsibility: execution, quick actions, task cards, compact navigation
- Tablet responsibility: manager workspace, sidebar, split-view, context drawer
- Desktop responsibility: admin console, data grid, bulk actions, settings
- Rule: module list must come from `config/modules.ts`
- Rule: theme colors must come from CSS variables
- Rule: bilingual layout must avoid English overflow

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

- `/tasks` is the task inbox and board entry for the current prototype
- `/tasks/[taskId]` provides local-only task detail drill-down
- Task mock records live under `data/tasks/`
- `lib/tasks.ts` builds summary, stats, and lookup helpers for the UI
- Task pages reuse `ActionBar`, `DetailPanel`, `Timeline`, and shared chips
- Task pages link back to module demo pages through source mapping metadata
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
- Next recommended milestone: `v0.5.3 Procurement + Supplier + Inventory MVP Planning`

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


## Data Provider Integration / Page Data Boundary

- Enforce a page data boundary: Page / Component → Service Layer → Repository Provider → Repository.
- Pages can resolve `DataResult` on the server and pass plain data into client components.
- UI components should not import raw mock data modules (`data/demo`, `data/tasks`) for new work.
- Repository provider stays mock for now; no real API/database/persistence is implemented yet.
- `/real-data-mapping` defines the planning-only bridge between current UI blocks and future entities/API boundaries.
- Real datasource work should preserve the shell layer and replace data behind page-data/service/repository boundaries instead of rewriting route components.

## Action Source Mapping / Button Contract Foundation (v0.6.2)

- Route: `/action-contracts` (metadata-only contract and registry explorer).
- Registry: `config/actions/`.
- Contract types: `types/action-contract.ts`.
- Helpers: `lib/actions.ts`.
- Reusable UI: `components/actions/` (ActionButton + debug cards).
- No real permission enforcement, audit logging, workflow execution, task creation, API/database integration, or persistence.
- Source mapping keys should remain stable even when layout/skin foundations change.

## Access Control Metadata Foundation (v0.6.3)

- Route: `/access-control`.
- Access metadata registries are defined under `config/access/`.
- Access contract types are defined under `types/access-control.ts`.
- Access helper functions are implemented in `lib/access.ts`.
- Access preview components live under `components/access/`.
- This milestone is metadata-only and preview-only.
- No real authentication, authorization enforcement, middleware, API, or database integration is connected.
- Action source mapping can connect to access preview metadata without changing runtime behavior.

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

- Route: `/reports`.
- Contract types: `types/report-widget.ts`.
- Registries: `config/reports/`.
- Helpers: `lib/report-widgets.ts`.
- Components: `components/reports/`.
- Dashboard/report widgets are metadata-only previews with no real BI/chart/query/export/schedule/database/API/backend/session logic.
- Report widget source mapping keys must remain stable across shell/layout/skin updates.


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


## ME Business Frontend Experience (v0.8.0)

- Homepage `/` is now business-first and renders `ME Business Workspace`.
- New page-data helper `lib/page-data/business-workspace-page-data.ts` composes PSI report page-data into B2B workspace metrics/modules/alerts/actions.
- New secondary route `/system-foundation` consolidates foundation/admin metadata routes without removing original foundation pages.
- Foundation routes (`/layout-engine`, `/action-contracts`, `/access-control`, `/audit-trail`, `/workflow`, `/notifications`, `/reports`, `/rules`, `/packages`, `/psi`) remain active.
- Scope remains UI-only, mock/read-only only; no real database/API/write/auth/session/middleware/billing/workflow execution/notification sending.

## ME Navigation IA (v0.8.1)

- Shared navigation source of truth lives in `config/navigation.ts`.
- Navigation contracts live in `types/navigation.ts` and helpers live in `lib/navigation.ts`.
- Reusable navigation UI lives in `components/navigation/`.
- `/navigation` is the showcase route for primary business navigation, grouped operations navigation, reports, and secondary system foundation links.
- Business workspace and system foundation pages now consume the shared navigation config instead of manual link arrays where safe.
- No auth/session, permission-aware hiding, middleware, database, API, or route guard integration is implemented yet.

## ME Role Workspace Placeholders (v0.8.2)

- Route overview: `/roles`
- Role detail route: `/roles/[roleKey]`
- Contracts: `types/role-workspace.ts`
- Registry: `config/roles.ts`
- Helpers: `lib/role-workspace.ts`
- Components: `components/roles/`
- Navigation integration stays config-driven through `config/navigation.ts` and `lib/navigation.ts`
- Scope remains preview-only with no real auth/session, permission middleware, database, API, or write path

## ME Branch Context Placeholders (v0.8.3)

- Route overview: `/branches`
- Branch detail route: `/branches/[branchKey]`
- Contracts: `types/branch-context.ts`
- Registry: `config/branches.ts`
- Helpers: `lib/branch-context.ts`
- Components: `components/branches/`
- Navigation integration stays config-driven through `config/navigation.ts` and `lib/navigation.ts`
- Scope remains preview-only with no real tenant model, branch database, branch switching persistence, auth/session, middleware, API, or write path


## ME Demo Story Flow (v0.8.4)

- Route overview: `/demo-story`
- Step detail route: `/demo-story/[stepKey]`
- Contracts: `types/demo-story.ts`
- Registry: `config/demo-story.ts`
- Helpers: `lib/demo-story.ts`
- Components: `components/demo-story/`
- This layer sits above existing business, navigation, roles, branches, PSI, reports, and system foundation routes as static storytelling metadata only.
- No persisted progress, analytics, tracking, personalization, database, API, auth/session, or write path is added.

## ME Demo Mode Screenshot Ready (v0.8.5)
- add `types/demo-mode.ts`, `config/demo-mode.ts`, and `lib/demo-mode.ts` as a static presentation metadata layer
- add `components/demo-mode/` for badges, banners, screenshot cards, checklist UI, and reusable presentation notes
- `/demo-mode` sits above existing business, navigation, role, branch, PSI, report, and foundation routes with no persistence, analytics, tracking, database, or API

## ME Stakeholder Summary (v0.8.6)
- add `types/stakeholder-summary.ts`, `config/stakeholder-summary.ts`, and `lib/stakeholder-summary.ts` as the static stakeholder-presentation metadata layer
- add `components/stakeholder-summary/` for summary chips, metric cards, roadmap cards, route map UI, and the summary page shell
- `/stakeholder-summary` sits above existing business, demo, role, branch, PSI, report, and foundation routes with no investor portal, CRM, sharing permissions, analytics, storage, database, or API

## ME Demo Readiness Final Audit (v0.8.7)
- add `types/demo-readiness.ts`, `config/demo-readiness.ts`, and `lib/demo-readiness.ts` as the static presentation-QA metadata layer
- add `components/demo-readiness/` for metric cards, guardrail cards, route-map UI, checklist sections, and the final audit page shell
- `/demo-readiness` sits above existing business, demo, stakeholder, role, branch, PSI, report, and foundation routes with no monitoring, analytics, tracking, browser automation, runtime crawler, CI, database, API, auth/session, or write path
