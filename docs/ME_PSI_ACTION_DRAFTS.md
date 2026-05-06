# ME PSI Action Drafts

## Purpose
- Define future PSI operational actions without writing data.
- Prepare form placeholders for procurement/supplier/inventory workflows.
- Connect PSI action drafts to action/access/audit/workflow/notification metadata.
- Keep source mapping stable before real write capabilities exist.

## Current Status
- Placeholder only.
- No real submit.
- No real database.
- No real API.
- No write service.
- No repository mutation.
- No stock posting.
- No approval workflow.
- No supplier portal.
- No task creation.
- No notification sending.

## Architecture
PsiActionDraftContract
→ PsiActionFormPreview
→ ActionContract
→ AccessRule
→ AuditEventContract
→ WorkflowContract
→ NotificationContract
→ Future Write Service
→ Future API Repository
→ Future Database

## Draft Actions
- Create Purchase Request
- Create Purchase Order
- Record Receiving
- Report Purchase Issue
- Add Supplier
- Review Supplier
- Report Supplier Issue
- Create SKU
- Adjust Inventory
- Transfer Stock
- Report Inventory Issue
- Create Replenishment Suggestion

## Future Migration
- Add client validation.
- Add draft persistence.
- Add write service methods.
- Add repository mutation methods.
- Add permission guard.
- Add audit writer.
- Add workflow trigger.
- Add notification adapter.
- Add real inventory transaction engine later.


## ME PSI Detail / Issue / Timeline Placeholder (v0.7.2)

- Add PSI detail placeholder sections: summary header, key fields, lifecycle strip, timeline, linked records, insights, related actions, related tasks, source/mock notice.
- Add `/psi/issues` combined issue placeholder route for procurement/supplier/inventory issue previews.
- Add workspace issue preview badges for status/priority/source/related-action/lifecycle placeholder context.
- Keep all behaviors read-only and preview-only.
- No real status transition, issue update, audit write, task creation, workflow trigger, notification sending, database/API/backend/middleware/session integration.
