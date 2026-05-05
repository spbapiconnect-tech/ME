# ME Audit Trail

## Purpose

- Standardize audit/event metadata for ME action and access previews.
- Prepare future event log and compliance trail without runtime integration.
- Connect action contracts and access control metadata to audit previews.
- Keep audit source mapping stable during UI redesigns (layout/skin/shell changes).

## Current Status

- Metadata-only.
- No real event log.
- No persistence.
- No database/API.
- No user/session lookup.
- No middleware.
- No production audit trail.

## Architecture

ActionContract
→ AccessRule
→ AuditEventContract
→ AuditPreview
→ Future Event Log Writer
→ Future Audit Database

## Audit Event Contract

- `actor`
- `source`
- `target`
- `requirement`
- `severity`
- `status`
- `timestampStrategy`
- `retentionHint`
- `futureEventKey`

## Future Use

- Audit log
- Compliance export
- Operational event history
- Workflow trace
- Permission review
- Source mapping analysis
- Customer admin report

## Registry And UI

- Route: `/audit-trail`
- Contract types: `types/audit.ts`
- Registry: `config/audit/`
- Helpers: `lib/audit.ts`
- Reusable UI components: `components/audit/`
- Current behavior: preview-only metadata foundation

## Stability Rule

- Audit source mapping and event keys must remain stable when layout/skin/theme/shell layers change.
- UI redesigns should not require remapping audit contracts.

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
- Add `/reports` metadata preview route and report widget contract catalog.
- Audit events can map to report widgets through `auditEventKey`.
- Report widget metadata lives in `types/report-widget.ts`, `config/reports/`, and `lib/report-widgets.ts`.
- Report widget preview is metadata-only and does not write logs, run SQL, or execute exports/schedules.
- Keep audit-to-widget mapping keys stable across layout/skin changes.


## ME Rule Contracts Update
- `/rules` route now provides ME Formula / Rule Placeholder Contract Foundation preview.
- Rule metadata registry lives in `config/rules/` and helper APIs in `lib/rules.ts`.
- Rule UI components live in `components/rules/` and are metadata-only previews.
- No real rule/formula calculation or evaluation is implemented yet.
- No SQL/database/API/backend/automation/task creation/notification sending/session lookup is added.
- Rule source mapping must stay stable across layout/skin/UI redesign changes.
