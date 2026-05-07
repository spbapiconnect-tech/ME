# ME Branch ERP — Module Shell & UX Link Map

This file defines how every module connects to the global shell, routes, buttons, details, modals, drawers, and cross-module navigation.

---

## 1. Global Shell Routes

| Shell Area | Route / Action | UX |
|---|---|---|
| Logo | `/` | Navigate to Dashboard |
| Global Search | overlay / command palette | Search branches, tasks, staff, suppliers, inventory |
| Branch Selector | global state | Filters all module data by branch |
| Date Range | global state | Filters KPI/tables/reports |
| Notification | notification drawer | Opens latest alerts/actions |
| Theme Switch | user menu / settings | Bright / Dark / Moon |
| Language Switch | user menu / settings | English / Chinese |
| User Menu | dropdown | Profile, Preferences, Sign out |

---

## 2. Sidebar Routes

| Group | Item | Route |
|---|---|---|
| Dashboard | Dashboard | `/` |
| Store Operations | Branches | `/branches` |
| Store Operations | Inspection | `/inspection` |
| Store Operations | Issues | `/issues` |
| Store Operations | Tasks | `/tasks` |
| PSI | Overview | `/psi` |
| PSI | Procurement | `/psi/procurement` |
| PSI | Supplier | `/psi/supplier` |
| PSI | Inventory | `/psi/inventory` |
| PSI | Receiving | `/psi/receiving` |
| Workforce | Staff | `/staff` |
| Workforce | Schedule | `/schedule` |
| Workforce | Training | `/training` |
| Business | Reports | `/reports` |
| Business | Roles & Permission | `/roles` |
| System | Settings | `/settings` |
| System | Integration | `/integration` |

---

## 3. Detail Routes

| Module | Detail Route |
|---|---|
| Branch | `/branches/:branchId` |
| Inspection | `/inspection/:inspectionId` |
| Issue | `/issues/:issueId` |
| Task | `/tasks/:taskId` |
| Procurement | `/psi/procurement/:requestId` |
| Supplier | `/psi/supplier/:supplierId` |
| Inventory | `/psi/inventory/:sku` |
| Receiving | `/psi/receiving/:receivingId` |
| Staff | `/staff/:staffId` |
| Schedule | `/schedule/:weekId` |
| Training | `/training/:courseId` |
| Report | `/reports/:reportId` |
| Role | `/roles/:roleId` |
| Integration | `/integration/:connectorId` |

---

## 4. Cross-Module UX Links

| From | Button / Link | Goes To |
|---|---|---|
| Dashboard | View Branches | `/branches` |
| Dashboard | Open Tasks | `/tasks?status=open` |
| Dashboard | Review Alerts | `/issues?severity=critical` |
| Branch | Open Tasks | `/tasks?branch=:branchId` |
| Branch | View Reports | `/reports?branch=:branchId` |
| Branch | Create Task | Opens task drawer with branch prefilled |
| Branch | Inventory Alerts | `/psi/inventory?branch=:branchId&status=alert` |
| Branch | Inspection Score | `/inspection?branch=:branchId` |
| Issue | Create Corrective Task | Opens task drawer with issue linked |
| Inspection | Create Corrective Task | Opens task drawer with inspection item linked |
| Procurement | Mark Received | `/psi/receiving/new?po=:poId` |
| Supplier | Create PO | `/psi/procurement/new?supplier=:supplierId` |
| Inventory | Create Purchase Request | `/psi/procurement/new?sku=:sku` |
| Staff | View Schedule | `/schedule?staff=:staffId` |
| Schedule | Assign Staff | Opens staff assignment modal |
| Training | Assign Staff | Opens staff assignment modal |
| Report | Open Dashboard | `/reports/:reportId` |
| Role | Assign Users | Opens user assignment modal |
| Integration | View Logs | `/integration/:connectorId?tab=logs` |

---

## 5. Required Interaction Components

| Component | Used By | UX |
|---|---|---|
| Drawer Form | Add/Create/Edit | Slide from right, validate form, save, toast |
| Confirmation Modal | Approve/Reject/Delete/Deactivate | Confirm before risky action |
| Detail Panel | Table row selection | Shows selected record |
| Right Rail | All major modules | Pending actions, recent activity, alerts |
| Toast | All actions | Success/error feedback |
| Command Palette | Search | Opens global search results |
| Table Row Select | Master table pages | Highlights row and updates detail panel |
| Tabs | Detail/workspace pages | Switch visible content |
| Filter Row | All list pages | Updates table and KPI |
| Empty State | No data | Clear next action button |
| Error State | Failed load/action | Retry button |
| Loading State | Async actions | Spinner/skeleton/progress |

---

## 6. Button Behavior Contract

No dead buttons.

| Button Type | Behavior |
|---|---|
| Add / New | Opens drawer form |
| Edit | Opens drawer with existing data |
| Save | Validates, loading, success toast, updates UI |
| Cancel | Closes modal/drawer without changes |
| Export | Loading, success toast |
| View Reports | Navigate to Reports with context |
| Open Tasks | Navigate to Tasks with context |
| Open Detail | Navigate to detail page |
| Approve | Confirmation modal, status update |
| Reject | Reason modal, status update |
| Assign | Opens assignment modal |
| Reassign | Opens assignment modal |
| Resolve | Confirmation modal, status update |
| Upload | Opens file/photo upload modal |
| Test Connection | Loading, success/error result |
| Sync Now | Loading, sync status update |
| Theme Switch | Updates app theme |
| Language Switch | Updates UI language |
