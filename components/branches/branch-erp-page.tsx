"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Download, 
  FileText, 
  BarChart3,
  ListTodo, 
Warehouse,
  CheckSquare, 
  MoreHorizontal, 
  ClipboardList, 
  AlertCircle, 
  History,
  Activity,
  ArrowUpRight,
  MapPin,
  Phone,
  Clock,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
  "HQ-001": {
    "Branch Code": "HQ-001",
    Region: "HQ",
    Manager: "Admin",
    "Business Hours": "09:00–18:00",
    Phone: "082-999 000",
    Address: "ME HQ Tower, Kuching",
    "Staff Today": "45",
    "Current Shift": "Full support active",
    "Last Inspection": "N/A",
    "Inventory Review": "0 alerts",
  },
};

const tabs = ["Overview", "Branch Health", "Today Operations", "Related Records", "Tasks", "Activity"];

export function BranchErpPage() {
  const router = useRouter();
const [selectedId, setSelectedId] = useState("KCH-001");
  const [activeTab, setActiveTab] = useState("Overview");

  const selected = useMemo(
    () => erpBranchRows.find((row) => row.id === selectedId) ?? erpBranchRows[0],
    [selectedId]
  );

  const detailData = branchDetails[selectedId] || branchDetails["KCH-001"];

  const handleExport = () => {
    toast.success("Exporting branch report...", {
      description: "Your report will be ready in a few moments.",
    });
  };

  const handleCreateTask = () => {
    toast.info("Task creation initiated", {
      description: "Redirecting to task engine...",
    });
  };

  return (
    <ErpShell activeHref="/branches">
      <div className="space-y-6">
        {/* Page Header */}
        <ErpPageHeader
          breadcrumbs={["ME", "Store Operations", "Branch Management"]}
          title="Branch Management"
          subtitle="Manage branch operating status, performance, staffing, tasks, and alerts across all stores."
          actions={
            <div className="flex items-center justify-end gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Branch</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add New Branch</SheetTitle>
                    <SheetDescription>
                      Fill in the details to register a new branch in the system.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 py-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Branch Name</label>
                      <Input placeholder="Enter branch name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Branch Code</label>
                      <Input placeholder="e.g. KCH-003" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Region</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kuching">Kuching</SelectItem>
                          <SelectItem value="bintulu">Bintulu</SelectItem>
                          <SelectItem value="miri">Miri</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">Create Branch</Button>
                </SheetContent>
              </Sheet>

              <Button variant="outline" size="sm" onClick={handleExport} className="hidden gap-2 md:inline-flex">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => router.push("/reports?module=branches")} className="hidden gap-2 md:inline-flex">
                <FileText className="h-4 w-4" />
                <span>View Reports</span>
              </Button>

              <Button variant="outline" size="sm" onClick={() => router.push("/tasks?module=branches")} className="hidden gap-2 md:inline-flex">
                <CheckSquare className="h-4 w-4" />
                <span>Open Tasks</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="md:hidden" onClick={handleExport}>
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem className="md:hidden" onClick={() => router.push("/reports?module=branches")}>
                    View Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem className="md:hidden" onClick={() => router.push("/tasks?module=branches")}>
                    Open Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem>Import Branches</DropdownMenuItem>
                  <DropdownMenuItem>Batch Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
        />

        {/* KPI Grid */}
        <ErpKpiGrid kpis={kpis} />

        {/* Filter Bar */}
        <ErpFilterBar
          searchPlaceholder="Search branches..."
          filters={
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="kch">Kuching Stores</SelectItem>
                  <SelectItem value="btu">Bintulu Stores</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operating">Operating</SelectItem>
                  <SelectItem value="preparation">Preparation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />

        {/* Branch Directory */}
        {/* Mobile Branch Card List */}
        <div className="grid gap-3 md:hidden">
          {erpBranchRows.map((row) => {
            const selected = row.id === selectedId;

            return (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelectedId(row.id)}
                className={`w-full rounded-xl border bg-card p-4 text-left shadow-sm transition hover:bg-muted/40 ${selected ? "border-primary ring-1 ring-primary/30" : "border-border"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {row.branchName}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {row.branchCode} · {row.region}
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px] uppercase tracking-[0.14em]">
                    {row.status}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Today Sales</div>
                    <div className="font-medium text-foreground">{row.todaySales}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Last Update</div>
                    <div className="font-medium text-foreground">{row.lastUpdate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Open Tasks</div>
                    <div className="font-medium text-foreground">{row.openTasks}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Stock Alerts</div>
                    <div className="font-medium text-foreground">{row.stockAlerts}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span>{row.manager}</span>
                  <span>Inspection {row.inspection}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop / Tablet Branch Table */}
        <div className="hidden md:block">
        <ErpDataTable
          columns={branchColumns}
          data={erpBranchRows}
          getRowId={(row) => row.id}
          selectedId={selectedId}
          onRowSelect={(row) => setSelectedId(row.id)}
          onOpenDetail={(row) => router.push(`/branches/${row.id}`)}
          rowActions={() => (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        />
        </div>

        {/* Detail + Right Rail */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            {/* Detail Panel */}
            <ErpDetailPanel
              title={selected.branchName}
              status={selected.status}
              subtitle={`${selected.branchCode} • ${selected.region} Region`}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              actions={
                <Button size="sm" variant="outline" onClick={handleCreateTask} className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Task</span>
                </Button>
              }
            >
              <div className="p-6">
                {activeTab === "Overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(detailData).slice(0, 6).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{key}</div>
                            <div className="text-sm font-medium">{value}</div>
                          </div>
                        ))}
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{detailData.Address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{detailData.Phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{detailData["Business Hours"]}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="rounded-lg bg-muted/30 p-4 space-y-4">
                        <h4 className="text-sm font-bold">Today Operation Summary</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Staff on Duty</span>
                            <span className="font-medium">{detailData["Staff Today"]} Persons</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Current Shift</span>
                            <span className="font-medium text-primary">{detailData["Current Shift"]}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Sales Progress</span>
                            <span className="font-medium text-success">84% of target</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Branch Health" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Inspection", value: selected.inspection, status: "Good" },
                      { label: "Stock Health", value: detailData["Inventory Review"], status: "Warning" },
                      { label: "Staff Coverage", value: "100%", status: "Good" },
                    ].map((item) => (
                      <div key={item.label} className="border rounded-md p-4 space-y-2">
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="text-xl font-bold">{item.value}</div>
                        <Badge variant={item.status === "Good" ? "outline" : "secondary"} className={item.status === "Good" ? "text-success border-success/30 bg-success/5" : ""}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "Tasks" && (
                  <div className="space-y-1">
                    {[
                      { title: "Review morning inventory", status: "Open", priority: "High" },
                      { title: "Submit daily sales report", status: "In Progress", priority: "Medium" },
                      { title: "Clean storage area", status: "Open", priority: "Low" },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <CheckSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{task.status}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{task.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "Activity" && (
                  <div className="space-y-6 py-2">
                    {[
                      { user: "Chin Ling", action: "Completed opening checklist", time: "08:15 AM", icon: ClipboardList },
                      { user: "System", action: "Daily sales target updated", time: "09:00 AM", icon: Activity },
                      { user: "Sarah Lee", action: "Reported stock shortage: Milk", time: "10:05 AM", icon: AlertCircle },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i < 2 && <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border" />}
                        <div className="h-8 w-8 rounded-full border bg-background flex items-center justify-center shrink-0 z-10">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col gap-0.5 pb-6">
                          <div className="text-sm font-medium">{item.user} <span className="text-muted-foreground font-normal">{item.action}</span></div>
                          <div className="text-xs text-muted-foreground">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Fallback for other tabs */}
                {["Today Operations", "Related Records"].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <History className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm italic">Content for {activeTab} will be available soon.</p>
                  </div>
                )}
              </div>
            </ErpDetailPanel>
            
            {/* Lower Related Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md bg-card overflow-hidden shadow-sm">
                <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Inventory Alerts</h3>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">View All</Button>
                </div>
                <div className="p-1">
                  {[
                    { item: "Fresh Milk", stock: "2L", alert: "Critical" },
                    { item: "Coffee Beans", stock: "5kg", alert: "Low" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-2 text-sm border-b last:border-0">
                      <span>{row.item}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">{row.stock} left</span>
                        <Badge variant="destructive" className="text-[10px] h-4 px-1">{row.alert}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-md bg-card overflow-hidden shadow-sm">
                <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Staff On Duty</h3>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">Manage</Button>
                </div>
                <div className="p-1">
                  {[
                    { name: "Alex Wong", role: "Barista", shift: "Morning" },
                    { name: "Siti Aminah", role: "Supervisor", shift: "Morning" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-2 text-sm border-b last:border-0">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{row.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{row.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Rail */}
          <div className="min-w-0 space-y-6">
            <ErpRightRail title="Branch Insights">
              <div className="p-4 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-bold">Performance Up</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sales for {selected.branchName} are up by 12% compared to last week. Productivity is high.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Top Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Inventory Critical</div>
                        <div className="text-[10px] text-muted-foreground">2 items below threshold</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-warning mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Inspection Due</div>
                        <div className="text-[10px] text-muted-foreground">Scheduled for tomorrow</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quick Links</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { label: "View branch report", href: `/reports?branch=${selectedId}`, icon: BarChart3 },
                      { label: "Open tasks", href: `/tasks?branch=${selectedId}`, icon: ListTodo },
                      { label: "Inventory alerts", href: `/psi/inventory?branch=${selectedId}`, icon: Warehouse },
                      { label: "Open inspection", href: `/inspection?branch=${selectedId}`, icon: ClipboardList },
                      { label: "Procurement request", href: `/psi/procurement?action=new&branch=${selectedId}`, icon: Plus },
                    ].map((link) => (
                      <Button 
                        key={link.label} 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start gap-2 h-8 text-xs font-normal hover:text-primary"
                        onClick={() => router.push(link.href)}
                      >
                        <link.icon className="h-3.5 w-3.5" />
                        {link.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ErpRightRail>

            <div className="border rounded-md bg-card p-4 shadow-sm space-y-4">
              <h3 className="text-sm font-bold">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { user: "Chin Ling", action: "Updated inventory", time: "2h ago" },
                  { user: "System", action: "Daily report generated", time: "5h ago" },
                  { user: "Sarah Lee", action: "Completed 4 tasks", time: "1d ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 uppercase">
                      {activity.user[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">{activity.user}</span>
                      <span className="text-muted-foreground text-[11px]">{activity.action}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground">View Full Timeline</Button>
            </div>
          </div>
        </div>
      </div>
    </ErpShell>
  );
}
