# Reports Module Standard Audit

This document records the current standard achieved by the Reports module.

The Reports module now follows the Branch and Task module standard while preserving its existing report widget registry, dashboard layout catalog, PSI report preview boundary, and metadata-first reporting foundation.

## Current Stable Commit

Latest completed milestone:

- 60bc61a fix: add min width guards to list workspace

Validation:

- npm run build passed
- npm test passed
- 293 tests passed

## Reports Module Responsibilities

The Reports module is responsible for:

- report workspace overview
- report widget catalog
- report widget metadata preview
- PSI report preview
- dashboard layout template preview
- report filter shell
- report source mapping preview
- computed metric framing
- widget mix summary
- selected widget layout links
- POS report entry point
- export-readiness placeholder context

## Current Route Structure

| Route | Purpose |
|---|---|
| /reports | Main reports workspace |
| /reports/[reportId] | Shared report detail placeholder route using the reports workspace |
| /reports/pos | POS reports preview route through RestaurantModulePage |

## Current File Roles

| File | Role |
|---|---|
| app/reports/page.tsx | Main reports route |
| app/reports/[reportId]/page.tsx | Report detail placeholder route |
| app/reports/pos/page.tsx | POS report route |
| components/reports/report-widgets-page.tsx | Main reports workspace UI and language wiring |
| components/reports/report-widget-card.tsx | Report widget catalog card |
| components/reports/report-widget-preview-card.tsx | Report widget preview metadata card |
| components/reports/report-widget-source-card.tsx | Report source mapping card |
| components/reports/report-widget-chip.tsx | Report widget status/type/severity/size chip |
| components/reports/psi-report-dashboard-panel.tsx | PSI report dashboard panel |
| components/reports/psi-report-widget-card.tsx | PSI report widget card |
| components/reports/psi-report-source-card.tsx | PSI report source mapping card |
| components/reports/dashboard-layout-card.tsx | Dashboard layout preview card |
| config/report-language-copy.ts | Reports en/zh UI copy source |
| config/reports/report-widgets.ts | Report widget registry |
| config/reports/dashboard-layouts.ts | Dashboard layout catalog |
| lib/report-widgets.ts | Report widget helper/query boundary |
| lib/page-data/psi/reports-page-data.ts | PSI report page-data boundary |
| lib/display-adapters/psi/reports.adapter.ts | PSI report display adapter |

## Completed Standards

### 1. Standardization Plan

Completed:

- Reports standardization plan was created.
- Reports cleanup direction was locked before UI changes.
- Reports was confirmed as an existing module, not a blank module.
- The plan preserves the report registry, dashboard layout catalog, and PSI page-data boundary.

Reference file:

- docs/REPORTS_MODULE_STANDARDIZATION_PLAN.md

### 2. Language System

Completed:

- Reports module has its own language copy map.
- English is the default fallback.
- Chinese mode uses zh labels.
- ReportWidgetsPage uses report-language-copy.
- Page header copy is localized.
- Badges are localized.
- Action labels are localized.
- KPI labels are localized.
- Tabs are localized.
- Filter placeholders are localized.
- Filter option labels are localized.
- Right rail copy is localized.
- Section titles and descriptions are localized.
- Computed metric notes are localized.
- Workspace note is localized.

Reference file:

- config/report-language-copy.ts

### 3. ReportWidgetsPage Cleanup

Completed:

- Main Reports page hardcoded labels were moved into the report language copy layer.
- Remaining page labels such as Share deck, History, Branch Performance, Export Center, widget type labels, and status labels were moved into the copy map.
- The main page no longer needs to keep those display labels inline.

Reference file:

- components/reports/report-widgets-page.tsx

### 4. Existing Report Registry Preserved

Completed:

- config/reports/report-widgets.ts remains the report widget metadata source.
- Widget title and description zh/en fields remain in the registry.
- Metrics, filters, source metadata, requirement metadata, linked routes, and future report builder keys remain in the registry.
- No duplicate widget data map was created inside the page component.

Reference file:

- config/reports/report-widgets.ts

### 5. Dashboard Layout Catalog Preserved

Completed:

- config/reports/dashboard-layouts.ts remains the dashboard layout source.
- Layout cards still use the dashboard layout catalog.
- Layout-to-widget references remain metadata-driven.
- No layout metadata was duplicated into the Reports page component.

Reference file:

- config/reports/dashboard-layouts.ts

### 6. PSI Report Boundary Preserved

Completed:

- /reports still receives PSI dashboard data from getPsiReportDashboardPageData.
- PSI report display remains adapter/page-data driven.
- PSI report widgets remain preview-only.
- PSI report panel still receives locale from the reports workspace.
- No raw mock data was imported directly into report page components.

Reference files:

- lib/page-data/psi/reports-page-data.ts
- lib/display-adapters/psi/reports.adapter.ts
- components/reports/psi-report-dashboard-panel.tsx

### 7. Metadata-First Reporting Boundary

Completed:

Reports remain metadata-first and read-only.

No implementation was added for:

- real BI engine
- chart execution engine
- SQL query execution
- database reads
- database writes
- live API calls
- real export file generation
- scheduled report delivery
- notification sending
- workflow execution

### 8. Responsive Layout

Completed:

- Reports KPI grid is responsive.
- Report filter area is contained inside the workspace section.
- Widget catalog cards use grid layout.
- Dashboard layout cards use responsive grid layout.
- Report preview/source cards are contained in the summary column.
- Shared MeListWorkspace now includes min-width guards.
- Long metadata, JSON preview, source mapping, and report cards are less likely to push the page wider than the viewport.

Reference file:

- components/layout/me-list-workspace.tsx

## Known Safe Remaining Content

Some English-like values can remain because they are technical values, metadata keys, source module keys, route paths, widget keys, status keys, or mock values.

Examples:

- report widget keys
- dashboard layout keys
- source module keys
- source route paths
- source component names
- service placeholder names
- repository placeholder names
- future query keys
- future report builder keys
- metadata status keys
- sample data values
- class names
- import paths

These should not be blindly translated inside page components.

## Remaining Future Cleanup

The child report cards still contain local inline bilingual copy such as:

- ReportWidgetCard
- ReportWidgetPreviewCard
- ReportWidgetSourceCard
- PsiReportSourceCard
- DashboardLayoutCard

This is acceptable for now because they already use zh/en conditional copy and are not English-only. They can be moved into a shared report component copy map later if needed.

## Do Not Do

Do not:

- rebuild Reports from zero
- remove reportWidgetRegistry
- remove dashboardLayoutCatalog
- duplicate widget metadata into page JSX
- duplicate layout metadata into page JSX
- connect real BI/chart engines
- connect SQL or database queries
- add API calls
- generate real exports
- add scheduled delivery
- trigger notifications
- trigger workflow execution
- mix POS Reports cleanup into main /reports unless separately planned
- hardcode bilingual text inside main page JSX

## Rules for Future Reports Work

Future Reports work should follow this order:

1. Keep report widget metadata in config/reports/report-widgets.ts.
2. Keep dashboard layout metadata in config/reports/dashboard-layouts.ts.
3. Keep page UI copy in config/report-language-copy.ts.
4. Keep PSI report data through page-data and display adapters.
5. Keep report behavior metadata-only until API/report-builder boundaries are ready.
6. Run npm run build.
7. Run npm test.
8. Commit only after both pass.

## Recommended Next Improvements

Recommended next steps:

1. Add tests for report language copy completeness.
2. Add tests to prevent hardcoded main-page report labels from returning.
3. Move report child card bilingual copy into a shared component copy map.
4. Add localized status/type/severity option helpers for child components if needed.
5. Add browser screenshot checks for mobile, tablet, and desktop.
6. Create a separate POS Reports standardization plan later.

## Reports Module Standard Status

Status: reference module ready

The Reports module can now be used as the third standardized module pattern after Branch and Task.
