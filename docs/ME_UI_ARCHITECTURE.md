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
