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

