import { taskRecords } from "@/data/tasks/task-records";

export const taskSourceMap = taskRecords.map((task) => ({
  taskId: task.id,
  mapping: task.sourceMapping,
}));
