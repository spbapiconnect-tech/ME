"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ErpDetailPanel({
  title,
  subtitle,
  status,
  badge,
  actions,
  tabs,
  activeTab,
  onTabChange,
  children,
}: {
  title: string;
  subtitle?: string;
  status?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-foreground sm:text-lg">{title}</h2>
            {badge}
            {!badge && status ? (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                {status}
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {tabs?.length ? (
        <div
          className="flex max-w-full items-center overflow-x-auto border-b border-border bg-card/30 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          data-me-mobile-tabs="true"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange?.(tab)}
                className={cn(
                  "shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-xs font-medium text-muted-foreground outline-none ring-0 transition-colors hover:text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 sm:px-4 sm:text-sm",
                  active && "border-primary text-primary"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="min-h-[200px] p-4">{children}</div>
    </Card>
  );
}
