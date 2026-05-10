"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ContextQueuePanel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border/70 bg-card/70 p-3", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}
