import { meDemoReadinessGeneratedAt, meDemoReadinessItems, meDemoReadinessNotice, meDemoReadinessSections } from "@/config/demo-readiness";
import { getDemoWalkthroughItems } from "@/lib/demo-mode";
import { getNavigationMap } from "@/lib/navigation";
import { getStakeholderDemoRouteMap } from "@/lib/stakeholder-summary";
import type {
  MeDemoReadinessChecklistItem,
  MeDemoReadinessLocale,
  MeDemoReadinessMetric,
  MeDemoReadinessPageData,
  MeDemoReadinessSection,
} from "@/types/demo-readiness";

function cloneItem(item: MeDemoReadinessChecklistItem): MeDemoReadinessChecklistItem {
  return {
    ...item,
    title: { ...item.title },
    description: { ...item.description },
    relatedRoutes: [...item.relatedRoutes],
    evidence: item.evidence.map((entry) => ({ ...entry })),
    notes: item.notes ? { ...item.notes } : undefined,
  };
}

function cloneSection(section: MeDemoReadinessSection): MeDemoReadinessSection {
  return {
    ...section,
    title: { ...section.title },
    description: section.description ? { ...section.description } : undefined,
    items: section.items.map(cloneItem),
  };
}

export function getDemoReadinessItems(): MeDemoReadinessChecklistItem[] {
  return meDemoReadinessItems.map(cloneItem);
}

export function getDemoReadinessSections(): MeDemoReadinessSection[] {
  return meDemoReadinessSections.map(cloneSection);
}

export function getDemoReadinessItemsByCategory(category: MeDemoReadinessChecklistItem["category"]): MeDemoReadinessChecklistItem[] {
  return getDemoReadinessItems().filter((item) => item.category === category);
}

export function getDemoReadinessItemByKey(key: string): MeDemoReadinessChecklistItem | undefined {
  const item = meDemoReadinessItems.find((entry) => entry.key === key);
  return item ? cloneItem(item) : undefined;
}

export function getDemoReadinessRouteChecklist(): MeDemoReadinessChecklistItem[] {
  return getDemoReadinessSections()
    .find((section) => section.key === "route-completeness")
    ?.items.filter((item) => Boolean(item.route)) ?? [];
}

export function getDemoReadinessGuardrailChecklist(): MeDemoReadinessChecklistItem[] {
  return getDemoReadinessSections().find((section) => section.key === "scope-guardrail")?.items ?? [];
}

export function getDemoReadinessSummaryMetrics(): MeDemoReadinessMetric[] {
  const items = getDemoReadinessItems();
  const routeChecklist = getDemoReadinessRouteChecklist();
  const guardrailChecklist = getDemoReadinessGuardrailChecklist();
  const reviewCount = items.filter((item) => item.status === "review").length;
  const placeholderCount = items.filter((item) => item.isPlaceholder).length;
  const navigation = getNavigationMap();
  const walkthroughStops = getDemoWalkthroughItems().length;
  const stakeholderRoutes = getStakeholderDemoRouteMap().length;

  return [
    {
      key: "audited-routes",
      label: { zh: "审计路由", en: "Audited Routes" },
      value: String(routeChecklist.length),
      tone: "success",
      description: {
        zh: "覆盖首页、导航、角色、门店、Demo、PSI、报表与系统基础层。",
        en: "Covers homepage, navigation, roles, branches, demo surfaces, PSI, reports, and system foundation.",
      },
    },
    {
      key: "guardrail-passes",
      label: { zh: "范围通过项", en: "Guardrail Passes" },
      value: `${guardrailChecklist.filter((item) => item.status === "pass").length}/${guardrailChecklist.length}`,
      tone: "success",
      description: {
        zh: "保持无数据库、API、写操作、认证、分析、监控或自动化测试。",
        en: "Keeps database, API, writes, auth, analytics, monitoring, and automated browser testing out of scope.",
      },
    },
    {
      key: "presentation-reviews",
      label: { zh: "展示复核项", en: "Presentation Reviews" },
      value: String(reviewCount),
      tone: reviewCount > 0 ? "info" : "success",
      description: {
        zh: "用于收尾检查 CTA 顺序、可达性与讲解节奏。",
        en: "Used to review CTA flow, reachability, and walkthrough pacing before presentation time.",
      },
    },
    {
      key: "walkthrough-stops",
      label: { zh: "走查站点", en: "Walkthrough Stops" },
      value: String(Math.max(walkthroughStops, stakeholderRoutes)),
      tone: "info",
      description: {
        zh: "复用 Demo Mode 与 Stakeholder Summary 的现有讲解顺序。",
        en: "Reuses the existing presentation route order from Demo Mode and Stakeholder Summary.",
      },
    },
    {
      key: "nav-entry-count",
      label: { zh: "导航入口", en: "Navigation Entries" },
      value: String(navigation.primaryItems.length + navigation.footerItems.length),
      tone: "muted",
      description: {
        zh: "共享导航继续承载主入口与次级 QA 入口。",
        en: "Shared navigation continues to carry primary entries and the secondary QA entry point.",
      },
    },
    {
      key: "placeholder-futures",
      label: { zh: "未来占位项", en: "Future Placeholders" },
      value: String(placeholderCount),
      tone: "muted",
      description: {
        zh: "保留未来迁移方向，但不在本次 milestone 实现。",
        en: "Keeps future migration directions visible without implementing them in this milestone.",
      },
    },
  ];
}

export function getDemoReadinessPageData(): MeDemoReadinessPageData {
  return {
    title: { zh: "ME Demo Readiness", en: "ME Demo Readiness" },
    subtitle: { zh: "Final Audit / Presentation QA Placeholder", en: "Final Audit / Presentation QA Placeholder" },
    sections: getDemoReadinessSections(),
    items: getDemoReadinessItems(),
    summaryMetrics: getDemoReadinessSummaryMetrics(),
    routeChecklist: getDemoReadinessRouteChecklist(),
    guardrailChecklist: getDemoReadinessGuardrailChecklist(),
    generatedAt: meDemoReadinessGeneratedAt,
    notice: { ...meDemoReadinessNotice },
  };
}

export function resolveDemoReadinessItemTitle(
  item: MeDemoReadinessChecklistItem,
  locale: MeDemoReadinessLocale = "en",
): string {
  return item.title[locale];
}

export function resolveDemoReadinessItemDescription(
  item: MeDemoReadinessChecklistItem,
  locale: MeDemoReadinessLocale = "en",
): string {
  return item.description[locale];
}
