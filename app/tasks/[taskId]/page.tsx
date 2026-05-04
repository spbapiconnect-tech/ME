import { TaskDetailPage } from "@/components/tasks/task-detail-page";

interface TaskDetailRouteProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default async function TaskDetailRoute({ params }: TaskDetailRouteProps) {
  const resolvedParams = await params;

  return <TaskDetailPage taskId={resolvedParams.taskId} />;
}
