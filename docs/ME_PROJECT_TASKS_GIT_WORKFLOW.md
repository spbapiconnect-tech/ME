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
9. Task Engine demo surfaces and navigation

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

