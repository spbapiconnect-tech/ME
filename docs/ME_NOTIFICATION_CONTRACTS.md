# ME Notification Contracts

## Purpose
- Standardize notification and message metadata contracts.
- Prepare future in-app, email, WhatsApp, SMS, push, and webhook integration.
- Connect workflow, action, access, and audit metadata to notification previews.
- Keep source mapping stable across future UI redesigns.

## Current Status
- Metadata-only preview foundation.
- No real notification sending.
- No provider integration.
- No queue, scheduler, or background job.
- No webhook execution.
- No database, API, or backend integration.
- No task or approval creation.
- No user or session lookup.
- No middleware integration.

## Architecture
ActionContract
→ AccessRule
→ AuditEventContract
→ WorkflowContract
→ NotificationContract
→ NotificationPreview
→ Future Notification Provider
→ Future In-app / Email / WhatsApp / SMS / Push / Webhook Adapter

## Notification Contract
- channel
- category
- source
- recipient
- message
- requirement
- severity
- status
- futureProviderKey
- futureTemplateKey

## Future Use
- In-app notification.
- Email sending.
- WhatsApp and SMS integration.
- Push notification.
- Webhook notification.
- Manager alert.
- Approval reminder.
- Task assignment notice.
- Daily operations summary.
- Supplier issue alert.

## Route And Registry
- Route: `/notifications`
- Registry: `config/notifications/`
- Components: `components/notifications/`
- Helper: `lib/notifications.ts`

## Stability Rule
Notification source mapping keys (`actionKey`, `accessRuleKey`, `auditEventKey`, `workflowKey`) must remain stable when layout, skin, or component structure changes.

## ME Report Widgets Update
- Add `/reports` metadata preview route for dashboard/report widgets.
- Add report widget registry under `config/reports/`.
- Add report widget components under `components/reports/`.
- Notification metadata can map to report widget previews through `notificationKey`.
- Report widget preview remains metadata-only: no real query/export/schedule/database/API/backend.
