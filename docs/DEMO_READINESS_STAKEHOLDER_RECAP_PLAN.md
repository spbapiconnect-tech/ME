# Demo Readiness / Stakeholder Summary Recap Plan

Latest stable reference point:

- `4e8a301 docs: add package plan final audit`

## Goal

This phase updates the presentation recap layer so the current ME prototype is ready for UI walkthrough testing.

The goal is not to add browser automation, real monitoring, analytics, tracking, CI, database, API, auth, or real runtime tests.

The goal is to align:

- Demo Readiness
- Stakeholder Summary
- Demo Story
- Demo Mode
- completed polish phases
- final UI walkthrough route sequence

## Covered Routes

Primary recap routes:

- `/demo-readiness`
- `/stakeholder-summary`
- `/demo-story`
- `/demo-mode`

Routes to include in final UI walkthrough:

- `/`
- `/navigation`
- `/psi`
- `/reports`
- `/branches`
- `/tasks`
- `/settings`
- `/integration`
- `/roles`
- `/access-control`
- `/packages`
- `/system-foundation`
- `/demo-story`
- `/demo-mode`
- `/stakeholder-summary`
- `/demo-readiness`

## Current Finding

The existing Demo Readiness / Stakeholder Summary framework is already strong.

Existing strengths:

- `/demo-readiness` exists.
- `/stakeholder-summary` exists.
- `/demo-story` exists.
- `/demo-mode` exists.
- Route smoke targets exist.
- Demo Readiness already has checklist sections.
- Stakeholder Summary already has roadmap and demo route map.
- Demo Mode already has a recommended route sequence.
- Guardrails already exclude analytics, tracking, monitoring, localStorage, browser automation, CI, API, DB, auth, and writes.

## Current Gap

The recap layer still reflects older milestone language around v0.8.0 through v0.8.7.

Since then, the project has completed additional polish phases:

- Navigation / IA final ownership
- Settings / Integration polish
- Role / Access polish
- Package / Plan surface polish

The recap layer should now mention these as completed preparation phases before UI walkthrough testing.

## Completed Phases To Reflect

The final recap should reflect these completed stabilization phases:

1. Business Workspace / System Foundation baseline
2. PSI workspace and detail surfaces
3. Reports workspace and POS report preview
4. Branch context
5. Tasks workspace
6. Navigation / IA ownership final
7. Settings / Integration preview-safe polish
8. Role / Access preview-safe polish
9. Package / Plan preview-safe polish
10. v0.8.8 Governance and Package Polish recap
11. v0.8.9 UI Walkthrough Testing Prep
12. Demo Readiness / Stakeholder Summary recap
13. UI Test Checklist / Route Walkthrough next

## Recommended Route Sequence For UI Testing

The route walkthrough should be practical, not too scattered.

Recommended sequence:

1. `/`
2. `/navigation`
3. `/psi`
4. `/psi/procurement`
5. `/psi/supplier`
6. `/psi/inventory`
7. `/psi/issues`
8. `/reports`
9. `/reports/pos`
10. `/branches`
11. `/branches/all-stores`
12. `/tasks`
13. `/settings`
14. `/integration`
15. `/integration/POS-KCH-PRIMARY`
16. `/roles`
17. `/access-control`
18. `/packages`
19. `/system-foundation`
20. `/demo-story`
21. `/demo-mode`
22. `/stakeholder-summary`
23. `/demo-readiness`

## UI Test Readiness Definition

UI testing can start after this recap phase and the UI checklist phase.

The UI test should focus on:

- routes loading
- sidebar navigation
- topbar navigation
- page hierarchy
- wording safety
- preview-only notices
- card layout consistency
- CTA flow
- responsive behavior
- presentation route sequence

The UI test should not cover:

- real login
- real role switching
- real permission enforcement
- real POS sync
- real printer bridge
- real webhook
- real payment
- real billing
- real database writes
- real workflow execution
- real notification sending

## Recommended L3 Work

Run a focused audit to identify exact files to update:

- `config/demo-readiness.ts`
- `config/stakeholder-summary.ts`
- `config/demo-mode.ts`
- `config/demo-story.ts`

Look for whether these currently mention:

- Settings / Integration
- Role / Access
- Package / Plan
- UI walkthrough testing
- latest stable reference
- final route sequence

Then do a small config-only recap update.

## Boundary

This phase must not add:

- monitoring
- browser automation
- Playwright/Cypress
- CI changes
- analytics
- tracking
- storage
- API calls
- database access
- auth/session
- runtime route crawling
- write behavior

Everything remains static config, UI copy, and documentation only.
