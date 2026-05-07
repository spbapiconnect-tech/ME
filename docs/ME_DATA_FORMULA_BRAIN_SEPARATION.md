# ME Data / Formula / Brain Separation

## Purpose

This document defines the required separation between UI, data metadata, formula metadata, brain/rules metadata, permissions, and API boundaries in **ME Branch ERP**.

The goal is to stop ME from becoming one tangled React application.

## Required Layers

### 1. UI Layer

Location:

- `app/*`
- `components/*`

Owns:

- shell rendering
- page rendering
- tables
- tabs
- headers
- action bars
- right rails

Must not own:

- formulas
- permission enforcement
- workflow execution
- direct API calls
- direct database clients

### 2. Module Config Layer

Location:

- `config/restaurant-modules.ts`
- `config/navigation.ts`

Owns:

- which modules exist
- routing
- group mapping
- page template selection
- high-level layer requirements

### 3. Data Metadata Layer

Location:

- `config/restaurant-data-model.ts`

Owns:

- entities
- dimensions
- fields
- relationships
- table surfaces
- detail surfaces

Restaurant examples:

- schedule coverage depends on `schedules`, `shift_assignments`, `staff_availability`
- stock risk depends on `inventory_stock`, `stock_movements`, `procurement_requests`
- expiry risk depends on `expiry_labels`, `inventory_stock`, `branch`
- branch anomaly depends on `branch`, `report_snapshots`, `activity_events`

### 4. Formula Metadata Layer

Location:

- `config/restaurant-formulas.ts`

Owns planning metadata for:

- stock risk
- expiry days remaining
- reorder suggestion
- schedule coverage
- training gap
- supplier score
- finance receivable risk

Formula metadata can define:

- key
- inputs
- outputs
- notes
- future execution layer

It must not execute inside UI.

### 5. Brain / Rules Layer

Location:

- `config/restaurant-brain.ts`

Owns planning metadata for:

- branch anomaly follow-up
- low stock suggestion
- procurement approval suggestion
- expiry watch
- training gap recommendation
- inspection failure suggestion
- supplier issue escalation

This layer describes future intelligent behavior. It does not execute it.

### 6. Permission Layer

Location:

- `config/restaurant-permissions.ts`

Owns:

- future access scopes
- role ownership
- module permission groupings

### 7. API / Repository Boundary

Location:

- repository / service / page-data boundaries
- static API boundary docs/config

Owns:

- read contracts
- write contracts
- repository responsibility
- data mapping strategy

## Restaurant Examples

### Schedule coverage

- UI shows the coverage status
- data layer defines staff, availability, shift, and assignment entities
- formula layer defines the coverage gap calculation
- brain layer may later suggest manager follow-up
- permission layer defines who can manage schedules
- API layer later provides read/write schedule endpoints

### Stock risk

- UI shows the low-stock risk state
- data layer defines stock and movement records
- formula layer defines stock risk scoring
- brain layer may suggest purchase follow-up

### Procurement approval

- UI shows request state and approval-related sections
- formula layer may later compute urgency or impact
- brain layer may later suggest who should review
- workflow execution must not exist in the page layer

## Anti-patterns

These are not allowed:

- Formula inside component
- Permission in button
- Workflow in page
- API in visual component
- Mock data scattered in multiple pages

More specifically:

- do not calculate schedule coverage inside JSX
- do not hide actions by embedding role logic in UI controls
- do not trigger approval logic inside a page component
- do not call backend clients inside render-layer components
- do not paste the same business record into multiple routes

## Required Flow

Preferred future path:

```text
data metadata
-> formula metadata
-> brain/rules metadata
-> repository/service/page-data boundary
-> UI props
-> visual rendering
```

If a future implementation bypasses this sequence, it should be treated as an architecture violation.
