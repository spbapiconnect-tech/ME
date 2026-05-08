# Branch Action Contracts

This document defines the button and workflow contracts for the Branch Management module.

The goal is to prevent UI buttons from becoming isolated hard-coded actions. Every button should eventually map to a contract, permission, audit event, and API boundary.

## Current Scope

This is a planning and contract layer only.

It does not implement:

- real database writes
- live API calls
- real export file generation
- notification sending
- workflow execution
- permission enforcement runtime

## Action Layer Rule

Every Branch button should follow this structure:

UI button -> action contract -> permission check -> validation -> service/API boundary -> audit event -> optional notification

## Region Rule

Region values must not stay hard-coded inside the Branch page.

Future source of truth:

Settings / Master Data / Region Management

Branch records should reference:

branch.regionId

The UI should display the region name by resolving that ID from region master data.

## Branch Action Contracts

| Key | UI Label | Current Behavior | Future Behavior | Permission | Status |
|---|---|---|---|---|---|
| branch.create | Add Branch | Opens Add New Branch sheet | Create branch after validation | branch.write | contract-ready |
| branch.export | Export | Toast placeholder | Export CSV / Excel / PDF | branch.export | api-deferred |
| branch.viewReports | View Reports | Route to reports module | Route with branch / date / filter context | report.read | contract-ready |
| branch.openTasks | Open Tasks | Route to tasks module | Route with branch task context | task.read | contract-ready |
| branch.createTask | Create Task | Toast placeholder | Create task linked to branch | task.write | api-deferred |
| branch.import | Import Branches | More menu item | Import branch master data | branch.import | api-deferred |
| branch.batchEdit | Batch Edit | More menu item | Batch update selected branches | branch.write | api-deferred |
| branch.archive | Delete Archive | Destructive menu item | Archive branch safely | branch.archive | api-deferred |
| branch.filter.more | More Filters | Filter button UI | Advanced filter drawer | branch.read | contract-ready |
| branch.region.manage | Manage Regions | Local UI sample values | Region master data settings | settings.region.write | api-deferred |

## Branch Form Fields

| Field | Required | Source |
|---|---:|---|
| branchName | Yes | User input |
| branchCode | Yes | User input or future code rule |
| regionId | Yes | Region master data |
| managerId | No | Staff master data |
| phone | No | User input |
| address | No | User input |
| status | No | Default: preparation / active |

## Future API Boundary

Planned only:

- POST /api/branches
- POST /api/branches/export
- POST /api/tasks
- POST /api/branches/import
- PATCH /api/branches/batch
- POST /api/branches/archive
- POST /api/settings/regions

Do not wire live APIs until the service boundary and repository provider are ready.
