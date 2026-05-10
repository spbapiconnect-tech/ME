"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TableViewTab {
  key: string;
  label: string;
  count?: number;
}

export function TableViewTabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TableViewTab[];
  value: string;
  onChange: (tabKey: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto rounded-lg border border-border/70 bg-card/70 p-1", className)}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Button
            key={tab.key}
            variant={active ? "secondary" : "ghost"}
            size="sm"
            className={cn("h-8 rounded-md px-2.5 text-xs", active && "bg-primary/10 text-primary")}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
            {typeof tab.count === "number" ? <span className="ml-1.5 text-[10px] opacity-70">{tab.count}</span> : null}
          </Button>
        );
      })}
    </div>
  );
}
