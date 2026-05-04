import { accessRules, accessRulesByKey, planRegistryByCode, roleRegistryByCode } from "@/config/access"
import { getActionByKey } from "@/lib/actions"
import type { ActionContract } from "@/types/action-contract"
import type { AccessPlan, AccessPreview, AccessRole, AccessRule, AccessScope } from "@/types/access-control"
import type { SupportedLocale } from "@/types/module"

function defaultReasonForStatus(status: AccessRule["status"]) {
  switch (status) {
    case "allowed":
      return { zh: "当前为可访问元数据预览。", en: "Currently marked as accessible metadata preview." }
    case "blocked":
      return { zh: "当前访问被阻止。", en: "Access is currently blocked." }
    case "coming-soon":
      return { zh: "功能即将开放。", en: "Feature is coming soon." }
    case "hidden":
      return { zh: "当前访问处于隐藏状态。", en: "Access is currently hidden." }
    case "placeholder":
    default:
      return { zh: "当前仅为占位合同。", en: "Currently placeholder contract only." }
  }
}

function isRestrictedStatus(status: AccessRule["status"]) {
  return status === "blocked" || status === "placeholder" || status === "coming-soon" || status === "hidden"
}

export function getRoleByCode(roleCode?: string) {
  if (!roleCode) return undefined
  return roleRegistryByCode[roleCode]
}

export function getPlanByCode(planCode?: string) {
  if (!planCode) return undefined
  return planRegistryByCode[planCode]
}

export function getAccessRuleByKey(ruleKey: string) {
  return accessRulesByKey[ruleKey]
}

export function getAccessRulesByScope(scope: AccessScope) {
  return accessRules.filter((rule) => rule.scope === scope)
}

export function getAccessRulesByModule(moduleCode: string) {
  return accessRules.filter((rule) => rule.targetModule === moduleCode || rule.condition.requiredModule === moduleCode)
}

export function getAccessRulesByRole(roleCode: AccessRole) {
  return accessRules.filter((rule) => rule.condition.requiredRole === roleCode)
}

export function getAccessRulesByPlan(planCode: AccessPlan) {
  return accessRules.filter((rule) => rule.condition.requiredPlan === planCode)
}

export function getPlaceholderAccessRules() {
  return accessRules.filter((rule) => rule.condition.isPlaceholder || rule.status === "placeholder" || rule.status === "coming-soon")
}

export function getAuditableAccessRules() {
  return accessRules.filter((rule) => rule.condition.requiresAudit)
}

export function getAccessPreview(ruleOrKey: string | AccessRule): AccessPreview {
  const rule = typeof ruleOrKey === "string" ? getAccessRuleByKey(ruleOrKey) : ruleOrKey

  if (!rule) {
    return {
      ruleKey: typeof ruleOrKey === "string" ? ruleOrKey : "unknown",
      canAccess: false,
      status: "blocked",
      reason: { zh: "未找到访问规则。", en: "Access rule not found." },
      requiresAudit: false,
      requiresConfirmation: false,
      placeholderNotice: {
        zh: "当前仅为访问元数据预览，不执行真实权限判断。",
        en: "Access metadata preview only; no real permission evaluation is performed.",
      },
    }
  }

  const canAccess = !isRestrictedStatus(rule.status)

  return {
    ruleKey: rule.key,
    canAccess,
    status: rule.status,
    reason: rule.reason ?? defaultReasonForStatus(rule.status),
    requiredPermission: rule.condition.requiredPermission,
    requiredRole: rule.condition.requiredRole,
    requiredPlan: rule.condition.requiredPlan,
    requiresAudit: rule.condition.requiresAudit,
    requiresConfirmation: rule.condition.requiresConfirmation,
    placeholderNotice:
      rule.condition.isPlaceholder || !canAccess
        ? {
            zh: "仅提供访问预览元数据，不做真实登录、会话、鉴权或拦截。",
            en: "Preview metadata only; no real login, session, authorization, or request blocking is implemented.",
          }
        : undefined,
  }
}

export function getActionAccessPreview(actionOrKey: string | ActionContract): AccessPreview {
  const action = typeof actionOrKey === "string" ? getActionByKey(actionOrKey) : actionOrKey

  if (!action) {
    return {
      ruleKey: typeof actionOrKey === "string" ? `action.${actionOrKey}` : "action.unknown",
      canAccess: false,
      status: "blocked",
      reason: { zh: "未找到动作合同。", en: "Action contract not found." },
      requiresAudit: false,
      requiresConfirmation: false,
      placeholderNotice: {
        zh: "仅提供访问预览元数据，不执行真实动作。",
        en: "Access preview metadata only; no real action execution is performed.",
      },
    }
  }

  const mappedRule = getAccessRuleByKey(`action.${action.key}`)
  if (mappedRule) {
    return getAccessPreview(mappedRule)
  }

  const fallbackStatus = action.isPlaceholder || action.status === "coming-soon" || action.status === "placeholder" || action.status === "hidden"
    ? "placeholder"
    : "allowed"

  return {
    ruleKey: `action.${action.key}`,
    canAccess: fallbackStatus === "allowed",
    status: fallbackStatus,
    reason:
      fallbackStatus === "allowed"
        ? { zh: "动作合同可用于访问预览。", en: "Action contract is available for access preview." }
        : { zh: "动作当前仅为占位合同。", en: "Action is currently placeholder contract only." },
    requiredPermission: action.requirement.permissionRequired,
    requiredRole: action.requirement.roleRequired as AccessRole | undefined,
    requiredPlan: action.requirement.planRequired as AccessPlan | undefined,
    requiresAudit: action.requirement.auditRequired,
    requiresConfirmation: action.requirement.confirmationRequired,
    placeholderNotice:
      fallbackStatus !== "allowed"
        ? {
            zh: "仅做元数据展示，不触发真实权限校验。",
            en: "Metadata display only; no real permission checks are triggered.",
          }
        : undefined,
  }
}

export function resolveAccessLabel(rule: AccessRule, locale: SupportedLocale) {
  return locale === "zh" ? rule.label.zh : rule.label.en
}

export function resolveAccessDescription(rule: AccessRule, locale: SupportedLocale) {
  if (!rule.description) return undefined
  return locale === "zh" ? rule.description.zh : rule.description.en
}
