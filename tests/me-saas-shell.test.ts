import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { navigationMap } from "../config/navigation";

test("navigation sidebar groups include expandable child navigation", () => {
  assert.equal(navigationMap.sidebarGroups.length >= 6, true);

  const psiGroup = navigationMap.sidebarGroups.find((group) => group.key === "sidebar-psi");
  assert.ok(psiGroup);
  assert.equal(psiGroup?.items.some((item) => item.label.en === "Overview"), true);
  assert.equal(psiGroup?.items.some((item) => item.label.en === "Procurement" && item.href === "/psi/procurement"), true);

  const reportsGroup = navigationMap.sidebarGroups.find((group) => group.key === "sidebar-reports");
  assert.ok(reportsGroup);
  assert.equal(reportsGroup?.items.some((item) => item.label.en === "Export Center" && !item.href), true);
});

test("layout shell exports import without crashing", async () => {
  const layout = await import("../components/layout");
  assert.equal(typeof layout.MeDashboardShell, "function");
  assert.equal(typeof layout.MePageHeader, "function");
  assert.equal(typeof layout.MeRightRail, "function");
  assert.equal(typeof layout.MeDetailWorkspace, "function");
  assert.equal(typeof layout.MeDataTable, "function");
  assert.equal(typeof layout.MeTabs, "function");
  assert.equal(typeof layout.MeStatusTimeline, "function");
});

test("main workspace routes import without crashing", async () => {
  const routes = await Promise.all([
    import("../app/page"),
    import("../app/psi/page"),
    import("../app/psi/procurement/page"),
    import("../app/psi/supplier/page"),
    import("../app/psi/inventory/page"),
    import("../app/reports/page"),
    import("../app/branches/page"),
    import("../app/roles/page"),
    import("../app/tasks/page"),
    import("../app/display-settings/page"),
    import("../app/demo-mode/page"),
    import("../app/demo-readiness/page"),
    import("../app/stakeholder-summary/page"),
    import("../app/navigation/page"),
    import("../app/system-foundation/page"),
  ]);

  for (const route of routes) {
    assert.equal(typeof route.default, "function");
  }
});

test("psi detail page and detail components import without crashing", async () => {
  const [psiRoute, supplierRoute, inventoryRoute, detailWorkspace, dataTable, tabs, supplierPage, inventoryPage] = await Promise.all([
    import("../app/psi/page"),
    import("../app/psi/supplier/page"),
    import("../app/psi/inventory/page"),
    import("../components/layout/me-detail-workspace"),
    import("../components/layout/me-data-table"),
    import("../components/layout/me-tabs"),
    import("../components/psi/psi-supplier-page"),
    import("../components/psi/psi-inventory-page"),
  ]);

  assert.equal(typeof psiRoute.default, "function");
  assert.equal(typeof supplierRoute.default, "function");
  assert.equal(typeof inventoryRoute.default, "function");
  assert.equal(typeof detailWorkspace.MeDetailWorkspace, "function");
  assert.equal(typeof dataTable.MeDataTable, "function");
  assert.equal(typeof tabs.MeTabs, "function");
  assert.equal(typeof supplierPage.PsiSupplierPage, "function");
  assert.equal(typeof inventoryPage.PsiInventoryPage, "function");
});

test("shell and navigation helpers contain no fetch/axios or storage usage", async () => {
  const files = [
    "components/layout/me-dashboard-shell.tsx",
    "components/layout/me-right-rail.tsx",
    "components/navigation/me-sidebar.tsx",
    "components/navigation/me-topbar.tsx",
    "components/display-settings/display-settings-page.tsx",
    "lib/navigation.ts",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
  assert.equal(text.includes("localStorage."), false);
  assert.equal(text.includes("sessionStorage."), false);
});

test(".write_test is not referenced in shell files", async () => {
  const files = [
    "components/layout/me-dashboard-shell.tsx",
    "components/layout/me-page-header.tsx",
    "components/navigation/me-sidebar.tsx",
    "components/navigation/me-topbar.tsx",
    "components/display-settings/display-settings-page.tsx",
    "config/navigation.ts",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);
});

test("primary customer-facing pages do not expose legacy demo wording", async () => {
  const files = [
    "components/business/business-workspace-page.tsx",
    "components/branches/branch-management-figma-page.tsx",
    "components/branches/branch-workspace-page.tsx",
    "components/psi/psi-home-page.tsx",
    "components/psi/psi-supplier-page.tsx",
    "components/psi/psi-inventory-page.tsx",
    "components/psi/psi-issues-page.tsx",
    "components/reports/report-widgets-page.tsx",
    "components/roles/role-workspace-page.tsx",
    "components/tasks/task-engine-page.tsx",
    "components/tasks/task-detail-page.tsx",
    "app/psi/procurement/page.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

  for (const forbidden of [
    "Mock / Read-only",
    "Read-only mock procurement workspace",
    "View Task Placeholder",
    "Open action placeholder",
    "No issue placeholders available",
    "Issue Placeholders",
  ]) {
    assert.equal(text.includes(forbidden), false);
  }
});
