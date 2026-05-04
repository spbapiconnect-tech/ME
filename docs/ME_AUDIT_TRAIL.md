# ME Audit Trail

## Purpose

- Standardize audit/event metadata for ME action and access previews.
- Prepare future event log and compliance trail without runtime integration.
- Connect action contracts and access control metadata to audit previews.
- Keep audit source mapping stable during UI redesigns (layout/skin/shell changes).

## Current Status

- Metadata-only.
- No real event log.
- No persistence.
- No database/API.
- No user/session lookup.
- No middleware.
- No production audit trail.

## Architecture

ActionContract
→ AccessRule
→ AuditEventContract
→ AuditPreview
→ Future Event Log Writer
→ Future Audit Database

## Audit Event Contract

- `actor`
- `source`
- `target`
- `requirement`
- `severity`
- `status`
- `timestampStrategy`
- `retentionHint`
- `futureEventKey`

## Future Use

- Audit log
- Compliance export
- Operational event history
- Workflow trace
- Permission review
- Source mapping analysis
- Customer admin report

## Registry And UI

- Route: `/audit-trail`
- Contract types: `types/audit.ts`
- Registry: `config/audit/`
- Helpers: `lib/audit.ts`
- Reusable UI components: `components/audit/`
- Current behavior: preview-only metadata foundation

## Stability Rule

- Audit source mapping and event keys must remain stable when layout/skin/theme/shell layers change.
- UI redesigns should not require remapping audit contracts.
