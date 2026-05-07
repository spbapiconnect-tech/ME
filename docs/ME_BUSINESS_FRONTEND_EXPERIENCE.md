# ME Business Frontend Experience

## Purpose

Define how the primary ME product experience should feel to a real customer.

The business frontend is not a presentation board. It is the operational face of the product.

## Main Product Surfaces

- `/` business workspace
- `/branches`
- `/psi`
- `/psi/supplier`
- `/psi/inventory`
- `/reports`
- `/reports/pos`
- `/staff`
- `/schedule`
- `/tasks`
- `/training`
- `/inspection`
- `/issues`
- `/sop`
- `/expiry`
- `/finance`

## Customer-Facing Experience Rules

- the dashboard must feel like an operations control page
- major detail pages must feel like real ERP / CRM record pages
- list pages must feel like working queues, not card galleries
- reports must keep tables and filters, not just charts
- the shell must feel stable and enterprise-ready across desktop, tablet, and mobile

## Homepage Rule

The homepage is the **business workspace**, not a landing page.

It should prioritize:

- key metrics
- operational queues
- exceptions and alerts
- module entry points
- branch / period context
- recent activity

## Major Detail Rule

When a module becomes a major working surface, it should move toward:

- breadcrumb
- record header
- status badge
- action bar
- tabs
- dense detail sections
- related records
- timeline / right rail

## Language Rule

Customer-visible operations pages should not show:

- `mock`
- `demo`
- `placeholder`
- `dev`
- `sample`

Internal scope limitations can still be tracked in docs and metadata, but not surfaced as noisy customer-facing copy.

## Supporting Governance

- [DESIGN.md](./DESIGN.md)
- [ME_UI_METRICS.md](./ME_UI_METRICS.md)
- [ME_VISUAL_SYSTEM.md](./ME_VISUAL_SYSTEM.md)
- [ME_PAGE_TEMPLATES.md](./ME_PAGE_TEMPLATES.md)
