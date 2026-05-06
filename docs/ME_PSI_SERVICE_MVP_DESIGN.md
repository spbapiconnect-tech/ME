# ME PSI Service MVP Design

## Purpose
- Start the first real business cluster foundation.
- Define read-only PSI service/repository/page-data boundaries.
- Keep UI mock-to-real ready.
- Avoid direct database/API coupling.

## Current Status
- Read-only only.
- Mock repository only.
- No real database.
- No real API.
- No write actions.
- No approval workflow or stock posting.
- No supplier portal or POS integration.

## Architecture
PSI DTO
→ PSI Mock Repository
→ PSI Service Layer
→ PSI Page Data Helper
→ PSI Display Adapter
→ PSI Read-only UI Pages
→ Future API Repository
→ Future Database

## Modules
- Procurement
- Supplier
- Inventory

## Future Migration
- Add API repository.
- Add backend DTO mapping.
- Add permission guard.
- Add audit writer.
- Add workflow trigger.
- Add notification adapter.
- Add real task creation later.
- Add real stock movement engine later.


## ME PSI Action Draft Placeholders (v0.7.1)

- Add `/psi/actions` and `/psi/actions/[actionKey]` as metadata-only action draft/form preview routes.
- Add PSI action draft contracts in `types/psi/actions.ts` and `config/psi/action-drafts.ts`.
- Add UI components under `components/psi/actions/` and helper utilities in `lib/psi-actions.ts`.
- Scope remains placeholder-only: no real submit, no write service/repository method, no database/API, no approval workflow, no stock posting, no supplier portal, no task creation, and no workflow/notification execution.


## ME PSI Detail / Issue / Timeline Placeholder (v0.7.2)

- Add PSI detail placeholder sections: summary header, key fields, lifecycle strip, timeline, linked records, insights, related actions, related tasks, source/mock notice.
- Add `/psi/issues` combined issue placeholder route for procurement/supplier/inventory issue previews.
- Add workspace issue preview badges for status/priority/source/related-action/lifecycle placeholder context.
- Keep all behaviors read-only and preview-only.
- No real status transition, issue update, audit write, task creation, workflow trigger, notification sending, database/API/backend/middleware/session integration.

## ME PSI Report Widget Connection (v0.7.3)
- Add PSI report preview DTOs under `types/psi/reports.ts`.
- Add PSI report adapter and page-data bridge for `/reports` preview panel.
- Scope remains read-only mock preview with no BI/chart/SQL/database/API/backend.
