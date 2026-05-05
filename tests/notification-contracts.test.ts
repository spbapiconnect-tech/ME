import assert from "node:assert/strict";
import test from "node:test";

import { accessRules } from "../config/access";
import { actionRegistry } from "../config/actions";
import { auditEventRegistry } from "../config/audit";
import { notificationRules, notificationTemplateCatalog } from "../config/notifications";
import { workflowRegistry } from "../config/workflow";
import {
  getAccessNotificationPreview,
  getActionNotificationPreview,
  getAuditNotificationPreview,
  getNotificationPreview,
  getWorkflowNotificationPreview,
} from "../lib/notifications";

test("all notifications have zh/en labels", () => {
  assert.ok(notificationRules.length > 0);
  for (const item of notificationRules) {
    assert.ok(item.label.zh.length > 0);
    assert.ok(item.label.en.length > 0);
  }
});

test("all notifications include source/recipient/message/requirement metadata", () => {
  for (const item of notificationRules) {
    assert.ok(item.source.sourceModule.length > 0);
    assert.ok(item.source.sourcePage.length > 0);
    assert.ok(item.source.sourceComponent.length > 0);
    assert.ok(item.source.sourceEvent.length > 0);
    assert.ok(item.message.title.zh.length > 0);
    assert.ok(item.message.title.en.length > 0);
    assert.ok(item.message.body.zh.length > 0);
    assert.ok(item.message.body.en.length > 0);
    assert.equal(typeof item.requirement.humanReviewRequired, "boolean");
    assert.equal(typeof item.requirement.auditRequired, "boolean");
  }
});

test("placeholder/preview-only/coming-soon/blocked/disabled notifications return canSend=false", () => {
  const blocked = notificationRules.filter((item) => ["preview-only", "placeholder", "coming-soon", "blocked", "disabled"].includes(item.status));
  assert.ok(blocked.length > 0);

  for (const item of blocked) {
    const preview = getNotificationPreview(item);
    assert.equal(preview.canSend, false);
  }
});

test("active notifications return canSend=true as metadata preview only", () => {
  const active = notificationRules.filter((item) => item.status === "active");
  assert.ok(active.length > 0);

  for (const item of active) {
    const preview = getNotificationPreview(item);
    assert.equal(preview.canSend, true);
  }
});

test("notification template catalog entries have zh/en names", () => {
  assert.ok(notificationTemplateCatalog.length > 0);

  for (const template of notificationTemplateCatalog) {
    assert.ok(template.name.zh.length > 0);
    assert.ok(template.name.en.length > 0);
  }
});

test("workflow notification preview can read an existing workflow contract", () => {
  assert.ok(workflowRegistry.find((item) => item.key === "workflow.action.createPurchaseRequest"));
  const preview = getWorkflowNotificationPreview("workflow.action.createPurchaseRequest");
  assert.equal(typeof preview.canSend, "boolean");
});

test("action notification preview can read an existing action contract", () => {
  assert.ok(actionRegistry.find((item) => item.key === "createPurchaseRequest"));
  const preview = getActionNotificationPreview("createPurchaseRequest");
  assert.equal(typeof preview.canSend, "boolean");
});

test("audit notification preview can read an existing audit event", () => {
  assert.ok(auditEventRegistry.find((item) => item.key === "audit.access.procurement.module"));
  const preview = getAuditNotificationPreview("audit.access.procurement.module");
  assert.equal(typeof preview.canSend, "boolean");
});

test("access notification preview can read an existing access rule", () => {
  assert.ok(accessRules.find((item) => item.key === "access.procurement.module"));
  const preview = getAccessNotificationPreview("access.procurement.module");
  assert.equal(typeof preview.canSend, "boolean");
});

test("notification route import exists", async () => {
  const route = await import("../app/notifications/page");
  assert.equal(typeof route.default, "function");
});

test("notification helper contains no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises");
  const text = await readFile("lib/notifications.ts", "utf8");

  assert.equal(text.includes("fetch("), false);
  assert.equal(text.includes("axios"), false);
});

test("no forbidden legacy brand names in notification config/docs/components", async () => {
  const { readFile } = await import("node:fs/promises");

  const targets = [
    "docs/ME_NOTIFICATION_CONTRACTS.md",
    "config/notifications/notification-rules.ts",
    "config/notifications/notification-templates.ts",
    "components/notifications/notification-rule-card.tsx",
    "components/notifications/notification-preview-card.tsx",
    "components/notifications/notifications-page.tsx",
  ];

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")));
  const text = contents.join("\n");

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false);
  }
});
