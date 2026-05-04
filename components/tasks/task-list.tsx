import type { SupportedLocale } from "@/types/module";
import type { TaskRecord } from "@/types/task";

import { EmptyState } from "@/components/data/empty-state";
import { TaskCard } from "@/components/tasks/task-card";

interface TaskListProps {
  tasks: TaskRecord[];
  locale: SupportedLocale;
  compact?: boolean;
}

export function TaskList({ tasks, locale, compact = false }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        locale={locale}
        title={{ zh: "暂无任务", en: "No Tasks Yet" }}
        description={{ zh: "当前没有可展示的任务占位数据。", en: "There are no task placeholder records to display yet." }}
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} locale={locale} compact={compact} />
      ))}
    </div>
  );
}
