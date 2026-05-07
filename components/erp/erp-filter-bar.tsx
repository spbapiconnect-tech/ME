"use client";

import { ReactNode } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErpFilterBar({
  searchPlaceholder = "Search...",
  filters,
  actions,
  className,
}: {
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <div className="relative flex-1 max-w-[320px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="h-9 w-full bg-background pl-9"
        />
      </div>

      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {filters}
        <Button variant="outline"  className="h-9 gap-2">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </Button>
      </div>

      {actions && (
        <div className="flex items-center gap-2 sm:ml-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
