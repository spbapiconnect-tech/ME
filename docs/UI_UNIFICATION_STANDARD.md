# ME UI Unification Standard

Latest stable reference point:

- `2e797b1 docs: add ui test route walkthrough plan`

## Goal

This document defines the UI standard before manual UI bug testing.

The purpose is to make ME pages visually consistent so future UI walkthrough results are based on a clear standard instead of subjective guessing.

This phase does not add runtime behavior, APIs, database writes, auth, billing, workflow execution, monitoring, analytics, Playwright, Cypress, or CI.

## Current Finding

The current UI is functional and route-ready, but not fully visually unified.

Current strengths:

- many business routes already use `MePageHeader`
- many workspace routes already use `MeTabs`
- many data routes already use `MeDataTable`
- many content sections already use `MeWorkspaceSection`
- demo and stakeholder routes already use card-based sections
- route sequence and UI walkthrough plan already exist

Current inconsistencies:

- some pages use `MeDashboardShell`, some manually compose `main`, `MeTopbar`, and `MeSidebar`
- some admin pages use standalone `main` instead of the shared shell
- card radius varies between `rounded-lg`, `rounded-xl`, `rounded-[10px]`, `rounded-[20px]`, `rounded-[22px]`, and `rounded-[24px]`
- surface color varies between `bg-white`, `bg-card/95`, `bg-slate-50`, `bg-muted/40`, and custom gradients
- spacing varies between `gap-3`, `gap-4`, `gap-6`, `px-4 py-8`, and shell-defined spacing
- some task and template components still use legacy CSS class patterns
- some old ERP/Figma-style pages still exist and should not define the final visual standard

## UI Principle

ME should feel like a premium internal SaaS operating system.

The visual language should be:

- clean
- calm
- structured
- manager-ready
- enterprise-like
- modular
- preview-safe
- not childish
- not overly colorful
- not scattered

## Page Families

ME pages should be grouped into page families.

### 1. Business Workspace Pages

Examples:

- `/`
- `/psi`
- `/reports`
- `/branches`
- `/tasks`

Standard:

- use shared shell
- use strong page header
- show summary metrics
- show main work area
- show right rail or secondary context when useful
- show mock/read-only/metadata notice where needed

### 2. Module List Pages

Examples:

- `/psi/procurement`
- `/psi/supplier`
- `/psi/inventory`
- `/psi/issues`
- `/branches`
- `/tasks`

Standard:

- header
- filters or tabs
- summary cards
- table/list/cards
- selected record preview when applicable
- preview-safe actions only

### 3. Detail Pages

Examples:

- `/psi/procurement/[id]`
- `/psi/supplier/[id]`
- `/psi/inventory/[id]`
- `/tasks/[taskId]`
- `/branches/[branchKey]`
- `/roles/[roleKey]`
- `/integration/[connectorId]`

Standard:

- back link
- entity title
- status badge
- metadata strip
- detail panel
- related records
- activity/timeline preview
- preview-safe action area
- no real write implication

### 4. Admin / Governance Pages

Examples:

- `/settings`
- `/integration`
- `/roles`
- `/access-control`
- `/packages`
- `/rules`
- `/workflow`
- `/notifications`
- `/audit-trail`

Standard:

- admin preview notice
- metadata-only boundary
- config/source cards
- safe CTA wording
- no real save / sync / grant / revoke / billing / execution wording
- compact but professional card layout

### 5. Foundation / System Pages

Examples:

- `/navigation`
- `/system-foundation`
- `/layout-engine`
- `/real-data-mapping`
- `/modules`

Standard:

- explanatory architecture page
- source-of-truth context
- route relationships
- no customer-facing operational confusion
- secondary visual priority compared to business workspace pages

### 6. Presentation / Demo Pages

Examples:

- `/demo-story`
- `/demo-mode`
- `/stakeholder-summary`
- `/demo-readiness`

Standard:

- presentation-ready cards
- clear route sequence
- screenshot framing
- static/read-only notice
- no tracking, analytics, sharing, CRM, or persisted mode implication

## Shared Layout Standard

Preferred shell:

- `MeDashboardShell`

Preferred page header:

- `MePageHeader`

Preferred section wrapper:

- `MeWorkspaceSection`

Preferred tabs:

- `MeTabs`

Preferred table:

- `MeDataTable`

Preferred right rail:

- `MeRightRail`

Avoid creating new page-level layout structures unless the page has a clear exception.

## Page Header Standard

Each main page should have:

- eyebrow/category
- title
- description
- preview/read-only/metadata notice if applicable
- badges
- safe actions
- optional metadata strip

Required header structure:

1. Eyebrow
2. Title
3. Description
4. Notice
5. Badges
6. Actions
7. Meta strip when useful

## Card Standard

Default card feel:

- white or near-white surface
- subtle border
- subtle shadow
- calm radius
- consistent padding

Preferred card classes should align with:

- `border-border`
- `bg-white`
- `shadow-[0_1px_2px_rgba(15,23,42,0.04)]`
- `rounded-2xl` or shared Card default

Avoid excessive mixed radii.

Accepted radii:

- small inner chips: `rounded-lg`
- inner info blocks: `rounded-xl`
- main cards: `rounded-2xl`
- premium panels: `rounded-[22px]` only if already part of a page pattern

Avoid introducing more custom radii.

## Spacing Standard

Page shell spacing:

- outer page gap: 3 to 4
- section gap: 3 to 4
- card padding: 4
- dense metadata rows: 2 to 3

Avoid random large `gap-6` unless used for top-level page separation.

## Color Standard

Primary surfaces:

- white
- slate-50
- muted/40
- card/95

Avoid too many one-off gradients.

Use color for meaning:

- blue/info: preview, navigation, system
- emerald/success: ready, active metadata
- amber/warning: review, attention
- rose/danger: blocked, risk
- slate/muted: secondary/foundation

## Typography Standard

Use consistent hierarchy:

- page title: `text-[1.45rem]` to `text-[1.75rem]`
- section title: `text-sm` to `text-[15px]`
- card title: `text-sm` or `text-base`
- metadata label: `text-[10px]` or `text-[11px]` uppercase tracking
- body copy: `text-sm`
- helper copy: `text-xs`

Avoid mixing very large display type unless on homepage or presentation cover.

## CTA Wording Standard

Safe verbs:

- Preview
- Review
- Open
- Inspect
- View
- Check
- Apply Preview
- Reset Preview

Avoid real execution verbs unless clearly framed as non-runtime:

- Save
- Submit
- Sync
- Disable
- Enable
- Grant
- Revoke
- Assign
- Activate
- Subscribe
- Checkout
- Send
- Trigger
- Export

If a page needs these concepts, use preview-safe wording:

- `Preview Sync`
- `Preview Disable`
- `Preview Changes`
- `Preview training scope`
- `Billing Placeholder`
- `Future Billing Ref`

## Boundary Notice Standard

Pages that represent mock/read-only/metadata behavior should show boundary copy near the top.

Recommended wording patterns:

- `Metadata-only preview. No real API, database, or write behavior is connected.`
- `Read-only mock data. No sync, posting, or workflow execution is performed.`
- `Preview only. No real billing, subscription, provisioning, or module enablement is connected.`
- `Static presentation layer. No tracking, analytics, persisted state, or sharing permissions.`

## Table / List Standard

Tables should:

- support overflow-x
- use small uppercase headers
- keep first column readable
- not squeeze on mobile without scroll
- avoid too many columns on mobile

Lists/cards should:

- show ID or key
- show title
- show status
- show source/module
- show preview-safe open action

## Detail Page Standard

Detail pages should include:

- Back action
- Entity title
- Status badge
- Metadata strip
- Summary card
- Related records
- Activity/timeline preview
- Source mapping
- Placeholder/preview notices

Detail pages should not imply real writes.

## Responsive Standard

Breakpoints to manually check:

- 1440px+
- 1280px
- 768px
- 390px

At small widths:

- sidebar should not break content
- cards should stack
- tables should scroll
- CTA rows should wrap
- long route strings should not break layout
- badges should wrap cleanly

## Legacy / Exception Areas

The following areas may contain older visual patterns and should not define the final system standard:

- old ERP/Figma page variants
- template demo classes
- task legacy class names
- restaurant module preview classes
- experimental layout-engine previews

These can stay temporarily, but future UI polish should migrate them toward the shared ME layout language.

## Recommended L3 Work

Next step:

Create a route-to-pattern audit that maps every UI walkthrough route to one of the page families:

- Business Workspace
- Module List
- Detail
- Admin / Governance
- Foundation / System
- Presentation / Demo

Then decide which routes need immediate unification before manual UI bug testing.

## Boundary

This standard does not add:

- UI implementation changes
- runtime behavior
- data connection
- API calls
- DB writes
- auth/session
- billing
- workflow execution
- notification sending
- browser automation
- CI
