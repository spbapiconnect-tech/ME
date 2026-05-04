# ME Master Project Scope

## Positioning

ME is a modular store operations SaaS platform.

- Chinese subtitle: `模块化门店运营平台`
- English subtitle: `Modular Store Operations Platform`

## Current Delivery Scope

This repository currently delivers only the first Core Shell foundation.

- App shell structure for mobile, tablet, and desktop
- Bright, dark, and moon theme tokens
- Chinese and English message catalogs
- Typed module registry and source mapping contracts
- Premium landing dashboard for the initial ME experience

## Explicit Exclusions

The current milestone does not include real business logic or production integrations.

- No database connection
- No procurement flow implementation
- No inventory transaction engine
- No POS connector
- No AI features
- No workflow, automation, rules, or formula engine
- No real external API connectors

## Module Registry Milestone

- The module registry is the single source of truth for module metadata
- Module Center reads directly from `config/modules.ts`
- Future modules are registered but not implemented
- No real module business logic is included yet
- Dashboard shows enabled/core modules only
- Module Center can display all modules by category and status
- Future module additions should happen by config first, not by hardcoding pages

## ME Brain Layer / AI Intelligence Roadmap

This section defines future intelligence directions for ME only.

- Status: roadmap only
- Not implemented in the current milestone
- No API calls
- No model inference code
- No Hugging Face model integration at this stage

### Forecast Engine

- Candidate resources: Amazon Chronos / Chronos-Bolt, TimesFM, Lag-Llama
- Use cases: POS sales forecast, inventory consumption forecast, reorder suggestion, procurement planning, stock risk prediction
- Status: roadmap / not implemented

### SQL Intelligence

- Candidate resources: Defog SQLCoder, Text-to-SQL, SQL Guard
- Use cases: natural language reporting, AI data analyst, dashboard drill-down, read-only business query generation
- Security rule: generated SQL must be read-only `SELECT`, tenant-scoped, table-whitelisted, row-limited, and auditable
- Status: roadmap / not implemented

### Document Intelligence

- Candidate resources: LayoutLMv3-style document AI, OCR, invoice parser, receipt parser
- Use cases: supplier invoice extraction, delivery order parsing, purchase document comparison, contract field extraction
- License note: verify commercial license before production use
- Status: roadmap / not implemented

## Milestone Track

- Current branch: `develop`
- Current milestone: `v0.2.1 Module Registry`
- Delivery goal: establish a scalable shell for future ME modules without rework-heavy hardcoding
