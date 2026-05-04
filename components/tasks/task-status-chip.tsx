import { StatusChip } from "@/components/data/status-chip";
import type { SupportedLocale } from "@/types/module";
import type { TaskStatus } from "@/types/task";

interface TaskStatusChipProps {
  status: TaskStatus;
  locale: SupportedLocale;
}

const statusMeta: Record<TaskStatus, { tone: "neutral" | "success" | "warning" | "danger" | "info" | "brand"; label: { zh: string; en: string } }> = {
  todo: { tone: "neutral", label: { zh: "待处理", en: "To Do" } },
  "in-progress": { tone: "brand", label: { zh: "处理中", en: "In Progress" } },
  review: { tone: "info", label: { zh: "待复核", en: "Review" } },
  blocked: { tone: "warning", label: { zh: "阻塞", en: "Blocked" } },
  done: { tone: "success", label: { zh: "已完成", en: "Done" } },
  rejected: { tone: "danger", label: { zh: "已拒绝", en: "Rejected" } },
  overdue: { tone: "danger", label: { zh: "已逾期", en: "Overdue" } },
};

export function TaskStatusChip({ status, locale }: TaskStatusChipProps) {
  const meta = statusMeta[status];

  return <StatusChip label={meta.label} locale={locale} tone={meta.tone} size="sm" dot />;
}
