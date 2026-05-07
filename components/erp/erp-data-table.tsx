"use client";

import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ErpEmptyState } from "./erp-empty-state";
import { ErpErrorState } from "./erp-error-state";
import { ErpLoadingState } from "./erp-loading-state";
import { ErpStatusBadge } from "./erp-status-badge";
import { cn } from "@/lib/utils";

export type ErpColumnType =
  | "id"
  | "code"
  | "name"
  | "text"
  | "amount"
  | "number"
  | "percent"
  | "score"
  | "status"
  | "priority"
  | "date"
  | "time"
  | "action"
  | "badge";

export type ErpDataTableColumn<T> = {
  key: keyof T | string;
  label: string;
  type?: ErpColumnType;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  visible?: boolean;
  render?: (row: T) => ReactNode;
};

export type ErpDataTableProps<T> = {
  columns: ErpDataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  selectedId?: string;
  onRowSelect?: (row: T) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onOpenDetail?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;
  className?: string;
};

function alignmentFor(type?: ErpColumnType, align?: "left" | "center" | "right") {
  if (align) return align;

  switch (type) {
    case "amount":
    case "number":
    case "percent":
    case "score":
    case "date":
    case "time":
      return "right";
    case "status":
    case "priority":
    case "badge":
      return "center";
    case "action":
      return "right";
    default:
      return "left";
  }
}

function cellClass(type?: ErpColumnType) {
  switch (type) {
    case "amount":
    case "number":
    case "percent":
    case "score":
      return "font-medium tabular-nums text-foreground";
    case "date":
    case "time":
      return "tabular-nums text-muted-foreground";
    case "id":
    case "code":
      return "font-medium text-primary hover:underline cursor-pointer";
    case "name":
      return "font-medium text-foreground";
    default:
      return "text-muted-foreground";
  }
}

export function ErpDataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  selectedId,
  onRowSelect,
  loading,
  error,
  emptyMessage = "No records found.",
  onOpenDetail,
  rowActions,
  className = "",
}: ErpDataTableProps<T>) {
  const visibleColumns = columns.filter((column) => column.visible !== false);

  if (loading) return <ErpLoadingState />;
  if (error) return <ErpErrorState message={error} />;
  if (!data.length) return <ErpEmptyState description={emptyMessage} />;

  return (
    <div className={cn("overflow-hidden rounded-md border bg-card shadow-sm", className)}>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="h-10 hover:bg-transparent border-b">
              {visibleColumns.map((column) => {
                const align = alignmentFor(column.type, column.align);

                return (
                  <TableHead
                    key={String(column.key)}
                    style={column.width ? { width: column.width } : undefined}
                    className={cn(
                      "h-10 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/80",
                      align === "right" && "text-right",
                      align === "center" && "text-center",
                      align === "left" && "text-left"
                    )}
                  >
                    {column.label}
                  </TableHead>
                );
              })}

              {rowActions || onOpenDetail ? (
                <TableHead className="h-10 px-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Action
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => {
              const rowId = getRowId(row);
              const selected = rowId === selectedId;

              return (
                <TableRow
                  key={rowId}
                  data-state={selected ? "selected" : undefined}
                  onClick={() => onRowSelect?.(row)}
                  className={cn(
                    "group transition-colors border-b last:border-0",
                    onRowSelect && "cursor-pointer",
                    selected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                  )}
                >
                  {visibleColumns.map((column) => {
                    const type = column.type ?? "text";
                    const align = alignmentFor(type, column.align);
                    const value = column.render ? column.render(row) : row[column.key as keyof T];

                    return (
                      <TableCell
                        key={String(column.key)}
                        className={cn(
                          "py-2.5 px-3 text-sm transition-colors",
                          align === "right" && "text-right",
                          align === "center" && "text-center",
                          align === "left" && "text-left",
                          cellClass(type)
                        )}
                      >
                        {type === "status" || type === "priority" || type === "badge" ? (
                          <ErpStatusBadge status={String(value ?? "")} />
                        ) : (
                          (value as ReactNode)
                        )}
                      </TableCell>
                    );
                  })}

                  {rowActions || onOpenDetail ? (
                    <TableCell className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rowActions ? rowActions(row) : null}
                        {onOpenDetail ? (
                          <Button
                            type="button"
                            variant="ghost"
                            
                            onClick={(event) => {
                              event.stopPropagation();
                              onOpenDetail(row);
                            }}
                            className="h-8 px-2 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
                          >
                            Open
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
