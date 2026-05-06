"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, ChevronDown, LayoutDashboard, ListTodo, PackageSearch, Presentation, ShieldEllipsis, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getSidebarNavigationGroups,
  hasActiveSidebarChild,
  resolveSidebarNavigationDescription,
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
  LayoutDashboard,
  ListTodo,
  PackageSearch,
  Presentation,
  ShieldEllipsis,
  Users2,
} as const;

function isExplicitlyActive(item: MeSidebarNavigationItem, activeKey?: string) {
  return item.routeKey === activeKey || item.key === activeKey;
}

function renderSidebarItem(item: MeSidebarNavigationItem, pathname: string, locale: MeNavigationLocale, activeKey?: string, depth = 0) {
  const isActive = hasActiveSidebarChild(pathname, item) || isExplicitlyActive(item, activeKey);
  const label = resolveSidebarNavigationLabel(item, locale);
  const description = depth === 0 ? resolveSidebarNavigationDescription(item, locale) : undefined;

  return (
    <div key={item.key} className="grid gap-1">
      {item.href ? (
        <Link
          href={item.href}
          className={cn(
            "group flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all",
            depth > 0 && "ml-4 border-l border-border/60 pl-4",
            isActive
              ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
          )}
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{label}</p>
            {description ? <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{description}</p> : null}
          </div>
          {item.badge ? <Badge variant={isActive ? "default" : "outline"}>{item.badge[locale]}</Badge> : null}
        </Link>
      ) : (
        <div
          className={cn(
            "flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-400",
            depth > 0 && "ml-4 border-l border-border/50 pl-4",
          )}
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{label}</p>
            {description ? <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{description}</p> : null}
          </div>
          <Badge variant="outline">{item.badge?.[locale] ?? "Soon"}</Badge>
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
      <Card className="sticky top-5 overflow-hidden border-border/40 bg-white/85 shadow-md shadow-slate-900/5 backdrop-blur">
        <div className="border-b border-border/50 px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-950">ME Workspace</p>
              <p className="text-xs text-slate-500">Operational navigation shell</p>
            </div>
            <Badge variant="outline">{locale === "zh" ? "只读" : "Read-only"}</Badge>
          </div>
        </div>

        <div className="grid gap-3 px-3 py-4">
          {sidebarGroups.map((group) => {
            const Icon = group.icon ? iconMap[group.icon as keyof typeof iconMap] : LayoutDashboard;
            const isGroupActive = group.items.some((item) => hasActiveSidebarChild(pathname, item) || isExplicitlyActive(item, activeKey));

            return (
              <details key={group.key} className="group rounded-3xl border border-transparent bg-transparent" open={isGroupActive || !group.collapsedByDefault}>
                <summary className="flex list-none items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  <span className="flex items-center gap-3">
                    <span className={cn("rounded-xl p-2", isGroupActive ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500")}>
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block">{group.title[locale]}</span>
                      {group.description ? <span className="block text-xs font-normal text-slate-500">{group.description[locale]}</span> : null}
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
