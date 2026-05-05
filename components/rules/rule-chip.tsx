import { Badge } from "@/components/ui/badge";
import type { SupportedLocale } from "@/types/module";
import type { RuleSeverity, RuleStatus, RuleType } from "@/types/rule";

function statusTone(status: RuleStatus): string {
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

const statusLabel: Record<RuleStatus, { zh: string; en: string }> = {
  active: { zh: "启用", en: "Active" },
  "preview-only": { zh: "仅预览", en: "Preview-Only" },
  placeholder: { zh: "占位", en: "Placeholder" },
  "coming-soon": { zh: "即将上线", en: "Coming Soon" },
  blocked: { zh: "阻止", en: "Blocked" },
  disabled: { zh: "禁用", en: "Disabled" },
};

const severityLabel: Record<RuleSeverity, { zh: string; en: string }> = {
  neutral: { zh: "中性", en: "Neutral" },
  low: { zh: "低", en: "Low" },
  medium: { zh: "中", en: "Medium" },
  high: { zh: "高", en: "High" },
  critical: { zh: "严重", en: "Critical" },
};

const typeLabel: Record<RuleType, { zh: string; en: string }> = {
  formula: { zh: "公式", en: "Formula" },
  threshold: { zh: "阈值", en: "Threshold" },
  condition: { zh: "条件", en: "Condition" },
  score: { zh: "评分", en: "Score" },
  risk: { zh: "风险", en: "Risk" },
  sla: { zh: "SLA", en: "SLA" },
  validation: { zh: "校验", en: "Validation" },
  recommendation: { zh: "建议", en: "Recommendation" },
  escalation: { zh: "升级", en: "Escalation" },
  placeholder: { zh: "占位", en: "Placeholder" },
};

export function RuleChip({
  kind,
  locale,
  status,
  severity,
  ruleType,
}: {
  kind: "status" | "severity" | "type";
  locale: SupportedLocale;
  status?: RuleStatus;
  severity?: RuleSeverity;
  ruleType?: RuleType;
}) {
  if (kind === "status" && status) {
    const label = statusLabel[status];
    return (
      <Badge variant="outline" className={`text-[11px] ${statusTone(status)}`}>
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    );
  }

  if (kind === "severity" && severity) {
    const label = severityLabel[severity];
    return <Badge variant={severity === "high" || severity === "critical" ? "destructive" : "outline"}>{locale === "zh" ? label.zh : label.en}</Badge>;
  }

  if (kind === "type" && ruleType) {
    const label = typeLabel[ruleType];
    return <Badge variant="secondary">{locale === "zh" ? label.zh : label.en}</Badge>;
  }

  return null;
}
