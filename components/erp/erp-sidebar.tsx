"use client";

import Link from "next/link";
import { erpNavigation } from "@/lib/erp/erp-module-schema";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/lib/i18n";
import { ScrollArea } from "@/components/ui/scroll-area";

const groupKeys = ["dashboard", "storeOperations", "psi", "workforce", "business", "system"] as const;

export function ErpSidebar({ activeHref }: { activeHref?: string }) {
  const pathname = usePathname();
  const currentHref = activeHref || pathname;
  const dict = useDictionary();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-[240px] border-r border-border bg-card flex flex-col">
      <div className="flex h-14 items-center gap-3 px-6 border-b border-border/50 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
          ME
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground leading-tight">ME Branch</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Enterprise ERP</span>
        </div>
      </div>

      <ScrollArea className="flex-1 py-6">
        <nav className="flex flex-col gap-6 px-3">
          {groupKeys.map((groupKey) => {
            const groupName = dict.sidebar[groupKey as keyof typeof dict.sidebar];
            // Map group names back to erpNavigation groups which might be English
            // This is a bit tricky, I'll assume erpNavigation groups are stable
            const navGroup = groupKey === "dashboard" ? "Dashboard" : 
                            groupKey === "storeOperations" ? "Store Operations" :
                            groupKey === "psi" ? "PSI" :
                            groupKey === "workforce" ? "Workforce" :
                            groupKey === "business" ? "Business" : "System";
            
            const items = erpNavigation.filter((item) => item.group === navGroup);
            if (!items.length) return null;

            return (
              <div key={groupKey} className="px-1">
                <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
                  {groupName}
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active = currentHref === item.href || (item.href !== "/" && currentHref.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "relative flex h-9 items-center rounded-md px-3 text-sm transition-all group",
                          active 
                            ? "bg-primary/5 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary" />
                        )}
                        {item.label}
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
