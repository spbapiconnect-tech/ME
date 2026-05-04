# ME

ME is a modular store operations SaaS platform.

- UI app name: `ME`
- Repo/package name: `me`
- Chinese subtitle: `模块化门店运营平台`
- English subtitle: `Modular Store Operations Platform`

## Current Milestone

`v0.0.1 Project Setup -> v0.1.0 Theme System`

## Scope

This repository currently contains only the first Core Shell foundation:

- Next.js App Router shell
- Bright / Dark / Moon theme tokens
- Chinese / English language switching
- Typed module registry
- Responsive mobile / tablet / desktop shell placeholders
- Premium landing dashboard
- Task Engine UI routes with local task records and detail pages

## Task Engine Milestone

- Task Engine route lives at `/tasks`
- Task detail route lives at `/tasks/[taskId]`
- Task data is local-only and sourced from `data/tasks/`
- Task helpers live under `lib/tasks.ts`
- UI reuses the existing shell, data, and detail components
- No real workflow engine, notification service, database, or API is connected

## Not Included Yet

- Real business logic
- Database connections
- Procurement, inventory, POS, AI, workflow, automation, rules, formula engine, notification backends, or real API connectors
