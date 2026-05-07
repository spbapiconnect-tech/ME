"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  MeActionBar,
  MeDashboardShell,
  MeDataTable,
  MeInlineToast,
  MePageHeader,
  MeRightRail,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { MeBranchProfile } from "@/types/branch-context";

interface BranchWorkspacePageProps {
  branches: MeBranchProfile[];
}

const copy = {
  en: {
    eyebrow: "Branches",
    title: "Branch Management",
    description: "Manage branch operating status, performance, staffing, tasks, and alerts across all stores.",
    filters: "Filters",
    overview: "Selected Branch",
    overviewDesc: "Operating profile and current-day branch context.",
    openTasks: "Open Tasks",
    inventoryAlerts: "Inventory Alerts",
    pendingActions: "Pending Actions",
    recentActivity: "Recent Activity",
    branchHealth: "Branch Health",
    exportDone: "Branch report export completed.",
  },
  zh: {
    eyebrow: "门店",
    title: "门店管理",
    description: "统一管理各门店的营运状态、业绩、人员、任务与风险预警。",
    filters: "筛选条件",
    overview: "已选门店",
    overviewDesc: "当前门店的营运资料与当日上下文。",
    openTasks: "待处理任务",
    inventoryAlerts: "库存预警",
    pendingActions: "待处理事项",
    recentActivity: "最近动态",
    branchHealth: "门店健康",
    exportDone: "门店报表导出成功。",
  },
} as const;

const branchRows = {
  en: [
    ["KCH-001", "KCH Central Kitchen", "Kuching", "Chin Ling", "Operating", "RM 28,750", "5", "2", "94%", "10:15"],
    ["BTU-001", "BTU Outlet", "Bintulu", "Morexson", "Operating", "RM 18,420", "4", "1", "91%", "09:45"],
    ["KCH-002", "KCH Pickup Point", "Kuching", "Lydia", "Preparation", "RM 6,880", "2", "1", "88%", "08:30"],
    ["HQ-001", "Head Office", "HQ", "Admin", "Active", "-", "1", "0", "-", "Yesterday"],
  ],
  zh: [
    ["KCH-001", "KCH Central Kitchen", "古晋", "Chin Ling", "营业中", "RM 28,750", "5", "2", "94%", "10:15"],
    ["BTU-001", "BTU Outlet", "民都鲁", "Morexson", "营业中", "RM 18,420", "4", "1", "91%", "09:45"],
    ["KCH-002", "KCH Pickup Point", "古晋", "Lydia", "筹备中", "RM 6,880", "2", "1", "88%", "08:30"],
    ["HQ-001", "Head Office", "总部", "Admin", "启用", "-", "1", "0", "-", "昨天"],
  ],
} as const;

const branchDetail = [
  { code: "KCH-001", name: "KCH Central Kitchen", region: "Kuching", manager: "Chin Ling", hours: "10:00–00:00", phone: "082-000 123", address: "Kuching Central, Sarawak", staff: "18", shift: "Day / Night transition", inspection: "2026-05-06", inventory: "4 alerts" },
  { code: "BTU-001", name: "BTU Outlet", region: "Bintulu", manager: "Morexson", hours: "10:00–22:00", phone: "086-111 222", address: "Bintulu Times Square", staff: "12", shift: "Lunch / Dinner", inspection: "2026-05-06", inventory: "2 alerts" },
  { code: "KCH-002", name: "KCH Pickup Point", region: "Kuching", manager: "Lydia", hours: "11:00–21:30", phone: "082-222 333", address: "Kuching Pickup Hub", staff: "6", shift: "Preparation / Evening", inspection: "2026-05-05", inventory: "1 alert" },
  { code: "HQ-001", name: "Head Office", region: "HQ", manager: "Admin", hours: "09:00–18:00", phone: "082-999 000", address: "HQ Operations Center", staff: "9", shift: "Office Hours", inspection: "-", inventory: "0 alerts" },
] as const;

export function BranchWorkspacePage({ branches }: BranchWorkspacePageProps) {
  const locale = useUiPreferencesStore((state) => state.locale);
  const t = copy[locale];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selected = branchDetail[selectedIndex] ?? branchDetail[0];
  const tableColumns =
    locale === "zh"
      ? ["门店编号", "门店名称", "区域", "经理", "状态", "今日销售额", "待处理任务", "库存预警", "巡检", "最后更新"]
      : ["Branch Code", "Branch Name", "Region", "Manager", "Status", "Today Sales", "Open Tasks", "Stock Alerts", "Inspection", "Last Update"];

  const rows = useMemo(
    () =>
      branchRows[locale].map((row) => [
        row[0],
        row[1],
        row[2],
        row[3],
        row[4],
        row[5],
        row[6],
        row[7],
        row[8],
        row[9],
      ]),
    [locale],
  );

  void branches;

  return (
    <MeDashboardShell activeKey="branches">
      <MePageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        badges={[
          { label: locale === "zh" ? "所有门店" : "All Branches", variant: "secondary" },
          { label: locale === "zh" ? "当日营运" : "Daily Operations", variant: "outline" },
        ]}
        actions={
          <>
            <Button >{locale === "zh" ? "新增门店" : "Add Branch"}</Button>
            <Button  variant="outline" onClick={() => setToast(t.exportDone)}>
              {locale === "zh" ? "导出" : "Export"}
            </Button>
            <Button asChild  variant="outline">
              <Link href={`/reports?branch=${selected.code}`}>{locale === "zh" ? "查看报表" : "View Reports"}</Link>
            </Button>
          </>
        }
        meta={[
          { label: locale === "zh" ? "总门店" : "Total Branches", value: "8" },
          { label: locale === "zh" ? "营业门店" : "Open Stores", value: "7 / 8" },
          { label: locale === "zh" ? "今日销售额" : "Today Sales", value: "RM 28,750" },
          { label: locale === "zh" ? "严重异常" : "Critical Issues", value: "3" },
        ]}
      />

      {toast ? <MeInlineToast message={toast} /> : null}

      <MeActionBar
        actions={[
          { label: locale === "zh" ? "新增门店" : "Add Branch", onClick: () => setToast(locale === "zh" ? "门店表单已打开。" : "Branch form opened."), variant: "default" },
          { label: locale === "zh" ? "导出" : "Export", onClick: () => setToast(t.exportDone), variant: "outline" },
          { label: locale === "zh" ? "打开任务" : "Open Tasks", href: `/tasks?branch=${selected.code}`, variant: "secondary" },
          { label: locale === "zh" ? "库存预警" : "Inventory Alerts", href: `/psi/inventory?branch=${selected.code}&status=alert`, variant: "outline" },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {[
          [locale === "zh" ? "总门店" : "Total Branches", "8"],
          [locale === "zh" ? "营业门店" : "Open Stores", "7 / 8"],
          [locale === "zh" ? "今日销售额" : "Today Sales", "RM 28,750"],
          [locale === "zh" ? "待处理任务" : "Open Tasks", "12"],
          [locale === "zh" ? "库存预警" : "Stock Alerts", "4"],
          [locale === "zh" ? "当班员工" : "Staff On Duty", "18"],
          [locale === "zh" ? "巡检得分" : "Inspection Score", "92%"],
          [locale === "zh" ? "严重异常" : "Critical Issues", "3"],
        ].map(([label, value]) => (
          <Card key={label} >
            <CardContent className="pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
              <p className="mt-2 text-[1.55rem] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <MeWorkspaceSection title={t.filters} description={locale === "zh" ? "按门店、区域与状态筛选当前列表。" : "Filter the branch list by name, region, manager, and status."}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            locale === "zh" ? "搜索门店名称 / 编号 / 经理" : "Search branch name / code / manager",
            locale === "zh" ? "所有门店" : "All Branches",
            locale === "zh" ? "所有区域" : "All Regions",
            locale === "zh" ? "所有状态" : "All Status",
            locale === "zh" ? "更多筛选" : "More Filters",
          ].map((item) => (
            <div key={item} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              {item}
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title={locale === "zh" ? "门店列表" : "Branch List"} description={locale === "zh" ? "先展示完整列表，再查看已选门店详情。" : "Full-width branch table first, followed by the selected branch detail."}>
        <MeDataTable embedded columns={tableColumns} rows={rows} selectableRows selectedRowIndex={selectedIndex} onRowSelect={setSelectedIndex} />
      </MeWorkspaceSection>

      <MeTabs
        style="detail"
        tabs={[
          { label: locale === "zh" ? "概览" : "Overview", active: true },
          { label: locale === "zh" ? "运营" : "Operations" },
          { label: locale === "zh" ? "员工" : "Staff" },
          { label: locale === "zh" ? "库存" : "Inventory" },
          { label: locale === "zh" ? "任务" : "Tasks" },
          { label: locale === "zh" ? "动态" : "Activity" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-4">
          <MeWorkspaceSection title={`${t.overview}: ${selected.name}`} description={t.overviewDesc}>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                [locale === "zh" ? "门店编号" : "Branch Code", selected.code],
                [locale === "zh" ? "区域" : "Region", selected.region],
                [locale === "zh" ? "经理" : "Manager", selected.manager],
                [locale === "zh" ? "营业时间" : "Business Hours", selected.hours],
                [locale === "zh" ? "电话" : "Phone", selected.phone],
                [locale === "zh" ? "地址" : "Address", selected.address],
                [locale === "zh" ? "今日员工" : "Staff Today", selected.staff],
                [locale === "zh" ? "当前班次" : "Current Shift", selected.shift],
                [locale === "zh" ? "最近巡检" : "Last Inspection", selected.inspection],
                [locale === "zh" ? "库存复核" : "Inventory Review", selected.inventory],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-slate-100/90 pb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
                </div>
              ))}
            </div>
          </MeWorkspaceSection>

          <div className="grid gap-4 xl:grid-cols-2">
            <MeWorkspaceSection title={t.openTasks} description={locale === "zh" ? "当前门店的高优先级待办。" : "Highest-priority branch work awaiting completion."}>
              <MeDataTable
                embedded
                columns={locale === "zh" ? ["任务", "负责人", "截止时间", "状态"] : ["Task", "Owner", "Due", "Status"]}
                rows={
                  locale === "zh"
                    ? [
                        ["核对开店检查表", "Chin Ling", "今天 11:00", "逾期"],
                        ["复核低库存预警", "Warehouse Lead", "今天 14:00", "处理中"],
                        ["确认供应商差异", "Purchasing", "今天 16:30", "待审核"],
                      ]
                    : [
                        ["Verify opening checklist", "Chin Ling", "Today 11:00", "Overdue"],
                        ["Review low stock alert", "Warehouse Lead", "Today 14:00", "In Progress"],
                        ["Approve supplier delivery variance", "Purchasing", "Today 16:30", "Awaiting Review"],
                      ]
                }
              />
            </MeWorkspaceSection>

            <MeWorkspaceSection title={t.inventoryAlerts} description={locale === "zh" ? "当前门店的库存关注项。" : "Current inventory exceptions tied to the selected branch."}>
              <MeDataTable
                embedded
                columns={locale === "zh" ? ["品项", "位置", "现有库存", "状态"] : ["Item", "Location", "On Hand", "Status"]}
                rows={
                  locale === "zh"
                    ? [
                        ["Coated Fries", "Freezer", "42 bags", "预警"],
                        ["Chicken Broth Base", "Cold Room", "18 packs", "关注"],
                        ["Packaging Set", "Dry Store", "25 sets", "正常"],
                      ]
                    : [
                        ["Coated Fries", "Freezer", "42 bags", "Warning"],
                        ["Chicken Broth Base", "Cold Room", "18 packs", "Attention"],
                        ["Packaging Set", "Dry Store", "25 sets", "Normal"],
                      ]
                }
              />
            </MeWorkspaceSection>
          </div>
        </div>

        <MeRightRail
          sticky={false}
          sections={[
            {
              title: t.pendingActions,
              items: locale === "zh"
                ? ["3 个逾期任务待复核", "2 条库存低于安全库存", "1 个巡检项目待确认", "1 条供应商送货延迟"]
                : ["3 overdue tasks need review", "2 inventory alerts below safety stock", "1 inspection item awaiting verification", "1 supplier delivery delay"],
            },
            {
              title: t.recentActivity,
              items: locale === "zh"
                ? ["10:15 Zhang 已提交开店检查表", "09:40 薯条库存预警已创建", "09:10 Chin Ling 已批准换班", "昨天 POS 报表同步成功"]
                : ["10:15 Zhang submitted opening checklist", "09:40 Inventory alert created for fries stock", "09:10 Chin Ling approved staff shift change", "Yesterday POS report synced successfully"],
            },
            {
              title: t.branchHealth,
              items: locale === "zh"
                ? ["运营：正常", "人员：需关注", "库存：预警", "巡检：通过", "销售：较昨天 +12.6%"]
                : ["Operations: On Track", "Staffing: Attention", "Inventory: Warning", "Inspection: Passed", "Sales: +12.6% vs yesterday"],
            },
          ]}
        />
      </div>
    </MeDashboardShell>
  );
}
