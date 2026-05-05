import assert from "node:assert/strict";
import test from "node:test";

import { dashboardLayoutCatalog, reportWidgetRegistry } from "../config/reports";
import {
  getDashboardWidgets,
  getReportWidgetPreview,
  getWidgetsBySourceModule,
  getWidgetsByType,
} from "../lib/report-widgets";

test("all report widgets have zh/en titles", () => {
  assert.ok(reportWidgetRegistry.length > 0);
  for (const item of reportWidgetRegistry) {
    assert.ok(item.title.zh.length > 0);
    assert.ok(item.title.en.length > 0);
  }
});

test("all report widgets include source/metrics/filters/requirement metadata", () => {
  for (const item of reportWidgetRegistry) {
    assert.ok(item.source.sourceModule.length > 0);
    assert.ok(Array.isArray(item.metrics));
    assert.ok(Array.isArray(item.filters));
    assert.equal(typeof item.requirement.auditRequired, "boolean");
    assert.equal(typeof item.requirement.exportable, "boolean");
    assert.equal(typeof item.requirement.refreshable, "boolean");
    assert.equal(typeof item.requirement.drillDownEnabled, "boolean");
  }
});

test("placeholder/coming-soon/blocked/disabled widgets return canRender=false", () => {
  const blocked = reportWidgetRegistry.filter((item) => ["placeholder", "coming-soon", "blocked", "disabled"].includes(item.status));
  assert.ok(blocked.length > 0);
  for (const item of blocked) {
    const preview = getReportWidgetPreview(item);
    assert.equal(preview.canRender, false);
  }
});

test("active widgets return canRender=true as metadata preview only", () => {
  const active = reportWidgetRegistry.filter((item) => item.status === "active");
  assert.ok(active.length > 0);
  for (const item of active) {
    const preview = getReportWidgetPreview(item);
    assert.equal(preview.canRender, true);
  }
});

test("dashboard layout catalog entries have zh/en names", () => {
  assert.ok(dashboardLayoutCatalog.length > 0);
  for (const item of dashboardLayoutCatalog) {
    assert.ok(item.name.zh.length > 0);
    assert.ok(item.name.en.length > 0);
  }
});

test("dashboard layout widget keys resolve to valid widgets", () => {
  for (const layout of dashboardLayoutCatalog) {
    const widgets = getDashboardWidgets(layout);
    assert.equal(widgets.length, layout.widgets.length);
  }
});

test("report widget helpers can find POS/inventory/procurement/supplier/task/workflow/notification/audit examples", () => {
  assert.ok(getWidgetsBySourceModule("pos-report").length > 0);
  assert.ok(getWidgetsBySourceModule("inventory").length > 0);
  assert.ok(getWidgetsBySourceModule("procurement").length > 0);
  assert.ok(getWidgetsBySourceModule("supplier").length > 0);
  assert.ok(getWidgetsBySourceModule("task").length > 0);
  assert.ok(getWidgetsByType("workflow-summary").length > 0);
  assert.ok(getWidgetsByType("notification-summary").length > 0);
  assert.ok(getWidgetsByType("audit-summary").length > 0);
});

test("report route/page imports without crashing", async () => {
  const route = await import("../app/reports/page");
  assert.equal(typeof route.default, "function");
});

test("report helper contains no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile("lib/report-widgets.ts", "utf8");
  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
});

test("no forbidden legacy brand names in report config/docs/components", async () => {
  const { readFile } = await import("node:fs/promises");

  const targets = [
    "docs/ME_REPORT_WIDGETS.md",
    "config/reports/report-widgets.ts",
    "config/reports/dashboard-layouts.ts",
    "components/reports/report-widgets-page.tsx",
    "components/reports/report-widget-card.tsx",
    "components/reports/report-widget-preview-card.tsx",
  ];

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false);
  }
});
