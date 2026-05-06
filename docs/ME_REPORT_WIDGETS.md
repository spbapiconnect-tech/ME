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

## ME Package Contracts Update
- Add `/packages` metadata preview route for Module Package / SaaS Plan Builder contracts.
- Add package registries in `config/packages/` and helpers in `lib/packages.ts`.
- Add package preview components in `components/packages/`.
- Keep package and plan behavior metadata-only: no real billing, payment, subscription enforcement, tenant provisioning, runtime module enable/disable, API/backend/database, or session lookup.
- Keep package source mapping stable across layout/skin/page-template redesigns.

## ME PSI Report Widget Connection (v0.7.3)
- Add `/reports` PSI preview panel that renders PSI read-only mock business widgets.
- Add PSI report page-data helper: `lib/page-data/psi/reports-page-data.ts`.
- Add PSI report adapter: `lib/display-adapters/psi/reports.adapter.ts`.
- Keep metadata-only contract behavior: no real BI/chart/SQL/database/API/backend/export/schedule.
