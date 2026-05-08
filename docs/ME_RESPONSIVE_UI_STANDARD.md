# ME Responsive UI Standard

This document controls how ME ERP pages adapt across desktop, tablet, and mobile.

ME must support three main screen classes:

- Desktop: 1200px and above
- Tablet: 768px to 1199px
- Mobile: below 768px

The desktop layout must not simply shrink into mobile. Each screen size needs its own layout behavior.

---

## 1. Core Rule

Every ME module page must support:

1. Desktop management view
2. Tablet operations view
3. Mobile quick-action view

Desktop is for full control.
Tablet is for manager floor operation.
Mobile is for quick check, action, and detail review.

---

## 2. Desktop Layout

Desktop layout:

- left sidebar visible
- topbar visible
- page header with full actions
- KPI row visible
- full data table visible
- detail panel below table
- right rail beside detail panel

Recommended width: 1200px+

Desktop structure:

- Sidebar + Main Workspace
- Header
- KPI Row
- Filter Row
- Full Data Table
- Detail Panel + Right Rail
- Lower Summary Cards

---

## 3. Tablet Layout

Tablet layout:

- sidebar should become compact or collapsible
- KPI row becomes 2 to 4 columns
- table becomes compact
- fewer columns are shown
- right rail moves below or stacks under detail panel
- action buttons may collapse into More menu

Recommended width: 768px - 1199px.

Tablet table should show only core columns.

Example Branch tablet columns:

- Branch
- Status
- Sales
- Tasks
- Alerts
- Last Update
- Action

---

## 4. Mobile Layout

Mobile layout must not use desktop table.

Mobile layout:

- sidebar hidden
- mobile topbar visible
- search visible
- KPI summary compact
- main table becomes card list
- detail opens in sheet, drawer, or separate detail route
- secondary actions move into More menu

Recommended width: below 768px.

Mobile branch card example:

KCH Central Kitchen | Operating
RM 28,750 | 5 tasks · 2 alerts
Chin Ling · Kuching | 10:15

---

## 5. Sidebar Behavior

Desktop:

- full sidebar visible

Tablet:

- compact sidebar or collapsible sidebar

Mobile:

- sidebar hidden
- navigation should use drawer, bottom nav, or route-based menu

Do not allow sidebar to consume mobile screen width.

---

## 6. Topbar Behavior

Desktop:

- search
- branch selector
- date selector
- theme/language/user controls

Tablet:

- search can be shorter
- controls can collapse

Mobile:

- compact search
- icon controls only
- secondary controls inside menu

---

## 7. KPI Behavior

Desktop:

- 6 to 8 KPI cards per row

Tablet:

- 2 to 4 columns

Mobile:

- 2 columns or horizontal scroll
- show only most important KPI by default

KPI cards must not create a very long mobile page.

---

## 8. Data Table Behavior

Desktop:

- full data table

Tablet:

- compact table with fewer columns

Mobile:

- card list
- no full table by default

Rows must remain fixed height.
Long text must truncate.
Full detail belongs in detail panel or sheet.

---

## 9. Detail Panel Behavior

Desktop:

- detail panel visible below table

Tablet:

- detail panel visible but stacked

Mobile:

- detail opens in sheet, drawer, or detail route

Do not force full detail content into table rows.

---

## 10. Right Rail Behavior

Desktop:

- right rail beside detail panel

Tablet:

- right rail stacks below detail panel

Mobile:

- right rail sections become cards or are hidden behind tabs

Right rail sections:

1. Insight
2. Top Alerts
3. Quick Links
4. Recent Activity

---

## 11. Action Button Behavior

Desktop:

- show primary and secondary actions

Tablet:

- show primary actions
- move secondary actions into More

Mobile:

- show one primary action
- all secondary actions go into More menu

Example desktop actions:

Add Branch | Export | View Reports | Open Tasks | More

Example mobile actions:

Add | More

---

## 12. Branch Page Responsive Standard

The Branch page is the reference implementation for future module pages.

Desktop:

- full branch table
- detail + right rail

Tablet:

- compact branch table
- detail below
- right rail below detail

Mobile:

- branch card list
- branch detail in sheet or detail route

---

## 13. Future Module Rule

All future major modules must follow this responsive model:

- Branches
- Staff
- Schedule
- Tasks
- Inventory
- Procurement
- Supplier
- Reports
- Roles & Permission
- Settings
- Integration

If a module needs a special mobile behavior, document it in the module design file.
