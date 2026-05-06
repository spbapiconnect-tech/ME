import assert from "node:assert/strict";
import test from "node:test";

import { dashboardLayoutCatalog, reportWidgetRegistry } from "../config/reports";
import { getPsiReportDashboardPageData } from "../lib/page-data/psi";

test("PSI report types/config imports", async () => {
  const types = await import("../types/psi/reports");
  assert.ok(Object.keys(types).length >= 0);
  assert.ok(Array.isArray(reportWidgetRegistry));
});

test("PSI report dashboard page-data returns widgets", async () => {
  const data = await getPsiReportDashboardPageData();
  assert.ok(data.widgets.length > 0);
  assert.ok(data.dashboardData.widgets.length > 0);
});

test("PSI report widgets include procurement/supplier/inventory examples", async () => {
  const data = await getPsiReportDashboardPageData();
  const keys = data.widgets.map((item) => item.widgetKey);
  assert.ok(keys.includes("widget.psi.procurementPendingRequests"));
  assert.ok(keys.includes("widget.psi.supplierIssueSummary"));
  assert.ok(keys.includes("widget.psi.inventoryLowStockRisk"));
});

test("PSI report widget config keys exist", () => {
  const keys = new Set(reportWidgetRegistry.map((item) => item.key));
  const required = [
    "widget.psi.procurementPendingRequests",
    "widget.psi.receivingToday",
    "widget.psi.supplierIssueSummary",
    "widget.psi.supplierRatingPreview",
    "widget.psi.inventoryLowStockRisk",
    "widget.psi.inventoryStockValue",
    "widget.psi.replenishmentSuggestions",
    "widget.psi.issueSummary",
    "widget.psi.lifecycleSummary",
    "widget.psi.healthScore",
  ];
  for (const key of required) assert.equal(keys.has(key), true);
});

test("dashboard.psi-overview layout resolves widget keys", () => {
  const layout = dashboardLayoutCatalog.find((item) => item.key === "dashboard.psi-overview");
  assert.ok(layout);
  const widgetKeys = new Set(reportWidgetRegistry.map((item) => item.key));
  for (const key of layout!.widgets) {
    assert.equal(widgetKeys.has(key), true);
  }
});

test("/reports route imports without crashing", async () => {
  const route = await import("../app/reports/page");
  assert.equal(typeof route.default, "function");
});

test("PSI report adapter/page-data do not import raw mock data", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "lib/display-adapters/psi/reports.adapter.ts",
    "lib/page-data/psi/reports-page-data.ts",
  ];
  const text = (await Promise.all(files.map((f) => readFile(f, "utf8")))).join("\n");
  assert.equal(text.includes('from "@/data/psi"'), false);
  assert.equal(text.includes("from \"../data/psi\""), false);
});

test("no PSI report adapter/page-data contains fetch or axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "lib/display-adapters/psi/reports.adapter.ts",
    "lib/page-data/psi/reports-page-data.ts",
  ];
  const text = (await Promise.all(files.map((f) => readFile(f, "utf8")))).join("\n");
  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
});

test("no forbidden legacy brand names in PSI report docs/components/files", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "docs/ME_PSI_REPORT_WIDGET_CONNECTION.md",
    "components/reports/psi-report-dashboard-panel.tsx",
    "components/reports/psi-report-widget-card.tsx",
    "components/reports/psi-report-source-card.tsx",
    "lib/display-adapters/psi/reports.adapter.ts",
    "lib/page-data/psi/reports-page-data.ts",
  ];
  const text = (await Promise.all(files.map((f) => readFile(f, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test("write-test marker is not referenced in PSI runtime files", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "lib/display-adapters/psi/reports.adapter.ts",
    "lib/page-data/psi/reports-page-data.ts",
  ];
  const text = (await Promise.all(files.map((f) => readFile(f, "utf8")))).join("\n");
  const marker = [".write", "_test"].join("");
  assert.equal(text.includes(marker), false);
});
