import type {
  MeStakeholderAudience,
  MeStakeholderDemoRoute,
  MeStakeholderLocalizedText,
  MeStakeholderRoadmapItem,
  MeStakeholderSummaryCard,
  MeStakeholderSummaryMetric,
  MeStakeholderSummaryPageData,
} from "@/types/stakeholder-summary";

function localized(zh: string, en: string): MeStakeholderLocalizedText {
  return { zh, en };
}

function createMetric(metric: MeStakeholderSummaryMetric): MeStakeholderSummaryMetric {
  return metric;
}

function createCard(card: MeStakeholderSummaryCard): MeStakeholderSummaryCard {
  return card;
}

function createRoadmapItem(item: MeStakeholderRoadmapItem): MeStakeholderRoadmapItem {
  return item;
}

function createDemoRoute(route: MeStakeholderDemoRoute): MeStakeholderDemoRoute {
  return route;
}

export const meStakeholderSummaryGeneratedAt = "2026-05-06T00:00:00.000Z";

export const meStakeholderSummaryNotice = localized(
  "静态 Stakeholder Summary，占位展示仅用于评审与提案说明，不包含投资人追踪、CRM、分析或分享权限。",
  "Static stakeholder summary — no investor tracking, CRM, analytics, or sharing permissions.",
);

export const meStakeholderSummaryAudiences: MeStakeholderAudience[] = [
  "owner",
  "investor",
  "partner",
  "operator",
  "internal-team",
];

export const meStakeholderSummaryMetrics: MeStakeholderSummaryMetric[] = [
  createMetric({
    key: "modular-platform-layers",
    label: localized("模块化平台层", "Modular Platform Layers"),
    value: "8",
    tone: "success",
    description: localized(
      "覆盖业务工作台、导航、角色、门店、PSI、报表、展示层与系统基础层。",
      "Covers business workspace, navigation, roles, branches, PSI, reports, presentation layers, and system foundation.",
    ),
  }),
  createMetric({
    key: "demo-routes",
    label: localized("演示路由数", "Demo Routes"),
    value: "9",
    tone: "info",
    description: localized(
      "把首页、Demo Story、Demo Mode、导航、角色、门店、PSI、报表与系统基础层串成可讲解路径。",
      "Connects the homepage, Demo Story, Demo Mode, navigation, roles, branches, PSI, reports, and system foundation into one explainable path.",
    ),
  }),
  createMetric({
    key: "placeholder-modules",
    label: localized("占位模块", "Placeholder Modules"),
    value: "12",
    tone: "warning",
    description: localized(
      "以只读页面和占位模块说明未来 ME 的产品边界。",
      "Uses read-only pages and placeholders to frame the future ME product boundary.",
    ),
  }),
  createMetric({
    key: "foundation-checkpoints",
    label: localized("基础检查点", "Foundation Checkpoints"),
    value: "6",
    tone: "muted",
    description: localized(
      "串联业务工作台、导航 IA、角色、门店、PSI、系统基础层等核心讲解节点。",
      "Connects core explanation checkpoints across workspace, navigation IA, roles, branches, PSI, and system foundation.",
    ),
  }),
  createMetric({
    key: "read-only-safety",
    label: localized("只读安全边界", "Read-only Safety"),
    value: "100%",
    tone: "danger",
    description: localized(
      "当前仅为静态讲述层，不接入 CRM、分享、追踪、数据库或 API。",
      "Current scope is a static storytelling layer only with no CRM, sharing, tracking, database, or API connected.",
    ),
  }),
];

export const meStakeholderSummaryCards: MeStakeholderSummaryCard[] = [
  createCard({
    key: "what-me-is",
    title: localized("ME 是什么", "What ME is"),
    description: localized(
      "ME 是一个模块化门店运营平台，以业务工作台为首页，把导航、角色、门店、PSI、报表与系统基础层组织为统一产品叙事。",
      "ME is a modular store operations platform with a business-first homepage that organizes navigation, roles, branches, PSI, reports, and system foundation into one product story.",
    ),
    kind: "hero",
    tone: "success",
    route: "/",
    highlights: [
      localized("以经营视角开场，而不是系统后台入口。", "Opens with the operating perspective instead of a system-admin landing page."),
      localized("把业务层、运营层与平台层放在同一个 ME 叙事里。", "Frames business, operations, and platform layers within one ME narrative."),
      localized("适合提案、评审、融资沟通与内部对齐。", "Works well for proposals, reviews, investor conversations, and internal alignment."),
    ],
    proofPoints: [
      localized("首页标题为 ME Business Workspace。", "The homepage title is ME Business Workspace."),
      localized("现有业务、Demo、PSI、报表与基础路由都保持可访问。", "Existing business, demo, PSI, reports, and foundation routes all remain accessible."),
      localized("当前交付保持 UI-only 和 mock/read-only 范围。", "The current delivery stays UI-only and mock/read-only."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "problem-opportunity",
    title: localized("问题 / 机会", "Problem / Opportunity"),
    description: localized(
      "多门店运营常被分散在报表、采购、库存、角色视角和系统后台之间。ME 的机会是把这些分散信息重组为一个可扩展、可讲解的统一平台。",
      "Multi-store operations are often fragmented across reporting, procurement, inventory, role views, and system back offices. ME reframes that complexity as one extensible and explainable platform.",
    ),
    kind: "problem",
    tone: "warning",
    highlights: [
      localized("业务负责人需要快速看到经营状态与下一步动作。", "Business leaders need a fast view of performance and next actions."),
      localized("运营团队需要把采购、供应商、库存与问题闭环讲清楚。", "Operations teams need procurement, supplier, inventory, and issue loops to be understood together."),
      localized("合作方与投资人需要看到产品边界和演进路径。", "Partners and investors need clear product boundaries and an evolution path."),
    ],
    proofPoints: [
      localized("ME 现已具备业务工作台、导航 IA、角色、门店、PSI、报表与系统基础层占位。", "ME already has placeholder surfaces for business workspace, navigation IA, roles, branches, PSI, reports, and system foundation."),
      localized("展示层已可用于 walkthrough、截图和方案说明。", "The presentation layer is already usable for walkthroughs, screenshots, and proposal framing."),
      localized("当前不需要真实 CRM 或投资人门户即可讲清产品。", "The product story is explainable today without a live CRM or investor portal."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "business-workspace",
    title: localized("业务工作台", "Business Workspace"),
    description: localized(
      "首页作为 ME 的业务总览，用 KPI、提醒和模块卡建立经营语境。",
      "The homepage acts as the ME business overview, using KPI, alerts, and module cards to establish executive context.",
    ),
    kind: "business-workspace",
    tone: "success",
    route: "/",
    highlights: [
      localized("让业务总览成为默认第一印象。", "Makes the business overview the default first impression."),
      localized("保留 Demo Story、Demo Mode、角色与门店的进入点。", "Keeps entry points to Demo Story, Demo Mode, roles, and branches visible."),
      localized("适合做截图与业务演示开场页。", "Works as a strong opener for screenshots and business demos."),
    ],
    proofPoints: [
      localized("首页仍保持业务优先，而不是链接中心。", "The homepage stays business-first rather than becoming a link hub."),
      localized("保留只读与 mock 数据边界。", "The experience remains read-only and mock-data only."),
      localized("不会触发真实写入、审批、通知或任务。", "It does not trigger real writes, approvals, notifications, or tasks."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "navigation-ia",
    title: localized("导航 IA", "Navigation IA"),
    description: localized(
      "通过共享导航配置把业务、运营、报表和系统基础层整理为可演示的 B2B SaaS 信息架构。",
      "Uses the shared navigation configuration to organize business, operations, reporting, and system foundation into a demo-ready B2B SaaS information architecture.",
    ),
    kind: "product-layer",
    tone: "info",
    route: "/navigation",
    highlights: [
      localized("业务入口优先，系统基础层次级展示。", "Business destinations come first while system foundation stays secondary."),
      localized("为角色、门店与演示路线提供一致路由语言。", "Provides shared route language for roles, branches, and presentation flows."),
      localized("让新页面通过配置接入，而不是重复硬编码。", "Lets new pages plug in through config instead of repeated hardcoding."),
    ],
    proofPoints: [
      localized("`config/navigation.ts` 仍是导航单一事实来源。", "`config/navigation.ts` remains the single source of truth."),
      localized("`/navigation` 已存在并保持工作。", "`/navigation` already exists and remains working."),
      localized("新增 Stakeholder Summary 作为次级链接接入。", "The new Stakeholder Summary plugs in as a secondary link."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "role-workspace",
    title: localized("角色工作区", "Role Workspace"),
    description: localized(
      "角色页面用不同业务身份解释同一平台，帮助说明未来角色化体验的产品潜力。",
      "Role pages explain the same platform through different business identities to show the future potential of role-aware experiences.",
    ),
    kind: "role-context",
    tone: "info",
    route: "/roles",
    highlights: [
      localized("从 owner 到运营角色共享同一平台故事。", "Frames everyone from owner to operations roles inside one platform story."),
      localized("适合向不同利益相关者说明 future-fit。", "Useful for explaining future-fit to different stakeholder groups."),
      localized("当前只做描述，不做真实权限控制。", "Descriptive only with no real permission control."),
    ],
    proofPoints: [
      localized("`/roles` 与 `/roles/[roleKey]` 已存在。", "`/roles` and `/roles/[roleKey]` already exist."),
      localized("角色路由继续复用共享导航和业务工作台语言。", "Role routes continue to reuse shared navigation and business-workspace language."),
      localized("不引入 auth、session 或 middleware。", "No auth, session, or middleware is introduced."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "branch-context",
    title: localized("门店上下文", "Branch Context"),
    description: localized(
      "门店上下文页面把总部、样板店与未来门店规划统一到同一套 ME 路由与界面语言中。",
      "Branch context pages align HQ, pilot branches, and future expansion planning within the same ME routes and interface language.",
    ),
    kind: "branch-context",
    tone: "info",
    route: "/branches",
    highlights: [
      localized("支持从总部视角切到门店视角的讲解。", "Supports narrative shifts from HQ to branch-level viewpoints."),
      localized("帮助解释未来多门店扩展与分层管理。", "Helps explain future multi-branch expansion and layered management."),
      localized("当前没有真实租户模型或持久化切换器。", "There is no live tenant model or persisted selector yet."),
    ],
    proofPoints: [
      localized("`/branches` 与 `/branches/[branchKey]` 已存在。", "`/branches` and `/branches/[branchKey]` already exist."),
      localized("覆盖 All Stores、KCH、BTU 与 Future Branch。", "Covers All Stores, KCH, BTU, and Future Branch."),
      localized("门店切换仍是静态占位，不连接数据库。", "Branch switching remains a static placeholder with no database connection."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "psi-operations",
    title: localized("PSI 运营层", "PSI Operations"),
    description: localized(
      "PSI 页面把采购、供应商、库存、问题与动作占位串成运营闭环，说明 ME 不是单纯看板，而是可扩展运营平台。",
      "PSI ties procurement, supplier, inventory, issues, and action placeholders into an operations loop to show ME as more than a dashboard.",
    ),
    kind: "psi-operations",
    tone: "warning",
    route: "/psi",
    highlights: [
      localized("把业务总览和执行层连接起来。", "Connects the business overview to the execution layer."),
      localized("适合说明未来 close-loop 运营潜力。", "Helps explain future close-loop operating potential."),
      localized("当前保持 mock/read-only，无审批、过账或采购提交。", "Currently stays mock/read-only with no approvals, posting, or procurement submission."),
    ],
    proofPoints: [
      localized("`/psi`、`/psi/actions`、`/psi/issues` 已存在。", "`/psi`, `/psi/actions`, and `/psi/issues` already exist."),
      localized("PSI 预览已连接到 `/reports`。", "PSI previews already connect to `/reports`."),
      localized("没有供应商门户、任务创建或通知发送。", "There is no supplier portal, task creation, or notification sending."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "report-preview",
    title: localized("报表预览", "Report Preview"),
    description: localized(
      "报表页把 KPI 与 PSI 风险信号汇总为易于展示的只读汇总层。",
      "The reports page summarizes KPI and PSI risk signals into a presentation-friendly read-only recap layer.",
    ),
    kind: "reports",
    tone: "success",
    route: "/reports",
    highlights: [
      localized("适合作为 walkthrough 中段或总结页。", "Works well as a mid-demo checkpoint or closing recap page."),
      localized("把首页 KPI 和 PSI 运营信号串成同一叙事。", "Connects homepage KPI context and PSI operating signals into one story."),
      localized("当前没有真实 BI、导出或调度。", "There is no live BI engine, export, or scheduling yet."),
    ],
    proofPoints: [
      localized("`/reports` 已包含 PSI 预览面板。", "`/reports` already includes a PSI preview panel."),
      localized("报表仍保持 metadata-first 与只读边界。", "Reports remain metadata-first and read-only."),
      localized("没有 SQL 执行、数据库或 API。", "No SQL execution, database, or API is connected."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "demo-story-flow",
    title: localized("Demo Story Flow", "Demo Story Flow"),
    description: localized(
      "Demo Story 把现有路由编排成一个讲述 ME 产品与业务机会的引导顺序。",
      "Demo Story orchestrates existing routes into a guided sequence for explaining the ME product and business opportunity.",
    ),
    kind: "product-layer",
    tone: "info",
    route: "/demo-story",
    highlights: [
      localized("把首页、导航、角色、门店、PSI、报表与基础层连成路线。", "Connects homepage, navigation, roles, branches, PSI, reports, and foundation into one route sequence."),
      localized("帮助销售、评审与内部沟通使用统一讲法。", "Supports a consistent narrative for sales, reviews, and internal communication."),
      localized("当前没有导览引擎或进度持久化。", "There is no guided-tour engine or persisted progress."),
    ],
    proofPoints: [
      localized("`/demo-story` 与 `/demo-story/[stepKey]` 已存在。", "`/demo-story` and `/demo-story/[stepKey]` already exist."),
      localized("步骤数据来自 `config/demo-story.ts`。", "Step data comes from `config/demo-story.ts`."),
      localized("只复用现有路由，不引入运行时控制。", "It only reuses existing routes and adds no runtime control layer."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "demo-mode-screenshot-ready",
    title: localized("Demo Mode / 截图就绪", "Demo Mode / Screenshot Ready"),
    description: localized(
      "Demo Mode 为现有页面增加截图和展示 framing，帮助把 ME 讲成更成熟的产品提案。",
      "Demo Mode adds screenshot and presentation framing to existing pages so ME can be presented like a more mature product proposal.",
    ),
    kind: "product-layer",
    tone: "muted",
    route: "/demo-mode",
    highlights: [
      localized("为首页、导航、角色、门店、PSI、报表与基础层提供讲解顺序。", "Provides framing across homepage, navigation, roles, branches, PSI, reports, and foundation."),
      localized("适合评审截图、提案页与 walkthrough 准备。", "Useful for review screenshots, proposal pages, and walkthrough prep."),
      localized("当前没有真实 Demo Mode 开关或持久设置。", "There is no real Demo Mode toggle or persisted setting."),
    ],
    proofPoints: [
      localized("`/demo-mode` 已存在。", "`/demo-mode` already exists."),
      localized("推荐路线已覆盖主要演示节点。", "The recommended route sequence already covers the main presentation stops."),
      localized("没有分析、追踪或个性化逻辑。", "No analytics, tracking, or personalization logic is connected."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "system-foundation",
    title: localized("系统基础层", "System Foundation"),
    description: localized(
      "系统基础层解释 ME 背后的平台契约、元数据与未来扩展能力，是产品可扩展性的讲解锚点。",
      "System Foundation explains the platform contracts, metadata, and extensibility behind ME as the anchor for the product's future evolution.",
    ),
    kind: "system-foundation",
    tone: "muted",
    route: "/system-foundation",
    highlights: [
      localized("帮助利益相关者理解平台不只是页面集合。", "Helps stakeholders understand that the platform is more than a collection of pages."),
      localized("把展示层映射回可配置的基础能力。", "Maps presentation surfaces back to configurable foundation capabilities."),
      localized("当前保持次级且只读。", "Remains secondary and read-only in the current milestone."),
    ],
    proofPoints: [
      localized("`/system-foundation` 已整合 foundation links。", "`/system-foundation` already consolidates foundation links."),
      localized("相关基础路由继续保持工作。", "Related foundation routes remain working."),
      localized("无真实工作流引擎、通知后端或权限执行。", "There is no live workflow engine, notification backend, or permission enforcement."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "roadmap",
    title: localized("路线图", "Roadmap"),
    description: localized(
      "路线图快照把 v0.8.0 到 v1.0.0 的交付脉络整理成可向 owner、partner 和 investor 说明的里程碑。",
      "The roadmap snapshot organizes delivery from v0.8.0 to v1.0.0 into milestones that are easy to explain to owners, partners, and investors.",
    ),
    kind: "roadmap",
    tone: "info",
    highlights: [
      localized("清楚展示已完成、进行中、计划中与未来阶段。", "Clearly separates completed, in-progress, planned, and future stages."),
      localized("帮助 ME 在评审中建立可信演进节奏。", "Helps ME establish a believable delivery cadence during reviews."),
      localized("当前依旧聚焦展示层，而非真实生产基础设施。", "Still focuses on presentation layers rather than live production infrastructure."),
    ],
    proofPoints: [
      localized("已覆盖 v0.8.0 到 v0.8.5 的已完成阶段。", "Covers completed milestones from v0.8.0 through v0.8.5."),
      localized("v0.8.6 标记为 Stakeholder Summary in-progress。", "Marks v0.8.6 as Stakeholder Summary in-progress."),
      localized("v0.9.x 和 v1.0.0 作为后续规划展示。", "Keeps v0.9.x and v1.0.0 as forward-looking roadmap entries."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "demo-route-map",
    title: localized("演示路由地图", "Demo Route Map"),
    description: localized(
      "演示路由地图把关键页面按 presentation-ready 顺序展示，方便进行高层 walkthrough、评审截图与提案讲解。",
      "The demo route map lays out the key pages in a presentation-ready order for executive walkthroughs, screenshots, and proposal storytelling.",
    ),
    kind: "demo-route-map",
    tone: "info",
    highlights: [
      localized("将首页、Demo Story、Demo Mode 和核心业务页面连成一次讲述路径。", "Connects the homepage, Demo Story, Demo Mode, and core business pages into one storytelling path."),
      localized("帮助主持人快速切换页面，不需要记住散乱路由。", "Helps presenters move quickly without remembering scattered routes."),
      localized("当前仅作为静态链接清单，不做分享记录。", "Acts as a static link sequence only with no sharing records."),
    ],
    proofPoints: [
      localized("覆盖 `/`、`/demo-story`、`/demo-mode`、`/navigation`、`/roles`、`/branches`、`/psi`、`/reports`、`/system-foundation`。", "Covers `/`, `/demo-story`, `/demo-mode`, `/navigation`, `/roles`, `/branches`, `/psi`, `/reports`, and `/system-foundation`."),
      localized("链接直接复用现有可访问路由。", "Links directly reuse existing reachable routes."),
      localized("没有分享权限、访问记录或点击追踪。", "There are no sharing permissions, access logs, or click tracking."),
    ],
    isPlaceholder: true,
  }),
  createCard({
    key: "next-steps",
    title: localized("下一步", "Next Steps"),
    description: localized(
      "下一阶段将从静态展示层迁移到更真实的 API、数据库、导出和分享能力，但这些都仍不在当前范围内。",
      "The next stage can move from static presentation toward more real API, database, export, and sharing capabilities, but those remain out of scope today.",
    ),
    kind: "next-step",
    tone: "muted",
    highlights: [
      localized("先把 ME 讲清楚，再决定何时引入 CRM、数据室或导出。", "Clarify the ME story first, then decide when CRM, data-room, or export capabilities are warranted."),
      localized("未来可演进为分享式 proposal 页面或 investor deck。", "Future work can evolve into a shareable proposal page or investor deck."),
      localized("当前不做用户级状态、同意管理或追踪。", "No user-level state, consent management, or tracking is added now."),
    ],
    proofPoints: [
      localized("路线图中已预留 v0.9.x 与 v1.0.0 阶段。", "The roadmap already reserves v0.9.x and v1.0.0 stages."),
      localized("展示层现已覆盖 stakeholder review 需要的主要路径。", "The presentation layer now covers the key routes needed for stakeholder reviews."),
      localized("当前仍无真实 portal、CRM、API、数据库或分享权限。", "There is still no live portal, CRM, API, database, or sharing permissions."),
    ],
    isPlaceholder: true,
  }),
];

export const meStakeholderRoadmapItems: MeStakeholderRoadmapItem[] = [
  createRoadmapItem({
    key: "v0-8-0-business-workspace",
    title: localized("v0.8.0 业务工作台", "v0.8.0 Business Workspace"),
    description: localized("业务优先首页与系统基础层次级导航完成。", "Business-first homepage and secondary system-foundation navigation completed."),
    status: "completed",
    route: "/",
    tag: "completed",
  }),
  createRoadmapItem({
    key: "v0-8-1-navigation-ia",
    title: localized("v0.8.1 导航 IA", "v0.8.1 Navigation IA"),
    description: localized("共享导航配置与导航展示页完成。", "Shared navigation configuration and navigation showcase completed."),
    status: "completed",
    route: "/navigation",
    tag: "completed",
  }),
  createRoadmapItem({
    key: "v0-8-2-role-workspace",
    title: localized("v0.8.2 角色工作区", "v0.8.2 Role Workspace"),
    description: localized("角色工作区占位与角色详情页完成。", "Role workspace placeholders and role detail routes completed."),
    status: "completed",
    route: "/roles",
    tag: "completed",
  }),
  createRoadmapItem({
    key: "v0-8-3-branch-context",
    title: localized("v0.8.3 门店上下文", "v0.8.3 Branch Context"),
    description: localized("门店上下文占位与门店详情页完成。", "Branch context placeholders and branch detail routes completed."),
    status: "completed",
    route: "/branches",
    tag: "completed",
  }),
  createRoadmapItem({
    key: "v0-8-4-demo-story",
    title: localized("v0.8.4 Demo Story", "v0.8.4 Demo Story"),
    description: localized("引导演示故事流与步骤详情页完成。", "Guided demo story flow and step detail pages completed."),
    status: "completed",
    route: "/demo-story",
    tag: "completed",
  }),
  createRoadmapItem({
    key: "v0-8-5-demo-mode",
    title: localized("v0.8.5 Demo Mode", "v0.8.5 Demo Mode"),
    description: localized("截图就绪展示层与 route framing 完成。", "Screenshot-ready presentation layer and route framing completed."),
    status: "completed",
    route: "/demo-mode",
    tag: "completed",
  }),
  createRoadmapItem({
    key: "v0-8-6-stakeholder-summary",
    title: localized("v0.8.6 Stakeholder Summary", "v0.8.6 Stakeholder Summary"),
    description: localized("面向 owner、investor、partner 与内部团队的静态总结页进行中。", "Static summary page for owners, investors, partners, and internal teams is in progress."),
    status: "in-progress",
    route: "/stakeholder-summary",
    tag: "in-progress",
  }),
  createRoadmapItem({
    key: "v0-9-x-api-database-prep",
    title: localized("v0.9.x API / 数据库准备", "v0.9.x API / Database Preparation"),
    description: localized("为后续真实 API、数据库与服务边界做准备。", "Prepare service boundaries for future real APIs and database connectivity."),
    status: "planned",
    tag: "planned",
  }),
  createRoadmapItem({
    key: "v1-0-0-demo-ready-mvp",
    title: localized("v1.0.0 Demo-ready MVP", "v1.0.0 Demo-ready MVP"),
    description: localized("形成可演示、可扩展、可迁移到真实产品基础设施的 MVP。", "Reach a demo-ready, extensible MVP that can migrate toward real product infrastructure."),
    status: "future",
    tag: "future",
  }),
];

export const meStakeholderDemoRouteMap: MeStakeholderDemoRoute[] = [
  createDemoRoute({
    key: "business-workspace",
    title: localized("业务工作台", "ME Business Workspace"),
    description: localized("从首页业务总览开始讲解。", "Start from the homepage business overview."),
    route: "/",
    tone: "success",
  }),
  createDemoRoute({
    key: "demo-story",
    title: localized("Demo Story", "ME Demo Story"),
    description: localized("查看完整引导演示顺序。", "Open the guided product narrative."),
    route: "/demo-story",
    tone: "info",
  }),
  createDemoRoute({
    key: "demo-mode",
    title: localized("Demo Mode", "ME Demo Mode"),
    description: localized("进入截图就绪展示层。", "Open the screenshot-ready presentation layer."),
    route: "/demo-mode",
    tone: "muted",
  }),
  createDemoRoute({
    key: "navigation-ia",
    title: localized("导航 IA", "ME Navigation IA"),
    description: localized("解释业务导航与基础层结构。", "Explain business navigation and foundation structure."),
    route: "/navigation",
    tone: "info",
  }),
  createDemoRoute({
    key: "role-workspaces",
    title: localized("角色工作区", "ME Role Workspaces"),
    description: localized("从不同角色视角解释平台。", "Explain the platform from multiple role perspectives."),
    route: "/roles",
    tone: "info",
  }),
  createDemoRoute({
    key: "branch-context",
    title: localized("门店上下文", "ME Branch Context"),
    description: localized("说明多门店经营与扩展空间。", "Frame multi-branch operations and expansion."),
    route: "/branches",
    tone: "info",
  }),
  createDemoRoute({
    key: "psi-operations",
    title: localized("PSI 运营层", "ME PSI Operations"),
    description: localized("连接采购、供应商、库存与问题闭环。", "Connect procurement, supplier, inventory, and issue loops."),
    route: "/psi",
    tone: "warning",
  }),
  createDemoRoute({
    key: "reports",
    title: localized("报表预览", "ME Reports Preview"),
    description: localized("总结 KPI 与 PSI 风险信号。", "Summarize KPI and PSI risk signals."),
    route: "/reports",
    tone: "success",
  }),
  createDemoRoute({
    key: "system-foundation",
    title: localized("系统基础层", "ME System Foundation"),
    description: localized("解释未来平台契约与扩展能力。", "Explain future platform contracts and extensibility."),
    route: "/system-foundation",
    tone: "muted",
  }),
];

export const meStakeholderSummaryPageData: MeStakeholderSummaryPageData = {
  title: localized("ME Stakeholder Summary", "ME Stakeholder Summary"),
  subtitle: localized("Investor / Partner / Owner Overview Placeholder", "Investor / Partner / Owner Overview Placeholder"),
  audience: meStakeholderSummaryAudiences,
  metrics: meStakeholderSummaryMetrics,
  cards: meStakeholderSummaryCards,
  roadmap: meStakeholderRoadmapItems,
  demoRoutes: meStakeholderDemoRouteMap,
  generatedAt: meStakeholderSummaryGeneratedAt,
  notice: meStakeholderSummaryNotice,
};
