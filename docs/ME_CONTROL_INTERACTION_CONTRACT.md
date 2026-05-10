# ME Control Interaction Contract

## Purpose

ME now uses a control registry so every visible control has a declared behavior boundary.
This prevents UI controls, formula metadata, brain metadata, workflow, API, and write execution from being mixed together in page components.

## Control Layers

1. `UI_ONLY`
- Local UI interactions only.
- Examples: open drawer, toggle sidebar group, switch tab, row selection.

2. `PREVIEW_ACTION`
- Business-looking action surface with no execution.
- Examples: `Create PR Preview`, `Approve Preview`, `Post Stock Preview`.

3. `FORMULA_METADATA`
- Formula labels/fields shown as metadata only.
- Examples: `Coverage Days`, `Stock Risk`, `Reorder Suggestion`, `Margin Preview`.

4. `BRAIN_METADATA`
- Rule/AI suggestion labels shown as metadata only.
- Examples: supplier risk reason, variance reason, task priority reason.

5. `FUTURE_WRITE`
- Future write actions, disabled until backend contracts exist.
- Examples: `Create PR`, `Approve PR`, `Update Inventory`.

6. `EXTERNAL_INTEGRATION`
- Connector placeholders only.
- Examples: POS, Google Sheets, WMS, Accounting, Printer.

## Contract Fields

Each control must define:
- `key`
- `label`
- `module`
- `route`
- `layer`
- `behavior`
- `status`
- `allowedNow`
- `executionBoundary`
- `uiFeedback`
- `futureConnection`
- `notes` (optional)

## Non-Negotiable Rules

- No business execution inside UI components.
- No formulas, brain, workflow, API, or database execution directly inside page files.
- Controls must be registered before being added visually.
- `FORMULA_METADATA` and `BRAIN_METADATA` are display-only in current scope.
- `FUTURE_WRITE` remains non-executable now.
- `EXTERNAL_INTEGRATION` remains not-connected / pending setup now.

## Developer Workflow

1. Add new control metadata in `config/control-registry.ts`.
2. Use helpers from `lib/control-registry.ts` to consume control state.
3. Keep visual component behavior aligned with `executionBoundary`.
4. Add tests when introducing new control groups or module-specific controls.

## Current Scope Guardrail

This contract is planning/metadata/UI-only.
No API/database/auth/write/workflow/formula/brain execution is introduced by this contract.
