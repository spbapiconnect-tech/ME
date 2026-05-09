# UI Tasks Legacy Cleanup Audit

Latest stable reference point:

- `7a3c488 ui: use unified business workspace homepage`

## Purpose

This note closes the P1 `/tasks` UI unification review.

The goal was to determine whether `/tasks` needs immediate UI migration before manual UI testing.

## Result

`/tasks` does not need immediate UI migration.

The active route files already use the unified ME shell pattern:

- `app/tasks/page.tsx`
- `app/tasks/[taskId]/page.tsx`
- `components/tasks/task-engine-page.tsx`
- `components/tasks/task-detail-page.tsx`

Confirmed unified components:

- `MeDashboardShell`
- `MePageHeader`
- `MeActionBar`
- `MeDataTable`
- `MeDetailWorkspace`
- `MeRecordSummary`
- `MeRightRail`
- `MeStatusTimeline`
- `MeTabs`
- `MeWorkspaceSection`

## Legacy Components Found

The following older task components still contain legacy CSS class patterns:

- `components/tasks/task-card.tsx`
- `components/tasks/task-board.tsx`
- `components/tasks/task-source-card.tsx`
- `components/tasks/task-stats-row.tsx`
- `components/tasks/task-list.tsx`
- `components/tasks/task-detail-panel.tsx`

Legacy class examples:

- `task-card`
- `task-board`
- `module-chip`
- `me-panel-card`
- `template-kpi-grid`

## Usage Finding

The active `/tasks` and `/tasks/[taskId]` routes do not directly use those legacy components.

`TaskCard` is referenced by `TaskBoard` and `TaskList`, but the active route uses `TaskEnginePage`.

Therefore, these legacy components should not block P1 UI unification.

## Decision

Status:

- `/tasks`: accepted for P1 manual UI walkthrough
- `/tasks/[taskId]`: accepted for P1 manual UI walkthrough
- legacy task components: defer cleanup

## Future Cleanup

A later cleanup pass can either:

1. migrate unused legacy task components to shared `Card` / `Badge` / `MeWorkspaceSection` patterns, or
2. remove them if no route imports them.

Do not do that during P1 visual unification unless they become active route dependencies.

## Boundary

This audit does not add:

- UI implementation changes
- API calls
- DB writes
- auth/session
- workflow execution
- notification sending
- browser automation
- CI
