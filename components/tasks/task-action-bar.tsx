import { ActionBar } from "@/components/data/action-bar";
import type { SupportedLocale } from "@/types/module";
import type { TaskRecord } from "@/types/task";

interface TaskActionBarProps {
  task?: TaskRecord;
  locale: SupportedLocale;
}

export function TaskActionBar({ task, locale }: TaskActionBarProps) {
  const primaryAction = task?.actions[0] ?? { key: "create", label: { zh: "创建任务", en: "Create Task" } };
  const secondaryActions = task?.actions.slice(1) ?? [
    { key: "assign", label: { zh: "分配", en: "Assign" } },
    { key: "export", label: { zh: "导出", en: "Export" } },
  ];

  return (
    <ActionBar
      locale={locale}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      bulkActionLabel={{ zh: "批量动作占位", en: "Bulk Action Placeholder" }}
    />
  );
}
