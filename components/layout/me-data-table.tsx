import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MeDataTableProps {
  title?: string;
  columns: string[];
  rows: string[][];
}

export function MeDataTable({ title, columns, rows }: MeDataTableProps) {
  return (
    <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
      {title ? (
        <CardHeader className="gap-1">
          <CardTitle className="text-sm text-slate-900">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} className="border-b border-border/60 px-3 py-2 font-medium text-slate-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row[0]}-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cellIndex}-${cell}`} className="border-b border-border/40 px-3 py-3 text-slate-700">
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
