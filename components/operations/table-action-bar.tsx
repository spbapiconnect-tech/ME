"use client";

import type { ReactNode } from "react";
import { Columns3, Download, Filter, Search, Rows4, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TableActionBar({
  searchPlaceholder,
  filters,
  selectedCount = 0,
  className,
  bulkActionLabel,
}: {
  searchPlaceholder: string;
  filters?: ReactNode;
  selectedCount?: number;
  className?: string;
  bulkActionLabel?: string;
}) {
  const hasSelection = selectedCount > 0;

  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/70 p-2", className)}>
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <div className="relative w-full xl:max-w-[260px]">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="h-8 pl-8 text-xs" placeholder={searchPlaceholder} />
        </div>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1.5 pr-1 [&>*]:shrink-0 [&>*]:whitespace-nowrap">{filters}</div>
        </div>

        <div className="flex items-center gap-1 xl:justify-end">
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
            <Columns3 className="mr-1 h-3.5 w-3.5" />
            Columns
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
            <Rows4 className="mr-1 h-3.5 w-3.5" />
            Density
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
            <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
            Sort
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
            <Download className="mr-1 h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
            <Filter className="mr-1 h-3.5 w-3.5" />
            More
          </Button>
        </div>
      </div>

      <div className={cn("mt-2 rounded-md border px-2.5 py-1.5", hasSelection ? "border-primary/25 bg-primary/5" : "border-border/50 bg-muted/20")}>
        <div className="flex flex-wrap items-center gap-1.5">
          <p className={cn("text-xs font-medium", hasSelection ? "text-primary" : "text-muted-foreground")}>{hasSelection ? `Selected ${selectedCount}` : "Selected 0"}</p>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" disabled={!hasSelection}>Export selected</Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" disabled={!hasSelection}>Add note</Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" disabled={!hasSelection}>{bulkActionLabel ?? "Review / Link / View"}</Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" disabled={!hasSelection}>
            <X className="mr-1 h-3 w-3" />
            Clear selection
          </Button>
        </div>
      </div>
    </div>
  );
}
