"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ClipboardList, FileText, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErpDataTable, ErpDataTableColumn, ErpFilterBar, ErpKpiGrid, ErpPageHeader, ErpRightRail, ErpShell, ErpStatusBadge } from "@/components/erp";
import { useMeRuntimeStore } from "@/stores/me-runtime";

type BranchRow = {
  id: string;
  branchCode: string;
  branchName: string;
  region: string;
  manager: string;
  status: string;
  todaySales: string;
  openTasks: number;
  stockAlerts: number;
  inspection: string;
  lastUpdate: string;
};

const branchColumns: ErpDataTableColumn<BranchRow>[] = [
  { key: "branchCode", label: "Branch Code", type: "code" },
  { key: "branchName", label: "Branch Name", type: "name" },
  { key: "region", label: "Region", type: "text" },
  { key: "manager", label: "Manager", type: "text" },
  { key: "status", label: "Status", type: "status" },
  { key: "todaySales", label: "Today Sales", type: "amount" },
  { key: "openTasks", label: "Open Tasks", type: "number" },
  { key: "stockAlerts", label: "Stock Alerts", type: "badge" },
  { key: "inspection", label: "Inspection", type: "percent" },
  { key: "lastUpdate", label: "Last Update", type: "time" },
];

function parseCurrency(raw?: string) {
  const numberPart = Number((raw || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numberPart) ? numberPart : 0;
}

export function WorkbenchErpPage() {
  const router = useRouter();
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const branchModuleRows = getRows("branches", []);
  const [selectedId, setSelectedId] = useState<string | undefined>(branchModuleRows[0]?.id);

  const branchRows: BranchRow[] = useMemo(
    () =>
      branchModuleRows.map((row, idx) => {
        const map: Record<string, string> = Object.fromEntries((row.detailItems ?? []).map((item) => [item.label, item.value]));
        return {
          id: row.id,
          branchCode: map["Branch Code"] || map["Code"] || `BR-${idx + 1}`,
          branchName: row.title,
          region: row.subtitle || "Not Configured",
          manager: map["Manager"] || row.owner || "Not Configured",
          status: map["Branch Status"] || row.status || "Draft",
          todaySales: map["Today Sales"] || "RM 0",
          openTasks: Number(map["Open Tasks"] || 0),
          stockAlerts: Number(map["Stock Alerts"] || 0),
          inspection: map["Inspection Score"] || "0%",
          lastUpdate: row.meta || "Not Configured",
        };
      }),
    [branchModuleRows],
  );

  const selected = useMemo(() => branchRows.find((row) => row.id === selectedId) ?? branchRows[0], [branchRows, selectedId]);
  const totalSales = branchRows.reduce((sum, row) => sum + parseCurrency(row.todaySales), 0);
  const totalTasks = branchRows.reduce((sum, row) => sum + row.openTasks, 0);
  const totalAlerts = branchRows.reduce((sum, row) => sum + row.stockAlerts, 0);

  const kpis = [
    { label: "Today Sales", value: `RM ${totalSales.toLocaleString()}`, hint: "runtime input" },
    { label: "Open Stores", value: `${branchRows.filter((row) => row.status.toLowerCase().includes("active") || row.status.toLowerCase().includes("open")).length} / ${branchRows.length}`, hint: "runtime input" },
    { label: "Open Tasks", value: String(totalTasks), hint: "runtime input" },
    { label: "Stock Alerts", value: String(totalAlerts), hint: "runtime input" },
    { label: "Staff On Duty", value: "Not Configured", hint: "setup required" },
    { label: "Inspection Score", value: selected?.inspection || "0%", hint: "runtime input" },
    { label: "Pending Approvals", value: "Not Configured", hint: "setup required" },
    { label: "POS Sync", value: "Not Configured", hint: "setup required" },
  ];

  return (
    <ErpShell activeHref="/">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "Dashboard", "Operations Workbench"]}
          title="Operations Workbench"
          zhTitle="运营工作台"
          subtitle="Runtime-backed operations workspace. Input and manage your own branch data from modules."
          actions={
            <>
              <Button size="sm" onClick={() => router.push("/branches")}><Store className="size-4" />View Branches</Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/tasks")}><ClipboardList className="size-4" />Open Tasks</Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/reports")}><FileText className="size-4" />View Reports</Button>
            </>
          }
        />

        <ErpKpiGrid kpis={kpis} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <ErpFilterBar
              searchPlaceholder="Search branch, task, staff, supplier..."
              filters={
                <>
                  <Button variant="outline" className="w-full justify-between">All Branches</Button>
                  <Button variant="outline" className="w-full justify-between">Last 7 days</Button>
                  <Button variant="outline" className="w-full justify-between">Operating Status</Button>
                </>
              }
              actions={<Button variant="outline" className="w-full" onClick={() => router.push("/reports")}>Open Report</Button>}
            />

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Branch Performance</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Live from runtime input. Add branches from the Branches module.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/branches")}>Open Branch Module<ArrowUpRight className="size-4" /></Button>
              </CardHeader>
              <CardContent>
                <ErpDataTable
                  columns={branchColumns}
                  data={branchRows}
                  getRowId={(row) => row.id}
                  selectedId={selectedId}
                  onRowSelect={(row) => setSelectedId(row.id)}
                  onOpenDetail={(row) => router.push(`/branches/${row.id}`)}
                  emptyMessage="No branch records yet. Go to Branches and create your first real record."
                />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <ErpRightRail title="Selected Branch">
              <div className="rounded-lg border p-4">
                {selected ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{selected.branchName}</div>
                        <div className="text-xs text-muted-foreground">{selected.branchCode} · {selected.region}</div>
                      </div>
                      <ErpStatusBadge status={selected.status} />
                    </div>
                    <div className="mt-4 grid gap-3 text-sm">
                      <div className="flex justify-between"><span>Manager</span><span className="font-medium text-foreground">{selected.manager}</span></div>
                      <div className="flex justify-between"><span>Sales</span><span className="font-medium text-foreground">{selected.todaySales}</span></div>
                      <div className="flex justify-between"><span>Inspection</span><span className="font-medium text-foreground">{selected.inspection}</span></div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No branch selected. Create a branch record first.</p>
                )}
                <Button className="mt-4 w-full" size="sm" onClick={() => router.push("/branches")}>Open Detail</Button>
              </div>
            </ErpRightRail>
          </aside>
        </section>
      </div>
    </ErpShell>
  );
}
