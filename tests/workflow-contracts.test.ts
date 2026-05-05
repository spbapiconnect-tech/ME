import assert from "node:assert/strict";
import test from "node:test";

import { accessRules } from "../config/access";
import { actionRegistry } from "../config/actions";
import { auditEventRegistry } from "../config/audit";
import { workflowRegistry, workflowTargetCatalog } from "../config/workflow";
import {
  getAccessWorkflowPreview,
  getActionWorkflowPreview,
  getAuditWorkflowPreview,
  getWorkflowPreview,
} from "../lib/workflow";

test("all workflows have zh/en labels", () => {
  assert.ok(workflowRegistry.length > 0);

  for (const workflow of workflowRegistry) {
    assert.ok(workflow.label.zh.length > 0);
    assert.ok(workflow.label.en.length > 0);
  }
});

test("all workflows include source/target/requirement metadata", () => {
  for (const workflow of workflowRegistry) {
    assert.ok(workflow.source.sourceModule.length > 0);
    assert.ok(workflow.source.sourcePage.length > 0);
    assert.ok(workflow.source.sourceComponent.length > 0);
    assert.ok(workflow.source.sourceEvent.length > 0);

    assert.ok(workflow.target.targetAction.length > 0);
    assert.equal(typeof workflow.requirement.humanConfirmationRequired, "boolean");
    assert.equal(typeof workflow.requirement.auditRequired, "boolean");
  }
});

test("placeholder/preview-only/coming-soon/blocked/disabled workflows return canTrigger=false", () => {
  const blocked = workflowRegistry.filter((workflow) =>
    ["placeholder", "preview-only", "coming-soon", "blocked", "disabled"].includes(workflow.status),
  );
  assert.ok(blocked.length > 0);

  for (const workflow of blocked) {
    const preview = getWorkflowPreview(workflow);
    assert.equal(preview.canTrigger, false);
  }
});

test("active workflows return canTrigger=true as metadata preview", () => {
  const active = workflowRegistry.filter((workflow) => workflow.status === "active");
  assert.ok(active.length > 0);

  for (const workflow of active) {
    const preview = getWorkflowPreview(workflow);
    assert.equal(preview.canTrigger, true);
  }
});

test("workflow target catalog entries have zh/en names", () => {
  assert.ok(workflowTargetCatalog.length > 0);

  for (const target of workflowTargetCatalog) {
    assert.ok(target.name.zh.length > 0);
    assert.ok(target.name.en.length > 0);
  }
});

test("action workflow preview can read an existing action contract", () => {
  const action = actionRegistry.find((item) => item.key === "createPurchaseRequest");
  assert.ok(action);

  const preview = getActionWorkflowPreview("createPurchaseRequest");
  assert.equal(typeof preview.canTrigger, "boolean");
  assert.equal(preview.workflowKey.length > 0, true);
});

test("audit workflow preview can read an existing audit event", () => {
  const auditEvent = auditEventRegistry.find((item) => item.key === "audit.access.procurement.module");
  assert.ok(auditEvent);

  const preview = getAuditWorkflowPreview("audit.access.procurement.module");
  assert.equal(typeof preview.canTrigger, "boolean");
  assert.equal(preview.workflowKey.length > 0, true);
});

test("access workflow preview can read an existing access rule", () => {
  const accessRule = accessRules.find((item) => item.key === "access.procurement.module");
  assert.ok(accessRule);

  const preview = getAccessWorkflowPreview("access.procurement.module");
  assert.equal(typeof preview.canTrigger, "boolean");
  assert.equal(preview.workflowKey.length > 0, true);
});

test("workflow route import exists", async () => {
  const route = await import("../app/workflow/page");
  assert.equal(typeof route.default, "function");
});

test("workflow helper contains no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile("lib/workflow.ts", "utf8");

  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
});

test("no forbidden legacy brand names in workflow config/docs/components", async () => {
  const { readFile } = await import("node:fs/promises");

  const targets = [
    "docs/ME_WORKFLOW_CONTRACTS.md",
    "config/workflow/workflow-triggers.ts",
    "config/workflow/workflow-targets.ts",
    "components/workflow/workflow-page.tsx",
    "components/workflow/workflow-trigger-card.tsx",
    "components/workflow/workflow-preview-card.tsx",
  ];

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false);
  }
});
