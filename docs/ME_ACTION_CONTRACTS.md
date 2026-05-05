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

## ME Report Widgets Update
- Add `/reports` metadata preview route.
- Action contracts can now map to report widgets via `actionKey`.
- Report widget contract/types live in `types/report-widget.ts`.
- Report widget previews are metadata-only with no real data query/export/scheduling.
- Keep action source mapping stable while UI shells/layouts change.


## ME Rule Contracts Update
- `/rules` route now provides ME Formula / Rule Placeholder Contract Foundation preview.
- Rule metadata registry lives in `config/rules/` and helper APIs in `lib/rules.ts`.
- Rule UI components live in `components/rules/` and are metadata-only previews.
- No real rule/formula calculation or evaluation is implemented yet.
- No SQL/database/API/backend/automation/task creation/notification sending/session lookup is added.
- Rule source mapping must stay stable across layout/skin/UI redesign changes.

## ME Package Contracts Update
- Add `/packages` metadata preview route for Module Package / SaaS Plan Builder contracts.
- Add package registries in `config/packages/` and helpers in `lib/packages.ts`.
- Add package preview components in `components/packages/`.
- Keep package and plan behavior metadata-only: no real billing, payment, subscription enforcement, tenant provisioning, runtime module enable/disable, API/backend/database, or session lookup.
- Keep package source mapping stable across layout/skin/page-template redesigns.
