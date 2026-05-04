# ME Mock To Real Migration Plan

## Purpose

This plan explains how ME will move from mock data to real data without rebuilding UI. The goal is to keep Page Schema, Module Registry, Layout Engine, and display-model rendering stable while the data source matures behind adapters and service boundaries.

## Migration Principles

- Keep UI components data-source agnostic.
- Keep mock data shape close to future API DTOs.
- Avoid binding visual components to database tables directly.
- Add data adapters before real API.
- Source mapping must remain stable.
- Page Schema and Module Registry should not change when switching data source.

## Phases

### Phase 1

- Local mock data.
- Demo-only.
- Static Task, Procurement, Supplier, and Inventory records.

### Phase 2

- Mock service layer.
- Repository interface.
- Async loading states.
- Error states.
- Local JSON fixtures.

### Phase 3

- API adapter.
- Backend DTO mapping.
- Auth and tenant placeholder.
- API health status.
- Audit log placeholder.

### Phase 4

- Real database and backend.
- Real permission checks.
- Real task persistence.
- Real stock movement logic.
- Real procurement status transitions.

## Adapter Design

- `MockRepository`
- `ApiRepository`
- `DataAdapter`
- `DisplayModelAdapter`
- `SourceMappingAdapter`

## Acceptance Criteria Before Real API

- UI works with loading state.
- UI works with empty state.
- UI works with error state.
- All actions have source mapping.
- All module pages can read from an abstract data provider.
- No component imports mock data directly except demo routes.

## Service Layer Foundation Status

- A thin service layer and repository contract foundation exists under `lib/services/` and `lib/repositories/`.
- Repository provider defaults to mock mode.
- No real API or database is implemented yet.

## Data Provider Integration / Page Data Boundary

- Selected pages now load demo/task records via the service layer instead of importing mock data directly.
- Repository provider remains in mock mode; no real API or database is introduced.
- The service layer + repository contracts are the stable boundary for the future `ApiRepository` implementations.
