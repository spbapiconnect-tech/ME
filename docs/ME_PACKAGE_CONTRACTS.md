# ME Package Contracts

## Purpose
- Standardize SaaS plan and module package metadata.
- Prepare future package builder and plan builder workflows.
- Connect modules, actions, access rules, audit events, workflows, notifications, reports, and rules into sellable package contracts.
- Keep package source mapping stable during UI redesigns.

## Current Status
- Metadata-only package and plan preview.
- No billing.
- No payment integration.
- No subscription enforcement.
- No tenant provisioning.
- No module enable/disable runtime behavior.
- No API/backend/database.
- No user/session lookup.

## Architecture
Module Registry
-> ActionContract
-> AccessRule
-> AuditEventContract
-> WorkflowContract
-> NotificationContract
-> ReportWidgetContract
-> RuleContract
-> PackageContract
-> PackagePreview
-> Future Billing / Subscription / Provisioning Adapter

## Package Contract
- `category`
- `tier`
- `billingMode`
- `modules`
- `features`
- `limits`
- `requirement`
- `recommendedRoles`
- `recommendedSkins`
- `recommendedDashboards`
- `futureBillingKey`
- `futureSubscriptionKey`
- `futureProvisioningKey`

## Route And Registry
- Route: `/packages`
- Contract types: `types/package.ts`
- Registries: `config/packages/`
- Helpers: `lib/packages.ts`
- Components: `components/packages/`

## Future Use
- Starter / Ops / Pro / Enterprise plans.
- Customer-specific package builder.
- Module marketplace.
- Procurement pack.
- Inventory pack.
- Task control pack.
- Education pack.
- POS report pack.
- Compliance pack.
- Reporting pack.
- Plan-based feature gating.
- Subscription provisioning.
- Sales demo packaging.

## Stability Rule
- Package source mapping must remain stable when layout, skin, and page-template structures evolve.
