# ME Demo Story Flow

## Purpose
- connect homepage, navigation, roles, branches, PSI, reports, and system foundation into one product narrative
- make ME easier to present to stakeholders
- keep guided tour as static/read-only placeholder
- prepare future onboarding/product tour engine later

## Current Status
- demo story preview only
- no real onboarding engine
- no persisted progress
- no localStorage/sessionStorage
- no analytics
- no tracking
- no personalization
- no database/API

## Story Sequence
- Business Overview
- Navigation IA
- Role Workspaces
- Branch Context
- PSI Operations
- Report Preview
- System Foundation
- Next Steps

## Architecture
Demo Story Config
→ Demo Story Helper
→ Demo Story UI
→ Route Sequence
→ Future Onboarding / Guided Tour Engine

## Implementation
- overview route lives at `/demo-story`
- step detail route lives at `/demo-story/[stepKey]`
- story contracts live in `types/demo-story.ts`
- story metadata lives in `config/demo-story.ts`
- story helpers live in `lib/demo-story.ts`
- story UI components live in `components/demo-story/`
- existing business, navigation, role, branch, PSI, report, and foundation pages link into the guided story without changing runtime behavior

## Future Migration
- add persisted progress
- add real onboarding tasks
- add analytics events
- add role-specific tour
- add branch-specific tour
- add user onboarding state
- add customer demo mode
