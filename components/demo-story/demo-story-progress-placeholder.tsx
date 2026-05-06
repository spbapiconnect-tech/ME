import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDemoStoryProgressPreview } from "@/lib/demo-story";

interface DemoStoryProgressPlaceholderProps {
  stepKey: string;
}

export function DemoStoryProgressPlaceholder({ stepKey }: DemoStoryProgressPlaceholderProps) {
  const progress = getDemoStoryProgressPreview(stepKey);

  return (
    <Card size="sm" className="border-dashed">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Progress Placeholder</CardTitle>
        <CardDescription>{progress.notice.en}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="h-2 rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(progress.percentComplete, 8)}%` }} />
        </div>
        <div className="grid gap-1 text-sm text-muted-foreground md:grid-cols-4">
          <p>Step: {progress.currentOrder}/{progress.totalSteps}</p>
          <p>Completed: {progress.completedSteps}</p>
          <p>Remaining: {progress.remainingSteps}</p>
          <p>Visual only: {progress.isPreviewOnly ? "Yes" : "No"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
