import assert from "node:assert/strict";
import test from "node:test";

const governanceDocs = [
  "docs/README.md",
  "docs/DESIGN.md",
  "docs/ME_MASTER_PROJECT_SCOPE.md",
  "docs/ME_REAL_PRODUCT_ROADMAP.md",
  "docs/ME_UI_METRICS.md",
  "docs/ME_VISUAL_SYSTEM.md",
  "docs/ME_MODULE_ARCHITECTURE.md",
  "docs/ME_PAGE_TEMPLATES.md",
  "docs/ME_MODULE_ADD_GUIDE.md",
  "docs/ME_DATA_FORMULA_BRAIN_SEPARATION.md",
  "docs/ME_MAINTENANCE_GUIDE.md",
  "docs/ME_CODEX_TASK.md",
];

test("ME governance docs exist", async () => {
  const { access } = await import("node:fs/promises");

  for (const path of governanceDocs) {
    await access(path);
  }
});

test("DESIGN.md links to the governance source-of-truth docs", async () => {
  const { readFile } = await import("node:fs/promises");
  const designDoc = await readFile("docs/DESIGN.md", "utf8");

  for (const path of [
    "ME_UI_METRICS.md",
    "ME_VISUAL_SYSTEM.md",
    "ME_PAGE_TEMPLATES.md",
    "ME_MODULE_ARCHITECTURE.md",
    "ME_MAINTENANCE_GUIDE.md",
  ]) {
    assert.equal(designDoc.includes(path), true);
  }
});

test("roadmap includes phases 0 through 10", async () => {
  const { readFile } = await import("node:fs/promises");
  const roadmap = await readFile("docs/ME_REAL_PRODUCT_ROADMAP.md", "utf8");

  for (const phase of [
    "Phase 0",
    "Phase 1",
    "Phase 2",
    "Phase 3",
    "Phase 4",
    "Phase 5",
    "Phase 6",
    "Phase 7",
    "Phase 8",
    "Phase 9",
    "Phase 10",
  ]) {
    assert.equal(roadmap.includes(phase), true);
  }
});

test("maintenance guide keeps the .write_test safeguard visible", async () => {
  const { readFile } = await import("node:fs/promises");
  const maintenanceGuide = await readFile("docs/ME_MAINTENANCE_GUIDE.md", "utf8");

  assert.equal(maintenanceGuide.includes(".write_test"), true);
});
