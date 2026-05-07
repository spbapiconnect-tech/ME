"use client";

import { useMemo } from "react";

import { CalendarDays, GitBranch, Monitor, Search, ShieldCheck, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { MeMobileNav } from "@/components/navigation/me-mobile-nav";
import { Badge } from "@/components/ui/badge";
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
    <div className="border-b border-border bg-white/92 px-0 py-2">
      <div className="grid gap-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
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
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <MeMobileNav locale={locale} />
            <Badge variant="outline">
              <UserCircle2 className="size-3" />
              Ops Coordinator
            </Badge>
          </div>
        </div>

        <div className="grid gap-2 xl:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,0.85fr))]">
          <div className="flex min-w-0 items-center gap-2 rounded-[8px] border border-border bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="size-4 text-slate-400" />
            <span className="truncate">{locale === "zh" ? "搜索记录、模块或状态（占位）" : "Search records, modules, or status"}</span>
          </div>
          <div className="rounded-[8px] border border-border bg-slate-50 px-3 py-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Branch</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">All Stores / KCH</p>
          </div>
          <div className="rounded-[8px] border border-border bg-slate-50 px-3 py-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Window</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Last 7 days</p>
          </div>
          <div className="rounded-[8px] border border-border bg-slate-50 px-3 py-2 text-sm">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <ShieldCheck className="size-3.5" />
              Guardrail
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{locale === "zh" ? "Mock / 只读" : "Mock / Read-only"}</p>
          </div>
          <div className="rounded-[8px] border border-border bg-slate-50 px-3 py-2 text-sm">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <Monitor className="size-3.5" />
              Display
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Desktop / Comfortable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
