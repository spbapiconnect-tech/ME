import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { restaurantBrainRules } from "../config/restaurant-brain";
import { restaurantDataModel } from "../config/restaurant-data-model";
import { restaurantFormulas } from "../config/restaurant-formulas";
import { restaurantModules } from "../config/restaurant-modules";
import { restaurantPermissions } from "../config/restaurant-permissions";
import { navigationMap } from "../config/navigation";
import {
  getModulesRequiringBrainLayer,
  getModulesRequiringDataTables,
  getModulesRequiringFormulaLayer,
  getModulesRequiringPermissionLayer,
  getRestaurantModuleByKey,
  getRestaurantModules,
  getRestaurantModulesByGroup,
  getRestaurantModuleSurfaces,
} from "../lib/restaurant-modules";

test("restaurant module config includes required modules", () => {
  const keys = new Set(restaurantModules.map((moduleItem) => moduleItem.key));
  for (const key of [
    "dashboard",
    "branches",
    "psi-workspace",
    "procurement",
    "supplier",
    "inventory",
    "reports",
    "pos-reports",
    "staff",
    "schedule",
    "tasks",
    "training",
    "inspection",
    "issues",
    "sop",
    "expiry",
    "finance",
    "roles",
  ]) {
    assert.equal(keys.has(key), true);
  }
});

test("restaurant module helpers return grouped surfaces and layer requirements", () => {
  assert.equal(getRestaurantModules().length >= 18, true);
  assert.equal(getRestaurantModulesByGroup("people").some((moduleItem) => moduleItem.key === "staff"), true);
  assert.equal(getRestaurantModuleByKey("finance")?.route, "/finance");
  assert.equal(getRestaurantModuleSurfaces().some((surface) => surface.key === "pos-reports" && surface.route === "/reports/pos"), true);
  assert.equal(getModulesRequiringDataTables().length >= 10, true);
  assert.equal(getModulesRequiringFormulaLayer().some((moduleItem) => moduleItem.key === "schedule"), true);
  assert.equal(getModulesRequiringBrainLayer().some((moduleItem) => moduleItem.key === "inspection"), true);
  assert.equal(getModulesRequiringPermissionLayer().some((moduleItem) => moduleItem.key === "roles"), true);
});

test("restaurant data model metadata includes key multidimensional tables", () => {
  const tableKeys = new Set(restaurantDataModel.map((table) => table.key));
  for (const key of [
    "branches",
    "staff",
    "schedules",
    "tasks",
    "training_records",
    "inspections",
    "issues",
    "suppliers",
    "procurement_requests",
    "inventory_stock",
    "recipes",
    "expiry_labels",
    "pos_sales_daily",
    "finance_costs",
    "audit_events",
    "attachments",
  ]) {
    assert.equal(tableKeys.has(key), true);
  }
  assert.equal(restaurantDataModel.every((table) => table.readinessStatus === "planning-only"), true);
});

test("formula catalog is metadata-only", () => {
  assert.equal(restaurantFormulas.length >= 10, true);
  assert.equal(restaurantFormulas.every((formula) => formula.executionStatus === "planning-only"), true);
  assert.equal(restaurantFormulas.every((formula) => formula.inputFields.length >= 2), true);
});

test("brain and permission catalogs are metadata-only", () => {
  assert.equal(restaurantBrainRules.length >= 8, true);
  assert.equal(restaurantBrainRules.every((rule) => rule.notExecutable === true), true);
  assert.equal(restaurantPermissions.length >= 8, true);
  assert.equal(restaurantPermissions.every((permission) => permission.status === "planning-only"), true);
});

test("restaurant routes import without crashing", async () => {
  const routes = await Promise.all([
    import("../app/staff/page"),
    import("../app/schedule/page"),
    import("../app/training/page"),
    import("../app/inspection/page"),
    import("../app/issues/page"),
    import("../app/sop/page"),
    import("../app/expiry/page"),
    import("../app/finance/page"),
    import("../app/reports/pos/page"),
  ]);

  for (const route of routes) {
    assert.equal(typeof route.default, "function");
  }
});

test("operations shared UI imports without crashing", async () => {
  const operations = await import("../components/operations");
  assert.equal(typeof operations.RestaurantModulePage, "function");
  assert.equal(typeof operations.RestaurantModuleTable, "function");
  assert.equal(typeof operations.RestaurantModuleDetailPreview, "function");
  assert.equal(typeof operations.RestaurantModuleRightRail, "function");
});

test("navigation exposes restaurant module groups and active routes", () => {
  const titles = new Set(navigationMap.sidebarGroups.map((group) => group.title.en));
  for (const title of ["Dashboard", "Store Operations", "PSI", "Sales & Reports", "People", "Food Operations", "Finance", "System"]) {
    assert.equal(titles.has(title), true);
  }

  const allLinkedRoutes = new Set(
    navigationMap.sidebarGroups.flatMap((group) => group.items.flatMap((item) => [item.href, ...(item.children?.map((child) => child.href) ?? [])])).filter(Boolean),
  );
  for (const route of ["/staff", "/schedule", "/training", "/inspection", "/issues", "/sop", "/expiry", "/finance", "/reports/pos"]) {
    assert.equal(allLinkedRoutes.has(route), true);
  }
});

test("restaurant module files contain no fetch, axios, storage, prisma, supabase, workflow execution, or notification sending", async () => {
  const files = [
    "config/restaurant-modules.ts",
    "config/restaurant-data-model.ts",
    "config/restaurant-formulas.ts",
    "config/restaurant-brain.ts",
    "config/restaurant-permissions.ts",
    "lib/restaurant-modules.ts",
    "components/operations/restaurant-module-page.tsx",
    "components/operations/restaurant-module-detail-preview.tsx",
    "app/staff/page.tsx",
    "app/schedule/page.tsx",
    "app/training/page.tsx",
    "app/inspection/page.tsx",
    "app/issues/page.tsx",
    "app/sop/page.tsx",
    "app/expiry/page.tsx",
    "app/finance/page.tsx",
    "app/reports/pos/page.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

  for (const forbidden of [
    "fetch(",
    "axios",
    "localStorage.",
    "sessionStorage.",
    "PrismaClient",
    "supabase",
    "createTask(",
    "sendNotification",
    "approve(",
    "stockPost",
  ]) {
    assert.equal(text.includes(forbidden), false);
  }
});

test(".write_test is not referenced and package.json scripts remain unchanged", async () => {
  const files = [
    "config/restaurant-modules.ts",
    "config/restaurant-data-model.ts",
    "config/restaurant-formulas.ts",
    "config/restaurant-brain.ts",
    "config/restaurant-permissions.ts",
    "components/operations/restaurant-module-page.tsx",
    "lib/restaurant-modules.ts",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);

  const pkgRaw = await readFile("package.json", "utf8");
  const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
  assert.equal(pkg.scripts?.build, "next build");
  assert.equal(pkg.scripts?.test, "tsx --test tests/**/*.test.ts");
});
