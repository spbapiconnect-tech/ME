# ME Governance Docs Pack — All In One


<!-- FILE: docs/DESIGN_LINKS_PATCH.md -->


# Suggested Patch for Existing Docs

This file is not meant to replace existing docs. It gives clean sections to paste into existing project docs.

---

## Add to `docs/DESIGN.md`

```md
## ME Governance References

The ME design system is governed by the following specification docs:

- `docs/ME_UI_METRICS.md` — desktop/tablet/mobile layout metrics, B-end density rules, table/card/button sizing, and acceptance checklist.
- `docs/ME_VISUAL_SYSTEM.md` — color tokens, typography, spacing, radius, shadow, button, badge, table, tab, timeline, right rail, and responsive behavior.
- `docs/ME_PAGE_TEMPLATES.md` — dashboard, list, detail, major B-end detail, report, settings, tablet manager, and mobile staff templates.
- `docs/ME_MODULE_ARCHITECTURE.md` — module registry, route mapping, metadata, permission, formula, brain/rules, and API boundaries.
- `docs/ME_MODULE_ADD_GUIDE.md` — safe process for adding new modules without breaking the platform.
- `docs/ME_DATA_FORMULA_BRAIN_SEPARATION.md` — required separation between UI, data, formula, brain/rules, permission, and API layers.
- `docs/ME_MAINTENANCE_GUIDE.md` — safe UI changes, module changes, mock-to-real migration, tests/build, and release workflow.
- `docs/ME_REAL_PRODUCT_ROADMAP.md` — roadmap from current UI foundation to real data, permission, write actions, workflow, and multi-device productization.
```

---

## Add to `docs/ME_MASTER_PROJECT_SCOPE.md`

```md
## Product Governance

ME is governed as a modular restaurant operations platform, not a collection of hand-written pages.

The roadmap and implementation rules are defined in:

- `docs/ME_REAL_PRODUCT_ROADMAP.md`
- `docs/ME_MODULE_ARCHITECTURE.md`
- `docs/ME_PAGE_TEMPLATES.md`
- `docs/ME_MODULE_ADD_GUIDE.md`
- `docs/ME_DATA_FORMULA_BRAIN_SEPARATION.md`
- `docs/ME_MAINTENANCE_GUIDE.md`

The visual and UI rules are defined in:

- `docs/ME_UI_METRICS.md`
- `docs/ME_VISUAL_SYSTEM.md`

All future modules must be added through module registry, page templates, metadata, permission boundaries, and page-data adapters before real API/backend integration.
```



<!-- FILE: docs/ME_CODEX_TASK.md -->


# Codex Task — Add ME Governance Documentation Pack

You are working on ME at:

```text
/Users/mil/me
```

Branch:

```text
develop
```

## Task

Create the ME governance documentation pack that locks the product roadmap, UI metrics, visual system, module architecture, page templates, module add guide, data/formula/brain separation, and maintenance guide.

This is documentation/specification only.

## Do not

```text
Do not change visible UI.
Do not add modules.
Do not connect backend.
Do not change package.json.
Do not touch .write_test.
```

## Before editing

Run:

```bash
pwd
git branch --show-current
git status --short
```

Expected:

```text
only ?? .write_test
```

If there are unexpected changes, stop and report.

## Create

```text
docs/ME_REAL_PRODUCT_ROADMAP.md
docs/ME_UI_METRICS.md
docs/ME_VISUAL_SYSTEM.md
docs/ME_MODULE_ARCHITECTURE.md
docs/ME_PAGE_TEMPLATES.md
docs/ME_MODULE_ADD_GUIDE.md
docs/ME_DATA_FORMULA_BRAIN_SEPARATION.md
docs/ME_MAINTENANCE_GUIDE.md
```

Each doc must be specific to the ME restaurant operations platform.

## Required content

### 1. `ME_REAL_PRODUCT_ROADMAP.md`

Must include:

```text
Phase 0 foundation
Phase 1 B-end UI system
Phase 2 restaurant module coverage
Phase 3 architecture separation
Phase 4 mock data cleanup
Phase 5 real database schema
Phase 6 read-only API
Phase 7 auth/permission
Phase 8 write actions
Phase 9 formula/brain/workflow
Phase 10 multi-device productization
```

### 2. `ME_UI_METRICS.md`

Must include:

```text
desktop 1710 × 1112 metrics
sidebar width
right rail width
topbar height
page padding
table row height
card radius
font sizes
button sizes
density rules
acceptance checklist
B-end realistic major detail page metrics
```

### 3. `ME_VISUAL_SYSTEM.md`

Must include:

```text
color tokens
typography
spacing
radius
border
shadow
button styles
badge styles
table styles
tabs
timeline
right rail
responsive behavior
realistic B-end detail page visual style
```

### 4. `ME_MODULE_ARCHITECTURE.md`

Must include:

```text
module registry
route mapping
navigation group
page template
data surface
formula requirement
brain/rule requirement
permission requirement
API boundary
no direct coupling rules
```

### 5. `ME_PAGE_TEMPLATES.md`

Must include:

```text
dashboard workspace
list workspace
detail workspace
major B-end detail workspace
report workspace
settings workspace
tablet manager workspace
mobile staff flow
required sections for each
when to use each template
```

### 6. `ME_MODULE_ADD_GUIDE.md`

Must include:

```text
how to add a new module
required config
required route
required page component
required metadata
required tests
what not to do
```

### 7. `ME_DATA_FORMULA_BRAIN_SEPARATION.md`

Must include:

```text
UI layer
page template layer
page data adapter layer
module config layer
data table metadata layer
formula metadata layer
brain/rules layer
permission layer
API/repository boundary
examples for restaurant modules
anti-patterns
```

### 8. `ME_MAINTENANCE_GUIDE.md`

Must include:

```text
how to modify UI safely
how to add module safely
how to add field safely
how to migrate mock to real data
how to keep mobile/tablet/desktop stable
how to run tests/build
release checklist
git workflow
```

## Update if appropriate

```text
docs/DESIGN.md
docs/ME_MASTER_PROJECT_SCOPE.md
```

Add links/references to the new docs only. Do not rewrite unrelated content.

## Add tests only if useful

Possible tests:

```text
docs exist
docs include required headings
```

## Run

```bash
npm test
npm run build
```

## Commit

```bash
git add . ':!.write_test'
git commit -m "docs: add ME product roadmap and governance specs"
git push origin develop
```

## Final response

Return:

```text
docs created
what each doc controls
roadmap phases
confirmation that no UI/backend changes were made
tests/build result
commit hash
.write_test untouched
```



<!-- FILE: docs/ME_DATA_FORMULA_BRAIN_SEPARATION.md -->


# ME Data / Formula / Brain Separation

## Purpose

This document defines how ME separates UI, module config, data metadata, formula metadata, brain/rules metadata, permissions, and future API/repository layers.

The goal is to keep ME maintainable when adding modules, changing data, or connecting real backend services.

---

## Layer map

```text
UI Layer
↓
Page Template Layer
↓
Page Data Adapter Layer
↓
Module Config Layer
↓
Data Metadata Layer
↓
Formula Metadata Layer
↓
Brain / Rules Layer
↓
Permission Layer
↓
Repository / API Boundary
↓
Database / External Systems
```

---

# 1. UI Layer

## Purpose

Render the interface.

## Files

```text
components/ui/*
components/layout/*
components/operations/*
app/[module]/page.tsx
```

## UI can do

```text
Render props
Display fields
Handle local UI state
Open/close panels
Trigger provided action callbacks
Format simple display text
```

## UI cannot do

```text
Own business formulas
Own permission logic
Own workflow logic
Own database calls
Own random mock data
Own global navigation rules
```

---

# 2. Page Template Layer

## Purpose

Provide consistent layout structures.

## Templates

```text
Dashboard Workspace
List Workspace
Detail Workspace
Major B-end Detail Workspace
Report Workspace
Settings Workspace
Tablet Manager Workspace
Mobile Staff Flow
```

## Template can do

```text
Arrange layout regions
Standardize header/action/tabs/right rail
Receive slot content
Control responsive layout
```

## Template cannot do

```text
Know restaurant-specific formulas
Know module-specific permission details
Fetch data directly
```

---

# 3. Page Data Adapter Layer

## Purpose

Prepare page-ready data for UI.

## Files

```text
lib/page-data/restaurant/*
```

## Responsibilities

```text
Collect mock/repository data
Map records into sections
Prepare table rows
Prepare badge states
Prepare right rail items
Prepare metrics from formula results
```

## Example

```text
getInventoryPageData()
getBranchDetailPageData(branchId)
getProcurementWorkspaceData()
getFinanceAccountDetailData(customerId)
```

---

# 4. Module Config Layer

## Purpose

Define what modules exist and how they behave.

## Files

```text
config/restaurant-modules.ts
config/navigation.ts
```

## Responsibilities

```text
module key
display name
route
navigation group
icon
page template
branch scope
data surfaces
formula requirement
brain/rules requirement
permission requirement
right rail context
device behavior
future API boundary
```

---

# 5. Data Table Metadata Layer

## Purpose

Describe data fields and table behavior.

## File

```text
config/restaurant-data-model.ts
```

## Responsibilities

```text
record types
field names
field labels
field types
relationships
branch scope
table columns
filters
sorts
status mappings
```

## Example: inventory item

```text
itemId
sku
name
category
branchId
locationId
onHandQty
reservedQty
unit
reorderLevel
expiryDate
supplierId
status
```

---

# 6. Formula Metadata Layer

## Purpose

Centralize calculation definitions.

## File

```text
config/restaurant-formulas.ts
```

## Examples

### Inventory

```text
availableQty = onHandQty - reservedQty
stockRisk = availableQty <= reorderLevel
expiryRisk = expiryDate - today <= threshold
```

### Schedule

```text
coverageGap = requiredStaff - assignedStaff
coverageScore = assignedStaff / requiredStaff
```

### Finance

```text
grossMargin = sales - cost
receivableAging = dueDate - today
```

### Training

```text
completionRate = completedLessons / assignedLessons
skillGap = requiredSkills - completedSkills
```

## Rule

Formula metadata explains and centralizes business calculation. It should not be mixed into React component layout code.

---

# 7. Brain / Rules Layer

## Purpose

Support intelligent suggestions, warnings, and workflow rules.

## File

```text
config/restaurant-brain.ts
```

## Examples

```text
If stock risk is high, suggest reorder.
If schedule coverage gap exists, suggest available staff.
If supplier has repeated delays, flag supplier risk.
If inspection issue repeats, suggest corrective action.
If sales drops while labor cost rises, flag branch anomaly.
If approval is overdue, suggest escalation.
```

## Brain/rules output types

```text
insight
warning
recommendation
workflow suggestion
priority score
explanation
```

## Rule

Brain/rules should be explainable, auditable, and optional. It must not silently execute irreversible actions.

---

# 8. Permission Layer

## Purpose

Control access to pages, records, fields, and actions.

## File

```text
config/restaurant-permissions.ts
```

## Permission dimensions

```text
module
route
record scope
branch scope
action
approval scope
export scope
settings scope
```

## Example permission keys

```text
branches.view
branches.edit
staff.view
staff.edit
schedule.view
schedule.edit
tasks.create
tasks.assign
tasks.close
procurement.approve
inventory.adjust
finance.export
settings.edit
```

## Rule

Permission should not be hard-coded inside random buttons. The UI should receive allowed actions from permission evaluation.

---

# 9. Repository / API Boundary

## Purpose

Prepare for real data without breaking UI.

## Future files

```text
lib/repositories/*
lib/services/*
app/api/*
```

## Boundary rule

```text
UI
→ page-data
→ service/repository
→ API/database/external system
```

Not allowed:

```text
UI
→ fetch
→ database
```

---

## Restaurant examples

### Branch detail page

```text
UI: BranchDetailWorkspace
Template: Major B-end Detail Workspace
Page data: getBranchDetailPageData(branchId)
Module config: branches
Data surfaces: branches, staff, sales, tasks, issues, activityEvents
Formula: sales growth, task completion, inventory risk
Brain/rules: branch anomaly, alert prioritization
Permission: branch.view, branch.edit, task.create
Future API: branch repository + sales repository
```

### Procurement page

```text
UI: ProcurementWorkspace
Template: List + Detail Workspace
Page data: getProcurementPageData()
Data surfaces: procurement_requests, purchase_orders, suppliers, inventory_items
Formula: spend trend, delayed PO count
Brain/rules: supplier delay warning, approval suggestion
Permission: procurement.view, procurement.create, procurement.approve
Future API: procurement repository
```

### Schedule page

```text
UI: ScheduleWorkspace
Template: List Workspace
Page data: getSchedulePageData()
Data surfaces: staff, availability, shifts, roles, coverageRules
Formula: coverage gap, required staff, overtime risk
Brain/rules: suggest staff, warn understaffed shift
Permission: schedule.view, schedule.edit, schedule.publish
Future API: schedule repository
```

### Finance detail page

```text
UI: FinanceAccountDetailWorkspace
Template: Major B-end Detail Workspace
Page data: getFinanceAccountDetailData(customerId)
Data surfaces: receivables, invoices, payments, orders, contracts
Formula: receivable aging, outstanding amount, credit usage
Brain/rules: overdue warning, credit risk
Permission: finance.view, finance.export, finance.adjust
Future API: finance repository
```

---

## Anti-patterns

Do not:

```text
Calculate reorder risk inside InventoryTable.tsx.
Write branch-specific fake data inside BranchCard.tsx.
Hard-code "owner can approve" inside ApprovalButton.tsx.
Fetch /api/staff directly from StaffList component.
Put workflow routing inside a page component.
Write navigation links manually in Sidebar.tsx.
Create separate visual style for each module.
Duplicate status badge colors in many files.
```

---

## Acceptance checklist

```text
[ ] UI only renders.
[ ] Page template controls layout.
[ ] Page-data adapter prepares screen data.
[ ] Module config declares module behavior.
[ ] Data metadata declares fields.
[ ] Formula metadata declares calculations.
[ ] Brain/rules metadata declares suggestions.
[ ] Permission metadata declares allowed actions.
[ ] Repository/API boundary is planned.
[ ] Mock data is centralized.
[ ] No direct UI-to-database coupling.
```



<!-- FILE: docs/ME_MAINTENANCE_GUIDE.md -->


# ME Maintenance Guide

## Purpose

This guide defines how to maintain, extend, and safely change ME Branch ERP.

The goal is to keep ME stable while adding modules, improving UI, and eventually connecting real backend data.

---

## Golden rules

```text
Do not change visible UI and backend in the same task.
Do not add a module without module config.
Do not add a page without selecting a page template.
Do not put business formulas inside React components.
Do not put permission logic inside random buttons.
Do not scatter mock data.
Do not connect real API before repository/page-data boundary exists.
Do not touch .write_test.
```

---

## Safe UI modification flow

When modifying visual UI:

```text
1. Check docs/DESIGN.md.
2. Check docs/ME_UI_METRICS.md.
3. Check docs/ME_VISUAL_SYSTEM.md.
4. Check docs/ME_PAGE_TEMPLATES.md.
5. Update shared UI primitive if the rule is global.
6. Update layout component if the structure is global.
7. Update module page only if the change is module-specific.
8. Run tests/build.
```

### Rule

If a UI change affects more than one module, update the shared component or template first.

---

## Add module safely

Use:

```text
docs/ME_MODULE_ADD_GUIDE.md
```

Minimum steps:

```text
1. Add module config.
2. Add navigation config.
3. Choose page template.
4. Add data metadata.
5. Add permission metadata.
6. Add formula / brain metadata if needed.
7. Add mock data.
8. Add page-data adapter.
9. Add route and component.
10. Add tests if useful.
```

---

## Add field safely

Example: adding `expiryBatchCode` to inventory item.

Flow:

```text
1. Update data metadata.
2. Update mock data.
3. Update page-data adapter.
4. Update table/detail component props.
5. Update forms only if field is editable.
6. Update tests.
```

Do not:

```text
Add field only inside JSX.
Add field only inside mock card.
Add field without label/type/status.
```

---

## Modify page template safely

If changing a template:

```text
1. Identify affected modules.
2. Update ME_PAGE_TEMPLATES.md if behavior changes.
3. Update shared template component.
4. Check desktop/tablet/mobile.
5. Run module smoke tests.
6. Review screenshots if available.
```

---

## Migrate mock to real data

### Required order

```text
1. Define schema.
2. Define repository.
3. Define service.
4. Update page-data adapter to support mock or repository mode.
5. Keep UI props stable.
6. Add loading, empty, and error states.
7. Add read-only API.
8. Add permission boundary.
9. Add write action later.
```

### Do not

```text
Replace mock data with direct fetch inside component.
Enable write action before permission.
Mix mock and API records inside components.
```

---

## Keep desktop/tablet/mobile stable

### Desktop checklist

```text
[ ] Sidebar visible.
[ ] Topbar stable.
[ ] Tables usable.
[ ] Right rail visible if needed.
[ ] Dense detail sections readable.
```

### Tablet checklist

```text
[ ] Sidebar collapses or becomes drawer.
[ ] Right rail moves below or becomes tab.
[ ] Tables do not break width.
[ ] Primary actions remain visible.
```

### Mobile checklist

```text
[ ] No wide table dependency.
[ ] Forms are single-column.
[ ] Bottom nav or drawer works.
[ ] Main action is obvious.
[ ] Activity/right rail becomes tab or section.
```

---

## B-end realistic page review

When creating major page layouts, compare against realistic CRM/ERP detail pages.

A good major page includes:

```text
Left sidebar
Breadcrumb
Record header
Status tag
Action bar
Tabs
Dense basic information
Related records
Right rail timeline / workflow
Operation log
```

Reject if it looks like:

```text
A landing page
A dashboard poster
A wireframe
A collection of large cards
A marketing infographic
```

---

## Test and build

Before committing:

```bash
npm test
npm run build
```

If tests fail:

```text
1. Read exact error.
2. Fix only related files.
3. Do not add unrelated changes.
4. Rerun tests.
```

---

## Suggested documentation tests

Useful simple tests:

```text
Docs exist.
Docs contain required headings.
Module config keys are unique.
Navigation entries reference valid routes.
Page templates are known values.
Permission keys follow naming convention.
```

Avoid heavy tests that block early design iteration.

---

## Release checklist

```text
[ ] git status reviewed.
[ ] .write_test untouched.
[ ] No unintended package.json changes.
[ ] No accidental backend changes.
[ ] Docs updated for any architecture/layout change.
[ ] Module config updated for new module.
[ ] Mock data centralized.
[ ] npm test passes.
[ ] npm run build passes.
[ ] Commit message uses clear convention.
```

---

## Git workflow

Recommended:

```bash
git status --short
git add . ':!.write_test'
git commit -m "docs: add ME product roadmap and governance specs"
git push origin develop
```

For UI work:

```bash
git commit -m "feat: add [module] workspace layout"
```

For cleanup:

```bash
git commit -m "refactor: centralize [module] mock data"
```

For docs:

```bash
git commit -m "docs: update ME [area] guide"
```

---

## Codex / Trae safety prompt

When asking Codex or Trae to work:

```text
Do not change visible UI unless explicitly requested.
Do not add backend connection.
Do not change package.json.
Do not touch .write_test.
Show git status before and after.
Run npm test and npm run build.
Return changed files and commit hash.
```

---

## Maintenance acceptance checklist

```text
[ ] Change follows the correct doc.
[ ] No layer violation.
[ ] No random mock data in components.
[ ] No hard-coded navigation.
[ ] No formula in UI.
[ ] No permission hard-code.
[ ] No backend connection unless task is backend-specific.
[ ] Desktop/tablet/mobile still valid.
[ ] Tests/build result recorded.
```



<!-- FILE: docs/ME_MODULE_ADD_GUIDE.md -->


# ME Module Add Guide

## Purpose

This guide explains how to add new modules to ME Branch ERP without breaking the system.

ME must support future modules like:

```text
Delivery
Franchise
Customer CRM
Kitchen Display
Food Expiry
Label Printing
Supplier Portal
Warehouse
Recipe Costing
Maintenance
```

Adding a module should not require rewriting the whole app.

---

## Add module flow

```text
1. Define module purpose.
2. Add module config.
3. Add navigation entry.
4. Choose page template.
5. Define data surfaces.
6. Define table/list metadata.
7. Define detail sections.
8. Define formulas if needed.
9. Define brain/rules if needed.
10. Define permission keys.
11. Add mock data.
12. Add page-data adapter.
13. Add route.
14. Add page component.
15. Add tests.
16. Run test/build.
```

---

## Step 1 — Define module purpose

Before coding, write:

```text
Module name
Business problem
Main users
Branch scope
Key records
Main actions
Reports needed
Future API boundary
```

Example:

```text
Module: Delivery
Problem: Track delivery orders and partner status across branches.
Users: Branch manager, staff, area manager, head office.
Branch scope: yes.
Key records: delivery order, driver, partner, delivery status.
Main actions: view, assign, update status, export.
Reports: late delivery, partner performance, branch delivery volume.
Future API: delivery partner integration.
```

---

## Step 2 — Add module config

File:

```text
config/restaurant-modules.ts
```

Required fields:

```text
key
displayName
description
route
navigationGroup
icon
pageTemplate
status
branchScoped
needsDataTable
needsFormula
needsBrain
needsPermission
dataSurfaces
actions
rightRailContext
desktopBehavior
tabletBehavior
mobileBehavior
futureApiBoundary
```

---

## Step 3 — Add navigation entry

File:

```text
config/navigation.ts
```

Rules:

```text
Use module key.
Do not write the link directly into sidebar component.
Do not duplicate labels inconsistently.
Assign to the correct navigation group.
```

---

## Step 4 — Choose page template

Use one approved template:

```text
dashboard-workspace
list-workspace
detail-workspace
major-detail-workspace
report-workspace
settings-workspace
tablet-manager-workspace
mobile-staff-flow
```

Choose based on the module's primary job.

---

## Step 5 — Define data surfaces

File:

```text
config/restaurant-data-model.ts
```

Example for Delivery:

```text
delivery_orders
delivery_partners
drivers
branches
customers
order_status_events
```

Each data surface should define:

```text
record key
display name
fields
field types
relationships
branch scope
future schema hint
```

---

## Step 6 — Define table/list metadata

A list page should know:

```text
columns
filters
sorts
status badges
row actions
bulk actions
empty state
pagination
```

Do not write this logic randomly inside the JSX.

---

## Step 7 — Define detail sections

Major detail pages should define:

```text
record summary
metadata row
tabs
definition sections
related tables
right rail sections
activity log
attachments
operation history
```

---

## Step 8 — Define formulas if needed

File:

```text
config/restaurant-formulas.ts
```

Examples:

```text
inventory stock risk
schedule coverage
delivery late risk
sales growth
gross margin
training completion
approval aging
receivable aging
```

Rules:

```text
Formula descriptions live in metadata.
Formula implementation should be separated from UI.
Do not calculate business rules inside components unless trivial display-only formatting.
```

---

## Step 9 — Define brain/rules if needed

File:

```text
config/restaurant-brain.ts
```

Examples:

```text
Suggest reorder
Explain sales drop
Detect branch anomaly
Suggest staff coverage
Escalate overdue approval
Flag supplier risk
```

Rules:

```text
Brain/rules metadata is not workflow execution.
AI suggestions must be auditable.
Manual override must exist.
```

---

## Step 10 — Define permissions

File:

```text
config/restaurant-permissions.ts
```

Permission keys should include:

```text
module.view
module.create
module.edit
module.delete
module.approve
module.export
module.assign
module.close
module.transfer
```

Example:

```text
delivery.view
delivery.assign
delivery.updateStatus
delivery.export
```

---

## Step 11 — Add mock data

Preferred folder:

```text
data/mock/restaurant/[module].ts
```

Rules:

```text
Use realistic restaurant data.
Use branch IDs consistently.
Use status values from badge tokens.
Do not scatter fake records in components.
```

---

## Step 12 — Add page-data adapter

Preferred folder:

```text
lib/page-data/restaurant/[module].ts
```

Purpose:

```text
Prepare page-ready data.
Map raw mock/repository records into UI sections.
Keep components simple.
```

---

## Step 13 — Add route

Example:

```text
app/delivery/page.tsx
app/delivery/[deliveryId]/page.tsx
```

Rules:

```text
Route should call page-data adapter.
Route should render template/component.
Route should not own business logic.
```

---

## Step 14 — Add page component

Preferred:

```text
components/operations/[module]-workspace.tsx
components/operations/[module]-detail-workspace.tsx
```

Rules:

```text
Component renders.
Component does not fetch directly.
Component does not calculate complex formulas.
Component does not know permission logic except props/state from permission layer.
```

---

## Step 15 — Add tests

Suggested tests:

```text
module config exists
navigation includes module
page route renders
required headings exist
table columns exist
permission keys exist
mock data loads
```

Do not over-test visuals at early stage.

---

## Step 16 — Run checks

```bash
npm test
npm run build
```

---

## What not to do

```text
Do not hard-code module into sidebar component.
Do not put formula in JSX.
Do not put permission checks directly inside random buttons.
Do not connect database before schema/repository boundary exists.
Do not fetch directly from presentational components.
Do not create a new visual style for each module.
Do not create a new page layout without updating ME_PAGE_TEMPLATES.md.
Do not mix develop/internal config with customer-facing pages.
Do not leave mock data scattered across many components.
```

---

## Add module checklist

```text
[ ] Business purpose written.
[ ] Module config added.
[ ] Navigation config added.
[ ] Page template selected.
[ ] Data surfaces defined.
[ ] Table/list metadata defined.
[ ] Detail sections defined.
[ ] Formula metadata added if needed.
[ ] Brain/rules metadata added if needed.
[ ] Permission keys added.
[ ] Mock data centralized.
[ ] Page-data adapter added.
[ ] Route added.
[ ] Component added.
[ ] Tests added if useful.
[ ] npm test passes.
[ ] npm run build passes.
```

---

## Example: Customer CRM module

```text
key: customerCrm
displayName: Customer CRM
route: /customers
navigationGroup: Business
pageTemplate: major-detail-workspace
branchScoped: false
needsDataTable: true
needsFormula: true
needsBrain: true
needsPermission: true
dataSurfaces:
  - customers
  - contacts
  - opportunities
  - followUps
  - contracts
  - serviceTickets
actions:
  - view
  - create
  - edit
  - transfer
  - addFollowUp
  - export
rightRailContext:
  - followUpTimeline
  - recentActivity
  - riskAlerts
```

## Example: Kitchen Display module

```text
key: kitchenDisplay
displayName: Kitchen Display
route: /kitchen-display
navigationGroup: Branch Operations
pageTemplate: tablet-manager-workspace
branchScoped: true
needsDataTable: true
needsFormula: false
needsBrain: true
needsPermission: true
dataSurfaces:
  - orders
  - kitchenStations
  - preparationStatus
  - branchDevices
actions:
  - view
  - updateStatus
  - bumpOrder
  - reportDelay
rightRailContext:
  - delayedOrders
  - deviceStatus
  - stationLoad
```



<!-- FILE: docs/ME_MODULE_ARCHITECTURE.md -->


# ME Module Architecture

## Purpose

This document defines how modules must be structured in ME Branch ERP.

ME must be a **module-driven platform**, not a collection of hand-written pages.

A new module should be added by registering metadata, choosing a page template, defining data/formula/brain/permission needs, and only then creating the page component.

---

## Core principle

```text
Module config drives the system.
Page templates shape the UI.
Metadata describes the data.
Formula metadata calculates.
Brain/rules metadata suggests.
Permission metadata controls access.
UI components only render.
```

---

## Module registry

Primary file:

```text
config/restaurant-modules.ts
```

Each module should have:

```ts
type RestaurantModule = {
  key: string
  displayName: string
  description: string
  route: string
  navigationGroup: string
  icon: string
  pageTemplate: PageTemplateKey
  status: "active" | "preview" | "planned"
  branchScoped: boolean
  needsDataTable: boolean
  needsFormula: boolean
  needsBrain: boolean
  needsPermission: boolean
  dataSurfaces: string[]
  actions: string[]
  rightRailContext: string[]
  desktopBehavior: string
  tabletBehavior: string
  mobileBehavior: string
  futureApiBoundary: string
}
```

---

## Required module fields

### module key

Stable internal ID.

Examples:

```text
branches
staff
schedule
tasks
training
inspection
issues
inventory
procurement
suppliers
posReports
finance
settings
integration
```

### route

Examples:

```text
/branches
/staff
/schedule
/tasks
/training
/inspection
/issues
/inventory
/procurement
/suppliers
/reports/pos
/finance
/settings
/integration
```

### navigation group

Examples:

```text
Workspace
Branch Operations
People
Supply Chain
Sales & Reports
Finance
System
```

### page template

Must choose one:

```text
dashboard-workspace
list-workspace
detail-workspace
report-workspace
settings-workspace
major-detail-workspace
mobile-flow
tablet-command-center
```

### branch scoped

Most restaurant modules should be branch-scoped.

Examples:

```text
tasks: branch-scoped
schedule: branch-scoped
inspection: branch-scoped
inventory: branch-scoped
sales: branch-scoped
settings: sometimes global
permissions: global + branch scoped
```

---

## Navigation mapping

Primary file:

```text
config/navigation.ts
```

Rules:

```text
Do not hard-code module links in sidebar components.
Do not hide navigation logic inside layout components.
Do not duplicate module names across files without a reference.
Navigation entry must reference module key where possible.
```

---

## Page template mapping

Each module must declare its page template.

Examples:

```text
branches -> major-detail-workspace
staff -> major-detail-workspace
schedule -> list-workspace
tasks -> list-workspace + detail-workspace
inspection -> list-workspace + detail-workspace
issues -> list-workspace + detail-workspace
inventory -> list-workspace
procurement -> list-workspace + detail-workspace
suppliers -> major-detail-workspace
posReports -> report-workspace
finance -> report-workspace + major-detail-workspace
settings -> settings-workspace
integration -> settings-workspace
```

---

## Data surfaces

A module should declare what data it needs.

Examples:

### Inventory

```text
inventory_items
stock_movements
suppliers
recipes
expiry_labels
branch_locations
```

### Schedule

```text
staff
availability
shifts
roles
coverage_rules
branch_opening_hours
```

### Procurement

```text
procurement_requests
purchase_orders
suppliers
inventory_items
approval_workflows
attachments
```

### Branch

```text
branches
sales_summary
staffing_summary
task_summary
issue_summary
inventory_summary
activity_events
```

---

## Formula requirement

If a module needs calculations, set:

```text
needsFormula: true
```

Examples:

```text
inventory -> stock risk, reorder quantity, expiry risk
schedule -> coverage score, labor gap
sales -> sales growth, average order value
finance -> margin, receivable aging
training -> completion rate, skill gap
inspection -> score, compliance risk
```

Formulas must live in:

```text
config/restaurant-formulas.ts
```

not inside React components.

---

## Brain / rules requirement

If a module needs intelligent suggestions or rule-based alerts, set:

```text
needsBrain: true
```

Examples:

```text
inventory -> reorder suggestion
schedule -> staff coverage warning
inspection -> repeated issue pattern
tasks -> overdue escalation
training -> training gap recommendation
finance -> anomaly detection
```

Brain/rules metadata must live in:

```text
config/restaurant-brain.ts
```

or future workflow/rules files.

---

## Permission requirement

Most modules must set:

```text
needsPermission: true
```

Permission metadata should include:

```text
view
create
edit
delete
approve
export
assign
close
transfer
branchScope
recordScope
```

Permission rules must live in:

```text
config/restaurant-permissions.ts
```

not inside buttons.

---

## API boundary

Each module must define a future API boundary even while still mock-only.

Example:

```text
Module: procurement
Mock data: data/mock/restaurant/procurement.ts
Page data: lib/page-data/restaurant/procurement.ts
Future repository: lib/repositories/procurement-repository.ts
Future API: app/api/procurement/*
```

### Boundary rule

```text
UI component -> page-data -> repository/service -> API/database
```

Never:

```text
UI component -> fetch -> database
```

---

## No direct coupling rules

A module must not:

```text
Directly write itself into sidebar component
Directly write itself into homepage component
Directly import formula logic into JSX
Directly call database
Directly execute workflow
Directly hard-code permission logic in buttons
Directly depend on another module's component internals
Directly own global mock data
```

---

## Approved coupling

Modules may reference:

```text
Shared UI primitives
Shared layout components
Module registry
Navigation config
Data metadata
Formula metadata
Brain/rules metadata
Permission metadata
Page-data adapter
```

---

## Example module config

```ts
{
  key: "delivery",
  displayName: "Delivery",
  description: "Delivery order tracking, dispatch status, and branch fulfillment visibility.",
  route: "/delivery",
  navigationGroup: "Branch Operations",
  icon: "Truck",
  pageTemplate: "list-workspace",
  status: "planned",
  branchScoped: true,
  needsDataTable: true,
  needsFormula: true,
  needsBrain: true,
  needsPermission: true,
  dataSurfaces: ["delivery_orders", "branches", "staff", "delivery_partners"],
  actions: ["view", "assign", "updateStatus", "export"],
  rightRailContext: ["deliveryAlerts", "lateOrders", "partnerStatus"],
  desktopBehavior: "table + right rail",
  tabletBehavior: "card list + status detail",
  mobileBehavior: "driver/branch action cards",
  futureApiBoundary: "lib/repositories/delivery-repository.ts"
}
```

---

## Module acceptance checklist

```text
[ ] Module key exists.
[ ] Route exists.
[ ] Navigation group is defined.
[ ] Page template is selected.
[ ] Data surfaces are listed.
[ ] Formula requirement is declared.
[ ] Brain/rules requirement is declared.
[ ] Permission requirement is declared.
[ ] Right rail context is declared.
[ ] Desktop/tablet/mobile behavior is declared.
[ ] Future API boundary is declared.
[ ] No sidebar hard-coding.
[ ] No formula in UI.
[ ] No permission hard-coding.
[ ] No random mock data inside component.
```



<!-- FILE: docs/ME_PAGE_TEMPLATES.md -->


# ME Page Templates

## Purpose

This document defines the reusable page templates for ME Branch ERP.

Every module must choose a template. New modules should not invent a new layout unless the design system is updated first.

---

## Template list

```text
1. Dashboard Workspace
2. List Workspace
3. Detail Workspace
4. Major B-end Detail Workspace
5. Report Workspace
6. Settings Workspace
7. Tablet Manager Workspace
8. Mobile Staff Flow
```

---

# 1. Dashboard Workspace

## Use for

```text
/
dashboard
manager overview
head office overview
branch overview
```

## Structure

```text
Page Header
Branch / period filters
KPI Row
Work Queue
Module Summary
Recent Activity
Alerts
Right Rail
```

## Required sections

```text
1. Primary KPI cards
2. Task / issue queue
3. Branch or module summary
4. Recent activity
5. Alerts / exceptions
```

## Do not use for

```text
Dense record detail
Long table management
Settings
Approval forms
```

---

# 2. List Workspace

## Use for

```text
/staff
/schedule
/tasks
/issues
/inspection
/inventory
/procurement
/suppliers
/reports
/finance
```

## Structure

```text
Page Header
Filter Bar
Tabs or Segmented Filters
Data Table / List
Bulk Action Placeholder
Pagination
Right Rail
```

## Required sections

```text
1. Title + description
2. Primary action
3. Filters
4. Table/list
5. Status badges
6. Row actions
7. Pagination or infinite list
8. Optional right rail summary
```

## Good for

```text
Search
Filter
Sort
Batch select
Open detail
Export
```

---

# 3. Detail Workspace

## Use for

```text
task detail
inspection detail
issue detail
procurement detail
inventory item detail
supplier detail
training lesson detail
```

## Structure

```text
Record Summary
Action Bar
Tabs
Main Detail
Related Data Table
Timeline
Right Rail
```

## Required sections

```text
1. Breadcrumb
2. Record title
3. Status badge
4. Metadata row
5. Action bar
6. Tabs
7. Main information card
8. Related records or checklist
9. Timeline / operation log
```

---

# 4. Major B-end Detail Workspace

## Purpose

This is the most important template for realistic B-end pages.

It is used when the user wants a “major page layout” close to real enterprise software, like CRM customer details, store details, employee records, approval details, order details, and finance details.

## Use for

```text
customer detail
branch/store detail
employee profile
candidate profile
task detail
approval detail
order detail
finance account detail
supplier profile
contract detail
```

## Layout

```text
App Shell
├── Left Sidebar
├── Topbar
├── Breadcrumb
├── Record Header
│   ├── Record title
│   ├── Status badge
│   ├── Metadata row
│   └── Action bar
├── Tabs
├── Main Content
│   ├── Definition sections
│   ├── Related records
│   ├── Detail tables
│   └── Forms / notes
└── Right Rail
    ├── Activity timeline
    ├── Approval workflow
    ├── Alerts
    └── Related quick info
```

## Required sections

```text
1. Left navigation sidebar
2. Breadcrumb
3. Record title
4. Status badge
5. Primary metadata row
6. Top-right action buttons
7. Tabs
8. Dense information blocks
9. At least one related table when relevant
10. Right rail timeline / activity / approval / alerts
```

## Visual rules

```text
Use real application density.
Use smaller text than presentation mockups.
Use tables and definition grids.
Use subtle gray dividers.
Use blue only for action, link, and active states.
Avoid huge chart cards unless page is report-first.
Avoid giant decorative icons.
```

## Example: Customer / Branch detail

Top mockup:

```text
Customer CRM detail page
- Customer name
- Status
- Customer code
- Source
- Industry
- Owner
- Tabs
- Basic info
- Contact table
- Related opportunities
- Follow-up timeline
```

Bottom mockup:

```text
Branch/store detail page
- Store name
- Operating status
- Sales metrics
- Store info
- Manager info
- Contact info
- Today activity
```

## Example: Task / Approval detail

Top mockup:

```text
Task detail
- Task title
- Priority
- Due date
- Assignee
- Checklist progress
- Activity log
```

Bottom mockup:

```text
Approval detail
- Request type
- Amount
- Applicant
- Approval workflow
- Expense/detail table
- Action buttons
```

## Example: Order / Finance detail

Top mockup:

```text
Order detail
- Order number
- Customer
- Contract
- Amount summary
- Line items
- Delivery/execution
- Billing info
- Operation history
```

Bottom mockup:

```text
Finance account detail
- Receivable balance
- Aging analysis
- Recent transactions
- Related documents
- Settlement summary
```

---

# 5. Report Workspace

## Use for

```text
/reports
/reports/pos
/sales
/finance reports
/inventory reports
```

## Structure

```text
Filter Bar
Metric Cards
Charts
Report Table
Export Preview
Right Rail
```

## Required sections

```text
1. Date filter
2. Branch filter
3. Metric cards
4. Primary chart
5. Table
6. Export controls
7. Saved reports / schedule area
```

## Report rules

- Reports may use larger charts.
- Reports should still include tables.
- Export states must be visible.
- Keep filters sticky or easy to access.

---

# 6. Settings Workspace

## Use for

```text
/display-settings
/real-data-mapping
/navigation
/access-control
/workflow
/rules
/settings
/integration
```

## Structure

```text
Settings Header
Config Category List
Config Detail Panel
Validation / Issues
Preview Panel
Admin Right Rail
```

## Required sections

```text
1. Category sidebar
2. Selected config detail
3. Validation status
4. Save / reset actions
5. Environment or audit summary
```

## Settings rules

- Never mix customer-facing operations with system config.
- Settings actions must be permission-protected.
- Show validation issues before saving.
- Use right rail for audit / environment / warnings.

---

# 7. Tablet Manager Workspace

## Use for

```text
branch manager tablet
area manager command center
operation review
daily branch control
```

## Structure

```text
Branch selector
KPI overview
Alerts
Tasks
Staffing
Incidents
Reports
Drill-down panels
```

## Rules

- Prioritize touch-friendly actions.
- Fewer columns than desktop.
- Bigger cards than admin desktop.
- Keep decision data visible.
- Make drill-down easy.

---

# 8. Mobile Staff Flow

## Use for

```text
staff home
daily tasks
training
incident report
approval
profile
notifications
```

## Structure

```text
Home Overview
Task Listing
Task Detail
Incident Report
Training Progress
Approvals
Activity / notification
```

## Rules

- No dense tables.
- Use cards and forms.
- Make camera/upload actions easy.
- Use bottom navigation or drawer.
- Primary action should be obvious.

---

## Template selection guide

| Module | Recommended Template |
|---|---|
| Dashboard | Dashboard Workspace |
| Branches | Major B-end Detail Workspace |
| Staff | Major B-end Detail Workspace |
| Schedule | List Workspace |
| Tasks | List + Detail Workspace |
| Training | List + Detail Workspace |
| Inspection | List + Detail Workspace |
| Issues | List + Detail Workspace |
| Inventory | List Workspace + Detail Workspace |
| Procurement | List + Detail Workspace |
| Suppliers | Major B-end Detail Workspace |
| POS Report | Report Workspace |
| Finance | Report + Major B-end Detail Workspace |
| Settings | Settings Workspace |
| Integration | Settings Workspace |
| Manager Tablet | Tablet Manager Workspace |
| Staff Mobile | Mobile Staff Flow |

---

## Page acceptance checklist

```text
[ ] Page uses one approved template.
[ ] Template choice matches module use case.
[ ] Header, action bar, tabs, content, and right rail are placed correctly.
[ ] Major detail pages feel like real B-end software.
[ ] Reports include filters, metrics, charts, and tables.
[ ] Settings include validation and audit context.
[ ] Mobile pages avoid dense tables.
[ ] Tablet pages are touch-friendly.
```



<!-- FILE: docs/ME_REAL_PRODUCT_ROADMAP.md -->


# ME Real Product Roadmap

## Purpose

This roadmap defines the real product direction for **ME Branch ERP**.

ME is a modular restaurant operations platform for multi-branch restaurant groups. It should not become a collection of hand-written pages or isolated mock dashboards. The product must grow through a stable system:

```text
Visual System
+ Module Registry
+ Page Templates
+ Data Metadata
+ Formula Metadata
+ Brain / Rules Metadata
+ Permission Metadata
+ API Boundary
```

## Current status

ME already has early foundations:

```text
docs/DESIGN.md
config/navigation.ts
config/restaurant-modules.ts
config/restaurant-data-model.ts
config/restaurant-formulas.ts
config/restaurant-brain.ts
config/restaurant-permissions.ts
components/layout/*
components/ui/*
components/operations/*
```

This means the project has started forming:

```text
UI shell
navigation config
restaurant module registry
data metadata
formula metadata
brain/rules metadata
permission metadata
```

But it is not yet a complete governed platform. The missing layer is the formal product governance that tells future work what to add, what not to add, and how to keep modules consistent.

---

## Phase 0 — Foundation

**Status:** Mostly done / close to done.

### Goal

Create the technical and visual base for ME.

### Scope

```text
Project setup
Next.js shell
Tailwind loaded
Basic routes
UI primitives
Navigation config
docs/DESIGN.md
Restaurant modules metadata
Mock/read-only guardrails
```

### Acceptance

- App runs locally.
- Navigation exists.
- Basic page shell exists.
- Component primitives are reusable.
- Module configs are not random scattered arrays.
- Mock/read-only pages are clearly separated from future real data.

---

## Phase 1 — B-end UI System

**Status:** In progress.

### Goal

Turn ME into a realistic restaurant B-end operating system UI.

The product UI should feel closer to real enterprise pages such as CRM, HR, order, finance, task, approval, and store detail pages. Avoid concept-board layouts that look beautiful but unrealistic.

### Scope

```text
Visual system
Page templates
Sidebar IA
Topbar IA
Dashboard workspace
List workspace
Detail workspace
Report workspace
Settings workspace
Major B-end detail page layout
Responsive desktop / tablet / mobile behavior
```

### Must improve

```text
UI metrics doc
Visual system doc
Page template doc
Module add guide
B-end major detail-page realism
UI final cleanup
```

### B-end realism direction

Major pages should look like real enterprise product pages:

```text
Left navigation sidebar
Top breadcrumb
Record summary header
Status badge
Primary and secondary action bar
Dense tab system
Main detail sections
Related records tables
Right rail timeline / activity / alerts
Realistic table density
Subtle gray dividers
Limited decorative chart cards
```

Avoid:

```text
Too many landing-page cards
Over-large icons
Over-rounded cards everywhere
Too much empty space
Presentation-only diagrams replacing real UI
Huge mock dashboard cards on every page
```

---

## Phase 2 — Restaurant Module Coverage

**Status:** UI routes started / need quality audit.

### Goal

Make all core restaurant operations modules visible and logically structured.

### Core modules

```text
Dashboard
Branches
Inspection
Issues / Incidents
Tasks
Staff
Schedule
Training
Roles
Procurement
Suppliers
Inventory
Receiving
Stock Transfer
Waste
SOP / Recipes
Expiry / Labels
Food Safety
POS Reports
Sales Analytics
Finance / Costing
Settings
Integration
```

### Acceptance

- Each module has a registered module key.
- Each module belongs to a navigation group.
- Each module has a route.
- Each module uses a page template.
- Each module has placeholder data metadata.
- Each module has future permission metadata.
- Each module does not hard-code navigation or formulas inside UI components.

---

## Phase 3 — Architecture Separation

**Status:** Started, needs formal docs and enforcement tests.

### Goal

Separate UI, data, formula, brain/rules, permission, and API boundaries.

### Required layers

```text
config/restaurant-modules.ts
config/navigation.ts
config/restaurant-data-model.ts
config/restaurant-formulas.ts
config/restaurant-brain.ts
config/restaurant-permissions.ts
lib/page-data/restaurant/*
data/mock/restaurant/*
components/layout/*
components/ui/*
components/operations/*
app/[module]/page.tsx
```

### Acceptance

- UI receives data through page-data or props, not direct random objects.
- Formula rules are not inside JSX.
- Brain/rules are not inside React components.
- Permissions are not hard-coded in buttons.
- API routes are not directly called from presentational components.
- Modules stay replaceable.

---

## Phase 4 — Mock Data Cleanup

**Status:** Not fully done.

### Goal

Centralize demo and placeholder data.

### Target structure

```text
data/mock/restaurant/branches.ts
data/mock/restaurant/staff.ts
data/mock/restaurant/schedules.ts
data/mock/restaurant/tasks.ts
data/mock/restaurant/inspections.ts
data/mock/restaurant/issues.ts
data/mock/restaurant/suppliers.ts
data/mock/restaurant/procurement.ts
data/mock/restaurant/inventory.ts
data/mock/restaurant/pos-reports.ts
data/mock/restaurant/finance.ts
lib/page-data/restaurant/*
```

### Clean up

Move scattered demo values such as:

```text
PR-KCH-0001
ABC Food Supply
SKU-KCH-0007
Vivian
fake KPI values
random branch names
random supplier names
```

out of components and into mock data files.

### Acceptance

- Mock data has one source per domain.
- Components do not own business values.
- Mock data can be replaced later by repository/API results.

---

## Phase 5 — Real Database Schema

**Status:** Not started.

### Goal

Design the real database schema before connecting live data.

### Entities

```text
branches
staff
roles
permissions
schedules
tasks
training_records
inspection_records
issues
suppliers
procurement_requests
purchase_orders
inventory_items
stock_movements
recipes
expiry_labels
pos_sales
finance_costs
audit_events
attachments
workflow_events
notifications
```

### Acceptance

- Schema supports branch context.
- Schema supports role-based access.
- Schema supports audit logs.
- Schema supports attachments.
- Schema supports read-only API first.
- Schema supports future write workflows.

---

## Phase 6 — Read-only API

**Status:** Not started.

### Goal

Connect read data first without write actions.

### Priority order

```text
branches
staff
schedule
inventory
suppliers
procurement
reports
tasks
issues
```

### Acceptance

- UI can switch from mock to repository/API data.
- No write actions are enabled yet.
- Error, loading, and empty states exist.
- Permission boundary is planned even if not enforced yet.

---

## Phase 7 — Auth / Permission

**Status:** Not started.

### Goal

Introduce users, roles, branch access, and module permissions.

### Roles

```text
owner
head office admin
operation manager
area manager
branch manager
staff
purchasing
warehouse
finance
trainer
auditor
support admin
```

### Permission dimensions

```text
module
route
record scope
branch scope
action
approval scope
export scope
settings scope
```

### Acceptance

- Sidebar visibility is permission-driven.
- Page access is permission-driven.
- Button actions are permission-driven.
- Branch selector respects branch access.
- Audit events are generated for sensitive actions.

---

## Phase 8 — Write Actions

**Status:** Future.

### Goal

Enable real operation actions after read-only API and permissions are stable.

### Priority order

```text
create task
update issue
add note
upload attachment
create procurement request
stock receiving
stock adjustment
schedule edit
training update
inspection submission
approval decision
```

### Acceptance

- Every write has validation.
- Every write has audit event.
- Every write respects permission.
- Every write has optimistic / loading / failure states.
- Sensitive writes have confirmation or approval flow.

---

## Phase 9 — Formula / Brain / Workflow

**Status:** Future.

### Goal

Add intelligent support without mixing AI/rules into UI components.

### Formula examples

```text
stock risk
expiry risk
schedule coverage
training gap
labor coverage
cost / margin
branch anomaly
sales variance
supplier delay risk
task overdue risk
```

### Brain / workflow examples

```text
task suggestions
approval routing
stock reorder recommendation
schedule coverage alert
branch performance explanation
supplier risk explanation
training gap suggestion
notification routing
```

### Acceptance

- Formula metadata lives outside UI.
- Brain/rules metadata lives outside UI.
- Workflow execution is not hard-coded in page components.
- AI outputs are explainable and auditable.
- Manual override is always possible.

---

## Phase 10 — Multi-device Productization

**Status:** Started, not finished.

### Goal

Productize ME across desktop, tablet, and mobile.

### Device modes

```text
desktop admin mode
tablet manager mode
mobile staff mode
display / kiosk mode
```

### Scope

```text
responsive testing
density settings
theme settings
language settings
phone task flow
tablet manager workspace
desktop head office workspace
printer / label device views
```

### Acceptance

- Desktop can handle dense B-end detail pages.
- Tablet can handle manager command center and branch workspace.
- Mobile can handle staff task, training, incident, and approval flows.
- Chinese and English text do not break layout.
- UI remains consistent across bright, dark, and moon themes.

---

## Roadmap rule

Do not start backend writes before:

```text
UI metrics are documented
page templates are documented
module registry is stable
mock data is centralized
permission model is drafted
```

ME must become a maintainable platform before it becomes a live operations backend.



<!-- FILE: docs/ME_UI_METRICS.md -->


# ME UI Metrics

## Purpose

This document defines the UI measurement rules for ME Branch ERP.

The goal is to make ME feel like a real B-end restaurant operations system, not a wireframe, landing page, or overly decorative demo board.

---

## Primary desktop target

### Reference viewport

```text
Desktop target: 1710 × 1112+
Minimum practical desktop: 1440 × 900
Preferred design preview: 1710 × 1112
```

### Layout grid

```text
App shell width: 100%
Sidebar width: 224–232px
Collapsed sidebar width: 64–72px
Topbar height: 56–64px
Page padding: 16–24px
Main content gap: 12–16px
Right rail width: 280–320px
Right rail preferred: 300px
```

### B-end page proportions

For realistic enterprise pages:

```text
Left sidebar: fixed
Topbar: fixed visual rhythm
Main record area: flexible
Right rail: fixed / optional
Table width: expands to fill available content
Cards: support dense text and tabular information
```

Avoid making the main content too narrow.

---

## Typography

```text
Page title: 20–24px / 28–32px / 600–700
Record title: 18–22px / 26–30px / 600
Section title: 14–16px / 20–24px / 600
Body text: 13px / 20px / 400
Table text: 12–13px / 18–20px / 400
Caption text: 11–12px / 16px / 400
Button text: 12–14px / 16–20px / 500
Badge text: 11–12px / 16px / 500
```

### Chinese / English rule

Chinese pages can carry denser information. English labels expand wider, so:

```text
Use flexible label columns
Avoid fixed narrow cards for English text
Allow table columns to truncate with tooltip
Keep tab labels short
Avoid multi-line button text
```

---

## Sidebar metrics

```text
Width: 224–232px
Group spacing: 8–12px
Item height: 36–40px
Item padding X: 12–16px
Icon size: 16–18px
Text size: 13px
Active indicator: blue fill / left bar / light background
Expanded submenu indent: 20–28px
Submenu item height: 32–36px
```

### Sidebar rules

- Do not hard-code sidebar items in the component.
- Sidebar must come from navigation config.
- Keep labels short and operational.
- Do not include developer-only labels in user-facing sidebar.
- Avoid more than 7 major groups visible at once.

---

## Topbar metrics

```text
Height: 56–64px
Breadcrumb height: 20–24px
Action bar height: 32–36px
Search icon size: 16–18px
Avatar size: 28–32px
Notification badge: 8–14px
```

### Topbar content order

```text
Breadcrumb
Page / record title zone
Global search / help / notifications / user
Primary actions
Secondary actions
More menu
```

---

## Buttons

```text
Primary button height: 32–36px
Secondary button height: 32–36px
Small button height: 28–32px
Button radius: 6–8px
Button padding X: 12–16px
Icon gap: 6–8px
```

### Action count

```text
Primary action count: max 1–2
Secondary action count: max 4–6
Overflow actions: move into More dropdown
Danger action: never first unless page is specifically destructive
```

---

## Cards and panels

```text
Card radius: 8–12px
Preferred radius: 10px
Card padding: 16–20px
Dense card padding: 12–16px
Panel border: 1px solid neutral border
Panel gap: 12–16px
Card shadow: subtle only
```

### Card rules

- Cards should support real enterprise information.
- Avoid oversized icons on B-end detail pages.
- Avoid making every section a big marketing card.
- Use tables and definition grids when information is dense.
- Use charts only when they add decision value.

---

## Tables

```text
Table header height: 36–40px
Table row height: 40–48px
Dense table row: 36–40px
Cell padding X: 12–16px
Cell padding Y: 8–12px
Table font: 12–13px
Header font: 12px / 600
```

### Table behavior

```text
Sortable columns: visible on hover or header
Status badges: compact
Actions: right aligned
Bulk selection: optional
Pagination: bottom right
Empty state: compact, not giant illustration
```

### Table acceptance

- Table can show at least 8–10 rows on desktop without feeling cramped.
- Columns have real labels and realistic values.
- No random placeholder values inside the component.
- Status uses consistent badge tokens.
- Long text truncates with tooltip or wraps only in detail view.

---

## Tabs

```text
Tabs per detail page: 4–7 preferred
Maximum tabs visible: 9
Tab height: 40–44px
Active indicator: 2px blue bottom border
Tab text: 13px
```

### Detail page common tabs

```text
Overview
Basic Info
Related Records
Activity / Timeline
Attachments
Operation Log
Reports
```

---

## Right rail

```text
Width: 280–320px
Preferred: 300px
Sections per right rail: max 3–5
Section gap: 12px
Timeline item vertical gap: 12–16px
```

### Right rail should contain

```text
Activity timeline
Alerts / issues
Approval workflow
Related quick info
Recent actions
Audit summary
```

### Right rail should not contain

```text
Large charts
Huge marketing illustrations
Full-width data tables
Main business form
```

---

## Major B-end detail page metrics

For pages like customer detail, branch detail, staff profile, task detail, approval detail, order detail, and finance detail:

```text
Record header height: 96–140px
Breadcrumb: top-left
Record title: clear
Status badge: next to title
Metadata row: 1–2 rows
Action bar: top-right
Tabs: directly below header
Main content: definition grids + tables
Right rail: timeline / activity / approval / alerts
```

### Realistic information density

A major detail page should have:

```text
At least 3–5 data sections
At least 1 related-record table when relevant
At least 1 timeline / activity / operation log area
At least 1 status or workflow indicator
No over-large dashboard chart unless the page is report-first
```

---

## Responsive metrics

### Tablet

```text
Tablet target: 768–1024px
Sidebar: collapsed or drawer
Right rail: moves below main content
Tables: horizontal scroll or card list
Action bar: primary + More
```

### Mobile

```text
Mobile target: 320–767px
Bottom navigation or drawer
Cards replace wide tables
Detail sections stack vertically
Right rail becomes Activity tab
Primary action remains sticky when needed
```

---

## Density rules

### Desktop admin mode

```text
High density
Tables allowed
Definition grids allowed
Right rail allowed
Multiple tabs allowed
```

### Tablet manager mode

```text
Medium density
Dashboard cards + action list
Limited table columns
Drill-down panels
```

### Mobile staff mode

```text
Low-to-medium density
Task-first
Large tap areas
Short forms
Camera / upload actions
```

---

## Acceptance checklist

A page passes ME UI quality when:

```text
[ ] Looks like a real B-end product page, not a marketing mockup.
[ ] Uses configured navigation, not hard-coded sidebar.
[ ] Has realistic data density.
[ ] Uses page header, tabs, action bar, and content regions consistently.
[ ] Main content is not too narrow.
[ ] Right rail is useful and not decorative.
[ ] Tables have realistic row height and column structure.
[ ] Buttons are not excessive.
[ ] Labels work in Chinese and English.
[ ] Mock data is not scattered inside JSX.
[ ] No visible "develop", "mock", or "read-only" labels in customer-facing UI unless intentionally in dev-only mode.
[ ] Layout works at desktop, tablet, and mobile breakpoints.
```

---

## Rejection checklist

Reject a page if it:

```text
[ ] Looks like a wireframe.
[ ] Looks like a landing page.
[ ] Looks like a design board instead of an app screen.
[ ] Uses huge decorative cards for all content.
[ ] Has too much empty whitespace for a B-end app.
[ ] Hides important operations behind presentation graphics.
[ ] Has no realistic tables, tabs, or operation records.
[ ] Hard-codes module behavior into the component.
[ ] Mixes formulas, permissions, workflow, or API calls directly into UI.
```



<!-- FILE: docs/ME_VISUAL_SYSTEM.md -->


# ME Visual System

## Purpose

This document defines the visual system for ME Branch ERP.

The visual direction is:

```text
Clean
Premium
B-end realistic
Dense but readable
Enterprise SaaS
Restaurant operations focused
```

The product should not look childish, over-rounded, or like a scattered design poster. It should feel like real software used by head office, branch managers, and staff.

---

## Themes

ME supports three themes:

```text
Bright
Dark
Moon
```

### Bright theme

Primary operational mode for desktop admin and B-end enterprise pages.

```text
Background: off-white / neutral 50
Surface: white
Text: slate / charcoal
Accent: ME blue
Success: green
Warning: amber
Danger: red
Info: blue
```

### Dark theme

Used for monitoring, night operation, or high-contrast manager workspace.

### Moon theme

Premium dark-blue / moon-silver visual style used for high-end ME brand pages, demo boards, and executive workspace.

---

## Color tokens

```text
--me-primary: #1E5BFF
--me-primary-hover: #1748CC
--me-primary-soft: #EAF1FF

--me-navy-950: #071234
--me-navy-900: #0B1A3D
--me-navy-800: #122A5C
--me-navy-700: #1C3F7A

--me-slate-900: #0F172A
--me-slate-700: #334155
--me-slate-500: #64748B
--me-slate-400: #94A3B8
--me-slate-300: #CBD5E1
--me-slate-200: #E2E8F0
--me-slate-100: #F1F5F9
--me-slate-50: #F8FAFC

--me-surface: #FFFFFF
--me-background: #F8FAFC
--me-border: #E2E8F0

--me-success: #10B981
--me-success-soft: #EAFBF4

--me-warning: #F59E0B
--me-warning-soft: #FFF7E6

--me-danger: #EF4444
--me-danger-soft: #FFF1F2

--me-info: #3B82F6
--me-info-soft: #EFF6FF
```

---

## Typography

Use a clean modern sans-serif for the product UI.

Recommended:

```text
Figtree
Geist
Inter-style fallback
system-ui
```

### UI typography scale

```text
Page title: 20–24px / 600–700
Record title: 18–22px / 600
Section title: 14–16px / 600
Body: 13px / 400
Table: 12–13px / 400
Caption: 11–12px / 400
```

### Presentation / brand pages

Large B-end showcase boards may use stronger display typography, but app UI must remain realistic and dense.

---

## Spacing system

Use an 8px-based system with smaller B-end exceptions.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

### Product UI spacing

```text
Page padding: 16–24px
Section gap: 12–16px
Card padding: 16–20px
Dense table cell padding: 8–12px
Form field gap: 12px
Tabs margin bottom: 12–16px
```

---

## Radius

```text
Small controls: 6px
Buttons: 6–8px
Cards: 8–12px
Modal: 12–16px
Dashboard tiles: 10–12px
```

Avoid making all panels very rounded. B-end UI needs discipline and density.

---

## Border

```text
Default border: 1px solid #E2E8F0
Strong border: 1px solid #CBD5E1
Active border: 1px solid #1E5BFF
Danger border: 1px solid #EF4444
```

Use borders more than heavy shadows for B-end realism.

---

## Shadow

```text
Card shadow: very subtle
Floating panel shadow: medium
Modal shadow: stronger
Sidebar shadow: minimal
```

Do not use glossy, 3D, or exaggerated shadows.

---

## Buttons

### Primary

Use for one main action.

```text
Background: ME blue
Text: white
Height: 32–36px
Radius: 6–8px
```

Examples:

```text
+ 新建任务
+ 新建跟进
保存更改
同意
提交
```

### Secondary

```text
Background: white
Border: neutral
Text: slate
```

Examples:

```text
编辑
转移
导出
返回
复制
```

### Danger

```text
Background: danger soft or white
Border: danger
Text: danger
```

Examples:

```text
拒绝
删除
停用
作废
```

### More menu

Use for overflow actions.

```text
更多
更多操作
```

---

## Badges

### Status badges

```text
Active / 在职 / 营业中: success
Pending / 待审批 / 待处理: warning
Error / 异常 / 逾期: danger
Info / 进行中: info
Inactive / 停用 / 已关闭: neutral
```

### Badge metrics

```text
Height: 20–24px
Font size: 11–12px
Radius: 999px or 4–6px
Padding X: 6–10px
```

---

## Tables

### Table style

```text
Header background: neutral 50
Header text: slate 600
Row border: neutral 200
Hover: primary soft or neutral 50
Selected: primary soft
```

### Cell rules

- Align numbers right when used in finance, sales, inventory, or quantity.
- Align status badges center or left depending on table.
- Use compact action menu on the far right.
- Use links for record names and IDs.

---

## Tabs

### Primary detail tabs

Use tabs under record header.

```text
Active: blue text + blue bottom border
Inactive: slate 500
Height: 40–44px
```

Example:

```text
基本信息
经营数据
人员管理
任务工单
日志记录
附件资料
操作日志
```

### Avoid

- Too many colorful tab styles.
- Tabs placed far away from record header.
- Tabs that change page layout completely without user context.

---

## Timeline

### Use cases

```text
Follow-up activity
Approval workflow
Task operation log
Incident timeline
Order execution history
Finance transaction history
```

### Style

```text
Vertical line: neutral 200
Completed dot: success
Current dot: primary
Warning dot: warning
Failed dot: danger
Future dot: neutral
```

### Timeline item structure

```text
Time
Actor
Action
Optional note
Optional attachment
```

---

## Right rail

### Purpose

The right rail is for contextual support, not main content.

Good right rail content:

```text
Activity record
Approval workflow
Alerts and exceptions
Related summary
Recent actions
Quick notes
```

Avoid:

```text
Large primary forms
Full data tables
Huge charts
Decorative cards
```

---

## Major B-end detail page visual style

The realistic ME detail page direction uses:

```text
Deep navy product board background for presentation exports
White app screenshot surfaces
Left sidebar
Breadcrumb
Record header
Status tag
Action buttons
Tabs
Dense definition grids
Related tables
Right rail timeline
Subtle blue accents
```

This style applies when creating product showcase images or design boards. Inside the actual app, keep the same UI discipline without the navy presentation background.

---

## Responsive behavior

### Desktop

```text
Full sidebar
Full tables
Right rail visible
Dense definitions
Multi-column detail sections
```

### Tablet

```text
Sidebar can collapse
Right rail moves below or becomes tab
Tables can horizontal scroll
Primary action + More
```

### Mobile

```text
Bottom navigation or drawer
Detail sections stacked
Tables become card lists
Right rail becomes Activity tab
One primary action visible
```

---

## Visual acceptance checklist

```text
[ ] Looks like a real enterprise product.
[ ] Uses ME blue and slate neutrals consistently.
[ ] Uses compact table/detail density.
[ ] Does not overuse decorative cards.
[ ] Status colors are consistent.
[ ] Buttons are limited and prioritized.
[ ] Tabs sit directly under record context.
[ ] Right rail is contextual.
[ ] Chinese and English labels have enough space.
[ ] The page still looks premium without becoming a landing page.
```
