"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNavigationItemByKey } from "@/lib/navigation";
import type { MeNavigationItem } from "@/types/navigation";
import type { ComponentType } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  History,
  PackageSearch,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  UserCog,
  Users,
  UtensilsCrossed,
  Warehouse,
  Wrench,
} from "lucide-react";
import { ErpModuleVisualHeader } from "./erp-module-visual-header";

type ModuleCategory = {
  key: string;
  title: string;
  itemKeys: string[];
};

export const mobileModuleCategories: ModuleCategory[] = [
  { key: "store", title: "Store Operations", itemKeys: ["branches", "inspection", "issues", "tasks"] },
  { key: "workforce", title: "Staff & Workforce", itemKeys: ["staff", "schedule", "training", "roles"] },
  {
    key: "psi",
    title: "Procurement & Inventory",
    itemKeys: ["psi-workspace", "procurement", "supplier", "inventory", "receiving"],
  },
  { key: "food", title: "Food Operations", itemKeys: ["sop", "expiry"] },
  { key: "sales", title: "Sales & Reports", itemKeys: ["reports", "pos-reports"] },
  { key: "finance", title: "Finance", itemKeys: ["finance"] },
  { key: "settings", title: "Settings", itemKeys: ["settings", "integration", "workflow", "notifications"] },
];

const moduleIcons: Record<string, ComponentType<{ className?: string }>> = {
  dashboard: BarChart3,
  branches: Building2,
  inspection: ClipboardList,
  issues: Wrench,
  tasks: ClipboardList,
  staff: Users,
  schedule: CalendarDays,
  training: UserCog,
  roles: ShieldCheck,
  "psi-workspace": PackageSearch,
  procurement: Truck,
  supplier: Users,
  inventory: Warehouse,
  receiving: History,
  sop: UtensilsCrossed,
  expiry: Store,
  reports: BarChart3,
  "pos-reports": BarChart3,
  finance: CreditCard,
  settings: Settings,
  integration: Wrench,
  workflow: History,
  notifications: Wrench,
};

function resolveModules(): Array<{ title: string; items: MeNavigationItem[] }> {
  return mobileModuleCategories
    .map((category) => ({
      title: category.title,
      items: category.itemKeys
        .map((key) => getNavigationItemByKey(key))
        .filter((item): item is MeNavigationItem => Boolean(item)),
    }))
    .filter((category) => category.items.length > 0);
}

export function ErpMobileModuleLauncher({ onNavigate }: { onNavigate?: () => void }) {
  const categories = resolveModules();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border/70 p-4">
        <ErpModuleVisualHeader />
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4 pb-6">
        <div className="space-y-5 py-4">
          {categories.map((category) => (
            <section key={category.title} className="space-y-2.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{category.title}</h4>
              <div className="grid grid-cols-3 gap-2">
                {category.items.map((item) => {
                  const Icon = moduleIcons[item.key] ?? PackageSearch;
                  const isActive = item.status === "active";
                  const Tile = (
                    <div
                      className={[
                        "rounded-lg border p-2.5 text-left transition",
                        isActive
                          ? "border-border bg-card hover:border-primary/35 hover:bg-muted/35"
                          : "border-dashed border-border/80 bg-muted/35 opacity-85",
                      ].join(" ")}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-4 text-foreground">{item.label.en}</p>
                      {!isActive ? (
                        <Badge variant="outline" className="mt-1 h-5 px-1.5 text-[10px]">
                          {item.status === "coming-soon" ? "Soon" : "Preview"}
                        </Badge>
                      ) : null}
                    </div>
                  );

                  if (!isActive) {
                    return <div key={item.key}>{Tile}</div>;
                  }

                  return (
                    <Link key={item.key} href={item.href} onClick={onNavigate}>
                      {Tile}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
