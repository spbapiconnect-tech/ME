"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StoreOpsTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "review"
  | "muted";

export type StoreOpsTab = {
  value: string;
  label: string;
  count?: number;
  icon?: ReactNode;
};

export type StoreOpsMetric = {
  label: string;
  value: string | number;
  description?: string;
  tone?: StoreOpsTone;
  icon?: ReactNode;
};

function toneRail(tone: StoreOpsTone = "neutral") {
  if (tone === "danger") return "bg-red-500";
  if (tone === "warning") return "bg-amber-500";
  if (tone === "success") return "bg-emerald-500";
  if (tone === "review") return "bg-violet-500";
  if (tone === "primary") return "bg-primary";
  return "bg-muted-foreground";
}

function toneBorder(tone: StoreOpsTone = "neutral") {
  if (tone === "danger") return "border-red-500/60";
  if (tone === "warning") return "border-amber-500/50";
  if (tone === "success") return "border-emerald-500/50";
  if (tone === "review") return "border-violet-500/50";
  if (tone === "primary") return "border-primary/50";
  return "border-border";
}

function toneBadgeVariant(tone: StoreOpsTone = "neutral") {
  if (tone === "danger") return "destructive" as const;
  if (tone === "primary" || tone === "success" || tone === "review") return "outline" as const;
  return "secondary" as const;
}

export function StoreOpsPageHeader({
  eyebrow,
  title,
  description,
  actions,
  filters,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  filters?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow ? <p className="text-sm text-muted-foreground">{eyebrow}</p> : null}
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 max-w-3xl text-muted-foreground">{description}</p> : null}
        </div>
      </div>

      {(actions || filters) ? (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          {filters}
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function StoreOpsTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: StoreOpsTab[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border bg-card p-1">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            variant={value === tab.value ? "secondary" : "ghost"}
            className="h-10 min-w-[96px] shrink-0 gap-2 sm:min-w-0"
            onClick={() => onChange(tab.value)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === "number" ? (
              <span className="rounded-full bg-muted px-1.5 text-[10px]">{tab.count}</span>
            ) : null}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function StoreOpsMetricGrid({
  metrics,
}: {
  metrics: StoreOpsMetric[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className={cn("bg-card", toneBorder(metric.tone))}>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="truncate text-xs text-muted-foreground">{metric.label}</div>
              <div className="mt-1 text-2xl font-semibold">{metric.value}</div>
              {metric.description ? <div className="mt-1 truncate text-xs text-muted-foreground">{metric.description}</div> : null}
            </div>
            {metric.icon ? (
              <div className="rounded-xl border bg-background p-2 text-muted-foreground">
                {metric.icon}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StoreOpsSectionCard({
  title,
  description,
  count,
  tone = "neutral",
  icon,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  count?: number;
  tone?: StoreOpsTone;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("min-w-0 bg-card", toneBorder(tone), className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-base">
              {icon}
              <span className="truncate">{title}</span>
              {typeof count === "number" ? <Badge variant="outline">{count}</Badge> : null}
            </CardTitle>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function StoreOpsActionRow({
  title,
  description,
  meta,
  status,
  tone = "neutral",
  actionLabel,
  onClick,
  compact = false,
}: {
  title: string;
  description?: string;
  meta?: string;
  status?: string;
  tone?: StoreOpsTone;
  actionLabel?: string;
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative grid w-full min-w-0 gap-3 overflow-hidden rounded-xl border bg-card text-left text-card-foreground transition hover:bg-muted/30",
        "p-3 pl-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center",
        compact ? "py-2" : "py-3",
        toneBorder(tone),
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", toneRail(tone))} />

      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{title}</div>
        {description ? <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</div> : null}
        {meta ? <div className="mt-1 truncate text-xs text-muted-foreground">{meta}</div> : null}
      </div>

      {status ? <Badge variant={toneBadgeVariant(tone)}>{status}</Badge> : null}

      {actionLabel ? (
        <div className="flex items-center justify-between gap-2 text-sm font-medium md:justify-end">
          <span>{actionLabel}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      ) : null}
    </button>
  );
}

export function StoreOpsEmptyState({
  title = "Nothing here.",
  description,
  tone = "muted",
  action,
}: {
  title?: string;
  description?: string;
  tone?: StoreOpsTone;
  action?: ReactNode;
}) {
  const icon =
    tone === "danger" ? <AlertCircle className="h-4 w-4 text-red-500" /> :
    tone === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
    <Inbox className="h-4 w-4 text-muted-foreground" />;

  return (
    <div className="rounded-xl border border-dashed bg-background px-4 py-3 text-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="min-w-0">
          <div className="font-medium">{title}</div>
          {description ? <div className="mt-1 text-muted-foreground">{description}</div> : null}
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function StoreOpsScrollableList({
  children,
  maxHeightClassName = "max-h-[520px]",
}: {
  children: ReactNode;
  maxHeightClassName?: string;
}) {
  return (
    <div className={cn("min-w-0 space-y-2 overflow-y-auto pr-1", maxHeightClassName)}>
      {children}
    </div>
  );
}

export function StoreOpsLoadingState({
  label = "Loading operation data...",
}: {
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}
