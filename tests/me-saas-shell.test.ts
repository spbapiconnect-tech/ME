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
});

test("main workspace routes import without crashing", async () => {
  const routes = await Promise.all([
    import("../app/page"),
    import("../app/psi/page"),
    import("../app/reports/page"),
    import("../app/branches/page"),
    import("../app/roles/page"),
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

test("shell and navigation helpers contain no fetch/axios or storage usage", async () => {
  const files = [
    "components/layout/me-dashboard-shell.tsx",
    "components/layout/me-right-rail.tsx",
    "components/navigation/me-sidebar.tsx",
    "components/navigation/me-topbar.tsx",
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
    "config/navigation.ts",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);
});
