import type { LayoutPageType, LayoutRendererConfig, LayoutVariant } from "@/types/layout-engine";

const layoutRegistryEntries: LayoutRendererConfig[] = [
  {
    pageType: "dashboard",
    variant: "classic",
    capabilities: ["cards", "timeline"],
    responsiveMode: "adaptive",
    density: "comfortable",
    componentVariant: "default",
    notes: {
      zh: "标准运营仪表板布局，强调 KPI 卡片与活动摘要。",
      en: "Standard operations dashboard layout focused on KPI cards and activity summary.",
    },
  },
  {
    pageType: "dashboard",
    variant: "premium",
    capabilities: ["cards", "timeline", "drawer"],
    responsiveMode: "adaptive",
    density: "comfortable",
    componentVariant: "elevated",
    notes: {
      zh: "更强调演示质感与品牌展示的高级仪表板布局。",
      en: "A more presentation-oriented premium dashboard with stronger brand presence.",
    },
  },
  {
    pageType: "listing",
    variant: "classic",
    capabilities: ["table", "cards", "split-view"],
    responsiveMode: "adaptive",
    density: "comfortable",
    componentVariant: "default",
    notes: {
      zh: "默认列表布局，桌面使用表格，移动端安全降级为卡片。",
      en: "Default listing layout with desktop tables and safe mobile card fallback.",
    },
  },
  {
    pageType: "listing",
    variant: "compact",
    capabilities: ["table", "cards"],
    responsiveMode: "desktop-first",
    density: "dense",
    componentVariant: "minimal",
    notes: {
      zh: "强调密度与快速扫描的紧凑列表布局。",
      en: "A compact listing layout optimized for density and scanning speed.",
    },
  },
  {
    pageType: "listing",
    variant: "manager",
    capabilities: ["cards", "split-view", "drawer"],
    responsiveMode: "split-optimized",
    density: "comfortable",
    componentVariant: "soft",
    notes: {
      zh: "面向管理者的分栏列表布局，强调上下文侧栏。",
      en: "A manager-oriented listing layout emphasizing split view and contextual side panels.",
    },
  },
  {
    pageType: "detail",
    variant: "classic",
    capabilities: ["cards", "timeline", "drawer"],
    responsiveMode: "adaptive",
    density: "comfortable",
    componentVariant: "default",
    notes: {
      zh: "标准详情布局，适合记录概览与时间线。",
      en: "Standard detail layout suitable for record overview and timeline review.",
    },
  },
  {
    pageType: "detail",
    variant: "manager",
    capabilities: ["cards", "timeline", "split-view", "drawer"],
    responsiveMode: "split-optimized",
    density: "comfortable",
    componentVariant: "soft",
    notes: {
      zh: "强调审批、上下文与跟进动作的管理者详情布局。",
      en: "A manager detail layout focused on review context and follow-up actions.",
    },
  },
  {
    pageType: "issue",
    variant: "board",
    capabilities: ["board", "cards", "timeline"],
    responsiveMode: "adaptive",
    density: "comfortable",
    componentVariant: "soft",
    notes: {
      zh: "问题处理看板布局，适合异常追踪与闭环流转。",
      en: "A board-style issue layout for exception tracking and close-loop handling.",
    },
  },
  {
    pageType: "form",
    variant: "classic",
    capabilities: ["form", "drawer"],
    responsiveMode: "adaptive",
    density: "comfortable",
    componentVariant: "default",
    notes: {
      zh: "默认表单布局，适合分组表单与操作底栏。",
      en: "Default form layout for grouped fields and action footers.",
    },
  },
  {
    pageType: "report",
    variant: "classic",
    capabilities: ["report", "table", "cards"],
    responsiveMode: "desktop-first",
    density: "comfortable",
    componentVariant: "elevated",
    notes: {
      zh: "标准报表布局，强调汇总卡片与报表表格。",
      en: "Standard report layout with summary cards and report table emphasis.",
    },
  },
  {
    pageType: "settings",
    variant: "desktop-admin",
    capabilities: ["settings-panel", "drawer", "cards"],
    responsiveMode: "desktop-first",
    density: "comfortable",
    componentVariant: "minimal",
    notes: {
      zh: "面向后台配置的桌面设置布局。",
      en: "A desktop-oriented settings layout for administrative configuration.",
    },
  },
];

export const layoutRegistry = layoutRegistryEntries;

export function getLayoutRendererConfig(pageType: LayoutPageType, variant?: LayoutVariant) {
  const resolvedVariant = variant ?? layoutRegistry.find((entry) => entry.pageType === pageType)?.variant;

  return layoutRegistry.find(
    (entry) => entry.pageType === pageType && entry.variant === resolvedVariant,
  );
}

export function getLayoutVariantsForPageType(pageType: LayoutPageType) {
  return layoutRegistry.filter((entry) => entry.pageType === pageType);
}
