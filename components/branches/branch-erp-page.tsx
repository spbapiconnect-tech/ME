"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ErpDataTable,
  ErpDataTableColumn,
  ErpDetailPanel,
  ErpFilterBar,
  ErpKpiGrid,
  ErpPageHeader,
  ErpRightRail,
  ErpShell,
} from "@/components/erp";
import { erpBranchRows } from "@/lib/erp/erp-sample-data";
import { Plus, Download, FileText, CheckSquare, MoreHorizontal } from "lucide-react";

type BranchRow = (typeof erpBranchRows)[number];

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
  { label: "Total Branches", value: "8" },
  { label: "Open Stores", value: "7 / 8" },
  { label: "Today Sales", value: "RM 28,750" },
  { label: "Open Tasks", value: "12" },
  { label: "Stock Alerts", value: "4" },
  { label: "Staff On Duty", value: "18" },
  { label: "Inspection Score", value: "92%" },
  { label: "Critical Issues", value: "3" },
];

const branchDetails: Record<string, Record<string, string>> = {
  "KCH-001": {
    "Branch Code": "KCH-001",
    Region: "Kuching",
    Manager: "Chin Ling",
    "Business Hours": "10:00–00:00",
    Phone: "082-000 123",
    Address: "Kuching Central, Sarawak",
    "Staff Today": "18",
    "Current Shift": "Day / Night transition",
    "Last Inspection": "2026-05-06",
    "Inventory Review": "4 alerts",
  },
  "BTU-001": {
    "Branch Code": "BTU-001",
    Region: "Bintulu",
    Manager: "Morexson",
    "Business Hours": "10:00–22:00",
    Phone: "086-000 228",
    Address: "Bintulu Town, Sarawak",
    "Staff Today": "12",
    "Current Shift": "Day shift active",
    "Last Inspection": "2026-05-05",
    "Inventory Review": "1 alert",
  },
  "KCH-002": {
    "Branch Code": "KCH-002",
    Region: "Kuching",
    Manager: "Lydia",
    "Business Hours": "10:00–20:00",
    Phone: "082-000 778",
    Address: "Kuching Pickup Zone",
    "Staff Today": "6",
    "Current Shift": "Opening preparation",
    "Last Inspection": "2026-05-04",
    "Inventory Review": "1 alert",
  },
};

const tabs = ["Overview", "Branch Health", "Today Operations", "Related Records", "Tasks", "Activity"];

export function BranchErpPage() {
  const [selectedId, setSelectedId] = useState("KCH-001");
  const [activeTab, setActiveTab] = useState("Overview");

  const selected = useMemo(
    () => erpBranchRows.find((row) => row.id === selectedId) ?? erpBranchRows[0],
    [selectedId]
  );

  return (
    <ErpShell activeHref="/branches">
      <div className="flex flex-col gap-6">
        <ErpPageHeader
          breadcrumbs={["Store Operations", "Branches"]}
          title="Branch Directory"
          zhTitle="门店管理"
          subtitle="Manage restaurant locations, kitchen hubs, and pickup points across regions."
          actions={
            <>
              <Button  className="h-8">
                <Plus className="mr-2 h-4 w-4" /> Add Branch
              </Button>
              <Button variant="outline"  className="h-8">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button variant="outline"  className="h-8">
                <FileText className="mr-2 h-4 w-4" /> View Reports
              </Button>
              <Button variant="outline"  className="h-8">
                <CheckSquare className="mr-2 h-4 w-4" /> Open Tasks
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </>
          }
        />

        <ErpKpiGrid kpis={kpis} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-9">
            <ErpFilterBar
              filters={
                <>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-9 w-[160px]">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="kuching">Kuching</SelectItem>
                      <SelectItem value="bintulu">Bintulu</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger className="h-9 w-[160px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="operating">Operating</SelectItem>
                      <SelectItem value="preparation">Preparation</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              }
            />

            <ErpDataTable
              columns={branchColumns}
              data={erpBranchRows}
              getRowId={(row) => row.id}
              selectedId={selectedId}
              onRowSelect={(row) => setSelectedId(row.id)}
            />

            <div className="mt-2">
              <ErpDetailPanel
                title={selected.branchName}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(branchDetails[selected.branchCode] || {}).map(([label, value]) => (
                    <div key={label} className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">{label}</div>
                      <div className="text-sm font-medium text-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </ErpDetailPanel>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ErpRightRail title="Branch Insights">
              <div className="space-y-4 p-4">
                <Card className="p-4">
                  <h4 className="mb-2 text-sm font-semibold">Today Performance</h4>
                  <div className="text-2xl font-bold text-primary">RM 28,750</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </Card>
                <Card className="p-4">
                  <h4 className="mb-2 text-sm font-semibold">Staff Status</h4>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">18 on duty</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-sm">2 arriving late</span>
                  </div>
                </Card>
              </div>
            </ErpRightRail>
          </div>
        </div>
      </div>
    </ErpShell>
  );
}
