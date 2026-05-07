"use client";

import { ReactNode } from "react";
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
  if (type === "amount" || type === "number" || type === "percent" || type === "score" || type === "date" || type === "time") {
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
  if (type === "amount" || type === "number" || type === "percent" || type === "score") return "font-medium tabular-nums text-foreground";
  if (type === "date" || type === "time") return "tabular-nums text-muted-foreground";
  if (type === "id" || type === "code") return "font-semibold text-blue-700";
  if (type === "name") return "font-semibold text-foreground";
  return "text-muted-foreground";
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
    <div className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <thead>
            <tr className="h-11 border-b border-border bg-muted/50">
              {visibleColumns.map((column) => {
                const align = alignmentFor(column.type, column.align);
                return (
                  <th
                    key={String(column.key)}
                    style={column.width ? { width: column.width } : undefined}
                    className={`px-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground ${alignmentClass(align)}`}
                  >
                    {column.label}
                  </th>
                );
              })}
              {rowActions || onOpenDetail ? (
                <th className="px-4 text-right text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                  Action
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const rowId = getRowId(row);
              const selected = rowId === selectedId;

              return (
                <tr
                  key={rowId}
                  onClick={() => onRowSelect?.(row)}
                  className={`h-12 border-b border-border/70 transition ${
                    selected ? "bg-blue-50/80" : "bg-card hover:bg-muted/40"
                  } ${onRowSelect ? "cursor-pointer" : ""}`}
                >
                  {visibleColumns.map((column) => {
                    const type = column.type ?? "text";
                    const align = alignmentFor(type, column.align);
                    const value = column.render ? column.render(row) : row[column.key as keyof T];

                    return (
                      <td key={String(column.key)} className={`px-4 text-[13px] ${alignmentClass(align)} ${cellClass(type)}`}>
                        {type === "status" || type === "priority" || type === "badge" ? (
                          <ErpStatusBadge status={String(value ?? "")} />
                        ) : (
                          (value as ReactNode)
                        )}
                      </td>
                    );
                  })}
                  {rowActions || onOpenDetail ? (
                    <td className="px-4 text-right">
                      {rowActions ? rowActions(row) : null}
                      {onOpenDetail ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenDetail(row);
                          }}
                          className="text-xs font-semibold text-blue-700 hover:underline"
                        >
                          Open
                        </button>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
