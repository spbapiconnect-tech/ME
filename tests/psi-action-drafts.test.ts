import assert from "node:assert/strict";
import test from "node:test";

import { psiActionDrafts } from "../config/psi";
import {
  getPsiActionDraftByKey,
  getPsiActionDraftPreview,
  getPsiActionDraftsByModule,
} from "../lib/psi-actions";

test("all PSI action drafts have zh/en titles", () => {
  assert.ok(psiActionDrafts.length > 0);
  for (const item of psiActionDrafts) {
    assert.ok(item.title.zh.length > 0);
    assert.ok(item.title.en.length > 0);
  }
});

test("all PSI action drafts have sections and fields", () => {
  for (const item of psiActionDrafts) {
    assert.ok(item.sections.length > 0);
    assert.ok(item.sections.every((section) => section.fields.length > 0));
  }
});

test("required action drafts exist", () => {
  const requiredKeys = [
    "psi.action.createPurchaseRequest",
    "psi.action.createPurchaseOrder",
    "psi.action.recordReceiving",
    "psi.action.reportPurchaseIssue",
    "psi.action.addSupplier",
    "psi.action.reviewSupplier",
    "psi.action.reportSupplierIssue",
    "psi.action.createSku",
    "psi.action.adjustInventory",
    "psi.action.transferStock",
    "psi.action.reportInventoryIssue",
    "psi.action.createReplenishmentSuggestion",
    "psi.action.previewOnly",
  ];

  for (const key of requiredKeys) {
    assert.ok(getPsiActionDraftByKey(key), `missing action draft: ${key}`);
  }
});

test("preview returns canSubmit false for all current action drafts", () => {
  for (const item of psiActionDrafts) {
    const preview = getPsiActionDraftPreview(item.key);
    assert.equal(preview.canSubmit, false);
  }
});

test("helpers can filter by procurement/supplier/inventory modules", () => {
  assert.ok(getPsiActionDraftsByModule("procurement").length > 0);
  assert.ok(getPsiActionDraftsByModule("supplier").length > 0);
  assert.ok(getPsiActionDraftsByModule("inventory").length > 0);
});

test("psi action routes import without crashing", async () => {
  const listRoute = await import("../app/psi/actions/page");
  const detailRoute = await import("../app/psi/actions/[actionKey]/page");
  assert.equal(typeof listRoute.default, "function");
  assert.equal(typeof detailRoute.default, "function");
});

test("PSI action helpers do not contain fetch or axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const content = await readFile("lib/psi-actions.ts", "utf8");
  assert.equal(content.includes("fetch("), false);
  assert.equal(content.includes("axios"), false);
});

test("no forbidden legacy brand names in PSI action files/docs/components", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "docs/ME_PSI_ACTION_DRAFTS.md",
    "components/psi/actions/psi-actions-page.tsx",
    "components/psi/actions/psi-action-detail-page.tsx",
    "config/psi/action-drafts.ts",
  ];

  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(content.includes(legacy), false);
  }
});

test(".write_test is not referenced in PSI action helper file", async () => {
  const { readFile } = await import("node:fs/promises");
  const content = await readFile("lib/psi-actions.ts", "utf8");
  assert.equal(content.includes(".write_test"), false);
});
