import { DetailPanel } from "@/components/data/detail-panel";
import { getLocalizedText } from "@/lib/localized";
import type { SupportedLocale } from "@/types/module";
import type { TaskRecord } from "@/types/task";

import { TaskPriorityChip } from "@/components/tasks/task-priority-chip";
import { TaskStatusChip } from "@/components/tasks/task-status-chip";

interface TaskDetailPanelProps {
  task: TaskRecord;
  locale: SupportedLocale;
}

export function TaskDetailPanel({ task, locale }: TaskDetailPanelProps) {
  return (
    <DetailPanel
      locale={locale}
      title={task.title}
      description={task.description}
      sections={[
        {
          title: { zh: "任务信息", en: "Task Information" },
          rows: [
            { label: locale === "zh" ? "任务编号" : "Task ID", value: task.id },
            { label: locale === "zh" ? "来源模块" : "Source Module", value: task.sourceModule },
            { label: locale === "zh" ? "来源记录" : "Source Record", value: task.sourceRecordId },
            { label: locale === "zh" ? "门店" : "Store", value: task.store },
          ],
        },
        {
          title: { zh: "执行上下文", en: "Execution Context" },
          rows: [
            { label: locale === "zh" ? "负责人" : "Owner", value: task.ownerName },
            { label: locale === "zh" ? "角色" : "Role", value: task.ownerRole },
            { label: locale === "zh" ? "到期时间" : "Due At", value: task.dueAt },
            { label: locale === "zh" ? "更新时间" : "Updated At", value: task.updatedAt },
          ],
        },
      ]}
      contextSlot={
        <div className="task-detail-context">
          <TaskPriorityChip priority={task.priority} locale={locale} />
          <TaskStatusChip status={task.status} locale={locale} />
          <span className="module-chip">{getLocalizedText({ zh: "任务类型", en: "Task Type" }, locale)}: {task.taskType}</span>
        </div>
      }
    />
  );
}
