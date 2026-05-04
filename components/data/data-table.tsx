import type { SupportedLocale } from "@/types/module";
import type { PageSchemaColumn } from "@/types/page-schema";

import { EmptyState } from "@/components/data/empty-state";
import { StatusChip } from "@/components/data/status-chip";
import { getLocalizedText } from "@/lib/localized";

interface DataTableProps {
  locale: SupportedLocale;
  columns: PageSchemaColumn[];
  rows: Array<Record<string, string>>;
  statusColumnKeys?: string[];
  actionColumnKey?: string;
}

export function DataTable({
  locale,
  columns,
  rows,
  statusColumnKeys = ["status", "stockStatus", "severity"],
  actionColumnKey,
}: DataTableProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        locale={locale}
        title={{ zh: "暂无表格数据", en: "No Table Data Yet" }}
        description={{ zh: "当前没有可展示的表格占位数据。", en: "There is no table placeholder data to display yet." }}
      />
    );
  }

  return (
    <div className="me-data-table-shell">
      <table className="me-data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{getLocalizedText(column.label, locale)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => {
                const value = row[column.key] ?? "--";
                if (statusColumnKeys.includes(column.key)) {
                  return (
                    <td key={column.key}>
                      <StatusChip label={value} locale={locale} tone="info" size="sm" />
                    </td>
                  );
                }
                if (actionColumnKey && column.key === actionColumnKey) {
                  return (
                    <td key={column.key}>
                      <button className="me-action-button me-action-button--ghost" type="button">
                        {value}
                      </button>
                    </td>
                  );
                }
                return <td key={column.key}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
