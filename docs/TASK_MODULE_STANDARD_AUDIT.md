# Task Module Standard Audit

This document records the current standard achieved by the Task module.

The Task module now follows the Branch module standard while preserving its existing service, repository, mock data, and action contract foundation.

## Current Stable Commit

Latest completed milestone:

- bf0385e fix: add min width guards to detail workspace

Validation:

- npm run build passed
- npm test passed
- 293 tests passed

## Task Module Responsibilities

The Task module is responsible for:

- task queue overview
- task KPI preview
- task operation workspace
- task detail workspace
- task timeline review
- task related records
- task evidence and notes
- task action entry points
- cross-module task linkage
- task service and repository boundary
- task action contract metadata

## Current Route Structure

| Route | Purpose |
|---|---|
| /tasks | Task engine / task queue workspace |
| /tasks/[taskId] | Task detail workspace |

## Current File Roles

| File | Role |
|---|---|
| app/tasks/page.tsx | Task engine route |
| app/tasks/[taskId]/page.tsx | Task detail route |
| components/tasks/task-engine-page.tsx | Task queue UI, language wiring, task overview |
| components/tasks/task-detail-page.tsx | Task detail UI, language wiring, record detail |
| config/task-language-copy.ts | Task en/zh UI copy source |
| config/actions/task-actions.ts | Task action contracts |
| data/tasks/task-records.ts | Local task records with zh/en content |
| lib/tasks.ts | Task helper boundary |
| lib/page-data/task-page-data.ts | Task page data boundary |
| lib/services/task.service.ts | Task service boundary |
| lib/repositories/mock/task.repository.ts | Mock task repository |

## Completed Standards

### 1. Language System

Completed:

- Task module has its own language copy map.
- English is the default fallback.
- Chinese mode uses zh labels.
- TaskEnginePage uses task-language-copy.
- TaskDetailPage uses task-language-copy.
- Task record title and description are locale-aware.
- Linked record labels are locale-aware.
- Timeline title and description are locale-aware.
- Evidence labels are locale-aware.
- Page header copy is localized.
- Action bar copy is localized.
- KPI labels are localized.
- Tabs are localized.
- Table columns are localized.
- Detail field labels are localized.
- Right rail copy is localized.

Reference file:

- config/task-language-copy.ts

### 2. Existing zh/en Task Data Preserved

Completed:

- data/tasks/task-records.ts remains the task mock record source.
- Existing zh/en fields are preserved.
- Page components now read localized record text instead of always using `.en`.

Localized data fields used:

- task.title.zh / task.title.en
- task.description.zh / task.description.en
- linkedRecords[].label.zh / en
- timeline[].title.zh / en
- timeline[].description.zh / en
- evidence[].label.zh / en

### 3. Service / Repository Boundary Preserved

Completed:

- Existing service/repository pattern remains intact.
- Task pages still receive page data through the existing data flow.
- No real API write logic was added.
- No database logic was added.
- No fetch or axios was added.
- No workflow execution was added.

Reference files:

- lib/services/task.service.ts
- lib/repositories/mock/task.repository.ts
- lib/page-data/task-page-data.ts

### 4. Action Contract Layer Preserved

Completed:

- Existing task action contracts remain the source of task action metadata.
- No duplicate action contract map was created.
- Placeholder actions remain metadata-only.
- Real task assignment, closing, export, notification, workflow, and audit execution are not implemented.

Reference file:

- config/actions/task-actions.ts

Current task action contracts include:

- openTaskEngine
- openTaskDetail
- assignTask
- closeTask
- exportTasksPlaceholder

### 5. Responsive Layout

Completed:

- Task KPI grid responds from mobile to desktop.
- Action bar uses wrapping layout.
- Data tables use horizontal overflow protection.
- Detail tabs use horizontal overflow protection.
- Detail workspace now includes min-width guards.
- Shared MeDetailWorkspace layout is safer for long tables, timelines, and text.

Reference files:

- components/layout/me-action-bar.tsx
- components/layout/me-data-table.tsx
- components/layout/me-tabs.tsx
- components/layout/me-detail-workspace.tsx

### 6. Client Component Boundary

Completed:

- TaskEnginePage is marked as a client component because it reads the UI preference store.
- TaskDetailPage is marked as a client component because it reads the UI preference store.
- Build passes after client boundary correction.

## Known Safe Remaining Content

Some English-like values can remain because they are mock records, codes, technical values, or placeholder metadata.

Examples:

- task IDs
- route paths
- source module keys
- status keys
- owner names
- store names
- evidence values
- placeholder route hrefs
- class names
- import paths

These should not be blindly translated inside page components.

## Do Not Do

Do not:

- rebuild the Task module from zero
- remove the current service/repository boundary
- duplicate task action contracts
- hardcode bilingual text inside JSX
- use English display labels as logic keys
- add real API writes
- add database mutation logic
- trigger real assignment
- trigger real task closing
- trigger notifications
- trigger workflow execution
- trigger audit capture from the UI

## Rules for Future Task Work

Future Task work should follow this order:

1. Keep service/repository boundary intact.
2. Keep UI copy inside config/task-language-copy.ts.
3. Keep task records inside data/tasks/task-records.ts or a future repository.
4. Use locale-aware text helpers for zh/en record fields.
5. Keep action behavior metadata-only until API boundaries are ready.
6. Run npm run build.
7. Run npm test.
8. Commit only after both pass.

## Recommended Next Improvements

Recommended next steps:

1. Add tests for task language copy completeness.
2. Add tests to prevent `.title.en` and `.description.en` hardcoding inside task page components.
3. Add task action preview UI using existing action contracts.
4. Add task filters after language and layout are stable.
5. Add task status mapping for localized status display.
6. Add final responsive browser screenshots for mobile, tablet, and desktop.

## Task Module Standard Status

Status: reference module ready

The Task module can now be used as the second standardized module pattern after Branch.
