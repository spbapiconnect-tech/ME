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

export function Sidebar() {
  const pathname = usePathname();
  const dict = useDictionary();

  const navigation = [
    {
      group: dict.sidebar.dashboard,
      items: [{ name: dict.sidebar.dashboard, href: "/", icon: LayoutDashboard }],
    },
    {
      group: dict.sidebar.storeOperations,
      items: [
        { name: "Branches", href: "/branches", icon: Store },
        { name: "Inspection", href: "/inspection", icon: ClipboardList },
        { name: "Issue Center", href: "/issues", icon: AlertCircle },
        { name: "Tasks", href: "/tasks", icon: ListTodo },
        { name: "Expiry Control", href: "/expiry", icon: ClipboardCheck },
        { name: "SOP Library", href: "/sop", icon: BookOpen },
      ],
    },
    {
      group: dict.sidebar.psi,
      items: [
        { name: dict.sidebar.psiOverview, href: "/psi", icon: BarChart3 },
        { name: dict.sidebar.procurement, href: "/psi/procurement", icon: Truck },
        { name: dict.sidebar.supplier, href: "/psi/supplier", icon: Users },
        { name: dict.sidebar.inventory, href: "/psi/inventory", icon: Warehouse },
        { name: dict.sidebar.receiving, href: "/psi/receiving", icon: History },
      ],
    },
    {
      group: dict.sidebar.workforce,
      items: [
        { name: "Staff", href: "/staff", icon: Users },
        { name: "Schedule", href: "/schedule", icon: CalendarDays },
        { name: "Training", href: "/training", icon: GraduationCap },
        { name: "Roles", href: "/roles", icon: ShieldCheck },
      ],
    },
    {
      group: dict.sidebar.business,
      items: [
        { name: "Reports", href: "/reports", icon: BarChart3 },
        { name: "POS Report", href: "/reports/pos", icon: CalendarRange },
        { name: "Finance", href: "/finance", icon: Receipt },
        { name: "Packages", href: "/packages", icon: Package },
        { name: "Stakeholder Summary", href: "/stakeholder-summary", icon: Building2 },
      ],
    },
    {
      group: dict.sidebar.system,
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Access Control", href: "/access-control", icon: ShieldCheck },
        { name: "Rules", href: "/rules", icon: SlidersHorizontal },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Integrations", href: "/integration", icon: LayoutGrid },
        { name: "Workflow", href: "/workflow", icon: Workflow },
        { name: "Templates", href: "/templates", icon: FileText },
        { name: "Audit Trail", href: "/audit-trail", icon: ScrollText },
      ],
    },
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
