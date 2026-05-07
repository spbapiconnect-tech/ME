"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, ChefHat, ChevronDown, LayoutDashboard, ListTodo, PackageSearch, Presentation, ShieldEllipsis, Users2, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getSidebarNavigationGroups,
  hasActiveSidebarChild,
  resolveSidebarNavigationLabel,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { MeNavigationLocale, MeSidebarNavigationItem } from "@/types/navigation";

interface MeSidebarProps {
  locale?: MeNavigationLocale;
  activeKey?: string;
  className?: string;
}

const iconMap = {
  BarChart3,
  Building2,
  ChefHat,
  LayoutDashboard,
  ListTodo,
  PackageSearch,
  Presentation,
  ShieldEllipsis,
  Users2,
  WalletCards,
} as const;

function isExplicitlyActive(item: MeSidebarNavigationItem, activeKey?: string) {
  return item.routeKey === activeKey || item.key === activeKey;
}

function renderSidebarItem(item: MeSidebarNavigationItem, pathname: string, locale: MeNavigationLocale, activeKey?: string, depth = 0) {
  const isActive = hasActiveSidebarChild(pathname, item) || isExplicitlyActive(item, activeKey);
  const label = resolveSidebarNavigationLabel(item, locale);

  return (
    <div key={item.key} className="grid gap-1">
      {item.href ? (
        <Link
          href={item.href}
          className={cn(
            "group relative flex items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-sm transition-all duration-150",
            depth > 0 && "ml-4 pl-4",
            isActive
              ? "bg-[#EFF6FF] text-blue-700 shadow-[inset_3px_0_0_0_#2563EB]"
              : "text-slate-600 hover:bg-slate-50/90 hover:text-slate-950",
          )}
        >
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors",
                depth > 0 && "mt-2 h-1 w-1",
                isActive && "bg-blue-500",
              )}
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{label}</p>
            </div>
          </div>
          {item.badge ? <Badge variant={isActive ? "default" : "outline"}>{item.badge[locale]}</Badge> : null}
        </Link>
      ) : (
        <div
          className={cn(
            "flex items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-sm text-slate-400",
            depth > 0 && "ml-4 pl-4",
          )}
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="min-w-0">
              <p className="truncate font-medium">{label}</p>
            </div>
          </div>
          <Badge variant="outline">{item.badge?.[locale] ?? "Planned"}</Badge>
        </div>
      )}

      {item.children?.length ? (
        <div className="grid gap-1">{item.children.map((child) => renderSidebarItem(child, pathname, locale, activeKey, depth + 1))}</div>
      ) : null}
    </div>
  );
}

export function MeSidebar({ locale = "en", activeKey, className }: MeSidebarProps) {
  const pathname = usePathname();
  const sidebarGroups = getSidebarNavigationGroups();

  return (
    <aside className={cn("hidden lg:block", className)}>
      <Card className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="border-b border-border px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">ME Platform</p>
              <p className="text-sm font-semibold text-slate-950">Restaurant operations</p>
              <p className="text-xs text-slate-500">Enterprise navigation</p>
            </div>
            <Badge variant="outline">{locale === "zh" ? "当前版本" : "Current release"}</Badge>
          </div>
        </div>

        <div className="grid gap-2 overflow-y-auto px-2 py-3">
          {sidebarGroups.map((group) => {
            const Icon = group.icon ? iconMap[group.icon as keyof typeof iconMap] : LayoutDashboard;
            const isGroupActive = group.items.some((item) => hasActiveSidebarChild(pathname, item) || isExplicitlyActive(item, activeKey));

            return (
              <details
                key={group.key}
                className={cn(
                  "group rounded-[10px] border border-transparent bg-transparent",
                  isGroupActive && "bg-slate-50",
                )}
                open={isGroupActive || !group.collapsedByDefault}
              >
                <summary
                  className={cn(
                    "flex list-none items-center justify-between gap-3 rounded-[8px] px-3 py-2 transition-colors",
                    isGroupActive ? "bg-[#EFF6FF]" : "hover:bg-slate-50/90",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn("rounded-[8px] p-1.5", isGroupActive ? "bg-white text-blue-700 shadow-sm" : "bg-slate-100 text-slate-500")}>
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.title[locale]}</span>
                    </span>
                  </span>
                  <ChevronDown className="size-4 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>

                <div className="mt-1 grid gap-1 px-1 pb-2">
                  {group.items.map((item) => renderSidebarItem(item, pathname, locale, activeKey))}
                </div>
              </details>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}
