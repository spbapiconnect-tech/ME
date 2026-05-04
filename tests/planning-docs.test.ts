import assert from "node:assert/strict";
import test from "node:test";

const planningDocs = [
  "docs/ME_PROCUREMENT_SUPPLIER_INVENTORY_MVP_PLAN.md",
  "docs/ME_DATA_MODEL_PLANNING.md",
  "docs/ME_MOCK_TO_REAL_MIGRATION_PLAN.md",
  "docs/ME_API_BOUNDARY_PLANNING.md",
  "docs/ME_MASTER_PROJECT_SCOPE.md",
  "docs/ME_PROJECT_TASKS_GIT_WORKFLOW.md",
  "docs/ME_DEMO_READINESS.md",
];

test("required ME planning docs exist", async () => {
  const { access } = await import("node:fs/promises");

  for (const path of planningDocs) {
    await access(path);
  }
});

test("ME planning docs keep the milestone planning-only with no real database or API", async () => {
  const { readFile } = await import("node:fs/promises");
  const contents = await Promise.all(planningDocs.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const requiredText of [
    "planning-only",
    "No real database",
    "No real API",
    "No implementation is included yet",
  ]) {
    assert.equal(text.includes(requiredText), true);
  }
});

test("ME planning docs mention Layout Engine compatibility and migration boundaries", async () => {
  const { readFile } = await import("node:fs/promises");
  const [planDoc, migrationDoc, scopeDoc] = await Promise.all([
    readFile("docs/ME_PROCUREMENT_SUPPLIER_INVENTORY_MVP_PLAN.md", "utf8"),
    readFile("docs/ME_MOCK_TO_REAL_MIGRATION_PLAN.md", "utf8"),
    readFile("docs/ME_MASTER_PROJECT_SCOPE.md", "utf8"),
  ]);

  assert.equal(planDoc.includes("## Layout Engine Compatibility"), true);
  assert.equal(planDoc.includes("ModulePageRenderer"), true);
  assert.equal(migrationDoc.includes("DisplayModelAdapter"), true);
  assert.equal(scopeDoc.includes("schema-driven and renderer-compatible"), true);
});

test("ME API boundary planning includes the expected future endpoint placeholders", async () => {
  const { readFile } = await import("node:fs/promises");
  const apiDoc = await readFile("docs/ME_API_BOUNDARY_PLANNING.md", "utf8");

  for (const endpoint of [
    "GET /api/procurement/requests",
    "POST /api/procurement/orders",
    "GET /api/suppliers/:id/products",
    "GET /api/inventory/stock",
    "POST /api/inventory/receiving-preview",
    "GET /api/tasks?sourceModule=inventory",
  ]) {
    assert.equal(apiDoc.includes(endpoint), true);
  }
});

test("ME planning docs contain no forbidden legacy brand names", async () => {
  const { readFile } = await import("node:fs/promises");
  const contents = await Promise.all(planningDocs.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false);
  }
});
