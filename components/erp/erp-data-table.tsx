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

  if (
    type === "amount" ||
    type === "number" ||
    type === "percent" ||
    type === "score" ||
    type === "date" ||
    type === "time"
  ) {
    return "right";
  }

  if (type === "status" || type === "priority" || type === "badge" || type === "action") {
    return "center";
  }

  return "left";
}

function alignmentClass(align: "left" | "center" | "right") {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

function cellClass(type?: ErpColumnType) {
  if (type === "amount" || type === "number" || type === "percent" || type === "score") {
    return "font-medium tabular-nums text-foreground whitespace-nowrap";
  }

  if (type === "date" || type === "time") {
    return "tabular-nums text-muted-foreground whitespace-nowrap";
  }

  if (type === "id" || type === "code") {
    return "font-medium text-primary whitespace-nowrap";
  }

  if (type === "name") {
    return "font-medium text-foreground whitespace-nowrap";
  }

  if (type === "status" || type === "priority" || type === "badge") {
    return "whitespace-nowrap";
  }

  return "text-muted-foreground whitespace-nowrap";
}

function widthClass(type?: ErpColumnType) {
  if (type === "code" || type === "id") return "min-w-[92px]";
  if (type === "name") return "min-w-[170px]";
  if (type === "amount") return "min-w-[120px]";
  if (type === "status") return "min-w-[120px]";
  if (type === "number" || type === "badge") return "min-w-[86px]";
  if (type === "percent" || type === "score") return "min-w-[96px]";
  if (type === "date" || type === "time") return "min-w-[108px]";
  if (type === "action") return "min-w-[88px]";
  return "min-w-[110px]";
}

function CountBadge({ value }: { value: ReactNode }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border bg-muted px-1.5 text-xs font-medium text-muted-foreground">
      {value}
    </span>
  );
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
    <div className={`overflow-hidden rounded-xl border bg-card shadow-xs ${className}`}>
      <Table className="min-w-[1180px] table-fixed">
        <TableHeader>
          <TableRow className="h-10 bg-muted/35 hover:bg-muted/35">
            {visibleColumns.map((column) => {
              const align = alignmentFor(column.type, column.align);

              return (
                <TableHead
                  key={String(column.key)}
                  style={column.width ? { width: column.width } : undefined}
                  className={`h-10 px-3 align-middle text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground ${alignmentClass(align)} ${widthClass(column.type)}`}
                >
                  <span className="block truncate">{column.label}</span>
                </TableHead>
              );
            })}

            {rowActions || onOpenDetail ? (
              <TableHead className="h-10 min-w-[88px] px-3 text-right align-middle text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
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
                className={`h-12 ${onRowSelect ? "cursor-pointer" : ""}`}
              >
                {visibleColumns.map((column) => {
                  const type = column.type ?? "text";
                  const align = alignmentFor(type, column.align);
                  const value = column.render ? column.render(row) : row[column.key as keyof T];

                  return (
                    <TableCell
                      key={String(column.key)}
                      className={`h-12 px-3 py-2 align-middle text-sm leading-5 ${alignmentClass(align)} ${cellClass(type)} ${widthClass(type)}`}
                    >
                      {type === "status" || type === "priority" ? (
                        <ErpStatusBadge status={String(value ?? "")} />
                      ) : type === "badge" ? (
                        <CountBadge value={value as ReactNode} />
                      ) : (
                        <span className="block truncate">{value as ReactNode}</span>
                      )}
                    </TableCell>
                  );
                })}

                {rowActions || onOpenDetail ? (
                  <TableCell className="h-12 min-w-[88px] px-3 py-2 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      {rowActions ? rowActions(row) : null}
                      {onOpenDetail ? (
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenDetail(row);
                          }}
                          className="h-auto px-0 text-primary"
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
  );
}
