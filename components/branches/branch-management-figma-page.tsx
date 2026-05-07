"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Building2, CircleAlert, ClipboardList, PackageSearch, Search, Users } from "lucide-react";

import { MeDashboardShell, MeInlineToast, MePageHeader, MeTabs } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUiPreferencesStore } from "@/stores/ui-preferences";

type Locale = "en" | "zh";
type BranchTab = "Overview" | "Operations" | "Staff" | "Inventory" | "Tasks" | "Activity";

const copy = {
  en: {
    eyebrow: "Branches",
    title: "Branch Management",
    description: "Manage branch operating status, performance, staffing, tasks, and alerts across all stores.",
    addBranch: "Add Branch",
    export: "Export",
    viewReports: "View Reports",
    openTasks: "Open Tasks",
    branchPerformance: "Branch Directory",
    branchPerformanceDesc: "Monitor branch operating status, sales, staffing, and alerts from one operational workspace.",
    filters: "Search branch name / code / manager",
    allBranches: "All Branches",
    allRegions: "All Regions",
    allStatus: "All Status",
    moreFilters: "More Filters",
    pendingActions: "Pending Actions",
    recentActivity: "Recent Activity",
    branchHealth: "Branch Health",
    openTasksTable: "Open Tasks",
    inventoryAlerts: "Inventory Alerts",
    addBranchTitle: "Create Branch Record",
    addBranchDesc: "Prepare a new branch profile for opening, staffing, and operations planning.",
    save: "Save",
    cancel: "Cancel",
    branchCreated: "Branch setup captured successfully.",
    exportDone: "Branch performance report exported.",
  },
  zh: {
    eyebrow: "门店",
    title: "门店管理",
    description: "管理所有门店的营运状态、业绩、人员、任务与风险预警。",
    addBranch: "新增门店",
    export: "导出",
    viewReports: "查看报表",
    openTasks: "打开任务",
    branchPerformance: "门店总览",
    branchPerformanceDesc: "在同一个营运工作区查看门店状态、销售、人员与风险提醒。",
    filters: "搜索门店名称 / 编号 / 经理",
    allBranches: "所有门店",
    allRegions: "所有区域",
    allStatus: "所有状态",
    moreFilters: "更多筛选",
    pendingActions: "待处理事项",
    recentActivity: "最近动态",
    branchHealth: "门店健康",
    openTasksTable: "待处理任务",
    inventoryAlerts: "库存预警",
    addBranchTitle: "新建门店档案",
    addBranchDesc: "为新门店建立开业、排班与营运配置基础资料。",
    save: "保存",
    cancel: "取消",
    branchCreated: "门店资料已记录。",
    exportDone: "门店绩效报表已导出。",
  },
} as const;

const branchRows = [
  {
    code: "KCH-001",
    name: "KCH Central Kitchen",
    region: "Kuching",
    manager: "Chin Ling",
    status: "Operating",
    sales: "RM 28,750",
    openTasks: "5",
    stockAlerts: "2",
    inspection: "94%",
    lastUpdate: "10:15",
    hours: "10:00–00:00",
    phone: "082-000 123",
    address: "Kuching Central, Sarawak",
    staffToday: "18",
    shift: "Day / Night transition",
    lastInspection: "2026-05-06",
    inventoryReview: "4 alerts",
  },
  {
    code: "BTU-001",
    name: "BTU Outlet",
    region: "Bintulu",
    manager: "Morexson",
    status: "Operating",
    sales: "RM 18,420",
    openTasks: "4",
    stockAlerts: "1",
    inspection: "91%",
    lastUpdate: "09:45",
    hours: "10:00–22:00",
    phone: "086-111 222",
    address: "Bintulu Times Square",
    staffToday: "12",
    shift: "Lunch / Dinner",
    lastInspection: "2026-05-06",
    inventoryReview: "2 alerts",
  },
  {
    code: "KCH-002",
    name: "KCH Pickup Point",
    region: "Kuching",
    manager: "Lydia",
    status: "Preparation",
    sales: "RM 6,880",
    openTasks: "2",
    stockAlerts: "1",
    inspection: "88%",
    lastUpdate: "08:30",
    hours: "11:00–21:30",
    phone: "082-222 333",
    address: "Kuching Pickup Hub",
    staffToday: "6",
    shift: "Preparation / Evening",
    lastInspection: "2026-05-05",
    inventoryReview: "1 alert",
  },
  {
    code: "HQ-001",
    name: "Head Office",
    region: "HQ",
    manager: "Admin",
    status: "Active",
    sales: "-",
    openTasks: "1",
    stockAlerts: "0",
    inspection: "-",
    lastUpdate: "Yesterday",
    hours: "09:00–18:00",
    phone: "082-999 000",
    address: "HQ Operations Center",
    staffToday: "9",
    shift: "Office Hours",
    lastInspection: "-",
    inventoryReview: "0 alerts",
  },
] as const;

const openTasksRows = {
  en: [
    ["TSK-2301", "Opening checklist", "Zhang", "Today 11:00", "In Progress"],
    ["TSK-2298", "Fridge temp check", "Chin Ling", "Today 14:00", "Pending"],
    ["TSK-2285", "Shift handover", "Lydia", "Overdue", "Overdue"],
  ],
  zh: [
    ["TSK-2301", "开店检查表", "Zhang", "今天 11:00", "处理中"],
    ["TSK-2298", "冰箱温度检查", "Chin Ling", "今天 14:00", "待处理"],
    ["TSK-2285", "班次交接", "Lydia", "已逾期", "已逾期"],
  ],
} as const;

const inventoryAlertRows = {
  en: [
    ["French Fries", "KCH Central Kitchen", "8 kg", "15 kg", "Low Stock"],
    ["Tomato Sauce", "KCH Central Kitchen", "3 bottles", "10 bottles", "Critical"],
    ["Chicken Wings", "BTU Outlet", "12 kg", "20 kg", "Low Stock"],
    ["Burger Buns", "KCH Pickup Point", "15 pcs", "50 pcs", "Low Stock"],
  ],
  zh: [
    ["French Fries", "KCH Central Kitchen", "8 kg", "15 kg", "低库存"],
    ["Tomato Sauce", "KCH Central Kitchen", "3 bottles", "10 bottles", "严重"],
    ["Chicken Wings", "BTU Outlet", "12 kg", "20 kg", "低库存"],
    ["Burger Buns", "KCH Pickup Point", "15 pcs", "50 pcs", "低库存"],
  ],
} as const;

const rightRail = {
  en: {
    pending: [
      "3 overdue tasks need review",
      "2 inventory alerts below safety stock",
      "1 inspection item awaiting verification",
      "1 supplier delivery delay",
    ],
    activity: [
      "10:15 Zhang submitted opening checklist",
      "09:40 Inventory alert created for fries stock",
      "09:10 Chin Ling approved staff shift change",
      "Yesterday POS report synced successfully",
    ],
    health: [
      "Operations: On Track",
      "Staffing: Attention",
      "Inventory: Warning",
      "Inspection: Passed",
      "Sales: +12.6% vs yesterday",
    ],
  },
  zh: {
    pending: [
      "3 个逾期任务待复核",
      "2 条库存低于安全库存",
      "1 个巡检项目待确认",
      "1 条供应商送货延迟",
    ],
    activity: [
      "10:15 Zhang 已提交开店检查表",
      "09:40 已创建薯条库存预警",
      "09:10 Chin Ling 已批准换班",
      "昨天 POS 报表同步成功",
    ],
    health: [
      "运营：正常",
      "人员：需关注",
      "库存：预警",
      "巡检：通过",
      "销售：较昨日 +12.6%",
    ],
  },
} as const;

function statusTone(status: string) {
  if (["Operating", "Active", "正常", "营业中", "启用", "Passed"].includes(status)) return "emerald";
  if (["Preparation", "Pending", "待处理", "处理中", "Low Stock", "低库存"].includes(status)) return "amber";
  if (["Critical", "Overdue", "严重", "已逾期"].includes(status)) return "rose";
  return "slate";
}

function StatusPill({ value }: { value: string }) {
  const tone = statusTone(value);
  const toneClass = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
  }[tone];

  return <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${toneClass}`}>{value}</span>;
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <Card size="sm" className="gap-2">
      <CardContent className="flex items-start justify-between pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
          <p className="mt-2 text-[1.35rem] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{value}</p>
        </div>
        <div className="rounded-lg border border-border bg-[var(--surface-soft)] p-2 text-[var(--text-secondary)]">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BranchManagementFigmaPage() {
  const locale = useUiPreferencesStore((state) => state.locale) as Locale;
  const t = copy[locale];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<BranchTab>("Overview");
  const [toast, setToast] = useState<string | null>(null);
  const [addBranchOpen, setAddBranchOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selected = branchRows[selectedIndex] ?? branchRows[0];

  const tabs = useMemo(
    () => [
      { en: "Overview", zh: "概览" },
      { en: "Operations", zh: "运营" },
      { en: "Staff", zh: "员工" },
      { en: "Inventory", zh: "库存" },
      { en: "Tasks", zh: "任务" },
      { en: "Activity", zh: "动态" },
    ],
    [],
  );

  const detailFields = [
    [locale === "zh" ? "门店编号" : "Branch Code", selected.code],
    [locale === "zh" ? "区域" : "Region", selected.region],
    [locale === "zh" ? "经理" : "Manager", selected.manager],
    [locale === "zh" ? "营业时间" : "Business Hours", selected.hours],
    [locale === "zh" ? "电话" : "Phone", selected.phone],
    [locale === "zh" ? "地址" : "Address", selected.address],
    [locale === "zh" ? "今日员工" : "Staff Today", selected.staffToday],
    [locale === "zh" ? "当前班次" : "Current Shift", selected.shift],
    [locale === "zh" ? "最近巡检" : "Last Inspection", selected.lastInspection],
    [locale === "zh" ? "库存复核" : "Inventory Review", selected.inventoryReview],
  ];

  return (
    <MeDashboardShell activeKey="branches" contentClassName="gap-4">
      <MePageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        actions={
          <>
            <Button size="sm" onClick={() => setAddBranchOpen(true)}>{t.addBranch}</Button>
            <Button size="sm" variant="outline" onClick={() => setToast(t.exportDone)}>{t.export}</Button>
            <Button asChild size="sm" variant="outline"><Link href="/reports">{t.viewReports}</Link></Button>
            <Button asChild size="sm" variant="secondary"><Link href="/tasks">{t.openTasks}</Link></Button>
          </>
        }
      />

      {toast ? <MeInlineToast message={toast} /> : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        <MetricCard icon={Building2} label={locale === "zh" ? "总门店" : "Total Branches"} value="8" />
        <MetricCard icon={Building2} label={locale === "zh" ? "营业门店" : "Open Stores"} value="7 / 8" />
        <MetricCard icon={ArrowUpRight} label={locale === "zh" ? "今日销售额" : "Today Sales"} value="RM 28,750" />
        <MetricCard icon={ClipboardList} label={locale === "zh" ? "待处理任务" : "Open Tasks"} value="12" />
        <MetricCard icon={PackageSearch} label={locale === "zh" ? "库存预警" : "Stock Alerts"} value="4" />
        <MetricCard icon={Users} label={locale === "zh" ? "当班员工" : "Staff On Duty"} value="18" />
        <MetricCard icon={ClipboardList} label={locale === "zh" ? "巡检得分" : "Inspection Score"} value="92%" />
        <MetricCard icon={CircleAlert} label={locale === "zh" ? "严重异常" : "Critical Issues"} value="3" />
      </section>

      <Card size="sm">
        <CardContent className="pt-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.75fr))]">
            <label className="flex items-center gap-2 rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--text-secondary)]">
              <Search className="size-4 text-[var(--text-muted)]" />
              <input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--text-muted)]" placeholder={t.filters} />
            </label>
            {[t.allBranches, t.allRegions, t.allStatus, t.moreFilters].map((item) => (
              <button key={item} type="button" className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-3 py-2 text-left text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]">
                {item}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="border-b border-slate-200/80">
          <CardTitle className="text-[15px]">{t.branchPerformance}</CardTitle>
          <p className="text-sm text-[var(--text-secondary)]">{t.branchPerformanceDesc}</p>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-2">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="bg-slate-50/85">
                {(locale === "zh"
                  ? ["门店编号", "门店名称", "区域", "经理", "状态", "今日销售额", "待处理任务", "库存预警", "巡检", "最后更新"]
                  : ["Branch Code", "Branch Name", "Region", "Manager", "Status", "Today Sales", "Open Tasks", "Stock Alerts", "Inspection", "Last Update"]
                ).map((column) => (
                  <th key={column} className="border-b border-slate-200/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branchRows.map((row, index) => (
                <tr
                  key={row.code}
                  onClick={() => setSelectedIndex(index)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${selectedIndex === index ? "bg-blue-50/55" : "bg-transparent"}`}
                >
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] font-semibold text-blue-700">{row.code}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] font-medium text-[var(--text-primary)]">{row.name}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{locale === "zh" && row.region === "Kuching" ? "古晋" : locale === "zh" && row.region === "Bintulu" ? "民都鲁" : row.region === "HQ" && locale === "zh" ? "总部" : row.region}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row.manager}</td>
                  <td className="border-b border-slate-100 px-3 py-3"><StatusPill value={locale === "zh" ? (row.status === "Operating" ? "营业中" : row.status === "Preparation" ? "筹备中" : "启用") : row.status} /></td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] font-medium text-[var(--text-primary)]">{row.sales}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row.openTasks}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row.stockAlerts}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row.inspection}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{locale === "zh" && row.lastUpdate === "Yesterday" ? "昨天" : row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
        <div className="grid gap-4">
          <Card size="sm">
            <CardHeader className="border-b border-slate-200/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-[15px]">{selected.name}</CardTitle>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{locale === "zh" ? "门店营运详情与当前值班信息。" : "Current branch operations detail and daily operating context."}</p>
                </div>
                <Badge variant="outline">{selected.code}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4">
              <MeTabs
                style="detail"
                tabs={tabs.map((tab) => ({ label: locale === "zh" ? tab.zh : tab.en, active: activeTab === tab.en }))}
                onTabChange={(label) => {
                  const matched = tabs.find((tab) => tab.en === label || tab.zh === label);
                  setActiveTab((matched?.en as BranchTab | undefined) ?? "Overview");
                }}
              />

              {activeTab === "Overview" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {detailFields.map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100 pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === "Operations" ? (
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    [locale === "zh" ? "营业状态" : "Operating State", locale === "zh" ? "稳定运行" : "Stable service window"],
                    [locale === "zh" ? "收银同步" : "POS Sync", locale === "zh" ? "最后同步 10:05" : "Last synced 10:05"],
                    [locale === "zh" ? "值班覆盖" : "Shift Coverage", locale === "zh" ? "日夜班交接中" : "Day to night transition"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === "Staff" ? (
                <div className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  {(locale === "zh"
                    ? ["值班经理：Chin Ling", "厨房班组：10 人", "前台与出餐：6 人", "支援与行政：2 人"]
                    : ["Duty manager: Chin Ling", "Kitchen crew: 10 staff", "Front counter and dispatch: 6 staff", "Support and admin: 2 staff"]
                  ).map((item) => (
                    <div key={item} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3">{item}</div>
                  ))}
                </div>
              ) : null}

              {activeTab === "Inventory" ? (
                <div className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  {(locale === "zh"
                    ? ["冷冻库：2 条低库存", "干货仓：包装材料补货中", "今日收货：1 批待确认"]
                    : ["Freezer: 2 low-stock items", "Dry store: packaging replenishment in progress", "Receiving today: 1 batch awaiting confirmation"]
                  ).map((item) => (
                    <div key={item} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3">{item}</div>
                  ))}
                </div>
              ) : null}

              {activeTab === "Tasks" ? (
                <div className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  {(locale === "zh"
                    ? ["5 个任务进行中", "1 个任务已逾期", "2 个任务等待经理复核"]
                    : ["5 tasks in progress", "1 task overdue", "2 tasks waiting for manager review"]
                  ).map((item) => (
                    <div key={item} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3">{item}</div>
                  ))}
                </div>
              ) : null}

              {activeTab === "Activity" ? (
                <div className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  {rightRail[locale].activity.map((item) => (
                    <div key={item} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3">{item}</div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card size="sm">
              <CardHeader className="border-b border-slate-200/80">
                <CardTitle className="text-[15px]">{t.openTasksTable}</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto pt-2">
                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/85">
                      {(locale === "zh" ? ["任务编号", "任务", "负责人", "截止时间", "状态"] : ["Task ID", "Task", "Owner", "Due", "Status"]).map((column) => (
                        <th key={column} className="border-b border-slate-200/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {openTasksRows[locale].map((row) => (
                      <tr key={row[0]} className="hover:bg-slate-50/80">
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] font-semibold text-blue-700">{row[0]}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-primary)]">{row[1]}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[2]}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[3]}</td>
                        <td className="border-b border-slate-100 px-3 py-3"><StatusPill value={row[4]} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader className="border-b border-slate-200/80">
                <CardTitle className="text-[15px]">{t.inventoryAlerts}</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto pt-2">
                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/85">
                      {(locale === "zh" ? ["品项", "门店", "现有库存", "安全库存", "状态"] : ["Item", "Branch", "On Hand", "Safety Stock", "Status"]).map((column) => (
                        <th key={column} className="border-b border-slate-200/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryAlertRows[locale].map((row) => (
                      <tr key={`${row[0]}-${row[1]}`} className="hover:bg-slate-50/80">
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-primary)]">{row[0]}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[1]}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[2]}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[3]}</td>
                        <td className="border-b border-slate-100 px-3 py-3"><StatusPill value={row[4]} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { title: t.pendingActions, items: [...rightRail[locale].pending] },
            { title: t.recentActivity, items: [...rightRail[locale].activity] },
            { title: t.branchHealth, items: [...rightRail[locale].health] },
          ].map(({ title, items }) => (
            <Card key={title as string} size="sm">
              <CardHeader className="border-b border-slate-200/80">
                <CardTitle className="text-[15px]">{title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 pt-4 text-sm text-[var(--text-secondary)]">
                {items.map((item) => (
                  <div key={item} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3">{item}</div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={addBranchOpen} onOpenChange={setAddBranchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addBranchTitle}</DialogTitle>
            <DialogDescription>{t.addBranchDesc}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {(locale === "zh"
              ? ["门店名称", "区域", "负责人", "联系电话"]
              : ["Branch Name", "Region", "Manager", "Contact Number"]
            ).map((field) => (
              <div key={field} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-secondary)]">{field}</div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBranchOpen(false)}>{t.cancel}</Button>
            <Button onClick={() => { setAddBranchOpen(false); setToast(t.branchCreated); }}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MeDashboardShell>
  );
}
