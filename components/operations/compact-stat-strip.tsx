"use client";

import { cn } from "@/lib/utils";

export interface CompactStatItem {
  label: string;
  value: string | number;
  tone?: "default" | "warning" | "danger" | "success";
}

const toneClassMap: Record<NonNullable<CompactStatItem["tone"]>, string> = {
  default: "text-foreground",
  warning: "text-yellow-400",
  danger: "text-destructive",
  success: "text-emerald-400",
};

export function CompactStatStrip({ items, className }: { items: CompactStatItem[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5 rounded-lg border border-border/60 bg-card/55 px-2.5 py-1.5", className)}>
      {items.map((item) => (
        <div key={item.label} className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/25 px-2 py-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
          <p className={cn("text-xs font-semibold leading-none", toneClassMap[item.tone ?? "default"])}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
