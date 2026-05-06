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
    <Card size="sm" className="border-border/40 bg-white/86 shadow-sm shadow-slate-900/5 backdrop-blur">
      <CardContent className="grid gap-4 pt-4">
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

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-slate-50/90 px-3 py-2.5 text-sm text-slate-500 shadow-sm">
            <Search className="size-4 text-slate-400" />
            <span>{locale === "zh" ? "搜索记录、模块或状态（占位）" : "Search records, modules, or status (placeholder)"}</span>
          </div>
          <div className="rounded-2xl border border-border/50 bg-slate-50/90 px-3 py-2.5 text-sm shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Branch</p>
            <p className="mt-1 text-slate-900">All Stores / KCH</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-slate-50/90 px-3 py-2.5 text-sm shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Window</p>
            <p className="mt-1 text-slate-900">Last 7 days</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-slate-50/90 px-3 py-2.5 text-sm shadow-sm">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              <ShieldCheck className="size-3.5" />
              Guardrail
            </p>
            <p className="mt-1 text-slate-900">{locale === "zh" ? "Mock / 只读" : "Mock / Read-only"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
