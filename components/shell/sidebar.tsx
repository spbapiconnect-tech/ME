"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  Users,
  BarChart3,
  Settings,
  ClipboardList,
  AlertCircle,
  ListTodo,
  Truck,
  Warehouse,
  History,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  LayoutGrid,
  ClipboardCheck,
  BookOpen,
  CalendarRange,
  Receipt,
  Package,
  Building2,
  SlidersHorizontal,
  Bell,
  Workflow,
  FileText,
  ScrollText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDictionary } from "@/lib/i18n";
import { getModulesByGroup } from "@/lib/me/module-registry";

export function Sidebar() {
  const pathname = usePathname();
  const dict = useDictionary();

  const iconMap = {
    LayoutDashboard,
    Store,
    ClipboardList,
    AlertCircle,
    ListTodo,
    ClipboardCheck,
    BookOpen,
    BarChart3,
    Truck,
    Users,
    Warehouse,
    History,
    CalendarDays,
    GraduationCap,
    ShieldCheck,
    CalendarRange,
    Receipt,
    Package,
    Building2,
    Settings,
    SlidersHorizontal,
    Bell,
    LayoutGrid,
    Workflow,
    FileText,
    ScrollText,
  } as const;

  const makeGroup = (label: string, key: Parameters<typeof getModulesByGroup>[0]) => ({
    group: label,
    items: getModulesByGroup(key)
      .filter((item) => item.route !== "/")
      .map((item) => ({
        name: item.name,
        href: item.route,
        icon: iconMap[item.iconKey as keyof typeof iconMap] ?? LayoutDashboard,
      })),
  });

  const navigation = [
    { group: dict.sidebar.dashboard, items: [{ name: dict.sidebar.dashboard, href: "/", icon: LayoutDashboard }] },
    makeGroup(dict.sidebar.storeOperations, "Store Operations"),
    makeGroup(dict.sidebar.psi, "PSI"),
    makeGroup(dict.sidebar.workforce, "Workforce"),
    makeGroup(dict.sidebar.business, "Business"),
    makeGroup(dict.sidebar.system, "System"),
  ];

  return (
    <div className="sidebar-fixed">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
          ME
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-tight">ME Branch</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Enterprise ERP</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        {navigation.map((group) => (
          <div key={group.group} className="mb-6 last:mb-0">
            <h3 className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">{group.group}</h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all relative group",
                      isActive ? "bg-primary/5 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )}
                  >
                    {isActive ? <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full" /> : null}
                    <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
