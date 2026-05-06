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
- `/stakeholder-summary` is the presentation-ready next step after the guided route sequence and remains static/read-only only
- `/demo-readiness` is the final placeholder QA follow-up after `/stakeholder-summary`, keeping route checks, screenshot framing, and scope guardrails visible in one static review step

## ME Stakeholder Summary (v0.8.6)
- add `/stakeholder-summary` as the closing summary page for owner, investor, partner, and internal-team walkthroughs
- keep the transition from `/demo-story` to `/stakeholder-summary` static only with no CRM, share tracking, analytics, or session behavior
- reuse `config/stakeholder-summary.ts`, `lib/stakeholder-summary.ts`, and `components/stakeholder-summary/` for the presentation layer

## ME Demo Readiness Final Audit (v0.8.7)
- add `/demo-readiness` as the static final QA checkpoint after the guided walkthrough and stakeholder summary
- keep the handoff from `/demo-story` to `/stakeholder-summary` to `/demo-readiness` static only with no monitoring, analytics, tracking, browser automation, runtime crawler, or CI changes
- reuse `config/demo-readiness.ts`, `lib/demo-readiness.ts`, and `components/demo-readiness/` for the final audit layer

## Future Migration
- add persisted progress
- add real onboarding tasks
- add analytics events
- add role-specific tour
- add branch-specific tour
- add user onboarding state
- add customer demo mode

## ME Demo Mode Screenshot Ready (v0.8.5)
- add `/demo-mode` as the screenshot-ready presentation overview for stakeholder walkthroughs
- add `config/demo-mode.ts`, `lib/demo-mode.ts`, and `components/demo-mode/` as a static presentation layer above the existing demo story
- keep the layer placeholder-only with no persisted demo state, no localStorage/sessionStorage, no analytics, and no tracking
