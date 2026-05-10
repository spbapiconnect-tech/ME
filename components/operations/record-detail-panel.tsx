"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
}: {
  title: string;
  subtitle?: string;
  fields: DetailField[];
  sections?: DetailSection[];
  actionLabels?: string[];
  className?: string;
}) {
  return (
    <aside className={cn("space-y-3 rounded-lg border border-border/70 bg-card/70 p-3", className)}>
      <div className="space-y-1 border-b border-border/60 pb-2.5">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-2 text-xs">
            <p className="font-medium text-muted-foreground">{field.label}</p>
            <div className="truncate text-foreground">{field.value}</div>
          </div>
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.title} className="space-y-2 border-t border-border/60 pt-2.5">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{section.title}</h4>
          <div className="space-y-1.5">
            {section.items.map((item, index) => (
              <div key={`${section.title}-${index}`} className="rounded-md border border-border/60 px-2.5 py-2 text-xs">
                {item}
              </div>
            ))}
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
