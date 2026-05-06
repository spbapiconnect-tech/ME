import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getBusinessWorkspacePageData } from "../lib/page-data/business-workspace-page-data";

test("business workspace page-data returns metrics/modules/alerts/actions", async () => {
  const data = await getBusinessWorkspacePageData();
  assert.ok(data.metrics.length > 0);
  assert.ok(data.modules.length > 0);
  assert.ok(data.alerts.length > 0);
  assert.ok(data.actions.length > 0);
});

test("homepage imports without crashing", async () => {
  const route = await import("../app/page");
  assert.equal(typeof route.default, "function");
});

test("/system-foundation imports without crashing", async () => {
  const route = await import("../app/system-foundation/page");
  assert.equal(typeof route.default, "function");
});

test("system foundation links include required foundation routes", async () => {
  const data = await getBusinessWorkspacePageData();
  const routes = new Set(data.systemFoundationLinks.map((item) => item.route));
  for (const route of [
    "/layout-engine",
    "/action-contracts",
    "/access-control",
    "/audit-trail",
    "/workflow",
    "/notifications",
    "/reports",
    "/rules",
    "/packages",
  ]) {
    assert.equal(routes.has(route), true);
  }
});

test("business workspace helper does not contain fetch or axios", async () => {
  const helper = await readFile("lib/page-data/business-workspace-page-data.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("no forbidden legacy brand names in business workspace docs/components/files", async () => {
  const files = [
    "docs/ME_BUSINESS_FRONTEND_EXPERIENCE.md",
    "components/business/business-workspace-page.tsx",
    "components/business/system-foundation-page.tsx",
    "lib/page-data/business-workspace-page-data.ts",
    "types/business-workspace.ts",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced in business workspace files", async () => {
  const files = [
    "components/business/business-workspace-page.tsx",
    "components/business/system-foundation-page.tsx",
    "lib/page-data/business-workspace-page-data.ts",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);
});

test("package.json remains baseline for scripts", async () => {
  const pkgRaw = await readFile("package.json", "utf8");
  const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
  assert.equal(pkg.scripts?.build, "next build");
  assert.equal(pkg.scripts?.test, "tsx --test tests/**/*.test.ts");
});
