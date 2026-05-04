import type { ListQuery } from "../data";

import { getRepositoryProvider } from "../repositories/provider";

export async function listTasks(query?: ListQuery) {
  return getRepositoryProvider().task.list(query);
}

export async function getTaskById(taskId: string) {
  return getRepositoryProvider().task.getById(taskId);
}
