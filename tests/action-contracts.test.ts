import assert from "node:assert/strict";
import test from "node:test";

import { actionRegistry } from "../config/actions";
import {
  getActionByKey,
  getActionExecutionPreview,
  getActionsByIntent,
  getAuditableActions,
  getPlaceholderActions,
} from "../lib/actions";

test("all actions have zh/en labels", () => {
  assert.ok(actionRegistry.length > 0);

  for (const action of actionRegistry) {
    assert.equal(typeof action.label.zh, "string");
    assert.equal(typeof action.label.en, "string");
    assert.ok(action.label.zh.length > 0);
    assert.ok(action.label.en.length > 0);
  }
});

test("all actions include required source/target metadata", () => {
  for (const action of actionRegistry) {
    assert.ok(action.source.sourceModule.length > 0);
    assert.ok(action.source.sourcePage.length > 0);
    assert.ok(action.source.sourceComponent.length > 0);
    assert.ok(action.source.sourceEvent.length > 0);

    assert.ok(action.target.targetAction.length > 0);
    assert.equal(typeof action.requirement.auditRequired, "boolean");
    assert.equal(typeof action.requirement.confirmationRequired, "boolean");
    assert.equal(typeof action.isPlaceholder, "boolean");
  }
});

test("placeholder actions return canExecute=false in execution preview", () => {
  const placeholders = getPlaceholderActions();
  assert.ok(placeholders.length > 0);

  for (const action of placeholders) {
    const preview = getActionExecutionPreview(action);
    assert.equal(preview.canExecute, false);
  }
});

test("auditable actions are discoverable", () => {
  const auditable = getAuditableActions();
  assert.ok(auditable.length > 0);

  for (const action of auditable) {
    assert.equal(action.requirement.auditRequired, true);
  }
});

test("common navigation actions exist", () => {
  for (const key of [
    "openModuleCenter",
    "openTemplates",
    "openComponents",
    "openDemo",
    "openLayoutEngine",
    "openTasks",
  ]) {
    assert.ok(getActionByKey(key));
  }
});

test("module action examples exist for procurement/supplier/inventory/task", () => {
  for (const key of [
    "createPurchaseRequest",
    "addSupplierPlaceholder",
    "adjustStockPlaceholder",
    "openTaskEngine",
  ]) {
    assert.ok(getActionByKey(key));
  }
});

test("actions can be queried by intent", () => {
  assert.ok(getActionsByIntent("navigate").length > 0);
  assert.ok(getActionsByIntent("export").length > 0);
});

test("action helpers contain no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises");

  const libText = await readFile("lib/actions.ts", "utf8");
  assert.equal(libText.includes("fetch("), false);
  assert.equal(libText.includes("axios"), false);
});

test("action configs and docs contain no forbidden legacy brand names", async () => {
  const { readFile } = await import("node:fs/promises");

  const targets = [
    "docs/ME_ACTION_CONTRACTS.md",
    "config/actions/common-actions.ts",
    "config/actions/module-actions.ts",
    "config/actions/demo-actions.ts",
    "config/actions/task-actions.ts",
    "components/actions/action-button.tsx",
    "components/actions/action-preview-card.tsx",
    "components/actions/action-source-card.tsx",
  ];

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false);
  }
});
