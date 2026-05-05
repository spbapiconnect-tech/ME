import assert from "node:assert/strict";
import test from "node:test";

import { psiInventoryPageData, psiProcurementPageData, psiSupplierPageData } from "../data/psi";
import {
  getPsiInventoryPageData,
  getPsiProcurementPageData,
  getPsiSupplierPageData,
} from "../lib/services/psi";
import {
  getPsiInventoryDetailPageData,
  getPsiInventoryWorkspacePageData,
  getPsiProcurementDetailPageData,
  getPsiProcurementWorkspacePageData,
  getPsiSupplierDetailPageData,
  getPsiSupplierWorkspacePageData,
} from "../lib/page-data/psi";
import {
  toInventoryDisplayRecords,
  toProcurementDisplayRecords,
  toSupplierDisplayRecords,
} from "../lib/display-adapters/psi";

test("PSI mock data has required minimum records", () => {
  assert.ok(psiProcurementPageData.purchaseRequests.length >= 5);
  assert.ok(psiProcurementPageData.purchaseOrders.length >= 3);
  assert.ok(psiProcurementPageData.receivingRecords.length >= 3);
  assert.ok(psiProcurementPageData.purchaseIssues.length >= 3);

  assert.ok(psiSupplierPageData.suppliers.length >= 5);
  assert.ok(psiInventoryPageData.skus.length >= 8);
});

test("PSI services return DataResult with meta.source mock", async () => {
  const [p, s, i] = await Promise.all([
    getPsiProcurementPageData(),
    getPsiSupplierPageData(),
    getPsiInventoryPageData(),
  ]);

  assert.equal(p.ok, true);
  assert.equal(s.ok, true);
  assert.equal(i.ok, true);

  assert.equal(p.meta.source, "mock");
  assert.equal(s.meta.source, "mock");
  assert.equal(i.meta.source, "mock");
});

test("PSI adapters convert records to display-safe shape", () => {
  const p = toProcurementDisplayRecords(psiProcurementPageData);
  const s = toSupplierDisplayRecords(psiSupplierPageData);
  const i = toInventoryDisplayRecords(psiInventoryPageData);

  for (const records of [p, s, i]) {
    assert.ok(records.length > 0);
    assert.equal(typeof records[0].id, "string");
    assert.equal(typeof records[0].title, "string");
    assert.equal(Array.isArray(records[0].meta), true);
  }
});

test("PSI page-data detail helpers return clean empty for missing IDs", async () => {
  const [p, s, i] = await Promise.all([
    getPsiProcurementDetailPageData("PR-NOT-FOUND"),
    getPsiSupplierDetailPageData("SUP-NOT-FOUND"),
    getPsiInventoryDetailPageData("SKU-NOT-FOUND"),
  ]);

  assert.equal(p.request, null);
  assert.equal(s.supplier, null);
  assert.equal(i.sku, null);
});

test("PSI page-data workspace helpers provide source and isMock", async () => {
  const [p, s, i] = await Promise.all([
    getPsiProcurementWorkspacePageData(),
    getPsiSupplierWorkspacePageData(),
    getPsiInventoryWorkspacePageData(),
  ]);

  assert.equal(p.meta.source, "mock");
  assert.equal(s.meta.source, "mock");
  assert.equal(i.meta.source, "mock");
  assert.equal(p.isMock, true);
  assert.equal(s.isMock, true);
  assert.equal(i.isMock, true);
});

test("psi routes import without crashing", async () => {
  const modules = await Promise.all([
    import("../app/psi/page"),
    import("../app/psi/procurement/page"),
    import("../app/psi/supplier/page"),
    import("../app/psi/inventory/page"),
  ]);

  for (const mod of modules) {
    assert.equal(typeof mod.default, "function");
  }
});

test("no PSI service/repository/helper contains fetch or axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "lib/services/psi/procurement.service.ts",
    "lib/services/psi/supplier.service.ts",
    "lib/services/psi/inventory.service.ts",
    "lib/repositories/mock/psi/procurement.repository.ts",
    "lib/repositories/mock/psi/supplier.repository.ts",
    "lib/repositories/mock/psi/inventory.repository.ts",
    "lib/page-data/psi/procurement-page-data.ts",
    "lib/page-data/psi/supplier-page-data.ts",
    "lib/page-data/psi/inventory-page-data.ts",
  ];

  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(content.includes("fetch("), false);
  assert.equal(content.includes("axios"), false);
});

test("no forbidden legacy brand names in PSI files/docs/components", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "docs/ME_PSI_SERVICE_MVP_DESIGN.md",
    "components/psi/psi-home-page.tsx",
    "components/psi/psi-workspace-page.tsx",
    "components/psi/psi-detail-page.tsx",
  ];
  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

  for (const name of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(content.includes(name), false);
  }
});
