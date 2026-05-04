import test from "node:test";
import assert from "node:assert/strict";

import enMessages from "../messages/en.json";
import zhMessages from "../messages/zh.json";
import { coreModules } from "../config/modules";

const requiredCodes = [
  "procurement",
  "supplier",
  "inventory",
  "pos-report",
  "education",
  "task",
] as const;

test("ME core module registry includes all required module codes", () => {
  assert.deepEqual(
    coreModules.map((module) => module.code),
    requiredCodes,
  );
});

test("every module supports the three approved themes and placeholder routes", () => {
  for (const module of coreModules) {
    assert.deepEqual(module.themeSupport, ["bright", "dark", "moon"]);
    assert.equal(Object.keys(module.routes).length, 5);
    assert.ok(module.permissions.length >= 2);
  }
});

test("message catalogs cover all module names in both languages", () => {
  for (const code of requiredCodes) {
    assert.ok(enMessages.modules[code].name.length > 0);
    assert.ok(zhMessages.modules[code].name.length > 0);
  }
});

test("forbidden legacy brand names are not present in the public ME catalogs", () => {
  const publicText = JSON.stringify({ enMessages, zhMessages, codes: requiredCodes });

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(publicText.includes(legacyName), false);
  }
});
