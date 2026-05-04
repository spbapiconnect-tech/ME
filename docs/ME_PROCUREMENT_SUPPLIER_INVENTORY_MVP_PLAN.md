# ME Procurement Supplier Inventory MVP Plan

## Purpose

Procurement, Supplier, and Inventory are the first real ME business cluster because they form a close operational loop:

`Supplier -> Procurement -> Receiving -> Inventory -> Stock Risk -> Task -> Procurement Suggestion`

This milestone is planning-only. It defines the operational loop, page contracts, source mapping, task linkage, and future implementation boundaries so ME can move from prototype foundations into business-cluster delivery without a later architecture U-turn.

## MVP Goals

- Make supplier master data usable.
- Create procurement request and purchase order planning structure.
- Represent receiving and purchase issue structure.
- Represent SKU, warehouse, stock, and stock movement concepts.
- Connect low stock and receiving issues into Task Engine.
- Keep all UI schema-driven and Layout Engine compatible.
- Prepare for real API and database later without changing the visual structure.

## Non-goals

- No real database yet.
- No real supplier portal yet.
- No real payment or invoice accounting yet.
- No real approval engine yet.
- No real stock deduction engine yet.
- No real POS integration yet.
- No AI forecasting in this milestone.

## Module Responsibilities

### Procurement

- Purchase request.
- Purchase order.
- Receiving.
- Purchase issue.
- Approval placeholder.
- Export and report placeholder.

### Supplier

- Supplier profile.
- Supplier products.
- Quotation.
- Contract placeholder.
- Supplier rating.
- Supplier issue.

### Inventory

- SKU master.
- Warehouse and store stock.
- Inbound.
- Outbound placeholder.
- Transfer placeholder.
- Stock count placeholder.
- Low stock issue.
- Stock movement history.

## MVP User Roles

- Owner.
- Operations Manager.
- Purchasing Manager.
- Store Manager.
- Warehouse / Stock Handler.
- Supplier Coordinator.
- Admin.

## MVP User Stories

- As a Store Manager, I want to create a purchase request from a low stock signal so replenishment work starts before the shelf is empty.
- As a Purchasing Manager, I want to review supplier information before generating a purchase order so I can choose an acceptable source.
- As a Warehouse / Stock Handler, I want to record receiving against a purchase order so the inbound workflow is traceable.
- As a Warehouse / Stock Handler, I want to flag a quantity mismatch so the issue can be reviewed instead of silently accepted.
- As an Operations Manager, I want future receiving confirmation to update inventory stock through a controlled adapter so stock remains auditable.
- As a Store Manager, I want to create a task for a stock issue so the problem is assigned and followed through.
- As a Supplier Coordinator, I want to review supplier performance so poor delivery or quality trends are visible.
- As an Owner or Operations Manager, I want to view procurement status by store so I can understand purchasing progress across locations.

## Cross-module Flow

1. Inventory detects low stock placeholder.
2. Task Engine creates replenishment task placeholder.
3. Procurement creates purchase request placeholder.
4. Supplier profile is checked.
5. Purchase order is prepared.
6. Receiving is recorded.
7. Inventory inbound is prepared.
8. Issues create tasks.
9. Reports summarize the loop.

## Layout Engine Compatibility

- Each module page must use Page Schema first.
- Module UI should render through `ModulePageRenderer` where practical.
- Display model adapters should convert records into UI-safe cards and rows.
- Visual changes should be handled through Layout Registry and Skin Registry.
- No module page should hardcode visual layout independently.
