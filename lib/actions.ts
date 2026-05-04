import { actionRegistry, actionRegistryByKey } from "@/config/actions";
import type { ActionContract, ActionExecutionPreview, ActionIntent, ActionStatus } from "@/types/action-contract";
import type { LocalizedText, SupportedLocale } from "@/types/module";

export function getActionByKey(actionKey: string): ActionContract | undefined {
  return actionRegistryByKey[actionKey];
}

export function getActionsBySourceModule(sourceModule: string): ActionContract[] {
  return actionRegistry.filter((action) => action.source.sourceModule === sourceModule);
}

export function getActionsByTargetModule(targetModule: string): ActionContract[] {
  return actionRegistry.filter((action) => action.target.targetModule === targetModule);
}

export function getActionsByIntent(intent: ActionIntent): ActionContract[] {
  return actionRegistry.filter((action) => action.intent === intent);
}

export function getPlaceholderActions(): ActionContract[] {
  return actionRegistry.filter((action) => action.isPlaceholder || action.status === "placeholder" || action.status === "coming-soon");
}

export function getAuditableActions(): ActionContract[] {
  return actionRegistry.filter((action) => action.requirement.auditRequired);
}

function isNonExecutableStatus(status: ActionStatus) {
  return status === "disabled" || status === "hidden" || status === "coming-soon" || status === "placeholder";
}

function buildReason(text: LocalizedText): LocalizedText {
  return { zh: text.zh, en: text.en };
}

export function getActionExecutionPreview(actionOrKey: string | ActionContract): ActionExecutionPreview {
  const action = typeof actionOrKey === "string" ? getActionByKey(actionOrKey) : actionOrKey;

  if (!action) {
    return {
      actionKey: typeof actionOrKey === "string" ? actionOrKey : "unknown",
      canExecute: false,
      reason: buildReason({ zh: "未找到动作定义", en: "Action definition not found" }),
      auditRequired: false,
      placeholderNotice: buildReason({ zh: "该动作仅提供元数据，不会执行。", en: "This action is metadata-only and will not execute." }),
    };
  }

  const nonExecutable = action.isPlaceholder || isNonExecutableStatus(action.status);

  if (nonExecutable) {
    return {
      actionKey: action.key,
      canExecute: false,
      reason: buildReason({ zh: "该动作当前为占位或不可用状态", en: "This action is placeholder or not executable" }),
      auditRequired: action.requirement.auditRequired,
      permissionRequired: action.requirement.permissionRequired,
      placeholderNotice: buildReason({ zh: "不连接真实权限、审计、工作流或持久化写入。", en: "No real permissions, audit logging, workflow execution, or persisted writes are connected." }),
    };
  }

  return {
    actionKey: action.key,
    canExecute: true,
    auditRequired: action.requirement.auditRequired,
    permissionRequired: action.requirement.permissionRequired,
  };
}

export function resolveActionLabel(action: ActionContract, locale: SupportedLocale): string {
  return locale === "zh" ? action.label.zh : action.label.en;
}

export function resolveActionDescription(action: ActionContract, locale: SupportedLocale): string | undefined {
  if (!action.description) {
    return undefined;
  }

  return locale === "zh" ? action.description.zh : action.description.en;
}
