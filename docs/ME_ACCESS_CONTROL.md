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
