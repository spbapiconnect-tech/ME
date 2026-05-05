"use client";

import Link from "next/link";
import { BarChart3, Blocks, Layers3, LayoutTemplate, ListTodo, PanelTopClose, Package, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { useEffect } from "react";

import { ActionBar } from "@/components/data/action-bar";
import { CardList } from "@/components/data/card-list";
import { DataTable } from "@/components/data/data-table";
import { DetailPanel } from "@/components/data/detail-panel";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/data/error-state";
import { FilterBar } from "@/components/data/filter-bar";
import { KpiCard } from "@/components/data/kpi-card";
import { LoadingState } from "@/components/data/loading-state";
import { RightDrawer } from "@/components/data/right-drawer";
import { StatusChip } from "@/components/data/status-chip";
import { Timeline } from "@/components/data/timeline";
import { FormField } from "@/components/form/form-field";
import { FormFooter } from "@/components/form/form-footer";
import { FormSection } from "@/components/form/form-section";
import { UploadPlaceholder } from "@/components/form/upload-placeholder";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale, ThemeMode } from "@/types/module";

const componentCopy = {
  en: {
    title: "ME Core Components",
    subtitle: "Centralized reusable primitives for future module pages.",
    description: "This route demonstrates placeholder-only reusable UI building blocks. No real business logic or API integration is included.",
    back: "Back To Dashboard",
    moduleCenter: "Open Module Center",
    templates: "Open Page Templates",
    demo: "Open Demo Workspace",
    tasks: "Open Task Engine",
    layoutEngine: "Layout Engine",
    actionContracts: "Open Action Contracts",
    accessControl: "ME Access Control",
    auditTrail: "ME Audit Trail",
  },
  zh: {
    title: "ME Core Components",
    subtitle: "为未来模块页面集中提供可复用基础组件。",
    description: "当前页面仅展示可复用 UI 占位组件，不包含真实业务逻辑或 API 集成。",
    back: "返回 Dashboard",
    moduleCenter: "打开模块中心",
    templates: "打开页面模板",
    demo: "打开 Demo Workspace",
    tasks: "打开任务引擎",
    layoutEngine: "布局引擎",
    actionContracts: "打开 Action Contracts",
    accessControl: "ME Access Control",
    auditTrail: "ME Audit Trail",
  },
} as const;

export function ComponentShowcase() {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";
  const currentTheme: ThemeMode = hydrated ? theme : "bright";
  const copy = componentCopy[currentLocale];

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark">
                <span className="brand-dot" />
                {copy.title}
              </span>
              <span className="locale-chip">
                <Blocks size={16} />
                {currentTheme}
              </span>
            </div>
            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">{copy.title}</h1>
                <p className="hero-subtitle">{copy.subtitle}</p>
                <p className="hero-subtitle-zh">{copy.description}</p>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button" href="/">
                  <Blocks size={16} />
                  <span>{copy.back}</span>
                </Link>
                <Link className="shell-link-button" href="/modules">
                  <Layers3 size={16} />
                  <span>{copy.moduleCenter}</span>
                </Link>
                <Link className="shell-link-button shell-link-button--primary" href="/demo">
                  <Workflow size={16} />
                  <span>{copy.demo}</span>
                </Link>
                <Link className="shell-link-button" href="/tasks">
                  <ListTodo size={16} />
                  <span>{copy.tasks}</span>
                </Link>
                <Link className="shell-link-button" href="/layout-engine">
                  <PanelTopClose size={16} />
                  <span>{copy.layoutEngine}</span>
                </Link>
                <Link className="shell-link-button" href="/action-contracts">
                  <Sparkles size={16} />
                  <span>{copy.actionContracts}</span>
                </Link>
                <Link className="shell-link-button" href="/access-control">
                  <ShieldCheck size={16} />
                  <span>{copy.accessControl}</span>
                </Link>
                <Link className="shell-link-button" href="/audit-trail">
                  <ShieldCheck size={16} />
                  <span>{copy.auditTrail}</span>
                </Link>
                <Link className="shell-link-button" href="/notifications">
                  <Workflow size={16} />
                  <span>ME Notifications</span>
                </Link>
                <Link className="shell-link-button" href="/reports">
                  <BarChart3 size={16} />
                  <span>ME Reports</span>
                </Link>
                <Link className="shell-link-button" href="/rules">
                  <ShieldCheck size={16} />
                  <span>ME Rules</span>
                </Link>
                <Link className="shell-link-button" href="/packages">
                  <Package size={16} />
                  <span>ME Packages</span>
                </Link>
                <Link className="shell-link-button" href="/psi">
                  <Workflow size={16} />
                  <span>ME PSI</span>
                </Link>
                <Link className="shell-link-button" href="/templates">
                  <LayoutTemplate size={16} />
                  <span>{copy.templates}</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="modules-panel">
            <div className="panel-header">
              <h2 className="shell-title">Data Components</h2>
            </div>
            <div className="component-showcase-grid">
              <KpiCard locale={currentLocale} label={{ zh: "销售表现", en: "Sales Performance" }} value="$18,240" trend="+12%" description={{ zh: "适用于 Dashboard 与 Report KPI 展示。", en: "Reusable for dashboard and report KPI display." }} tone="success" />
              <KpiCard locale={currentLocale} label={{ zh: "风险任务", en: "Risk Tasks" }} value="24" trend="Watch" density="compact" description={{ zh: "支持紧凑与舒适两种密度。", en: "Supports both compact and comfortable density." }} tone="warning" />
              <div className="me-panel-card">
                <div className="me-showcase-row"><StatusChip label="Neutral" locale={currentLocale} tone="neutral" /></div>
                <div className="me-showcase-row"><StatusChip label="Success" locale={currentLocale} tone="success" dot /></div>
                <div className="me-showcase-row"><StatusChip label="Warning" locale={currentLocale} tone="warning" /></div>
                <div className="me-showcase-row"><StatusChip label="Danger" locale={currentLocale} tone="danger" /></div>
                <div className="me-showcase-row"><StatusChip label="Info" locale={currentLocale} tone="info" /></div>
                <div className="me-showcase-row"><StatusChip label="Brand Long English Label Example" locale={currentLocale} tone="brand" maxWidth="10rem" /></div>
              </div>
            </div>
          </section>

          <section className="modules-panel">
            <FilterBar
              locale={currentLocale}
              filters={[
                { key: "status", label: { zh: "状态", en: "Status" }, type: "status" },
                { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "owner" },
              ]}
              actionSlot={<ActionBar locale={currentLocale} primaryAction={{ key: "create", label: { zh: "新建", en: "Create" } }} secondaryActions={[{ key: "export", label: { zh: "导出", en: "Export" } }]} bulkActionLabel={{ zh: "批量操作占位", en: "Bulk Action Placeholder" }} />}
            />
          </section>

          <section className="component-showcase-two-column">
            <section className="modules-panel">
              <div className="panel-header"><h2 className="shell-title">Data Display</h2></div>
              <DataTable
                locale={currentLocale}
                columns={[
                  { key: "requestNo", label: { zh: "申请单号", en: "Request No" } },
                  { key: "owner", label: { zh: "负责人", en: "Owner" } },
                  { key: "status", label: { zh: "状态", en: "Status" } },
                ]}
                rows={[
                  { requestNo: "PR-2026-001", owner: "Mia Chen", status: "active" },
                  { requestNo: "PR-2026-002", owner: "Leo Wong", status: "pending" },
                ]}
              />
              <CardList
                locale={currentLocale}
                items={[
                  { id: "1", title: "North Branch Review", subtitle: "Store checklist placeholder", meta: "Mia Chen", status: "active", actionLabel: currentLocale === "zh" ? "查看" : "View" },
                  { id: "2", title: "Inventory Exception", subtitle: "Warehouse placeholder card", meta: "Leo Wong", status: "warning", actionLabel: currentLocale === "zh" ? "处理" : "Handle" },
                ]}
              />
            </section>

            <section className="modules-panel">
              <div className="panel-header"><h2 className="shell-title">Panels & States</h2></div>
              <DetailPanel
                locale={currentLocale}
                title={{ zh: "详情面板", en: "Detail Panel" }}
                description={{ zh: "用于详情页和设置页的关键信息展示。", en: "Used for detail and settings information display." }}
                sections={[
                  { title: { zh: "基础信息", en: "Basic Information" }, rows: [{ label: "Code", value: "PROC-001" }, { label: "Owner", value: "Mia Chen" }] },
                  { title: { zh: "上下文", en: "Context" }, rows: [{ label: "Status", value: "active" }, { label: "Scope", value: "tenant" }] },
                ]}
              />
              <RightDrawer locale={currentLocale} title={{ zh: "右侧抽屉", en: "Right Drawer" }} description={{ zh: "支持常驻或打开态占位。", en: "Supports always-visible or open-state placeholder modes." }} alwaysVisible actionSlot={<ActionBar locale={currentLocale} primaryAction={{ key: "apply", label: { zh: "应用", en: "Apply" } }} />}> 
                <Timeline locale={currentLocale} items={[{ title: { zh: "抽屉打开", en: "Drawer Opened" }, timestamp: "2026-05-04 10:00", status: "active" }]} />
              </RightDrawer>
              <EmptyState locale={currentLocale} title={{ zh: "空状态", en: "Empty State" }} description={{ zh: "用于列表、报表、详情等无数据场景。", en: "Used for list, report, and detail no-data scenarios." }} actionLabel={{ zh: "占位动作", en: "Placeholder Action" }} />
              <LoadingState variant="card" />
              <ErrorState locale={currentLocale} title={{ zh: "错误状态", en: "Error State" }} description={{ zh: "用于加载失败和异常提示。", en: "Used for loading failures and exception placeholders." }} />
            </section>
          </section>

          <section className="modules-panel">
            <div className="panel-header"><h2 className="shell-title">Form Components</h2></div>
            <FormSection locale={currentLocale} title={{ zh: "表单分组", en: "Form Section" }} description={{ zh: "统一的表单区块结构。", en: "Unified grouped form block structure." }}>
              <div className="component-showcase-form-grid">
                <FormField locale={currentLocale} label={{ zh: "文本字段", en: "Text Field" }} hint={{ zh: "文本输入占位", en: "Text input placeholder" }} required />
                <FormField locale={currentLocale} label={{ zh: "选择字段", en: "Select Field" }} type="select" hint={{ zh: "选择器占位", en: "Select placeholder" }} />
                <FormField locale={currentLocale} label={{ zh: "日期字段", en: "Date Field" }} type="date" />
                <FormField locale={currentLocale} label={{ zh: "数量字段", en: "Number Field" }} type="number" />
                <FormField locale={currentLocale} label={{ zh: "多行说明", en: "Textarea Field" }} type="textarea" />
                <FormField locale={currentLocale} label={{ zh: "上传字段", en: "Upload Field" }} type="upload" />
              </div>
            </FormSection>
            <UploadPlaceholder locale={currentLocale} />
            <FormFooter locale={currentLocale} />
          </section>
        </div>
      </section>
    </main>
  );
}
