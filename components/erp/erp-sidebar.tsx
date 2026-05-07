"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { erpNavigationGroups } from "@/lib/erp/erp-module-schema";
import { resolveErpLabel, type ErpLocale } from "@/lib/erp/erp-i18n";
import { cn } from "@/lib/utils";

export function ErpSidebar({
  activeHref = "/",
  locale = "en",
  className,
}: {
  activeHref?: string;
  locale?: ErpLocale;
  className?: string;
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  return (
    <aside className={cn("w-[14rem] shrink-0 rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      <div className="border-b px-4 py-4">
        <p className="text-sm font-semibold">ME Branch ERP</p>
        <p className="mt-1 text-xs text-muted-foreground">Restaurant Operations</p>
      </div>
      <nav className="flex max-h-[calc(100vh-9rem)] flex-col gap-2 overflow-y-auto px-3 py-3">
        {erpNavigationGroups.map((group) => {
          const isCollapsed = collapsedGroups.includes(group.key);
          const hasActiveChild = group.items.some((item) => item.href === activeHref || (item.href !== "/" && activeHref.startsWith(`${item.href}/`)));

          return (
            <div key={group.key} className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 justify-between px-2 text-xs font-semibold uppercase text-muted-foreground"
                onClick={() =>
                  setCollapsedGroups((current) =>
                    current.includes(group.key) ? current.filter((key) => key !== group.key) : [...current, group.key],
                  )
                }
              >
                <span>{group.label[locale]}</span>
                <ChevronDownIcon className={cn("size-4 transition-transform", isCollapsed && "-rotate-90")} />
              </Button>
              {!isCollapsed ? (
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const active = item.href === activeHref || (item.href !== "/" && activeHref.startsWith(`${item.href}/`));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "relative rounded-md px-3 py-2 pl-5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                          active && "bg-primary/10 font-medium text-primary",
                          !active && hasActiveChild && "text-foreground",
                        )}
                      >
                        {active ? <span className="absolute left-0 top-1.5 h-6 w-0.5 rounded-full bg-primary" /> : null}
                        {resolveErpLabel(item.labelKey, locale)}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
