# ME Real Product Roadmap

## Purpose

This roadmap locks the product direction for **ME Branch ERP** as a real restaurant company operating system.

ME is not a feature sandbox or design playground. It is a customer-facing B-end platform for branch operations, HR, scheduling, tasking, inspection, training, sales, inventory, procurement, supplier management, finance, settings, and integration.

The roadmap exists to prevent random product drift and to keep UI, data, formula, rules, permission, and API work moving in the correct order.

## Current Governance Position

The current repository already has:

- a shared B-end shell
- module-driven navigation
- reusable page templates
- module registry metadata
- data / formula / brain / permission metadata
- UI-only operational pages

The current task belongs to:

## Phase 1 — Final B-End UI governance and production UI cleanup

After this phase:

- no more random UI exploration should happen
- no major page should regress into a marketing dashboard or wireframe board
- future UI changes must follow:
  - [ME_UI_METRICS.md](./ME_UI_METRICS.md)
  - [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
  - [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
  - [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
  - [ME_MAINTENANCE_GUIDE.md](./ME_MAINTENANCE_GUIDE.md)

---

## Phase 0 — Foundation

### Goal

Establish the technical and structural base for the product.

### Scope

- Next.js application shell
- shared layout primitives
- shared navigation config
- route scaffolding
- docs baseline
- module registry baseline
- mock/read-only page-data boundary

### Acceptance

- app boots and builds
- shared shell exists
- navigation is config-driven
- reusable UI primitives exist
- modules are not scattered ad hoc across pages

---

## Phase 1 — Final B-End UI System

### Goal

Lock the visual and structural direction so ME looks like a real restaurant ERP / CRM product before backend integration starts.

### Scope

- customer-facing B-end shell
- realistic sidebar and topbar IA
- dashboard workspace
- list workspace
- detail workspace
- report workspace
- settings workspace
- realistic major record detail pages
- desktop / tablet / mobile behavior
- wording cleanup for customer-visible operational surfaces
- UI governance documentation

### Acceptance

- major pages look like real B-end software
- detail pages use breadcrumb, title, status, actions, tabs, sections, tables, and right rail
- customer-visible UI avoids demo/develop/internal wording
- layout metrics and page templates are documented and stable
- future contributors have clear source-of-truth docs

---

## Phase 2 — Restaurant Module Coverage

### Goal

Cover the full restaurant company module surface in the UI and architecture metadata.

### Scope

- dashboard
- branches
- inspection
- issues
- tasks
- staff / HR
- schedule
- training / education
- roles / access
- procurement
- suppliers
- inventory
- receiving
- SOP / recipes
- expiry / labels
- POS / reports
- finance / costing
- settings / integration

### Acceptance

- each module has a module key
- each module has a route
- each module belongs to a navigation group
- each module chooses an approved page template
- each module has data / permission / API boundary metadata

---

## Phase 3 — Architecture Separation

### Goal

Enforce separation between UI, data metadata, formula metadata, brain/rules metadata, permissions, and API boundaries.

### Scope

- module config hardening
- data-table metadata definitions
- formula catalog definitions
- rules/brain catalog definitions
- permission catalog definitions
- repository boundary definitions
- tests that prevent layer mixing

### Acceptance

- no formulas in React UI
- no permission decisions inside buttons
- no workflow execution inside pages
- no direct API coupling in page components

---

## Phase 4 — Mock Data Cleanup

### Goal

Move scattered sample values toward structured page-data and metadata boundaries.

### Scope

- consolidate page-level mock records
- reduce page-local hardcoded business values
- align mock records with future entities
- improve empty / loading / partial-data behavior

### Acceptance

- mock values are mostly sourced through config or page-data helpers
- components receive props instead of owning business records

---

## Phase 5 — Real Database Schema

### Goal

Define the real backend schema after UI and metadata boundaries are stable.

### Scope

- entity model
- relationships
- audit requirements
- attachment requirements
- branch scoping
- operational history design

### Acceptance

- schema supports approved modules and page templates
- schema maps cleanly to the UI surface model

---

## Phase 6 — Read-only API

### Goal

Introduce repository-backed read surfaces first.

### Scope

- read endpoints
- repository layer
- service layer
- page-data adapters
- loading / error / empty states

### Acceptance

- major pages can render from real data without shell rewrites
- page components remain backend-agnostic

---

## Phase 7 — Auth / Permission

### Goal

Add identity and permission boundaries after read surfaces are stable.

### Scope

- auth/session
- permission mapping
- route protection
- action visibility
- audit attribution

### Acceptance

- permissions are enforced through dedicated boundary layers
- UI components do not own permission logic

---

## Phase 8 — Write Actions

### Goal

Enable controlled operational writes after auth and permissions are stable.

### Scope

- create / edit flows
- approval submissions
- status transitions
- attachments
- exports

### Acceptance

- write actions use approved APIs and repositories
- operational writes are auditable

---

## Phase 9 — Formula / Brain / Workflow

### Goal

Introduce real calculations, suggestions, and workflow automation only after the product data model is stable.

### Scope

- formula engine
- rules engine
- workflow orchestration
- task suggestions
- alerting logic
- operational scoring

### Acceptance

- calculations are not embedded in pages
- rules and workflows are observable and testable

---

## Phase 10 — Multi-device Productization

### Goal

Ship ME as one shared desktop / tablet / mobile product.

### Scope

- desktop admin productization
- manager tablet optimization
- mobile staff workflow optimization
- release QA
- customer-facing polish
- integration readiness

### Acceptance

- major workflows adapt cleanly across device classes
- customer-facing operational pages remain consistent
- documentation, QA, and release checks are complete

---

## Governance Rules For All Future Phases

- UI work follows [DESIGN.md](./DESIGN.md)
- layout and density follow [ME_UI_METRICS.md](./ME_UI_METRICS.md)
- visual style follows [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
- page structure follows [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
- module growth follows [ME_MODULE_ARCHITECTURE.md](./ME_MODULE_ARCHITECTURE.md)
- maintenance and release flow follow [ME_MAINTENANCE_GUIDE.md](./ME_MAINTENANCE_GUIDE.md)

Current priority is still Phase 1 quality: customer-facing B-end UI realism before backend connection.
