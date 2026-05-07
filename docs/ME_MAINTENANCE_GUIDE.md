# ME Maintenance Guide

## Purpose

This guide explains how to safely maintain **ME Branch ERP** as a customer-facing B-end product.

The goal is to preserve product realism, architecture boundaries, and multi-device stability while the system continues to evolve.

## How To Modify UI Safely

1. Read [DESIGN.md](./DESIGN.md)
2. Read [ME_UI_METRICS.md](./ME_UI_METRICS.md)
3. Read [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
4. Read [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
5. Check whether the change belongs in shared shell, shared primitive, shared template, or one module page
6. Update only the smallest valid layer
7. Run tests and build

## How To Add New Module Safely

Use [ME_MODULE_ADD_GUIDE.md](./ME_MODULE_ADD_GUIDE.md).

At minimum:

1. register module
2. add route
3. choose page template
4. define metadata
5. define permission boundary
6. define future API boundary
7. test route and navigation

## How To Add New Field Safely

When adding a new business field:

1. update data metadata
2. update mock/page-data boundary
3. update list and detail rendering props
4. update tests if relevant
5. verify desktop/tablet/mobile layout still works

Do not add a field only inside JSX.

## How To Migrate Mock Data To Real Data

Required order:

1. define schema
2. define repository/service boundary
3. update page-data adapter
4. keep UI props stable
5. add loading / empty / error states
6. introduce read API first
7. introduce writes later

Do not replace mock data by putting direct fetch logic inside the page component.

## How To Preserve Desktop / Tablet / Mobile Layout

### Desktop

- sidebar remains usable
- topbar remains compact
- detail pages stay wide enough for table + right rail

### Tablet

- sidebar collapses or becomes drawer
- right rail moves below or into secondary pane
- tables remain scrollable

### Mobile

- content stacks safely
- tabs scroll horizontally if needed
- action bars wrap
- no overflow disasters

## How To Review Customer-facing Language

Before shipping visible UI, check for:

- `mock`
- `demo`
- `placeholder`
- `dev`
- `sample`
- internal engineering explanation

Customer-facing operational surfaces should use business language, not internal project language.

## How To Run Tests And Build

Run:

```bash
npm test
npm run build
```

If a failure is unrelated to your work, document the exact failure clearly before proceeding.

## How To Prepare Release

Before release:

1. review visible wording
2. review routes
3. review shell behavior
4. review primary desktop layout
5. review tablet/mobile behavior
6. run tests/build

## Git Workflow

- keep scope tight
- do not mix backend and UI in the same change unless absolutely required
- do not commit temp extraction folders
- do not touch `.write_test`

## Final Release Checklist

- No demo/develop labels
- No broken routes
- No hardcoded module in UI shell
- No fake customer-visible placeholder
- Docs updated
- Tests pass
- Build passes
- `.write_test` untouched

If any of the above fails, the change is not ready to ship.
