# ME PSI Report Widget Connection

## Purpose
- connect PSI read-only mock data to report widget preview
- make /reports look closer to a business operations dashboard
- keep report widgets service/page-data ready
- prepare future BI/report builder connection without SQL/database yet

## Current Status
- mock data only
- read-only
- no BI engine
- no chart execution
- no SQL
- no database/API
- no export engine
- no scheduled report
- no realtime refresh

## Architecture
PSI Page Data
→ PSI Report Adapter
→ PSI Report Dashboard Data
→ Report Widget Contract
→ /reports PSI Preview Panel
→ Future Report Builder / BI Adapter

## Connected PSI Widgets
- Procurement Pending Requests
- Receiving Today
- Supplier Issue Summary
- Supplier Rating Preview
- Inventory Low Stock Risk
- Inventory Stock Value
- Replenishment Suggestions
- PSI Issue Summary
- PSI Lifecycle Summary
- PSI Health Score Placeholder

## Future Migration
- add real report query layer
- add chart rendering
- add dashboard builder
- add export
- add scheduled report
- add permission guard
- add audit trail for report access
