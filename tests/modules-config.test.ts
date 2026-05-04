import test from "node:test";
import assert from "node:assert/strict";

import enMessages from "../messages/en.json";
import zhMessages from "../messages/zh.json";
import { moduleRegistry } from "../config/modules";
import { getEnabledModules, getModuleStats } from "../lib/modules";

const requiredCoreCodes = [
  "procurement",
  "supplier",
  "inventory",
  "pos-report",
  "education",
  "task",
] as const;

test("ME module registry includes all required current core module codes", () => {
  const codes = moduleRegistry.map((module) => module.code);

  for (const code of requiredCoreCodes) {
    assert.equal(codes.includes(code), true);
  }
});

test("every registered module supports the three approved themes and expanded routes", () => {
  for (const module of moduleRegistry) {
    assert.deepEqual(module.themeSupport, ["bright", "dark", "moon"]);
    assert.deepEqual(module.languageSupport, ["zh", "en"]);
    assert.equal(Object.keys(module.routes).length, 8);
    assert.ok(module.permissions.length >= 1);
    assert.ok(module.apiScope.length >= 1);
  }
});

test("module stats expose expected counts for the registry foundation", () => {
  const stats = getModuleStats(moduleRegistry);

  assert.equal(stats.total, moduleRegistry.length);
  assert.ok(stats.enabled >= 3);
  assert.ok(stats.comingSoon >= 1);
  assert.ok(getEnabledModules(moduleRegistry).length >= stats.enabled);
});

test("message catalogs cover critical module center labels in both languages", () => {
  const requiredLabels = ["moduleCenter", "moduleRegistry", "totalModules", "enabledModules"] as const;

  for (const label of requiredLabels) {
    assert.ok(enMessages.common[label].length > 0);
    assert.ok(zhMessages.common[label].length > 0);
  }
});

test("forbidden legacy brand names are not present in public ME catalogs", () => {
  const publicText = JSON.stringify({ enMessages, zhMessages, codes: requiredCoreCodes });

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(publicText.includes(legacyName), false);
  }
});
