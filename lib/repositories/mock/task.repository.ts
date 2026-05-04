import { taskRecords } from "@/data/tasks/task-records";
import type { TaskPriority, TaskRecord } from "@/types/task";

import { okResult } from "../../data";
import type { TaskRepository } from "../contracts";

const priorityRank: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function toTime(value: string) {
  return new Date(value.replace(" ", "T")).getTime();
}

function sortTasksByPriorityAndDueDate(tasks: TaskRecord[]) {
  return [...tasks].sort((left, right) => {
    const priorityDiff = priorityRank[left.priority] - priorityRank[right.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return toTime(left.dueAt) - toTime(right.dueAt);
  });
}

export function createMockTaskRepository(): TaskRepository {
  return {
    async list() {
      return okResult(sortTasksByPriorityAndDueDate(taskRecords));
    },

    async getById(taskId: string) {
      return okResult(taskRecords.find((task) => task.id === taskId) ?? null);
    },
  };
}
