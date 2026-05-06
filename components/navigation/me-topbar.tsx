"use client";

import { useMemo } from "react";

import { CalendarDays, GitBranch, Search, ShieldCheck, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { MeMobileNav } from "@/components/navigation/me-mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSidebarNavigationGroups, resolveSidebarNavigationLabel } from "@/lib/navigation";
import type { MeNavigationLocale } from "@/types/navigation";

interface MeTopbarProps {
  locale?: MeNavigationLocale;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export function MeTopbar({ locale = "en" }: MeTopbarProps) {
  const pathname = usePathname();

  const activeLabel = useMemo(() => {
    const items = getSidebarNavigationGroups().flatMap((group) => group.items);
    const active = items.find((item) => {
      if (!item.href) return false;
      if (item.href === "/") return pathname === "/";
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    });

    return active ? resolveSidebarNavigationLabel(active, locale) : "Workspace";
  }, [locale, pathname]);

  return (
    <Card size="sm" className="border-border/70 bg-white/84 shadow-[0_16px_34px_-30px_rgba(15,23,42,0.16)] backdrop-blur">
      <CardContent className="grid gap-3 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>ME</Badge>
            <Badge variant="outline">
              <GitBranch className="size-3" />
              develop
            </Badge>
            <Badge variant="outline">
              <CalendarDays className="size-3" />
              {formatToday()}
            </Badge>
            <Badge variant="secondary">{activeLabel}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <MeMobileNav locale={locale} />
            <Badge variant="outline">
              <UserCircle2 className="size-3" />
              Ops Coordinator
            </Badge>
          </div>
        </div>

        <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50/88 px-3.5 py-2.5 text-sm text-slate-500 ring-1 ring-slate-200/70">
            <Search className="size-4 text-slate-400" />
            <span>{locale === "zh" ? "搜索记录、模块或状态（占位）" : "Search records, modules, or status (placeholder)"}</span>
          </div>
          <div className="rounded-2xl bg-slate-50/88 px-3.5 py-2.5 text-sm ring-1 ring-slate-200/70">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Branch</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">All Stores / KCH</p>
          </div>
          <div className="rounded-2xl bg-slate-50/88 px-3.5 py-2.5 text-sm ring-1 ring-slate-200/70">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Window</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Last 7 days</p>
          </div>
          <div className="rounded-2xl bg-slate-50/88 px-3.5 py-2.5 text-sm ring-1 ring-slate-200/70">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <ShieldCheck className="size-3.5" />
              Guardrail
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{locale === "zh" ? "Mock / 只读" : "Mock / Read-only"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
