# ME Branch ERP — Design System & Interactive UX Specification for Stitch AI

> Purpose: This document is the source of truth for designing ME Branch ERP as a real, interactive B2B restaurant ERP application. It is not a static dashboard, not a presentation, and not a mock-only concept.

---

## 1. Product Positioning

ME Branch ERP is a restaurant company operating system for:

- Branch / Store Operations
- Inspection
- Issues / Incidents
- Tasks
- Procurement
- Supplier
- Inventory
- Receiving
- Staff / HR
- Schedule
- Training / SOP
- Reports
- Roles & Permission
- Settings
- Integration

The application must feel like a real B-end ERP / CRM system used by operations managers, branch managers, HR, procurement, finance, and head office.

---

## 2. Mandatory Language Support

ME must support two languages:

1. English
2. Chinese

### 2.1 Language UX Rules

The language switch must be reachable from:

- Topbar user menu
- Settings → Display & Language

Required language states:

- English
- 中文

### 2.2 Language Behavior

Every module must support both languages for:

- Sidebar labels
- Breadcrumbs
- Page titles
- Table headers
- Filters
- Buttons
- Empty states
- Error states
- Toast messages
- Modal titles
- Form labels
- Validation messages

### 2.3 Layout Rule for English vs Chinese

English usually expands more horizontally than Chinese.

Design must allow:

- Button text wrapping prevention
- Tabs horizontal scroll when needed
- Table columns with minimum widths
- Responsive truncation with tooltip
- Form labels with enough width
- No broken layout when switching language

### 2.4 Button Copy Examples

| Function | English | Chinese |
|---|---|---|
| Add branch | Add Branch | 新增门店 |
| Export | Export | 导出 |
| View reports | View Reports | 查看报表 |
| Open tasks | Open Tasks | 打开任务 |
| Create task | Create Task | 创建任务 |
| View detail | Open Detail | 查看详情 |
| Save | Save Changes | 保存更改 |
| Cancel | Cancel | 取消 |
| Approve | Approve | 同意 |
| Reject | Reject | 驳回 |
| Assign | Assign | 指派 |
| Escalate | Escalate | 升级处理 |
| Resolve | Resolve | 标记解决 |

---

## 3. Mandatory Theme Support

ME must support three themes:

1. Bright
2. Dark
3. Moon

### 3.1 Theme Entry Points

The theme switch must be reachable from:

- Topbar user menu
- Settings → Display & Theme

### 3.2 Bright Theme

Inspired by clean professional IDE / SaaS light mode.

Use for normal customer demo and daily operation.

- Background: soft gray / off-white
- Surface: white
- Border: subtle gray
- Text: near-black / slate
- Primary accent: blue
- Status colors: green, amber, red, gray

### 3.3 Dark Theme

Inspired by Trae Solo IDE dark mode.

Use for admin / power users / low-light environments.

- Background: near-black / deep slate
- Surface: dark gray
- Border: soft dark border
- Text: white / gray
- Primary accent: blue
- Status colors adjusted for contrast

### 3.4 Moon Theme

A premium night theme with softer contrast than dark mode.

Use for manager presentation / night operation mode.

- Background: moon navy / blue-black
- Surface: deep blue-gray
- Border: moon-silver
- Text: soft white
- Accent: moon blue / muted violet
- Status colors softer, not neon

### 3.5 Theme UX Rules

Theme switching must:

- Apply globally
- Persist user preference
- Not break tables
- Not reduce text readability
- Keep status colors recognizable
- Keep focus states visible
- Keep card/table borders visible

---

## 4. Global App Shell

Every customer-facing module must use the same shell.

### 4.1 Shell Layout

Required global shell:

1. Left sidebar
2. Topbar
3. Breadcrumb
4. Page header
5. Action bar
6. Main workspace
7. Right rail when relevant

### 4.2 Sidebar Navigation

Sidebar must use subdirectory navigation, not a flat list.

Recommended structure:

```text
ME Branch ERP
Restaurant Operations

Dashboard

Store Operations
  Branches
  Inspection
  Issues
  Tasks

PSI
  Overview
  Procurement
  Supplier
  Inventory
  Receiving

Workforce
  Staff
  Schedule
  Training

Business
  Reports
  Roles & Permission

System
  Settings
  Integration
```

### 4.3 Sidebar UX

Parent groups:

- Collapsible
- Show caret
- Keep expanded group state
- Active parent highlighted if child is active

Child items:

- Indented 20px
- Active item has blue left indicator
- Soft blue active background
- 32–36px height
- Icon and text aligned

### 4.4 Topbar

Topbar must include:

- Global search
- Branch selector
- Date range selector
- Notification icon
- Theme switch
- Language switch
- User menu

Topbar must not include:

- DEVELOP
- Guardrail
- Current release scope
- Mock
- Demo
- Placeholder
- Read-only
- Dev
- Internal

### 4.5 Breadcrumb

Every major page must have breadcrumb.

Example:

```text
ME / Store Operations / Branch Management
```

### 4.6 Page Header

Every major module page must have:

- Title
- Subtitle
- Status/context chips where useful
- Primary action
- Secondary actions

### 4.7 Main Workspace

Main workspace must be operational, not decorative.

Use:

- KPI cards
- Filter row
- Data table
- Detail panel
- Tabs
- Right rail
- Activity timeline
- Related records
- Lower tables

Avoid:

- Marketing hero cards
- Oversized concept blocks
- Dead explanation panels
- Context/governance wording

---

## 5. Page Templates

Every module must use one of these templates.

### 5.1 Dashboard Workspace

Used by:

- Dashboard

Structure:

- KPI row
- Branch performance table
- Work queue
- Alerts
- Recent activity
- Right rail

### 5.2 Master Table + Detail Workspace

Used by:

- Branches
- Supplier
- Inventory
- Staff
- Procurement
- Issues
- Tasks
- Inspection
- Receiving

Structure:

- KPI row
- Filter row
- Full-width or primary table
- Selected record detail
- Tabs
- Right rail
- Lower related tables

### 5.3 Record Detail Page

Used by:

- Branch detail
- Task detail
- Approval detail
- Supplier detail
- Inventory item detail
- Procurement request detail
- Staff detail
- Issue detail
- Inspection detail

Structure:

- Breadcrumb
- Record header
- Status badge
- Summary metadata
- Action bar
- Tabs
- Main detail
- Related records
- Attachments/comments/logs
- Right timeline

### 5.4 Report Workspace

Used by:

- Reports

Structure:

- Report catalog
- Filters
- Saved reports
- Scheduled reports
- Data sync status
- Export actions

### 5.5 Settings Workspace

Used by:

- Settings
- Integration
- Roles & Permission

Structure:

- Setting/category list
- Detail configuration panel
- Validation panel
- Audit log
- Test/preview actions

---

## 6. Interactive UX Rule

The app must not be a dead page.

Every button must either:

1. Navigate to a page
2. Open a drawer
3. Open a modal
4. Apply a filter
5. Select a row
6. Change a tab
7. Trigger a toast/loading state
8. Show a confirmation
9. Update visible UI state

No visible button may do nothing.

### 6.1 Required Button States

Every interactive control must support:

- Default
- Hover
- Active
- Focus
- Disabled
- Loading
- Success
- Error

### 6.2 Common Interaction Patterns

#### Add / Create

Click → drawer or modal opens → form → validation → save → toast → new row appears.

#### Export

Click → loading state → success toast → export status visible.

#### View Reports

Click → navigate to Reports module with context filter.

#### Open Tasks

Click → navigate to Tasks module filtered by selected record.

#### Open Detail

Click → navigate to record detail route.

#### Approve / Reject

Click → confirmation modal → loading → status update → toast → timeline updated.

#### Assign / Reassign

Click → drawer/modal → select user → save → visible owner changes.

#### Resolve

Click → confirmation → status becomes resolved → timeline updated.

#### Test Connection

Click → loading → success/error status visible.

---

## 7. Forbidden Customer-Visible Wording

Never show these in customer-facing UI:

- DEVELOP
- Guardrail
- Current release scope
- Context workspace
- Shared branch context
- Linked modules explanation
- ME Platform explanation
- Enterprise navigation explanation
- Mock
- Demo
- Placeholder
- Read-only
- Dev
- Sample
- Fake
- Test data
- Prototype
- Internal only
- Coming soon, unless it is a real roadmap page

---

## 8. Alignment & Spacing Rules

Recommended desktop design size:

- 1440 × 1024
- 1728 × 1112

Layout:

- Sidebar: 216–240px
- Topbar: 56–64px
- Page padding: 20–24px
- Card gap: 12–16px
- Right rail: 300–360px
- Table row: 40–48px
- Button height: 32–36px
- Card radius: 8–12px

Alignment checks:

- Sidebar logo height aligns with topbar height
- Topbar bottom border aligns across full app
- Page header aligns with table/card grid
- KPI row cards have equal height
- Filter row and table share same width
- Right rail top aligns with selected detail top
- Table header and cells are vertically centered
- No large empty middle space without useful business content

---

## 9. Module Design Specifications

## 9.1 Dashboard

### Purpose

Give owners/managers an operational overview of all branches.

### Page Type

Dashboard Workspace.

### Required Sections

- KPI row
- Branch performance table
- Work queue
- Critical alerts
- Recent activity
- Right rail

### KPI

- Today Sales
- Open Stores
- Open Tasks
- Critical Issues
- Stock Alerts
- Staff On Duty
- Inspection Score
- POS Sync Status

### Actions

- View Branches
- Open Tasks
- Review Alerts
- Export Report

### Interactions

- View Branches → navigate to Branch Management
- Open Tasks → navigate to Tasks filtered by due/open
- Review Alerts → navigate to Issues filtered by critical
- Export Report → loading → success toast

---

## 9.2 Branch Management

### Purpose

Manage branch operating status, performance, staffing, tasks, and alerts.

### Page Type

Master Table + Detail Workspace.

### KPI

- Total Branches
- Open Stores
- Today Sales
- Open Tasks
- Stock Alerts
- Staff On Duty
- Inspection Score
- Critical Issues

### Filters

- Search branch name / code / manager
- Branch
- Region
- Status
- Date range
- More filters

### Table Columns

- Branch Code
- Branch Name
- Region
- Manager
- Status
- Today Sales
- Open Tasks
- Stock Alerts
- Inspection
- Last Update

### Selected Detail Tabs

- Overview
- Operations
- Staff
- Inventory
- Tasks
- Activity

### Actions

- Add Branch → open branch form drawer
- Export → export branch table
- View Reports → open Reports filtered by branch
- Open Tasks → open Tasks filtered by selected branch
- Create Task → open task drawer
- View Report → open branch report
- Open Detail → open branch detail page

---

## 9.3 Inspection

### Purpose

Manage branch inspections, checklist scores, failed items, and corrective actions.

### Page Type

Master Table + Detail Workspace.

### KPI

- Scheduled Inspections
- Completed
- Failed Items
- Average Score
- Pending Verification
- Overdue Corrective Actions

### Table Columns

- Inspection ID
- Branch
- Type
- Owner
- Score
- Failed Items
- Status
- Due Date
- Last Update

### Detail Tabs

- Overview
- Checklist
- Issues
- Evidence
- Activity

### Actions

- New Inspection → drawer form
- Assign Inspector → assignment modal
- Verify Item → confirmation + status update
- Create Corrective Task → task drawer
- Upload Evidence → upload modal
- Export Report → export

---

## 9.4 Issues / Incidents

### Purpose

Manage operational incidents and resolution.

### Page Type

Issue Queue + Detail + Timeline.

### KPI

- Open Issues
- Critical Issues
- Overdue SLA
- Resolved Today
- Awaiting Verification

### Table Columns

- Issue ID
- Title
- Branch
- Severity
- Category
- Owner
- SLA
- Status
- Last Update

### Detail Tabs

- Overview
- Timeline
- Evidence
- Related Tasks
- Comments

### Actions

- New Issue → drawer form
- Assign → assignment modal
- Escalate → confirmation + severity update
- Resolve → confirmation + timeline update
- Verify → verification status update
- Add Note → comment drawer
- Attach Evidence → upload modal

---

## 9.5 Tasks

### Purpose

Manage daily tasks, work orders, checklists, and reviews.

### Page Type

Task Table + Task Detail.

### KPI

- Open Tasks
- Due Today
- Overdue
- Completed Today
- Awaiting Review

### Table Columns

- Task ID
- Task
- Branch
- Owner
- Priority
- Due
- Status
- Progress
- Last Update

### Detail Tabs

- Overview
- Checklist
- Comments
- Attachments
- Activity

### Actions

- Create Task → drawer form
- Assign → modal
- Reassign → modal
- Complete → confirmation + status update
- Submit Review → status update
- Add Comment → comment input
- Attach File → upload modal
- Escalate → confirmation

---

## 9.6 Procurement

### Purpose

Manage purchase requests, purchase orders, approval, delivery, and receiving.

### Page Type

Procurement Table + Request Detail + Approval Timeline.

### KPI

- Open Requests
- Pending Approval
- Total Spend
- Delayed Orders
- Awaiting Receiving

### Table Columns

- PR / PO ID
- Supplier
- Branch
- Requester
- Amount
- Status
- Approval
- Delivery Date
- Last Update

### Detail Tabs

- Overview
- Items
- Approval
- Receiving
- Documents
- Activity

### Actions

- New Request → drawer form
- Approve → confirmation modal
- Reject → rejection reason modal
- Convert to PO → status update
- Send to Supplier → send confirmation
- Mark Received → receiving workflow
- Export PO → export

---

## 9.7 Supplier

### Purpose

Manage supplier data, contacts, prices, orders, risks, and performance.

### Page Type

Supplier List + Supplier Profile.

### KPI

- Active Suppliers
- Pending Review
- Delivery Issues
- Price Changes
- Average Score

### Table Columns

- Supplier Code
- Supplier Name
- Category
- Contact
- Status
- Rating
- Last Order
- Delivery Score
- Risk Level

### Detail Tabs

- Overview
- Contacts
- Products
- Purchase Orders
- Price History
- Issues
- Activity

### Actions

- Add Supplier → drawer form
- Edit Supplier → edit drawer
- Create PO → procurement request drawer
- Compare Price → price comparison panel
- Review Performance → review modal
- Upload Document → upload modal
- Deactivate → danger confirmation

---

## 9.8 Inventory

### Purpose

Manage stock, stock alerts, movement, transfer, and stocktake.

### Page Type

Inventory Table + Item Detail + Movement History.

### KPI

- Total SKUs
- Low Stock Items
- Critical Stock
- Stock Value
- Pending Transfers
- Variance Items

### Table Columns

- SKU
- Item Name
- Category
- Location
- On Hand
- Reorder Level
- Available
- Status
- Last Movement

### Detail Tabs

- Overview
- Movements
- Transfers
- Stocktake
- Supplier
- Activity

### Actions

- Add Item → drawer form
- Stock In → stock transaction modal
- Stock Out → stock transaction modal
- Transfer → transfer drawer
- Adjust Stock → confirmation + reason required
- Start Stocktake → workflow drawer
- Export → export

---

## 9.9 Receiving

### Purpose

Manage supplier receiving, variance, quality checks, and stock posting.

### Page Type

Receiving Queue + Detail + Variance Panel.

### KPI

- Awaiting Receiving
- Received Today
- Variance Found
- Supplier Delays
- Pending Verification

### Table Columns

- Receiving ID
- PO ID
- Supplier
- Branch
- Expected Date
- Received Qty
- Variance
- Status

### Detail Tabs

- Overview
- Items
- Variance
- Quality Check
- Documents
- Activity

### Actions

- Start Receiving → receiving drawer
- Confirm Received → confirmation + stock update state
- Report Variance → variance form
- Reject Item → reason modal
- Upload Photo → upload modal
- Post to Inventory → confirmation

---

## 9.10 Staff / HR

### Purpose

Manage staff profiles, branches, roles, attendance, leave, training, and documents.

### Page Type

Staff Table + Employee Detail.

### KPI

- Total Staff
- On Duty Today
- On Leave
- Missing Training
- Attendance Issues
- New Joiners

### Table Columns

- Staff ID
- Name
- Branch
- Role
- Status
- Today Shift
- Attendance
- Training
- Last Update

### Detail Tabs

- Overview
- Employment
- Attendance
- Schedule
- Training
- Documents
- Activity

### Actions

- Add Staff → drawer form
- Edit Profile → edit drawer
- Assign Branch → branch assignment modal
- Update Role → role modal
- Record Leave → leave drawer
- View Schedule → Schedule module with staff filter
- Upload Document → upload modal

---

## 9.11 Schedule

### Purpose

Plan weekly shifts, manpower coverage, role coverage, and conflicts.

### Page Type

Schedule Board + Coverage Table + Shift Detail.

### KPI

- Scheduled Staff
- Coverage Gaps
- Pending Publish
- Overtime Risk
- Unassigned Shifts

### Required Sections

- Weekly schedule grid
- Branch selector
- Date range
- Shift coverage summary
- Role coverage table
- Staff availability panel
- Coverage warnings

### Detail Tabs

- Schedule
- Coverage
- Availability
- Conflicts
- Publish Log

### Actions

- Create Shift → drawer form
- Assign Staff → assignment modal
- Auto Fill → loading + suggested assignments
- Publish Schedule → confirmation + publish status
- Copy Week → copy modal
- Check Coverage → coverage validation panel
- Export → export

---

## 9.12 Training / SOP

### Purpose

Manage SOP courses, staff progress, role-based learning, and certification.

### Page Type

Training Catalog + Staff Progress + Skill Matrix.

### KPI

- Active Courses
- Completion Rate
- Overdue Training
- Staff Certified
- SOP Updates

### Table Columns

- Course / SOP
- Category
- Required Role
- Completion
- Overdue
- Last Updated

### Detail Tabs

- Overview
- Lessons
- Staff Progress
- Assessment
- Documents
- Activity

### Actions

- Create Course → drawer form
- Assign Staff → assignment modal
- Update SOP → editor/detail drawer
- Mark Complete → status update
- Start Assessment → assessment flow
- Export Progress → export

---

## 9.13 Reports

### Purpose

Run, save, schedule, and export operational reports.

### Page Type

Report Workspace.

### KPI

- Reports Available
- Scheduled Reports
- Exports Today
- Failed Sync
- Latest POS Import

### Catalog Columns

- Report Name
- Category
- Data Source
- Frequency
- Last Generated
- Status

### Categories

- Branch
- Sales
- POS
- Inventory
- Procurement
- Supplier
- HR
- Schedule
- Task
- Training
- Finance

### Actions

- Run Report → loading + report result
- Export → export modal
- Schedule → schedule modal
- Save View → saved view
- Open Dashboard → report dashboard
- Refresh Data → sync/loading state

---

## 9.14 Roles & Permission

### Purpose

Manage roles, branch access, module access, action permissions, and audit.

### Page Type

Role List + Permission Matrix.

### KPI

- Active Roles
- Users Assigned
- Admin Users
- Permission Changes
- Security Alerts

### Table Columns

- Role
- Users
- Branch Access
- Module Access
- Status
- Last Updated

### Detail Tabs

- Overview
- Users
- Module Access
- Branch Access
- Action Rules
- Audit

### Actions

- Create Role → drawer form
- Edit Permission → permission matrix editor
- Assign Users → user assignment modal
- Duplicate Role → confirmation
- Export Audit → export
- Deactivate Role → danger confirmation

---

## 9.15 Settings

### Purpose

Configure company, branch, module, theme, language, approval rules, notifications, and security.

### Page Type

Settings Workspace.

### Sections

- Company Profile
- Branch Setup
- Module Configuration
- Display & Theme
- Language
- Notification
- Approval Rules
- Data Mapping
- Security

### Actions

- Save Changes → validation + success toast
- Reset → confirmation
- Preview → preview panel
- Test Setting → loading + result
- Add Rule → drawer form
- Enable / Disable → toggle + confirmation where risky

---

## 9.16 Integration

### Purpose

Connect POS, printers, APIs, webhooks, and external tools.

### Page Type

Connector List + Connector Detail + Error Rail.

### KPI

- Connected Apps
- Sync Healthy
- Sync Errors
- Devices Online
- Last Sync

### Table Columns

- Connector
- Type
- Status
- Last Sync
- Response Time
- Owner
- Environment

### Detail Tabs

- Overview
- Settings
- Logs
- Mapping
- Alerts

### Actions

- Add Connector → connector drawer
- Test Connection → loading + result
- Reconnect → confirmation + status update
- View Logs → log panel
- Edit Mapping → mapping editor
- Disable → danger confirmation
- Sync Now → loading + sync result

---

## 10. Final Acceptance Checklist

Before approving the design, verify:

- Every module uses the same shell
- Sidebar uses subdirectory navigation
- Two languages are supported
- Bright / Dark / Moon themes are supported
- Every major page has breadcrumb
- Every module has action buttons
- Every button has an interaction result
- Every table row can be selected
- Selected record detail is visible
- Right rail contains useful pending actions/activity
- No customer-visible demo/develop/mock wording
- Tables are not crushed by right rail
- Empty middle space is filled with useful information
- Layout works in desktop, tablet, and mobile
- English and Chinese do not break layout
