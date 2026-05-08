"use client";

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
    <Card className="border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 max-w-5xl space-y-3">
            {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p> : null}
            <div className="space-y-2">
              <CardTitle className="text-[1.45rem] leading-tight text-slate-950 sm:text-[1.6rem] xl:text-[1.75rem]">{title}</CardTitle>
              <CardDescription className="max-w-4xl text-[13px] leading-6 text-slate-600">{description}</CardDescription>
              {notice ? <CardDescription className="max-w-4xl text-[13px] leading-6 text-slate-500">{notice}</CardDescription> : null}
            </div>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge.label} variant={badge.variant === "ghost" ? "secondary" : badge.variant ?? "secondary"}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          {actions ? <div className="flex max-w-full flex-wrap gap-2 xl:max-w-xl xl:justify-end">{actions}</div> : null}
        </div>

        {meta.length > 0 ? (
          <CardContent className="grid gap-0 border-t border-border/50 px-0 pt-4 md:grid-cols-2 xl:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label} className="border-b border-slate-100/90 px-0 py-3 last:border-b-0 md:px-4 md:py-3.5 md:[&:nth-last-child(-n+2)]:border-b-0 xl:border-b-0 xl:border-l xl:border-slate-100/90 xl:first:border-l-0 xl:px-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </CardContent>
        ) : null}
      </CardHeader>
    </Card>
  );
}
