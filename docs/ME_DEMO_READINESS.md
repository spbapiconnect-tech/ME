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
