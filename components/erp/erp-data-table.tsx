"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ErpEmptyState } from "@/components/erp/erp-empty-state";
import { ErpErrorState } from "@/components/erp/erp-error-state";
import { ErpLoadingState } from "@/components/erp/erp-loading-state";
import { ErpStatusBadge } from "@/components/erp/erp-status-badge";
import type { ErpColumnType, ErpDataTableColumn } from "@/lib/erp/erp-module-schema";
import { cn } from "@/lib/utils";

type ErpRecord = { id: string; detailHref?: string };

const rightAlignedTypes: ErpColumnType[] = [
  "amount",
  "currency",
  "number",
  "count",
  "quantity",
  "percent",
  "percentage",
  "score",
  "date",
  "time",
];

const centerAlignedTypes: ErpColumnType[] = ["status", "priority", "badge", "action"];

function alignClassName(type: ErpColumnType = "text", align?: "left" | "center" | "right") {
  if (align === "right") return "text-right tabular-nums";
  if (align === "center") return "text-center";
  if (align === "left") return "text-left";
  if (rightAlignedTypes.includes(type)) return "text-right tabular-nums";
  if (centerAlignedTypes.includes(type)) return "text-center";
  return "text-left";
}

function formatCellValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
}

function defaultStatusTone(value: ReactNode) {
  const text = String(value).toLowerCase();
  if (text.includes("critical") || text.includes("overdue") || text.includes("error")) return "danger";
  if (text.includes("pending") || text.includes("warning") || text.includes("low")) return "warning";
  if (text.includes("active") || text.includes("healthy") || text.includes("operating")) return "success";
  if (text.includes("progress")) return "info";
  return "muted";
}

export function ErpDataTable<TRecord extends ErpRecord>({
  columns,
  data,
  records,
  selectedId,
  selectable = false,
  loading = false,
  error,
  emptyMessage = "No records",
  onRowSelect,
  onOpenDetail,
  rowActions,
  density = "default",
  className,
  getRowId = (record) => record.id,
}: {
  columns: Array<ErpDataTableColumn<TRecord>>;
  data?: TRecord[];
  records?: TRecord[];
  selectedId?: string;
  selectable?: boolean;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRowSelect?: (record: TRecord) => void;
  onOpenDetail?: (record: TRecord) => void;
  rowActions?: (record: TRecord) => ReactNode;
  density?: "compact" | "default" | "comfortable";
  className?: string;
  getRowId?: (record: TRecord) => string;
}) {
  const rows = data ?? records ?? [];
  const visibleColumns = columns.filter((column) => column.visible !== false);
  const rowHeight = density === "compact" ? "h-11" : density === "comfortable" ? "h-14" : "h-12";

  if (loading) return <ErpLoadingState />;
  if (error) return <ErpErrorState title="Unable to load records" description={error} />;
  if (!rows.length) return <ErpEmptyState title={emptyMessage} />;

  return (
    <div className={cn("rounded-xl border bg-card shadow-sm", className)}>
      <Table>
        <TableHeader>
          <TableRow className="h-11 bg-muted/50 hover:bg-muted/50">
            {selectable ? (
              <TableHead className="w-10 px-4 text-center">
                <span className="sr-only">Select</span>
              </TableHead>
            ) : null}
            {visibleColumns.map((column) => (
              <TableHead
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className={cn("h-11 px-4 text-xs font-semibold uppercase text-muted-foreground", alignClassName(column.type, column.align))}
              >
                {column.label}
              </TableHead>
            ))}
            {onOpenDetail || rowActions ? <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase text-muted-foreground">Action</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((record) => {
            const rowId = getRowId(record);

            return (
            <TableRow
              key={rowId}
              data-state={selectedId === rowId ? "selected" : undefined}
              onClick={() => onRowSelect?.(record)}
              className={cn(rowHeight, "cursor-pointer hover:bg-primary/5", selectedId === rowId && "bg-primary/10")}
            >
              {selectable ? (
                <TableCell className="px-4 text-center">
                  <Checkbox
                    aria-label={`Select ${record.id}`}
                    checked={selectedId === rowId}
                    onCheckedChange={() => onRowSelect?.(record)}
                  />
                </TableCell>
              ) : null}
              {visibleColumns.map((column) => {
                const value = column.render ? column.render(record) : formatCellValue(record[column.key]);
                const type = column.type ?? "text";

                return (
                  <TableCell key={`${rowId}-${column.key}`} className={cn("px-4 py-3 text-[13px]", alignClassName(type, column.align))}>
                    {type === "id" || type === "code" ? (
                      record.detailHref ? (
                        <Link href={record.detailHref} className="font-semibold text-primary hover:underline">
                          {value}
                        </Link>
                      ) : (
                        <span className="font-semibold text-primary">{value}</span>
                      )
                    ) : type === "name" || type === "title" ? (
                      <span className="font-medium text-foreground">{value}</span>
                    ) : type === "status" || type === "priority" || type === "badge" ? (
                      <ErpStatusBadge tone={defaultStatusTone(value)}>{value}</ErpStatusBadge>
                    ) : type === "date" || type === "time" ? (
                      <span className="text-muted-foreground">{value}</span>
                    ) : (
                      <span className="text-foreground/85">{value}</span>
                    )}
                  </TableCell>
                );
              })}
              {onOpenDetail || rowActions ? (
                <TableCell className="px-4 text-right">
                  {rowActions ? (
                    rowActions(record)
                  ) : (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenDetail?.(record);
                      }}
                    >
                      Open Detail
                    </Button>
                  )}
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

export { alignClassName as getErpTableAlignmentClassName };
