import { Badge } from "@/components/ui/badge";
import type { SupportedLocale } from "@/types/module";
import type { ReportWidgetSeverity, ReportWidgetSize, ReportWidgetStatus, ReportWidgetType } from "@/types/report-widget";

type ReportWidgetChipKind = "status" | "severity" | "type" | "size";

interface ReportWidgetChipProps {
  kind: ReportWidgetChipKind;
  locale: SupportedLocale;
  status?: ReportWidgetStatus;
  severity?: ReportWidgetSeverity;
  widgetType?: ReportWidgetType;
  size?: ReportWidgetSize;
}

const statusLabel: Record<ReportWidgetStatus, { zh: string; en: string }> = {
  active: { zh: "已启用", en: "Active" },
  "preview-only": { zh: "已配置", en: "Configured" },
  placeholder: { zh: "规划中", en: "Planned" },
  "coming-soon": { zh: "规划交付", en: "Planned Delivery" },
  blocked: { zh: "阻止", en: "Blocked" },
  disabled: { zh: "禁用", en: "Disabled" },
};

const severityLabel: Record<ReportWidgetSeverity, { zh: string; en: string }> = {
  neutral: { zh: "中性", en: "Neutral" },
  low: { zh: "低", en: "Low" },
  medium: { zh: "中", en: "Medium" },
  high: { zh: "高", en: "High" },
  critical: { zh: "严重", en: "Critical" },
};

const typeLabel: Record<ReportWidgetType, { zh: string; en: string }> = {
  kpi: { zh: "指标", en: "KPI" },
  chart: { zh: "图表", en: "Chart" },
  table: { zh: "表格", en: "Table" },
  list: { zh: "列表", en: "List" },
  "status-summary": { zh: "状态摘要", en: "Status Summary" },
  trend: { zh: "趋势", en: "Trend" },
  distribution: { zh: "分布", en: "Distribution" },
  alert: { zh: "告警", en: "Alert" },
  "task-summary": { zh: "任务摘要", en: "Task Summary" },
  "workflow-summary": { zh: "流程摘要", en: "Workflow Summary" },
  "notification-summary": { zh: "通知摘要", en: "Notification Summary" },
  "audit-summary": { zh: "审计摘要", en: "Audit Summary" },
  placeholder: { zh: "规划组件", en: "Planned Surface" },
};

const sizeLabel: Record<ReportWidgetSize, { zh: string; en: string }> = {
  sm: { zh: "小", en: "SM" },
  md: { zh: "中", en: "MD" },
  lg: { zh: "大", en: "LG" },
  xl: { zh: "超大", en: "XL" },
  full: { zh: "全宽", en: "Full" },
};

function statusTone(status: ReportWidgetStatus) {
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

export function ReportWidgetChip({ kind, locale, status, severity, widgetType, size }: ReportWidgetChipProps) {
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
    return (
      <Badge variant={severity === "high" || severity === "critical" ? "destructive" : "outline"} className="text-[11px]">
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    );
  }

  if (kind === "type" && widgetType) {
    const label = typeLabel[widgetType];
    return (
      <Badge variant="secondary" className="text-[11px]">
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    );
  }

  if (kind === "size" && size) {
    const label = sizeLabel[size];
    return (
      <Badge variant="outline" className="text-[11px]">
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    );
  }

  return null;
}
