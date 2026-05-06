import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { navigationMap } from "../config/navigation";
import {
  getBusinessNavigationItems,
  getFoundationNavigationItems,
  getNavigationGroupByKey,
  getNavigationItemByKey,
  getNavigationMap,
  getNavigationItemsByGroup,
} from "../lib/navigation";

test("navigation map has business/operations/reports/system groups", () => {
  const groups = new Set(getNavigationMap().groups.map((group) => group.key));
  for (const key of ["business", "operations", "reports", "system-foundation"]) {
    assert.equal(groups.has(key), true);
  }
});

test("system foundation group includes required routes", () => {
  const group = getNavigationGroupByKey("system-foundation");
  assert.ok(group);
  const routes = new Set(group?.items.map((item) => item.href));
  for (const route of [
    "/layout-engine",
    "/action-contracts",
    "/access-control",
    "/roles",
    "/audit-trail",
    "/workflow",
    "/notifications",
    "/reports",
    "/rules",
    "/packages",
  ]) {
    assert.equal(routes.has(route), true);
  }
});

test("business group includes dashboard and PSI workspace", () => {
  const routes = new Set(getBusinessNavigationItems().map((item) => item.href));
  assert.equal(routes.has("/"), true);
  assert.equal(routes.has("/psi"), true);
});

test("operations group includes required PSI routes", () => {
  const routes = new Set(getNavigationItemsByGroup("operations").map((item) => item.href));
  for (const route of ["/psi/procurement", "/psi/supplier", "/psi/inventory", "/psi/actions", "/psi/issues"]) {
    assert.equal(routes.has(route), true);
  }
});

test("navigation helpers resolve items by key and group", () => {
  const item = getNavigationItemByKey("navigation-ia");
  const roles = getNavigationItemByKey("roles");
  const group = getNavigationGroupByKey("reports");
  assert.equal(item?.href, "/navigation");
  assert.equal(roles?.href, "/roles");
  assert.equal(group?.items.some((groupItem) => groupItem.key === "reports"), true);
  assert.ok(getFoundationNavigationItems().length >= 10);
});

test("/navigation route imports without crashing", async () => {
  const route = await import("../app/navigation/page");
  assert.equal(typeof route.default, "function");
});

test("homepage imports without crashing", async () => {
  const route = await import("../app/page");
  assert.equal(typeof route.default, "function");
});

test("system foundation route imports without crashing", async () => {
  const route = await import("../app/system-foundation/page");
  assert.equal(typeof route.default, "function");
});

test("navigation helper contains no fetch or axios", async () => {
  const helper = await readFile("lib/navigation.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("no forbidden legacy brand names in navigation config/docs/components", async () => {
  const files = [
    "config/navigation.ts",
    "components/navigation/me-sidebar.tsx",
    "components/navigation/me-topbar.tsx",
    "components/navigation/me-navigation-page.tsx",
    "docs/ME_NAVIGATION_IA.md",
    "docs/ME_BUSINESS_FRONTEND_EXPERIENCE.md",
    "docs/ME_UI_ARCHITECTURE.md",
    "docs/ME_DEMO_READINESS.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced", async () => {
  const files = [
    "config/navigation.ts",
    "components/navigation/me-sidebar.tsx",
    "components/navigation/me-topbar.tsx",
    "components/navigation/me-navigation-page.tsx",
    "docs/ME_NAVIGATION_IA.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);
});

test("package.json remains unchanged for scripts", async () => {
  const pkgRaw = await readFile("package.json", "utf8");
  const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
  assert.equal(pkg.scripts?.build, "next build");
  assert.equal(pkg.scripts?.test, "tsx --test tests/**/*.test.ts");
});

test("navigation config exports expected primary destinations", () => {
  const primaryKeys = navigationMap.primaryItems.map((item) => item.key);
  for (const key of ["dashboard", "psi-workspace", "reports", "system-foundation"]) {
    assert.equal(primaryKeys.includes(key), true);
  }
});
