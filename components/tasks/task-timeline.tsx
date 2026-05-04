import { Timeline } from "@/components/data/timeline";
import type { SupportedLocale } from "@/types/module";
import type { TaskRecord } from "@/types/task";

interface TaskTimelineProps {
  task: TaskRecord;
  locale: SupportedLocale;
}

export function TaskTimeline({ task, locale }: TaskTimelineProps) {
  return (
    <Timeline
      locale={locale}
      title={{ zh: "任务时间线", en: "Task Timeline" }}
      items={task.timeline.map((item) => ({
        title: item.title,
        timestamp: item.timestamp,
        status: item.status,
      }))}
    />
  );
}
