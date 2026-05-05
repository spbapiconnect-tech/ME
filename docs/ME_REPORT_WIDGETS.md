# ME Report Widgets

## Purpose
- Standardize dashboard/report widget metadata.
- Prepare future dashboard builder and report builder.
- Connect POS/inventory/procurement/supplier/task/education data to unified widgets.
- Connect notification/workflow/action/access/audit metadata to dashboard/report preview.
- Keep widget source mapping stable during UI redesigns.

## Current Status
- Metadata-only.
- No BI engine.
- No real chart engine.
- No SQL.
- No database/API/backend.
- No export engine.
- No scheduled report sending.
- No realtime refresh.
- No user/session lookup.

## Architecture
Service Layer
→ Repository Provider
→ ReportWidgetContract
→ ReportWidgetPreview
→ DashboardLayout
→ Future Report Builder
→ Future BI / Export / Scheduled Report Adapter

ActionContract
→ AccessRule
→ AuditEventContract
→ WorkflowContract
→ NotificationContract
→ ReportWidgetContract

## Report Widget Contract
- `widgetType`
- `source`
- `metrics`
- `dimensions`
- `filters`
- `requirement`
- `sampleData`
- `linkedRoute`
- `futureQueryKey`
- `futureDashboardKey`
- `futureReportBuilderKey`

## Route And Registry
- Route: `/reports`
- Contract types: `types/report-widget.ts`
- Registries: `config/reports/`
- Helpers: `lib/report-widgets.ts`
- Components: `components/reports/`

## Future Use
- Owner dashboard.
- Store manager dashboard.
- POS report widget.
- Inventory risk widget.
- Procurement status widget.
- Supplier issue widget.
- Task completion widget.
- Education progress widget.
- Workflow alert widget.
- Notification summary widget.
- Report builder.
- Export / scheduled report.

## Stability Rule
Report widget source mapping keys (`actionKey`, `accessRuleKey`, `auditEventKey`, `workflowKey`, `notificationKey`) must remain stable when layout/skin/components change.


## ME Rule Contracts Update
- `/rules` route now provides ME Formula / Rule Placeholder Contract Foundation preview.
- Rule metadata registry lives in `config/rules/` and helper APIs in `lib/rules.ts`.
- Rule UI components live in `components/rules/` and are metadata-only previews.
- No real rule/formula calculation or evaluation is implemented yet.
- No SQL/database/API/backend/automation/task creation/notification sending/session lookup is added.
- Rule source mapping must stay stable across layout/skin/UI redesign changes.
