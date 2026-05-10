"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TableFieldChip({
  label,
  tone = "default",
  className,
}: {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "muted";
  className?: string;
}) {
  const toneClassMap: Record<NonNullable<typeof tone>, string> = {
    default: "border-border/70 bg-muted/40 text-foreground",
    success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    warning: "border-yellow-500/25 bg-yellow-500/10 text-yellow-400",
    danger: "border-destructive/30 bg-destructive/10 text-destructive",
    muted: "border-border/60 bg-muted/20 text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={cn("h-5 rounded-sm px-2 text-[10px] font-medium", toneClassMap[tone], className)}>
      {label}
    </Badge>
  );
}
