import Link from "next/link";

import { getLocalizedText } from "@/lib/localized";
import type { SupportedLocale } from "@/types/module";
import type { TaskRecord } from "@/types/task";

import { TaskPriorityChip } from "@/components/tasks/task-priority-chip";
import { TaskStatusChip } from "@/components/tasks/task-status-chip";

interface TaskCardProps {
  task: TaskRecord;
  locale: SupportedLocale;
  compact?: boolean;
}

export function TaskCard({ task, locale, compact = false }: TaskCardProps) {
  return (
    <article className="task-card" data-compact={compact}>
      <div className="task-card-header">
        <div className="task-card-copy">
          <span className="task-card-id">{task.id}</span>
          <h3>{getLocalizedText(task.title, locale)}</h3>
          <p>{getLocalizedText(task.description, locale)}</p>
        </div>
        <div className="task-card-chip-row">
          <TaskPriorityChip priority={task.priority} locale={locale} />
          <TaskStatusChip status={task.status} locale={locale} />
        </div>
      </div>
      <div className="task-card-meta-grid">
        <span>{locale === "zh" ? "来源" : "Source"}: {task.sourceModule}</span>
        <span>{locale === "zh" ? "负责人" : "Owner"}: {task.ownerName}</span>
        <span>{locale === "zh" ? "角色" : "Role"}: {task.ownerRole}</span>
        <span>{locale === "zh" ? "到期" : "Due"}: {task.dueAt}</span>
      </div>
      <div className="task-card-footer">
        <div className="task-card-tags">
          {task.tags.slice(0, compact ? 2 : 3).map((tag) => (
            <span key={tag} className="module-chip">{tag}</span>
          ))}
        </div>
        <Link className="me-action-button me-action-button--ghost" href={`/tasks/${task.id}`}>
          {locale === "zh" ? "查看详情" : "View Detail"}
        </Link>
      </div>
    </article>
  );
}
