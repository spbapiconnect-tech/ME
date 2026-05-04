import { auditEventRegistry, auditEventRegistryByKey, auditRetentionProfilesByCode } from "@/config/audit"
import { getAccessRuleByKey } from "@/lib/access"
import { getActionByKey } from "@/lib/actions"
import type { ActionContract } from "@/types/action-contract"
import type {
  AuditEventContract,
  AuditEventType,
  AuditPreview,
  AuditRetentionProfile,
  AuditSeverity,
  AuditStatus,
} from "@/types/audit"
import type { LocalizedText, SupportedLocale } from "@/types/module"

const nonCapturableStatus: AuditStatus[] = ["preview-only", "skipped", "blocked", "failed"]

function buildReason(text: LocalizedText): LocalizedText {
  return { zh: text.zh, en: text.en }
}

function shouldCaptureEvent(event: AuditEventContract) {
  if (event.isPlaceholder) return false
  if (nonCapturableStatus.includes(event.status)) return false
  return event.status === "captured" || event.status === "pending"
}

function summarizeActor(event: AuditEventContract) {
  if (event.actor.actorName) return event.actor.actorName
  if (event.actor.role) return event.actor.role
  return event.actor.actorType
}

function summarizeSource(event: AuditEventContract) {
  return `${event.source.sourceModule}/${event.source.sourcePage}/${event.source.sourceComponent}`
}

function summarizeTarget(event: AuditEventContract) {
  const target = [event.target.targetModule, event.target.targetPage, event.target.targetAction].filter(Boolean)
  return target.join(" / ")
}

function reasonForEvent(event: AuditEventContract): LocalizedText {
  if (event.isPlaceholder) {
    return buildReason({
      zh: "该事件仍为占位合同，当前仅提供审计预览元数据。",
      en: "This event remains a placeholder contract and currently provides preview metadata only.",
    })
  }

  if (nonCapturableStatus.includes(event.status)) {
    return buildReason({
      zh: "当前状态不应触发真实审计捕获。",
      en: "The current status should not trigger real audit capture.",
    })
  }

  return buildReason({
    zh: "该事件满足可审计预览条件（仅元数据，不落库）。",
    en: "This event meets auditable preview conditions (metadata only, no persistence).",
  })
}

export function getAuditEventByKey(eventKey: string): AuditEventContract | undefined {
  return auditEventRegistryByKey[eventKey]
}

export function getAuditEventsByType(eventType: AuditEventType): AuditEventContract[] {
  return auditEventRegistry.filter((event) => event.eventType === eventType)
}

export function getAuditEventsBySourceModule(sourceModule: string): AuditEventContract[] {
  return auditEventRegistry.filter((event) => event.source.sourceModule === sourceModule)
}

export function getAuditEventsByTargetModule(targetModule: string): AuditEventContract[] {
  return auditEventRegistry.filter((event) => event.target.targetModule === targetModule)
}

export function getAuditEventsByActionKey(actionKey: string): AuditEventContract[] {
  return auditEventRegistry.filter(
    (event) => event.requirement.actionKey === actionKey || event.target.targetAction === actionKey,
  )
}

export function getAuditEventsByAccessRuleKey(accessRuleKey: string): AuditEventContract[] {
  return auditEventRegistry.filter((event) => event.requirement.accessRuleKey === accessRuleKey)
}

export function getAuditablePreviewEvents(): AuditEventContract[] {
  return auditEventRegistry.filter((event) => shouldCaptureEvent(event))
}

export function getPlaceholderAuditEvents(): AuditEventContract[] {
  return auditEventRegistry.filter((event) => event.isPlaceholder || event.eventType === "placeholder")
}

export function getAuditRetentionProfile(code: string): AuditRetentionProfile | undefined {
  return auditRetentionProfilesByCode[code]
}

export function getAuditPreview(eventOrKey: string | AuditEventContract): AuditPreview {
  const event = typeof eventOrKey === "string" ? getAuditEventByKey(eventOrKey) : eventOrKey

  if (!event) {
    return {
      eventKey: typeof eventOrKey === "string" ? eventOrKey : "unknown",
      shouldCapture: false,
      status: "failed",
      severity: "warning",
      reason: buildReason({ zh: "未找到审计事件定义。", en: "Audit event definition not found." }),
      auditRequired: false,
      placeholderNotice: buildReason({
        zh: "当前仅支持审计元数据预览，不包含真实日志写入。",
        en: "Only audit metadata preview is supported right now; no real log writing is included.",
      }),
    }
  }

  const shouldCapture = shouldCaptureEvent(event)

  return {
    eventKey: event.key,
    shouldCapture,
    status: event.status,
    severity: event.severity,
    reason: reasonForEvent(event),
    actorLabel: summarizeActor(event),
    sourceLabel: summarizeSource(event),
    targetLabel: summarizeTarget(event),
    auditRequired: event.requirement.auditRequired,
    permissionRequired: event.requirement.permissionRequired,
    accessRuleKey: event.requirement.accessRuleKey,
    placeholderNotice:
      event.isPlaceholder || !shouldCapture
        ? buildReason({
            zh: "仅用于审计合同预览，不执行真实持久化、后端写入或事件队列。",
            en: "Used for audit contract preview only; no real persistence, backend writes, or event queue execution.",
          })
        : undefined,
  }
}

export function getActionAuditPreview(actionOrKey: string | ActionContract): AuditPreview {
  const actionKey = typeof actionOrKey === "string" ? actionOrKey : actionOrKey.key
  const action = typeof actionOrKey === "string" ? getActionByKey(actionOrKey) : actionOrKey

  const mappedEvent = getAuditEventsByActionKey(actionKey)[0]
  if (mappedEvent) {
    return getAuditPreview(mappedEvent)
  }

  if (!action) {
    return {
      eventKey: `audit.action.${actionKey}`,
      shouldCapture: false,
      status: "failed",
      severity: "warning",
      reason: buildReason({ zh: "未找到动作合同，无法生成审计预览。", en: "Action contract not found; unable to build audit preview." }),
      auditRequired: false,
      placeholderNotice: buildReason({
        zh: "当前仅返回审计元数据占位，不执行真实动作审计写入。",
        en: "Returns audit metadata placeholder only; no real action audit write is performed.",
      }),
    }
  }

  const previewStatus: AuditStatus = action.isPlaceholder ? "preview-only" : "pending"
  const previewSeverity: AuditSeverity = action.requirement.auditRequired ? "notice" : "info"

  return {
    eventKey: `audit.action.${action.key}`,
    shouldCapture: action.requirement.auditRequired && !action.isPlaceholder,
    status: previewStatus,
    severity: previewSeverity,
    reason: action.requirement.auditRequired
      ? buildReason({
          zh: "动作标记为需审计，当前为合同预览映射。",
          en: "Action is marked as auditable and currently mapped as a contract preview.",
        })
      : buildReason({
          zh: "动作未标记审计要求，仅保留预览元数据。",
          en: "Action is not marked as auditable and remains preview metadata only.",
        }),
    actorLabel: action.requirement.roleRequired ?? "unknown",
    sourceLabel: `${action.source.sourceModule}/${action.source.sourcePage}`,
    targetLabel: action.target.targetAction,
    auditRequired: action.requirement.auditRequired,
    permissionRequired: action.requirement.permissionRequired,
    accessRuleKey: `action.${action.key}`,
    placeholderNotice: buildReason({
      zh: "当前不连接真实审计服务、数据库或后端接口。",
      en: "No real audit service, database, or backend API is connected at this stage.",
    }),
  }
}

export function getAccessAuditPreview(accessRuleKey: string): AuditPreview {
  const mappedEvent = getAuditEventsByAccessRuleKey(accessRuleKey)[0]
  if (mappedEvent) {
    return getAuditPreview(mappedEvent)
  }

  const rule = getAccessRuleByKey(accessRuleKey)
  if (!rule) {
    return {
      eventKey: `audit.access.${accessRuleKey}`,
      shouldCapture: false,
      status: "failed",
      severity: "warning",
      reason: buildReason({ zh: "未找到访问规则，无法生成审计预览。", en: "Access rule not found; unable to build audit preview." }),
      auditRequired: false,
      accessRuleKey,
      placeholderNotice: buildReason({
        zh: "当前仅输出访问审计占位元数据。",
        en: "Only access-audit placeholder metadata is returned currently.",
      }),
    }
  }

  return {
    eventKey: `audit.access.${rule.key}`,
    shouldCapture: rule.condition.requiresAudit && !rule.condition.isPlaceholder && rule.status === "allowed",
    status: rule.status === "blocked" ? "blocked" : rule.condition.isPlaceholder ? "preview-only" : "captured",
    severity: rule.condition.requiresAudit ? "notice" : "info",
    reason: rule.condition.requiresAudit
      ? buildReason({ zh: "访问规则声明需审计，当前仅作预览映射。", en: "Access rule declares audit requirement and is currently mapped for preview only." })
      : buildReason({ zh: "访问规则未声明审计要求。", en: "Access rule does not declare audit requirement." }),
    sourceLabel: `${rule.scope}/${rule.targetModule ?? "global"}`,
    targetLabel: rule.targetAction ?? rule.targetPage ?? "access-check",
    auditRequired: rule.condition.requiresAudit,
    permissionRequired: rule.condition.requiredPermission,
    accessRuleKey: rule.key,
    placeholderNotice: buildReason({
      zh: "访问审计当前不连接真实鉴权中间件或后端日志。",
      en: "Access audit is not connected to real auth middleware or backend logging yet.",
    }),
  }
}

export function resolveAuditLabel(event: AuditEventContract, locale: SupportedLocale): string {
  return locale === "zh" ? event.label.zh : event.label.en
}

export function resolveAuditDescription(event: AuditEventContract, locale: SupportedLocale): string | undefined {
  if (!event.description) return undefined
  return locale === "zh" ? event.description.zh : event.description.en
}
