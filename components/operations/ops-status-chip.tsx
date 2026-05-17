import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type OpsTone = "neutral" | "info" | "success" | "warning" | "danger" | "critical";

const toneClassName: Record<OpsTone, string> = {
  neutral: "border-border bg-muted/40 text-muted-foreground",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
  critical: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function resolveOpsTone(value?: string): OpsTone {
  const text = (value ?? "").toLowerCase();

  if (text.includes("critical") || text.includes("breach") || text.includes("expired")) return "critical";
  if (text.includes("fail") || text.includes("reject") || text.includes("overdue") || text.includes("high")) return "danger";
  if (text.includes("pending") || text.includes("review") || text.includes("soon") || text.includes("medium") || text.includes("watch")) return "warning";
  if (text.includes("complete") || text.includes("passed") || text.includes("resolved") || text.includes("fresh") || text.includes("low")) return "success";
  if (text.includes("scheduled") || text.includes("progress") || text.includes("open") || text.includes("new")) return "info";

  return "neutral";
}

export function OpsStatusChip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: OpsTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-5",
        toneClassName[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
