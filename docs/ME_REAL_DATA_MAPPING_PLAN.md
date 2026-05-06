# ME Real Data Mapping Plan

## Purpose

- prepare current mock/read-only UI for future real data
- map UI blocks to entities, tables, and API boundaries
- prevent random backend connection work
- protect the SaaS shell, routes, and detail pattern from data coupling

## Current Status

- planning-only
- no database
- no API
- no auth/session
- no permission enforcement
- no write behavior
- no stock posting
- no approval execution

## UI Surface Mapping

- Dashboard
- Procurement
- Supplier
- Inventory
- Branch
- Reports
- Roles

## Future Entities

- branch
- user
- role
- supplier
- procurement_request
- procurement_request_item
- inventory_item
- inventory_stock
- stock_movement
- issue
- task
- activity_event
- report_snapshot
- attachment
- audit_event

## API Boundary Draft

- read-only first
- write endpoints deferred
- approval/action endpoints deferred

## Migration Plan

1. freeze UI shell and detail pattern
2. define database schema
3. implement read-only API
4. replace mock page-data helpers with repository-backed data
5. add auth/session
6. add permissions
7. add writes/approvals only after read layer is stable

## Guardrails

- no direct database calls inside components
- no fetch inside UI components
- use service/repository/page-data boundary
- keep shell independent of data source
- no API credentials committed
