# ME Demo Readiness

## Current Milestone

- Current milestone: `v0.5.3 Procurement + Supplier + Inventory MVP Planning`
- Current prototype status: mock-data SaaS prototype with metadata-first layout-engine previews and business-cluster planning docs

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

