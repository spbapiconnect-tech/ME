import { StatusChip } from "@/components/data/status-chip";
import type { SupportedLocale } from "@/types/module";
import type { TaskPriority } from "@/types/task";

interface TaskPriorityChipProps {
  priority: TaskPriority;
  locale: SupportedLocale;
}

const priorityMeta: Record<TaskPriority, { tone: "neutral" | "success" | "warning" | "danger" | "info" | "brand"; label: { zh: string; en: string } }> = {
  low: { tone: "neutral", label: { zh: "低", en: "Low" } },
  medium: { tone: "info", label: { zh: "中", en: "Medium" } },
  high: { tone: "warning", label: { zh: "高", en: "High" } },
  critical: { tone: "danger", label: { zh: "紧急", en: "Critical" } },
};

export function TaskPriorityChip({ priority, locale }: TaskPriorityChipProps) {
  const meta = priorityMeta[priority];

  return <StatusChip label={meta.label} locale={locale} tone={meta.tone} size="sm" />;
}
