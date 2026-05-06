import { Card, CardContent } from "@/components/ui/card";
import type { LocalizedText } from "@/types/module";

interface PsiDetailNoticeProps {
  notice?: LocalizedText;
}

export function PsiDetailNotice({ notice }: PsiDetailNoticeProps) {
  return (
    <Card size="sm">
      <CardContent className="space-y-1 p-4 text-xs text-muted-foreground">
        <div>Read-only detail placeholder only.</div>
        <div>No real status transition.</div>
        <div>No real audit/task/workflow/notification mutation.</div>
        {notice ? <div>{notice.en}</div> : null}
      </CardContent>
    </Card>
  );
}
