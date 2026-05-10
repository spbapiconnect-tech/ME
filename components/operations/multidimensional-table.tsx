"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface MultiDimColumn<T> {
  key: string;
  label: string;
  width: string;
  render: (row: T) => ReactNode;
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
}) {
  const allIds = rows.map((row) => String(row[rowIdKey]));
  const allChecked = allIds.length > 0 && allIds.every((id) => selectedRowIds.has(id));
  const gridTemplateColumns = `42px ${columns.map((column) => column.width).join(" ")}`;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/70 bg-card/70", className)}>
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <div
            className="sticky top-0 z-10 grid items-center border-b border-border/80 bg-muted/80 px-3 py-2 backdrop-blur"
            style={{ gridTemplateColumns }}
          >
            <div className="flex justify-center">
              <Checkbox
                checked={allChecked}
                onCheckedChange={(checked) => onToggleAll(Boolean(checked), allIds)}
                aria-label="Select all rows"
              />
            </div>
            {columns.map((column) => (
              <p key={column.key} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {column.label}
              </p>
            ))}
          </div>
          <div className="max-h-[620px] overflow-y-auto">
            {rows.map((row) => {
              const id = String(row[rowIdKey]);
              const selected = selectedRowIds.has(id);
              const focused = selectedRecordId === id;
              return (
                <div
                  key={id}
                  className={cn(
                    "grid items-center border-b border-border/70 px-3 py-2 transition-colors",
                    focused ? "bg-primary/10" : "hover:bg-muted/30"
                  )}
                  style={{ gridTemplateColumns }}
                >
                  <div className="flex justify-center">
                    <Checkbox checked={selected} onCheckedChange={() => onToggleRow(id)} aria-label={`Select ${id}`} />
                  </div>
                  {columns.map((column) => (
                    <button
                      key={column.key}
                      type="button"
                      className="truncate text-left"
                      onClick={() => onRowFocus?.(id)}
                    >
                      {column.render(row)}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
