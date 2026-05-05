import { notificationRules, notificationRulesByKey, notificationTemplateCatalogByCode } from "@/config/notifications";
import { getAccessRuleByKey } from "@/lib/access";
import { getActionByKey } from "@/lib/actions";
import { getAuditEventByKey } from "@/lib/audit";
import { getWorkflowByKey } from "@/lib/workflow";
import type { AccessRule } from "@/types/access-control";
import type { ActionContract } from "@/types/action-contract";
import type { AuditEventContract } from "@/types/audit";
import type { SupportedLocale } from "@/types/module";
import type {
  NotificationCategory,
  NotificationChannel,
  NotificationContract,
  NotificationPreview,
  NotificationStatus,
  NotificationTemplate,
} from "@/types/notification";
import type { WorkflowContract } from "@/types/workflow";

const nonSendableStatus: NotificationStatus[] = ["preview-only", "placeholder", "coming-soon", "blocked", "disabled"];

function canSendInPreview(status: NotificationStatus) {
  return status === "active";
}

function reasonForStatus(status: NotificationStatus) {
  switch (status) {
    case "active":
      return {
        zh: "状态为 active，在元数据预览中标记为可发送。",
        en: "Status is active and marked sendable in metadata preview.",
      };
    case "preview-only":
      return {
        zh: "当前为预览模式，不发送真实通知。",
        en: "Current state is preview-only and does not send real notifications.",
      };
    case "placeholder":
      return {
        zh: "当前为占位合同，不发送真实通知。",
        en: "Current state is a placeholder contract and does not send real notifications.",
      };
    case "coming-soon":
      return {
        zh: "能力即将开放，当前仅保留元数据。",
        en: "Capability is coming soon and remains metadata-only.",
      };
    case "blocked":
      return {
        zh: "通知被阻止，当前不可发送。",
        en: "Notification is blocked and currently cannot send.",
      };
    case "disabled":
    default:
      return {
        zh: "通知已禁用，当前不可发送。",
        en: "Notification is disabled and currently cannot send.",
      };
  }
}

function findByLinkedKey(linkedKey: string, key: "workflow" | "action" | "audit" | "access") {
  return notificationRules.find((item) => {
    if (key === "workflow") {
      return item.source.workflowKey === linkedKey || item.requirement.workflowKey === linkedKey;
    }
    if (key === "action") {
      return item.source.actionKey === linkedKey || item.requirement.actionKey === linkedKey;
    }
    if (key === "audit") {
      return item.source.auditEventKey === linkedKey || item.requirement.auditEventKey === linkedKey;
    }
    return item.source.accessRuleKey === linkedKey || item.requirement.accessRuleKey === linkedKey;
  });
}

export function getNotificationByKey(notificationKey: string): NotificationContract | undefined {
  return notificationRulesByKey[notificationKey];
}

export function getNotificationsByChannel(channel: NotificationChannel): NotificationContract[] {
  return notificationRules.filter((rule) => rule.channel === channel);
}

export function getNotificationsByCategory(category: NotificationCategory): NotificationContract[] {
  return notificationRules.filter((rule) => rule.category === category);
}

export function getNotificationsBySourceModule(sourceModule: string): NotificationContract[] {
  return notificationRules.filter((rule) => rule.source.sourceModule === sourceModule);
}

export function getNotificationsByRecipientRole(role: string): NotificationContract[] {
  return notificationRules.filter((rule) => rule.recipient.role === role || rule.requirement.roleRequired === role);
}

export function getNotificationsByWorkflowKey(workflowKey: string): NotificationContract[] {
  return notificationRules.filter((rule) => rule.source.workflowKey === workflowKey || rule.requirement.workflowKey === workflowKey);
}

export function getNotificationsByActionKey(actionKey: string): NotificationContract[] {
  return notificationRules.filter((rule) => rule.source.actionKey === actionKey || rule.requirement.actionKey === actionKey);
}

export function getNotificationsByAuditEventKey(auditEventKey: string): NotificationContract[] {
  return notificationRules.filter((rule) => rule.source.auditEventKey === auditEventKey || rule.requirement.auditEventKey === auditEventKey);
}

export function getNotificationsByAccessRuleKey(accessRuleKey: string): NotificationContract[] {
  return notificationRules.filter((rule) => rule.source.accessRuleKey === accessRuleKey || rule.requirement.accessRuleKey === accessRuleKey);
}

export function getPlaceholderNotifications(): NotificationContract[] {
  return notificationRules.filter((rule) => rule.isPlaceholder || nonSendableStatus.includes(rule.status));
}

export function getHumanReviewNotifications(): NotificationContract[] {
  return notificationRules.filter((rule) => rule.requirement.humanReviewRequired);
}

export function getNotificationTemplateByCode(code: string): NotificationTemplate | undefined {
  return notificationTemplateCatalogByCode[code];
}
export function getNotificationPreview(notificationOrKey: string | NotificationContract): NotificationPreview {
  const notification = typeof notificationOrKey === "string" ? getNotificationByKey(notificationOrKey) : notificationOrKey;

  if (!notification) {
    return {
      notificationKey: typeof notificationOrKey === "string" ? notificationOrKey : "unknown",
      canSend: false,
      status: "blocked",
      severity: "medium",
      channel: "system",
      reason: { zh: "未找到通知合同定义。", en: "Notification contract definition not found." },
      humanReviewRequired: false,
      auditRequired: false,
      placeholderNotice: {
        zh: "当前仅支持通知元数据预览，不做真实消息发送。",
        en: "Notification metadata preview only; no real message delivery is performed.",
      },
    };
  }

  const canSend = canSendInPreview(notification.status);

  return {
    notificationKey: notification.key,
    canSend,
    status: notification.status,
    severity: notification.severity,
    channel: notification.channel,
    reason: reasonForStatus(notification.status),
    recipientLabel: notification.recipient.label?.en ?? notification.recipient.role ?? notification.recipient.store,
    messageTitle: notification.message.title.en,
    humanReviewRequired: notification.requirement.humanReviewRequired,
    auditRequired: notification.requirement.auditRequired,
    permissionRequired: notification.requirement.permissionRequired,
    placeholderNotice:
      !canSend || notification.isPlaceholder
        ? {
            zh: "仅用于通知合同预览，不接入推送、邮件、短信、WhatsApp、webhook 或后端发送。",
            en: "Used for notification contract preview only; no push, email, SMS, WhatsApp, webhook, or backend delivery is connected.",
          }
        : {
            zh: "可发送状态仅表示元数据可用，不代表已接入真实通知服务。",
            en: "Sendable status indicates metadata readiness only, not a connected notification provider.",
          },
  };
}

export function getWorkflowNotificationPreview(workflowOrKey: string | WorkflowContract): NotificationPreview {
  const workflow = typeof workflowOrKey === "string" ? getWorkflowByKey(workflowOrKey) : workflowOrKey;
  if (!workflow) {
    return getNotificationPreview(typeof workflowOrKey === "string" ? workflowOrKey : "notification.workflow.unknown");
  }

  const mapped = findByLinkedKey(workflow.key, "workflow");
  if (mapped) {
    return getNotificationPreview(mapped);
  }

  if (workflow.futureQueueKey) {
    return {
      notificationKey: `notification.workflow.${workflow.key}`,
      canSend: false,
      status: "placeholder",
      severity: workflow.severity,
      channel: "system",
      reason: {
        zh: `工作流声明 futureQueueKey=${workflow.futureQueueKey}，但通知仍未映射。`,
        en: `Workflow declares futureQueueKey=${workflow.futureQueueKey}, but notification mapping is not defined yet.`,
      },
      messageTitle: workflow.label.en,
      humanReviewRequired: workflow.requirement.humanConfirmationRequired,
      auditRequired: workflow.requirement.auditRequired,
      permissionRequired: workflow.requirement.permissionRequired,
      placeholderNotice: {
        zh: "当前仅返回工作流到通知的占位预览，不触发真实发送。",
        en: "Returns workflow-to-notification placeholder preview only; no real sending is triggered.",
      },
    };
  }

  return getNotificationPreview("notification.system.previewOnly");
}

export function getActionNotificationPreview(actionOrKey: string | ActionContract): NotificationPreview {
  const action = typeof actionOrKey === "string" ? getActionByKey(actionOrKey) : actionOrKey;
  if (!action) {
    return getNotificationPreview(typeof actionOrKey === "string" ? actionOrKey : "notification.action.unknown");
  }

  const mapped = findByLinkedKey(action.key, "action");
  if (mapped) {
    return getNotificationPreview(mapped);
  }

  return {
    notificationKey: `notification.action.${action.key}`,
    canSend: false,
    status: "preview-only",
    severity: action.status === "active" ? "medium" : "low",
    channel: "system",
    reason: { zh: "动作尚未映射通知合同。", en: "Action is not mapped to a notification contract yet." },
    messageTitle: action.label.en,
    humanReviewRequired: action.requirement.confirmationRequired,
    auditRequired: action.requirement.auditRequired,
    permissionRequired: action.requirement.permissionRequired,
    placeholderNotice: {
      zh: "仅返回动作到通知映射预览，不执行真实发送。",
      en: "Returns action-to-notification mapping preview only; no real sending is performed.",
    },
  };
}
export function getAuditNotificationPreview(auditOrKey: string | AuditEventContract): NotificationPreview {
  const auditEvent = typeof auditOrKey === "string" ? getAuditEventByKey(auditOrKey) : auditOrKey;
  if (!auditEvent) {
    return getNotificationPreview(typeof auditOrKey === "string" ? auditOrKey : "notification.audit.unknown");
  }

  const mapped = findByLinkedKey(auditEvent.key, "audit");
  if (mapped) {
    return getNotificationPreview(mapped);
  }

  return {
    notificationKey: `notification.audit.${auditEvent.key}`,
    canSend: false,
    status: "preview-only",
    severity: auditEvent.severity === "critical" ? "critical" : "low",
    channel: "system",
    reason: { zh: "审计事件尚未映射通知合同。", en: "Audit event is not mapped to a notification contract yet." },
    messageTitle: auditEvent.label.en,
    humanReviewRequired: auditEvent.requirement.confirmationRequired,
    auditRequired: auditEvent.requirement.auditRequired,
    permissionRequired: auditEvent.requirement.permissionRequired,
    placeholderNotice: {
      zh: "仅返回审计到通知映射预览，不执行真实消息推送。",
      en: "Returns audit-to-notification mapping preview only; no real message delivery is performed.",
    },
  };
}

export function getAccessNotificationPreview(accessOrKey: string | AccessRule): NotificationPreview {
  const accessRule = typeof accessOrKey === "string" ? getAccessRuleByKey(accessOrKey) : accessOrKey;
  if (!accessRule) {
    return getNotificationPreview(typeof accessOrKey === "string" ? accessOrKey : "notification.access.unknown");
  }

  const mapped = findByLinkedKey(accessRule.key, "access");
  if (mapped) {
    return getNotificationPreview(mapped);
  }

  return {
    notificationKey: `notification.access.${accessRule.key}`,
    canSend: false,
    status: "preview-only",
    severity: "low",
    channel: "system",
    reason: { zh: "访问规则尚未映射通知合同。", en: "Access rule is not mapped to a notification contract yet." },
    messageTitle: accessRule.label.en,
    humanReviewRequired: accessRule.condition.requiresConfirmation,
    auditRequired: accessRule.condition.requiresAudit,
    permissionRequired: accessRule.condition.requiredPermission,
    placeholderNotice: {
      zh: "仅提供访问规则通知预览，不执行真实消息发送。",
      en: "Provides access-rule notification preview only; no real message delivery is performed.",
    },
  };
}

export function resolveNotificationLabel(notification: NotificationContract, locale: SupportedLocale): string {
  return locale === "zh" ? notification.label.zh : notification.label.en;
}

export function resolveNotificationDescription(notification: NotificationContract, locale: SupportedLocale): string | undefined {
  if (!notification.description) {
    return undefined;
  }
  return locale === "zh" ? notification.description.zh : notification.description.en;
}

export { notificationRules };
