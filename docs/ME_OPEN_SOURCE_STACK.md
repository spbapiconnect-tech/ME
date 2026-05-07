# ME Open Source Stack

## Runtime

- Next.js App Router
- React
- TypeScript

## UI Foundation

- Tailwind CSS
- shared ME layout primitives in `components/layout/*`
- shared ME operational module renderer in `components/operations/*`
- Lucide React for iconography

## State / Helpers

- Zustand for lightweight client preferences only
- typed config and helper layers under `config/*`, `lib/*`, and `types/*`

## Product Rule

The stack should stay simple and maintainable.

ME should not add unnecessary infrastructure during UI governance work.

## Current Backend Status

This repository remains **planning-only** for connected business runtime:

- No real database
- No real API
- No auth/session runtime
- No workflow engine
- No notification backend
- No implementation is included yet for production integrations

## Governance Compatibility

Any future dependency or stack change must remain compatible with:

- [DESIGN.md](./DESIGN.md)
- [ME_UI_METRICS.md](./ME_UI_METRICS.md)
- [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
- [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
- [ME_DATA_FORMULA_BRAIN_SEPARATION.md](./ME_DATA_FORMULA_BRAIN_SEPARATION.md)
