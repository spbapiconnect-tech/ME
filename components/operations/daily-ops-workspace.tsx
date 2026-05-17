"use client";

import type { ReactNode } from "react";
import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { OpsStatusChip, type OpsTone } from "./ops-status-chip";

export type DailyOpsMetric = {
  label: string;
  value: string;
  tone?: OpsTone;
};

export function DailyOpsWorkspace({
  title,
  description,
  eyebrow = "Daily Ops Workspace",
  branchLabel = "All Branches",
  dateLabel,
  shiftLabel = "All Day",
  searchValue,
  onSearchChange,
  primaryAction,
  secondaryActions,
  metrics = [],
  left,
  center,
  right,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  branchLabel?: string;
  dateLabel?: string;
  shiftLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  metrics?: DailyOpsMetric[];
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5 pb-24 md:pb-6", className)}>
      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
            {description ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {secondaryActions}
            {primaryAction}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="rounded-xl border bg-background px-3 py-2">
              <p className="text-[11px] font-medium text-muted-foreground">Outlet / Branch</p>
              <p className="mt-0.5 truncate text-sm font-semibold">{branchLabel}</p>
            </div>
            <div className="rounded-xl border bg-background px-3 py-2">
              <p className="text-[11px] font-medium text-muted-foreground">Date</p>
              <p className="mt-0.5 truncate text-sm font-semibold">{dateLabel ?? "Today"}</p>
            </div>
            <div className="rounded-xl border bg-background px-3 py-2">
              <p className="text-[11px] font-medium text-muted-foreground">Time Frame</p>
              <p className="mt-0.5 truncate text-sm font-semibold">{shiftLabel}</p>
            </div>
          </div>

          <div className="flex min-w-0 gap-2 lg:min-w-[320px]">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchValue ?? ""}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder="Search work, branch, status..."
                className="pl-8"
              />
            </div>
            <Button type="button" variant="outline" size="icon" aria-label="Filters">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {metrics.length ? (
        <section className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">{metric.label}</p>
                    <p className="mt-1 text-xl font-semibold">{metric.value}</p>
                  </div>
                  {metric.tone ? <OpsStatusChip tone={metric.tone}>{metric.tone}</OpsStatusChip> : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_420px]">
        <aside className="space-y-4">{left}</aside>
        <main className="space-y-4">{center}</main>
        <aside className="space-y-4">{right}</aside>
      </section>
    </div>
  );
}
