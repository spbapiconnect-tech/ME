# ME UI Architecture

## Foundation Layers

1. `app/`: Next.js App Router entry points and global styles
2. `components/`: dashboard, switchers, module cards, and shell placeholders
3. `config/`: typed module registry as the single source for module metadata
4. `messages/`: English and Chinese message catalogs
5. `types/`: platform contracts for modules, page schema, permissions, and source mapping
6. `stores/`: lightweight client preferences for theme and language
7. `lib/`: registry helper utilities for filtering, grouping, and stats

## Key Principles

- Read modules from config, never from hardcoded page arrays
- Read labels from message catalogs, never from scattered inline strings
- Read theme colors from CSS variables, never from component-level hardcoded colors
- Keep shell components responsive and placeholder-only in this milestone

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
