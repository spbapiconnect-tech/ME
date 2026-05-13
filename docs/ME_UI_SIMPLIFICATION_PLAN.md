# ME UI Simplification Plan

## Current Problem

ME now has strong manager-side foundations, but outlet staff experience is still too close to backend module navigation.

Outlet staff should not need to understand:

- SOP & Training module
- Outlet Execution Command Center
- Store Inspection manager review
- Incident Center
- FEFO review
- Runtime links
- Rule runner

They need a simple staff app.

## Target Split

### Manager Workspace

For supervisors and HQ.

Pages:

- /branches
- /tasks
- /inspection
- /issues
- /expiry
- /sop
- /psi/*

### Outlet Staff App

For outlet staff.

Page:

- /outlet

Sections:

- Today
- Training
- SOP Library
- Inspection
- Proof Log

## Phase 1 — Stop Backend Jumping

Current /outlet cards should not route directly to manager modules.

Replace direct links with internal staff panels:

- SOP card -> Staff SOP Reading View
- Task card -> Staff Task Execution View
- Inspection card -> Staff Checklist Runner
- Incident card -> Staff Rework Request
- Proof card -> Staff Proof Timeline

## Phase 2 — Staff Reading Views

Build internal panels in /outlet:

### Staff SOP Reading View

- page-by-page SOP
- image/video/PDF preview
- checklist
- mark read
- acknowledge

### Staff Task Execution View

- task instruction
- step-by-step checklist
- upload proof
- submit
- review status

### Staff Inspection Runner

- checklist item
- pass/fail
- comment
- upload proof
- submit

### Staff Rework Request

- what failed
- what to fix
- proof required
- upload new proof
- submit again

### Staff Proof Timeline

- submitted
- waiting review
- accepted/rejected
- manager comment
- rework required

## Phase 3 — Simplify Visual Density

Outlet UI should:

- use larger cards
- fewer badges
- one primary action per card
- no manager jargon
- no dense KPI grid
- no backend module names

## Phase 4 — Manager UI Design Alignment

Manager pages should keep dashboards, queues, risk scores, and linked records, but follow consistent layout:

- top KPI row
- left queue
- center workspace
- right detail
- compact filters
- consistent card density

## Phase 5 — Add DESIGN.md Enforcement

Future UI changes must check DESIGN.md before coding.

No new page should mix outlet staff UX with manager workspace UX.
