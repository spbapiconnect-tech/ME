"use client";

import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MeDataTableProps {
  title?: string;
  columns: string[];
  rows: ReactNode[][];
  embedded?: boolean;
  selectableRows?: boolean;
  selectedRowIndex?: number;
  onRowSelect?: (index: number) => void;
}

function TableMarkup({ columns, rows, selectableRows, selectedRowIndex, onRowSelect }: Pick<MeDataTableProps, "columns" | "rows" | "selectableRows" | "selectedRowIndex" | "onRowSelect">) {
  return (
    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
      <thead>
        <tr className="bg-slate-50">
          {columns.map((column) => (
            <th key={column} className="border-b border-slate-200/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={index}
            className="transition-colors hover:bg-slate-50/75"
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="border-b border-slate-100 px-3 py-2.5 align-top text-[13px] text-slate-700"
              >
                {cellIndex === 0 && selectableRows ? (
                  <button
                    type="button"
                    onClick={() => onRowSelect?.(index)}
                    className={`block w-full text-left ${selectedRowIndex === index ? "font-semibold text-blue-700" : ""}`}
                  >
                    {cell}
                  </button>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MeDataTable({ title, columns, rows, embedded = false, selectableRows = false, selectedRowIndex, onRowSelect }: MeDataTableProps) {
  if (embedded) {
    return (
      <div className="overflow-x-auto">
        {title ? <div className="px-1 pb-3 text-sm font-semibold text-slate-900">{title}</div> : null}
        <TableMarkup columns={columns} rows={rows} selectableRows={selectableRows} selectedRowIndex={selectedRowIndex} onRowSelect={onRowSelect} />
      </div>
    );
  }

  return (
    <Card size="sm" className="border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {title ? (
        <CardHeader className="gap-1">
          <CardTitle className="text-sm text-slate-900">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="overflow-x-auto pt-1">
        <TableMarkup columns={columns} rows={rows} selectableRows={selectableRows} selectedRowIndex={selectedRowIndex} onRowSelect={onRowSelect} />
      </CardContent>
    </Card>
  );
}
