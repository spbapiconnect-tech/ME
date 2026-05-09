# UI Route Pattern Mapping

Latest stable reference point:

- `88bdd0c docs: add ui unification standard`

## Purpose

This document maps the UI walkthrough routes to ME page families before visual unification work begins.

The goal is to decide what page pattern each route should follow, and which routes should be unified first.

This phase does not add UI implementation changes, API calls, DB writes, auth/session, billing, workflow execution, browser automation, or CI.

## Page Families

The standard page families are:

1. Business Workspace
2. Module List
3. Detail
4. Admin / Governance
5. Foundation / System
6. Presentation / Demo

## Route Mapping

| # | Route | Page Family | Expected Pattern | Priority |
|---|---|---|---|---|
| 01 | `/` | Business Workspace | Homepage / main product entry | P1 |
| 02 | `/navigation` | Foundation / System | IA map / route ownership | P2 |
| 03 | `/psi` | Business Workspace | PSI workspace overview | P1 |
| 04 | `/psi/procurement` | Module List | PSI module list/table | P1 |
| 05 | `/psi/supplier` | Module List | PSI module list/table | P1 |
| 06 | `/psi/inventory` | Module List | PSI module list/table | P1 |
| 07 | `/psi/issues` | Module List | Issue queue/list | P1 |
| 08 | `/reports` | Business Workspace | Reports dashboard | P1 |
| 09 | `/reports/pos` | Module List | POS report preview | P1 |
| 10 | `/branches` | Module List | Branch directory/workspace | P1 |
| 11 | `/branches/all-stores` | Detail | Branch aggregate detail | P2 |
| 12 | `/tasks` | Module List | Task queue/workspace | P1 |
| 13 | `/settings` | Admin / Governance | Settings preview center | P1 |
| 14 | `/integration` | Admin / Governance | Connector preview center | P1 |
| 15 | `/integration/POS-KCH-PRIMARY` | Detail | Connector detail preview | P1 |
| 16 | `/roles` | Admin / Governance | Role workspace / governance preview | P1 |
| 17 | `/access-control` | Admin / Governance | Access contract preview | P1 |
| 18 | `/packages` | Admin / Governance | Package / SaaS plan preview | P1 |
| 19 | `/system-foundation` | Foundation / System | Platform foundation overview | P2 |
| 20 | `/demo-story` | Presentation / Demo | Story route narrative | P3 |
| 21 | `/demo-mode` | Presentation / Demo | Screenshot / route sequence guide | P3 |
| 22 | `/stakeholder-summary` | Presentation / Demo | Stakeholder recap / roadmap | P3 |
| 23 | `/demo-readiness` | Presentation / Demo | QA/readiness checklist | P3 |

## Priority Definition

### P1: Unify Before Manual UI Bug Testing

These routes must visually align before asking a tester to judge bugs.

P1 includes:

- `/`
- `/psi`
- `/psi/procurement`
- `/psi/supplier`
- `/psi/inventory`
- `/psi/issues`
- `/reports`
- `/reports/pos`
- `/branches`
- `/tasks`
- `/settings`
- `/integration`
- `/integration/POS-KCH-PRIMARY`
- `/roles`
- `/access-control`
- `/packages`

Reason:

- these are product/business/admin surfaces
- these are the routes a customer or manager would judge first
- inconsistent layout here makes bug testing unclear

### P2: Unify After Core Product Surfaces

P2 includes:

- `/navigation`
- `/branches/all-stores`
- `/system-foundation`

Reason:

- important for system explanation
- not the first customer-facing operation layer
- can tolerate slightly more technical structure for now

### P3: Keep Mostly As-Is For Now

P3 includes:

- `/demo-story`
- `/demo-mode`
- `/stakeholder-summary`
- `/demo-readiness`

Reason:

- presentation pages already follow a card-based pattern
- these support demo explanation rather than daily operations
- polish later after product/admin surfaces are stable

## Immediate Unification Targets

The first implementation pass should focus on P1 only.

Recommended order:

1. Admin / Governance shell consistency
   - `/settings`
   - `/integration`
   - `/access-control`
   - `/packages`

2. Product workspace consistency
   - `/psi`
   - `/reports`
   - `/branches`
   - `/tasks`

3. Module list consistency
   - `/psi/procurement`
   - `/psi/supplier`
   - `/psi/inventory`
   - `/psi/issues`
   - `/reports/pos`

4. Detail consistency
   - `/integration/POS-KCH-PRIMARY`

5. Role workspace consistency
   - `/roles`

## Target Standard For P1

Every P1 page should eventually use:

- shared shell or equivalent shell spacing
- shared page header pattern
- clear page family identity
- summary section
- main content area
- preview/read-only/metadata notice
- safe CTA wording
- consistent card radius and spacing
- consistent responsive behavior

## Do Not Use As Final Standard

Do not let these older/experimental patterns define the final UI:

- old ERP/Figma pages
- template demo CSS classes
- task legacy classes
- restaurant module preview-specific classes
- layout-engine experimental previews

## Recommended L4 Work

Next step:

Run a focused implementation audit on P1 routes only and decide which files need actual UI changes.

Do not change UI yet until the P1 target file list is clear.

Expected L4 output:

- list of P1 route files
- current shell/header pattern
- whether it already uses `MeDashboardShell`
- whether it already uses `MePageHeader`
- whether it has preview-safe notice
- whether it uses legacy/custom CSS class patterns
- recommended fix type
