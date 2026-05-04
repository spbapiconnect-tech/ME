import type {
  ModulePageSchemaMap,
  ModulePageType,
  PageSchemaAction,
  PageSchemaColumn,
  PageSchemaDefinition,
  PageSchemaResponsiveBehavior,
  PageSchemaField,
  PageSchemaFilter,
  PageSchemaSection,
  PageSchemaTab,
  PageTemplateDemoData,
} from "@/types/page-schema";
import type { LocalizedText } from "@/types/module";

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

export interface ModuleSchemaSeed {
  moduleCode: string;
  moduleName: LocalizedText;
  moduleShortName: LocalizedText;
  moduleDescription: LocalizedText;
  listingColumns: PageSchemaColumn[];
  filters: PageSchemaFilter[];
  detailSections: PageSchemaSection[];
  issueFields: PageSchemaField[];
  formFields: PageSchemaField[];
  dashboardWidgets: Array<{
    key: string;
    title: LocalizedText;
    description: LocalizedText;
  }>;
}

const defaultTabs: Record<ModulePageType, PageSchemaTab[]> = {
  dashboard: [
    { key: "overview", label: text("总览", "Overview") },
    { key: "activity", label: text("动态", "Activity") },
    { key: "attention", label: text("关注", "Attention") },
  ],
  listing: [
    { key: "all", label: text("全部", "All") },
    { key: "active", label: text("进行中", "Active") },
    { key: "review", label: text("待复核", "Review") },
  ],
  detail: [
    { key: "overview", label: text("概览", "Overview") },
    { key: "timeline", label: text("时间线", "Timeline") },
    { key: "context", label: text("上下文", "Context") },
  ],
  issue: [
    { key: "open", label: text("开启", "Open") },
    { key: "in-progress", label: text("处理中", "In Progress") },
    { key: "closed", label: text("关闭", "Closed") },
  ],
  form: [
    { key: "draft", label: text("草稿", "Draft") },
    { key: "review", label: text("复核", "Review") },
    { key: "submit", label: text("提交", "Submit") },
  ],
  report: [
    { key: "summary", label: text("摘要", "Summary") },
    { key: "trend", label: text("趋势", "Trend") },
    { key: "compare", label: text("对比", "Compare") },
  ],
  settings: [
    { key: "preferences", label: text("偏好", "Preferences") },
    { key: "permissions", label: text("权限", "Permissions") },
    { key: "mapping", label: text("映射", "Mapping") },
  ],
};

const defaultStatusMap = {
  draft: { label: text("草稿", "Draft"), tone: "info" },
  active: { label: text("进行中", "Active"), tone: "success" },
  pending: { label: text("待处理", "Pending"), tone: "warning" },
  blocked: { label: text("阻塞", "Blocked"), tone: "danger" },
  closed: { label: text("已关闭", "Closed"), tone: "default" },
} as const;

function createActions(moduleCode: string, pageType: ModulePageType): PageSchemaAction[] {
  const action = (
    key: string,
    zh: string,
    en: string,
    placement: PageSchemaAction["placement"],
    tone: PageSchemaAction["tone"],
  ) => ({
    key,
    label: text(zh, en),
    placement,
    tone,
    permission: `${moduleCode}.${key}`,
  });

  switch (pageType) {
    case "listing":
      return [
        action("create", "新建", "Create", "toolbar", "primary"),
        action("export", "导出", "Export", "toolbar", "secondary"),
        action("approve", "审批", "Approve", "toolbar", "ghost"),
      ];
    case "detail":
      return [
        action("edit", "编辑", "Edit", "toolbar", "primary"),
        action("export", "导出", "Export", "toolbar", "secondary"),
      ];
    case "issue":
      return [
        action("assign", "指派", "Assign", "toolbar", "secondary"),
        action("escalate", "升级", "Escalate", "toolbar", "ghost"),
        action("close-loop", "闭环处理", "Close Loop", "toolbar", "primary"),
      ];
    case "form":
      return [
        action("save", "保存", "Save", "footer", "secondary"),
        action("submit", "提交", "Submit", "footer", "primary"),
        action("cancel", "取消", "Cancel", "footer", "ghost"),
      ];
    case "report":
      return [
        action("export", "导出", "Export", "toolbar", "primary"),
        action("share", "分享", "Share", "toolbar", "secondary"),
      ];
    case "settings":
      return [
        action("save", "保存设置", "Save Settings", "footer", "primary"),
        action("sync", "同步映射", "Sync Mapping", "footer", "secondary"),
      ];
    default:
      return [
        action("refresh", "刷新", "Refresh", "toolbar", "secondary"),
        action("export", "导出", "Export", "toolbar", "ghost"),
      ];
  }
}

function createApiMapping(moduleCode: string, pageType: ModulePageType) {
  return {
    endpoint: `/api/modules/${moduleCode}/${pageType}`,
    method: pageType === "form" ? "POST" : "GET",
    note: `Placeholder mapping only for ${moduleCode} ${pageType}. No real API is connected.`,
  } as const;
}

function createSourceMapping(moduleCode: string, pageType: ModulePageType) {
  return {
    sourceModule: moduleCode,
    pageType,
    sourceKey: `${moduleCode}.${pageType}`,
    note: `source_module=${moduleCode}, page_type=${pageType}`,
  } as const;
}

function createResponsiveBehavior(pageType: ModulePageType): PageSchemaResponsiveBehavior {
  if (pageType === "listing") {
    return {
      mobile: ["mobile-card-list"],
      tablet: ["tablet-split-view"],
      desktop: ["desktop-data-grid", "desktop-detail-drawer"],
    };
  }

  if (pageType === "detail") {
    return {
      mobile: ["mobile-single-column"],
      tablet: ["tablet-workspace"],
      desktop: ["desktop-detail-drawer"],
    };
  }

  if (pageType === "issue") {
    return {
      mobile: ["mobile-card-list"],
      tablet: ["tablet-split-view"],
      desktop: ["desktop-board"],
    };
  }

  if (pageType === "settings") {
    return {
      mobile: ["mobile-single-column"],
      tablet: ["tablet-workspace"],
      desktop: ["desktop-settings-panel"],
    };
  }

  if (pageType === "dashboard") {
    return {
      mobile: ["mobile-single-column"],
      tablet: ["tablet-workspace"],
      desktop: ["desktop-data-grid"],
    };
  }

  return {
    mobile: ["mobile-single-column"],
    tablet: ["tablet-workspace"],
    desktop: ["desktop-data-grid"],
  };
}

export function createModulePageSchemas(seed: ModuleSchemaSeed): ModulePageSchemaMap {
  const dashboard: PageSchemaDefinition = {
    moduleCode: seed.moduleCode,
    pageType: "dashboard",
    title: text(`${seed.moduleName.zh} 看板`, `${seed.moduleName.en} Dashboard`),
    description: text(`${seed.moduleShortName.zh} 关键指标、待办与异常入口的占位模板。`, `Schema-driven dashboard placeholder for ${seed.moduleName.en} metrics, activities, and exception previews.`),
    layout: "dashboard-layout",
    widgets: seed.dashboardWidgets.map((widget) => ({ ...widget, tone: "info" })),
    filters: [],
    columns: [],
    sections: [
      { key: "summary", title: text("模块摘要", "Module Summary"), layout: "panel" },
      { key: "activity", title: text("近期动态", "Recent Activity"), layout: "timeline" },
      { key: "attention", title: text("关注事项", "Attention Queue"), layout: "stack" },
    ],
    fields: [],
    actions: createActions(seed.moduleCode, "dashboard"),
    tabs: defaultTabs.dashboard,
    statusMap: defaultStatusMap,
    apiMapping: createApiMapping(seed.moduleCode, "dashboard"),
    sourceMapping: createSourceMapping(seed.moduleCode, "dashboard"),
    responsiveBehavior: createResponsiveBehavior("dashboard"),
  };

  const listing: PageSchemaDefinition = {
    moduleCode: seed.moduleCode,
    pageType: "listing",
    title: text(`${seed.moduleName.zh} 列表`, `${seed.moduleName.en} Listing`),
    description: text(`${seed.moduleShortName.zh} 列表、筛选与预览区域的占位模板。`, `Placeholder listing template for ${seed.moduleName.en} records, filters, and split preview.`),
    layout: "listing-layout",
    widgets: [],
    filters: seed.filters,
    columns: seed.listingColumns,
    sections: [
      { key: "table", title: text("列表数据", "Listing Data"), layout: "panel" },
      { key: "preview", title: text("预览面板", "Preview Panel"), layout: "panel" },
    ],
    fields: [],
    actions: createActions(seed.moduleCode, "listing"),
    tabs: defaultTabs.listing,
    statusMap: defaultStatusMap,
    apiMapping: createApiMapping(seed.moduleCode, "listing"),
    sourceMapping: createSourceMapping(seed.moduleCode, "listing"),
    responsiveBehavior: createResponsiveBehavior("listing"),
  };

  const detail: PageSchemaDefinition = {
    moduleCode: seed.moduleCode,
    pageType: "detail",
    title: text(`${seed.moduleName.zh} 详情`, `${seed.moduleName.en} Detail`),
    description: text(`${seed.moduleShortName.zh} 详情页、信息分区与活动时间线的占位模板。`, `Placeholder detail template for ${seed.moduleName.en} information sections, context, and activity timeline.`),
    layout: "detail-layout",
    widgets: [],
    filters: [],
    columns: [],
    sections: seed.detailSections,
    fields: [],
    actions: createActions(seed.moduleCode, "detail"),
    tabs: defaultTabs.detail,
    statusMap: defaultStatusMap,
    apiMapping: createApiMapping(seed.moduleCode, "detail"),
    sourceMapping: createSourceMapping(seed.moduleCode, "detail"),
    responsiveBehavior: createResponsiveBehavior("detail"),
  };

  const issue: PageSchemaDefinition = {
    moduleCode: seed.moduleCode,
    pageType: "issue",
    title: text(`${seed.moduleName.zh} Issue`, `${seed.moduleName.en} Issue`),
    description: text(`${seed.moduleShortName.zh} 问题板、严重级别与闭环入口的占位模板。`, `Placeholder issue template for ${seed.moduleName.en} issue tracking, ownership, and close-loop actions.`),
    layout: "issue-layout",
    widgets: [],
    filters: seed.filters,
    columns: [],
    sections: [
      { key: "board", title: text("问题板", "Issue Board"), layout: "panel" },
      { key: "timeline", title: text("问题时间线", "Issue Timeline"), layout: "timeline" },
    ],
    fields: seed.issueFields,
    actions: createActions(seed.moduleCode, "issue"),
    tabs: defaultTabs.issue,
    statusMap: defaultStatusMap,
    apiMapping: createApiMapping(seed.moduleCode, "issue"),
    sourceMapping: createSourceMapping(seed.moduleCode, "issue"),
    responsiveBehavior: createResponsiveBehavior("issue"),
  };

  const formSections: PageSchemaSection[] = [
    { key: "basic", title: text("基础信息", "Basic Information"), layout: "grid", fieldKeys: seed.formFields.slice(0, 3).map((field) => field.key) },
    { key: "ownership", title: text("责任与时间", "Ownership & Timing"), layout: "grid", fieldKeys: seed.formFields.slice(3, 6).map((field) => field.key) },
    { key: "notes", title: text("说明与备注", "Notes & Comments"), layout: "stack", fieldKeys: seed.formFields.slice(6).map((field) => field.key) },
  ];

  const form: PageSchemaDefinition = {
    moduleCode: seed.moduleCode,
    pageType: "form",
    title: text(`${seed.moduleName.zh} 表单`, `${seed.moduleName.en} Form`),
    description: text(`${seed.moduleShortName.zh} 表单录入、校验提示与动作页脚的占位模板。`, `Placeholder form template for ${seed.moduleName.en} grouped input sections and action footer.`),
    layout: "form-layout",
    widgets: [],
    filters: [],
    columns: [],
    sections: formSections,
    fields: seed.formFields,
    actions: createActions(seed.moduleCode, "form"),
    tabs: defaultTabs.form,
    statusMap: defaultStatusMap,
    apiMapping: createApiMapping(seed.moduleCode, "form"),
    sourceMapping: createSourceMapping(seed.moduleCode, "form"),
    responsiveBehavior: createResponsiveBehavior("form"),
  };

  const report: PageSchemaDefinition = {
    moduleCode: seed.moduleCode,
    pageType: "report",
    title: text(`${seed.moduleName.zh} 报表`, `${seed.moduleName.en} Report`),
    description: text(`${seed.moduleShortName.zh} KPI、图表与汇总表格的占位模板。`, `Placeholder report template for ${seed.moduleName.en} KPIs, static chart slots, and export actions.`),
    layout: "report-layout",
    widgets: seed.dashboardWidgets.map((widget) => ({ ...widget, tone: "success" })),
    filters: seed.filters,
    columns: seed.listingColumns.slice(0, 4),
    sections: [
      { key: "kpi", title: text("指标概览", "KPI Overview"), layout: "grid" },
      { key: "chart", title: text("趋势图", "Trend Chart"), layout: "panel" },
      { key: "table", title: text("摘要表", "Summary Table"), layout: "panel" },
    ],
    fields: [],
    actions: createActions(seed.moduleCode, "report"),
    tabs: defaultTabs.report,
    statusMap: defaultStatusMap,
    apiMapping: createApiMapping(seed.moduleCode, "report"),
    sourceMapping: createSourceMapping(seed.moduleCode, "report"),
    responsiveBehavior: createResponsiveBehavior("report"),
  };

  const settingsFields: PageSchemaField[] = [
    {
      key: "permissionScope",
      label: text("权限范围", "Permission Scope"),
      type: "select",
      placeholder: text("选择权限范围", "Select permission scope"),
    },
    {
      key: "apiMappingMode",
      label: text("API 映射模式", "API Mapping Mode"),
      type: "toggle",
      placeholder: text("切换占位模式", "Toggle placeholder mode"),
    },
    {
      key: "sourceMappingKey",
      label: text("Source Mapping Key", "Source Mapping Key"),
      type: "text",
      placeholder: text("输入 source mapping 占位键", "Enter source mapping placeholder key"),
    },
  ];

  const settings: PageSchemaDefinition = {
    moduleCode: seed.moduleCode,
    pageType: "settings",
    title: text(`${seed.moduleName.zh} 设置`, `${seed.moduleName.en} Settings`),
    description: text(`${seed.moduleShortName.zh} 配置、权限与映射信息的占位模板。`, `Placeholder settings template for ${seed.moduleName.en} permissions, API mapping, and source mapping.`),
    layout: "settings-layout",
    widgets: [],
    filters: [],
    columns: [],
    sections: [
      { key: "preferences", title: text("配置偏好", "Configuration Preferences"), layout: "stack", fieldKeys: ["permissionScope"] },
      { key: "permissions", title: text("权限占位", "Permission Placeholder"), layout: "panel", fieldKeys: ["apiMappingMode"] },
      { key: "mapping", title: text("映射占位", "Mapping Placeholder"), layout: "panel", fieldKeys: ["sourceMappingKey"] },
    ],
    fields: settingsFields,
    actions: createActions(seed.moduleCode, "settings"),
    tabs: defaultTabs.settings,
    statusMap: defaultStatusMap,
    apiMapping: createApiMapping(seed.moduleCode, "settings"),
    sourceMapping: createSourceMapping(seed.moduleCode, "settings"),
    responsiveBehavior: createResponsiveBehavior("settings"),
  };

  return {
    dashboard,
    listing,
    detail,
    issue,
    form,
    report,
    settings,
  };
}

function pickValue(key: string, index: number) {
  const lowerKey = key.toLowerCase();

  if (lowerKey.includes("requestno")) return `PR-2026-00${index + 1}`;
  if (lowerKey.includes("suppliercode")) return `SUP-20${index + 1}`;
  if (lowerKey.includes("supplier")) return ["Northwind Supply", "BlueRiver Trading", "Prime Sourcing"][index % 3];
  if (lowerKey.includes("totalamount") || lowerKey.includes("salesamount")) return [`$1,280`, `$3,420`, `$2,060`][index % 3];
  if (lowerKey.includes("sku")) return `SKU-10${index + 1}`;
  if (lowerKey.includes("product")) return ["Fresh Milk", "Bakery Mix", "Seasonal Combo"][index % 3];
  if (lowerKey.includes("warehouse")) return ["WH-01", "Cold Room", "Transit Hub"][index % 3];
  if (lowerKey.includes("availableqty")) return [`126`, `82`, `304`][index % 3];
  if (lowerKey.includes("stockstatus")) return ["Active", "Watch", "Risk"][index % 3];
  if (lowerKey.includes("status")) return ["active", "pending", "blocked"][index % 3];
  if (lowerKey.includes("owner")) return ["Mia Chen", "Leo Wong", "Avery Lin"][index % 3];
  if (lowerKey.includes("createdat") || lowerKey.endsWith("date")) return ["2026-05-04", "2026-05-05", "2026-05-06"][index % 3];
  if (lowerKey.includes("severity")) return ["High", "Medium", "Low"][index % 3];
  if (lowerKey.includes("issuetype")) return ["Stock Risk", "Delay", "Exception"][index % 3];
  if (lowerKey.includes("duedate")) return ["2026-05-08", "2026-05-09", "2026-05-10"][index % 3];
  if (lowerKey.includes("task")) return ["Follow Up", "Review", "Prepare"][index % 3];
  if (lowerKey.includes("branch")) return ["North Branch", "Central Branch", "West Branch"][index % 3];
  if (lowerKey.includes("course")) return ["SOP 101", "Store Basics", "Manager Flow"][index % 3];
  return `${key}-${index + 1}`;
}

export function createPageTemplateDemoData(schema: PageSchemaDefinition): PageTemplateDemoData {
  const metrics = schema.widgets.slice(0, 4).map((widget, index) => ({
    label: widget.title,
    value: [`128`, `24`, `9`, `96%`][index % 4],
    trend: [`+12%`, `+4%`, `-2`, `Stable`][index % 4],
  }));

  const previewCards = schema.widgets.slice(0, 3).map((widget, index) => ({
    title: widget.title,
    description: widget.description ?? text("占位描述", "Placeholder description"),
    value: [`18`, `7`, `3`][index % 3],
  }));

  const records = Array.from({ length: 4 }, (_, index) => {
    return schema.columns.reduce<Record<string, string>>((record, column) => {
      record[column.key] = pickValue(column.key, index);
      return record;
    }, {});
  });

  const detailKeys = [...schema.sections.flatMap((section) => section.fieldKeys ?? []), ...schema.fields.map((field) => field.key)].slice(0, 8);
  const detail = detailKeys.reduce<Record<string, string>>((record, key, index) => {
    record[key] = pickValue(key, index);
    return record;
  }, {});

  const timeline = [
    { title: text("模板创建", "Template Created"), timestamp: "2026-05-04 09:20", status: "active" },
    { title: text("占位复核", "Placeholder Review"), timestamp: "2026-05-04 14:10", status: "pending" },
    { title: text("结构确认", "Structure Confirmed"), timestamp: "2026-05-05 10:30", status: "closed" },
  ];

  const issues = [
    { id: "ISS-001", title: "Status chip alignment", severity: "High", status: "active", owner: "Mia Chen", dueDate: "2026-05-08" },
    { id: "ISS-002", title: "English overflow check", severity: "Medium", status: "pending", owner: "Leo Wong", dueDate: "2026-05-09" },
    { id: "ISS-003", title: "Review close-loop copy", severity: "Low", status: "closed", owner: "Avery Lin", dueDate: "2026-05-10" },
  ];

  const chartSeries = [
    { label: "Mon", value: 46 },
    { label: "Tue", value: 74 },
    { label: "Wed", value: 58 },
    { label: "Thu", value: 82 },
    { label: "Fri", value: 63 },
  ];

  const settingsValues = {
    permissionScope: "tenant-scoped placeholder",
    apiMappingMode: "disabled until real APIs exist",
    sourceMappingKey: schema.sourceMapping.sourceKey,
  };

  const formValues = schema.fields.reduce<Record<string, string>>((record, field, index) => {
    record[field.key] = pickValue(field.key, index);
    return record;
  }, {});

  return {
    metrics,
    previewCards,
    records,
    detail,
    timeline,
    issues,
    chartSeries,
    settingsValues,
    formValues,
  };
}
