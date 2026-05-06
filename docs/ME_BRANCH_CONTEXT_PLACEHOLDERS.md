# ME Branch Context Placeholders

## Purpose
- show how ME can preview branch/store context before tenant database exists
- connect business workspace, roles, navigation, PSI, and reports to branch context
- prepare future branch selector and tenant/store scope
- keep branch logic placeholder-only before auth/tenant exists

## Current Status
- branch preview only
- no real tenant model
- no branch database
- no persisted branch switching
- no branch permission enforcement
- no auth/session/middleware
- no database/API
- no user-specific branch access

## Branch Contexts
- All Stores
- KCH
- BTU
- Future Branch

## Architecture
Branch Profile Config
→ Branch Context Helper
→ Branch Workspace UI
→ Navigation IA Preview
→ Role Workspace Preview
→ PSI / Report Links
→ Future Tenant / Branch Scope

## Implementation
- route overview lives at `/branches`
- branch detail preview lives at `/branches/[branchKey]`
- branch profile config lives in `config/branches.ts`
- branch workspace contracts live in `types/branch-context.ts`
- helper utilities live in `lib/branch-context.ts`
- branch UI components live in `components/branches/`
- navigation preview continues to reuse `config/navigation.ts` and `lib/navigation.ts`
- business workspace, roles, navigation, and system foundation link into `/branches` without adding runtime branch switching

## Future Migration
- add tenant/store database
- add branch selector persistence
- add user branch access mapping
- add branch-aware navigation
- add branch-aware reports
- add branch-scoped PSI data
- add audit on branch switching
