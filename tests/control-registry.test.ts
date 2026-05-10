import assert from "node:assert/strict";
import test from "node:test";

import { controlRegistry } from "../config/control-registry";
import {
  canControlExecuteNow,
  getControlByKey,
  getControlFeedback,
  getControlsByLayer,
  getControlsByModule,
  getControlsByRoute,
} from "../lib/control-registry";

const layers = [
  "UI_ONLY",
  "PREVIEW_ACTION",
  "FORMULA_METADATA",
  "BRAIN_METADATA",
  "FUTURE_WRITE",
  "EXTERNAL_INTEGRATION",
] as const;

test("control registry exports data", () => {
  assert.ok(controlRegistry.length > 20);
  assert.equal(typeof controlRegistry[0].key, "string");
});

test("required control layers exist", () => {
  for (const layer of layers) {
    assert.ok(getControlsByLayer(layer).length > 0);
  }
});

test("required PSI controls exist", () => {
  for (const key of [
    "table.saved_views",
    "table.filters",
    "table.columns",
    "table.density",
    "table.sort",
    "table.export",
    "table.more_filters",
    "table.row_selection",
    "table.clear_selection",
    "inventory.create_pr_preview",
    "supplier.create_pr_preview",
    "procurement.approve_preview",
    "receiving.post_stock_preview",
  ]) {
    assert.notEqual(getControlByKey(key), undefined);
  }
});

test("FUTURE_WRITE controls are not executable now", () => {
  const futureWriteControls = getControlsByLayer("FUTURE_WRITE");
  assert.ok(futureWriteControls.length > 0);
  for (const control of futureWriteControls) {
    assert.equal(control.allowedNow, false);
    assert.equal(canControlExecuteNow(control.key), false);
  }
});

test("FORMULA_METADATA and BRAIN_METADATA are display-only boundaries", () => {
  for (const layer of ["FORMULA_METADATA", "BRAIN_METADATA"] as const) {
    const controls = getControlsByLayer(layer);
    for (const control of controls) {
      assert.equal(control.allowedNow, true);
      assert.ok(control.executionBoundary.includes("no_formula_engine_execution") || control.executionBoundary.includes("no_brain_execution"));
    }
  }
});

test("helper queries work", () => {
  assert.ok(getControlsByModule("inventory").length > 0);
  assert.ok(getControlsByRoute("/psi/inventory").length > 0);
  assert.equal(getControlFeedback("table.columns").length > 0, true);
  assert.equal(getControlFeedback("unknown.key"), "Control not registered.");
});

test("control helper and config contain no fetch/axios/storage usage", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "config/control-registry.ts",
    "lib/control-registry.ts",
    "types/control-registry.ts",
  ];
  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

  for (const forbidden of ["fetch(", "axios", "localStorage.", "sessionStorage.", "PrismaClient"]) {
    assert.equal(content.includes(forbidden), false);
  }
});

test(".write_test is not referenced and docs exist", async () => {
  const { readFile, access } = await import("node:fs/promises");
  await access("docs/ME_CONTROL_INTERACTION_CONTRACT.md");

  const files = [
    "docs/ME_CONTROL_INTERACTION_CONTRACT.md",
    "config/control-registry.ts",
    "lib/control-registry.ts",
  ];
  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(content.includes(".write_test"), false);
});
