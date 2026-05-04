# ME Data Model Planning

## Core Entities

### Supplier cluster

- Supplier
- SupplierContact
- SupplierProduct
- Quotation
- SupplierContract
- SupplierRating
- SupplierIssue

### Procurement cluster

- PurchaseRequest
- PurchaseRequestLine
- PurchaseOrder
- PurchaseOrderLine
- Receiving
- ReceivingLine
- PurchaseIssue
- ApprovalPlaceholder

### Inventory cluster

- SKU
- Product
- Warehouse
- StoreStock
- StockMovement
- StockCount
- StockCountLine
- InventoryIssue
- ReplenishmentSuggestion

### Shared platform

- Task
- FileAttachment
- AuditLog
- SourceMapping
- User
- Role
- Store
- Tenant

## Entity Relationship Summary

- Supplier has many SupplierProducts.
- SupplierProduct connects Supplier and SKU or Product.
- PurchaseRequest has many PurchaseRequestLines.
- PurchaseOrder is created from PurchaseRequest or manual source.
- PurchaseOrder belongs to Supplier.
- Receiving belongs to PurchaseOrder.
- ReceivingLine can generate StockMovement later.
- InventoryIssue can generate Task.
- PurchaseIssue can generate Task.
- Task stores SourceMapping back to module, record, page, and action.

## Suggested ID Prefixes

- `SUP-`
- `SKU-`
- `PR-`
- `PO-`
- `RCV-`
- `PI-`
- `INVISS-`
- `TASK-`
- `WH-`
- `ST-`

## Status Models

### PurchaseRequest

- `draft`
- `submitted`
- `review`
- `approved`
- `rejected`
- `converted`

### PurchaseOrder

- `draft`
- `sent`
- `confirmed`
- `partially-received`
- `received`
- `closed`
- `cancelled`

### Receiving

- `pending`
- `partial`
- `completed`
- `disputed`

### InventoryIssue

- `open`
- `in-progress`
- `resolved`
- `escalated`

### SupplierIssue

- `open`
- `review`
- `resolved`
- `blocked`

## Future Database Notes

- PostgreSQL is recommended later.
- Soft delete should be planned.
- `tenant_id` is required for all business tables.
- Audit fields are required.
- Status transitions should be explicit.
- Avoid storing UI-only labels in core tables.
- Display models should be derived from data.
