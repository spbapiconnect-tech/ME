import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MeDataTableProps {
  title?: string;
  columns: string[];
  rows: string[][];
}

export function MeDataTable({ title, columns, rows }: MeDataTableProps) {
  return (
    <Card size="sm" className="border-border/70 bg-white/90 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.16)]">
      {title ? (
        <CardHeader className="gap-1">
          <CardTitle className="text-sm text-slate-900">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="overflow-x-auto pt-1">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} className="border-b border-slate-200/80 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row[0]}-${index}`} className="transition-colors hover:bg-slate-50/75">
                {row.map((cell, cellIndex) => (
                  <td key={`${cellIndex}-${cell}`} className="border-b border-slate-100 px-3 py-3.5 text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
