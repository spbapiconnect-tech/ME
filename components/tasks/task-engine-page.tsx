"use client";

import Link from "next/link";
import { Layers3, LayoutDashboard, PanelTopClose, Workflow } from "lucide-react";
import { useEffect } from "react";

import { moduleRegistry } from "@/config/modules";
import { EmptyState } from "@/components/data/empty-state";
import { MockDataNotice } from "@/components/demo/mock-data-notice";
import { FilterBar } from "@/components/data/filter-bar";
import { StatusChip } from "@/components/data/status-chip";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale, ThemeMode } from "@/types/module";
import type { TaskRecord, TaskSourceSummaryItem, TaskStats } from "@/types/task";

import { TaskActionBar } from "@/components/tasks/task-action-bar";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskList } from "@/components/tasks/task-list";
import { TaskStatsRow } from "@/components/tasks/task-stats-row";

const copy = {
  en: {
    modules: "Open Module Center",
    dashboard: "Back To Dashboard",
    demo: "Open Demo Workspace",
    layoutEngine: "Layout Engine",
    summary: "Close-loop layer between data and action",
  },
  zh: {
    modules: "打开模块中心",
    dashboard: "返回 Dashboard",
    demo: "打开 Demo Workspace",
    layoutEngine: "布局引擎",
    summary: "连接数据与动作的闭环层",
  },
} as const;

function buildTaskStats(tasks: TaskRecord[]): TaskStats {
  const stats: TaskStats = {
    total: tasks.length,
    overdue: 0,
    inProgress: 0,
    review: 0,
    blocked: 0,
    done: 0,
    byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
    byStatus: { todo: 0, "in-progress": 0, review: 0, blocked: 0, done: 0, rejected: 0, overdue: 0 },
  };

  for (const task of tasks) {
    stats.byPriority[task.priority] += 1;
    stats.byStatus[task.status] += 1;

    if (task.status === "overdue") stats.overdue += 1;
    if (task.status === "in-progress") stats.inProgress += 1;
    if (task.status === "review") stats.review += 1;
    if (task.status === "blocked") stats.blocked += 1;
    if (task.status === "done") stats.done += 1;
  }

  return stats;
}

function buildTaskSourceSummary(tasks: TaskRecord[]): TaskSourceSummaryItem[] {
  return moduleRegistry
    .filter((moduleItem) => ["procurement", "supplier", "inventory", "pos-report", "education", "task"].includes(moduleItem.code))
    .map((moduleItem) => {
      const sourceTasks = tasks.filter((task) => task.sourceModule === moduleItem.code);

      return {
        moduleCode: moduleItem.code as TaskRecord["sourceModule"],
        total: sourceTasks.length,
        overdue: sourceTasks.filter((task) => task.status === "overdue").length,
        review: sourceTasks.filter((task) => task.status === "review").length,
        route: moduleItem.code === "task" ? "/tasks" : `/demo/${moduleItem.code}`,
      };
    })
    .filter((item) => item.total > 0)
    .sort((left, right) => right.total - left.total);
}

interface TaskEnginePageProps {
  tasks: TaskRecord[];
  dataError?: string;
}

export function TaskEnginePage({ tasks, dataError }: TaskEnginePageProps) {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";
  const currentTheme: ThemeMode = hydrated ? theme : "bright";
  const currentCopy = copy[currentLocale];
  const stats = buildTaskStats(tasks);
  const sourceSummary = buildTaskSourceSummary(tasks);

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark">
                <span className="brand-dot" />
                ME Task Engine
              </span>
              <span className="locale-chip">
                <Workflow size={16} />
                {currentTheme}
              </span>
            </div>
            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">ME Task Engine</h1>
                <p className="hero-subtitle">{currentCopy.summary}</p>
                <p className="hero-subtitle-zh">
                  {currentLocale === "zh"
                    ? "当前为本地 mock task data，不连接真实 workflow、notification API、数据库或持久化服务。"
                    : "Current data is local mock task data only, with no real workflow, notification API, database, or persistence service connected."}
                </p>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button" href="/">
                  <LayoutDashboard size={16} />
                  <span>{currentCopy.dashboard}</span>
                </Link>
                <Link className="shell-link-button" href="/modules">
                  <Layers3 size={16} />
                  <span>{currentCopy.modules}</span>
                </Link>
                <Link className="shell-link-button shell-link-button--primary" href="/demo">
                  <Workflow size={16} />
                  <span>{currentCopy.demo}</span>
                </Link>
                <Link className="shell-link-button" href="/layout-engine">
                  <PanelTopClose size={16} />
                  <span>{currentCopy.layoutEngine}</span>
                </Link>
              </div>
            </div>
          </section>

          <MockDataNotice
            locale={currentLocale}
            title={{ zh: "Task Engine MVP", en: "Task Engine MVP" }}
            message={{ zh: "当前任务数据来自本地 TypeScript mock data。", en: "Current task records come from local TypeScript mock data." }}
            detail={{ zh: "未连接真实工作流、通知服务、API 或数据库。", en: "No real workflow, notification service, API, or database is connected." }}
            tags={[{ zh: "本地任务数据", en: "Local Task Data" }, { zh: "无工作流引擎", en: "No Workflow Engine" }, { zh: "无通知服务", en: "No Notification Service" }]}
          />

          {dataError ? (
            <section className="modules-panel">
              <EmptyState
                locale={currentLocale}
                title={{ zh: "数据读取失败", en: "Data Load Failed" }}
                description={{ zh: dataError, en: dataError }}
                actionLabel={{ zh: "返回 Demo Workspace", en: "Back To Demo Workspace" }}
              />
            </section>
          ) : null}

          <section className="modules-panel">
            <TaskActionBar locale={currentLocale} />
          </section>

          <section className="modules-panel">
            <TaskStatsRow locale={currentLocale} stats={stats} />
          </section>

          <section className="modules-panel">
            <div className="panel-header">
              <div>
                <h2 className="shell-title">{currentLocale === "zh" ? "筛选与搜索占位" : "Filter And Search Placeholder"}</h2>
                <p className="shell-copy">
                  {currentLocale === "zh"
                    ? "展示未来任务筛选、搜索和视图切换的基础入口。"
                    : "Shows the foundation for future task filters, search, and view switching."}
                </p>
              </div>
            </div>
            <FilterBar
              locale={currentLocale}
              searchPlaceholder={{ zh: "搜索任务、来源记录、负责人", en: "Search tasks, source records, or owners" }}
              filters={[
                { key: "status", label: { zh: "状态", en: "Status" }, type: "status" },
                { key: "source", label: { zh: "来源模块", en: "Source Module" }, type: "tag" },
                { key: "owner", label: { zh: "负责人角色", en: "Owner Role" }, type: "owner" },
              ]}
              actionSlot={<StatusChip label={{ zh: "本地筛选占位", en: "Local Filter Placeholder" }} locale={currentLocale} tone="brand" size="sm" />}
            />
          </section>

          <section className="modules-panel">
            <div className="panel-header">
              <div>
                <h2 className="shell-title">{currentLocale === "zh" ? "任务看板" : "Task Board"}</h2>
                <p className="shell-copy">
                  {currentLocale === "zh"
                    ? "按状态聚合展示 todo、in-progress、review、blocked、done。"
                    : "Groups tasks by todo, in-progress, review, blocked, and done statuses."}
                </p>
              </div>
            </div>
            <TaskBoard tasks={tasks} locale={currentLocale} />
          </section>

          <section className="demo-section-grid">
            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{currentLocale === "zh" ? "任务列表" : "Task List"}</h2>
                  <p className="shell-copy">
                    {currentLocale === "zh"
                      ? "按优先级与到期时间排序的任务列表。"
                      : "Task list sorted by priority and due date."}
                  </p>
                </div>
              </div>
              <TaskList tasks={tasks} locale={currentLocale} />
            </section>

            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{currentLocale === "zh" ? "来源摘要" : "Source Summary"}</h2>
                  <p className="shell-copy">
                    {currentLocale === "zh"
                      ? "展示任务如何从不同模块进入 Task Engine。"
                      : "Shows how tasks enter the Task Engine from different modules."}
                  </p>
                </div>
              </div>
              <div className="task-source-summary-grid">
                {sourceSummary.map((item) => (
                  <Link key={item.moduleCode} className="task-source-summary-card" href={item.route}>
                    <span>{item.moduleCode}</span>
                    <strong>{item.total}</strong>
                    <p>
                      {currentLocale === "zh" ? "待复核" : "Review"}: {item.review} · {currentLocale === "zh" ? "逾期" : "Overdue"}: {item.overdue}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
