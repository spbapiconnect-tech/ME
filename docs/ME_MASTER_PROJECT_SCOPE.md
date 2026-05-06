# ME Master Project Scope

## Positioning

ME is a modular store operations SaaS platform.

- Chinese subtitle: `模块化门店运营平台`
- English subtitle: `Modular Store Operations Platform`

## Current Delivery Scope

This repository currently delivers ME UI foundations, demo surfaces, and planning artifacts for the first business-cluster implementation stage.

- App shell structure for mobile, tablet, and desktop
- Bright, dark, and moon theme tokens
- Chinese and English message catalogs
- Typed module registry and source mapping contracts
- Premium landing dashboard for the initial ME experience
- Task Engine UI routes backed by local task mock data
- Layout Engine foundation route and preview registry surfaces

## Explicit Exclusions

The current milestone does not include real business logic or production integrations.

- No database connection
- No procurement flow implementation
- No inventory transaction engine
- No POS connector
- No AI features
- No workflow, automation, rules, or formula engine
- No real external API connectors
- No workflow engine or notification backend

## Module Registry Milestone

- The module registry is the single source of truth for module metadata
- Module Center reads directly from `config/modules.ts`
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
- Task summary and lookup helpers live under `lib/tasks.ts`
- Task UI reuses existing action bar, detail panel, timeline, and status chip components
- Cross-module links connect demo source pages to Task Engine records
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

## ME Brain Layer / AI Intelligence Roadmap

This section defines future intelligence directions for ME only.

- Status: roadmap only
- Not implemented in the current milestone
- No API calls
- No model inference code
- No Hugging Face model integration at this stage

### Forecast Engine

- Candidate resources: Amazon Chronos / Chronos-Bolt, TimesFM, Lag-Llama
- Use cases: POS sales forecast, inventory consumption forecast, reorder suggestion, procurement planning, stock risk prediction
- Status: roadmap / not implemented

### SQL Intelligence

- Candidate resources: Defog SQLCoder, Text-to-SQL, SQL Guard
- Use cases: natural language reporting, AI data analyst, dashboard drill-down, read-only business query generation
- Security rule: generated SQL must be read-only `SELECT`, tenant-scoped, table-whitelisted, row-limited, and auditable
- Status: roadmap / not implemented

### Document Intelligence

- Candidate resources: LayoutLMv3-style document AI, OCR, invoice parser, receipt parser
- Use cases: supplier invoice extraction, delivery order parsing, purchase document comparison, contract field extraction
- License note: verify commercial license before production use
- Status: roadmap / not implemented

## Milestone Track

- Current branch: `develop`
- Current milestone: `v0.8.7 Demo Readiness Final Audit Placeholder`
- Delivery goal: extend the existing mock-data prototype with a final presentation-readiness audit that connects business workspace, navigation, demo routes, stakeholder summary, roles, branches, PSI, reports, and system foundation without breaking the existing business, PSI, reports, packages, or foundation routes.

## Procurement Supplier Inventory MVP Planning

- Planning only for the first real ME business cluster.
- Procurement, Supplier, and Inventory form the first close operational loop.
- No real API or database is implemented yet.
- The planning follows the existing Layout Engine and Skin System foundation.
- The next implementation step should start with a service layer and mock repository, not direct database integration.
- Task linkage and source mapping must remain stable across the future mock-to-real transition.
- Page contracts should stay schema-driven and renderer-compatible as implementation begins.

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

- A service layer and mock repository foundation exists under `lib/services/` and `lib/repositories/`.
- Repository provider defaults to mock mode.
- This is a foundation-only boundary; no real procurement/supplier/inventory runtime implementation is included.
- Layout Engine remains data-source agnostic.

## Action Source Mapping / Button Contract Foundation (v0.6.2)

- Route: `/action-contracts` (metadata-only contract and registry explorer).
- Registry: `config/actions/`.
- Contract types: `types/action-contract.ts`.
- Helpers: `lib/actions.ts`.
- Reusable UI: `components/actions/` (ActionButton + debug cards).
- No real permission enforcement, audit logging, workflow execution, task creation, API/database integration, or persistence.
- Source mapping keys should remain stable even when layout/skin foundations change.

## Access Control Metadata Foundation (v0.6.3)

- Adds an access-control metadata layer without runtime auth enforcement.
- Route: `/access-control`.
- Access registries: `config/access/`.
- Access components: `components/access/`.
- Access helper utilities: `lib/access.ts`.
- Action contract metadata can map into access previews.
- No login/session/auth middleware/database/API is included.
- No production route/action hiding is enabled in this milestone.

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

- Add `/reports` metadata preview route for dashboard/report widget contracts.
- Add report widget contract type under `types/report-widget.ts`.
- Add report widget registries under `config/reports/`.
- Add report widget UI components under `components/reports/`.
- Add helper utilities under `lib/report-widgets.ts`.
- Scope remains metadata-only: no real BI/chart/query/export/schedule/database/API/backend/session logic.
- Report widget source mapping keys must remain stable across UI redesign iterations.


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
- `/reports` now has a PSI business preview panel using read-only mock page-data outputs.
- Added `lib/display-adapters/psi/reports.adapter.ts` and `lib/page-data/psi/reports-page-data.ts`.
- No real BI/chart/query/export/scheduling/database/API/backend/session/middleware added.


## ME Business Frontend Workspace Scope (v0.8.0)

- Homepage experience shifts from foundation link hub to business workspace-first B2B surface.
- `/system-foundation` is added as a secondary navigation hub for platform contracts and metadata foundations.
- Existing foundation pages and PSI routes are retained and not removed.
- Delivery remains UI/front-end only with mock/read-only data and no real database, API, writes, auth/session/middleware, billing enforcement, workflow execution, or notification sending.

## ME Navigation IA (v0.8.1)

- Add a clean B2B SaaS navigation IA across business, operations, reports, and system foundation groups.
- Keep foundation routes active but secondary through shared navigation config and reusable navigation components.
- Add `/navigation`, `config/navigation.ts`, `lib/navigation.ts`, and `components/navigation/`.
- Do not add auth/session, permission enforcement, database/API integration, real writes, workflow execution, or notification sending.

## ME Role Workspace Placeholders (v0.8.2)

- Add role workspace placeholder routes for leadership, operations, frontline, and system governance previews.
- Keep role awareness descriptive only; no real auth, session, permission enforcement, middleware, database, API, or write capability is introduced.
- Reuse shared navigation and foundation surfaces instead of creating a separate runtime access system.

## ME Branch Context Placeholders (v0.8.3)

- Add branch context placeholder routes for All Stores, KCH, BTU, and Future Branch previews.
- Reuse shared business workspace, role preview, navigation, PSI, and report routes to describe branch-aware behavior before a tenant model exists.
- Keep branch awareness descriptive only; no real tenant model, branch database, selector persistence, auth/session, permission enforcement, middleware, database, API, or write capability is introduced.

## ME Demo Story Flow (v0.8.4)

- Add `types/demo-story.ts`, `config/demo-story.ts`, `lib/demo-story.ts`, and `components/demo-story/` as a static guided product-tour layer.
- Add `/demo-story` and `/demo-story/[stepKey]` routes.
- Keep the scope UI-only and mock/read-only only with no onboarding engine, persisted progress, analytics, tracking, personalization, database, API, auth/session, or write behavior.

## ME Demo Mode Screenshot Ready (v0.8.5)

- Add a screenshot-ready demo presentation layer with `/demo-mode`, `types/demo-mode.ts`, `config/demo-mode.ts`, `lib/demo-mode.ts`, and `components/demo-mode/`.
- Keep scope UI-only and mock/read-only only with no real demo engine, persistence, localStorage/sessionStorage, analytics, tracking, personalization, database, API, auth/session, or write path.
- Keep existing homepage, navigation, roles, branches, PSI, reports, system foundation, and packages routes intact.

## ME Stakeholder Summary (v0.8.6)

- Add `types/stakeholder-summary.ts`, `config/stakeholder-summary.ts`, `lib/stakeholder-summary.ts`, and `components/stakeholder-summary/` as a presentation-ready summary layer.
- Add `/stakeholder-summary` as a static overview for owners, investors, partners, operators, and internal reviewers.
- Keep scope UI-only and mock/read-only only with no investor portal, CRM, share tracking, analytics, personalization, database, API, auth/session, or write path.

## ME Demo Readiness Final Audit (v0.8.7)

- Add `types/demo-readiness.ts`, `config/demo-readiness.ts`, `lib/demo-readiness.ts`, and `components/demo-readiness/` as a static final QA layer.
- Add `/demo-readiness` as the presentation-ready closing audit after Demo Story, Demo Mode, and Stakeholder Summary.
- Keep scope UI-only and mock/read-only only with no monitoring, analytics, tracking, browser automation, runtime crawler, CI changes, database, API, auth/session, or write path.
