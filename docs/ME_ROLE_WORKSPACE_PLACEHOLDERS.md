# ME Role Workspace Architecture

## Purpose

Define the role and access workspace structure used by:

- `/roles`
- `/roles/[roleKey]`
- `/access-control`

## Current Implementation Reference

- role config: `config/roles.ts`
- role types: `types/role-workspace.ts`
- role helpers: `lib/role-workspace.ts`
- role UI: `components/roles/*`

## Product Rule

Role workspaces must support customer-facing enterprise administration without leaking internal implementation logic into UI components.

The product must separate:

- role display
- permission metadata
- staff-role mapping
- future auth / session enforcement

## Current Backend Status

This layer remains planning-only for connected runtime behavior:

- No real auth
- No real session
- No real permission enforcement
- No real database
- No real API
- No implementation is included yet for route guard or runtime role access control

## Current Role Set

- Owner
- Store Manager
- Purchasing
- Warehouse
- Staff
- System Admin

## Future Direction

Future work may connect:

- user-role mapping
- permission-aware navigation
- branch-aware access
- audit on role changes

But those must be implemented through dedicated permission and API boundaries, not inside button or page JSX.
