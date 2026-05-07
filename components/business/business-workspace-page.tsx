"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  MeActionBar,
  MeDashboardShell,
  MeDataTable,
  MeInlineToast,
  MePageHeader,
  MeRightRail,
  MeWorkspaceSection,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { BusinessWorkspacePageData } from "@/types/business-workspace";

interface BusinessWorkspacePageProps {
  data: BusinessWorkspacePageData;
}

const dashboardCopy = {
  en: {
    eyebrow: "Dashboard",
    title: "Operations Dashboard",
    description: "Monitor branch performance, urgent tasks, stock alerts, staffing, and daily operations across all stores.",
    branchPerformance: "Branch Performance",
    branchPerformanceDesc: "Daily performance snapshot across current operating branches.",
    workQueue: "Work Queue",
    workQueueDesc: "Priority follow-up items requiring action during the current operating window.",
    pendingActions: "Pending Actions",
    recentActivity: "Recent Activity",
    systemHealth: "System Health",
    exportDone: "Report export completed successfully.",
  },
  zh: {
    eyebrow: "工作台",
    title: "营运工作台",
    description: "集中查看门店表现、紧急任务、库存预警、人员配置与每日营运状态。",
    branchPerformance: "门店表现",
    branchPerformanceDesc: "当前营业门店的当日营运快照。",
    workQueue: "待办队列",
    workQueueDesc: "当前营运时段需要优先处理的事项。",
    pendingActions: "待处理事项",
    recentActivity: "最近动态",
    systemHealth: "系统健康",
    exportDone: "报表导出成功。",
  },
} as const;

const kpis = {
  en: [
    ["Today Sales", "RM 28,750"],
    ["Open Stores", "7 / 8"],
    ["Open Tasks", "12"],
    ["Critical Issues", "3"],
    ["Stock Alerts", "4"],
    ["Staff On Duty", "18"],
    ["Inspection Score", "92%"],
    ["POS Sync", "Healthy"],
  ],
  zh: [
    ["今日销售额", "RM 28,750"],
    ["营业门店", "7 / 8"],
    ["待处理任务", "12"],
    ["严重异常", "3"],
    ["库存预警", "4"],
    ["当班员工", "18"],
    ["巡检得分", "92%"],
    ["POS 同步", "正常"],
  ],
} as const;

const branchTable = {
  en: {
    columns: ["Branch", "Status", "Today Sales", "Open Tasks", "Stock Alerts", "Staff On Duty", "Inspection", "Last Update"],
    rows: [
      ["KCH Central Kitchen", "Operating", "RM 28,750", "5", "2", "18", "94%", "10:15"],
      ["BTU Outlet", "Operating", "RM 18,420", "4", "1", "12", "91%", "09:45"],
      ["KCH Pickup Point", "Preparation", "RM 6,880", "2", "1", "6", "88%", "08:30"],
    ],
  },
  zh: {
    columns: ["门店", "状态", "今日销售额", "待处理任务", "库存预警", "当班员工", "巡检", "最后更新"],
    rows: [
      ["KCH Central Kitchen", "营业中", "RM 28,750", "5", "2", "18", "94%", "10:15"],
      ["BTU Outlet", "营业中", "RM 18,420", "4", "1", "12", "91%", "09:45"],
      ["KCH Pickup Point", "筹备中", "RM 6,880", "2", "1", "6", "88%", "08:30"],
    ],
  },
} as const;

const workQueue = {
  en: [
    "Verify opening checklist",
    "Review low stock alert",
    "Approve supplier delivery variance",
    "Confirm staff shift change",
  ],
  zh: ["确认开店检查表", "处理低库存预警", "审批供应商收货差异", "确认员工换班"],
} as const;

const railContent = {
  en: {
    pending: [
      "3 overdue tasks need review",
      "2 inventory alerts below safety stock",
      "1 inspection item awaiting verification",
      "1 supplier delivery delay",
    ],
    activity: [
      "10:15 Opening checklist submitted",
      "09:40 Stock alert created for fries",
      "09:10 Shift change approved",
      "Yesterday POS report synced",
    ],
    health: [
      "POS Sync: Healthy",
      "Printer Bridge: Online",
      "Inventory Update: Attention",
      "Report Export: Normal",
    ],
  },
  zh: {
    pending: ["3 个逾期任务待复核", "2 条库存低于安全库存", "1 个巡检项目待确认", "1 条供应商送货延迟"],
    activity: ["10:15 已提交开店检查表", "09:40 薯条库存预警已创建", "09:10 已批准换班", "昨天 POS 报表已同步"],
    health: ["POS 同步：正常", "打印桥接：在线", "库存更新：需关注", "报表导出：正常"],
  },
} as const;

export function BusinessWorkspacePage({ data }: BusinessWorkspacePageProps) {
  const locale = useUiPreferencesStore((state) => state.locale);
  const copy = dashboardCopy[locale];
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <MeDashboardShell
      activeKey="dashboard"
      rightRail={
        <MeRightRail
          sections={[
            { title: copy.pendingActions, items: [...railContent[locale].pending] },
            { title: copy.recentActivity, items: [...railContent[locale].activity] },
            { title: copy.systemHealth, items: [...railContent[locale].health] },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        badges={[
          { label: locale === "zh" ? "全部门店" : "All Stores", variant: "secondary" },
          { label: locale === "zh" ? "今日营运" : "Today’s Operations", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/branches">{locale === "zh" ? "查看门店" : "View Branches"}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/tasks?status=open">{locale === "zh" ? "打开任务" : "Open Tasks"}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/issues?severity=critical">{locale === "zh" ? "查看预警" : "Review Alerts"}</Link>
            </Button>
          </>
        }
        meta={[
          { label: locale === "zh" ? "门店范围" : "Branch Scope", value: locale === "zh" ? "全部门店" : "All Stores" },
          { label: locale === "zh" ? "统计周期" : "Window", value: locale === "zh" ? "今天" : "Today" },
          { label: locale === "zh" ? "值班经理" : "Duty Lead", value: "Chin Ling" },
          { label: locale === "zh" ? "更新时间" : "Updated", value: data.generatedAt },
        ]}
      />

      {toast ? <MeInlineToast message={toast} /> : null}

      <MeActionBar
        actions={[
          { label: locale === "zh" ? "查看门店" : "View Branches", href: "/branches", variant: "default" },
          { label: locale === "zh" ? "打开任务" : "Open Tasks", href: "/tasks?status=open", variant: "secondary" },
          { label: locale === "zh" ? "查看预警" : "Review Alerts", href: "/issues?severity=critical", variant: "outline" },
          { label: locale === "zh" ? "导出报表" : "Export Report", variant: "outline", onClick: () => setToast(copy.exportDone) },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {kpis[locale].map(([label, value]) => (
          <Card key={label} size="sm" className="border-border bg-[var(--surface-strong)] shadow-[0_1px_2px_var(--shadow-color)]">
            <CardContent className="pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
              <p className="mt-2 text-[1.55rem] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <MeWorkspaceSection title={copy.branchPerformance} description={copy.branchPerformanceDesc}>
        <MeDataTable embedded columns={[...branchTable[locale].columns]} rows={branchTable[locale].rows.map((row) => [...row])} />
      </MeWorkspaceSection>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <MeWorkspaceSection title={copy.workQueue} description={copy.workQueueDesc}>
          <div className="grid gap-2">
            {workQueue[locale].map((item) => (
              <div key={item} className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                {item}
              </div>
            ))}
          </div>
        </MeWorkspaceSection>

        <MeWorkspaceSection title={locale === "zh" ? "快捷操作" : "Quick Actions"} description={locale === "zh" ? "跨模块营运入口。" : "Cross-module operational entry points."}>
          <div className="grid gap-2">
            <Link href="/branches" className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface)]">
              {locale === "zh" ? "门店管理" : "Branch Management"}
            </Link>
            <Link href="/psi/inventory?status=alert" className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface)]">
              {locale === "zh" ? "库存预警" : "Inventory Alerts"}
            </Link>
            <Link href="/reports" className="rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface)]">
              {locale === "zh" ? "报表中心" : "Report Center"}
            </Link>
          </div>
        </MeWorkspaceSection>
      </div>
    </MeDashboardShell>
  );
}
