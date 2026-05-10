"use client";

import type { ReactNode } from "react";
import { Columns3, Download, Filter, Search, Rows4, ArrowUpDown } from "lucide-react";
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
  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/70 p-2", className)}>
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <div className="relative w-full xl:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="h-9 pl-8 text-sm" placeholder={searchPlaceholder} />
        </div>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-0.5">{filters}</div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-8">
            <Columns3 className="mr-1.5 h-3.5 w-3.5" />
            Columns
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Rows4 className="mr-1.5 h-3.5 w-3.5" />
            Density
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            Sort
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            More
          </Button>
        </div>
      </div>
      {selectedCount > 0 ? (
        <div className="mt-2 flex items-center justify-between rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1.5">
          <p className="text-xs text-primary">{selectedCount} rows selected</p>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            {bulkActionLabel ?? "Bulk Action (Preview)"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
