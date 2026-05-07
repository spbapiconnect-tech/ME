# ME Branch Context Architecture

## Purpose

Branch is the context layer for ME.

It connects:

- business workspace
- branch detail
- PSI
- staff / schedule
- inspection / issues
- reports / finance
- roles / access

## Current Route Surface

- `/branches`
- `/branches/[branchKey]`

## Current Implementation Reference

- config: `config/branches.ts`
- types: `types/branch-context.ts`
- helpers: `lib/branch-context.ts`
- UI: `components/branches/*`

## Product Rule

Branch context must be visible in the customer-facing product UI, but branch logic must stay separate from:

- permission enforcement
- tenant switching runtime
- database connection
- workflow execution

## Current Backend Status

This layer remains planning-only for live backend behavior:

- No real database
- No real API
- No implementation is included yet for branch persistence, branch access control, or tenant switching

## Future Direction

Branch context should eventually drive:

- scoped navigation
- scoped metrics
- scoped staffing
- scoped inventory and procurement
- scoped inspections and issues
- scoped reporting and finance review

But those capabilities must be implemented through proper data, permission, and API boundaries.
