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

## Data Provider Integration / Page Data Boundary (v0.6.1)

- Selected UI pages now read mock data through the service layer (Page/Component → Service Layer → Repository Provider → Mock Repository → Local Mock Data).
- Repository mode remains mock; no real API, database, fetch, or axios exists.
- UI work should not import `data/demo` or `data/tasks` directly for new module features.
- Page data helpers may convert `DataResult` into plain page props and centralized empty/error handling.

## Action Source Mapping / Button Contract Foundation (v0.6.2)

- Route: `/action-contracts` (metadata-only contract and registry explorer).
- Registry: `config/actions/`.
- Contract types: `types/action-contract.ts`.
- Helpers: `lib/actions.ts`.
- Reusable UI: `components/actions/` (ActionButton + debug cards).
- No real permission enforcement, audit logging, workflow execution, task creation, API/database integration, or persistence.
- Source mapping keys should remain stable even when layout/skin foundations change.
