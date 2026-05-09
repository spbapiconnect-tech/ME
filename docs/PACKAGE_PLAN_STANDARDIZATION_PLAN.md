# Package / Plan Standardization Plan

Latest stable reference point:

- `86d8f4a docs: add role access final audit`

## Goal

This phase turns Packages and Plans into a professional SaaS package-preview center while preserving the current metadata-only boundary.

The goal is not to add real billing, payment, subscription enforcement, tenant provisioning, runtime module enablement, or plan gating.

The goal is to organize:

- base plans
- module packs
- add-ons
- enterprise bundles
- feature limits
- package groups
- plan visibility
- access-plan relationship
- billing placeholder metadata
- future subscription/provisioning keys

## Covered Routes

- `/packages`

Related routes:

- `/access-control`
- `/roles`
- `/reports`
- `/layout-engine`
- `/rules`
- `/audit-trail`
- `/modules`
- `/system-foundation`

## Current Implementation

Route:

- `/packages` renders `PackagesPage`

Main package sources:

- `config/packages/package-contracts.ts`
- `config/packages/package-groups.ts`
- `lib/packages.ts`
- `types/package.ts`

Related access plan source:

- `config/access/plan-registry.ts`

Main package UI:

- `components/packages/packages-page.tsx`
- `components/packages/package-card.tsx`
- `components/packages/package-group-card.tsx`
- `components/packages/package-preview-card.tsx`
- `components/packages/package-source-card.tsx`

## Current Findings

### Current Strengths

The current package system already includes:

- Starter / Ops / Pro / Enterprise plans
- module packs
- add-ons
- compliance package
- reporting package
- system preview package
- package groups
- package filters
- selected package preview
- metadata-only package helper
- placeholder billing keys
- placeholder subscription keys
- placeholder provisioning keys

The `/packages` page already states:

- metadata-only package/plan preview
- no real billing
- no real payment
- no subscription enforcement
- no tenant provisioning
- no runtime module enable / disable
- no API / backend / database
- no session lookup

### Current Polish Needs

The page still needs polish around:

- English-only UI labels
- wording around `Active`
- wording around `canUse`
- wording around billing placeholders
- relationship between package contracts and access plan registry
- clearer distinction between package catalog and real subscription system

## Important Source Relationship

There are two plan-related sources:

### Package contracts

- `config/packages/package-contracts.ts`

Purpose:

- SaaS package catalog
- plan/package feature composition
- module packs
- add-ons
- future billing/subscription/provisioning metadata

### Access plan registry

- `config/access/plan-registry.ts`

Purpose:

- access-control filtering
- plan requirement metadata
- permission contract preview

Decision for this phase:

- Do not merge these two sources now.
- Treat package contracts as the product/package catalog.
- Treat access plan registry as the permission/access filter registry.
- Document their relationship before attempting any cleanup.

## Target IA

Package / Plan should be treated as a commercial packaging preview center.

Recommended surfaces:

1. Package Overview
2. Base Plans
3. Module Packs
4. Add-ons
5. Enterprise / Custom
6. Feature Limits
7. Package Preview
8. Package Source / Metadata
9. Related Access Plan Registry

## Preview-Safe Wording Rules

Avoid wording that sounds like real billing or provisioning:

- Subscribe
- Activate Plan
- Enable Module
- Disable Module
- Upgrade Now
- Buy
- Checkout
- Payment
- Provision Tenant
- Start Trial
- Cancel Subscription

Prefer:

- Preview Plan
- Review Package
- Inspect Package Contract
- Metadata Preview
- Package Catalog
- Plan Contract
- Preview Limits
- Future Billing Key
- Future Provisioning Key

## Accepted Metadata Terms

These terms are allowed when clearly framed as metadata:

- billingMode
- futureBillingKey
- futureSubscriptionKey
- futureProvisioningKey
- active
- preview-only
- coming-soon
- placeholder
- canUse

But UI copy should clarify:

- `active` means active in metadata catalog
- `canUse` means usable for metadata preview only
- billing keys are future references only

## Boundary Rules

This phase must not add:

- real billing
- payment provider integration
- subscription enforcement
- tenant provisioning
- runtime module enablement
- runtime module disablement
- plan gating
- pricing engine
- invoice generation
- checkout flow
- customer portal
- auth/session lookup
- database access
- API calls
- webhook execution
- workflow execution
- notification sending

Everything remains UI/config-only and metadata-only.

## Recommended L3 Next Step

Run a focused risky wording and source relationship audit for:

- `components/packages/packages-page.tsx`
- `components/packages/package-card.tsx`
- `components/packages/package-preview-card.tsx`
- `components/packages/package-source-card.tsx`
- `config/packages/package-contracts.ts`
- `lib/packages.ts`
- `config/access/plan-registry.ts`

Look for:

- Subscribe
- Activate
- Enable
- Disable
- Upgrade
- Buy
- Checkout
- Payment
- Provision
- Billing
- Subscription
- canUse
- Active

Then decide whether to do small UI copy polish or a source note first.

## Validation

After each change:

- `npm run build`
- `npm test`
- do not commit `.write_test`
- confirm `/packages` imports
- confirm `/access-control` still imports
- confirm no fetch / axios / prisma / supabase / storage usage is added
