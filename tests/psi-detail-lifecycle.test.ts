import assert from "node:assert/strict";
import test from "node:test";

import {
  psiInventoryIssueLifecycleStages,
  psiProcurementIssueLifecycleStages,
  psiReceivingLifecycleStages,
  psiStockRiskLifecycleStages,
  psiSupplierIssueLifecycleStages,
} from "../config/psi";
import {
  getCurrentPsiLifecycleStage,
  getPsiLinkedRecordsForSource,
  getPsiTimelineBySource,
} from "../lib/psi-lifecycle";
import {
  getPsiInventoryDetailPageData,
  getPsiInventoryWorkspacePageData,
  getPsiProcurementDetailPageData,
  getPsiProcurementWorkspacePageData,
  getPsiSupplierDetailPageData,
  getPsiSupplierWorkspacePageData,
} from "../lib/page-data/psi";

test("PSI lifecycle configs exist for required modules", () => {
  assert.ok(psiProcurementIssueLifecycleStages.length > 0);
  assert.ok(psiSupplierIssueLifecycleStages.length > 0);
  assert.ok(psiInventoryIssueLifecycleStages.length > 0);
  assert.ok(psiReceivingLifecycleStages.length > 0);
  assert.ok(psiStockRiskLifecycleStages.length > 0);
});

test("current lifecycle helper returns one stage", () => {
  const stage = getCurrentPsiLifecycleStage(psiProcurementIssueLifecycleStages);
  assert.ok(stage);
  assert.equal(stage?.isCurrent, true);
});

test("timeline placeholder helper returns zh/en titles", () => {
  const timeline = getPsiTimelineBySource({
    moduleCode: "procurement",
    recordId: "PR-001",
    recordType: "purchase-request",
    route: "/psi/procurement/PR-001",
  });
  assert.ok(timeline.length > 0);
  assert.ok(timeline.every((event) => event.title.zh.length > 0 && event.title.en.length > 0));
});

test("linked records helper returns safe rows", () => {
  const rows = getPsiLinkedRecordsForSource({
    moduleCode: "supplier",
    recordId: "SUP-001",
    recordType: "supplier",
    route: "/psi/supplier/SUP-001",
    actionDraftKey: "psi.action.reviewSupplier",
  });
  assert.ok(rows.length > 0);
  assert.ok(rows.every((row) => row.moduleCode.length > 0 && row.recordId.length > 0));
});

test("detail page-data helpers include detailPanelData", async () => {
  const [pWorkspace, sWorkspace, iWorkspace] = await Promise.all([
    getPsiProcurementWorkspacePageData(),
    getPsiSupplierWorkspacePageData(),
    getPsiInventoryWorkspacePageData(),
  ]);

  const procurementId = pWorkspace.pageData?.purchaseRequests[0]?.requestId;
  const supplierId = sWorkspace.pageData?.suppliers[0]?.supplierId;
  const inventoryId = iWorkspace.pageData?.skus[0]?.skuId;

  assert.ok(procurementId);
  assert.ok(supplierId);
  assert.ok(inventoryId);

  const [procurement, supplier, inventory] = await Promise.all([
    getPsiProcurementDetailPageData(procurementId!),
    getPsiSupplierDetailPageData(supplierId!),
    getPsiInventoryDetailPageData(inventoryId!),
  ]);

  assert.ok(procurement.detailPanelData);
  assert.ok(supplier.detailPanelData);
  assert.ok(inventory.detailPanelData);
});

test("not-found details return clean null and empty states", async () => {
  const [procurement, supplier, inventory] = await Promise.all([
    getPsiProcurementDetailPageData("PR-NOT-FOUND"),
    getPsiSupplierDetailPageData("SUP-NOT-FOUND"),
    getPsiInventoryDetailPageData("SKU-NOT-FOUND"),
  ]);

  assert.equal(procurement.detailPanelData, null);
  assert.equal(procurement.timeline.length, 0);
  assert.equal(supplier.detailPanelData, null);
  assert.equal(inventory.detailPanelData, null);
});

test("detail UI and optional issues route import without crashing", async () => {
  const modules = await Promise.all([
    import("../components/psi/detail/psi-detail-notice"),
    import("../components/psi/detail/psi-lifecycle-strip"),
    import("../components/psi/detail/psi-linked-records-card"),
    import("../components/psi/detail/psi-insights-card"),
    import("../components/psi/detail/psi-related-actions-card"),
    import("../components/psi/detail/psi-related-tasks-card"),
    import("../components/psi/detail/psi-timeline"),
    import("../components/psi/psi-detail-page"),
    import("../app/psi/issues/page"),
  ]);
  for (const mod of modules) {
    assert.ok(Object.keys(mod).length > 0);
  }
});

test("no PSI lifecycle/helper/display/page-data contains fetch or axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "config/psi/lifecycle.ts",
    "lib/psi-lifecycle.ts",
    "lib/display-adapters/psi/procurement.adapter.ts",
    "lib/display-adapters/psi/supplier.adapter.ts",
    "lib/display-adapters/psi/inventory.adapter.ts",
    "lib/page-data/psi/procurement-page-data.ts",
    "lib/page-data/psi/supplier-page-data.ts",
    "lib/page-data/psi/inventory-page-data.ts",
    "lib/page-data/psi/issues-page-data.ts",
  ];

  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(content.includes("fetch("), false);
  assert.equal(content.includes("axios"), false);
});

test("no forbidden legacy brand names in PSI lifecycle docs/components/files", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "docs/ME_PSI_DETAIL_LIFECYCLE_TIMELINE.md",
    "components/psi/psi-detail-page.tsx",
    "components/psi/detail/x1.tsx",
    "lib/psi-lifecycle.ts",
    "config/psi/lifecycle.ts",
    "types/psi/lifecycle.ts",
  ];
  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(content.includes(legacy), false);
  }
});

test(".write_test is not referenced in PSI lifecycle files", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "config/psi/lifecycle.ts",
    "lib/psi-lifecycle.ts",
    "lib/display-adapters/psi/procurement.adapter.ts",
    "lib/page-data/psi/issues-page-data.ts",
    "components/psi/psi-detail-page.tsx",
    "components/psi/psi-workspace-page.tsx",
  ];
  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(content.includes(".write_test"), false);
});
