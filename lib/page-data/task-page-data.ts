import type { TaskRecord } from "@/types/task";

import type { DataMeta } from "../data";
import { getTaskById, listTasks } from "../services";

export interface TasksPageData {
  tasks: TaskRecord[];
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export async function getTasksPageData(): Promise<TasksPageData> {
  const result = await listTasks();

  if (!result.ok) {
    return {
      tasks: [],
      meta: result.meta,
      isMock: result.meta.source === "mock",
      error: result.error.message,
    };
  }

  return {
    tasks: result.data,
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}

export interface TaskDetailPageData {
  taskId: string;
  task: TaskRecord | null;
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export async function getTaskDetailPageData(taskId: string): Promise<TaskDetailPageData> {
  const result = await getTaskById(taskId);

  if (!result.ok) {
    return {
      taskId,
      task: null,
      meta: result.meta,
      isMock: result.meta.source === "mock",
      error: result.error.message,
    };
  }

  return {
    taskId,
    task: result.data,
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}
