"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Columns3, Download, Filter, Search, Rows4, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getControlByKey } from "@/lib/control-registry";

type DensityMode = "compact" | "standard" | "comfortable";

interface AdvancedFilterSection {
  title: string;
  items: string[];
}

export function TableActionBar({
  searchPlaceholder,
  filters,
  selectedCount = 0,
  className,
  bulkActionLabel,
  bulkActionKey,
  columns = [],
  density = "standard",
  onDensityChange,
  sortOptions = [],
  advancedFilters = [],
  onClearSelection,
}: {
  searchPlaceholder: string;
  filters?: ReactNode;
  selectedCount?: number;
  className?: string;
  bulkActionLabel?: string;
  bulkActionKey?: string;
  columns?: string[];
  density?: DensityMode;
  onDensityChange?: (mode: DensityMode) => void;
  sortOptions?: string[];
  advancedFilters?: AdvancedFilterSection[];
  onClearSelection?: () => void;
}) {
  const hasSelection = selectedCount > 0;
  const [openPanel, setOpenPanel] = useState<"columns" | "density" | "sort" | "export" | "more" | "bulk" | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns));
  const [sortPreview, setSortPreview] = useState(sortOptions[0] ?? "No sort selected");
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);

  const previewMeta = useMemo(() => {
    if (!previewKey) return null;
    return getControlByKey(previewKey);
  }, [previewKey]);

  const openPreview = (title: string, key: string) => {
    setPreviewTitle(title);
    setPreviewKey(key);
    setOpenPanel("bulk");
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(column)) {
        next.delete(column);
      } else {
        next.add(column);
      }
      return next;
    });
  };

  return (
    <div className={cn("relative rounded-lg border border-border/70 bg-card/70 p-2", className)}>
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <div className="relative w-full xl:max-w-[260px]">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="h-8 pl-8 text-xs" placeholder={searchPlaceholder} />
        </div>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1.5 pr-1 [&>*]:shrink-0 [&>*]:whitespace-nowrap">{filters}</div>
        </div>

        <div className="flex items-center gap-1 xl:justify-end">
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => setOpenPanel((prev) => (prev === "columns" ? null : "columns"))}>
            <Columns3 className="mr-1 h-3.5 w-3.5" />
            Columns
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => setOpenPanel((prev) => (prev === "density" ? null : "density"))}>
            <Rows4 className="mr-1 h-3.5 w-3.5" />
            Density
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => setOpenPanel((prev) => (prev === "sort" ? null : "sort"))}>
            <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
            Sort
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => setOpenPanel((prev) => (prev === "export" ? null : "export"))}>
            <Download className="mr-1 h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => setOpenPanel((prev) => (prev === "more" ? null : "more"))}>
            <Filter className="mr-1 h-3.5 w-3.5" />
            More
          </Button>
        </div>
      </div>

      <div className={cn("mt-2 rounded-md border px-2.5 py-1.5", hasSelection ? "border-primary/25 bg-primary/5" : "border-border/50 bg-muted/20")}>
        <div className="flex flex-wrap items-center gap-1.5">
          <p className={cn("text-xs font-medium", hasSelection ? "text-primary" : "text-muted-foreground")}>{hasSelection ? `Selected ${selectedCount}` : "Selected 0"}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px]"
            disabled={!hasSelection}
            onClick={() => openPreview("Export selected preview", "table.export")}
          >
            Export selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px]"
            disabled={!hasSelection}
            onClick={() => openPreview("Add note preview", "supplier.add_note_preview")}
          >
            Add note
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px]"
            disabled={!hasSelection}
            onClick={() => openPreview(`${bulkActionLabel ?? "Review / Link / View"} preview`, bulkActionKey ?? "table.export")}
          >
            {bulkActionLabel ?? "Review / Link / View"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px]"
            disabled={!hasSelection}
            onClick={() => {
              onClearSelection?.();
              setOpenPanel(null);
            }}
          >
            <X className="mr-1 h-3 w-3" />
            Clear selection
          </Button>
        </div>
      </div>

      {openPanel ? (
        <div className="mt-2 rounded-md border border-border/60 bg-card/95 p-2 text-xs">
          {openPanel === "columns" ? (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground">Visible Columns</p>
              {columns.length ? columns.map((column) => (
                <button key={column} type="button" className="flex w-full items-center justify-between rounded px-1.5 py-1 text-left hover:bg-muted/35" onClick={() => toggleColumn(column)}>
                  <span>{column}</span>
                  <span className={cn("text-[11px]", visibleColumns.has(column) ? "text-primary" : "text-muted-foreground")}>
                    {visibleColumns.has(column) ? "Visible" : "Hidden"}
                  </span>
                </button>
              )) : <p className="text-muted-foreground">No columns configured.</p>}
            </div>
          ) : null}

          {openPanel === "density" ? (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground">Density</p>
              <div className="flex gap-1.5">
                {(["compact", "standard", "comfortable"] as DensityMode[]).map((mode) => (
                  <Button key={mode} variant={density === mode ? "default" : "outline"} size="sm" className="h-7 px-2 text-[11px]" onClick={() => onDensityChange?.(mode)}>
                    {mode[0].toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {openPanel === "sort" ? (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground">Sort Preview</p>
              {sortOptions.map((option) => (
                <button key={option} type="button" className="block w-full rounded px-1.5 py-1 text-left hover:bg-muted/35" onClick={() => setSortPreview(option)}>
                  {option}
                </button>
              ))}
              <p className="text-muted-foreground">Selected: {sortPreview}</p>
            </div>
          ) : null}

          {openPanel === "export" ? (
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Export preview only</p>
              <p className="text-muted-foreground">{`Selected records: ${selectedCount}`}</p>
              <p className="text-muted-foreground">Formats: CSV / XLSX / PDF</p>
              <p className="text-muted-foreground">No write executed</p>
            </div>
          ) : null}

          {openPanel === "more" ? (
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Advanced Filters</p>
              {advancedFilters.map((section) => (
                <div key={section.title}>
                  <p className="text-[11px] font-medium text-muted-foreground">{section.title}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {section.items.map((item) => (
                      <span key={item} className="rounded border border-border/60 px-1.5 py-0.5 text-[11px]">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {openPanel === "bulk" ? (
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{previewTitle}</p>
              <p className="text-muted-foreground">{previewMeta?.layer ?? "PREVIEW_ACTION"}</p>
              <p className="text-muted-foreground">{previewMeta?.executionBoundary ?? "no_write_execution"}</p>
              <p className="text-muted-foreground">No write executed</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
