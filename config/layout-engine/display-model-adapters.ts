import type { DisplayAction, DisplayMeta, DisplayRecord } from "@/types/display-model";
import type { LayoutPageType } from "@/types/layout-engine";
import type { ModuleDefinition } from "@/types/module";
import type { TaskRecord } from "@/types/task";

function toText(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function toDisplayMetaEntries(record: Record<string, unknown>): DisplayMeta[] {
  return Object.entries(record)
    .slice(0, 4)
    .map(([key, value]) => ({
      label: { zh: key, en: key },
      value: toText(value, "--"),
    }));
}

function toDisplayActions(record: Record<string, unknown>): DisplayAction[] {
  const recordId = toText(record.id ?? record.recordId ?? record.taskId, "unknown");

  return [
    {
      key: "view",
      label: { zh: "查看", en: "View" },
      tone: "brand",
      disabled: false,
      sourceEvent: `preview:${recordId}`,
    },
  ];
}

export function toDisplayRecord(
  record: Record<string, unknown>,
  source: Partial<DisplayRecord["source"]> = {},
): DisplayRecord {
  const id = toText(record.id ?? record.recordId ?? record.taskId ?? record.code, "unknown-record");

  return {
    id,
    title: toText(record.title ?? record.name ?? record.taskTitle ?? record.courseName ?? record.productName, id),
    subtitle: toText(record.subtitle ?? record.shortName ?? record.owner ?? record.supplier ?? record.branch, "--"),
    description: toText(record.description ?? record.summary ?? record.note ?? record.status, "No description"),
    status: toText(record.status ?? record.stockStatus ?? record.state, "unknown"),
    priority: toText(record.priority ?? record.severity ?? record.plan, "normal"),
    meta: toDisplayMetaEntries(record),
    actions: toDisplayActions(record),
    source: {
      moduleCode: source.moduleCode ?? "task",
      recordId: source.recordId ?? id,
      pageType: source.pageType ?? "listing",
      sourceComponent: source.sourceComponent ?? "display-model-adapter",
      sourceEvent: source.sourceEvent ?? "preview-render",
    },
  };
}

export function toDisplayRecords(
  records: Array<Record<string, unknown>>,
  source: Partial<DisplayRecord["source"]> = {},
) {
  return records.map((record) => toDisplayRecord(record, source));
}

export function moduleRowToDisplayRecord(moduleItem: ModuleDefinition): DisplayRecord {
  return toDisplayRecord(
    {
      id: moduleItem.code,
      title: moduleItem.name.en,
      subtitle: moduleItem.shortName.en,
      description: moduleItem.description.en,
      status: moduleItem.status,
      priority: moduleItem.plan,
    },
    {
      moduleCode: moduleItem.code,
      recordId: moduleItem.code,
      pageType: "dashboard",
      sourceComponent: "module-registry",
      sourceEvent: "module-preview",
    },
  );
}

export function taskToDisplayRecord(task: TaskRecord): DisplayRecord {
  return {
    id: task.id,
    title: task.title.en,
    subtitle: task.ownerName,
    description: task.description.en,
    status: task.status,
    priority: task.priority,
    meta: [
      { label: { zh: "来源模块", en: "Source Module" }, value: task.sourceModule },
      { label: { zh: "门店", en: "Store" }, value: task.store },
      { label: { zh: "到期时间", en: "Due At" }, value: task.dueAt },
      { label: { zh: "任务类型", en: "Task Type" }, value: task.taskType },
    ],
    actions: task.actions.map((action) => ({
      key: action.key,
      label: action.label,
      tone: action.tone,
      disabled: false,
      sourceEvent: task.sourceMapping.source_event,
    })),
    source: {
      moduleCode: task.sourceModule,
      recordId: task.sourceRecordId,
      pageType: "detail",
      sourceComponent: task.sourceComponent,
      sourceEvent: task.sourceMapping.source_event,
    },
  };
}
