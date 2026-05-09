# Package / Plan Source Note

Latest stable reference point before this note:

- `f0c0285 docs: add package plan standardization plan`

## Purpose

This note records the current relationship between the package catalog and access plan registry.

## Current Package Sources

Package catalog source of truth:

- `config/packages/package-contracts.ts`
- `config/packages/package-groups.ts`
- `config/packages/index.ts`

Used by:

- `components/packages/packages-page.tsx`
- `lib/packages.ts`
- `tests/package-contracts.test.ts`

Purpose:

- SaaS package catalog preview
- base plans
- module packs
- add-ons
- enterprise/custom packages
- package groups
- future billing/subscription/provisioning reference keys

## Current Access Plan Source

Access plan registry source:

- `config/access/plan-registry.ts`
- `config/access/index.ts`

Used by:

- `components/access/access-control-page.tsx`
- `lib/access.ts`
- `tests/access-control.test.ts`

Purpose:

- access-control plan filtering
- permission requirement preview
- role/plan/scope contract preview

## Current Decision

Do not merge these sources in the current phase.

Decision:

- `packageContracts` is the product/package catalog source.
- `planRegistry` is the access-control plan filter source.
- Both remain metadata-only.
- Both remain static config.
- No billing, payment, subscription, tenant provisioning, or plan gating runtime is added.

## Wording Decision

Visible package UI should prefer preview-safe labels:

- Catalog Active
- Preview Usable
- Billing Placeholder
- Future Billing Ref
- Future Subscription Ref
- Future Provisioning Ref

Avoid implying:

- real subscription
- real checkout
- real plan activation
- real module enablement
- real tenant provisioning

## Boundary

This note does not add:

- billing runtime
- payment integration
- subscription enforcement
- tenant provisioning
- plan gating
- module enablement
- module disablement
- database access
- API calls
- auth/session lookup
- workflow execution
- notification sending
