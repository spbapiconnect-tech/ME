"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ErpActionDrawer,
  ErpConfirmDialog,
  ErpDataTable,
  ErpDetailPanel,
  ErpFilterBar,
  ErpKpiGrid,
  ErpPageHeader,
  ErpRightRail,
  ErpShell,
  ErpStatusBadge,
} from "@/components/erp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveErpLabel } from "@/lib/erp/erp-i18n";
import type { ErpDataTableColumn } from "@/lib/erp/erp-module-schema";
import {
  erpBranchInventoryAlerts,
  erpBranchOpenTasks,
  erpBranchRecords,
  type ErpBranchRecord,
} from "@/lib/erp/erp-sample-data";
import { useErpPreferences } from "@/lib/erp/erp-theme";

const branchCopy = {
  en: {
    title: "Branch Management",
    subtitle: "Manage branch operating status, performance, staffing, tasks, and alerts across all stores.",
    filters: "Search branch name / code / manager",
    allBranches: "All Branches",
    allRegions: "All Regions",
    allStatus: "All Status",
    moreFilters: "More Filters",
    addBranch: "Add Branch",
    createTask: "Create Task",
    branchHealth: "Branch Health",
    todayOperations: "Today Operations",
    relatedRecords: "Related Records",
    activity: "Activity",
    topAlerts: "Top Branch Alerts",
    recentActivity: "Recent Activity",
    openTasks: "Open Tasks",
    inventoryAlerts: "Inventory Alerts",
    branchSaved: "Branch setup saved.",
    exportReady: "Branch report exported.",
    taskSaved: "Task created for selected branch.",
  },
  zh: {
    title: "门店管理",
    subtitle: "管理所有门店的营运状态、业绩、人员、任务与风险预警。",
    filters: "搜索门店名称 / 编号 / 经理",
    allBranches: "所有门店",
    allRegions: "所有区域",
    allStatus: "所有状态",
    moreFilters: "更多筛选",
    addBranch: "新增门店",
    createTask: "创建任务",
    branchHealth: "门店健康",
    todayOperations: "今日营运",
    relatedRecords: "关联记录",
    activity: "动态",
    topAlerts: "门店重点预警",
    recentActivity: "最近动态",
    openTasks: "待处理任务",
    inventoryAlerts: "库存预警",
    branchSaved: "门店资料已保存。",
    exportReady: "门店报表已导出。",
    taskSaved: "已为所选门店创建任务。",
  },
} as const;

const taskColumns = [
  { key: "id", label: "Task ID", type: "code" },
  { key: "task", label: "Task", type: "title" },
  { key: "owner", label: "Owner", type: "text" },
  { key: "due", label: "Due", type: "date" },
  { key: "status", label: "Status", type: "status" },
] satisfies Array<ErpDataTableColumn<(typeof erpBranchOpenTasks)[number]>>;

const inventoryColumns = [
  { key: "item", label: "Item", type: "name" },
  { key: "branch", label: "Branch", type: "text" },
  { key: "onHand", label: "On Hand", type: "quantity" },
  { key: "safetyStock", label: "Safety Stock", type: "quantity" },
  { key: "status", label: "Status", type: "status" },
] satisfies Array<ErpDataTableColumn<(typeof erpBranchInventoryAlerts)[number]>>;

function getBranchColumns(locale: "en" | "zh") {
  return [
    { key: "branchCode", label: locale === "zh" ? "门店编号" : "Branch Code", type: "code", width: "8rem" },
    { key: "branchName", label: locale === "zh" ? "门店名称" : "Branch Name", type: "name", width: "13rem" },
    { key: "region", label: resolveErpLabel("region", locale), type: "text" },
    { key: "manager", label: resolveErpLabel("manager", locale), type: "text" },
    { key: "status", label: resolveErpLabel("status", locale), type: "status" },
    { key: "todaySales", label: locale === "zh" ? "今日销售额" : "Today Sales", type: "amount" },
    { key: "openTasks", label: locale === "zh" ? "待处理任务" : "Open Tasks", type: "number" },
    { key: "stockAlerts", label: locale === "zh" ? "库存预警" : "Stock Alerts", type: "badge" },
    { key: "inspection", label: locale === "zh" ? "巡检" : "Inspection", type: "percent" },
    { key: "lastUpdate", label: resolveErpLabel("lastUpdate", locale), type: "time" },
  ] satisfies Array<ErpDataTableColumn<ErpBranchRecord>>;
}

function BranchToast({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
      {message}
    </div>
  );
}

export function BranchErpPage({ detailId }: { detailId?: string }) {
  const { locale } = useErpPreferences();
  const copy = branchCopy[locale];
  const initialBranch = erpBranchRecords.find((branch) => branch.id === detailId) ?? erpBranchRecords[0];
  const [selectedId, setSelectedId] = useState(initialBranch.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [addOpen, setAddOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selected = erpBranchRecords.find((branch) => branch.id === selectedId) ?? erpBranchRecords[0];
  const branchColumns = useMemo(() => getBranchColumns(locale), [locale]);

  return (
    <ErpShell
      activeHref="/branches"
      rightRail={
        <ErpRightRail
          sections={[
            {
              title: copy.topAlerts,
              items: [
                "3 overdue tasks need review",
                "2 inventory alerts below safety stock",
                "1 inspection item awaiting verification",
              ],
            },
            {
              title: copy.recentActivity,
              items: [
                "10:15 Opening checklist submitted",
                "09:40 Stock alert created for fries",
                "09:10 Shift change approved",
              ],
            },
            {
              title: copy.openTasks,
              items: erpBranchOpenTasks.map((task) => `${task.id} ${task.task}`),
            },
            {
              title: copy.inventoryAlerts,
              items: erpBranchInventoryAlerts.map((alert) => `${alert.item}: ${alert.status}`),
            },
          ]}
        />
      }
    >
      <ErpPageHeader
        eyebrow={resolveErpLabel("branches", locale)}
        title={copy.title}
        description={copy.subtitle}
        actions={
          <>
            <Button size="sm" onClick={() => setAddOpen(true)}>{copy.addBranch}</Button>
            <Button size="sm" variant="outline" onClick={() => setExportOpen(true)}>{resolveErpLabel("export", locale)}</Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/reports?module=branches">{resolveErpLabel("viewReports", locale)}</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/tasks">{resolveErpLabel("openTasks", locale)}</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setTaskOpen(true)}>{copy.createTask}</Button>
          </>
        }
      />

      {toast ? <BranchToast message={toast} /> : null}

      <ErpKpiGrid
        items={[
          { key: "total", label: locale === "zh" ? "总门店" : "Total Branches", value: "8" },
          { key: "open", label: locale === "zh" ? "营业门店" : "Open Stores", value: "7 / 8" },
          { key: "sales", label: locale === "zh" ? "今日销售额" : "Today Sales", value: "RM 28,750" },
          { key: "tasks", label: locale === "zh" ? "待处理任务" : "Open Tasks", value: "12" },
          { key: "stock", label: locale === "zh" ? "库存预警" : "Stock Alerts", value: "4" },
          { key: "staff", label: locale === "zh" ? "当班员工" : "Staff On Duty", value: "18" },
          { key: "score", label: locale === "zh" ? "巡检得分" : "Inspection Score", value: "92%" },
          { key: "critical", label: locale === "zh" ? "严重异常" : "Critical Issues", value: "3" },
        ]}
      />

      <ErpFilterBar
        searchLabel={copy.filters}
        filters={[
          { key: "branch", label: copy.allBranches, value: "all", options: [{ label: copy.allBranches, value: "all" }] },
          { key: "region", label: copy.allRegions, value: "all", options: [{ label: copy.allRegions, value: "all" }] },
          { key: "status", label: copy.allStatus, value: "all", options: [{ label: copy.allStatus, value: "all" }] },
        ]}
        actions={<Button variant="outline">{copy.moreFilters}</Button>}
      />

      <ErpDataTable
        columns={branchColumns}
        data={erpBranchRecords}
        selectedId={selectedId}
        getRowId={(record) => record.id}
        onRowSelect={(record) => setSelectedId(record.id)}
        rowActions={(record) => (
          <Button asChild size="xs" variant="outline" onClick={(event) => event.stopPropagation()}>
            <Link href={record.detailHref}>{resolveErpLabel("openDetail", locale)}</Link>
          </Button>
        )}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-4">
          <ErpDetailPanel
            title={selected.branchName}
            description={selected.status}
            fields={[
              { label: "Branch Code", value: selected.branchCode },
              { label: "Region", value: selected.region },
              { label: "Manager", value: selected.manager },
              { label: "Business Hours", value: selected.businessHours },
              { label: "Phone", value: selected.phone },
              { label: "Address", value: selected.address },
              { label: "Staff Today", value: selected.staffToday },
              { label: "Current Shift", value: selected.currentShift },
              { label: "Last Inspection", value: selected.lastInspection },
              { label: "Inventory Review", value: selected.inventoryReview },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{selected.branchName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  {[
                    ["overview", "Overview"],
                    ["health", copy.branchHealth],
                    ["operations", copy.todayOperations],
                    ["related", copy.relatedRecords],
                    ["tasks", resolveErpLabel("tasks", locale)],
                    ["activity", copy.activity],
                  ].map(([value, label]) => (
                    <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="overview" className="pt-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    <ErpStatusBadge tone="success">Operations: On Track</ErpStatusBadge>
                    <ErpStatusBadge tone="warning">Inventory: Warning</ErpStatusBadge>
                    <ErpStatusBadge tone="info">Sales: +12.6%</ErpStatusBadge>
                  </div>
                </TabsContent>
                <TabsContent value="health" className="pt-4 text-sm text-muted-foreground">Operations stable, staffing needs review, inventory below safety stock.</TabsContent>
                <TabsContent value="operations" className="pt-4 text-sm text-muted-foreground">Day and night shift transition is active. POS sync completed at 10:05.</TabsContent>
                <TabsContent value="related" className="pt-4 text-sm text-muted-foreground">Related records include inspection results, inventory alerts, and open branch tasks.</TabsContent>
                <TabsContent value="tasks" className="pt-4">
                  <ErpDataTable columns={taskColumns} data={erpBranchOpenTasks} density="compact" />
                </TabsContent>
                <TabsContent value="activity" className="pt-4 text-sm text-muted-foreground">Opening checklist submitted, inventory alert created, shift change approved.</TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.openTasks}</CardTitle>
              </CardHeader>
              <CardContent>
                <ErpDataTable columns={taskColumns} data={erpBranchOpenTasks} density="compact" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.inventoryAlerts}</CardTitle>
              </CardHeader>
              <CardContent>
                <ErpDataTable columns={inventoryColumns} data={erpBranchInventoryAlerts} density="compact" />
              </CardContent>
            </Card>
          </div>
        </div>

        <ErpRightRail
          sections={[
            { title: copy.topAlerts, items: ["3 overdue tasks need review", "2 inventory alerts below safety stock", "1 inspection item awaiting verification"] },
            { title: copy.recentActivity, items: ["10:15 Opening checklist submitted", "09:40 Stock alert created for fries", "09:10 Shift change approved"] },
          ]}
        />
      </div>

      <ErpActionDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        title={copy.addBranch}
        description="Create a branch record for operations setup."
        submitLabel={resolveErpLabel("save", locale)}
        cancelLabel={resolveErpLabel("cancel", locale)}
        onSubmit={() => setToast(copy.branchSaved)}
      >
        <div className="rounded-xl border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">Branch Name</div>
        <div className="rounded-xl border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">Region</div>
        <div className="rounded-xl border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">Manager</div>
      </ErpActionDrawer>

      <ErpActionDrawer
        open={taskOpen}
        onOpenChange={setTaskOpen}
        title={copy.createTask}
        description={`Branch: ${selected.branchName}`}
        submitLabel={resolveErpLabel("save", locale)}
        cancelLabel={resolveErpLabel("cancel", locale)}
        onSubmit={() => setToast(copy.taskSaved)}
      >
        <div className="rounded-xl border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">Task Title</div>
        <div className="rounded-xl border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">Owner</div>
      </ErpActionDrawer>

      <ErpConfirmDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={resolveErpLabel("export", locale)}
        description="Export the current branch operating view."
        confirmLabel={resolveErpLabel("export", locale)}
        cancelLabel={resolveErpLabel("cancel", locale)}
        onConfirm={() => setToast(copy.exportReady)}
      />
    </ErpShell>
  );
}
