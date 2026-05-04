import assert from "node:assert/strict"
import test from "node:test"

import { auditEventRegistry, auditRetentionProfiles } from "../config/audit"
import { accessRules } from "../config/access"
import { actionRegistry } from "../config/actions"
import {
  getAccessAuditPreview,
  getActionAuditPreview,
  getAuditPreview,
} from "../lib/audit"

test("all audit events have zh/en labels", () => {
  assert.ok(auditEventRegistry.length > 0)

  for (const event of auditEventRegistry) {
    assert.ok(event.label.zh.length > 0)
    assert.ok(event.label.en.length > 0)
  }
})

test("all audit events include actor/source/target metadata", () => {
  for (const event of auditEventRegistry) {
    assert.ok(event.actor.actorType.length > 0)
    assert.ok(event.source.sourceModule.length > 0)
    assert.ok(event.source.sourcePage.length > 0)
    assert.ok(event.source.sourceComponent.length > 0)
    assert.ok(event.source.sourceEvent.length > 0)
    assert.ok(event.target.targetAction.length > 0)
  }
})

test("all audit events include requirement metadata", () => {
  for (const event of auditEventRegistry) {
    assert.equal(typeof event.requirement.auditRequired, "boolean")
    assert.equal(typeof event.requirement.confirmationRequired, "boolean")
  }
})

test("preview-only/skipped/blocked/failed/placeholder events return shouldCapture=false", () => {
  const blocked = auditEventRegistry.filter(
    (event) =>
      event.isPlaceholder ||
      ["preview-only", "skipped", "blocked", "failed"].includes(event.status),
  )
  assert.ok(blocked.length > 0)

  for (const event of blocked) {
    const preview = getAuditPreview(event)
    assert.equal(preview.shouldCapture, false)
  }
})

test("captured/pending events are shouldCapture only when not placeholder", () => {
  const candidates = auditEventRegistry.filter((event) => ["captured", "pending"].includes(event.status))
  assert.ok(candidates.length > 0)

  for (const event of candidates) {
    const preview = getAuditPreview(event)
    assert.equal(preview.shouldCapture, !event.isPlaceholder)
  }
})

test("action audit preview can read an existing action contract", () => {
  const action = actionRegistry.find((item) => item.key === "createPurchaseRequest")
  assert.ok(action)

  const preview = getActionAuditPreview("createPurchaseRequest")
  assert.equal(typeof preview.shouldCapture, "boolean")
  assert.equal(preview.eventKey.length > 0, true)
})

test("access audit preview can read an existing access rule", () => {
  const rule = accessRules.find((item) => item.key === "access.inventory.detail")
  assert.ok(rule)

  const preview = getAccessAuditPreview("access.inventory.detail")
  assert.equal(typeof preview.shouldCapture, "boolean")
  assert.equal(preview.eventKey.length > 0, true)
})

test("retention profiles have zh/en names", () => {
  assert.ok(auditRetentionProfiles.length > 0)

  for (const profile of auditRetentionProfiles) {
    assert.ok(profile.name.zh.length > 0)
    assert.ok(profile.name.en.length > 0)
  }
})

test("audit route import exists", async () => {
  const route = await import("../app/audit-trail/page")
  assert.equal(typeof route.default, "function")
})

test("audit helper contains no fetch/axios", async () => {
  const { readFile } = await import("node:fs/promises")
  const text = await readFile("lib/audit.ts", "utf8")

  assert.equal(text.includes("fetch("), false)
  assert.equal(text.includes("axios"), false)
})

test("no forbidden legacy brand names in audit config/docs/components", async () => {
  const { readFile } = await import("node:fs/promises")

  const targets = [
    "docs/ME_AUDIT_TRAIL.md",
    "config/audit/audit-events.ts",
    "config/audit/audit-retention.ts",
    "components/audit/audit-event-card.tsx",
    "components/audit/audit-preview-card.tsx",
    "components/audit/audit-source-card.tsx",
    "components/audit/audit-retention-card.tsx",
  ]

  const contents = await Promise.all(targets.map((path) => readFile(path, "utf8")))
  const text = contents.join("\n")

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacyName), false)
  }
})
