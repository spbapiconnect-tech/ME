import { TaskEnginePage } from "@/components/tasks/task-engine-page";
import { getTasksPageData } from "@/lib/page-data";

export default async function TasksPage() {
  const pageData = await getTasksPageData();

  return <TaskEnginePage tasks={pageData.tasks} dataError={pageData.error} />;
}
