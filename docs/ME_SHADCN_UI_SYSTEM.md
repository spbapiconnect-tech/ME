# ME shadcn UI System

ME uses shadcn/ui as the single component foundation.

This document controls:
- shadcn component standard
- Bright / Dark / Moon themes
- English / Chinese language support
- ERP page layout
- Data table alignment
- Button / Input / Select / Card / Table / Badge standards
- Future module UI consistency

## Core Rule

Codex must not freely redesign UI.

Codex may:
- implement reusable shadcn-based components
- apply existing patterns to routes
- fix build/test errors
- wire interactions

Codex must not:
- invent new visual systems
- create random page-specific buttons/selects/tables
- replace shadcn with custom figma-ui
- expose develop/shell/governance wording to customers

## Theme Modes

ME supports:
- Bright
- Dark
- Moon

Theme must be stored in localStorage and applied globally through class or data-theme.

## Language Modes

ME supports:
- English
- Chinese

Language must be stored in localStorage and switch common labels across the ERP UI.

## Required shadcn Components

Use shadcn/ui only for:
- Button
- Input
- Select
- Card
- Table
- Tabs
- Badge
- Dialog
- Sheet / Drawer
- Dropdown Menu
- Checkbox
- Sonner / Toast
- Sidebar
- Breadcrumb
- Avatar
- Tooltip
- Skeleton
- Alert

## ERP Page Template

Every module must use:

1. ERP Shell
2. Page Header
3. KPI Grid
4. Filter Bar
5. Main Data Table
6. Selected Detail Panel
7. Right Rail
8. Related records / timeline when needed

## Data Table Alignment Standard

| Column Type | Alignment | Style |
|---|---:|---|
| id / code | left | blue clickable |
| name / title | left | medium / semibold |
| text | left | normal |
| owner / manager / staff | left | normal |
| amount / currency | right | tabular numbers |
| number / quantity / count | right | tabular numbers |
| percentage / score | right | tabular numbers |
| status / priority / badge | center | badge |
| date / time | right | muted |
| action | right / center | button/menu |

Table rules:
- header height: 40–44px
- row height: 44–48px
- header text: 12px muted
- cell text: 13–14px
- padding: px-4
- border: very light gray
- hover row: very light blue/gray
- selected row: very light blue
- no heavy black row lines
- no random table style per module

## Button Standard

Primary:
- blue background
- white text
- h-10
- rounded-xl
- text-sm
- font-medium
- subtle shadow

Outline / Secondary:
- white background
- light border
- slate text
- hover soft gray
- h-10
- rounded-xl
- text-sm
- font-medium

Ghost:
- transparent background
- hover muted
- no heavy border

## Input / Select Standard

Input and Select must match Button:
- h-10
- rounded-xl
- light border
- text-sm
- muted placeholder
- soft blue focus ring
- no black outline

Select dropdown:
- opaque background
- high z-index
- rounded-xl
- light border
- soft shadow
- selected item subtle background
- no transparent dropdown
- no overlap bugs

## Sidebar Navigation

ME Branch ERP  
Restaurant Operations

Dashboard

Store Operations:
- Branches
- Inspection
- Issues
- Tasks

PSI:
- Overview
- Procurement
- Supplier
- Inventory
- Receiving

Workforce:
- Staff
- Schedule
- Training

Business:
- Reports
- Roles & Permission

System:
- Settings
- Integration

## Forbidden Customer-Facing Words

Never show:
- DEVELOP
- Guardrail
- Current release scope
- Context workspace
- Business Workspace
- CRM / ERP Shell
- Config-driven navigation
- Live Shell
- Workspace Status
- Routing source
- shared navigation config
- linked review
- module focus
- shell updated
- Mock
- Demo
- Placeholder
- Read-only
- Dev
- Internal only
- Prototype
- Sample
- Fake data

## Module Table Columns

Branches:
Branch Code | Branch Name | Region | Manager | Status | Today Sales | Open Tasks | Stock Alerts | Inspection | Last Update

Tasks:
Task ID | Task | Branch | Owner | Priority | Due | Status | Progress | Last Update

Issues:
Issue ID | Title | Branch | Severity | Category | Owner | SLA | Status | Last Update

Inspection:
Inspection ID | Branch | Type | Owner | Score | Failed Items | Status | Due Date | Last Update

Procurement:
PR / PO ID | Supplier | Branch | Requester | Amount | Status | Approval | Delivery Date | Last Update

Supplier:
Supplier Code | Supplier Name | Category | Contact | Status | Rating | Last Order | Delivery Score | Risk Level

Inventory:
SKU | Item Name | Category | Location | On Hand | Reorder Level | Available | Status | Last Movement

Receiving:
Receiving ID | PO ID | Supplier | Branch | Expected Date | Received Qty | Variance | Status

Staff:
Staff ID | Name | Branch | Role | Status | Today Shift | Attendance | Training | Last Update

Reports:
Report Name | Category | Data Source | Frequency | Last Generated | Status

Roles:
Role | Users | Branch Access | Module Access | Status | Last Updated

Integration:
Connector | Type | Status | Last Sync | Response Time | Owner | Environment
