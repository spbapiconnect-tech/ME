# ME Page Templates

## Purpose

This document defines the approved page templates for **ME Branch ERP**.

Every module must choose a template. New pages should not invent a new major layout without updating the governance docs first.

## Approved Templates

1. Dashboard Workspace
2. List Workspace
3. Detail Workspace
4. Report Workspace
5. Settings Workspace
6. Major Record Detail Page
7. Mobile Staff Workflow Page
8. Manager Tablet Workspace

---

## 1. Dashboard Workspace

### Use for

- `/`
- branch or head office overview
- cross-module management home
- report overview home

### Structure

- Sidebar
- Topbar / breadcrumb
- Page header
- KPI row
- work queue
- alerts / exceptions
- module summary
- recent activity
- right rail

### Rule

Dashboard pages must look like an operations control page, not a landing page.

---

## 2. List Workspace

### Use for

- staff
- schedule
- tasks
- issues
- inspection
- inventory list
- procurement list
- supplier list

### Structure

- Sidebar
- Breadcrumb
- Page header
- filter bar
- tabs or segmented status filters
- dense table or record list
- row actions
- right rail

### Rule

List pages should prioritize search, filter, sort, status visibility, and drill-down access.

---

## 3. Detail Workspace

### Use for

- task detail
- issue detail
- inspection detail
- procurement detail
- inventory detail
- supplier detail

### Structure

- Sidebar
- Breadcrumb
- record summary header
- action bar
- tabs
- main detail sections
- related records
- timeline
- right rail

### Rule

Detail workspace is the default B-end operating pattern for record-level pages.

---

## 4. Report Workspace

### Use for

- reports
- POS reports
- branch performance
- finance and metric review

### Structure

- Sidebar
- Breadcrumb
- page header
- period / branch filters
- category tabs
- widgets / lists / report tables
- export or share action area
- right rail

### Rule

Report pages must still feel operational and dense, not like poster dashboards.

---

## 5. Settings Workspace

### Use for

- system-foundation
- display-settings
- navigation
- access-control
- packages
- notifications
- templates

### Structure

- Sidebar
- Breadcrumb
- page header
- configuration tabs
- settings sections
- action bar
- right rail or contextual help

### Rule

Settings pages should feel structured and administrative, not decorative.

---

## 6. Major Record Detail Page

### Purpose

This is the most important template in the system. It defines the product standard for realistic B-end detail pages.

### Required structure

- Sidebar
- Breadcrumb
- Record title
- Status badge
- Summary metadata
- Action bar
- Tabs
- Main detail sections
- Related records table
- Right timeline / activity rail
- Attachments / logs / comments
- Empty state rules
- Mobile/tablet adaptation

### Major page examples

- Customer Detail
- Branch Detail
- Employee Detail
- Candidate Detail
- Task Detail
- Approval Detail
- Order Detail
- Finance Detail
- Supplier Detail
- Inventory Item Detail
- Procurement Request Detail

### Main detail body guidance

Use:

- definition rows
- information sections
- related record tables
- status/timeline blocks
- operational notes
- attachments or logs

Avoid:

- nested card spam
- oversized decorative cards
- hero layouts
- giant empty regions

### Empty state rule

When data is unavailable:

- keep the structure visible
- show clear business labels
- avoid developer-facing wording
- use operational language such as `No records in the current period` rather than internal placeholder language

### Mobile / tablet adaptation

- breadcrumb may compress
- tabs may scroll horizontally
- action bar may wrap
- right rail moves below the main content
- dense tables may become horizontally scrollable

---

## 7. Mobile Staff Workflow Page

### Use for

- shift check-in context
- task follow-up
- training status
- approval acknowledgement
- food safety or expiry follow-up

### Structure

- compact topbar
- simplified title/context
- single-column sections
- stacked action blocks
- compact status summary
- bottom-safe layout

### Rule

This page type prioritizes fast execution for staff on phone-sized screens.

---

## 8. Manager Tablet Workspace

### Use for

- branch manager overview
- schedule review
- issue triage
- daily operations monitoring
- inspection review

### Structure

- compact/drawer sidebar
- topbar
- 1–2 column content
- denser queue or detail layout
- right rail moved below or into secondary pane

### Rule

Tablet layouts must stay operational, not become oversized mobile cards.

---

## Template Selection Rule

Before building a new page:

1. identify the business surface
2. choose the approved template
3. define data and detail sections
4. define actions and tabs
5. define responsive behavior
6. only then implement the page
