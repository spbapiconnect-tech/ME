# ME API Boundary Planning

## Purpose

This document defines the future API boundary for ME without implementing API. It keeps the frontend aligned around service-layer contracts, DTO mapping, tenant scope, and audit requirements before backend work starts.

## API Boundary Rules

- UI calls service layer, not raw API directly.
- Service layer maps API DTO to display model or page data.
- API endpoints are placeholders until backend exists.
- All write actions should return audit metadata later.
- All APIs must be tenant-scoped later.
- All module actions require permission checks later.

## Future Endpoint Placeholders

### Procurement

- `GET /api/procurement/requests`
- `GET /api/procurement/requests/:id`
- `POST /api/procurement/requests`
- `POST /api/procurement/orders`
- `POST /api/procurement/receiving`
- `GET /api/procurement/issues`

### Supplier

- `GET /api/suppliers`
- `GET /api/suppliers/:id`
- `GET /api/suppliers/:id/products`
- `GET /api/suppliers/:id/quotations`
- `GET /api/suppliers/:id/issues`

### Inventory

- `GET /api/inventory/sku`
- `GET /api/inventory/stock`
- `GET /api/inventory/movements`
- `GET /api/inventory/issues`
- `POST /api/inventory/receiving-preview`
- `POST /api/inventory/adjustment-placeholder`

### Task linkage

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks?sourceModule=inventory`

## API Connector Non-goals

- No real API routes in this milestone.
- No backend implementation.
- No authentication implementation.
- No permission middleware.
- No database schema migration.
- No external supplier or POS integration.
