"use client";

import Link from "next/link";
import { Layers3, LayoutDashboard, PanelTopClose, Workflow } from "lucide-react";
import { useEffect } from "react";

import { MockDataNotice } from "@/components/demo/mock-data-notice";
import { EmptyState } from "@/components/data/empty-state";
import { getLocalizedText } from "@/lib/localized";
import { getTaskById } from "@/lib/tasks";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale, ThemeMode } from "@/types/module";
import type { TaskRecord } from "@/types/task";

import { TaskActionBar } from "@/components/tasks/task-action-bar";
import { TaskDetailPanel } from "@/components/tasks/task-detail-panel";
import { TaskSourceCard } from "@/components/tasks/task-source-card";
import { TaskTimeline } from "@/components/tasks/task-timeline";

interface TaskDetailPageProps {
  taskId: string;
  task?: TaskRecord | null;
  dataError?: string;
}

export function TaskDetailPage({ taskId, task: taskProp, dataError }: TaskDetailPageProps) {
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
  const task = taskProp ?? getTaskById(taskId);

  if (!task) {
    return (
      <main className="main-frame module-center-page">
        <section className="module-center-shell">
          <div className="shell-backdrop" />
          <div className="dashboard-content module-center-content">
            <section className="hero-panel module-center-hero">
              <div className="eyebrow-row">
                <span className="brand-mark"><span className="brand-dot" />ME Task Engine</span>
                <span className="locale-chip"><Workflow size={16} />{currentTheme}</span>
              </div>
              <div className="hero-metadata">
                <div>
                  <h1 className="hero-title">{currentLocale === "zh" ? "未找到任务" : "Task Not Found"}</h1>
                  <p className="hero-subtitle">
                    {dataError ? dataError : currentLocale === "zh" ? "当前任务 ID 不在本地 mock task data 中。" : "This task ID does not exist in the local mock task data set."}
                  </p>
                </div>
                <div className="template-link-row">
                  <Link className="shell-link-button" href="/tasks">ME Task Engine</Link>
                  <Link className="shell-link-button" href="/demo">ME Demo Workspace</Link>
                </div>
              </div>
            </section>
            <section className="modules-panel">
              <EmptyState
                locale={currentLocale}
                title={{ zh: "未找到任务", en: "Task Not Found" }}
                description={{ zh: "请从任务列表中选择有效的任务记录。", en: "Choose a valid task record from the task list." }}
                actionLabel={{ zh: "返回任务引擎", en: "Back To Task Engine" }}
              />
            </section>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark"><span className="brand-dot" />ME Task Engine</span>
              <span className="locale-chip"><Workflow size={16} />{currentTheme}</span>
            </div>
            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">{task.id}</h1>
                <p className="hero-subtitle">{getLocalizedText(task.title, currentLocale)}</p>
                <p className="hero-subtitle-zh">{getLocalizedText(task.description, currentLocale)}</p>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button" href="/tasks">
                  <Workflow size={16} />
                  <span>{currentLocale === "zh" ? "返回任务引擎" : "Back To Task Engine"}</span>
                </Link>
                <Link className="shell-link-button" href="/">
                  <LayoutDashboard size={16} />
                  <span>{currentLocale === "zh" ? "返回 Dashboard" : "Back To Dashboard"}</span>
                </Link>
                <Link className="shell-link-button" href="/modules">
                  <Layers3 size={16} />
                  <span>{currentLocale === "zh" ? "打开模块中心" : "Open Module Center"}</span>
                </Link>
                <Link className="shell-link-button" href="/layout-engine">
                  <PanelTopClose size={16} />
                  <span>{currentLocale === "zh" ? "布局引擎" : "Layout Engine"}</span>
                </Link>
              </div>
            </div>
          </section>

          <MockDataNotice
            locale={currentLocale}
            compact
            title={{ zh: "本地任务详情", en: "Local Task Detail" }}
            message={{ zh: "当前任务详情、证据和时间线均为演示占位。", en: "The current task detail, evidence, and timeline are all demo placeholders." }}
            detail={{ zh: "未连接真实工作流、通知或持久化。", en: "No real workflow, notification, or persistence is connected." }}
          />

          <section className="modules-panel">
            <TaskActionBar locale={currentLocale} task={task} />
          </section>

          <section className="demo-section-grid">
            <section className="modules-panel">
              <TaskDetailPanel task={task} locale={currentLocale} />
            </section>
            <section className="modules-panel">
              <TaskSourceCard task={task} locale={currentLocale} />
            </section>
          </section>

          <section className="demo-section-grid">
            <section className="modules-panel">
              <TaskTimeline task={task} locale={currentLocale} />
            </section>
            <section className="modules-panel">
              <div className="me-panel-card">
                <h3 className="me-panel-title">{currentLocale === "zh" ? "证据占位" : "Evidence Placeholder"}</h3>
                <div className="task-evidence-list">
                  {task.evidence.map((item) => (
                    <article key={item.id} className="task-evidence-item">
                      <strong>{getLocalizedText(item.label, currentLocale)}</strong>
                      <span>{item.type}</span>
                      <p>{item.value}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
