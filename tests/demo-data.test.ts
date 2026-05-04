import assert from "node:assert/strict";
import test from "node:test";

import { coreModulePageSchemas } from "../config/page-schemas";
import { demoModuleCodes, demoModuleDataMap } from "../data/demo";

const expectedDemoCodes = Object.keys(coreModulePageSchemas).sort();

test("all six ME demo modules have local demo data", () => {
  assert.deepEqual([...demoModuleCodes].sort(), expectedDemoCodes);

  for (const code of demoModuleCodes) {
    assert.ok(demoModuleDataMap[code]);
  }
});

test("each demo module includes required workspace sections", () => {
  for (const code of demoModuleCodes) {
    const demoData = demoModuleDataMap[code];
    assert.ok(demoData.kpis.length > 0);
    assert.ok(demoData.listingRows.length > 0);
    assert.ok(Object.keys(demoData.detailRecord).length > 0);
    assert.ok(demoData.issues.length > 0);
    assert.ok(demoData.timeline.length > 0);
    assert.ok(demoData.formPlaceholders.length > 0);
    assert.ok(demoData.reportRows.length > 0);
  }
});

test("demo module codes match the schema-driven ME module codes", () => {
  assert.deepEqual([...demoModuleCodes].sort(), expectedDemoCodes);
});

test("demo data contains no forbidden legacy brand names", () => {
  const serialized = JSON.stringify(demoModuleDataMap);

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(serialized.includes(legacyName), false);
  }
});
