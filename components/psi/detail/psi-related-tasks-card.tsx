import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiLinkedTaskPlaceholder } from "@/types/psi";

interface PsiRelatedTasksCardProps {
  tasks: PsiLinkedTaskPlaceholder[];
}

export function PsiRelatedTasksCard({ tasks }: PsiRelatedTasksCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Related Task Placeholders</CardTitle>
        <CardDescription>Task creation is not enabled. Linked tasks are read-only placeholders.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {tasks.map((task) => (
          <div key={task.taskId} className="rounded-lg border p-3 text-xs">
            <div className="font-medium">{task.title.en}</div>
            <div className="text-muted-foreground">{task.taskId} · {task.status}</div>
            {task.sourceRef.route ? (
              <Link href={task.sourceRef.route} className="text-primary hover:underline">
                Open linked task route
              </Link>
            ) : null}
          </div>
        ))}
        {tasks.length === 0 ? <div className="text-xs text-muted-foreground">No related task placeholders</div> : null}
      </CardContent>
    </Card>
  );
}
