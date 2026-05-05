# ME Rule Contracts

## Purpose
- Standardize formula/rule metadata for ME.
- Prepare future rules engine and formula engine integration.
- Connect report widgets, notifications, workflows, actions, access, and audit metadata to rule preview.
- Keep rule source mapping stable during UI redesigns.

## Current Status
- Metadata-only contract and preview foundation.
- No rules engine execution.
- No formula execution.
- No SQL.
- No database/API/backend.
- No scheduled evaluation.
- No automation execution.
- No task/notification creation.
- No user/session lookup.

## Architecture
Service Layer
-> Repository Provider
-> ReportWidgetContract
-> RuleContract
-> RulePreview
-> Future Rules Engine / Formula Engine
-> Future Workflow / Notification / Task Adapter

ActionContract
-> AccessRule
-> AuditEventContract
-> WorkflowContract
-> NotificationContract
-> ReportWidgetContract
-> RuleContract

## Rule Contract
- `ruleType`
- `source`
- `inputs`
- `outputs`
- `conditions`
- `requirement`
- `sampleExpression`
- `futureRuleEngineKey`
- `futureFormulaKey`
- `futureAutomationKey`

## Future Use
- Low stock risk rule.
- Refund alert rule.
- Procurement overdue rule.
- Supplier issue severity rule.
- Task SLA rule.
- Training completion rate.
- Workflow priority rule.
- Notification escalation rule.
- Dashboard health score.
- Future rule builder.
- Future formula editor.

## ME Package Contracts Update
- Add `/packages` metadata preview route for Module Package / SaaS Plan Builder contracts.
- Add package registries in `config/packages/` and helpers in `lib/packages.ts`.
- Add package preview components in `components/packages/`.
- Keep package and plan behavior metadata-only: no real billing, payment, subscription enforcement, tenant provisioning, runtime module enable/disable, API/backend/database, or session lookup.
- Keep package source mapping stable across layout/skin/page-template redesigns.
