import type { SupportedLocale } from "@/types/module";
import type { TaskRecord, TaskStatus } from "@/types/task";

import { TaskCard } from "@/components/tasks/task-card";

interface TaskBoardProps {
  tasks: TaskRecord[];
  locale: SupportedLocale;
}

const boardStatuses: TaskStatus[] = ["todo", "in-progress", "review", "blocked", "done"];

const boardLabels: Record<TaskStatus, { zh: string; en: string }> = {
  todo: { zh: "待处理", en: "To Do" },
  "in-progress": { zh: "处理中", en: "In Progress" },
  review: { zh: "待复核", en: "Review" },
  blocked: { zh: "阻塞", en: "Blocked" },
  done: { zh: "已完成", en: "Done" },
  rejected: { zh: "已拒绝", en: "Rejected" },
  overdue: { zh: "已逾期", en: "Overdue" },
};

export function TaskBoard({ tasks, locale }: TaskBoardProps) {
  return (
    <div className="task-board">
      {boardStatuses.map((status) => {
        const items = tasks.filter((task) => task.status === status);

        return (
          <section key={status} className="task-board-column">
            <header className="task-board-column-header">
              <div>
                <strong>{boardLabels[status][locale]}</strong>
                <p>{items.length}</p>
              </div>
            </header>
            <div className="task-board-column-body">
              {items.map((task) => (
                <TaskCard key={task.id} task={task} locale={locale} compact />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
