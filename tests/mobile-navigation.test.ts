import assert from "node:assert/strict";
import test from "node:test";

import { getNavigationItemByKey } from "../lib/navigation";
import { erpMobileBottomNavItems } from "../components/erp/erp-mobile-bottom-nav";
import { mobileModuleCategories } from "../components/erp/erp-mobile-module-launcher";

test("mobile ERP navigation components import without crashing", async () => {
  const [bottomNav, launcher, visualHeader] = await Promise.all([
    import("../components/erp/erp-mobile-bottom-nav"),
    import("../components/erp/erp-mobile-module-launcher"),
    import("../components/erp/erp-module-visual-header"),
  ]);

  assert.equal(typeof bottomNav.ErpMobileBottomNav, "function");
  assert.equal(typeof launcher.ErpMobileModuleLauncher, "function");
  assert.equal(typeof visualHeader.ErpModuleVisualHeader, "function");
});

test("mobile bottom nav uses the required five-slot pattern", () => {
  assert.equal(erpMobileBottomNavItems.length, 4);

  const keys = erpMobileBottomNavItems.map((item) => item.key);
  for (const required of ["dashboard", "operations", "psi", "workforce"]) {
    assert.equal(keys.includes(required), true);
  }
});

test("mobile module launcher keys resolve to valid navigation routes", () => {
  for (const category of mobileModuleCategories) {
    assert.ok(category.title.length > 0);
    for (const key of category.itemKeys) {
      const item = getNavigationItemByKey(key);
      assert.notEqual(item, undefined, `missing navigation key: ${key}`);
      assert.equal(item?.href.startsWith("/"), true);
    }
  }
});

test("mobile navigation files contain no fetch/axios/storage/db/write execution calls", async () => {
  const { readFile } = await import("node:fs/promises");

  const files = [
    "components/erp/erp-shell.tsx",
    "components/erp/erp-mobile-bottom-nav.tsx",
    "components/erp/erp-mobile-module-launcher.tsx",
    "components/erp/erp-module-visual-header.tsx",
    "components/erp/erp-sidebar.tsx",
    "config/navigation.ts",
    "lib/navigation.ts",
  ];

  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

  for (const forbidden of [
    "fetch(",
    "axios",
    "localStorage.",
    "sessionStorage.",
    "PrismaClient",
    "supabase",
    "executeWorkflow(",
    "approve(",
    "stockPost(",
  ]) {
    assert.equal(content.includes(forbidden), false);
  }
});

test(".write_test is not referenced in mobile navigation files", async () => {
  const { readFile } = await import("node:fs/promises");

  const files = [
    "components/erp/erp-shell.tsx",
    "components/erp/erp-mobile-bottom-nav.tsx",
    "components/erp/erp-mobile-module-launcher.tsx",
    "components/erp/erp-module-visual-header.tsx",
    "components/erp/erp-sidebar.tsx",
  ];

  const content = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(content.includes(".write_test"), false);
});

test("ErpShell keeps desktop sidebar and main content structure", async () => {
  const { readFile } = await import("node:fs/promises");
  const shell = await readFile("components/erp/erp-shell.tsx", "utf8");

  assert.equal(shell.includes("hidden min-h-screen md:flex"), true);
  assert.equal(shell.includes("min-w-0 flex-1 flex-col"), true);
  assert.equal(shell.includes("<ErpTopbar />"), true);
  assert.equal(shell.includes("md:hidden"), true);
  assert.equal(shell.includes("<ErpMobileBottomNav />"), true);
});
