import type { MeDemoStorySection, MeDemoStoryStep } from "@/types/demo-story";

function createStep(step: MeDemoStoryStep): MeDemoStoryStep {
  return step;
}

export const meDemoStoryGeneratedAt = "2026-05-06T00:00:00.000Z";

export const meDemoStoryNotice = {
  zh: "ME Demo Story 仅用于静态导览预览，不包含真实 onboarding 引擎、进度持久化、本地存储、分析、追踪、个性化、数据库或 API。",
  en: "ME Demo Story is a static guided-tour preview only. No real onboarding engine, persisted progress, local storage, analytics, tracking, personalization, database, or API is connected.",
};

export const meDemoStorySteps: MeDemoStoryStep[] = [
  createStep({
    key: "business-overview",
    order: 1,
    title: { zh: "业务总览", en: "Business Overview" },
    subtitle: { zh: "从业务工作台开始讲述 ME", en: "Start the ME story from the business workspace" },
    description: {
      zh: "以首页业务工作台作为 Demo 起点，先展示经营视角、关键 KPI、风险提醒与下一步动作。",
      en: "Use the homepage business workspace as the demo opener to frame ME through executive KPIs, alerts, and next actions.",
    },
    tone: "success",
    status: "active",
    route: "/",
    relatedRoutes: ["/branches", "/roles", "/reports"],
    primaryCta: { zh: "打开业务工作台", en: "Open Business Workspace" },
    secondaryCta: { zh: "查看导览详情", en: "View Story Step" },
    sourceModules: ["business-workspace", "reports", "branches", "roles"],
    highlights: [
      { zh: "业务优先首页而不是链接中心", en: "Business-first homepage instead of a link hub" },
      { zh: "使用 KPI、提醒、动作建立经营语境", en: "Uses KPIs, alerts, and actions to create business context" },
      { zh: "把 PSI、角色、门店与报表收敛到同一入口", en: "Pulls PSI, roles, branches, and reports into one entry point" },
    ],
    proofPoints: [
      { zh: "首页标题为 ME Business Workspace", en: "Homepage title is ME Business Workspace" },
      { zh: "包含 KPI、运营模块、提醒与系统基础层链接", en: "Includes KPI cards, operational modules, alerts, and system foundation links" },
      { zh: "保持只读与 mock 数据边界", en: "Keeps the experience read-only and mock-data only" },
    ],
    placeholderNotice: {
      zh: "该步骤仅展示静态业务叙事，不记录导览开始状态。",
      en: "This step presents static business narrative only and does not record tour-start state.",
    },
  }),
  createStep({
    key: "navigation-ia",
    order: 2,
    title: { zh: "导航 IA", en: "Navigation IA" },
    subtitle: { zh: "说明业务导航与系统基础层的结构", en: "Explain business navigation versus system foundation" },
    description: {
      zh: "展示 ME 如何把业务导航、运营导航、报表与系统基础层组织成可演示的 B2B SaaS 信息架构。",
      en: "Show how ME organizes business navigation, operations, reports, and system foundation into a coherent B2B SaaS information architecture.",
    },
    tone: "info",
    status: "preview-only",
    route: "/navigation",
    relatedRoutes: ["/system-foundation", "/psi", "/reports"],
    primaryCta: { zh: "打开导航 IA", en: "Open Navigation IA" },
    secondaryCta: { zh: "继续导览", en: "Continue Guided Demo" },
    sourceModules: ["navigation", "system-foundation", "psi", "reports"],
    highlights: [
      { zh: "主导航优先展示业务入口", en: "Primary navigation leads with business destinations" },
      { zh: "系统基础层保留可访问但次级呈现", en: "System foundation remains accessible but visually secondary" },
      { zh: "为角色/门店导览提供共同路由语义", en: "Creates shared route language for role and branch storytelling" },
    ],
    proofPoints: [
      { zh: "`config/navigation.ts` 仍是导航单一事实来源", en: "`config/navigation.ts` remains the single source of truth" },
      { zh: "`/navigation` 已存在并保持工作", en: "`/navigation` already exists and remains working" },
      { zh: "演示故事仅复用现有路由，不做运行时隐藏", en: "The demo story only reuses existing routes and does not hide anything at runtime" },
    ],
    placeholderNotice: {
      zh: "该步骤不会记录用户走到哪个导航节点。",
      en: "This step does not record which navigation node a user has reached.",
    },
  }),
  createStep({
    key: "role-workspaces",
    order: 3,
    title: { zh: "角色工作区", en: "Role Workspaces" },
    subtitle: { zh: "从经营者到系统管理员的视角切换", en: "Preview perspectives from owner to system admin" },
    description: {
      zh: "解释经营者、门店经理、采购、仓库、员工与系统管理员如何在同一平台下拥有不同工作区叙事。",
      en: "Explain how owner, store manager, purchasing, warehouse, staff, and system admin views fit into one ME product narrative.",
    },
    tone: "info",
    status: "preview-only",
    route: "/roles",
    relatedRoutes: ["/roles/owner", "/roles/store-manager", "/roles/purchasing"],
    primaryCta: { zh: "打开角色工作区", en: "Open Role Workspaces" },
    secondaryCta: { zh: "查看角色步骤", en: "View Story Step" },
    sourceModules: ["roles", "navigation", "business-workspace"],
    highlights: [
      { zh: "统一平台，不同角色的阅读入口不同", en: "One platform with different reading frames per role" },
      { zh: "角色页继续复用共享导航与工作台基础", en: "Role pages continue to reuse shared navigation and workspace foundations" },
      { zh: "仅为展示，不引入真实权限控制", en: "Descriptive only with no real permission enforcement" },
    ],
    proofPoints: [
      { zh: "`/roles` 与 `/roles/[roleKey]` 已存在", en: "`/roles` and `/roles/[roleKey]` already exist" },
      { zh: "覆盖 owner / store manager / purchasing 等预览", en: "Covers owner, store manager, purchasing, and related previews" },
      { zh: "保持无 auth/session/middleware", en: "Keeps auth/session/middleware out of scope" },
    ],
    placeholderNotice: {
      zh: "该步骤不会保存角色导览进度或用户角色偏好。",
      en: "This step does not save role-tour progress or user role preferences.",
    },
  }),
  createStep({
    key: "branch-context",
    order: 4,
    title: { zh: "门店上下文", en: "Branch Context" },
    subtitle: { zh: "从总部聚合到门店局部预览", en: "Move from portfolio view to local branch context" },
    description: {
      zh: "展示 All Stores、KCH、BTU 与 Future Branch 如何把同一套工作台和路由重新叙述为不同门店上下文。",
      en: "Show how All Stores, KCH, BTU, and Future Branch reframe the same workspace and routes under different branch contexts.",
    },
    tone: "info",
    status: "preview-only",
    route: "/branches",
    relatedRoutes: ["/branches/all-stores", "/branches/kch", "/branches/btu"],
    primaryCta: { zh: "打开门店上下文", en: "Open Branch Context" },
    secondaryCta: { zh: "继续导览", en: "Continue Guided Demo" },
    sourceModules: ["branches", "roles", "psi", "reports"],
    highlights: [
      { zh: "同一路由在不同门店上下文中被重新讲述", en: "The same routes are reframed under different branch contexts" },
      { zh: "支持总部、区域样板店与未来门店规划讲述", en: "Supports HQ, pilot branch, and future rollout storytelling" },
      { zh: "无真实租户模型与切换持久化", en: "No real tenant model or selector persistence is connected" },
    ],
    proofPoints: [
      { zh: "`/branches` 与 `/branches/[branchKey]` 已存在", en: "`/branches` and `/branches/[branchKey]` already exist" },
      { zh: "覆盖 All Stores / KCH / BTU / Future Branch", en: "Covers All Stores, KCH, BTU, and Future Branch" },
      { zh: "继续复用共享导航、PSI 与报表页面", en: "Continues to reuse shared navigation, PSI, and reports pages" },
    ],
    placeholderNotice: {
      zh: "该步骤仅显示可视进度，不保存门店选择。",
      en: "This step shows visual progress only and does not save branch selection.",
    },
  }),
  createStep({
    key: "psi-operations",
    order: 5,
    title: { zh: "PSI 运营层", en: "PSI Operations" },
    subtitle: { zh: "采购、供应商、库存构成运营闭环", en: "Procurement, supplier, and inventory form the operations loop" },
    description: {
      zh: "把采购、供应商、库存、问题与动作草稿组织成 ME 的运营层，说明业务工作台背后的执行面。",
      en: "Frame procurement, supplier, inventory, issues, and action drafts as the operational layer behind the business workspace.",
    },
    tone: "warning",
    status: "active",
    route: "/psi",
    relatedRoutes: ["/psi/procurement", "/psi/supplier", "/psi/inventory", "/psi/issues", "/psi/actions"],
    primaryCta: { zh: "打开 PSI 工作区", en: "Open PSI Workspace" },
    secondaryCta: { zh: "查看运营步骤", en: "View Story Step" },
    sourceModules: ["psi", "procurement", "supplier", "inventory", "reports"],
    highlights: [
      { zh: "把执行层与经营层建立叙事连接", en: "Connects operational execution back to the business layer" },
      { zh: "覆盖采购、供应商、库存、问题与动作占位", en: "Covers procurement, supplier, inventory, issues, and action placeholders" },
      { zh: "保持 mock/read-only，无审批或过账", en: "Remains mock/read-only with no approvals or posting" },
    ],
    proofPoints: [
      { zh: "`/psi`、`/psi/actions`、`/psi/issues` 已存在", en: "`/psi`, `/psi/actions`, and `/psi/issues` already exist" },
      { zh: "运营链路已可通过共享路由演示", en: "The operational loop can already be demonstrated through shared routes" },
      { zh: "无工作流执行、任务创建、通知发送或供应商门户", en: "No workflow execution, task creation, notification sending, or supplier portal is connected" },
    ],
    placeholderNotice: {
      zh: "该步骤不会跟踪操作行为，也不会触发真实业务写入。",
      en: "This step does not track actions and never triggers real business writes.",
    },
  }),
  createStep({
    key: "report-preview",
    order: 6,
    title: { zh: "报表预览", en: "Report Preview" },
    subtitle: { zh: "用只读报表收束前面的经营与运营故事", en: "Use read-only reports to close the business narrative" },
    description: {
      zh: "通过报表页把 KPI、PSI 风险与小部件预览汇总为一个适合演示的分析结尾。",
      en: "Use the reports route to summarize KPI, PSI risk, and widget previews into an analytics-oriented demo checkpoint.",
    },
    tone: "success",
    status: "active",
    route: "/reports",
    relatedRoutes: ["/reports", "/psi/issues"],
    primaryCta: { zh: "打开报表预览", en: "Open Reports Preview" },
    secondaryCta: { zh: "继续导览", en: "Continue Guided Demo" },
    sourceModules: ["reports", "psi", "business-workspace"],
    highlights: [
      { zh: "报表把工作台与运营信号串起来", en: "Reports connect the workspace view to operational signals" },
      { zh: "适合作为 Demo 中段或阶段总结", en: "Works well as a mid-demo or recap checkpoint" },
      { zh: "仍然是元数据/只读预览，不执行 BI 引擎", en: "Still metadata-only and read-only with no BI execution engine" },
    ],
    proofPoints: [
      { zh: "`/reports` 继续提供 PSI 预览部件", en: "`/reports` continues to provide PSI preview widgets" },
      { zh: "首页 KPI 与报表预览形成前后呼应", en: "Homepage KPIs and report preview reinforce each other" },
      { zh: "无 SQL、导出、调度或 API 调用", en: "No SQL, export engine, scheduling, or API calls are connected" },
    ],
    placeholderNotice: {
      zh: "该步骤不会保存已查看报表或导览完成状态。",
      en: "This step does not persist viewed reports or tour completion state.",
    },
  }),
  createStep({
    key: "system-foundation",
    order: 7,
    title: { zh: "系统基础层", en: "System Foundation" },
    subtitle: { zh: "解释平台契约如何支撑前面的业务展示", en: "Explain the contracts behind the business surfaces" },
    description: {
      zh: "作为导览后段，说明 metadata contracts、layout/action/access/workflow 等基础能力如何支撑未来真实系统。",
      en: "Use the later part of the tour to explain how metadata contracts, layout, action, access, and workflow foundations support the future real system.",
    },
    tone: "muted",
    status: "active",
    route: "/system-foundation",
    relatedRoutes: ["/layout-engine", "/action-contracts", "/access-control", "/workflow"],
    primaryCta: { zh: "打开系统基础层", en: "Open System Foundation" },
    secondaryCta: { zh: "查看平台基础", en: "View Platform Step" },
    sourceModules: ["system-foundation", "layout-engine", "action-contracts", "access-control", "workflow"],
    highlights: [
      { zh: "把业务展示映射回平台契约与元数据层", en: "Maps the business demo back to platform contracts and metadata" },
      { zh: "帮助利益相关者理解可扩展性与演进路径", en: "Helps stakeholders understand extensibility and future evolution" },
      { zh: "仍保持次级、只读、无运行时执行", en: "Remains secondary, read-only, and non-executing at runtime" },
    ],
    proofPoints: [
      { zh: "`/system-foundation` 已整合平台基础入口", en: "`/system-foundation` already consolidates platform foundation links" },
      { zh: "相关基础路由继续保持可访问", en: "Related foundation routes remain accessible" },
      { zh: "无真实 auth、workflow engine、notification backend", en: "No real auth, workflow engine, or notification backend is connected" },
    ],
    placeholderNotice: {
      zh: "该步骤不会激活任何真实系统设置或元数据写入。",
      en: "This step does not activate any real system setup or metadata writes.",
    },
  }),
  createStep({
    key: "next-steps",
    order: 8,
    title: { zh: "下一阶段", en: "Next Steps" },
    subtitle: { zh: "从静态导览迁移到未来真实能力", en: "Bridge from static tour to future product capabilities" },
    description: {
      zh: "在导览末尾明确哪些能力将来会补齐，包括 auth、tenant DB、真实 API、报表构建器与 workflow engine。",
      en: "Close the story by clarifying what may come later: auth, tenant DB, real APIs, report builder, and workflow engine.",
    },
    tone: "muted",
    status: "coming-soon",
    route: "/demo-story",
    relatedRoutes: ["/stakeholder-summary", "/demo-readiness", "/packages", "/rules", "/notifications"],
    primaryCta: { zh: "返回导览总览", en: "Return To Demo Story" },
    secondaryCta: { zh: "查看未来路线", en: "View Roadmap" },
    sourceModules: ["demo-story", "packages", "rules", "notifications"],
    highlights: [
      { zh: "静态导览先服务于 stakeholder demo", en: "The static tour serves stakeholder demos first" },
      { zh: "现可衔接 Stakeholder Summary 与 Demo Readiness 作为演示收尾", en: "It now hands off into Stakeholder Summary and Demo Readiness for the presentation close" },
      { zh: "下一步进入 UI walkthrough testing，而不是接真实 API 或权限", en: "The next step is UI walkthrough testing, not real APIs or permission enforcement" },
      { zh: "未来再迁移到真实 onboarding / guided tour engine", en: "A real onboarding or guided-tour engine can be added later" },
      { zh: "当前不引入任何用户级状态或个性化", en: "No user-level state or personalization is introduced now" },
    ],
    proofPoints: [
      { zh: "未来可连接套餐、规则、通知等基础能力", en: "Future work can connect packages, rules, and notifications foundations" },
      { zh: "当前 `/demo-story` 只是故事编排层，并把结尾引向 `/stakeholder-summary` 与 `/demo-readiness`", en: "Current `/demo-story` is a story-orchestration layer that now closes through `/stakeholder-summary` and `/demo-readiness`" },
      { zh: "无持久化进度、analytics、tracking 或 personalization", en: "No persisted progress, analytics, tracking, or personalization is added" },
    ],
    placeholderNotice: {
      zh: "该步骤仅作为路线图说明，不代表真实功能已启用。",
      en: "This step is roadmap guidance only and does not imply those features are enabled.",
    },
  }),
];

const storySections: Array<{
  key: string;
  title: MeDemoStorySection["title"];
  description?: MeDemoStorySection["description"];
  tone: MeDemoStorySection["tone"];
  stepKeys: MeDemoStoryStep["key"][];
}> = [
  {
    key: "business-story",
    title: { zh: "业务故事", en: "Business Story" },
    description: {
      zh: "从首页业务工作台到导航结构，先建立产品全局心智模型。",
      en: "Establish the ME product narrative from the business workspace through the navigation structure.",
    },
    tone: "success",
    stepKeys: ["business-overview", "navigation-ia"],
  },
  {
    key: "operating-context",
    title: { zh: "运营上下文", en: "Operating Context" },
    description: {
      zh: "说明角色、门店、PSI 与报表如何组成业务执行层。",
      en: "Explain how roles, branches, PSI, and reports create the operating context of the product.",
    },
    tone: "info",
    stepKeys: ["role-workspaces", "branch-context", "psi-operations", "report-preview"],
  },
  {
    key: "platform-foundation",
    title: { zh: "平台基础", en: "Platform Foundation" },
    description: {
      zh: "说明业务展示背后的平台契约和系统基础层。",
      en: "Show the platform contracts and foundation surfaces behind the demo experience.",
    },
    tone: "muted",
    stepKeys: ["system-foundation"],
  },
  {
    key: "future-roadmap",
    title: { zh: "未来路线", en: "Future Roadmap" },
    description: {
      zh: "明确静态导览之后的迁移方向。",
      en: "Clarify what comes after the static guided-demo placeholder.",
    },
    tone: "muted",
    stepKeys: ["next-steps"],
  },
];

export const meDemoStorySections: MeDemoStorySection[] = storySections.map((section) => ({
  key: section.key,
  title: section.title,
  description: section.description,
  tone: section.tone,
  steps: section.stepKeys
    .map((stepKey) => meDemoStorySteps.find((step) => step.key === stepKey))
    .filter((step): step is MeDemoStoryStep => Boolean(step)),
}));
