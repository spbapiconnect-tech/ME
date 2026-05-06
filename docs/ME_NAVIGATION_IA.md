# ME Navigation IA

## Purpose
- organize ME into a real B2B SaaS navigation structure
- separate business navigation from system foundation
- reduce link-hub feeling
- keep foundation pages discoverable but secondary
- prepare future role-based/sidebar navigation

## Current Status
- UI/navigation only
- no auth/session
- no permission enforcement
- no database/API
- no real route guard
- no user-specific navigation

## Navigation Groups
- Business
- Operations
- Reports
- System Foundation
- Footer / Secondary

## Architecture
Navigation Config
→ Navigation Helpers
→ Sidebar / Topbar / Mobile Nav
→ Business Workspace
→ System Foundation
→ Future Role-Based Navigation

## Implementation
- route map source of truth lives in `config/navigation.ts`
- navigation type contracts live in `types/navigation.ts`
- helpers live in `lib/navigation.ts`
- reusable UI lives in `components/navigation/`
- showcase route lives at `/navigation`
- homepage and selected pages consume the shared navigation map

## Future Migration
- role-based navigation
- store-based navigation
- user-specific sidebar
- permission-aware hiding
- tenant-specific module menu
- route guard integration
- mobile shell improvements
