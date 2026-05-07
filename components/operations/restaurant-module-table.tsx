import { MeDataTable } from "@/components/layout";

export function RestaurantModuleTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return <MeDataTable embedded columns={columns} rows={rows} />;
}
