import { psiActionDrafts, psiActionDraftsByKey } from "@/config/psi";
import type {
  PsiActionDraftCategory,
  PsiActionDraftContract,
  PsiActionDraftIntent,
  PsiActionDraftPreview,
  PsiActionDraftStatus,
} from "@/types/psi/actions";
import type { SupportedLocale } from "@/types/module";

function text(zh: string, en: string) {
  return { zh, en };
}

const blockedStatuses: PsiActionDraftStatus[] = ["placeholder", "preview-only", "coming-soon", "blocked", "disabled"];

export function getPsiActionDraftByKey(key: string): PsiActionDraftContract | undefined {
  return psiActionDraftsByKey[key];
}

export function getPsiActionDraftsByCategory(category: PsiActionDraftCategory): PsiActionDraftContract[] {
  return psiActionDrafts.filter((item) => item.category === category);
}

export function getPsiActionDraftsByIntent(intent: PsiActionDraftIntent): PsiActionDraftContract[] {
  return psiActionDrafts.filter((item) => item.intent === intent);
}

export function getPsiActionDraftsByStatus(status: PsiActionDraftStatus): PsiActionDraftContract[] {
  return psiActionDrafts.filter((item) => item.status === status);
}

export function getPsiActionDraftsByModule(moduleCode: string): PsiActionDraftContract[] {
  return psiActionDrafts.filter((item) => item.source.moduleCode === moduleCode);
}

export function getPlaceholderPsiActionDrafts(): PsiActionDraftContract[] {
  return psiActionDrafts.filter((item) => item.requirement.isPlaceholder || blockedStatuses.includes(item.status));
}

export function countPsiActionDraftFields(action: PsiActionDraftContract): number {
  return action.sections.reduce((count, section) => count + section.fields.length, 0);
}

export function countPsiActionDraftRequiredFields(action: PsiActionDraftContract): number {
  return action.sections.reduce((count, section) => count + section.fields.filter((field) => field.required).length, 0);
}

export function getPsiActionDraftPreview(actionOrKey: string | PsiActionDraftContract): PsiActionDraftPreview {
  const action = typeof actionOrKey === "string" ? getPsiActionDraftByKey(actionOrKey) : actionOrKey;
  if (!action) {
    return {
      actionDraftKey: typeof actionOrKey === "string" ? actionOrKey : "unknown",
      canSubmit: false,
      status: "blocked",
      title: text("未找到动作草稿", "Action Draft Not Found"),
      reason: text("当前动作不存在，仅返回占位预览。", "This action does not exist and returns placeholder preview only."),
      fieldCount: 0,
      requiredFieldCount: 0,
      auditRequired: false,
      confirmationRequired: false,
      createsTaskPlaceholder: false,
      triggersWorkflowPlaceholder: false,
      sendsNotificationPlaceholder: false,
      placeholderNotice: text("仅支持预览，不会保存数据。", "Preview only; no data will be saved."),
    };
  }

  const canSubmit = false;
  const reason = blockedStatuses.includes(action.status)
    ? text("当前状态为占位/预览，不允许提交。", "Current status is placeholder/preview and cannot submit.")
    : text("当前里程碑只支持表单占位预览。", "Current milestone supports form placeholder preview only.");

  return {
    actionDraftKey: action.key,
    canSubmit,
    status: action.status,
    title: action.title,
    reason,
    fieldCount: countPsiActionDraftFields(action),
    requiredFieldCount: countPsiActionDraftRequiredFields(action),
    auditRequired: action.requirement.auditRequired,
    confirmationRequired: action.requirement.confirmationRequired,
    createsTaskPlaceholder: action.requirement.createsTaskPlaceholder,
    triggersWorkflowPlaceholder: action.requirement.triggersWorkflowPlaceholder,
    sendsNotificationPlaceholder: action.requirement.sendsNotificationPlaceholder,
    placeholderNotice: text("Preview only - no data will be saved.", "Preview only - no data will be saved."),
  };
}

export function resolvePsiActionDraftTitle(action: PsiActionDraftContract, locale: SupportedLocale): string {
  return locale === "zh" ? action.title.zh : action.title.en;
}

export function resolvePsiActionDraftDescription(action: PsiActionDraftContract, locale: SupportedLocale): string | undefined {
  if (!action.description) return undefined;
  return locale === "zh" ? action.description.zh : action.description.en;
}

export { psiActionDrafts };
