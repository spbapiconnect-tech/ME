import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { meBranchProfiles } from "../config/branches";
import { navigationMap } from "../config/navigation";
import {
  getBranchNavigationPreview,
  getBranchProfiles,
  getBranchWorkspaceData,
} from "../lib/branch-context";

const requiredBranches = ["all-stores", "kch", "btu", "future-branch"] as const;

test("all branch profiles have zh/en names and required branches exist", () => {
  const branches = getBranchProfiles();
  const branchKeys = new Set(branches.map((branch) => branch.key));

  for (const key of requiredBranches) {
    assert.equal(branchKeys.has(key), true);
  }

  for (const branch of branches) {
    assert.ok(branch.name.zh.length > 0);
    assert.ok(branch.name.en.length > 0);
  }
});

test("branch helpers return workspace data for all branch keys", async () => {
  for (const key of requiredBranches) {
    const data = await getBranchWorkspaceData(key);
    assert.ok(data);
    assert.equal(data?.branch.key, key);
    assert.ok((data?.metrics.length ?? 0) > 0);
    assert.ok((data?.alerts.length ?? 0) > 0);
    assert.ok((data?.actions.length ?? 0) > 0);
  }
});

test("branch navigation preview resolves visible item keys", () => {
  const preview = getBranchNavigationPreview("all-stores");
  assert.ok(preview);
  assert.equal(preview?.visibleItems.some((item) => item.key === "dashboard"), true);
  assert.equal((preview?.visibleItemKeys.length ?? 0) > 0, true);
});

test("all-stores is aggregate", () => {
  const branch = meBranchProfiles.find((item) => item.key === "all-stores");
  assert.equal(branch?.isAggregate, true);
});

test("kch and btu are non-aggregate branch contexts", () => {
  const keys = ["kch", "btu"];
  for (const key of keys) {
    const branch = meBranchProfiles.find((item) => item.key === key);
    assert.equal(branch?.isAggregate, false);
  }
});

test("future-branch is placeholder and coming-soon", () => {
  const branch = meBranchProfiles.find((item) => item.key === "future-branch");
  assert.equal(branch?.status, "coming-soon");
});

test("/branches route imports without crashing", async () => {
  const route = await import("../app/branches/page");
  assert.equal(typeof route.default, "function");
});

test("/branches/[id] route imports without crashing", async () => {
  const route = await import("../app/branches/[id]/page");
  assert.equal(typeof route.default, "function");
});

test("config/navigation includes branches item", () => {
  const allItems = [
    ...navigationMap.primaryItems,
    ...navigationMap.footerItems,
    ...navigationMap.groups.flatMap((group) => group.items),
  ];
  assert.equal(allItems.some((item) => item.key === "branches" && item.href === "/branches"), true);
});

test("branch helper contains no fetch or axios", async () => {
  const helper = await readFile("lib/branch-context.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("no forbidden legacy brand names in branch docs config and components", async () => {
  const files = [
    "config/branches.ts",
    "components/branches/branch-erp-page.tsx",
    "components/branches/branch-erp-detail-page.tsx",
    "components/branches/branch-workspace-page.tsx",
    "components/branches/branch-workspace-detail-page.tsx",
    "docs/ME_BRANCH_CONTEXT_PLACEHOLDERS.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced in branch workspace files", async () => {
  const files = [
    "config/branches.ts",
    "lib/branch-context.ts",
    "components/branches/branch-erp-page.tsx",
    "components/branches/branch-erp-detail-page.tsx",
    "components/branches/branch-workspace-page.tsx",
    "docs/ME_BRANCH_CONTEXT_PLACEHOLDERS.md",
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

test("branch profile config exports four profiles", () => {
  assert.equal(meBranchProfiles.length, 4);
});
