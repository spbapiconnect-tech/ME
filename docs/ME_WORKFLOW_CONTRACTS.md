# ME Workflow Contracts

## Purpose

- Standardize workflow trigger metadata.
- Prepare future automation, approval, task, and notification integration.
- Connect action contracts, access control, and audit trail to future workflow preview.
- Keep workflow source mapping stable during UI redesigns.

## Current Status

- Metadata-only.
- No workflow engine.
- No automation execution.
- No queue/scheduler/background job.
- No notification service.
- No database/API/backend.
- No task/approval creation.
- No user/session lookup.
- No middleware.

## Architecture

ActionContract
→ AccessRule
→ AuditEventContract
→ WorkflowContract
→ WorkflowPreview
→ Future Workflow Engine
→ Future Task / Approval / Notification / Automation Adapter

## Workflow Contract

- `triggerType`
- `source`
- `target`
- `requirement`
- `severity`
- `status`
- `futureEngineKey`
- `futureQueueKey`

## Registry And UI

- Route: `/workflow`
- Workflow contract types: `types/workflow.ts`
- Workflow registries: `config/workflow/`
- Workflow helpers: `lib/workflow.ts`
- Workflow UI components: `components/workflow/`

## Future Use

- Task creation
- Approval routing
- Notification sending
- Automation connector
- Workflow queue
- Scheduled jobs
- External webhook
- Manager review
- Compliance trace

## ME Notification Contracts Update
- Add `/notifications` metadata preview route.
- Add notification contract registry in `config/notifications/`.
- Add notification preview components in `components/notifications/`.
- Keep notification behavior metadata-only with no real sending/provider/queue/scheduler/database/API/backend/session/middleware.
- Keep source mapping stable across UI shell/layout/skin updates.

## ME Report Widgets Update
- Add `/reports` route for dashboard widget and report metadata preview.
- Workflow metadata can map to report widget preview via `workflowKey`.
- Report widget registry lives in `config/reports/`; helper lives in `lib/report-widgets.ts`.
- Keep workflow/report source mapping stable when layout/skin/components are redesigned.
- No real BI/query/export/schedule engine is added.


## ME Rule Contracts Update
- `/rules` route now provides ME Formula / Rule Placeholder Contract Foundation preview.
- Rule metadata registry lives in `config/rules/` and helper APIs in `lib/rules.ts`.
- Rule UI components live in `components/rules/` and are metadata-only previews.
- No real rule/formula calculation or evaluation is implemented yet.
- No SQL/database/API/backend/automation/task creation/notification sending/session lookup is added.
- Rule source mapping must stay stable across layout/skin/UI redesign changes.
