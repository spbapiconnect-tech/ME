# ME Design System / B-End Operational UI Direction

## 1. Product Direction

ME is not a marketing dashboard.  
ME is a practical B-end ERP / CRM / Store Operations platform.

The UI must feel like a real internal business system used daily by operators, managers, purchasing, warehouse, and admins.

The target style is closer to mature B-end detail pages:

- CRM detail page
- ERP record page
- Supplier profile page
- Inventory detail page
- Branch operations page
- Procurement request detail page
- Staff / role management page
- Report operations page

Avoid:

- landing page style
- overly decorative SaaS dashboard
- toy cards
- architecture board
- black wireframe boxes
- huge empty cards
- excessive badges/chips
- too much gradient
- too much rounded border
- presentation-only copy
- demo-heavy screens
- large placeholder explanations dominating the UI

The final UI should feel serious, practical, compact, and operational.

---

## 2. Core Layout Philosophy

Use a stable shell:

```text
Left Sidebar        Main Workspace                  Right Context
Navigation          Record / List / Detail           Status / Activity
```

Desktop layout:

```text
┌──────────────┬────────────────────────────────────┬──────────────┐
│ Sidebar      │ Main Workspace                     │ Right Rail   │
│ 220-240px    │ fluid, dense, table/detail focused │ 280-320px    │
└──────────────┴────────────────────────────────────┴──────────────┘
```

The middle content is the most important part.

Do not design ME as a card-only dashboard.
Design ME as an operational workspace.

The layout shell should be reusable so future visual changes do not break:

* routes
* links
* navigation config
* module config
* page-data mapping
* future API contracts
* future database mapping

---

## 3. Resolution Target

Primary desktop target:

```text
1710 × 1112 and above
```

At this size:

* sidebar should be visible
* main workspace should use the width
* right rail should be visible
* table/detail content should not be squeezed
* avoid narrow centered content
* avoid oversized cards
* avoid marketing-page spacing
* show operational density without clutter

Recommended desktop shell dimensions:

```text
Page max width: none or 100%
Outer padding: 16px to 24px
Sidebar width: 232px
Main min width: 0
Right rail width: 300px
Main + right rail gap: 16px
Topbar height: 56px to 64px
```

For very large desktop:

```text
Content can use max-width: 1600px - 1760px
Do not center as a small card.
Keep sidebar, main, and right rail aligned as an app workspace.
```

---

## 4. Breakpoints

```text
Desktop: >= 1280px
Large desktop: >= 1536px
Target desktop: >= 1710px
Tablet: 768px - 1279px
Mobile: <= 767px
```

### Desktop

* fixed or sticky sidebar
* compact topbar
* main content + right rail
* dense tables
* right rail visible
* action toolbar stays horizontal where possible

### Tablet

* sidebar collapses into drawer or compact rail
* right rail moves below or becomes drawer
* main content uses 1–2 columns
* tables may horizontally scroll
* tabs remain usable
* action toolbar can wrap

### Mobile

* no fixed desktop sidebar
* use topbar + drawer nav
* content stacks vertically
* tabs horizontally scroll
* action bar wraps
* tables become scrollable or stacked record cards
* right rail moves below main content
* no content should overflow badly

ME is one shared B-end platform across desktop, tablet, and phone.
Do not create unrelated layouts that break the same navigation/data structure.

---

## 5. Visual Style Parameters

### 5.1 Color

Use neutral B-end palette.

```text
Background: #F5F7FB
Surface: #FFFFFF
Surface Soft: #F8FAFC
Surface Muted: #F1F5F9

Text Primary: #0F172A
Text Secondary: #475569
Text Muted: #64748B
Text Disabled: #94A3B8

Border Light: #E2E8F0
Border Default: #CBD5E1
Border Strong: #94A3B8

Primary Blue: #2563EB
Primary Soft: #EFF6FF
Primary Border: #BFDBFE

Success: #16A34A
Success Soft: #F0FDF4

Warning: #D97706
Warning Soft: #FFFBEB

Danger: #DC2626
Danger Soft: #FEF2F2

Info: #0284C7
Info Soft: #F0F9FF
```

Avoid:

* black borders
* dark outlines
* too many bright badges
* huge blue gradients
* excessive glassmorphism
* decorative color blocks that reduce readability

### 5.2 Border

Default border:

```text
1px solid #E2E8F0
```

Important panel border:

```text
1px solid #CBD5E1
```

Never use thick black borders for normal UI.

Use separators instead of boxed cards where possible:

```text
border-bottom: 1px solid #E2E8F0
```

### 5.3 Radius

Use less exaggerated rounding.

```text
Small control: 6px
Button: 8px
Card / panel: 10px - 12px
Large shell: 12px - 16px
```

Avoid:

* rounded-3xl everywhere
* pill-shaped everything
* huge soft blobs
* overly playful cards

### 5.4 Shadow

Use very subtle shadow only for floating panels.

```text
Card shadow: 0 1px 2px rgba(15, 23, 42, 0.04)
Elevated shadow: 0 8px 24px rgba(15, 23, 42, 0.08)
```

Most ERP/CRM panels can use border + background, not heavy shadow.

---

## 6. Typography

Use compact B-end typography.

```text
Page title: 24px / 32px, font-weight 650
Section title: 15px / 22px, font-weight 600
Body: 13px / 20px
Small label: 11px / 16px, uppercase, letter spacing 0.04em
Table text: 12px - 13px
Metadata label: 11px
Metadata value: 13px, font-weight 500
Sidebar parent: 13px, font-weight 600
Sidebar child: 12px - 13px, font-weight 500
```

Avoid:

* huge marketing titles
* too much uppercase
* oversized labels
* large empty spacing
* presentation-style hero text on operational pages

---

## 7. Sidebar Specification

The sidebar should look like a practical admin navigation.

Desktop width:

```text
Sidebar width: 232px
Collapsed sidebar width: 64px, future only
```

Structure:

```text
ME
Platform label

Dashboard
  Business Workspace

PSI Workspace
  Overview
  Procurement
  Supplier
  Inventory
  Issues
  Actions
  Reports

Reports
  Overview
  POS Reports
  Sales Analytics
  Branch Performance
  Export Center

Branches
  All Branches
  Branch Context
  Operations
  Inspections

Roles & Staff
  Roles
  Staff Profiles
  Permissions
  Training

Tasks & Education
  Tasks
  Education
  Training Records
  Task Templates

System
  Navigation IA
  System Foundation
  Display Settings
  Real Data Mapping
  Workflow
  Rules
  Access Control
  Audit Trail
```

Sidebar style:

* white or very light slate background
* no heavy outline
* section label small and muted
* parent item height 34px - 38px
* child item height 28px - 32px
* active item has soft blue background
* active item has left 3px blue indicator
* active parent should highlight when child route is active
* disabled child muted with small “Soon” or “Preview” badge
* descriptions should be minimal or removed
* do not make sidebar too text-heavy
* sidebar should scroll cleanly
* child links should be indented

Sidebar item example:

```text
[icon] PSI Workspace        ▾
      Overview
      Procurement
      Supplier
      Inventory
```

Avoid:

* long descriptions under every nav item
* too many pills inside sidebar
* thick bordered nav buttons
* giant nav cards
* black active outlines
* raw link clusters

---

## 8. Topbar Specification

Topbar should feel like a workspace control bar.

Height:

```text
56px - 64px
```

Content:

```text
Search / command
Branch selector
Date range
Role / user
Display mode
Guardrail
```

Style:

* compact
* light surface
* subtle border-bottom
* not a big rounded card
* controls should be chips or compact inputs
* no huge boxed form fields
* no unnecessary vertical height

Topbar desktop example:

```text
Search records...        Branch: KCH       Window: 7 days       Role: Manager
```

Topbar mobile:

```text
ME     Search icon     Branch chip     Menu button
```

Avoid:

* huge toolbar cards
* thick bordered controls
* large search blocks
* form-like rows that waste vertical space

---

## 9. Main Workspace Patterns

ME must support three main page types.

---

### 9.1 Dashboard Workspace

Used for:

* `/`
* `/reports` overview

Structure:

```text
Page header
KPI row
Work queue / Alerts
Module shortcuts
Recent activity
Right rail
```

KPI cards:

* compact
* value large but not huge
* label small
* trend small
* no heavy card outlines
* subtle color indicator only

Dashboard should not look like a landing page.
It should look like an operations control page.

---

### 9.2 List Workspace

Used for:

* supplier list
* inventory list
* branch list
* report list
* role list
* task list

Structure:

```text
Page header
Filter bar
Tabs
Table / list
Bulk action area
Right rail
```

Must include:

* search
* filters
* status tabs
* table or dense list
* clear empty/loading states where needed

---

### 9.3 Detail Workspace

This is the most important.

Used for:

* procurement request detail
* supplier detail
* inventory detail
* branch detail
* staff profile detail
* role detail

Structure:

```text
Record Summary Header
Action Toolbar
Tabs
Main Detail Body
Right Context Rail
```

This is the core B-end operating pattern for ME.

---

## 10. Detail Workspace Specification

Detail pages should look like mature CRM/ERP pages.

---

### 10.1 Record Summary Header

Example:

```text
PR-KCH-0001
Procurement request

Status: Pending Review
Branch: KCH
Supplier: ABC Food Supply
Owner: Purchasing
Last updated: Today 14:22
```

Style:

* white panel
* subtle border
* compact metadata grid
* status badge
* no huge card spacing
* strong title hierarchy
* safety/read-only notice should be secondary

---

### 10.2 Action Toolbar

Actions:

```text
Review
Assign
Export
Add Note
View History
Attach Document
```

Style:

* horizontal
* compact buttons
* primary action filled blue
* secondary actions white/gray
* no giant pill buttons
* no fake submit behavior
* actions can be placeholder links while real writes are not implemented

---

### 10.3 Tabs

Example:

```text
Overview | Items | Supplier | Receiving | Activity | Attachments
```

Style:

* horizontal row
* active tab blue underline or soft background
* inactive muted
* scroll on mobile
* no raw text links
* no oversized pills

---

### 10.4 Main Body

Use sections:

```text
Basic Information
Items
Timeline
Related Records
```

Use separators and tables instead of nested card spam.

Good detail body:

```text
Basic Information
------------------------------------------------
Request ID       PR-KCH-0001
Branch           KCH
Supplier         ABC Food Supply
Owner            Purchasing

Items
------------------------------------------------
SKU        Item              Qty      Status
...
```

Avoid:

* card inside card inside card
* decorative metric blocks for everything
* giant placeholder descriptions

---

### 10.5 Data Table

Table style:

* header background `#F8FAFC`
* row height 40px - 48px
* border-bottom only
* no full grid boxes
* compact text
* status chip inside row
* horizontal scroll on mobile/tablet
* sticky header optional for future

Table should feel like admin software, not spreadsheet art.

---

### 10.6 Timeline

Timeline style:

* small status dots
* vertical line
* event title
* time / actor
* muted description
* no big card per event

Timeline example:

```text
● Created request
  Today 10:24 · Purchasing

● Supplier quote attached
  Today 11:10 · System preview

● Awaiting manager review
  Pending
```

---

### 10.7 Right Rail

Right rail should be contextual.

It can include:

* approval status
* related tasks
* linked inventory
* attachments
* guardrail
* recent activity
* next suggested steps

Style:

* section blocks
* soft background
* list rows
* subtle separators
* no outlined button look for every item
* narrower than main content
* moves below content on tablet/mobile

---

## 11. Page-Specific Requirements

---

### 11.1 `/`

Must look like an operations dashboard, not a presentation board.

Required:

* compact dashboard header
* KPI row
* work queue
* operational alerts
* module entry list/card
* right rail

Reduce:

* long guardrail text
* huge bordered boxes
* excessive chips
* empty demo descriptions

---

### 11.2 `/psi`

Flagship operations page.

Must show:

* procurement request detail pattern
* `PR-KCH-0001`
* action toolbar
* tabs
* item table
* timeline
* right rail

This page decides whether ME feels like real ERP.

---

### 11.3 `/psi/supplier`

Must show:

* supplier header
* contacts
* recent orders
* issue list
* tabs
* timeline
* right rail

It should feel like supplier profile/detail page.

---

### 11.4 `/psi/inventory`

Must show:

* SKU header
* stock level
* stock movement table
* expiry/risk section
* linked supplier/procurement
* right rail

It should feel like inventory/SKU detail page.

---

### 11.5 `/branches`

Must show:

* branch list / overview
* KCH detail preview
* operations status
* linked modules
* issue/activity table
* right rail

It should feel like branch operations page.

---

### 11.6 `/reports`

Must show:

* filter bar
* report categories
* widget list/table
* export placeholder
* computed metrics placeholder

It should feel like a report workspace, not just dashboard cards.

---

### 11.7 `/roles`

Must show:

* role table/list
* permissions preview
* staff mapping placeholder
* access groups

It should feel like admin configuration workspace.

---

## 12. Display Settings

If `/display-settings` exists, it should not be a real setting save page.

It is preview-only.

Sections:

* density preview
* desktop/tablet/mobile layout preview
* sidebar behavior preview
* right rail behavior preview
* table density preview

No:

* localStorage
* sessionStorage
* save button
* API
* user preference persistence

Display settings should help explain that ME supports:

```text
Desktop
Tablet
Mobile
```

as one shared platform.

---

## 13. Implementation Rules

Do not:

* add real backend
* add API route handlers
* add database
* add Prisma
* add Supabase
* add auth/session
* add permissions enforcement
* add writes
* add workflow execution
* add notification sending
* add task creation
* add stock posting
* add supplier portal
* add more fake demo data
* add docs-only changes as the main work
* scatter mock business records inside UI components

Allowed:

* visual components
* layout components
* page layout refactor
* static placeholder values that are already present
* display preview UI
* responsive behavior
* centralizing existing mock/demo data
* moving placeholder records to data/mock or page-data helpers

---

## 14. Data Rule

Demo values must not be scattered inside components long-term.

Preferred:

```text
data/mock/*
config/*
lib/page-data/*
```

UI components should display data through props or page-data helpers.

Bad:

```tsx
const supplier = "ABC Food Supply";
```

Better:

```tsx
<SupplierDetailWorkspace supplier={supplierRecord} />
```

Best future path:

```text
mock provider
↓
repository/service/page-data boundary
↓
UI props
```

Then later:

```text
real API provider
↓
repository/service/page-data boundary
↓
same UI props
```

If quick UI work needs a placeholder, keep it small and clearly marked.

---

## 15. Route / Link Rule

Navigation should come from shared config/helper as much as possible.

Preferred:

```text
config/navigation.ts
↓
lib/navigation.ts
↓
MeSidebar / MeTopbar / MobileNav
```

Avoid hardcoding duplicate route lists in every page.

Changing shell layout must not break:

* `/`
* `/psi`
* `/psi/supplier`
* `/psi/inventory`
* `/branches`
* `/reports`
* `/roles`
* `/navigation`
* `/system-foundation`
* `/real-data-mapping`
* `/display-settings`

---

## 16. Responsive Rules

### Desktop 1710 × 1112+

At this size:

* sidebar visible
* topbar compact
* main content wide
* right rail visible
* no narrow centered mockup feeling
* detail workspace should have enough width for tables and metadata

### Tablet

* layout does not break
* sidebar can collapse/drawer
* right rail moves below or collapses
* tables scroll
* action toolbar wraps
* tabs remain usable

### Mobile

* content stacks
* no overflow disaster
* tabs/actions scroll or wrap
* nav is drawer/bottom/compact
* tables become horizontally scrollable or stacked
* right rail moves below main content

---

## 17. Acceptance Criteria

The UI is acceptable when these pages look like real B-end operational software:

```text
/
 /psi
 /psi/supplier
 /psi/inventory
 /branches
 /reports
 /roles
```

At desktop size 1710 × 1112:

* sidebar visible
* topbar compact
* main content wide
* right rail visible
* no narrow centered mockup feeling
* no black-wireframe look
* no card-spam look
* no raw links/text clusters

On tablet:

* layout does not break
* sidebar can collapse/drawer
* right rail moves below or collapses
* tables scroll

On mobile:

* content stacks
* no overflow disaster
* tabs/actions scroll or wrap
* nav is drawer/bottom/compact

---

## 18. Final Visual Goal

ME should feel like:

```text
A serious store operations ERP/CRM system
```

Not:

```text
A demo dashboard
A landing page
A documentation board
A wireframe
A toy SaaS app
```

The correct direction is:

```text
Operational shell
+ expandable B-end navigation
+ dense middle workspace
+ detail record pages
+ tables
+ tabs
+ timelines
+ right context rail
+ responsive desktop/tablet/mobile system
```

The UI should be ready before real data is connected.
