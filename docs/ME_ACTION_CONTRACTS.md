# ME Action Contracts

## Purpose

- Standardize button / CTA / action metadata across ME.
- Keep source mapping stable during UI redesigns (layout engine / skins / responsive shells).
- Prepare future permission, audit, workflow, analytics, and automation integration without changing every UI component.
- Avoid ad hoc, hardcoded button behaviors scattered across modules.

## Current Status

- Metadata-only.
- No real permission enforcement.
- No real audit log.
- No real workflow execution.
- No real task creation.
- No API / database integration.
- No writes or persistence.

## Architecture

UI Button / CTA
→ ActionContract
→ Source Mapping
→ Permission / Audit metadata
→ Future Execution Adapter (not implemented)

## Required Fields

- `sourceModule`
- `sourcePage`
- `sourceComponent`
- `sourceEvent`
- `targetAction`
- `targetRoute` (when navigation is relevant)
- `targetModule` (when cross-module mapping is relevant)
- `permissionRequired`
- `auditRequired`
- `confirmationRequired`
- `isPlaceholder`

## Registry Locations

- Action types: `types/action-contract.ts`
- Action registry: `config/actions/`
- Action helpers: `lib/actions.ts`
- Reusable UI components: `components/actions/`
- Demo route: `/action-contracts`

## Future Use (Not Implemented Yet)

- Permission guard (hide/disable actions based on roles/plans)
- Audit log event emission
- Task creation / assignment / closure
- Workflow trigger execution
- Analytics event emission
- Automation trigger mapping
- Role-based action display policies
- Plan-based feature gating

## Access Control Contract Foundation (v0.6.3)

- Route: `/access-control`.
- Access config registry: `config/access/`.
- Access helper utilities: `lib/access.ts`.
- Access UI contract cards: `components/access/`.
- ActionContract metadata can be interpreted into AccessPreview metadata via `getActionAccessPreview`.
- No real auth/session/middleware/database/API or production access enforcement is added in this milestone.
