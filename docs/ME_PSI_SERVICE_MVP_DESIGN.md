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
