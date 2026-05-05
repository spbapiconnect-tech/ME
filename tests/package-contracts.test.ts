import assert from "node:assert/strict";
import test from "node:test";

import { packageContracts, packageGroups } from "../config/packages";
import {
  getActivePackages,
  getPackageByKey,
  getPackageGroupPackages,
  getPackagePreview,
  getPackagesByCategory,
  getPackagesByFeatureType,
  getPackagesByModule,
  getPackagesByTier,
  getPlaceholderPackages,
} from "../lib/packages";

test("all packages have zh/en names", () => {
  assert.ok(packageContracts.length > 0);

  for (const pkg of packageContracts) {
    assert.ok(pkg.name.zh.length > 0);
    assert.ok(pkg.name.en.length > 0);
  }
});

test("all packages include modules/features/limits/requirement metadata", () => {
  for (const pkg of packageContracts) {
    assert.ok(Array.isArray(pkg.modules));
    assert.ok(Array.isArray(pkg.features));
    assert.ok(Array.isArray(pkg.limits));
    assert.equal(typeof pkg.requirement.auditRequired, "boolean");
    assert.equal(typeof pkg.requirement.isPlaceholder, "boolean");
  }
});

test("placeholder/coming-soon/blocked/disabled packages return canUse=false", () => {
  const blocked = packageContracts.filter((pkg) => ["placeholder", "coming-soon", "blocked", "disabled"].includes(pkg.status));
  assert.ok(blocked.length > 0);

  for (const pkg of blocked) {
    const preview = getPackagePreview(pkg);
    assert.equal(preview.canUse, false);
  }
});

test("active packages return canUse=true as metadata preview", () => {
  const active = packageContracts.filter((pkg) => pkg.status === "active");
  assert.ok(active.length > 0);

  for (const pkg of active) {
    const preview = getPackagePreview(pkg);
    assert.equal(preview.canUse, true);
  }
});

test("package groups have zh/en names and valid package keys", () => {
  assert.ok(packageGroups.length > 0);

  for (const group of packageGroups) {
    assert.ok(group.name.zh.length > 0);
    assert.ok(group.name.en.length > 0);

    for (const packageKey of group.packages) {
      assert.ok(getPackageByKey(packageKey));
    }
  }
});

test("package helpers can find base plans and required packs", () => {
  assert.ok(getPackagesByTier("starter").some((pkg) => pkg.key === "package.plan.starter"));
  assert.ok(getPackagesByTier("ops").some((pkg) => pkg.key === "package.plan.ops"));
  assert.ok(getPackagesByTier("pro").some((pkg) => pkg.key === "package.plan.pro"));
  assert.ok(getPackagesByTier("enterprise").some((pkg) => pkg.key === "package.plan.enterprise"));

  assert.ok(getPackageByKey("package.pack.procurement"));
  assert.ok(getPackageByKey("package.pack.inventory"));
  assert.ok(getPackageByKey("package.pack.supplier"));
  assert.ok(getPackageByKey("package.pack.task-control"));
  assert.ok(getPackageByKey("package.pack.education"));
  assert.ok(getPackageByKey("package.pack.pos-report"));

  assert.ok(getPackagesByCategory("base-plan").length > 0);
  assert.ok(getPackagesByFeatureType("rule").length > 0);
  assert.ok(getPackagesByModule("procurement").length > 0);
  assert.ok(getActivePackages().length > 0);
  assert.ok(getPlaceholderPackages().length > 0);
});

test("package group helper resolves members", () => {
  const items = getPackageGroupPackages("packages.base-plans");
  assert.ok(items.length >= 4);
});

test("packages route import exists", async () => {
  const route = await import("../app/packages/page");
  assert.equal(typeof route.default, "function");
});

test("package helper contains no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile("lib/packages.ts", "utf8");

  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
});

test("no forbidden legacy brand names in package config/docs/components", async () => {
  const { readFile } = await import("node:fs/promises");

  const targets = [
    "docs/ME_PACKAGE_CONTRACTS.md",
    "config/packages/package-contracts.ts",
    "config/packages/package-groups.ts",
    "components/packages/packages-page.tsx",
    "components/packages/package-card.tsx",
    "components/packages/package-preview-card.tsx",
  ];

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false);
  }
});
