# ME Demo Mode Screenshot Ready

## Purpose
- make ME easier to present in screenshots, stakeholder reviews, and proposal walkthroughs
- define a static demo mode presentation layer
- add screenshot-ready labels and route framing
- keep demo mode as placeholder before real demo/customer mode exists

## Current Status
- static demo presentation only
- no real demo mode state
- no persisted setting
- no localStorage/sessionStorage
- no analytics
- no user tracking
- no personalization
- no database/API

## Screenshot Surfaces
- Business Workspace
- Demo Story
- Navigation IA
- Role Workspaces
- Branch Context
- PSI Operations
- Report Preview
- System Foundation

## Architecture
Demo Mode Config
→ Demo Mode Helper
→ Demo Mode UI
→ Screenshot-Ready Surfaces
→ Future Demo / Customer Presentation Mode

## Implementation
- route overview lives at `/demo-mode`
- demo mode contracts live in `types/demo-mode.ts`
- demo mode metadata lives in `config/demo-mode.ts`
- demo mode helpers live in `lib/demo-mode.ts`
- demo mode UI lives in `components/demo-mode/`
- homepage, demo story, roles, branches, PSI, reports, and system foundation can all expose screenshot-ready notes without changing runtime behavior

## Future Migration
- persisted demo mode toggle
- screenshot export helper
- customer-specific demo workspace
- role-specific demo mode
- branch-specific demo mode
- presentation mode keyboard shortcuts
- analytics only after consent
