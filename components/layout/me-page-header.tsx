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
    <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,254,0.92))] shadow-[0_24px_48px_-34px_rgba(15,23,42,0.18)]">
      <CardHeader className="gap-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-4xl space-y-3">
            {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p> : null}
            <div className="space-y-2">
              <CardTitle className="text-[1.75rem] leading-tight text-slate-950 lg:text-[2rem]">{title}</CardTitle>
              <CardDescription className="max-w-3xl text-[15px] text-slate-600">{description}</CardDescription>
              {notice ? <CardDescription className="max-w-3xl text-sm text-slate-500">{notice}</CardDescription> : null}
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
          {actions ? <div className="flex max-w-xl flex-wrap justify-end gap-2">{actions}</div> : null}
        </div>

        {meta.length > 0 ? (
          <CardContent className="grid gap-3 border-t border-border/50 px-0 pt-5 md:grid-cols-2 xl:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label} className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </CardContent>
        ) : null}
      </CardHeader>
    </Card>
  );
}
