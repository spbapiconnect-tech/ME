# ME Module Architecture

## Purpose

This document defines how modules must be structured in **ME Branch ERP**.

ME is a module-driven restaurant operating system. New modules must be added through governed metadata and approved page templates, not by scattering one-off UI pages across the repository.

## Required Module Definition

Each module must define:

- module key
- route
- navigation group
- display name
- page template
- data surface
- table metadata
- detail metadata
- formula metadata if required
- brain/rules metadata if required
- permission metadata
- API boundary
- mobile/tablet behavior
- customer visibility level

## Required Module Metadata Fields

At minimum, each module should have:

```ts
type MeModuleDefinition = {
  key: string;
  route: string;
  navigationGroup: string;
  displayName: string;
  pageTemplate: string;
  customerVisibilityLevel: "customer-facing" | "admin-only" | "internal-admin";
  dataSurface: string[];
  tableMetadata: string[];
  detailMetadata: string[];
  formulaMetadata?: string[];
  brainRulesMetadata?: string[];
  permissionMetadata: string[];
  apiBoundary: string[];
  desktopBehavior: string;
  tabletBehavior: string;
  mobileBehavior: string;
};
```

## Source Files

Primary module sources:

- `config/restaurant-modules.ts`
- `config/navigation.ts`
- `config/restaurant-data-model.ts`
- `config/restaurant-formulas.ts`
- `config/restaurant-brain.ts`
- `config/restaurant-permissions.ts`

## Module Architecture Responsibilities

### Module registry

Owns:

- what modules exist
- where they route
- which group they belong to
- what template they use
- which future layers they require

### Navigation config

Owns:

- sidebar grouping
- order
- labels
- disabled or future items
- route-aware structure

### Data metadata

Owns:

- entities
- dimensions
- fields
- relationships
- table surfaces
- detail surfaces

### Formula metadata

Owns:

- calculation definitions
- inputs
- outputs
- execution notes

### Brain / rules metadata

Owns:

- trigger descriptions
- condition descriptions
- suggested actions
- workflow target references

### Permission metadata

Owns:

- scope keys
- module responsibility
- future role ownership

### API boundary

Owns:

- read endpoints
- write endpoints
- repository/service boundary contracts

## Approved Page Templates

Every module must choose from approved templates in [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md):

- dashboard workspace
- list workspace
- detail workspace
- report workspace
- settings workspace
- major record detail page
- mobile staff workflow page
- manager tablet workspace

## Hard Rules

- Never hardcode a module directly into the sidebar component.
- Never hardcode a formula into React UI.
- Never hardcode permission logic into a button component.
- Never mix mock data with UI rendering logic.
- Never connect a real API directly from a page component without a boundary.
- Never expose develop/internal configuration to customer UI.

## Additional Guardrails

- module labels should come from config, not duplicated route-local constants
- page templates should be selected before page implementation
- customer-facing language must stay aligned with [DESIGN.md](./DESIGN.md)
- mock values should move through page-data or config boundaries, not page-local JSX

## Module Example Matrix

Typical module expectations:

- `branches`
  - route: `/branches`
  - template: major record detail page
  - data surface: branch profile, operations status, issue links
- `staff`
  - route: `/staff`
  - template: list workspace + major record detail page
  - data surface: staff profile, role mapping, training status
- `schedule`
  - route: `/schedule`
  - template: list workspace
  - data surface: shifts, assignments, coverage
- `inventory`
  - route: `/psi/inventory`
  - template: major record detail page
  - data surface: stock, movement, expiry, supplier links
- `finance`
  - route: `/finance`
  - template: report workspace + detail workspace
  - data surface: costs, margin snapshots, supplier cost comparison

## Customer Visibility Rule

Each module must declare whether it is:

- customer-facing
- admin-only
- internal-admin

Customer-facing modules must never expose internal wording such as `mock`, `demo`, `placeholder`, `dev`, or implementation notes inside the visible UI.
