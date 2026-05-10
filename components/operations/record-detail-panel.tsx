"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DetailField {
  label: string;
  value: ReactNode;
}

export interface DetailSection {
  title: string;
  items: ReactNode[];
}

export function RecordDetailPanel({
  title,
  subtitle,
  fields,
  sections = [],
  actionLabels = [],
  className,
  statusLabel,
}: {
  title: string;
  subtitle?: string;
  fields: DetailField[];
  sections?: DetailSection[];
  actionLabels?: string[];
  className?: string;
  statusLabel?: string;
}) {
  return (
    <aside className={cn("space-y-3 rounded-lg border border-border/70 bg-card/75 p-3", className)}>
      <div className="space-y-1 border-b border-border/60 pb-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Selected Record</p>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {statusLabel ? <Badge variant="outline" className="h-5 px-2 text-[10px]">{statusLabel}</Badge> : null}
        </div>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>

      <section className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Key Facts</h4>
        <div className="grid grid-cols-1 gap-1.5">
          {fields.map((field) => (
            <div key={field.label} className="grid grid-cols-[108px_minmax(0,1fr)] gap-2 rounded-sm border border-border/55 px-2 py-1.5 text-xs">
              <p className="font-medium text-muted-foreground">{field.label}</p>
              <div className="truncate text-foreground">{field.value}</div>
            </div>
          ))}
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="space-y-2 border-t border-border/60 pt-2.5">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{section.title}</h4>
          <div className="space-y-1.5">
            {section.items.length ? section.items.map((item, index) => (
              <div key={`${section.title}-${index}`} className="rounded-md border border-border/60 bg-muted/15 px-2.5 py-2 text-xs">
                {item}
              </div>
            )) : <p className="text-xs text-muted-foreground">-</p>}
          </div>
        </section>
      ))}

      {actionLabels.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 border-t border-border/60 pt-2.5">
          {actionLabels.map((label) => (
            <Button key={label} variant="outline" size="sm" className="h-8 justify-start text-xs">
              {label}
            </Button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
