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
- no persisted guided demo progress
- no onboarding analytics or tracking

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
- guided product-tour overview lives at `/demo-story`
- demo story metadata lives in `config/demo-story.ts` and `components/demo-story/`
- homepage and selected pages consume the shared navigation map

## Future Migration
- role-based navigation
- store-based navigation
- user-specific sidebar
- permission-aware hiding
- tenant-specific module menu
- route guard integration
- mobile shell improvements

## ME Role Workspace Placeholders (v0.8.2)
- add `/roles` as a preview-only route for role workspace placeholders and future permission-aware navigation discussions
- keep `Roles` secondary inside shared navigation IA with no auth/session or permission enforcement
- expose the route from homepage, `/navigation`, and `/system-foundation` without changing global route accessibility
- treat role-aware navigation as descriptive preview only until real auth, session, and route guards exist

## ME Branch Context Placeholders (v0.8.3)
- add `/branches` as a preview-only route for store / branch context placeholders and future selector discussions
- add `config/branches.ts`, `types/branch-context.ts`, `lib/branch-context.ts`, and `components/branches/`
- expose the route from homepage, topbar, `/navigation`, `/roles`, and `/system-foundation`
- keep branch-aware navigation descriptive only with no real tenant switching, branch database, or permission enforcement

## ME Demo Story Flow (v0.8.4)
- add `/demo-story` and `/demo-story/[stepKey]` as guided product tour placeholders
- keep navigation IA as the source route map while demo story provides route-to-route narrative only
- no persisted progress, no analytics, and no tracking are added

## ME Demo Mode Screenshot Ready (v0.8.5)
- add `Demo Mode` to the footer / secondary navigation group with route `/demo-mode`
- `config/navigation.ts` remains the source of truth while `config/demo-mode.ts` adds screenshot-ready metadata only
- no persisted state, analytics, or tracking is added to navigation surfaces
