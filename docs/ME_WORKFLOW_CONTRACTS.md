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
