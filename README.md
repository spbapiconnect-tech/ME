# ME

ME is a modular store operations SaaS platform.

- UI app name: `ME`
- Repo/package name: `me`
- Chinese subtitle: `模块化门店运营平台`
- English subtitle: `Modular Store Operations Platform`

## Current Milestone

`v0.5.2 Layout Engine / Skin System Foundation`

## Scope

This repository currently contains the ME UI foundation and preview routes:

- Next.js App Router shell
- Bright / Dark / Moon theme tokens
- Chinese / English language switching
- Typed module registry
- Responsive mobile / tablet / desktop shell placeholders
- Premium landing dashboard
- Task Engine UI routes with local task records and detail pages
- Layout Engine foundation route with metadata-first preview surfaces


## Task Engine Milestone

- Task Engine route lives at `/tasks`
- Task detail route lives at `/tasks/[taskId]`
- Task data is local-only and sourced from `data/tasks/`
- Task helpers live under `lib/tasks.ts`
- UI reuses the existing shell, data, and detail components
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

## Not Included Yet

- Real business logic
- Database connections
- Procurement, inventory, POS, AI, workflow, automation, rules, formula engine, notification backends, or real API connectors
