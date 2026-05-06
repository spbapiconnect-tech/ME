# ME Role Workspace Placeholders

## Purpose
- show how ME can support different role workspaces
- connect navigation IA to role-specific workspace previews
- prepare future permission-aware navigation
- keep role logic placeholder-only before auth exists

## Current Status
- role preview only
- no real auth
- no session
- no middleware
- no permission enforcement
- no route guard
- no database/API
- no user-specific navigation

## Roles
- Owner
- Store Manager
- Purchasing
- Warehouse
- Staff
- System Admin

## Architecture
Role Profile Config
→ Role Workspace Helper
→ Role Workspace UI
→ Navigation IA Preview
→ Future Auth / Permission / Route Guard

## Implementation
- route overview lives at `/roles`
- role detail preview lives at `/roles/[roleKey]`
- role profile config lives in `config/roles.ts`
- role workspace contracts live in `types/role-workspace.ts`
- helper utilities live in `lib/role-workspace.ts`
- role UI components live in `components/roles/`
- navigation preview continues to reuse `config/navigation.ts` and `lib/navigation.ts`

## Future Migration
- add auth/session
- add user-role mapping
- add permission-aware navigation
- add route guard
- add tenant/store scope
- add admin role assignment
- add audit on role changes
