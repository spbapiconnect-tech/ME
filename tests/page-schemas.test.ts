import test from "node:test";
import assert from "node:assert/strict";

import { coreModulePageSchemas, getPageSchema, pageTypeOrder } from "../config/page-schemas";

const coreCodes = ["procurement", "supplier", "inventory", "pos-report", "education", "task"] as const;

test("all six core ME modules have page schema configs", () => {
  for (const code of coreCodes) {
    assert.ok(coreModulePageSchemas[code]);
  }
});

test("each core module has all seven page types", () => {
  for (const code of coreCodes) {
    const schemaMap = coreModulePageSchemas[code];
    assert.deepEqual(Object.keys(schemaMap).sort(), [...pageTypeOrder].sort());
  }
});

test("page schemas include zh/en titles and placeholder mappings", () => {
  for (const code of coreCodes) {
    for (const pageType of pageTypeOrder) {
      const schema = getPageSchema(code, pageType);
      assert.ok(schema.title.zh.length > 0);
      assert.ok(schema.title.en.length > 0);
      assert.ok(schema.apiMapping.endpoint.startsWith(`/api/modules/${code}/`));
      assert.equal(schema.sourceMapping.sourceModule, code);
      assert.equal(schema.sourceMapping.pageType, pageType);
    }
  }
});
