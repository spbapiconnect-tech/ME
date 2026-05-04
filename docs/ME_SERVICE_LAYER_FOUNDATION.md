# ME Service Layer Foundation (v0.6.0)

## Purpose

This milestone introduces a service layer and repository contracts for ME.

- UI routes can call services instead of importing mock data directly.
- Services resolve repositories through a repository provider.
- Repository provider defaults to mock mode.
- No real API, database, or runtime business implementation is included.

## What Is Included

- Data contracts under `lib/data/` (`DataResult`, query types, and base repository interface)
- Repository contracts under `lib/repositories/contracts.ts`
- Default mock repository provider under `lib/repositories/provider.ts`
- Mock repositories under `lib/repositories/mock/` backed by local data in `data/demo/` and `data/tasks/`
- Service entrypoints under `lib/services/`

## Design Rules

- Repository provider mode is mock by default.
- Services call `getRepositoryProvider()` and never access mock data directly.
- Mock repositories return `DataResult` with `meta.source = "mock"`.
- Layout Engine remains data-source agnostic.

## Future Extensions (Not Implemented Yet)

- Add API-backed repositories that implement the same repository contracts.
- Keep DTO mapping and tenant boundaries inside repositories/services.
- Migrate runtime routes to call the service layer when safe.

## Non-goals

- No Next.js API routes.
- No fetch/axios.
- No database.
- No procurement/supplier/inventory business flows.
- No AI/workflow/automation/rules/formulas.
