import { workflowRegistry, workflowRegistryByKey, workflowTargetCatalog, workflowTargetCatalogByCode } from "@/config/workflow";
import { getAccessRuleByKey } from "@/lib/access";
import { getActionByKey } from "@/lib/actions";
import { getAuditEventByKey } from "@/lib/audit";
import type { AccessRule } from "@/types/access-control";
import type { ActionContract } from "@/types/action-contract";
import type { AuditEventContract } from "@/types/audit";
import type {
  WorkflowContract,
  WorkflowPreview,
  WorkflowStatus,
  WorkflowTargetCatalogItem,
  WorkflowTargetType,
  WorkflowTriggerType,
} from "@/types/workflow";
import type { SupportedLocale } from "@/types/module";

const nonTriggerableStatuses: WorkflowStatus[] = ["preview-only", "placeholder", "coming-soon", "blocked", "disabled"];

function reasonForStatus(status: WorkflowStatus) {
  switch (status) {
    case "active":
      return {
        zh: "状态为 active，可在元数据预览中标记为可触发。",
        en: "Status is active, so it can be marked triggerable in metadata preview.",
      };
    case "preview-only":
      return { zh: "当前为预览模式，不触发真实工作流。", en: "Preview-only mode; no real workflow triggering." };
    case "placeholder":
      return { zh: "当前为占位合同，不触发真实工作流。", en: "Placeholder contract only; no real workflow triggering." };
    case "coming-soon":
      return { zh: "能力即将上线，当前仅保留元数据。", en: "Capability is coming soon and remains metadata-only." };
    case "blocked":
      return { zh: "当前流程被阻止，不能触发。", en: "Current flow is blocked and cannot trigger." };
    case "disabled":
    default:
      return { zh: "当前流程已禁用，不能触发。", en: "Current flow is disabled and cannot trigger." };
  }
}

export function getWorkflowByKey(workflowKey: string): WorkflowContract | undefined {
  return workflowRegistryByKey[workflowKey];
}

export function getWorkflowsByTriggerType(triggerType: WorkflowTriggerType): WorkflowContract[] {
  return workflowRegistry.filter((workflow) => workflow.triggerType === triggerType);
}

export function getWorkflowsBySourceModule(sourceModule: string): WorkflowContract[] {
  return workflowRegistry.filter((workflow) => workflow.source.sourceModule === sourceModule);
}

export function getWorkflowsByTargetType(targetType: WorkflowTargetType): WorkflowContract[] {
  return workflowRegistry.filter((workflow) => workflow.target.targetType === targetType);
}

export function getWorkflowsByActionKey(actionKey: string): WorkflowContract[] {
  return workflowRegistry.filter((workflow) => workflow.source.actionKey === actionKey || workflow.requirement.actionKey === actionKey);
}

export function getWorkflowsByAuditEventKey(auditEventKey: string): WorkflowContract[] {
  return workflowRegistry.filter(
    (workflow) => workflow.source.auditEventKey === auditEventKey || workflow.requirement.auditEventKey === auditEventKey,
  );
}

export function getWorkflowsByAccessRuleKey(accessRuleKey: string): WorkflowContract[] {
  return workflowRegistry.filter(
    (workflow) => workflow.source.accessRuleKey === accessRuleKey || workflow.requirement.accessRuleKey === accessRuleKey,
  );
}

export function getPlaceholderWorkflows(): WorkflowContract[] {
  return workflowRegistry.filter((workflow) => workflow.isPlaceholder || workflow.status === "placeholder" || workflow.status === "coming-soon");
}

export function getHumanConfirmationWorkflows(): WorkflowContract[] {
  return workflowRegistry.filter((workflow) => workflow.requirement.humanConfirmationRequired);
}

export function getWorkflowTargetByCode(code: string): WorkflowTargetCatalogItem | undefined {
  return workflowTargetCatalogByCode[code];
}

export function getWorkflowPreview(workflowOrKey: string | WorkflowContract): WorkflowPreview {
  const workflow = typeof workflowOrKey === "string" ? getWorkflowByKey(workflowOrKey) : workflowOrKey;

  if (!workflow) {
    return {
      workflowKey: typeof workflowOrKey === "string" ? workflowOrKey : "unknown",
      canTrigger: false,
      status: "blocked",
      severity: "medium",
      reason: { zh: "未找到工作流合同定义。", en: "Workflow contract definition not found." },
      humanConfirmationRequired: false,
      auditRequired: false,
      placeholderNotice: {
        zh: "当前仅支持工作流元数据预览，不执行真实引擎、队列或自动化。",
        en: "Workflow metadata preview only; no real engine, queue, or automation execution is implemented.",
      },
    };
  }

  const canTrigger = !nonTriggerableStatuses.includes(workflow.status);
  const reason = reasonForStatus(workflow.status);

  return {
    workflowKey: workflow.key,
    canTrigger,
    status: workflow.status,
    severity: workflow.severity,
    reason,
    triggerLabel: workflow.label.en,
    targetLabel: workflow.target.targetAction,
    humanConfirmationRequired: workflow.requirement.humanConfirmationRequired,
    auditRequired: workflow.requirement.auditRequired,
    permissionRequired: workflow.requirement.permissionRequired,
    placeholderNotice:
      !canTrigger || workflow.isPlaceholder
        ? {
            zh: "仅做合同预览，不触发真实任务、审批、通知、自动化或后端处理。",
            en: "Contract preview only; does not trigger real tasks, approvals, notifications, automation, or backend processing.",
          }
        : {
            zh: "可触发状态仅表示元数据可用，不代表已接入执行引擎。",
            en: "Triggerable status indicates metadata readiness only, not a connected execution engine.",
          },
  };
}

function resolveByAction(action: ActionContract) {
  if (action.futureWorkflowKey) {
    const byFuture = getWorkflowByKey(action.futureWorkflowKey);
    if (byFuture) return byFuture;
  }

  const bySource = getWorkflowsByActionKey(action.key)[0];
  if (bySource) return bySource;

  return undefined;
}

function resolveByAuditEvent(event: AuditEventContract) {
  if (event.futureEventKey) {
    const byFuture = getWorkflowByKey(event.futureEventKey);
    if (byFuture) return byFuture;
  }

  const bySource = getWorkflowsByAuditEventKey(event.key)[0];
  if (bySource) return bySource;

  if (event.requirement.actionKey) {
    const byAction = getWorkflowsByActionKey(event.requirement.actionKey)[0];
    if (byAction) return byAction;
  }

  return undefined;
}

function resolveByAccessRule(rule: AccessRule) {
  if (rule.futureEnforcementKey) {
    const byFuture = getWorkflowByKey(rule.futureEnforcementKey);
    if (byFuture) return byFuture;
  }

  const bySource = getWorkflowsByAccessRuleKey(rule.key)[0];
  if (bySource) return bySource;

  if (rule.targetAction) {
    const byAction = getWorkflowsByActionKey(rule.targetAction)[0];
    if (byAction) return byAction;
  }

  return undefined;
}

export function getActionWorkflowPreview(actionOrKey: string | ActionContract): WorkflowPreview {
  const action = typeof actionOrKey === "string" ? getActionByKey(actionOrKey) : actionOrKey;
  if (!action) {
    return getWorkflowPreview(typeof actionOrKey === "string" ? actionOrKey : "workflow.action.unknown");
  }

  const workflow = resolveByAction(action);
  if (!workflow) {
    return {
      workflowKey: `workflow.action.${action.key}`,
      canTrigger: false,
      status: "placeholder",
      severity: "medium",
      reason: { zh: "动作尚未映射到工作流合同。", en: "Action is not mapped to a workflow contract yet." },
      triggerLabel: action.label.en,
      targetLabel: action.target.targetAction,
      humanConfirmationRequired: action.requirement.confirmationRequired,
      auditRequired: action.requirement.auditRequired,
      permissionRequired: action.requirement.permissionRequired,
      placeholderNotice: {
        zh: "动作仅提供工作流映射占位，不触发真实流程。",
        en: "Action provides workflow mapping placeholder only; no real flow is triggered.",
      },
    };
  }

  return getWorkflowPreview(workflow);
}

export function getAuditWorkflowPreview(auditOrKey: string | AuditEventContract): WorkflowPreview {
  const auditEvent = typeof auditOrKey === "string" ? getAuditEventByKey(auditOrKey) : auditOrKey;
  if (!auditEvent) {
    return getWorkflowPreview(typeof auditOrKey === "string" ? auditOrKey : "workflow.audit.unknown");
  }

  const workflow = resolveByAuditEvent(auditEvent);
  if (!workflow) {
    return {
      workflowKey: `workflow.audit.${auditEvent.key}`,
      canTrigger: false,
      status: "preview-only",
      severity: "low",
      reason: { zh: "审计事件尚未映射工作流合同。", en: "Audit event is not mapped to a workflow contract yet." },
      triggerLabel: auditEvent.label.en,
      targetLabel: auditEvent.target.targetAction,
      humanConfirmationRequired: auditEvent.requirement.confirmationRequired,
      auditRequired: auditEvent.requirement.auditRequired,
      permissionRequired: auditEvent.requirement.permissionRequired,
      placeholderNotice: {
        zh: "仅返回审计到工作流的预览映射，不执行自动化。",
        en: "Returns audit-to-workflow preview mapping only; no automation is executed.",
      },
    };
  }

  return getWorkflowPreview(workflow);
}

export function getAccessWorkflowPreview(accessOrKey: string | AccessRule): WorkflowPreview {
  const accessRule = typeof accessOrKey === "string" ? getAccessRuleByKey(accessOrKey) : accessOrKey;
  if (!accessRule) {
    return getWorkflowPreview(typeof accessOrKey === "string" ? accessOrKey : "workflow.access.unknown");
  }

  const workflow = resolveByAccessRule(accessRule);
  if (!workflow) {
    return {
      workflowKey: `workflow.access.${accessRule.key}`,
      canTrigger: false,
      status: "preview-only",
      severity: "low",
      reason: { zh: "访问规则尚未映射工作流合同。", en: "Access rule is not mapped to a workflow contract yet." },
      triggerLabel: accessRule.label.en,
      targetLabel: accessRule.targetAction ?? accessRule.targetPage ?? "access-preview",
      humanConfirmationRequired: accessRule.condition.requiresConfirmation,
      auditRequired: accessRule.condition.requiresAudit,
      permissionRequired: accessRule.condition.requiredPermission,
      placeholderNotice: {
        zh: "仅提供访问到工作流映射预览，不执行真实拦截或自动化。",
        en: "Access-to-workflow mapping preview only; no real interception or automation is executed.",
      },
    };
  }

  return getWorkflowPreview(workflow);
}

export function resolveWorkflowLabel(workflow: WorkflowContract, locale: SupportedLocale): string {
  return locale === "zh" ? workflow.label.zh : workflow.label.en;
}

export function resolveWorkflowDescription(workflow: WorkflowContract, locale: SupportedLocale): string | undefined {
  if (!workflow.description) return undefined;
  return locale === "zh" ? workflow.description.zh : workflow.description.en;
}

export { workflowRegistry, workflowTargetCatalog };
