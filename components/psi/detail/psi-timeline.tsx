import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiTimelineEvent } from "@/types/psi";

interface PsiTimelineProps {
  events: PsiTimelineEvent[];
}

export function PsiTimeline({ events }: PsiTimelineProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Timeline Placeholder</CardTitle>
        <CardDescription>No real audit persistence. Events are preview-only placeholders.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {events.map((event) => (
          <div key={event.key} className="rounded-lg border p-3 text-xs">
            <div className="font-medium">{event.title.en}</div>
            <div className="text-muted-foreground">
              {event.actor.name.en} · {event.occurredAt}
            </div>
            <div className="text-muted-foreground">
              {event.eventType} · {event.status}
            </div>
          </div>
        ))}
        {events.length === 0 ? <div className="text-xs text-muted-foreground">No timeline events</div> : null}
      </CardContent>
    </Card>
  );
}
