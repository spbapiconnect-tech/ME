"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  ClipboardList,
  FileText,
  PackageSearch,
  Store,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ErpDataTable,
  ErpDataTableColumn,
  ErpFilterBar,
  ErpKpiGrid,
  ErpPageHeader,
  ErpRightRail,
  ErpShell,
  ErpStatusBadge,
} from "@/components/erp";

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

const branchRows: BranchRow[] = [
  {
    id: "KCH-001",
    branchCode: "KCH-001",
    branchName: "KCH Central Kitchen",
    region: "Kuching",
    manager: "Chin Ling",
    status: "Operating",
    todaySales: "RM 28,750",
    openTasks: 5,
    stockAlerts: 2,
    inspection: "94%",
    lastUpdate: "10:15",
  },
  {
    id: "BTU-001",
    branchCode: "BTU-001",
    branchName: "BTU Outlet",
    region: "Bintulu",
    manager: "Morexson",
    status: "Operating",
    todaySales: "RM 18,420",
    openTasks: 4,
    stockAlerts: 1,
    inspection: "91%",
    lastUpdate: "09:45",
  },
  {
    id: "KCH-002",
    branchCode: "KCH-002",
    branchName: "KCH Pickup Point",
    region: "Kuching",
    manager: "Lydia",
    status: "Preparation",
    todaySales: "RM 6,880",
    openTasks: 2,
    stockAlerts: 1,
    inspection: "88%",
    lastUpdate: "08:30",
  },
];

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

const kpis = [
  { label: "Today Sales", value: "RM 53,050", hint: "+12% from yesterday" },
  { label: "Open Stores", value: "7 / 8", hint: "1 preparing" },
  { label: "Open Tasks", value: "12", hint: "3 overdue" },
  { label: "Stock Alerts", value: "4", hint: "2 critical" },
  { label: "Staff On Duty", value: "18", hint: "2 late starters" },
  { label: "Inspection Score", value: "92%", hint: "good" },
  { label: "Pending Approvals", value: "3", hint: "review needed" },
  { label: "POS Sync", value: "Normal", hint: "last sync 09:40" },
];

export function WorkbenchErpPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("KCH-001");

  const selected = useMemo(
    () => branchRows.find((row) => row.id === selectedId) ?? branchRows[0],
    [selectedId],
  );

  return (
    <ErpShell activeHref="/">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "Dashboard", "Operations Workbench"]}
          title="Operations Workbench"
          zhTitle="运营工作台"
          subtitle="Review sales, branch status, urgent tasks, inventory risk, staff coverage, and daily operations from one workspace."
          actions={
            <>
              <Button size="sm" onClick={() => router.push("/branches")}>
                <Store className="size-4" />
                View Branches
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/tasks")}>
                <ClipboardList className="size-4" />
                Open Tasks
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/reports")}>
                <FileText className="size-4" />
                View Reports
              </Button>
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
                  <Button variant="outline" className="w-full justify-between">
                    All Branches
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Last 7 days
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Operating Status
                  </Button>
                </>
              }
              actions={
                <Button variant="outline" className="w-full" onClick={() => router.push("/reports")}>
                  Open Report
                </Button>
              }
            />

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Branch Performance</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Daily operational snapshot across active restaurant branches.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/branches")}>
                  Open Branch Module
                  <ArrowUpRight className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ErpDataTable
                  columns={branchColumns}
                  data={branchRows}
                  getRowId={(row) => row.id}
                  selectedId={selectedId}
                  onRowSelect={(row) => setSelectedId(row.id)}
                  onOpenDetail={(row) => router.push(`/branches/${row.id}`)}
                />
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Work Queue</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/tasks")}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Opening checklist review", "KCH Central Kitchen", "Critical"],
                    ["Fridge temperature check", "BTU Outlet", "High"],
                    ["Shift handover confirmation", "KCH Pickup Point", "Pending"],
                  ].map(([task, branch, status]) => (
                    <div key={task} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-sm font-medium">{task}</div>
                        <div className="text-xs text-muted-foreground">{branch}</div>
                      </div>
                      <ErpStatusBadge status={status} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Inventory Risk</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/psi/inventory")}>
                    View PSI
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["French Fries", "Below safety stock", "Critical"],
                    ["Tomato Sauce", "Reorder needed", "High"],
                    ["Burger Buns", "Low stock", "Low"],
                  ].map(([item, note, status]) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-sm font-medium">{item}</div>
                        <div className="text-xs text-muted-foreground">{note}</div>
                      </div>
                      <ErpStatusBadge status={status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="space-y-6">
            <ErpRightRail title="Selected Branch">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{selected.branchName}</div>
                    <div className="text-xs text-muted-foreground">{selected.branchCode} · {selected.region}</div>
                  </div>
                  <ErpStatusBadge status={selected.status} />
                </div>

                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>Manager</span>
                    <span className="font-medium text-foreground">{selected.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales</span>
                    <span className="font-medium text-foreground">{selected.todaySales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection</span>
                    <span className="font-medium text-foreground">{selected.inspection}</span>
                  </div>
                </div>

                <Button className="mt-4 w-full" size="sm" onClick={() => router.push(`/branches/${selected.id}`)}>
                  Open Detail
                </Button>
              </div>
            </ErpRightRail>

            <ErpRightRail title="Priority Alerts">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-4 text-destructive" />
                  <div>
                    <div className="text-sm font-medium text-foreground">3 overdue tasks</div>
                    <div className="text-xs text-muted-foreground">Manager review required</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <PackageSearch className="mt-0.5 size-4 text-amber-500" />
                  <div>
                    <div className="text-sm font-medium text-foreground">2 critical stock risks</div>
                    <div className="text-xs text-muted-foreground">PSI follow-up needed</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Users className="mt-0.5 size-4 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-foreground">1 shift coverage gap</div>
                    <div className="text-xs text-muted-foreground">Night shift needs confirmation</div>
                  </div>
                </div>
              </div>
            </ErpRightRail>

            <ErpRightRail title="Quick Links">
              <div className="grid gap-2">
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/branches")}>
                  <Store className="size-4" />
                  Branch Management
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/inspection")}>
                  <ClipboardList className="size-4" />
                  Inspection
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/psi/inventory")}>
                  <PackageSearch className="size-4" />
                  Inventory
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/reports")}>
                  <FileText className="size-4" />
                  Reports
                </Button>
              </div>
            </ErpRightRail>
          </aside>
        </section>
      </div>
    </ErpShell>
  );
}
