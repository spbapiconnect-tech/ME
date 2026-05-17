"use client";

import { Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { OpsStatusChip, type OpsTone, resolveOpsTone } from "./ops-status-chip";

export type OpsTimelineEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  subtitle?: string;
  source?: string;
  status?: string;
  tone?: OpsTone;
  meta?: string;
};

function parseHour(value: string) {
  const match = value.match(/(?:T|\s|^)(\d{1,2}):(\d{2})/);
  if (!match) return 9;
  const hour = Number(match[1]);
  return Number.isFinite(hour) ? Math.max(0, Math.min(23, hour)) : 9;
}

function displayTime(value: string) {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return value || "No time";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export function OpsDayTimeline({
  title = "Day Timeline",
  description = "Time frame for the selected day.",
  selectedDate,
  events,
  startHour = 0,
  endHour = 24,
  emptyText = "No scheduled work in this time frame.",
  onSelectEvent,
}: {
  title?: string;
  description?: string;
  selectedDate: string;
  events: OpsTimelineEvent[];
  startHour?: number;
  endHour?: number;
  emptyText?: string;
  onSelectEvent?: (event: OpsTimelineEvent) => void;
}) {
  const hours = Array.from({ length: Math.max(0, endHour - startHour) }, (_, index) => startHour + index);
  const eventsByHour = events.reduce<Record<number, OpsTimelineEvent[]>>((acc, event) => {
    const hour = parseHour(event.startTime);
    acc[hour] = [...(acc[hour] ?? []), event];
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock3 className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs font-medium text-muted-foreground">{selectedDate}</p>
      </CardHeader>

      <CardContent>
        {!events.length ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{emptyText}</div>
        ) : null}

        <div className="max-h-[560px] space-y-1 overflow-y-auto pr-1">
          {hours.map((hour) => {
            const hourEvents = eventsByHour[hour] ?? [];
            const label = `${String(hour).padStart(2, "0")}:00`;

            return (
              <div key={hour} className="grid grid-cols-[52px_minmax(0,1fr)] gap-2 border-b border-border/50 py-2 last:border-b-0">
                <div className="pt-2 text-[11px] font-medium text-muted-foreground">{label}</div>
                <div className={cn("min-h-10 space-y-2 rounded-lg", !hourEvents.length && "border border-dashed border-border/50 bg-muted/10")}>
                  {hourEvents.map((event) => {
                    const tone = event.tone ?? resolveOpsTone(event.status);

                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onSelectEvent?.(event)}
                        className="w-full rounded-lg border bg-card px-3 py-2 text-left shadow-sm transition hover:border-primary/70"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-muted-foreground">
                              {displayTime(event.startTime)}
                              {event.endTime ? ` - ${displayTime(event.endTime)}` : ""}
                              {event.source ? ` · ${event.source}` : ""}
                            </div>
                            <div className="mt-0.5 truncate text-sm font-semibold">{event.title}</div>
                            {event.subtitle ? <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{event.subtitle}</div> : null}
                            {event.meta ? <div className="mt-1 text-[11px] text-muted-foreground">{event.meta}</div> : null}
                          </div>
                          {event.status ? <OpsStatusChip tone={tone}>{event.status}</OpsStatusChip> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
