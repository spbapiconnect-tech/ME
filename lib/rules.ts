import { ruleContracts, ruleContractsByKey, ruleGroups, ruleGroupsByKey } from "@/config/rules";
import type {
  RuleContract,
  RuleGroupCategory,
  RuleGroupContract,
  RulePreview,
  RuleSeverity,
  RuleStatus,
  RuleType,
} from "@/types/rule";
import type { SupportedLocale } from "@/types/module";

function text(zh: string, en: string) {
  return { zh, en };
}

function shouldEvaluateInMetadata(rule: RuleContract) {
  if (["placeholder", "coming-soon", "blocked", "disabled"].includes(rule.status)) {
    return false;
  }
  if (rule.status === "preview-only") {
    return rule.samplePreviewEnabled === true;
  }
  return rule.status === "active";
}

export function getRuleByKey(ruleKey: string): RuleContract | undefined {
  return ruleContractsByKey[ruleKey];
}

export function getRulesByType(ruleType: RuleType): RuleContract[] {
  return ruleContracts.filter((item) => item.ruleType === ruleType);
}

export function getRulesBySourceModule(sourceModule: string): RuleContract[] {
  return ruleContracts.filter((item) => item.source.sourceModule === sourceModule);
}

export function getRulesByStatus(status: RuleStatus): RuleContract[] {
  return ruleContracts.filter((item) => item.status === status);
}

export function getRulesBySeverity(severity: RuleSeverity): RuleContract[] {
  return ruleContracts.filter((item) => item.severity === severity);
}

export function getRulesByActionKey(actionKey: string): RuleContract[] {
  return ruleContracts.filter((item) => item.source.actionKey === actionKey);
}

export function getRulesByAccessRuleKey(accessRuleKey: string): RuleContract[] {
  return ruleContracts.filter((item) => item.source.accessRuleKey === accessRuleKey);
}

export function getRulesByAuditEventKey(auditEventKey: string): RuleContract[] {
  return ruleContracts.filter((item) => item.source.auditEventKey === auditEventKey);
}

export function getRulesByWorkflowKey(workflowKey: string): RuleContract[] {
  return ruleContracts.filter((item) => item.source.workflowKey === workflowKey);
}

export function getRulesByNotificationKey(notificationKey: string): RuleContract[] {
  return ruleContracts.filter((item) => item.source.notificationKey === notificationKey);
}

export function getRulesByReportWidgetKey(reportWidgetKey: string): RuleContract[] {
  return ruleContracts.filter((item) => item.source.reportWidgetKey === reportWidgetKey);
}

export function getPlaceholderRules(): RuleContract[] {
  return ruleContracts.filter((item) => item.requirement.isPlaceholder || ["placeholder", "coming-soon", "blocked", "disabled"].includes(item.status));
}

export function getHumanReviewRules(): RuleContract[] {
  return ruleContracts.filter((item) => item.requirement.humanReviewRequired);
}

export function getWorkflowTriggerRules(): RuleContract[] {
  return ruleContracts.filter((item) => item.requirement.canTriggerWorkflow);
}

export function getNotificationRules(): RuleContract[] {
  return ruleContracts.filter((item) => item.requirement.canSendNotification);
}

export function getTaskCreationRules(): RuleContract[] {
  return ruleContracts.filter((item) => item.requirement.canCreateTask);
}

export function getRuleGroupByKey(groupKey: string): RuleGroupContract | undefined {
  return ruleGroupsByKey[groupKey];
}

export function getRuleGroupsByCategory(category: RuleGroupCategory): RuleGroupContract[] {
  return ruleGroups.filter((item) => item.category === category);
}

export function getRuleGroupRules(groupOrKey: string | RuleGroupContract): RuleContract[] {
  const group = typeof groupOrKey === "string" ? getRuleGroupByKey(groupOrKey) : groupOrKey;
  if (!group) return [];
  return group.rules.map((ruleKey) => getRuleByKey(ruleKey)).filter((item): item is RuleContract => Boolean(item));
}

export function getRulePreview(ruleOrKey: string | RuleContract): RulePreview {
  const rule = typeof ruleOrKey === "string" ? getRuleByKey(ruleOrKey) : ruleOrKey;
  if (!rule) {
    return {
      ruleKey: typeof ruleOrKey === "string" ? ruleOrKey : "unknown",
      canEvaluate: false,
      status: "blocked",
      severity: "medium",
      title: text("未找到规则定义", "Rule definition not found"),
      reason: text("当前规则不存在，仅返回元数据占位。", "Rule does not exist and returns metadata placeholder only."),
      sourceModule: "unknown",
      inputCount: 0,
      outputCount: 0,
      conditionCount: 0,
      auditRequired: false,
      humanReviewRequired: false,
      canTriggerWorkflow: false,
      canSendNotification: false,
      canCreateTask: false,
      placeholderNotice: text("仅为规则元数据预览，不执行真实引擎。", "Rule metadata preview only; no real engine execution."),
    };
  }

  const canEvaluate = shouldEvaluateInMetadata(rule);
  const reason = canEvaluate
    ? text("当前规则可用于元数据预览评估。", "Rule is available for metadata preview evaluation.")
    : text("当前规则状态仅支持占位/预览，不可评估。", "Rule status supports placeholder/preview only and cannot be evaluated.");

  return {
    ruleKey: rule.key,
    canEvaluate,
    status: rule.status,
    severity: rule.severity,
    title: rule.title,
    reason,
    sourceModule: rule.source.sourceModule,
    inputCount: rule.inputs.length,
    outputCount: rule.outputs.length,
    conditionCount: rule.conditions.length,
    auditRequired: rule.requirement.auditRequired,
    humanReviewRequired: rule.requirement.humanReviewRequired,
    canTriggerWorkflow: rule.requirement.canTriggerWorkflow,
    canSendNotification: rule.requirement.canSendNotification,
    canCreateTask: rule.requirement.canCreateTask,
    placeholderNotice: !canEvaluate
      ? text(
          "仅展示规则/公式合同元数据，不执行规则计算、公式计算、任务创建、通知发送、工作流触发或自动化。",
          "Displays rule/formula contract metadata only; no rule computation, formula computation, task creation, notification sending, workflow triggering, or automation.",
        )
      : text("可评估仅代表元数据预览能力，不代表真实规则引擎执行。", "Evaluable status indicates metadata preview capability only, not real rule-engine execution."),
  };
}

export function resolveRuleTitle(rule: RuleContract, locale: SupportedLocale): string {
  return locale === "zh" ? rule.title.zh : rule.title.en;
}

export function resolveRuleDescription(rule: RuleContract, locale: SupportedLocale): string | undefined {
  if (!rule.description) return undefined;
  return locale === "zh" ? rule.description.zh : rule.description.en;
}

export { ruleContracts, ruleGroups };
