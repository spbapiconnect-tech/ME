"use client";

import { useEffect, useMemo, useState } from "react";

import { Bell, CalendarDays, CheckCircle2, ChevronDown, Globe2, MoonStar, Search, SunMedium, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { MeInlineToast } from "@/components/layout/me-inline-toast";
import { MeMobileNav } from "@/components/navigation/me-mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSidebarNavigationGroups, resolveSidebarNavigationLabel } from "@/lib/navigation";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { MeNavigationLocale } from "@/types/navigation";

interface MeTopbarProps {
  locale?: MeNavigationLocale;
}

const branchOptions = ["All Stores", "KCH", "BTU", "Central Kitchen"];
const windowOptions = ["Today", "Last 7 Days", "This Week", "This Month"];

function formatToday(locale: MeNavigationLocale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function themeLabel(theme: "bright" | "dark" | "moon", locale: MeNavigationLocale) {
  const labels = {
    bright: locale === "zh" ? "明亮" : "Bright",
    dark: locale === "zh" ? "深色" : "Dark",
    moon: locale === "zh" ? "月夜" : "Moon",
  };

  return labels[theme];
}

export function MeTopbar({ locale = "en" }: MeTopbarProps) {
  const pathname = usePathname();
  const storeLocale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const setLocale = useUiPreferencesStore((state) => state.setLocale);
  const setTheme = useUiPreferencesStore((state) => state.setTheme);
  const resolvedLocale = storeLocale ?? locale;
  const [branch, setBranch] = useState(branchOptions[0]);
  const [windowRange, setWindowRange] = useState(windowOptions[1]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeLabel = useMemo(() => {
    const items = getSidebarNavigationGroups().flatMap((group) => group.items);
    const active = items.find((item) => {
      if (!item.href) return false;
      if (item.href === "/") return pathname === "/";
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    });

    return active ? resolveSidebarNavigationLabel(active, resolvedLocale) : resolvedLocale === "zh" ? "工作区" : "Workspace";
  }, [pathname, resolvedLocale]);

  return (
    <>
      <div className="rounded-[12px] border border-border bg-[var(--surface-strong)] px-3 py-3 shadow-[0_1px_2px_var(--shadow-color)] sm:px-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Badge>{activeLabel}</Badge>
              <Badge variant="outline">
                <CalendarDays className="size-3" />
                {formatToday(resolvedLocale)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <MeMobileNav locale={resolvedLocale} />
              <Button size="icon-sm" variant="outline" className="lg:hidden" onClick={() => setNotificationOpen(true)}>
                <Bell className="size-4" />
              </Button>
              <Badge variant="outline" className="hidden sm:inline-flex">
                <UserCircle2 className="size-3" />
                {resolvedLocale === "zh" ? "营运经理" : "Operations Manager"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-2 xl:grid-cols-[minmax(0,1.5fr)_repeat(6,minmax(0,0.78fr))]">
            <label className="flex min-w-0 items-center gap-2 rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--text-secondary)]">
              <Search className="size-4 text-[var(--text-muted)]" />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 outline-none placeholder:text-[var(--text-muted)]"
                placeholder={resolvedLocale === "zh" ? "搜索门店、单据、员工、任务" : "Search branches, records, staff, or tasks"}
              />
            </label>

            <button
              type="button"
              onClick={() => setBranch((current) => branchOptions[(branchOptions.indexOf(current) + 1) % branchOptions.length])}
              className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-left text-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{resolvedLocale === "zh" ? "门店" : "Branch"}</p>
              <p className="mt-1 flex items-center justify-between gap-2 font-semibold text-[var(--text-primary)]">
                <span className="truncate">{branch}</span>
                <ChevronDown className="size-4 text-[var(--text-muted)]" />
              </p>
            </button>

            <button
              type="button"
              onClick={() => setWindowRange((current) => windowOptions[(windowOptions.indexOf(current) + 1) % windowOptions.length])}
              className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-left text-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{resolvedLocale === "zh" ? "周期" : "Window"}</p>
              <p className="mt-1 flex items-center justify-between gap-2 font-semibold text-[var(--text-primary)]">
                <span className="truncate">{windowRange}</span>
                <ChevronDown className="size-4 text-[var(--text-muted)]" />
              </p>
            </button>

            <button
              type="button"
              onClick={() => setNotificationOpen(true)}
              className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-left text-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{resolvedLocale === "zh" ? "通知" : "Alerts"}</p>
              <p className="mt-1 flex items-center justify-between gap-2 font-semibold text-[var(--text-primary)]">
                <span>{resolvedLocale === "zh" ? "3 条待处理" : "3 pending"}</span>
                <Bell className="size-4 text-[var(--text-muted)]" />
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                const sequence = ["bright", "dark", "moon"] as const;
                setTheme(sequence[(sequence.indexOf(theme) + 1) % sequence.length]);
                setToast(resolvedLocale === "zh" ? "主题已切换" : "Theme updated");
              }}
              className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-left text-sm"
            >
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {theme === "bright" ? <SunMedium className="size-3.5" /> : <MoonStar className="size-3.5" />}
                {resolvedLocale === "zh" ? "主题" : "Theme"}
              </p>
              <p className="mt-1 font-semibold text-[var(--text-primary)]">{themeLabel(theme, resolvedLocale)}</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setLocale(resolvedLocale === "zh" ? "en" : "zh");
                setToast(resolvedLocale === "zh" ? "已切换为英文" : "Switched to Chinese");
              }}
              className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-left text-sm"
            >
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <Globe2 className="size-3.5" />
                {resolvedLocale === "zh" ? "语言" : "Language"}
              </p>
              <p className="mt-1 font-semibold text-[var(--text-primary)]">{resolvedLocale === "zh" ? "中文" : "English"}</p>
            </button>

            <div className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{resolvedLocale === "zh" ? "用户" : "User"}</p>
              <p className="mt-1 font-semibold text-[var(--text-primary)]">{resolvedLocale === "zh" ? "运营经理" : "Operations Manager"}</p>
            </div>
          </div>

          {toast ? <MeInlineToast message={toast} /> : null}
        </div>
      </div>

      <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{resolvedLocale === "zh" ? "待处理提醒" : "Pending Alerts"}</DialogTitle>
            <DialogDescription>
              {resolvedLocale === "zh"
                ? "门店巡检、任务逾期和库存预警已汇总到同一个运营面板。"
                : "Inspection follow-up, overdue tasks, and stock alerts are grouped into one operations panel."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 text-sm text-[var(--text-secondary)]">
            {[
              resolvedLocale === "zh" ? "KCH 门店低库存需在今天处理" : "KCH low-stock review needs action today",
              resolvedLocale === "zh" ? "两条任务等待复核" : "Two tasks are waiting for review",
              resolvedLocale === "zh" ? "BTU 巡检结果待确认" : "BTU inspection result is pending confirmation",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-3">
                <CheckCircle2 className="mt-0.5 size-4 text-blue-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
