import { TaskDetailPage } from "@/components/tasks/task-detail-page";
import { getTaskDetailPageData } from "@/lib/page-data";

interface TaskDetailRouteProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default async function TaskDetailRoute({ params }: TaskDetailRouteProps) {
  const resolvedParams = await params;
  const pageData = await getTaskDetailPageData(resolvedParams.taskId);

  return <TaskDetailPage taskId={resolvedParams.taskId} task={pageData.task} dataError={pageData.error} />;
}
