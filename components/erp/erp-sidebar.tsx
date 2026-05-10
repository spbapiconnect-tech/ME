"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/lib/i18n";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  AlertCircle,
  ListTodo,
  BarChart3,
  Truck,
  Users,
  Warehouse,
  History,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  Settings,
  LayoutGrid,
} from "lucide-react";

const navigationGroups = [
  {
    key: "dashboard",
    items: [{ key: "dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    key: "storeOperations",
    items: [
      { key: "branches", href: "/branches", icon: Store },
      { key: "inspection", href: "/inspection", icon: ClipboardList },
      { key: "issues", href: "/issues", icon: AlertCircle },
      { key: "tasks", href: "/tasks", icon: ListTodo },
    ],
  },
  {
    key: "psi",
    items: [
      { key: "psiOverview", href: "/psi", icon: BarChart3 },
      { key: "procurement", href: "/psi/procurement", icon: Truck },
      { key: "supplier", href: "/psi/supplier", icon: Users },
      { key: "inventory", href: "/psi/inventory", icon: Warehouse },
      { key: "receiving", href: "/psi/receiving", icon: History },
    ],
  },
  {
    key: "workforce",
    items: [
      { key: "staff", href: "/staff", icon: Users },
      { key: "schedule", href: "/schedule", icon: CalendarDays },
      { key: "training", href: "/training", icon: GraduationCap },
    ],
  },
  {
    key: "business",
    items: [
      { key: "reports", href: "/reports", icon: BarChart3 },
      { key: "rolesPermission", href: "/roles", icon: ShieldCheck },
    ],
  },
  {
    key: "system",
    items: [
      { key: "settings", href: "/settings", icon: Settings },
      { key: "integration", href: "/integration", icon: LayoutGrid },
    ],
  },
] as const;

export function ErpSidebar({ activeHref, compact = false }: { activeHref?: string; compact?: boolean }) {
  const pathname = usePathname();
  const currentHref = activeHref || pathname;
  const dict = useDictionary();

  return (
    <aside className={cn("h-screen sticky top-0 border-r border-border bg-card flex flex-col", compact ? "w-16" : "w-full")}>
      <div className={cn("flex h-14 items-center border-b border-border/50 shrink-0", compact ? "justify-center px-2" : "gap-3 px-6")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">ME</div>
        {!compact ? (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground leading-tight">ME Branch</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Enterprise ERP</span>
          </div>
        ) : null}
      </div>

      <ScrollArea className={cn("flex-1", compact ? "py-4" : "py-6")}>
        <nav className={cn("flex flex-col", compact ? "gap-4 px-2" : "gap-6 px-3")}>
          {navigationGroups.map((group) => {
            const groupName = dict.sidebar[group.key as keyof typeof dict.sidebar];

            return (
              <div key={group.key} className={compact ? "" : "px-1"}>
                {!compact ? (
                  <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">{groupName}</div>
                ) : (
                  <div className="mb-1 flex justify-center">
                    <span className="h-px w-6 bg-border/70" />
                  </div>
                )}

                <div className={cn(compact ? "space-y-1" : "space-y-0.5")}>
                  {group.items.map((item) => {
                    const active = currentHref === item.href || (item.href !== "/" && currentHref.startsWith(item.href));
                    const Icon = item.icon;
                    const label = dict.sidebar[item.key as keyof typeof dict.sidebar];

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={label}
                        className={cn(
                          "relative flex h-9 items-center rounded-md transition-all group",
                          compact ? "justify-center px-0" : "gap-3 px-3 text-sm",
                          active ? "bg-primary/5 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        {active ? <span className={cn("absolute bg-primary", compact ? "left-0 top-2 bottom-2 w-0.5 rounded-r-full" : "left-0 top-2 bottom-2 w-0.5 rounded-r-full")} /> : null}
                        <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                        {!compact ? label : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
