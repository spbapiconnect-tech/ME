# ME Design System

ME is an operations system with two clearly separated experiences:

1. Manager Workspace
2. Outlet Staff App

The system must never expose manager-level operational complexity to outlet staff.

---

## 1. Product Philosophy

ME should feel calm, structured, and operationally clear.

The interface should reduce decision fatigue.

Every screen must answer:

- What needs attention?
- What should I do next?
- What proof or review is required?
- What changed after I completed it?

Avoid making users understand internal module names before they can act.

---

## 2. Two UI Modes

### Manager Workspace

Used by owners, managers, supervisors, HQ, and operations leads.

Manager pages may show:

- KPI cards
- queues
- risk scores
- linked records
- audit history
- review panels
- escalation status
- module-level navigation
- multi-column dashboards

Manager pages include:

- Branch Control
- Outlet Execution Command Center
- Store Inspection
- Incident Center
- FEFO / Waste Control
- SOP & Training
- PSI modules

Manager workspace can be dense, but must remain organized.

### Outlet Staff App

Used by outlet staff.

Outlet staff pages must be simple, task-based, and action-first.

Outlet staff should not see backend module names like:

- Incident Center
- Store Operations Runtime
- Corrective Action Engine
- Rule Runner
- Audit Trail
- FEFO Review Logic

Outlet staff should see human language:

- Today
- Read
- Do Task
- Upload Proof
- Fix Again
- Waiting for Review
- Accepted
- Rejected
- Training
- SOP Library

---

## 3. Navigation Rules

### Manager Navigation

Manager navigation may use modules.

Allowed manager labels:

- Branch Control
- Outlet Execution
- Store Inspection
- Incident Center
- FEFO / Waste Control
- SOP & Training
- Reports
- PSI

### Outlet Navigation

Outlet navigation must be task-first.

Allowed outlet labels:

- Today
- Training
- SOP Library
- Inspection
- Proof Log

Do not route outlet staff into manager pages.

Bad:

- /outlet card opens /issues
- /outlet card opens /inspection manager review
- /outlet card opens /sop builder
- /outlet card opens /tasks command center

Good:

- /outlet opens internal reading view
- /outlet opens internal task execution view
- /outlet opens internal checklist runner
- /outlet opens internal proof status timeline

---

## 4. Layout Principles

### Manager Workspace Layout

Use structured multi-column layouts:

- Left: queue / board / list
- Center: work area
- Right: detail / preview / review
- Top: compact KPI row and filters

Cards may contain more data, but each card must have clear hierarchy.

### Outlet Staff Layout

Use mobile-first layout even on desktop.

Outlet UI should feel like a staff app:

- big cards
- clear status labels
- one primary action
- short descriptions
- minimal filters
- no dense KPI grid unless needed

Preferred outlet layout:

- Today summary
- Primary work card
- Training card
- Proof status card
- SOP search / library

---

## 5. Component Rules

### Cards

Manager cards can be compact and data-dense.

Outlet cards must have:

- title
- short instruction
- status
- one main button
- optional proof/review indicator

Avoid more than two buttons on outlet cards.

### Buttons

Use action verbs.

Good outlet button labels:

- Start
- Read SOP
- Continue
- Upload Proof
- Submit
- Fix Again
- Mark Read
- Acknowledge

Avoid abstract labels:

- Open Module
- View Record
- Create Runtime Link
- Transition Status

### Status

Status must be human-readable.

Good:

- Waiting for Review
- Accepted
- Rejected
- Need New Photo
- Due Today
- Overdue
- Done

Avoid internal status names unless manager-only.

---

## 6. SOP Rules

Manager SOP page is for creating, versioning, assigning, and generating templates.

Outlet SOP view is for reading.

Outlet SOP must render as:

- page-by-page reading
- image/video/PDF preview
- checklist
- acknowledgement button

Do not show builder controls to outlet staff.

---

## 7. Task Rules

Manager task page is command center.

Outlet task view is execution mode.

Outlet task must render as:

- instruction
- step-by-step list
- required proof
- upload media
- submit for review
- review status

Do not show manager queues, linked incident IDs, or backend source mapping unless hidden in advanced/debug.

---

## 8. Inspection Rules

Manager inspection page is for review and follow-up.

Outlet inspection page is checklist runner.

Outlet inspection must render as:

- checklist item
- pass/fail
- comment
- upload proof
- submit

Do not show risk score, incident suggestion, escalation, or manager review controls.

---

## 9. Incident / Rework Rules

Manager incident page is Incident Center.

Outlet incident view is Rework Request.

Outlet staff should see:

- what failed
- what to fix
- required proof
- deadline
- submit new proof

Avoid showing incident taxonomy, escalation logic, or SLA engine details.

---

## 10. Upload / Proof Rules

Upload components must support:

- image
- video
- PDF
- file metadata
- preview
- remove / replace

Proof flow should be:

- Upload
- Submit
- Waiting for Review
- Accepted / Rejected
- Fix Again

---

## 11. Visual Direction

ME uses a calm operational UI:

- clean neutral surface
- subtle borders
- controlled accent color
- soft rounded corners
- clear spacing
- low visual noise
- no childish decoration
- no overuse of colored badges

Manager pages may feel like a professional dashboard.

Outlet pages should feel like a simple guided app.

---

## 12. Do / Don't

Do:

- separate manager and outlet experiences
- use human action language
- keep outlet pages simple
- show one next action clearly
- use preview instead of raw filename
- use status timeline for proof/review

Don't:

- expose backend modules to staff
- make staff jump to manager pages
- show too many buttons on staff cards
- use generic CRUD labels
- show internal IDs as primary content
- use Dialog as full workspace
- over-pack outlet screens with KPI/cards
