"use client";

import { MeDataTable } from "@/components/layout";

export function RestaurantModuleTable({
  columns,
  rows,
  selectedRowIndex,
  onRowSelect,
}: {
  columns: string[];
  rows: string[][];
  selectedRowIndex?: number;
  onRowSelect?: (index: number) => void;
}) {
  return <MeDataTable embedded columns={columns} rows={rows} selectableRows selectedRowIndex={selectedRowIndex} onRowSelect={onRowSelect} />;
}
