import { moduleRegistry } from "@/config/modules";
import { taskRecords } from "@/data/tasks/task-records";
import type { TaskPriority, TaskRecord, TaskSourceSummaryItem, TaskStats, TaskStatus } from "@/types/task";

const priorityRank: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function toTime(value: string) {
  return new Date(value.replace(" ", "T")).getTime();
}

export function sortTasksByPriorityAndDueDate(tasks: TaskRecord[]) {
  return [...tasks].sort((left, right) => {
    const priorityDiff = priorityRank[left.priority] - priorityRank[right.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return toTime(left.dueAt) - toTime(right.dueAt);
  });
}

export function getAllTasks() {
  return sortTasksByPriorityAndDueDate(taskRecords);
}

export function getTasksByStatus(status: TaskStatus) {
  return getAllTasks().filter((task) => task.status === status);
}

export function getTasksBySourceModule(sourceModule: TaskRecord["sourceModule"]) {
  return getAllTasks().filter((task) => task.sourceModule === sourceModule);
}

export function getTasksByOwnerRole(ownerRole: string) {
  return getAllTasks().filter((task) => task.ownerRole === ownerRole);
}

export function getOverdueTasks() {
  return getAllTasks().filter((task) => task.status === "overdue");
}

export function getTaskById(taskId: string) {
  return taskRecords.find((task) => task.id === taskId);
}

export function getTaskTimeline(taskId: string) {
  return getTaskById(taskId)?.timeline ?? [];
}

export function getTaskStats(): TaskStats {
  const stats: TaskStats = {
    total: taskRecords.length,
    overdue: 0,
    inProgress: 0,
    review: 0,
    blocked: 0,
    done: 0,
    byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
    byStatus: { todo: 0, "in-progress": 0, review: 0, blocked: 0, done: 0, rejected: 0, overdue: 0 },
  };

  for (const task of taskRecords) {
    stats.byPriority[task.priority] += 1;
    stats.byStatus[task.status] += 1;

    if (task.status === "overdue") stats.overdue += 1;
    if (task.status === "in-progress") stats.inProgress += 1;
    if (task.status === "review") stats.review += 1;
    if (task.status === "blocked") stats.blocked += 1;
    if (task.status === "done") stats.done += 1;
  }

  return stats;
}

export function getTaskSourceSummary(): TaskSourceSummaryItem[] {
  const routeByModule: Partial<Record<TaskRecord["sourceModule"], string>> = {
    inventory: "/psi/inventory",
    procurement: "/psi/procurement",
    supplier: "/psi/supplier",
    "pos-report": "/reports/pos",
    education: "/training",
    task: "/tasks",
  };

  return moduleRegistry
    .filter((moduleItem) => ["procurement", "supplier", "inventory", "pos-report", "education", "task"].includes(moduleItem.code))
    .map((moduleItem) => {
      const tasks = getTasksBySourceModule(moduleItem.code as TaskRecord["sourceModule"]);
      return {
        moduleCode: moduleItem.code as TaskRecord["sourceModule"],
        total: tasks.length,
        overdue: tasks.filter((task) => task.status === "overdue").length,
        review: tasks.filter((task) => task.status === "review").length,
        route: routeByModule[moduleItem.code as TaskRecord["sourceModule"]] ?? "/tasks",
      };
    })
    .filter((item) => item.total > 0)
    .sort((left, right) => right.total - left.total);
}
