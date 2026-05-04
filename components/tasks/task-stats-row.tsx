import { KpiCard } from "@/components/data/kpi-card";
import type { SupportedLocale } from "@/types/module";
import type { TaskStats } from "@/types/task";

interface TaskStatsRowProps {
  stats: TaskStats;
  locale: SupportedLocale;
}

export function TaskStatsRow({ stats, locale }: TaskStatsRowProps) {
  return (
    <div className="template-kpi-grid">
      <KpiCard locale={locale} label={{ zh: "任务总数", en: "Total Tasks" }} value={String(stats.total)} tone="brand" />
      <KpiCard locale={locale} label={{ zh: "处理中", en: "In Progress" }} value={String(stats.inProgress)} tone="info" />
      <KpiCard locale={locale} label={{ zh: "待复核", en: "Review" }} value={String(stats.review)} tone="warning" />
      <KpiCard locale={locale} label={{ zh: "已逾期", en: "Overdue" }} value={String(stats.overdue)} tone="danger" />
    </div>
  );
}
