import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { navigationMap } from "../config/navigation";
import {
  getApiBoundaryDrafts,
  getEntityMappings,
  getRealDataMappingPageData,
  getUiDataBlocks,
} from "../lib/real-data-mapping";

test("real data mapping page imports without crashing", async () => {
  const [route, page, surfaceCard, entityCard, apiCard, migrationCard] = await Promise.all([
    import("../app/real-data-mapping/page"),
    import("../components/real-data/real-data-mapping-page"),
    import("../components/real-data/real-data-surface-card"),
    import("../components/real-data/entity-mapping-card"),
    import("../components/real-data/api-boundary-card"),
    import("../components/real-data/migration-step-card"),
  ]);

  assert.equal(typeof route.default, "function");
  assert.equal(typeof page.RealDataMappingPage, "function");
  assert.equal(typeof surfaceCard.RealDataSurfaceCard, "function");
  assert.equal(typeof entityCard.EntityMappingCard, "function");
  assert.equal(typeof apiCard.ApiBoundaryCard, "function");
  assert.equal(typeof migrationCard.MigrationStepCard, "function");
});

test("helper returns page data", () => {
  const data = getRealDataMappingPageData();
  assert.equal(data.title.en, "ME Real Data Mapping");
  assert.equal(data.subtitle.en, "Mock-to-real data preparation plan");
  assert.equal(data.uiBlocks.length > 0, true);
  assert.equal(data.entities.length > 0, true);
  assert.equal(data.apiBoundaries.length > 0, true);
  assert.equal(data.migrationSteps.length >= 6, true);
});

test("required surfaces exist", () => {
  const surfaces = new Set(getUiDataBlocks().map((block) => block.surface));
  for (const surface of ["dashboard", "psi-procurement", "psi-supplier", "psi-inventory", "branch-workspace", "reports", "roles"]) {
    assert.equal(surfaces.has(surface), true);
  }
});

test("required entities exist", () => {
  const entities = new Set(getEntityMappings().map((item) => item.entity));
  for (const entity of [
    "branch",
    "user",
    "role",
    "supplier",
    "supplier_contact",
    "procurement_request",
    "procurement_request_item",
    "inventory_item",
    "inventory_stock",
    "stock_movement",
    "issue",
    "task",
    "activity_event",
    "report_widget",
    "report_snapshot",
    "attachment",
    "audit_event",
  ]) {
    assert.equal(entities.has(entity), true);
  }
});

test("required read API boundary drafts exist", () => {
  const boundaries = new Set(getApiBoundaryDrafts().map((item) => `${item.method} ${item.path}`));
  for (const boundary of [
    "GET /api/branches",
    "GET /api/branches/:id",
    "GET /api/suppliers",
    "GET /api/suppliers/:id",
    "GET /api/inventory",
    "GET /api/inventory/:id",
    "GET /api/procurement-requests",
    "GET /api/procurement-requests/:id",
    "GET /api/reports/psi-overview",
    "GET /api/activity-events",
  ]) {
    assert.equal(boundaries.has(boundary), true);
  }
});

test("future write APIs are marked deferred and not implemented", () => {
  const writeBoundaries = getApiBoundaryDrafts().filter((item) => item.readOrWrite === "write-future");
  assert.equal(writeBoundaries.length >= 5, true);
  for (const boundary of writeBoundaries) {
    assert.equal(boundary.status, "future-write-deferred");
  }
});

test("real-data mapping files contain no fetch, axios, prisma, storage, or env references", async () => {
  const files = [
    "types/real-data-mapping.ts",
    "config/real-data-mapping.ts",
    "lib/real-data-mapping.ts",
    "components/real-data/real-data-mapping-page.tsx",
    "components/real-data/real-data-surface-card.tsx",
    "components/real-data/entity-mapping-card.tsx",
    "components/real-data/api-boundary-card.tsx",
    "components/real-data/migration-step-card.tsx",
    "docs/ME_REAL_DATA_MAPPING_PLAN.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
  assert.equal(text.includes("PrismaClient"), false);
  assert.equal(text.includes("localStorage."), false);
  assert.equal(text.includes("sessionStorage."), false);
  assert.equal(text.includes("process.env"), false);
  assert.equal(text.includes("NEXT_PUBLIC_"), false);
  assert.equal(text.includes("SUPABASE"), false);
});

test(".write_test is not referenced in real-data mapping files", async () => {
  const files = [
    "types/real-data-mapping.ts",
    "config/real-data-mapping.ts",
    "lib/real-data-mapping.ts",
    "components/real-data/real-data-mapping-page.tsx",
    "docs/ME_REAL_DATA_MAPPING_PLAN.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);
});

test("package.json unchanged if practical", async () => {
  const pkgRaw = await readFile("package.json", "utf8");
  const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
  assert.equal(pkg.scripts?.build, "next build");
  assert.equal(pkg.scripts?.test, "tsx --test tests/**/*.test.ts");
});

test("navigation config includes real-data-mapping route", () => {
  const foundationGroup = navigationMap.groups.find((group) => group.key === "system-foundation");
  assert.ok(foundationGroup);
  assert.equal(foundationGroup?.items.some((item) => item.key === "real-data-mapping" && item.href === "/real-data-mapping"), true);
  assert.equal(navigationMap.sidebarGroups.some((group) => group.key === "sidebar-system" && group.items.some((item) => item.routeKey === "real-data-mapping")), true);
});
