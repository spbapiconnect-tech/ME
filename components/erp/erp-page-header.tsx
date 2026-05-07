import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function ErpPageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: Array<{ label: string; value: string }>;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 rounded-lg border bg-card px-5 py-4 text-card-foreground shadow-sm lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-semibold uppercase text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-semibold text-foreground">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
        {meta?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {meta.map((item) => (
              <Badge key={`${item.label}-${item.value}`} variant="outline" className="normal-case tracking-normal">
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
