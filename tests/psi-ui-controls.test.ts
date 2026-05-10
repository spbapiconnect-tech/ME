import assert from "node:assert/strict";
import test from "node:test";

import { getControlByKey, canControlExecuteNow } from "../lib/control-registry";

const pageFiles = [
  "app/psi/inventory/page.tsx",
  "app/psi/supplier/page.tsx",
  "app/psi/procurement/page.tsx",
  "app/psi/receiving/page.tsx",
];

test("PSI pages import and include multidimensional table pattern", async () => {
  const { readFile } = await import("node:fs/promises");
  for (const file of pageFiles) {
    const content = await readFile(file, "utf8");
    assert.equal(content.includes("TableActionBar"), true);
    assert.equal(content.includes("MultidimensionalTable"), true);
    assert.equal(content.includes("RecordDetailPanel"), true);
  }
});

test("inventory page includes required page-size and detail fields", async () => {
  const { readFile } = await import("node:fs/promises");
  const content = await readFile("app/psi/inventory/page.tsx", "utf8");

  for (const required of [
    "Showing 1–20 of 872",
    "Purchase UOM",
    "Unit Cost",
    "BOM Usage",
    "Reorder Point",
  ]) {
    assert.equal(content.includes(required), true);
  }
});

test("required PSI control keys are present and boundaries remain preview-only", () => {
  for (const key of [
    "table.columns",
    "table.density",
    "table.sort",
    "table.export",
    "table.more_filters",
    "inventory.create_pr_preview",
    "inventory.count_stock_preview",
    "supplier.create_pr_preview",
    "procurement.approve_preview",
    "procurement.link_receiving_preview",
    "receiving.review_variance_preview",
    "receiving.post_stock_preview",
  ]) {
    assert.notEqual(getControlByKey(key), undefined);
  }

  for (const key of ["procurement.reject_preview", "receiving.post_stock_preview"]) {
    const control = getControlByKey(key);
    assert.notEqual(control, undefined);
    assert.equal(control?.layer === "PREVIEW_ACTION" || control?.layer === "FUTURE_WRITE", true);
  }

  const futureWriteKeys = ["future.create_pr", "future.approve_pr", "future.post_stock", "future.update_inventory"];
  for (const key of futureWriteKeys) {
    assert.equal(canControlExecuteNow(key), false);
  }
});

test("no forbidden runtime integrations or persistence in updated PSI pages and controls", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "components/operations/table-action-bar.tsx",
    "components/operations/record-detail-panel.tsx",
    "components/operations/multidimensional-table.tsx",
    ...pageFiles,
  ];
  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

  for (const forbidden of ["fetch(", "axios", "localStorage.", "sessionStorage.", "PrismaClient", "supabase", ".write_test"]) {
    assert.equal(content.includes(forbidden), false);
  }
});
