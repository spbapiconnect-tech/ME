# ME UI Architecture

## Purpose

Document the structural UI layers that support a real customer-facing B-end restaurant ERP product.

This file is the implementation-side companion to:

- [DESIGN.md](./DESIGN.md)
- [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
- [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
- [ME_DATA_FORMULA_BRAIN_SEPARATION.md](./ME_DATA_FORMULA_BRAIN_SEPARATION.md)

## Foundation Layers

1. `app/`
   Next.js routes and page entry points
2. `components/ui/`
   shared primitives
3. `components/layout/`
   shared shell and page structure
4. `components/operations/`
   config-driven module workspace rendering
5. `components/navigation/`
   sidebar, topbar, breadcrumb, mobile navigation
6. `config/`
   module registry, navigation, data/formula/brain/permission metadata
7. `lib/page-data/`
   page-data boundary and route-safe data preparation
8. `types/`
   contracts for modules, navigation, page surfaces, and data mapping

## Key Principles

- Module and route structure comes from config, not JSX arrays
- UI renders props and structured metadata
- page templates stay schema-driven and renderer-compatible
- modules remain replaceable without rewriting the shell
- customer-facing UI avoids demo/developer language

## Shell Structure

The standard enterprise shell is:

```text
Sidebar
+ Breadcrumb / Topbar
+ Main workspace
+ Optional right rail
```

Major pages should support:

- dashboard workspace
- list workspace
- detail workspace
- report workspace
- settings workspace
- major B-end detail pages

## Responsive Strategy

- Desktop: full sidebar + wide workspace + right rail
- Tablet: drawer / compact sidebar + reduced columns + collapsible right rail
- Mobile: stacked content + compact topbar + scrollable tabs/actions/tables

The shell remains shared across device sizes.

## Page-Data Boundary

Pages should resolve data through:

```text
Route
→ page-data helper
→ config / mock / future repository
→ props
→ UI
```

Do not bypass this boundary by directly wiring business logic into page components.

## Current Product State

The product UI is customer-facing and operationally structured, but backend-connected behavior remains planning-only.

- No real database
- No real API
- No implementation is included yet for runtime auth, permission enforcement, writes, or workflow execution

## Governance Rule

If a structural UI change affects more than one page, update the shared template, shared shell, or shared config first.
