import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MePageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  notice?: string;
  badges?: Array<{ label: string; variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" }>;
  actions?: ReactNode;
  meta?: Array<{ label: string; value: string }>;
}

export function MePageHeader({ eyebrow, title, description, notice, badges = [], actions, meta = [] }: MePageHeaderProps) {
  return (
    <Card className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl space-y-2">
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p> : null}
            <div className="space-y-1">
              <CardTitle className="text-2xl text-slate-950">{title}</CardTitle>
              <CardDescription className="text-sm text-slate-600">{description}</CardDescription>
              {notice ? <CardDescription className="text-sm text-slate-500">{notice}</CardDescription> : null}
            </div>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge.label} variant={badge.variant ?? "secondary"}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        {meta.length > 0 ? (
          <CardContent className="grid gap-3 border-t border-border/50 px-0 pt-4 md:grid-cols-2 xl:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/50 bg-slate-50/90 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{item.value}</p>
              </div>
            ))}
          </CardContent>
        ) : null}
      </CardHeader>
    </Card>
  );
}
