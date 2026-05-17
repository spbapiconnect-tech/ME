"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { OpsStatusChip, type OpsTone, resolveOpsTone } from "./ops-status-chip";

export type OpsCalendarEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  status?: string;
  source?: string;
  tone?: OpsTone;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthDays(anchor: Date) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function eventTone(events: OpsCalendarEvent[]): OpsTone {
  if (events.some((event) => (event.tone ?? resolveOpsTone(event.status)) === "critical")) return "critical";
  if (events.some((event) => (event.tone ?? resolveOpsTone(event.status)) === "danger")) return "danger";
  if (events.some((event) => (event.tone ?? resolveOpsTone(event.status)) === "warning")) return "warning";
  if (events.some((event) => (event.tone ?? resolveOpsTone(event.status)) === "success")) return "success";
  if (events.length) return "info";
  return "neutral";
}

export function OpsCalendarBoard({
  title = "Calendar",
  description = "Month view for scheduled work.",
  events,
  selectedDate,
  anchorDate,
  onSelectedDateChange,
  onAnchorDateChange,
}: {
  title?: string;
  description?: string;
  events: OpsCalendarEvent[];
  selectedDate: string;
  anchorDate: Date;
  onSelectedDateChange: (date: string) => void;
  onAnchorDateChange: (date: Date) => void;
}) {
  const days = getMonthDays(anchorDate);
  const today = formatLocalDate(new Date());
  const monthLabel = anchorDate.toLocaleDateString("en-MY", { month: "long", year: "numeric" });

  const eventsByDate = events.reduce<Record<string, OpsCalendarEvent[]>>((acc, event) => {
    const key = event.date.slice(0, 10);
    acc[key] = [...(acc[key] ?? []), event];
    return acc;
  }, {});

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-primary" />
              {title}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAnchorDateChange(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAnchorDateChange(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">{monthLabel}</span>
          <OpsStatusChip tone="neutral">{events.length} items</OpsStatusChip>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date) => {
            const iso = formatLocalDate(date);
            const dayEvents = eventsByDate[iso] ?? [];
            const tone = eventTone(dayEvents);
            const isSelected = iso === selectedDate;
            const isToday = iso === today;
            const isCurrentMonth = date.getMonth() === anchorDate.getMonth();

            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelectedDateChange(iso)}
                className={cn(
                  "min-h-[72px] rounded-lg border bg-background p-1.5 text-left text-xs transition hover:border-primary/70",
                  isSelected && "border-primary bg-primary/10 ring-1 ring-primary/30",
                  !isCurrentMonth && "opacity-45"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={cn("font-semibold", isToday && "text-primary")}>{date.getDate()}</span>
                  {dayEvents.length ? <OpsStatusChip tone={tone}>{dayEvents.length}</OpsStatusChip> : null}
                </div>

                <div className="mt-1.5 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="truncate rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {event.time ? `${event.time} · ` : ""}
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 ? (
                    <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
