# ME Access Control

## Purpose

- Standardize permission / role / plan metadata for ME routes, modules, and actions.
- Prepare a future permission guard without coupling UI pages to runtime auth logic.
- Connect action contracts to future access logic through stable keys.
- Keep access rules stable during UI redesigns and route refactors.

## Current Status

- Metadata-only.
- No login.
- No session.
- No real authentication.
- No real authorization enforcement.
- No middleware.
- No database/API integration.
- No production hiding or access blocking behavior.

## Architecture

ActionContract
→ AccessRule
→ AccessPreview
→ Future Permission Guard
→ Future Audit Log

## Role Registry

- owner
- operations-manager
- purchasing-manager
- store-manager
- warehouse-handler
- supplier-coordinator
- staff
- admin
- system

## Plan Registry

- starter
- ops
- pro
- enterprise

## Registry And Route

- Route: `/access-control`
- Access config: `config/access/`
- Access helpers: `lib/access.ts`
- Access UI components: `components/access/`
- Action contracts route: `/action-contracts`

## Future Use

- Permission guard
- Role-based navigation
- Plan-based feature gating
- Audit log
- Workflow approval
- Staff/manager/admin UI split
- Customer-specific module package

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
- Add `/reports` metadata preview route with dashboard layout catalog.
- Access rules can map to report widgets through `accessRuleKey`.
- Report widget metadata lives in `config/reports/` and `lib/report-widgets.ts`.
- Preview behavior remains metadata-only with no real auth middleware, SQL, query, export, or scheduler.
- Keep access-to-widget mapping stable through UI redesigns.


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
