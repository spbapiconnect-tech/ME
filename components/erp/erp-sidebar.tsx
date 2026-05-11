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
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  Package,
  Receipt,
  ScrollText,
  SlidersHorizontal,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  Users,
  Warehouse,
  Workflow,
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
      { key: "issues", label: "Issue Center", href: "/issues", icon: AlertCircle },
      { key: "tasks", label: "Tasks", href: "/tasks", icon: ListTodo },
      { key: "expiry", label: "Expiry Control", href: "/expiry", icon: ClipboardCheck },
      { key: "sop", label: "SOP Library", href: "/sop", icon: BookOpen },
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
      { key: "roles", label: "Roles", href: "/roles", icon: ShieldCheck },
    ],
  },
  {
    key: "business",
    label: "Business",
    items: [
      { key: "reports", label: "Reports", href: "/reports", icon: BarChart3 },
      { key: "pos-report", label: "POS Report", href: "/reports/pos", icon: CalendarRange },
      { key: "finance", label: "Finance", href: "/finance", icon: Receipt },
      { key: "packages", label: "Packages", href: "/packages", icon: Package },
      { key: "stakeholder", label: "Stakeholder Summary", href: "/stakeholder-summary", icon: Building2 },
    ],
  },
  {
    key: "system",
    label: "System",
    items: [
      { key: "settings", label: "Settings", href: "/settings", icon: Settings },
      { key: "access-control", label: "Access Control", href: "/access-control", icon: ShieldCheck },
      { key: "rules", label: "Rules", href: "/rules", icon: SlidersHorizontal },
      { key: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
      { key: "integration", label: "Integrations", href: "/integration", icon: LayoutGrid },
      { key: "workflow", label: "Workflow", href: "/workflow", icon: Workflow },
      { key: "templates", label: "Templates", href: "/templates", icon: FileText },
      { key: "audit-trail", label: "Audit Trail", href: "/audit-trail", icon: ScrollText },
    ],
  },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  // Module overview routes should not stay active when a child module route is open.
  // Example: /psi should not be active for /psi/procurement.
  const overviewOnlyRoutes = new Set(["/psi"]);
  if (overviewOnlyRoutes.has(href)) return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ErpSidebar({
  activeHref,
  collapsed = false,
  onToggleCollapsed,
}: {
  activeHref?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
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

  if (collapsed) {
    return (
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200">
        <div className="flex h-14 items-center justify-center border-b border-border/50">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 border-primary/60 text-primary"
            onClick={onToggleCollapsed}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-3">
          <nav className="flex flex-col items-center gap-1 px-2">
            {sidebarGroups.map((group) => (
              <div key={group.key} className="flex w-full flex-col items-center gap-1 border-b border-border/40 py-1.5 last:border-b-0">
                {group.items.map((item) => {
                  const active = isItemActive(currentHref, item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      title={item.label}
                      aria-label={item.label}
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                        active
                          ? "bg-primary/12 text-primary shadow-sm ring-1 ring-primary/30"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      )}
                    >
                      {active ? <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary" /> : null}
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    );
  }

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200">
      <div className="flex h-14 items-center gap-3 border-b border-border/50 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">ME</div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-bold leading-tight tracking-tight text-foreground">ME Branch</span>
          <span className="truncate text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Enterprise ERP</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onToggleCollapsed}
          aria-label="Collapse sidebar to icon bar"
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
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
                  <span className="truncate">{group.label}</span>
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
                            active ? "bg-primary/8 font-medium text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                          )}
                        >
                          {active ? <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary" /> : null}
                          <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
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
