"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ListToolbar({
  searchPlaceholder,
  filters,
  actions,
  className,
}: {
  searchPlaceholder: string;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/70 p-2", className)}>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="h-9 pl-8" placeholder={searchPlaceholder} />
        </div>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">{filters}</div>
        <div className="flex items-center gap-2">
          {actions}
          <Button variant="outline" size="sm" className="h-9">
            More Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
