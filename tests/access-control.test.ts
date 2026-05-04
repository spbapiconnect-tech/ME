import assert from "node:assert/strict"
import test from "node:test"

import { actionRegistry } from "../config/actions"
import { accessRules, planRegistry, roleRegistry } from "../config/access"
import { getAccessPreview, getActionAccessPreview } from "../lib/access"

test("all roles have zh/en names", () => {
  assert.ok(roleRegistry.length > 0)

  for (const role of roleRegistry) {
    assert.ok(role.name.zh.length > 0)
    assert.ok(role.name.en.length > 0)
  }
})

test("all plans have zh/en names", () => {
  assert.ok(planRegistry.length > 0)

  for (const plan of planRegistry) {
    assert.ok(plan.name.zh.length > 0)
    assert.ok(plan.name.en.length > 0)
  }
})

test("all access rules have zh/en labels and scope/status", () => {
  assert.ok(accessRules.length > 0)

  for (const rule of accessRules) {
    assert.ok(rule.label.zh.length > 0)
    assert.ok(rule.label.en.length > 0)
    assert.ok(rule.scope.length > 0)
    assert.ok(rule.status.length > 0)
  }
})

test("placeholder/coming-soon/blocked rules return canAccess=false", () => {
  const restricted = accessRules.filter((rule) => ["placeholder", "coming-soon", "blocked"].includes(rule.status))
  assert.ok(restricted.length > 0)

  for (const rule of restricted) {
    const preview = getAccessPreview(rule)
    assert.equal(preview.canAccess, false)
  }
})

test("allowed rules return canAccess=true in metadata preview", () => {
  const allowed = accessRules.filter((rule) => rule.status === "allowed")
  assert.ok(allowed.length > 0)

  for (const rule of allowed) {
    const preview = getAccessPreview(rule)
    assert.equal(preview.canAccess, true)
  }
})

test("getActionAccessPreview can read existing action contract", () => {
  const action = actionRegistry.find((item) => item.key === "createPurchaseRequest")
  assert.ok(action)

  const preview = getActionAccessPreview("createPurchaseRequest")
  assert.equal(preview.ruleKey, "action.createPurchaseRequest")
  assert.equal(typeof preview.canAccess, "boolean")
})

test("access route import exists", async () => {
  const route = await import("../app/access-control/page")
  assert.equal(typeof route.default, "function")
})

test("access helper contains no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises")
  const libText = await readFile("lib/access.ts", "utf8")

  assert.equal(libText.includes("fetch("), false)
  assert.equal(libText.includes("axios"), false)
})

test("no forbidden legacy brand names in access config/docs/components", async () => {
  const { readFile } = await import("node:fs/promises")

  const targets = [
    "docs/ME_ACCESS_CONTROL.md",
    "config/access/role-registry.ts",
    "config/access/plan-registry.ts",
    "config/access/access-rules.ts",
    "components/access/access-chip.tsx",
    "components/access/access-rule-card.tsx",
    "components/access/access-preview-card.tsx",
  ]

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")))
  const text = contents.join("\n")

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false)
  }
})
