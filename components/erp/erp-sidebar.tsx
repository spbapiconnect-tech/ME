"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  History,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

type SidebarItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type SidebarGroup = {
  key: string;
  label: string;
  items: SidebarItem[];
};

const sidebarGroups: SidebarGroup[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    items: [{ key: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    key: "store-operations",
    label: "Store Operations",
    items: [
      { key: "branches", label: "Branches", href: "/branches", icon: Store },
      { key: "inspection", label: "Inspection", href: "/inspection", icon: ClipboardList },
      { key: "issues", label: "Issues", href: "/issues", icon: AlertCircle },
      { key: "tasks", label: "Tasks", href: "/tasks", icon: ListTodo },
    ],
  },
  {
    key: "psi",
    label: "PSI",
    items: [
      { key: "psi-overview", label: "PSI Overview", href: "/psi", icon: BarChart3 },
      { key: "procurement", label: "Procurement", href: "/psi/procurement", icon: Truck },
      { key: "supplier", label: "Supplier", href: "/psi/supplier", icon: Users },
      { key: "inventory", label: "Inventory", href: "/psi/inventory", icon: Warehouse },
      { key: "receiving", label: "Receiving", href: "/psi/receiving", icon: History },
    ],
  },
  {
    key: "workforce",
    label: "Workforce",
    items: [
      { key: "staff", label: "Staff", href: "/staff", icon: Users },
      { key: "schedule", label: "Schedule", href: "/schedule", icon: CalendarDays },
      { key: "training", label: "Training", href: "/training", icon: ClipboardList },
    ],
  },
  {
    key: "business",
    label: "Business",
    items: [
      { key: "reports", label: "Reports", href: "/reports", icon: BarChart3 },
      { key: "roles", label: "Roles & Permission", href: "/roles", icon: ShieldCheck },
    ],
  },
  {
    key: "system",
    label: "System",
    items: [
      { key: "settings", label: "Settings", href: "/settings", icon: Settings },
      { key: "modules", label: "All Modules", href: "/modules", icon: LayoutGrid },
    ],
  },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ErpSidebar({ activeHref }: { activeHref?: string }) {
  const pathname = usePathname();
  const currentHref = activeHref || pathname;

  const activeGroups = useMemo(
    () =>
      new Set(
        sidebarGroups
          .filter((group) => group.items.some((item) => isItemActive(currentHref, item.href)))
          .map((group) => group.key)
      ),
    [currentHref]
  );

  const [manualOpenGroups, setManualOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setManualOpenGroups((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? activeGroups.has(key)),
    }));
  };

  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-3 border-b border-border/50 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">ME</div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground leading-tight">ME Branch</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Enterprise ERP</span>
        </div>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-2 px-3">
          {sidebarGroups.map((group) => {
            const isOpen = manualOpenGroups[group.key] ?? (activeGroups.has(group.key) || group.key === "dashboard");
            const hasActiveChild = activeGroups.has(group.key);

            return (
              <section key={group.key} className="rounded-md border border-transparent bg-transparent">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => toggleGroup(group.key)}
                  className={cn(
                    "h-8 w-full justify-between px-2 text-[11px] uppercase tracking-[0.12em]",
                    hasActiveChild ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span>{group.label}</span>
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </Button>

                {isOpen ? (
                  <div className="mt-1 space-y-0.5">
                    {group.items.map((item) => {
                      const active = isItemActive(currentHref, item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={cn(
                            "relative flex h-9 items-center gap-2.5 rounded-md px-2 text-sm transition-all",
                            active ? "bg-primary/8 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                          )}
                        >
                          {active ? <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary" /> : null}
                          <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
