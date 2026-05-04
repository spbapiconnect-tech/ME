import type { TaskStats } from "@/types/task";

export const taskStatsSnapshot: TaskStats = {
  total: 14,
  overdue: 1,
  inProgress: 3,
  review: 2,
  blocked: 1,
  done: 2,
  byPriority: {
    low: 1,
    medium: 5,
    high: 5,
    critical: 3,
  },
  byStatus: {
    todo: 5,
    "in-progress": 3,
    review: 2,
    blocked: 1,
    done: 2,
    rejected: 0,
    overdue: 1,
  },
};
