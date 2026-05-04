import assert from "node:assert/strict";
import test from "node:test";

import { layoutRegistry, skinRegistry, toDisplayRecord } from "../config/layout-engine";
import { ModulePageRenderer } from "../components/layout-engine/module-page-renderer";

const expectedPageTypes = ["dashboard", "listing", "detail", "issue", "form", "report", "settings"];

test("all ME skin registry entries have zh/en names and page type support", () => {
  for (const skin of skinRegistry) {
    assert.ok(skin.name.zh.length > 0);
    assert.ok(skin.name.en.length > 0);
    assert.ok(skin.supportedPageTypes.length > 0);
  }
});

test("layout registry contains expected page types", () => {
  const pageTypes = new Set(layoutRegistry.map((item) => item.pageType));
  assert.deepEqual([...pageTypes].sort(), [...expectedPageTypes].sort());
});

test("display model adapter returns safe fallback for generic records", () => {
  const displayRecord = toDisplayRecord({ randomField: "demo" });
  assert.equal(displayRecord.id, "unknown-record");
  assert.equal(displayRecord.title, "unknown-record");
  assert.equal(displayRecord.subtitle, "--");
  assert.equal(displayRecord.source.moduleCode, "task");
});

test("ModulePageRenderer imports without crashing", () => {
  assert.equal(typeof ModulePageRenderer, "function");
});

test("no forbidden legacy brand names in new layout engine public files", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = await Promise.all([
    readFile("types/layout-engine.ts", "utf8"),
    readFile("types/display-model.ts", "utf8"),
    readFile("types/skin.ts", "utf8"),
    readFile("docs/ME_MASTER_PROJECT_SCOPE.md", "utf8"),
    readFile("docs/ME_UI_ARCHITECTURE.md", "utf8"),
    readFile("docs/ME_PROJECT_TASKS_GIT_WORKFLOW.md", "utf8"),
    readFile("docs/ME_DEMO_READINESS.md", "utf8"),
  ]);
  const publicText = JSON.stringify(files);

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(publicText.includes(legacyName), false);
  }
});
