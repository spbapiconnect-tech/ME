"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MultiDimColumn<T> {
  key: string;
  label: string;
  width: string;
  render: (row: T) => ReactNode;
}

function toPixelWidth(width: string): number {
  const n = Number.parseInt(width, 10);
  return Number.isFinite(n) ? n : 120;
}

export function MultidimensionalTable<T extends object>({
  columns,
  rows,
  rowIdKey,
  selectedRowIds,
  onToggleRow,
  onToggleAll,
  selectedRecordId,
  onRowFocus,
  className,
  minWidth,
  pageLabel,
  totalCount,
  rowsPerPageLabel,
  showPagination = true,
  density = "standard",
  pinnedColumnCount = 2,
  stickySelectionColumn = true,
}: {
  columns: MultiDimColumn<T>[];
  rows: T[];
  rowIdKey: keyof T;
  selectedRowIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (checked: boolean, ids: string[]) => void;
  selectedRecordId?: string;
  onRowFocus?: (id: string) => void;
  className?: string;
  minWidth?: string;
  pageLabel?: string;
  totalCount?: number;
  rowsPerPageLabel?: string;
  showPagination?: boolean;
  density?: "compact" | "standard" | "comfortable";
  pinnedColumnCount?: number;
  stickySelectionColumn?: boolean;
}) {
  const allIds = rows.map((row) => String(row[rowIdKey]));
  const allChecked = allIds.length > 0 && allIds.every((id) => selectedRowIds.has(id));
  const selectedCount = selectedRowIds.size;
  const pageCount = Math.max(1, Math.ceil((totalCount ?? rows.length) / 50));
  const checkboxColumnWidth = 42;
  const columnPixelWidths = columns.map((column) => toPixelWidth(column.width));
  const computedTableWidth = checkboxColumnWidth + columnPixelWidths.reduce((sum, value) => sum + value, 0);
  const tableMinWidth = minWidth ?? `${computedTableWidth}px`;
  const gridTemplateColumns = `${checkboxColumnWidth}px ${columnPixelWidths.map((value) => `${value}px`).join(" ")}`;
  const rowPadding = density === "compact" ? "py-1" : density === "comfortable" ? "py-2.5" : "py-1.5";
  const headerPadding = density === "compact" ? "py-1.5" : "py-2";
  const lineHeight = density === "compact" ? "leading-[18px]" : "leading-5";
  const pinnedOffsets = columnPixelWidths.reduce<number[]>(
    (acc, width, index) => {
      if (index === 0) {
        acc.push(checkboxColumnWidth);
      } else {
        acc.push(acc[index - 1] + columnPixelWidths[index - 1]);
      }
      return acc;
    },
    []
  );

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/70 bg-card/75", className)}>
      <div className="overflow-x-auto">
        <div style={{ minWidth: tableMinWidth }}>
          <div className="sticky top-0 z-20 grid border-b border-border/80 bg-muted/90" style={{ gridTemplateColumns }}>
            <div
              className={cn(
                "flex items-center justify-center border-r border-border/70 bg-muted/95 px-2",
                stickySelectionColumn && "sticky left-0 z-30",
                headerPadding
              )}
            >
              <Checkbox checked={allChecked} onCheckedChange={(checked) => onToggleAll(Boolean(checked), allIds)} aria-label="Select all rows" />
            </div>
            {columns.map((column, index) => (
              <div
                key={column.key}
                className={cn(
                  "border-r border-border/60 px-2.5",
                  headerPadding,
                  index < pinnedColumnCount && "sticky z-30 bg-muted/95"
                )}
                style={index < pinnedColumnCount ? { left: `${pinnedOffsets[index]}px` } : undefined}
              >
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{column.label}</p>
              </div>
            ))}
          </div>

          <div className="min-h-[560px] max-h-[calc(100vh-280px)] overflow-y-auto">
            {rows.map((row) => {
              const id = String(row[rowIdKey]);
              const selected = selectedRowIds.has(id);
              const focused = selectedRecordId === id;
              return (
                <div
                  key={id}
                  className={cn(
                    "grid border-b border-border/55",
                    onRowFocus ? "cursor-pointer" : "",
                    focused ? "bg-primary/8" : "hover:bg-muted/25"
                  )}
                  style={{ gridTemplateColumns }}
                  onClick={() => onRowFocus?.(id)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center border-r border-border/55 px-2",
                      stickySelectionColumn && "sticky left-0 z-30",
                      rowPadding,
                      focused ? "bg-primary/10" : "bg-card/95"
                    )}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox checked={selected} onCheckedChange={() => onToggleRow(id)} aria-label={`Select ${id}`} />
                  </div>
                  {columns.map((column, index) => (
                    <div
                      key={column.key}
                      className={cn(
                        "border-r border-border/45 px-2.5",
                        rowPadding,
                        index < pinnedColumnCount && "sticky z-20",
                        index < pinnedColumnCount && (focused ? "bg-primary/6" : "bg-card/92")
                      )}
                      style={index < pinnedColumnCount ? { left: `${pinnedOffsets[index]}px` } : undefined}
                    >
                      <div className={cn("block w-full truncate text-left text-xs", lineHeight)}>
                        {column.render(row)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showPagination ? (
        <div className="flex flex-col gap-2 border-t border-border/70 bg-muted/20 px-3 py-2 text-xs xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <span>{pageLabel ?? `Showing 1-${Math.max(rows.length, 1)} of ${totalCount ?? rows.length}`}</span>
            <span>{`Selected ${selectedCount}`}</span>
            <span>{rowsPerPageLabel ?? "Rows per page 50 / 100 / 200"}</span>
            <span>{`Page 1 of ${pageCount}`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Prev</Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Next</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
