# ME Project Tasks & Git Workflow

## Delivery Order

1. Project setup and metadata alignment
2. Theme system foundation
3. Language system foundation
4. Responsive shell placeholders
5. Module registry foundation
6. Dashboard polish and verification

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
- `fix: prevent ME module card overflow`
- `docs: update ME project scope`

## Pull Request Checks

- Bright, dark, and moon themes render correctly
- Chinese and English labels do not break layout
- Module cards still read from `config/modules.ts`
- No hardcoded component colors bypass CSS variables
- No real business logic or connectors were introduced

## Module Registry Milestone

- The module registry is the single source of truth for module metadata
- Module Center reads from `config/modules.ts`
- Future modules are registered but not implemented
- No real module business logic is included yet
- Dashboard shows enabled/core modules only
- Module Center can display all modules by category and status
- Future module additions should happen by config first, not by hardcoding pages
