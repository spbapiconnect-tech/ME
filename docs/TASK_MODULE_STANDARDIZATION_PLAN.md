# Task Module Standardization Plan

This document defines the next cleanup and standardization path for the Tasks module.

The Branch module is the reference standard.

## Current Task Module Status

The Tasks module already has a working foundation.

Current route structure:

- app/tasks/page.tsx
- app/tasks/[taskId]/page.tsx

Current page components:

- components/tasks/task-engine-page.tsx
- components/tasks/task-detail-page.tsx

Current data and service boundary:

- data/tasks/task-records.ts
- lib/tasks.ts
- lib/page-data/task-page-data.ts
- lib/services/task.service.ts
- lib/repositories/mock/task.repository.ts

Current action contracts:

- config/actions/task-actions.ts

## Standardization Direction

Tasks should follow the Branch module pattern, but it does not need to be rebuilt from zero.

Use this route:

1. Keep existing route/service/repository structure.
2. Add a task language copy map.
3. Connect TaskEnginePage to language copy.
4. Connect TaskDetailPage to language copy.
5. Use existing zh/en task record data instead of hardcoded `.en` display only.
6. Keep task records in data/tasks/task-records.ts.
7. Keep service/repository boundary intact.
8. Add final audit doc after build/test passes.

## Key Issues Found

### 1. Hardcoded English UI Copy

TaskEnginePage still contains hardcoded English copy such as:

- Task Management
- Task operations workspace
- Task Context
- Current Focus
- Today’s Priorities
- Review Queue
- Open Branches
- Open Inspection
- Open PSI
- Export Queue
- Work Queue
- Selected Task
- Related Records
- Activity

TaskDetailPage also contains hardcoded English copy such as:

- Task record not available
- Task Status
- Follow-up
- Related Modules
- Complete
- Reassign
- Add Comment
- Escalate
- Back to Queue
- Task Overview
- Evidence and Notes
- Business Summary

### 2. Existing Task Records Already Support zh/en

data/tasks/task-records.ts already uses localized text fields:

- task.title.zh / task.title.en
- task.description.zh / task.description.en
- linkedRecords[].label.zh / en
- timeline[].title.zh / en
- timeline[].description.zh / en
- actions[].label.zh / en

This means the page should use locale-aware text resolution instead of always reading `.en`.

### 3. Action Contract Layer Already Exists

config/actions/task-actions.ts already contains task action contracts:

- openTaskEngine
- openTaskDetail
- assignTask
- closeTask
- exportTasksPlaceholder

Do not create a second action contract map unless future task-specific branch-style contracts are required.

## Target File Structure

Recommended new file:

- config/task-language-copy.ts

Keep existing files:

- data/tasks/task-records.ts
- config/actions/task-actions.ts
- lib/page-data/task-page-data.ts
- lib/services/task.service.ts
- lib/repositories/mock/task.repository.ts

## Task Language Copy Map Scope

The new task copy map should include:

### Page

- eyebrow
- title
- description
- notice
- empty title
- empty description

### Actions

- reviewQueue
- openBranches
- openInspection
- openPsi
- exportQueue
- complete
- reassign
- addComment
- escalate
- backToQueue
- openWorkspace

### KPI

- openTasks
- inProgress
- waitingReview
- overdue
- critical

### Tabs

- overview
- queue
- comments
- activity
- attachments
- relatedRecords
- evidence
- audit

### Fields

- task
- taskId
- title
- branch
- owner
- priority
- status
- module
- due
- updated
- created
- taskType
- sourceRecord
- sourceModule
- assignedTo
- currentBranch
- currentStatus
- dueDate
- record
- description
- route
- evidence
- type
- detail

### Right Rail

- taskContext
- currentFocus
- todaysPriorities
- taskStatus
- followUp
- relatedModules

## Implementation Phases

### L1 Plan

Create this plan document.

### L2 Language Copy

Create:

- config/task-language-copy.ts

No UI changes yet.

### L3 TaskEnginePage Language Wiring

Update:

- components/tasks/task-engine-page.tsx

Required changes:

- read locale from useUiPreferencesStore
- resolve copy with getTaskCopy(locale)
- replace hardcoded UI copy
- replace task.title.en with locale-aware title
- replace task.description.en with locale-aware description
- replace record.label.en with locale-aware label
- replace timeline title/description .en with locale-aware text

### L4 TaskDetailPage Language Wiring

Update:

- components/tasks/task-detail-page.tsx

Required changes:

- read locale from useUiPreferencesStore
- replace hardcoded UI copy
- replace task.title.en / task.description.en
- replace record.label.en
- replace evidence label
- replace timeline title/description

### L5 Responsive / Mobile Review

Inspect:

- KPI row behavior
- action bar wrapping
- table overflow
- detail layout
- right rail behavior
- mobile tab spacing

Do not redesign until language is stable.

### L6 Audit Doc

Create:

- docs/TASK_MODULE_STANDARD_AUDIT.md

Only after:

- npm run build passes
- npm test passes

## Do Not Do

Do not:

- rebuild the whole task page from zero
- remove the current service/repository boundary
- duplicate task action contracts
- hardcode bilingual text inside JSX
- use English labels as logic keys
- connect real task writes
- add database/API mutation logic
- trigger real assignment, closing, notifications, workflow, or audit capture

## Validation Rule

Every phase must run:

- npm run build
- npm test

Commit only after both pass.
