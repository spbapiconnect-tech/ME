# ME Business Frontend Experience

## Purpose
- shift the main ME experience from foundation/link hub to business workspace
- keep platform foundation pages discoverable but secondary
- make homepage demo-ready for B2B operations
- use PSI mock/read-only data to show realistic business context

## Current Status
- UI/front-end experience only
- mock/read-only data only
- no real database
- no real API
- no write actions
- no auth/session/middleware
- no billing/subscription enforcement
- no workflow execution
- no notification sending
- no persisted guided demo progress
- no analytics or tracking

## Architecture
PSI Page Data
→ PSI Report Dashboard Data
→ Business Workspace Page Data
→ Business Workspace UI
→ System Foundation Secondary Navigation

## Business Workspace Sections
- Today Operations Overview
- Store Health
- Procurement Status
- Inventory Risk
- Supplier Issues
- Task Completion Placeholder
- POS Report Snapshot Placeholder
- Training / Education Progress Placeholder
- System Alerts
- Foundation Tools

## Implementation
- guided demo entry route lives at `/demo-story`
- demo story metadata lives in `config/demo-story.ts`
- demo story helpers live in `lib/demo-story.ts`
- demo story UI lives in `components/demo-story/`
- homepage can link into the demo story without changing runtime behavior

## Future Migration
- real B2B sidebar
- role-based dashboard
- store selector
- date range filtering
- real task data
- real POS report data
- real permissions
- tenant-specific workspace

## ME Navigation IA (v0.8.1)

- Add `/navigation` as the ME business navigation and system foundation map preview.
- Add `config/navigation.ts` as the shared route map source of truth for grouped navigation.
- Add `types/navigation.ts` and `lib/navigation.ts` for UI-safe navigation contracts and helpers.
- Add `components/navigation/` for sidebar, topbar, mobile nav, breadcrumbs, and reusable navigation cards/groups.
- Homepage now uses shared navigation UI while keeping business pages dominant and foundation routes secondary.
- Scope remains UI-only and mock/read-only only with no real auth/session, permission enforcement, database/API, or route guard.

## ME Role Workspace Placeholders (v0.8.2)

- add a lightweight `/roles` entry from the business workspace without turning the homepage into a role selector
- keep role workspaces preview-only and mock/read-only only
- use shared navigation plus role metadata helpers to describe future role-based workspaces
- keep `/navigation`, `/system-foundation`, `/psi`, `/reports`, and `/packages` intact

## ME Branch Context Placeholders (v0.8.3)

- add a lightweight `/branches` entry from the business workspace and topbar without cluttering the homepage
- add branch selector placeholder UI for All Stores, KCH, BTU, and Future Branch with no persistence
- reuse shared navigation, role preview, PSI, and report routes to show branch-aware framing only
- keep `/navigation`, `/system-foundation`, `/roles`, `/psi`, `/reports`, and `/packages` intact with no real tenant or branch permission enforcement

## ME Demo Story Flow (v0.8.4)
- homepage now exposes a `Start Guided Demo` entry into `/demo-story/business-overview`
- business-first workspace remains the main ME homepage while the story layer only connects existing routes
- no persisted progress, analytics, tracking, personalization, database, or API is added
