import assert from "node:assert/strict";
import test from "node:test";

import { ruleContracts, ruleGroups } from "../config/rules";
import {
  getHumanReviewRules,
  getNotificationRules,
  getPlaceholderRules,
  getRuleByKey,
  getRuleGroupRules,
  getRulePreview,
  getRulesBySourceModule,
  getRulesByType,
  getTaskCreationRules,
  getWorkflowTriggerRules,
} from "../lib/rules";

test("all rules have zh/en titles", () => {
  assert.ok(ruleContracts.length > 0);

  for (const rule of ruleContracts) {
    assert.ok(rule.title.zh.length > 0);
    assert.ok(rule.title.en.length > 0);
  }
});

test("all rules include source/inputs/outputs/conditions/requirement metadata", () => {
  for (const rule of ruleContracts) {
    assert.ok(rule.source.sourceModule.length > 0);
    assert.ok(Array.isArray(rule.inputs));
    assert.ok(Array.isArray(rule.outputs));
    assert.ok(Array.isArray(rule.conditions));
    assert.equal(typeof rule.requirement.auditRequired, "boolean");
    assert.equal(typeof rule.requirement.humanReviewRequired, "boolean");
  }
});

test("placeholder/coming-soon/blocked/disabled rules return canEvaluate=false", () => {
  const blocked = ruleContracts.filter((rule) => ["placeholder", "coming-soon", "blocked", "disabled"].includes(rule.status));
  assert.ok(blocked.length > 0);

  for (const rule of blocked) {
    const preview = getRulePreview(rule);
    assert.equal(preview.canEvaluate, false);
  }
});

test("active rules return canEvaluate=true as metadata preview", () => {
  const active = ruleContracts.filter((rule) => rule.status === "active");
  assert.ok(active.length > 0);

  for (const rule of active) {
    const preview = getRulePreview(rule);
    assert.equal(preview.canEvaluate, true);
  }
});

test("rule groups have zh/en names and valid rule keys", () => {
  assert.ok(ruleGroups.length > 0);

  for (const group of ruleGroups) {
    assert.ok(group.name.zh.length > 0);
    assert.ok(group.name.en.length > 0);
    for (const ruleKey of group.rules) {
      assert.ok(getRuleByKey(ruleKey));
    }
  }
});

test("rule helpers can find required module examples", () => {
  assert.ok(getRulesBySourceModule("inventory").length > 0);
  assert.ok(getRulesBySourceModule("pos-report").length > 0);
  assert.ok(getRulesBySourceModule("procurement").length > 0);
  assert.ok(getRulesBySourceModule("supplier").length > 0);
  assert.ok(getRulesBySourceModule("task").length > 0);
  assert.ok(getRulesBySourceModule("education").length > 0);
  assert.ok(getRulesBySourceModule("workflow").length > 0);
  assert.ok(getRulesBySourceModule("message").length > 0);
  assert.ok(getRulesBySourceModule("report-builder").length > 0);

  assert.ok(getRulesByType("risk").length > 0);
  assert.ok(getRulesByType("formula").length > 0);
  assert.ok(getRulesByType("sla").length > 0);
  assert.ok(getHumanReviewRules().length > 0);
  assert.ok(getWorkflowTriggerRules().length > 0);
  assert.ok(getNotificationRules().length > 0);
  assert.ok(getTaskCreationRules().length > 0);
  assert.ok(getPlaceholderRules().length > 0);
});

test("rule group helper resolves group members", () => {
  const groupRules = getRuleGroupRules("rules.inventory-risk");
  assert.ok(groupRules.length >= 2);
});

test("rules route import exists", async () => {
  const route = await import("../app/rules/page");
  assert.equal(typeof route.default, "function");
});

test("rule helper contains no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile("lib/rules.ts", "utf8");

  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
});

test("no forbidden legacy brand names in rule config/docs/components", async () => {
  const { readFile } = await import("node:fs/promises");

  const targets = [
    "docs/ME_RULE_CONTRACTS.md",
    "config/rules/rule-contracts.ts",
    "config/rules/rule-groups.ts",
    "components/rules/rules-page.tsx",
    "components/rules/rule-card.tsx",
    "components/rules/rule-preview-card.tsx",
  ];

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false);
  }
});
