import { Badge } from "@/components/ui/badge";
import type { SupportedLocale } from "@/types/module";
import type { WorkflowSeverity, WorkflowStatus, WorkflowTargetType, WorkflowTriggerType } from "@/types/workflow";

type WorkflowChipKind = "status" | "severity" | "trigger" | "target";

interface WorkflowChipProps {
  kind: WorkflowChipKind;
  locale: SupportedLocale;
  status?: WorkflowStatus;
  severity?: WorkflowSeverity;
  triggerType?: WorkflowTriggerType;
  targetType?: WorkflowTargetType;
}

function statusTone(status: WorkflowStatus): string {
  switch (status) {
    case "active":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
    case "preview-only":
      return "border-sky-500/40 bg-sky-500/10 text-sky-700";
    case "placeholder":
      return "border-amber-500/40 bg-amber-500/10 text-amber-700";
    case "coming-soon":
      return "border-violet-500/40 bg-violet-500/10 text-violet-700";
    case "blocked":
      return "border-rose-500/40 bg-rose-500/10 text-rose-700";
    case "disabled":
    default:
      return "border-muted-foreground/40 bg-muted/50 text-muted-foreground";
  }
}

function localizeType(locale: SupportedLocale, value: string) {
  if (locale === "en") return value;

  const map: Record<string, string> = {
    action: "动作",
    "audit-event": "审计事件",
    "access-rule": "访问规则",
    schedule: "计划",
    manual: "手动",
    system: "系统",
    placeholder: "占位",
    task: "任务",
    approval: "审批",
    notification: "通知",
    report: "报表",
    "webhook-placeholder": "Webhook占位",
    "api-placeholder": "API占位",
    "automation-placeholder": "自动化占位",
    "human-review": "人工复核",
    none: "无",
    low: "低",
    medium: "中",
    high: "高",
    critical: "严重",
    active: "激活",
    "preview-only": "仅预览",
    "coming-soon": "即将上线",
    blocked: "阻止",
    disabled: "禁用",
  };

  return map[value] ?? value;
}

export function WorkflowChip({ kind, locale, status, severity, triggerType, targetType }: WorkflowChipProps) {
  if (kind === "status" && status) {
    return (
      <Badge variant="outline" className={`text-[11px] ${statusTone(status)}`}>
        {localizeType(locale, status)}
      </Badge>
    );
  }

  if (kind === "severity" && severity) {
    return (
      <Badge variant="outline" className="text-[11px]">
        {localizeType(locale, severity)}
      </Badge>
    );
  }

  if (kind === "trigger" && triggerType) {
    return (
      <Badge variant="secondary" className="text-[11px]">
        {localizeType(locale, triggerType)}
      </Badge>
    );
  }

  if (kind === "target" && targetType) {
    return (
      <Badge variant="secondary" className="text-[11px]">
        {localizeType(locale, targetType)}
      </Badge>
    );
  }

  return null;
}
