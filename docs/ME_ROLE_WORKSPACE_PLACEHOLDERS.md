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

## ME Branch Context Placeholders (v0.8.3)
- `/branches` and `/branches/[branchKey]` now provide branch-aware placeholder previews that roles can link into
- role detail pages can point to branch context previews without applying runtime role/branch filtering
- branch preview continues to reuse shared navigation and PSI/report routes with no real tenant/branch permission enforcement

## ME Demo Story Flow (v0.8.4)
- `/roles` now links into `/demo-story/role-workspaces` to support a guided stakeholder demo
- role preview remains descriptive only with no persisted progress, analytics, or tracking
- demo story metadata lives in `config/demo-story.ts` and UI lives in `components/demo-story/`

## ME Demo Mode Screenshot Ready (v0.8.5)
- `/roles` can now surface screenshot-ready notes for stakeholder walkthroughs and proposal review
- add `/demo-mode`, `config/demo-mode.ts`, and `components/demo-mode/` without adding auth/session, permission enforcement, persistence, analytics, or tracking
- role framing remains visual only and mock/read-only only
