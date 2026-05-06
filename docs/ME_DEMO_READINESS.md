# ME Demo Readiness

## Current Milestone

- Current milestone: `v0.8.4 Demo Story Flow / Guided Product Tour Placeholder`
- Current prototype status: mock-data SaaS prototype with business-first workspace, shared navigation IA, role workspace placeholders, branch context placeholders, demo story flow placeholders, and metadata-first foundation pages

## What Is Ready

- App shell
- Theme system
- Language system
- Module registry
- Page templates
- Core components
- Demo pages
- Task Engine pages
- Layout Engine foundation
- Procurement Supplier Inventory MVP planning
- Mock data flow

## What Is Not Ready

- Real database
- Real API
- Real POS connector
- Real inventory transaction logic
- Real procurement approval flow
- Real AI / forecasting / workflow automation

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

- `v0.5.3` planning has started.
- Demo routes remain mock-data only.
- Future real MVP implementation should not break `/demo`, `/templates`, `/components`, `/modules`, `/tasks`, or `/layout-engine`.
- Planning defines data relationships, source mapping, task linkage, API boundaries, and mock-to-real migration steps before runtime implementation begins.
- No real database, API, approval workflow, stock engine, supplier portal, or POS integration is included in this milestone.

## Recommended Next Stage

- `v0.5.4 Procurement + Supplier + Inventory implementation foundation`

## Service Layer Foundation Status

- A mock-first service layer foundation exists under `lib/services/`.
- Repository contracts and a default mock repository provider exist under `lib/repositories/`.
- Demo routes remain local mock-data only until migration is explicitly started.

## Data Provider Integration / Page Data Boundary

- Demo routes should use the service layer as the single data entry point.
- Mock repositories remain the only data source; no real API/database exists.
- Demo UI should keep mock-data notices visible and avoid direct `data/demo` imports in page/components.

## Action Source Mapping / Button Contract Foundation (v0.6.2)

- Route: `/action-contracts` (metadata-only contract and registry explorer).
- Registry: `config/actions/`.
- Contract types: `types/action-contract.ts`.
- Helpers: `lib/actions.ts`.
- Reusable UI: `components/actions/` (ActionButton + debug cards).
- No real permission enforcement, audit logging, workflow execution, task creation, API/database integration, or persistence.
- Source mapping keys should remain stable even when layout/skin foundations change.

## Access Control Metadata Foundation (v0.6.3)

- Route: `/access-control` is available for permission/role/plan metadata preview.
- Registries: `config/access/`.
- Components: `components/access/`.
- Helpers: `lib/access.ts`.
- Action contracts can be previewed through access metadata mapping.
- No real authentication, authorization, middleware, API, or database integration is included.
- No production hiding/blocking logic is enabled yet.

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

- Route: `/reports` is available for metadata-only dashboard/report widget preview.
- Registry: `config/reports/`; Components: `components/reports/`; Helper: `lib/report-widgets.ts`.
- Cross-contract mapping to action/access/audit/workflow/notification is preview-only.
- No BI engine, chart engine, SQL, database/API/backend integration, export engine, or scheduler is included.
- Widget source mapping must remain stable when shell/layout/skin changes.


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
- `/reports` includes ME PSI Report Preview based on PSI page-data and display adapters.
- Current readiness remains mock/read-only with no BI engine, chart execution, SQL, database, API, export, or schedule.


## ME Business Frontend Experience (v0.8.0)

- Main homepage is now business-first (`ME Business Workspace`) for B2B demo readiness.
- New `/system-foundation` route keeps platform contract/foundation pages discoverable but secondary to business operations UI.
- Existing foundation routes and PSI routes still exist and remain available.
- Readiness still remains mock/read-only only with no real database/API/write/auth/session/middleware/billing/workflow execution/notification sending.

## ME Navigation IA (v0.8.1)

- `/navigation` is available for business navigation and system foundation IA preview.
- `config/navigation.ts` and `components/navigation/` provide the new shared navigation layer.
- Foundation routes remain active and accessible but visually secondary to the business workspace.
- Readiness remains UI-only and mock/read-only only with no auth/session, permission enforcement, database/API, or real write paths.

## ME Role Workspace Placeholders (v0.8.2)

- `/roles` and `/roles/[roleKey]` are available as UI-only placeholder routes for role-based workspace review
- navigation and foundation pages now link to the role preview without introducing route hiding or access enforcement
- readiness remains mock/read-only only with no real auth/session, permission enforcement, database/API, workflow, notification, or task execution changes

## ME Branch Context Placeholders (v0.8.3)

- `/branches` and `/branches/[branchKey]` are available as UI-only placeholder routes for store / branch context review
- business workspace, topbar, navigation, roles, and system foundation now link into the branch preview without changing runtime access rules
- readiness remains mock/read-only only with no real tenant model, branch database, selector persistence, auth/session, permission enforcement, database/API, workflow, notification, or task execution changes

## ME Demo Story Flow (v0.8.4)

- `/demo-story` and `/demo-story/[stepKey]` are available as guided product tour placeholders for stakeholder demos.
- Story data stays static and metadata-only.
- No onboarding engine, persisted progress, local storage, analytics, tracking, personalization, database, or API is added.

## ME Demo Mode Screenshot Ready (v0.8.5)

- `/demo-mode` is available as a screenshot-ready polish placeholder for stakeholder reviews and proposal walkthroughs.
- `config/demo-mode.ts`, `lib/demo-mode.ts`, and `components/demo-mode/` provide static presentation metadata and UI helpers.
- No real demo mode state, persisted settings, localStorage/sessionStorage, analytics, tracking, personalization, database, or API is added.
