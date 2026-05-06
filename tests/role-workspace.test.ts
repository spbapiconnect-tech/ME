import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { meRoleProfiles } from "../config/roles";
import {
  getRoleFoundationPreview,
  getRoleNavigationPreview,
  getRoleProfiles,
  getRoleWorkspaceData,
} from "../lib/role-workspace";

const requiredRoles = ["owner", "store-manager", "purchasing", "warehouse", "staff", "system-admin"] as const;

test("all role profiles have zh/en names and required roles exist", () => {
  const roles = getRoleProfiles();
  const roleKeys = new Set(roles.map((role) => role.key));

  for (const key of requiredRoles) {
    assert.equal(roleKeys.has(key), true);
  }

  for (const role of roles) {
    assert.ok(role.name.zh.length > 0);
    assert.ok(role.name.en.length > 0);
  }
});

test("role helpers return workspace data for all required roles", async () => {
  for (const key of requiredRoles) {
    const data = await getRoleWorkspaceData(key);
    assert.ok(data);
    assert.equal(data?.role.key, key);
    assert.ok((data?.metrics.length ?? 0) > 0);
    assert.ok((data?.modules.length ?? 0) > 0);
    assert.ok((data?.actions.length ?? 0) > 0);
  }
});

test("role navigation preview resolves visible item keys", async () => {
  const preview = await getRoleNavigationPreview("owner");
  assert.ok(preview);
  assert.equal(preview?.visibleItems.some((item) => item.key === "dashboard"), true);
});

test("system admin foundation preview includes system foundation items", async () => {
  const preview = await getRoleFoundationPreview("system-admin");
  assert.ok(preview);
  const routes = new Set(preview?.visibleItems.map((item) => item.href));
  assert.equal(routes.has("/system-foundation"), true);
  assert.equal(routes.has("/access-control"), true);
  assert.equal(routes.has("/roles"), true);
  assert.equal(routes.has("/workflow"), true);
});

test("staff foundation preview is limited or hidden", async () => {
  const preview = await getRoleFoundationPreview("staff");
  assert.ok(preview);
  assert.equal(["limited-preview", "hidden-preview"].includes(preview?.accessLevel ?? ""), true);
  assert.equal((preview?.visibleItems.length ?? 0) <= 3, true);
});

test("/roles route imports without crashing", async () => {
  const route = await import("../app/roles/page");
  assert.equal(typeof route.default, "function");
});

test("/roles/[roleKey] route imports without crashing", async () => {
  const route = await import("../app/roles/[roleKey]/page");
  assert.equal(typeof route.default, "function");
});

test("role helper contains no fetch or axios", async () => {
  const helper = await readFile("lib/role-workspace.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("no forbidden legacy brand names in role docs config and components", async () => {
  const files = [
    "config/roles.ts",
    "components/roles/role-workspace-page.tsx",
    "components/roles/role-workspace-detail-page.tsx",
    "docs/ME_ROLE_WORKSPACE_PLACEHOLDERS.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced in role workspace files", async () => {
  const files = [
    "config/roles.ts",
    "lib/role-workspace.ts",
    "components/roles/role-workspace-page.tsx",
    "docs/ME_ROLE_WORKSPACE_PLACEHOLDERS.md",
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

test("role profile config exports six profiles", () => {
  assert.equal(meRoleProfiles.length, 6);
});
