# ME Open Source Stack

## Runtime

- Next.js App Router
- React
- TypeScript

## UI Foundation

- CSS variables for the bright, dark, and moon themes
- Lucide React for iconography
- Zustand for lightweight client preferences

## Current Development Focus

- Build a stable Core Shell before business logic
- Keep the stack simple and maintainable
- Avoid database and connector dependencies in the current milestone

## ME Brain Layer / AI Intelligence Roadmap

This roadmap section documents future intelligence candidates for ME without adding implementation in the current repository scope.

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
