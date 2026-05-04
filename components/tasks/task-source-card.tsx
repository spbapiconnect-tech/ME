import Link from "next/link";

import { getLocalizedText } from "@/lib/localized";
import type { SupportedLocale } from "@/types/module";
import type { TaskRecord } from "@/types/task";

interface TaskSourceCardProps {
  task: TaskRecord;
  locale: SupportedLocale;
}

export function TaskSourceCard({ task, locale }: TaskSourceCardProps) {
  return (
    <section className="me-panel-card task-source-card">
      <div className="panel-header">
        <div>
          <h3 className="me-panel-title">{locale === "zh" ? "来源映射" : "Source Mapping"}</h3>
          <p className="shell-copy">
            {locale === "zh" ? "任务如何从模块信号映射到 Task Engine。" : "How the task maps from a module signal into the Task Engine."}
          </p>
        </div>
      </div>
      <div className="task-source-grid">
        <div className="task-source-column">
          <span>{locale === "zh" ? "来源模块" : "Source Module"}</span>
          <strong>{task.sourceMapping.source_module}</strong>
          <span>{locale === "zh" ? "来源页面" : "Source Page"}</span>
          <strong>{task.sourceMapping.source_page}</strong>
          <span>{locale === "zh" ? "来源事件" : "Source Event"}</span>
          <strong>{task.sourceMapping.source_event}</strong>
        </div>
        <div className="task-source-column">
          <span>{locale === "zh" ? "目标路由" : "Target Route"}</span>
          <strong>{task.sourceMapping.target_route}</strong>
          <span>{locale === "zh" ? "目标动作" : "Target Action"}</span>
          <strong>{task.sourceMapping.target_action}</strong>
          <span>{locale === "zh" ? "权限要求" : "Permission Required"}</span>
          <strong>{task.sourceMapping.permission_required}</strong>
        </div>
      </div>
      <div className="task-linked-records">
        {task.linkedRecords.map((record) => (
          <Link key={`${record.moduleCode}-${record.recordId}`} className="task-linked-record" href={record.route}>
            <span>{getLocalizedText(record.label, locale)}</span>
            <strong>{record.recordId}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
