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
  LayoutGrid
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDictionary } from "@/lib/i18n";

export function Sidebar() {
  const pathname = usePathname();
  const dict = useDictionary();

  const navigation = [
    {
      group: dict.sidebar.dashboard,
      items: [
        { name: dict.sidebar.dashboard, href: "/", icon: LayoutDashboard },
      ]
    },
    {
      group: dict.sidebar.storeOperations,
      items: [
        { name: dict.sidebar.branches, href: "/branches", icon: Store },
        { name: dict.sidebar.inspection, href: "/inspection", icon: ClipboardList },
        { name: dict.sidebar.issues, href: "/issues", icon: AlertCircle },
        { name: dict.sidebar.tasks, href: "/tasks", icon: ListTodo },
      ]
    },
    {
      group: dict.sidebar.psi,
      items: [
        { name: dict.sidebar.psiOverview, href: "/psi", icon: BarChart3 },
        { name: dict.sidebar.procurement, href: "/psi/procurement", icon: Truck },
        { name: dict.sidebar.supplier, href: "/psi/supplier", icon: Users },
        { name: dict.sidebar.inventory, href: "/psi/inventory", icon: Warehouse },
        { name: dict.sidebar.receiving, href: "/psi/receiving", icon: History },
      ]
    },
    {
      group: dict.sidebar.workforce,
      items: [
        { name: dict.sidebar.staff, href: "/staff", icon: Users },
        { name: dict.sidebar.schedule, href: "/schedule", icon: CalendarDays },
        { name: dict.sidebar.training, href: "/training", icon: GraduationCap },
      ]
    },
    {
      group: dict.sidebar.business,
      items: [
        { name: dict.sidebar.reports, href: "/reports", icon: BarChart3 },
        { name: dict.sidebar.rolesPermission, href: "/roles", icon: ShieldCheck },
      ]
    },
    {
      group: dict.sidebar.system,
      items: [
        { name: dict.sidebar.settings, href: "/settings", icon: Settings },
        { name: dict.sidebar.integration, href: "/integration", icon: LayoutGrid },
      ]
    }
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
            <h3 className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">
              {group.group}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all relative group",
                      isActive 
                        ? "bg-primary/5 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full" />
                    )}
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
