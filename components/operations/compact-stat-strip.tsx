"use client";

import { cn } from "@/lib/utils";

export interface CompactStatItem {
  label: string;
  value: string | number;
  tone?: "default" | "warning" | "danger" | "success";
}

const toneClassMap: Record<NonNullable<CompactStatItem["tone"]>, string> = {
  default: "text-foreground",
  warning: "text-yellow-500",
  danger: "text-destructive",
  success: "text-emerald-500",
};

export function CompactStatStrip({ items, className }: { items: CompactStatItem[]; className?: string }) {
  return (
    <div className={cn("grid gap-2 md:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border/70 bg-card/70 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
          <p className={cn("mt-1 text-lg font-semibold leading-none", toneClassMap[item.tone ?? "default"])}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
