# Reports Module Standardization Plan

This document defines the cleanup and standardization path for the Reports module.

Branch and Task are the current reference modules.

Reports is not a blank module. It already has a working widget registry, PSI report preview, dashboard layout catalog, report widget cards, and metadata-first helper boundary.

## Current Reports Module Status

Current route structure:

- app/reports/page.tsx
- app/reports/[reportId]/page.tsx
- app/reports/pos/page.tsx

Current main page component:

- components/reports/report-widgets-page.tsx

Current report widget components:

- components/reports/report-widget-card.tsx
- components/reports/report-widget-preview-card.tsx
- components/reports/report-widget-source-card.tsx
- components/reports/report-widget-chip.tsx
- components/reports/psi-report-dashboard-panel.tsx
- components/reports/psi-report-widget-card.tsx
- components/reports/psi-report-source-card.tsx
- components/reports/dashboard-layout-card.tsx

Current config and helper boundary:

- config/reports/report-widgets.ts
- config/reports/dashboard-layouts.ts
- lib/report-widgets.ts
- lib/page-data/psi/reports-page-data.ts
- lib/display-adapters/psi/reports.adapter.ts

## Standardization Direction

Reports should follow the Branch and Task module standards, but it should not be rebuilt from zero.

Use this route:

1. Keep existing report widget registry.
2. Keep existing dashboard layout catalog.
3. Keep existing PSI report dashboard data boundary.
4. Add a report language copy map.
5. Connect ReportWidgetsPage to the report copy map.
6. Do not duplicate report widget metadata already stored in config/reports.
7. Preserve metadata-first and read-only behavior.
8. Add final audit doc after build/test passes.

## Key Issues Found

### 1. Main Reports Page Has Hardcoded UI Copy

components/reports/report-widgets-page.tsx still contains hardcoded UI copy such as:

- Report Readiness
- Reports Workspace
- Reporting and export readiness workspace
- Report catalog
- Operational filters
- Export review
- Scheduled distribution setup
- PSI Report Preview
- Report Filters
- Widget Catalog
- Dashboard Layout Templates
- Computed Metrics
- Widget Mix
- Selected Widget Layout Links
- Workspace Note

### 2. Existing Report Widgets Already Support zh/en

config/reports/report-widgets.ts already stores localized widget metadata:

- title.zh / title.en
- description.zh / description.en
- metric labels zh/en

lib/report-widgets.ts already has helper functions:

- resolveReportWidgetTitle
- resolveReportWidgetDescription
- getReportWidgetPreview

Do not duplicate this data into a separate page-level mock map.

### 3. Reports Are Metadata-First

Current reports are intentionally preview-only / metadata-first.

The module must not add:

- real BI engine
- chart execution engine
- SQL queries
- database reads/writes
- API calls
- export file generation
- scheduled report delivery
- notification sending

### 4. POS Reports Route Is Separate

app/reports/pos/page.tsx uses RestaurantModulePage and restaurant module metadata.

Do not mix POS Reports standardization into the main /reports cleanup unless explicitly planned.

## Target New File

Recommended new file:

- config/report-language-copy.ts

## Report Language Copy Scope

The new report copy map should include:

### Page

- eyebrow
- title
- description
- notice
- service notice / fallback copy

### Badges

- reports
- reportCenter
- current release / live / catalog badges

### Actions

- openPosReports
- exportReview
- openWorkspace
- refreshPreview
- viewLayout
- viewWidget

### Metrics

- totalWidgets
- activeWidgets
- placeholders
- exportable
- refreshable
- drillDown

### Tabs

- reportsOverview
- widgetCatalog
- dashboardLayouts
- computedMetrics
- psiPreview
- posReports
- salesAnalytics

### Filters

- reportFilters
- widgetType
- sourceModule
- status
- severity
- all
- filterMode

### Sections

- psiReportPreview
- reportFilters
- widgetCatalog
- dashboardLayoutTemplates
- computedMetrics
- widgetMix
- selectedWidgetLayoutLinks
- workspaceNote

### Right Rail

- reportReadiness
- reportCatalog
- operationalFilters
- exportReview
- scheduledDistributionSetup
- currentFilter
- currentStatus
- currentSeverity

## Implementation Phases

### L1 Plan

Create this plan document.

### L2 Report Language Copy

Create:

- config/report-language-copy.ts

No UI changes yet.

### L3 ReportWidgetsPage Language Wiring

Update:

- components/reports/report-widgets-page.tsx

Required changes:

- read locale from useUiPreferencesStore if not already present
- resolve copy with getReportCopy(locale)
- replace hardcoded UI copy
- keep widget title/description resolved through report-widget helpers
- keep PSI dashboard panel locale usage
- keep registry filtering logic intact

### L4 Responsive / Mobile Review

Inspect:

- report filter section
- widget catalog cards
- layout selector
- preview/source panel
- PSI report panel
- computed metrics grid

Only patch layout issues with small fixes.

### L5 Audit Doc

Create:

- docs/REPORTS_MODULE_STANDARD_AUDIT.md

Only after:

- npm run build passes
- npm test passes

## Do Not Do

Do not:

- rebuild Reports from zero
- remove reportWidgetRegistry
- duplicate report widget metadata into page JSX
- remove dashboardLayoutCatalog
- connect a real BI/chart engine
- connect SQL or database queries
- add API calls
- generate real exports
- add scheduled delivery
- trigger notifications
- mix POS Reports cleanup into main /reports unless planned
- hardcode bilingual text inside JSX

## Validation Rule

Every phase must run:

- npm run build
- npm test

Commit only after both pass.
