# ME Codex Task Reference

## Purpose

This file is a reusable execution prompt reference for future Codex tasks.

It is **not** the source of truth for the product.

The source of truth remains:

- [DESIGN.md](./DESIGN.md)
- [ME_UI_METRICS.md](./ME_UI_METRICS.md)
- [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
- [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
- [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
- [ME_MAINTENANCE_GUIDE.md](./ME_MAINTENANCE_GUIDE.md)

## How To Use This File

Use this file when drafting future execution prompts for:

- UI refinement
- module additions
- governance follow-up
- architecture cleanup
- responsive behavior audits
- customer-facing wording cleanup

Do not use this file to override the governance docs.

## Task Framing Rule

Every future Codex task should explicitly state:

- working path
- target branch
- UI-only vs architecture-only vs backend phase
- affected modules
- whether docs must be updated
- whether customer-facing wording must be reviewed

## Mandatory Guardrails For Future Tasks

- do not bypass navigation config
- do not bypass page templates
- do not mix formulas into React UI
- do not mix permissions into visual components
- do not connect backend directly from page components
- do not expose internal/develop wording to customer-visible UI

## Recommended Prompt Sections

1. repo validation
2. source-of-truth docs to read
3. architectural constraints
4. visible product goals
5. routes or modules in scope
6. tests/build requirements
7. commit constraints

## Final Rule

If a future task conflicts with the governance docs, the governance docs win.
