import type { MeNavigationTone } from "@/types/navigation";

export type RestaurantModuleGroup =
  | "dashboard"
  | "store-operations"
  | "psi"
  | "sales-reports"
  | "people"
  | "food-operations"
  | "finance"
  | "system";

export type RestaurantModuleSurfaceType = "dashboard" | "list" | "detail" | "report" | "config";
export type RestaurantModuleStatus = "ui-preview-only" | "planning-only" | "future-real-data";
export type RestaurantFutureLayerStatus = "planning-only" | "future-real-data";

export interface RestaurantLabel {
  zh: string;
  en: string;
}

export interface RestaurantModuleMetricPreview {
  label: string;
  value: string;
  description: string;
  tone?: MeNavigationTone;
}

export interface RestaurantModuleActionPreview {
  label: string;
  href?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

export interface RestaurantModuleMetaPreview {
  label: string;
  value: string;
}

export interface RestaurantModuleSectionCard {
  title: string;
  value: string;
  description: string;
}

export interface RestaurantModuleTimelineItem {
  title: string;
  description: string;
  time: string;
}

export interface RestaurantModuleRailSection {
  title: string;
  badge?: string;
  items: string[];
}

export type RestaurantModuleSection =
  | {
      kind: "fields";
      title: string;
      description: string;
      fields: RestaurantModuleMetaPreview[];
      asideTitle?: string;
      asideBody?: string;
    }
  | {
      kind: "table";
      title: string;
      description: string;
      columns: string[];
      rows: string[][];
    }
  | {
      kind: "cards";
      title: string;
      description: string;
      cards: RestaurantModuleSectionCard[];
    }
  | {
      kind: "note";
      title: string;
      description: string;
      body: string;
    };

export interface RestaurantModulePreview {
  activeNavKey: string;
  eyebrow: string;
  title: string;
  description: string;
  notice: string;
  badges: Array<{ label: string; variant?: "default" | "secondary" | "outline" }>;
  pageActions: RestaurantModuleActionPreview[];
  meta: RestaurantModuleMetaPreview[];
  recordSummary: {
    title: string;
    subtitle: string;
    status: string;
    guardrail: string;
    meta: RestaurantModuleMetaPreview[];
  };
  actionBar: RestaurantModuleActionPreview[];
  tabs: Array<{ label: string; active?: boolean; badge?: string }>;
  metrics?: RestaurantModuleMetricPreview[];
  filters?: RestaurantModuleMetaPreview[];
  sections: RestaurantModuleSection[];
  timeline?: {
    title: string;
    items: RestaurantModuleTimelineItem[];
  };
  rightRail: RestaurantModuleRailSection[];
  footerNote: string;
}

export interface RestaurantModuleDefinition {
  key: string;
  label: RestaurantLabel;
  route: string;
  group: RestaurantModuleGroup;
  surfaceType: RestaurantModuleSurfaceType;
  description: RestaurantLabel;
  dataLayerNeeded: boolean;
  formulaLayerNeeded: boolean;
  brainLayerNeeded: boolean;
  permissionLayerNeeded: boolean;
  status: RestaurantModuleStatus;
  preview?: RestaurantModulePreview;
}

export const restaurantModuleGroupLabels: Record<RestaurantModuleGroup, RestaurantLabel> = {
  dashboard: { zh: "仪表盘", en: "Dashboard" },
  "store-operations": { zh: "门店运营", en: "Store Operations" },
  psi: { zh: "PSI", en: "PSI" },
  "sales-reports": { zh: "销售与报表", en: "Sales & Reports" },
  people: { zh: "人员", en: "People" },
  "food-operations": { zh: "食品运营", en: "Food Operations" },
  finance: { zh: "财务", en: "Finance" },
  system: { zh: "系统", en: "System" },
};

export const restaurantModules: RestaurantModuleDefinition[] = [
  {
    key: "dashboard",
    label: { zh: "业务工作台", en: "Business Workspace" },
    route: "/",
    group: "dashboard",
    surfaceType: "dashboard",
    description: { zh: "餐饮集团业务工作台首页。", en: "Restaurant group business workspace home." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: false,
    status: "ui-preview-only",
  },
  {
    key: "branches",
    label: { zh: "门店", en: "Branches" },
    route: "/branches",
    group: "store-operations",
    surfaceType: "detail",
    description: { zh: "门店上下文与门店运营详情。", en: "Branch context and store operations detail." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "inspection",
    label: { zh: "巡检", en: "Inspection" },
    route: "/inspection",
    group: "store-operations",
    surfaceType: "list",
    description: { zh: "巡检列表、检查项与整改预览。", en: "Inspection lists, checklist preview, and corrective context." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "inspection",
      eyebrow: "Inspection",
      title: "Branch inspection and audit workspace",
      description: "Inspection queue, checklist preview, findings, and branch audit context inside the shared operations shell.",
      notice: "UI preview only. No inspection submission, no checklist writes, no corrective-task execution, and no workflow runtime are connected.",
      badges: [{ label: "Inspection" }, { label: "Audit workspace", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Branches", href: "/branches" },
        { label: "Open Issues", href: "/issues", variant: "outline" },
        { label: "Open Tasks", href: "/tasks", variant: "outline" },
      ],
      meta: [
        { label: "Branch scope", value: "KCH / BTU" },
        { label: "Window", value: "This week" },
        { label: "Checklist", value: "Food safety / operations" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "INSP-KCH-240507",
        subtitle: "Branch inspection preview",
        status: "Review Needed",
        guardrail: "Current service scope",
        meta: [
          { label: "Branch", value: "KCH" },
          { label: "Audit score", value: "86 / 100" },
          { label: "Lead", value: "Operations QA" },
          { label: "Findings", value: "3 open" },
          { label: "Checklist set", value: "Kitchen / Storage / Floor" },
          { label: "Last reviewed", value: "Today 15:05" },
        ],
      },
      actionBar: [
        { label: "Review Inspection", href: "#" },
        { label: "Open Findings", href: "#", variant: "secondary" },
        { label: "Export Summary", href: "#", variant: "outline" },
        { label: "Assign Follow-up", href: "#", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Checklist" },
        { label: "Findings", badge: "3" },
        { label: "Corrective Actions" },
        { label: "Activity" },
      ],
      metrics: [
        { label: "Open inspections", value: "4", description: "Branch-level reviews currently visible in the audit queue." },
        { label: "Average score", value: "89", description: "Preview-only branch audit score average for the active window." },
        { label: "Critical findings", value: "1", description: "One critical finding remains active for KCH review." },
      ],
      filters: [
        { label: "Branch", value: "KCH" },
        { label: "Inspection type", value: "Food safety" },
        { label: "Status", value: "Review needed" },
        { label: "Window", value: "This week" },
      ],
      sections: [
        {
          kind: "table",
          title: "Inspection Queue",
          description: "Open inspections currently visible to store operations and QA review.",
          columns: ["Inspection", "Branch", "Type", "Score", "Status"],
          rows: [
            ["INSP-KCH-240507", "KCH", "Food safety", "86", "Review Needed"],
            ["INSP-BTU-240506", "BTU", "Storage", "92", "Monitoring"],
            ["INSP-HQ-240505", "All Stores", "Operations", "89", "Portfolio Review"],
          ],
        },
        {
          kind: "fields",
          title: "Checklist Preview",
          description: "Inspection checklist fields used to frame audit coverage.",
          fields: [
            { label: "Kitchen prep line", value: "Pass" },
            { label: "Cold storage temperature", value: "Watch" },
            { label: "Expiry label presence", value: "Pass" },
            { label: "Sanitation close", value: "Review Needed" },
            { label: "Receiving bay check", value: "Pass" },
            { label: "Manager sign-off", value: "Pending review" },
          ],
          asideTitle: "Inspection Note",
          asideBody: "This panel is a checklist preview only. No inspection form submission, no branch scoring engine, and no corrective task creation are executed from this UI.",
        },
        {
          kind: "table",
          title: "Findings",
          description: "Findings remain visible without creating any downstream workflow actions.",
          columns: ["Finding", "Severity", "Area", "Suggested Follow-up"],
          rows: [
            ["Missing freezer label", "High", "Storage", "Open expiry workspace"],
            ["Receiving log gap", "Medium", "Backroom", "Review receiving checklist"],
            ["Cleaning sign-off late", "Low", "Kitchen", "Manager review"],
          ],
        },
      ],
      timeline: {
        title: "Inspection Activity",
        items: [
          { title: "Inspection started", description: "KCH weekly audit frame opened in the preview workspace.", time: "09:10" },
          { title: "Finding linked", description: "Expiry-label issue attached to the KCH audit record.", time: "10:35" },
          { title: "Score updated", description: "Preview score changed to 86 after checklist review.", time: "13:05" },
          { title: "Awaiting QA review", description: "Audit record remains visible for branch review only.", time: "15:05" },
        ],
      },
      rightRail: [
        { title: "Audit Context", badge: "KCH", items: ["Weekly audit window", "Food safety + operations mix", "Corrective actions remain under review"] },
        { title: "Open Findings", items: ["1 critical watch item", "2 medium/low findings", "No task generation runtime"] },
        { title: "Service Scope", badge: "Current release", items: ["Checklist review", "Finding visibility", "Follow-up coordination"] },
      ],
      footerNote: "Inspection remains a visual operations workspace only. No checklist engine, no corrective-action execution, and no write path were added.",
    },
  },
  {
    key: "issues",
    label: { zh: "问题", en: "Issues" },
    route: "/issues",
    group: "store-operations",
    surfaceType: "list",
    description: { zh: "跨模块问题与事件管理。", en: "Cross-module issue and incident management." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "issues",
      eyebrow: "Issue Management",
      title: "Cross-module issue and incident queue",
      description: "Issue severity filters, linked modules, incident preview, and timeline context across operations.",
      notice: "UI preview only. No issue writes, no task creation, no escalation execution, and no notification runtime are connected.",
      badges: [{ label: "Issues" }, { label: "Incident workspace", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Inspection", href: "/inspection" },
        { label: "Open PSI Issues", href: "/psi/issues", variant: "outline" },
        { label: "Open Branches", href: "/branches", variant: "outline" },
      ],
      meta: [
        { label: "Scope", value: "Store operations / PSI / Food safety" },
        { label: "Open queue", value: "9 items" },
        { label: "Critical", value: "2" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "ISS-KCH-009",
        subtitle: "Cold chain label gap",
        status: "Open / High",
        guardrail: "Current service scope",
        meta: [
          { label: "Branch", value: "KCH" },
          { label: "Module", value: "Expiry / Inspection" },
          { label: "Owner", value: "Operations QA" },
          { label: "Linked task", value: "Task coordination queue" },
          { label: "Raised", value: "Today 10:35" },
          { label: "Current state", value: "Awaiting branch review" },
        ],
      },
      actionBar: [
        { label: "Review Issue", href: "#" },
        { label: "Open Queue", href: "#", variant: "secondary" },
        { label: "Link Branch", href: "#", variant: "outline" },
        { label: "View History", href: "#", variant: "outline" },
        { label: "Escalation Preview", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Related Records" },
        { label: "Timeline" },
        { label: "Corrective Links" },
        { label: "Attachments" },
      ],
      filters: [
        { label: "Severity", value: "High" },
        { label: "Status", value: "Open" },
        { label: "Branch", value: "KCH" },
        { label: "Source", value: "Inspection / Expiry" },
      ],
      sections: [
        {
          kind: "table",
          title: "Issue Queue",
          description: "Cross-module issues surfaced for review inside the shared operations shell.",
          columns: ["Issue", "Severity", "Branch", "Linked Module", "Status"],
          rows: [
            ["Cold chain label gap", "High", "KCH", "Expiry", "Open"],
            ["Receiving note mismatch", "Medium", "BTU", "PSI", "Watch"],
            ["Training certification gap", "Medium", "KCH", "Training", "Review Needed"],
          ],
        },
        {
          kind: "fields",
          title: "Issue Detail",
          description: "Structured record summary for the selected incident preview.",
          fields: [
            { label: "Issue ID", value: "ISS-KCH-009" },
            { label: "Category", value: "Food safety / label" },
            { label: "Linked branch", value: "KCH" },
            { label: "Raised by", value: "Inspection preview" },
            { label: "Suggested next step", value: "Review expiry label workspace" },
            { label: "Workflow target", value: "Planning-only" },
          ],
          asideTitle: "Issue Note",
          asideBody: "This page shows issue detail and linkage only. It does not create tasks, send notifications, or run escalation logic.",
        },
      ],
      timeline: {
        title: "Issue Timeline",
        items: [
          { title: "Issue raised", description: "Cold chain label gap detected during inspection preview.", time: "10:35" },
          { title: "Expiry workspace linked", description: "Label-log preview attached for traceability context.", time: "10:42" },
          { title: "Branch review requested", description: "Issue remains visible for KCH operating review.", time: "11:18" },
        ],
      },
      rightRail: [
        { title: "Severity Context", badge: "High", items: ["Food safety adjacency", "Linked to branch KCH", "No escalation automation"] },
        { title: "Related Links", items: ["Expiry label preview", "Inspection record preview", "Task creation remains disabled"] },
        { title: "Service Scope", badge: "Current release", items: ["Issue review", "Branch follow-up", "Cross-module coordination"] },
      ],
      footerNote: "Issue management is rendered as an operational queue and detail preview only. No corrective workflow, notification sending, or task creation was added.",
    },
  },
  {
    key: "tasks",
    label: { zh: "任务", en: "Tasks" },
    route: "/tasks",
    group: "store-operations",
    surfaceType: "list",
    description: { zh: "任务队列与闭环执行页面。", en: "Task queue and close-loop execution page." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "psi-workspace",
    label: { zh: "PSI 工作区", en: "PSI Workspace" },
    route: "/psi",
    group: "psi",
    surfaceType: "detail",
    description: { zh: "采购、供应商、库存主工作区。", en: "Primary procurement, supplier, and inventory workspace." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "procurement",
    label: { zh: "采购", en: "Procurement" },
    route: "/psi/procurement",
    group: "psi",
    surfaceType: "detail",
    description: { zh: "采购请求详情工作区。", en: "Procurement request detail workspace." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "supplier",
    label: { zh: "供应商", en: "Supplier" },
    route: "/psi/supplier",
    group: "psi",
    surfaceType: "detail",
    description: { zh: "供应商档案与问题视图。", en: "Supplier profile and issue view." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "inventory",
    label: { zh: "库存", en: "Inventory" },
    route: "/psi/inventory",
    group: "psi",
    surfaceType: "detail",
    description: { zh: "库存单品与风险视图。", en: "Inventory item and risk view." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "psi-issues",
    label: { zh: "PSI 问题", en: "PSI Issues" },
    route: "/psi/issues",
    group: "psi",
    surfaceType: "list",
    description: { zh: "PSI 相关问题队列。", en: "PSI-related issue queue." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "psi-actions",
    label: { zh: "PSI 动作", en: "PSI Actions" },
    route: "/psi/actions",
    group: "psi",
    surfaceType: "config",
    description: { zh: "PSI 动作契约与占位动作。", en: "PSI action contracts and placeholder actions." },
    dataLayerNeeded: false,
    formulaLayerNeeded: false,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "reports",
    label: { zh: "报表", en: "Reports" },
    route: "/reports",
    group: "sales-reports",
    surfaceType: "report",
    description: { zh: "跨模块报表工作区。", en: "Cross-module reporting workspace." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "pos-reports",
    label: { zh: "POS 报表", en: "POS Reports" },
    route: "/reports/pos",
    group: "sales-reports",
    surfaceType: "report",
    description: { zh: "POS 销售日报与门店销量预览。", en: "POS daily sales and branch sales preview." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "pos-reports",
      eyebrow: "POS Reports",
      title: "POS sales and branch performance preview",
      description: "Daily POS snapshot, branch sales view, export readiness, and reporting context inside the shared report shell.",
      notice: "UI preview only. No POS integration, no payment feed, no accounting sync, and no export engine are connected.",
      badges: [{ label: "POS Reports" }, { label: "Sales workspace", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Reports", href: "/reports" },
        { label: "Open Branches", href: "/branches", variant: "outline" },
        { label: "Open Finance", href: "/finance", variant: "outline" },
      ],
      meta: [
        { label: "Period", value: "Today / Last 7 days" },
        { label: "Branch set", value: "KCH / BTU / All Stores" },
        { label: "Source", value: "POS catalog layer" },
        { label: "Exports", value: "Scheduled distribution" },
      ],
      recordSummary: {
        title: "POS Daily Snapshot",
        subtitle: "Sales report preview",
        status: "Monitoring",
        guardrail: "Current service scope",
        meta: [
          { label: "Lead branch", value: "KCH" },
          { label: "Sales day", value: "Today" },
          { label: "Snapshot", value: "13:30 cutoff" },
          { label: "Variance watch", value: "2 branches" },
          { label: "Margin preview", value: "Finance-linked" },
          { label: "Exports", value: "Scheduled distribution" },
        ],
      },
      actionBar: [
        { label: "Refresh Preview", href: "#" },
        { label: "Open Branch Performance", href: "#", variant: "secondary" },
        { label: "Export Snapshot", href: "#", variant: "outline" },
        { label: "Open Finance", href: "/finance", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Daily Sales" },
        { label: "Branch Variance" },
        { label: "Items" },
        { label: "Exports" },
      ],
      metrics: [
        { label: "Gross sales", value: "RM 42.8k", description: "Preview-only aggregate across selected branches." },
        { label: "Transactions", value: "812", description: "Transaction volume for the active sales window." },
        { label: "Branch variance", value: "2", description: "Two branches remain on the review watchlist." },
      ],
      filters: [
        { label: "Branch", value: "All Stores" },
        { label: "Period", value: "Today" },
        { label: "Metric", value: "Sales / Margin preview" },
        { label: "Export", value: "Disabled" },
      ],
      sections: [
        {
          kind: "table",
          title: "Daily Sales Snapshot",
          description: "Compact POS reporting preview with branch-by-branch daily sales rows.",
          columns: ["Branch", "Gross Sales", "Transactions", "Avg Ticket", "Status"],
          rows: [
            ["KCH", "RM 18.6k", "344", "RM 54.10", "Monitoring"],
            ["BTU", "RM 13.9k", "268", "RM 51.87", "Stable"],
            ["All Stores", "RM 42.8k", "812", "RM 52.71", "Preview Only"],
          ],
        },
        {
          kind: "cards",
          title: "Computed Metric Preview",
          description: "Current workspace indicators for margin, variance, and export readiness.",
          cards: [
            { title: "Sales variance", value: "+4.8%", description: "Versus same-day operating baseline for the current branch set." },
            { title: "Gross margin outlook", value: "31.2%", description: "Finance-linked commercial view for branch leadership." },
            { title: "Export readiness", value: "Scheduled", description: "Export center is prepared for scheduled distribution." },
          ],
        },
      ],
      timeline: {
        title: "Report Activity",
        items: [
          { title: "POS snapshot assembled", description: "Daily sales preview refreshed from static planning metadata.", time: "09:00" },
          { title: "Branch variance flagged", description: "KCH and BTU variance watch remains visible for review.", time: "11:10" },
          { title: "Finance link reviewed", description: "Cost and margin preview remains connected as metadata only.", time: "13:30" },
        ],
      },
      rightRail: [
        { title: "Report Readiness", badge: "Scheduled", items: ["POS sales catalog", "Export center routing", "Branch variance review"] },
        { title: "Related Surfaces", items: ["Reports workspace", "Finance preview", "Branch operations"] },
        { title: "Service Scope", badge: "Current release", items: ["Sales review", "Branch comparison", "Scheduled distribution setup"] },
      ],
      footerNote: "POS reporting remains a UI/report shell only. No POS integration, no export engine, and no financial close logic were added.",
    },
  },
  {
    key: "staff",
    label: { zh: "员工 / HR", en: "Staff / HR" },
    route: "/staff",
    group: "people",
    surfaceType: "detail",
    description: { zh: "员工档案、技能矩阵与门店分配视图。", en: "Staff profile, skill matrix, and branch assignment view." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "staff",
      eyebrow: "Staff / HR",
      title: "Staff roster and profile operations workspace",
      description: "Staff list, branch assignment, skill matrix, and training status using the shared operations detail pattern.",
      notice: "UI preview only. No HR writes, no attendance sync, no payroll integration, and no permission enforcement are connected.",
      badges: [{ label: "Staff / HR" }, { label: "Roster workspace", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Schedule", href: "/schedule" },
        { label: "Open Training", href: "/training", variant: "outline" },
        { label: "Open Roles", href: "/roles", variant: "outline" },
      ],
      meta: [
        { label: "Branch scope", value: "KCH / BTU" },
        { label: "Current mode", value: "Roster preview" },
        { label: "Attendance", value: "Attendance review" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "STF-KCH-014",
        subtitle: "Kitchen lead profile",
        status: "Active",
        guardrail: "Current service scope",
        meta: [
          { label: "Name", value: "Alicia Tan" },
          { label: "Role", value: "Kitchen Lead" },
          { label: "Branch", value: "KCH" },
          { label: "Skill level", value: "Advanced" },
          { label: "Training", value: "2 records pending review" },
          { label: "Last updated", value: "Today 14:10" },
        ],
      },
      actionBar: [
        { label: "Review Profile", href: "#" },
        { label: "Open Schedule", href: "/schedule", variant: "secondary" },
        { label: "View Training", href: "/training", variant: "outline" },
        { label: "Export Profile", href: "#", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Skills" },
        { label: "Assignments" },
        { label: "Training" },
        { label: "Attendance" },
      ],
      metrics: [
        { label: "Visible staff", value: "24", description: "Preview-only headcount across the active branch set." },
        { label: "Training watch", value: "6", description: "Staff records with pending training review or refresh." },
        { label: "Open schedule gaps", value: "3", description: "Coverage gaps passed through as planning metadata only." },
      ],
      filters: [
        { label: "Branch", value: "KCH" },
        { label: "Role family", value: "Kitchen / Service" },
        { label: "Status", value: "Active" },
        { label: "Training", value: "Watch items" },
      ],
      sections: [
        {
          kind: "table",
          title: "Staff List",
          description: "Compact roster list for branch-level staffing review.",
          columns: ["Staff", "Role", "Branch", "Skills", "Training"],
          rows: [
            ["Alicia Tan", "Kitchen Lead", "KCH", "Advanced", "2 pending"],
            ["Ben Lee", "Service Captain", "KCH", "Intermediate", "Up to date"],
            ["Chris Wong", "Prep Crew", "BTU", "Intermediate", "1 refresher"],
          ],
        },
        {
          kind: "fields",
          title: "Profile Detail",
          description: "Selected staff profile fields kept separate from future HR or permission logic.",
          fields: [
            { label: "Staff ID", value: "STF-KCH-014" },
            { label: "Primary station", value: "Kitchen line 1" },
            { label: "Secondary station", value: "Receiving assist" },
            { label: "Current branch", value: "KCH" },
            { label: "Assigned role", value: "Kitchen Lead" },
            { label: "Attendance overview", value: "Current review" },
          ],
          asideTitle: "Profile Note",
          asideBody: "Staff profile details remain UI-only. No HR records are edited here, and there is no attendance, payroll, or identity synchronization.",
        },
        {
          kind: "table",
          title: "Role / Skill Matrix",
          description: "Skill and training coverage matrix for local operating review.",
          columns: ["Skill Area", "Current Level", "Required", "Status"],
          rows: [
            ["Kitchen SOP", "Advanced", "Advanced", "Aligned"],
            ["Receiving QA", "Intermediate", "Intermediate", "Aligned"],
            ["Food safety audit", "Intermediate", "Advanced", "Gap watch"],
          ],
        },
      ],
      timeline: {
        title: "Staff Activity",
        items: [
          { title: "Roster synced into preview", description: "Alicia Tan remains visible in KCH active roster metadata.", time: "08:30" },
          { title: "Training watch linked", description: "Food safety refresher record attached to profile preview.", time: "10:20" },
          { title: "Schedule gap surfaced", description: "Schedule preview linked a kitchen lead coverage gap for Friday.", time: "14:10" },
        ],
      },
      rightRail: [
        { title: "Roster Context", badge: "KCH", items: ["Kitchen + service mix", "Branch assignment visible", "No HR record writes"] },
        { title: "Training Watch", items: ["2 pending reviews", "1 refresher due soon", "No course engine connected"] },
        { title: "Service Scope", badge: "Current release", items: ["Roster review", "Training linkage", "Branch assignment"] },
      ],
      footerNote: "Staff / HR is rendered as a roster and profile workspace only. No HR system, no attendance writes, and no identity/permission enforcement were added.",
    },
  },
  {
    key: "schedule",
    label: { zh: "排班", en: "Schedule" },
    route: "/schedule",
    group: "people",
    surfaceType: "list",
    description: { zh: "班表、班次与站位覆盖预览。", en: "Roster, shift, and duty-station coverage preview." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "schedule",
      eyebrow: "Schedule / Roster",
      title: "Schedule coverage and shift preview workspace",
      description: "Week selector, branch context, shift cards, and coverage summary using a shared list/detail operations pattern.",
      notice: "UI preview only. No schedule write actions, no auto-generation algorithm, no leave sync, and no staffing workflow execution are connected.",
      badges: [{ label: "Schedule" }, { label: "Roster workspace", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Staff", href: "/staff" },
        { label: "Open Training", href: "/training", variant: "outline" },
        { label: "Open Branches", href: "/branches", variant: "outline" },
      ],
      meta: [
        { label: "Branch", value: "KCH" },
        { label: "Week", value: "May 6 - May 12" },
        { label: "Coverage mode", value: "Current roster view" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "KCH Week Roster",
        subtitle: "Shift coverage preview",
        status: "Coverage Watch",
        guardrail: "Current service scope",
        meta: [
          { label: "Branch", value: "KCH" },
          { label: "Week window", value: "May 6 - May 12" },
          { label: "Coverage gaps", value: "3" },
          { label: "Unavailable staff", value: "2" },
          { label: "Lead owner", value: "Store manager" },
          { label: "Last reviewed", value: "Today 16:00" },
        ],
      },
      actionBar: [
        { label: "Review Coverage", href: "#" },
        { label: "Open Staff", href: "/staff", variant: "secondary" },
        { label: "View Duty Stations", href: "#", variant: "outline" },
        { label: "Export Week View", href: "#", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Shift Grid" },
        { label: "Stations" },
        { label: "Availability" },
        { label: "Activity" },
      ],
      metrics: [
        { label: "Visible shifts", value: "28", description: "Total preview shifts shown across the current week roster." },
        { label: "Coverage gaps", value: "3", description: "Planning-only gaps with no assignment execution." },
        { label: "Off requests", value: "2", description: "Availability watch items remain metadata-only." },
      ],
      filters: [
        { label: "Week", value: "May 6 - May 12" },
        { label: "Branch", value: "KCH" },
        { label: "Station", value: "Kitchen / Service" },
        { label: "Coverage", value: "Watch gaps" },
      ],
      sections: [
        {
          kind: "cards",
          title: "Coverage Summary",
          description: "High-level coverage indicators for the selected branch-week roster.",
          cards: [
            { title: "Kitchen line", value: "2 gaps", description: "Friday dinner and Sunday lunch remain uncovered in the preview." },
            { title: "Service floor", value: "Aligned", description: "Primary service coverage appears stable for the week." },
            { title: "Receiving / QA", value: "Watch", description: "Receiving support depends on cross-station assignment." },
          ],
        },
        {
          kind: "table",
          title: "Shift Grid Preview",
          description: "Compact shift schedule with branch, station, and availability context.",
          columns: ["Staff", "Day", "Shift", "Station", "Status"],
          rows: [
            ["Alicia Tan", "Fri", "09:00-18:00", "Kitchen line 1", "Assigned"],
            ["Ben Lee", "Fri", "11:00-20:00", "Service captain", "Assigned"],
            ["Open slot", "Sun", "10:00-17:00", "Kitchen line 2", "Coverage Gap"],
          ],
        },
        {
          kind: "table",
          title: "Availability and Duty Stations",
          description: "Preview-only availability rows and duty station assignments.",
          columns: ["Staff", "Availability", "Primary Station", "Backup"],
          rows: [
            ["Alicia Tan", "Available", "Kitchen line 1", "Receiving QA"],
            ["Chris Wong", "Unavailable Sun", "Prep station", "Kitchen line 2"],
            ["Dina Lim", "Available", "Service floor", "Cashier"],
          ],
        },
      ],
      timeline: {
        title: "Schedule Activity",
        items: [
          { title: "Week preview opened", description: "KCH weekly roster metadata loaded into the shared workspace.", time: "09:00" },
          { title: "Gap surfaced", description: "Sunday kitchen line coverage gap marked for preview-only review.", time: "12:15" },
          { title: "Availability note linked", description: "Unavailable staff note attached to the duty station preview.", time: "16:00" },
        ],
      },
      rightRail: [
        { title: "Coverage Watch", badge: "3 gaps", items: ["Friday dinner gap", "Sunday lunch gap", "Receiving support dependency"] },
        { title: "Availability", items: ["2 off/unavailable rows", "No leave system sync", "No schedule generation runtime"] },
        { title: "Service Scope", badge: "Current release", items: ["Coverage review", "Shift coordination", "Branch staffing visibility"] },
      ],
      footerNote: "Schedule / Roster is rendered as a coverage preview only. No scheduling algorithm, no shift persistence, and no notification workflow were added.",
    },
  },
  {
    key: "roles",
    label: { zh: "角色", en: "Roles" },
    route: "/roles",
    group: "people",
    surfaceType: "config",
    description: { zh: "角色与权限预览。", en: "Role and permission preview." },
    dataLayerNeeded: true,
    formulaLayerNeeded: false,
    brainLayerNeeded: false,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
  },
  {
    key: "training",
    label: { zh: "培训", en: "Training" },
    route: "/training",
    group: "people",
    surfaceType: "list",
    description: { zh: "课程、记录与技能差距预览。", en: "Courses, records, and skill-gap preview." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "training",
      eyebrow: "Training / Education",
      title: "Training records and skill completion workspace",
      description: "Course list, staff progress table, SOP-linked training records, and gap context across branches.",
      notice: "UI preview only. No training engine, no certification write behavior, and no automated course assignment are connected.",
      badges: [{ label: "Training" }, { label: "Skill coverage", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Staff", href: "/staff" },
        { label: "Open SOP", href: "/sop", variant: "outline" },
        { label: "Open Roles", href: "/roles", variant: "outline" },
      ],
      meta: [
        { label: "Branch scope", value: "All Stores / KCH" },
        { label: "Course set", value: "Ops / Food safety / SOP" },
        { label: "Completion view", value: "Current completion view" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "TRN-KCH-SOP-004",
        subtitle: "Kitchen SOP refresher",
        status: "In Review",
        guardrail: "Current service scope",
        meta: [
          { label: "Course", value: "Kitchen SOP refresher" },
          { label: "Branch", value: "KCH" },
          { label: "Owner", value: "Training lead" },
          { label: "Target role", value: "Kitchen crew" },
          { label: "Progress", value: "78%" },
          { label: "Last updated", value: "Today 13:40" },
        ],
      },
      actionBar: [
        { label: "Review Course", href: "#" },
        { label: "Open Staff Progress", href: "#", variant: "secondary" },
        { label: "Open SOP", href: "/sop", variant: "outline" },
        { label: "Export Record", href: "#", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Courses" },
        { label: "Staff Progress" },
        { label: "SOP Links" },
        { label: "Activity" },
      ],
      metrics: [
        { label: "Active courses", value: "12", description: "Visible course shells across operations and food safety." },
        { label: "Completion watch", value: "8", description: "Staff records below target completion thresholds." },
        { label: "SOP-linked records", value: "5", description: "Courses linked to SOP / recipe preview assets." },
      ],
      filters: [
        { label: "Role", value: "Kitchen crew" },
        { label: "Branch", value: "KCH" },
        { label: "Status", value: "In review" },
        { label: "Source", value: "SOP-linked" },
      ],
      sections: [
        {
          kind: "table",
          title: "Course List",
          description: "Training modules visible inside the shared people-operations workspace.",
          columns: ["Course", "Role", "Branch Scope", "Status", "Completion"],
          rows: [
            ["Kitchen SOP refresher", "Kitchen crew", "KCH", "In Review", "78%"],
            ["Cold chain handling", "Warehouse", "All Stores", "Watch", "64%"],
            ["Service recovery basics", "Service floor", "BTU", "Aligned", "92%"],
          ],
        },
        {
          kind: "table",
          title: "Staff Progress",
          description: "Compact training-progress table without introducing a real training engine.",
          columns: ["Staff", "Course", "Progress", "Gap"],
          rows: [
            ["Alicia Tan", "Kitchen SOP refresher", "92%", "None"],
            ["Chris Wong", "Cold chain handling", "61%", "Assessment pending"],
            ["Dina Lim", "Service recovery basics", "88%", "Refresh next month"],
          ],
        },
        {
          kind: "fields",
          title: "SOP / Record Preview",
          description: "Record metadata tying training shells to SOP and product-standard previews.",
          fields: [
            { label: "Linked SOP", value: "SOP-KITCHEN-014" },
            { label: "Record type", value: "Refresher" },
            { label: "Assessment", value: "Assessment review" },
            { label: "Skill gap rule", value: "Planning-only" },
            { label: "Branch applicability", value: "KCH / BTU" },
            { label: "Next checkpoint", value: "Next week" },
          ],
          asideTitle: "Training Note",
          asideBody: "Training records remain UI-only previews. No course engine, no completion writeback, and no recommendation workflow are running.",
        },
      ],
      timeline: {
        title: "Training Activity",
        items: [
          { title: "Course refreshed", description: "Kitchen SOP refresher remains linked to the food-operations shell.", time: "09:05" },
          { title: "Progress watch surfaced", description: "Cold chain handling completion gap remains visible for warehouse staff.", time: "11:20" },
          { title: "Assessment review completed", description: "Training lead reviewed the current completion status.", time: "13:40" },
        ],
      },
      rightRail: [
        { title: "Training Gap", badge: "8 watch", items: ["Cold chain handling gap", "Kitchen refresher review", "No auto assignment engine"] },
        { title: "Related Surfaces", items: ["Staff / HR", "SOP / Recipes", "Roles / access preview"] },
        { title: "Service Scope", badge: "Current release", items: ["Course review", "Training progress", "Skill-gap follow-up"] },
      ],
      footerNote: "Training remains a people-operations preview only. No training engine, no course assignment workflow, and no record persistence were added.",
    },
  },
  {
    key: "sop",
    label: { zh: "SOP / Recipes", en: "SOP / Recipes" },
    route: "/sop",
    group: "food-operations",
    surfaceType: "detail",
    description: { zh: "SOP、配方与产品标准预览。", en: "SOP, recipe, and product-standard preview." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "sop",
      eyebrow: "SOP / Recipes",
      title: "SOP, recipe, and product standard workspace",
      description: "Operational SOP list, recipe detail preview, and product-standard context for restaurant execution.",
      notice: "UI preview only. No recipe engine, no ingredient write behavior, no product release workflow, and no POS link are connected.",
      badges: [{ label: "SOP / Recipes" }, { label: "Product standards", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Training", href: "/training" },
        { label: "Open Expiry", href: "/expiry", variant: "outline" },
        { label: "Open Finance", href: "/finance", variant: "outline" },
      ],
      meta: [
        { label: "Category", value: "Kitchen / Product standard" },
        { label: "Branch scope", value: "All Stores" },
        { label: "Versioning", value: "Current version set" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "SOP-KITCHEN-014",
        subtitle: "Chicken broth standard",
        status: "Active",
        guardrail: "Current service scope",
        meta: [
          { label: "Product", value: "Chicken broth" },
          { label: "Version", value: "v1.4" },
          { label: "Owner", value: "Food operations" },
          { label: "Branch applicability", value: "All Stores" },
          { label: "Linked training", value: "Kitchen SOP refresher" },
          { label: "Last updated", value: "Today 12:20" },
        ],
      },
      actionBar: [
        { label: "Review SOP", href: "#" },
        { label: "Open Training", href: "/training", variant: "secondary" },
        { label: "View Recipe Spec", href: "#", variant: "outline" },
        { label: "Export Standard", href: "#", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Recipe" },
        { label: "Standards" },
        { label: "Training Links" },
        { label: "Activity" },
      ],
      metrics: [
        { label: "Visible SOPs", value: "18", description: "Shared food-operations documents in the UI preview catalog." },
        { label: "Version watch", value: "3", description: "Items with pending refresh or review markers." },
        { label: "Linked trainings", value: "5", description: "SOP records linked to training previews." },
      ],
      filters: [
        { label: "Category", value: "Kitchen" },
        { label: "Status", value: "Active" },
        { label: "Branch", value: "All Stores" },
        { label: "Version", value: "Latest preview" },
      ],
      sections: [
        {
          kind: "table",
          title: "SOP Catalog",
          description: "Compact list of SOP and recipe items visible to food operations.",
          columns: ["Document", "Type", "Owner", "Version", "Status"],
          rows: [
            ["Chicken broth standard", "Recipe SOP", "Food operations", "v1.4", "Active"],
            ["Freezer labeling guide", "Storage SOP", "QA", "v1.1", "Watch"],
            ["Receiving quality checklist", "Receiving SOP", "Warehouse", "v1.0", "Operations Review"],
          ],
        },
        {
          kind: "fields",
          title: "Recipe / Product Standard",
          description: "Selected recipe-standard metadata separated from any future formula engine.",
          fields: [
            { label: "Yield", value: "30 portions" },
            { label: "Core ingredients", value: "Broth base / aromatics / garnish" },
            { label: "QC target", value: "Temperature + taste alignment" },
            { label: "Cost estimate", value: "Finance preview linked" },
            { label: "Branch exceptions", value: "None" },
            { label: "Workflow state", value: "Planning-only" },
          ],
          asideTitle: "SOP Note",
          asideBody: "SOP and recipe values remain display metadata only. No formula engine, no cost calculation runtime, and no product governance workflow are executed here.",
        },
        {
          kind: "table",
          title: "Ingredient / Spec Table",
          description: "Preview-only ingredient/spec rows for operational reference.",
          columns: ["Input", "Spec", "Unit", "Status"],
          rows: [
            ["Broth base", "Filtered / 12L batch", "Batch", "Aligned"],
            ["Chicken trim", "Fresh daily input", "kg", "Review supplier cost"],
            ["Garnish pack", "Portion standard", "Pack", "Aligned"],
          ],
        },
      ],
      timeline: {
        title: "SOP Activity",
        items: [
          { title: "Standard refreshed", description: "Chicken broth standard version remains active in the preview catalog.", time: "08:40" },
          { title: "Training link reviewed", description: "Kitchen SOP refresher remains attached to this record.", time: "11:25" },
          { title: "Finance linkage reviewed", description: "Cost estimate surfaced for finance review.", time: "12:20" },
        ],
      },
      rightRail: [
        { title: "Standard Context", badge: "Active", items: ["All-store applicability", "Training linkage visible", "Versioning remains metadata-only"] },
        { title: "Related Modules", items: ["Training", "Finance", "Expiry / Labels"] },
        { title: "Service Scope", badge: "Current release", items: ["Standard review", "Training linkage", "Recipe governance"] },
      ],
      footerNote: "SOP / Recipes remains a food-operations preview only. No recipe engine, no cost formulas, and no product workflow execution were added.",
    },
  },
  {
    key: "expiry",
    label: { zh: "保质期 / 标签", en: "Expiry / Labels" },
    route: "/expiry",
    group: "food-operations",
    surfaceType: "detail",
    description: { zh: "保质期观察、标签日志与食品安全预览。", en: "Expiry watch, label logs, and food-safety preview." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "expiry",
      eyebrow: "Expiry / Labels",
      title: "Expiry watch and label log workspace",
      description: "Label log table, expiry watchlist, print preparation, and storage-status context for food safety operations.",
      notice: "UI preview only. No printer connection, no barcode engine, no label writeback, and no food-safety escalation runtime are connected.",
      badges: [{ label: "Expiry / Labels" }, { label: "Food safety workspace", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Inspection", href: "/inspection" },
        { label: "Open SOP", href: "/sop", variant: "outline" },
        { label: "Open Issues", href: "/issues", variant: "outline" },
      ],
      meta: [
        { label: "Scope", value: "Freezer / chiller / dry" },
        { label: "Branch", value: "KCH" },
        { label: "Label mode", value: "Current branch review" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "LBL-KCH-240507-03",
        subtitle: "Cold chain label preview",
        status: "Watch",
        guardrail: "Current service scope",
        meta: [
          { label: "Branch", value: "KCH" },
          { label: "Storage", value: "Freezer" },
          { label: "Product", value: "Coated Fries" },
          { label: "Expiry window", value: "19 days" },
          { label: "Issue link", value: "ISS-KCH-009" },
          { label: "Last updated", value: "Today 10:42" },
        ],
      },
      actionBar: [
        { label: "Review Label", href: "#" },
        { label: "Open Watchlist", href: "#", variant: "secondary" },
        { label: "Print Preview", href: "#", variant: "outline" },
        { label: "Open Issue", href: "/issues", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Label Log" },
        { label: "Expiry Watch" },
        { label: "Storage Status" },
        { label: "Activity" },
      ],
      metrics: [
        { label: "Watch items", value: "7", description: "Visible expiry-watch rows across KCH storage areas." },
        { label: "Missing labels", value: "1", description: "One high-priority label gap linked to an issue preview." },
        { label: "Storage zones", value: "3", description: "Freezer, chiller, and dry storage all remain visible." },
      ],
      filters: [
        { label: "Branch", value: "KCH" },
        { label: "Storage", value: "Freezer" },
        { label: "Status", value: "Watch" },
        { label: "Print mode", value: "Prepared for review" },
      ],
      sections: [
        {
          kind: "table",
          title: "Label Log",
          description: "Compact label log table without any printer or barcode integration.",
          columns: ["Label", "Product", "Storage", "Expiry", "Status"],
          rows: [
            ["LBL-KCH-240507-03", "Coated Fries", "Freezer", "19 days", "Watch"],
            ["LBL-KCH-240507-07", "Chicken broth base", "Chiller", "5 days", "Review"],
            ["LBL-BTU-240506-02", "Soup garnish", "Dry", "12 days", "Stable"],
          ],
        },
        {
          kind: "cards",
          title: "Expiry Watch",
          description: "Preview-only watch cards for operational follow-up.",
          cards: [
            { title: "Near expiry", value: "2", description: "Two items are within the watch window; no escalation is executed." },
            { title: "Missing label", value: "1", description: "One freezer item is missing a visible label record in preview." },
            { title: "Print preparation", value: "Ready", description: "Label print area is prepared for branch review." },
          ],
        },
        {
          kind: "fields",
          title: "Storage Status",
          description: "Storage condition and issue linkage for the selected label preview.",
          fields: [
            { label: "Storage zone", value: "Freezer rack B" },
            { label: "Temperature note", value: "Stable preview" },
            { label: "Issue link", value: "ISS-KCH-009" },
            { label: "Food safety state", value: "Watch" },
            { label: "Print channel", value: "Not connected" },
            { label: "Workflow target", value: "Planning-only" },
          ],
          asideTitle: "Label Note",
          asideBody: "Expiry and label values remain operational metadata only. No printer, barcode, stock writeback, or escalation engine is connected to this page.",
        },
      ],
      timeline: {
        title: "Label Activity",
        items: [
          { title: "Label row surfaced", description: "Cold chain label preview opened from the expiry watchlist.", time: "09:20" },
          { title: "Issue linked", description: "Missing-label issue attached to the watch item preview.", time: "10:42" },
          { title: "Storage review pending", description: "Food safety review remains visible without execution.", time: "12:05" },
        ],
      },
      rightRail: [
        { title: "Food Safety Context", badge: "Watch", items: ["Freezer storage focus", "Missing-label issue linked", "No escalation automation"] },
        { title: "Related Surfaces", items: ["Inspection", "Issues", "SOP / Recipes"] },
        { title: "Service Scope", badge: "Current release", items: ["Expiry watch", "Label review", "Food safety coordination"] },
      ],
      footerNote: "Expiry / Labels remains a food-safety preview only. No printer/barcode integration, no stock updates, and no escalation workflow were added.",
    },
  },
  {
    key: "finance",
    label: { zh: "财务 / 成本", en: "Finance / Costing" },
    route: "/finance",
    group: "finance",
    surfaceType: "report",
    description: { zh: "成本、毛利与供应商成本预览。", en: "Cost, margin, and supplier cost preview." },
    dataLayerNeeded: true,
    formulaLayerNeeded: true,
    brainLayerNeeded: true,
    permissionLayerNeeded: true,
    status: "ui-preview-only",
    preview: {
      activeNavKey: "finance",
      eyebrow: "Finance / Costing",
      title: "Cost, supplier comparison, and margin preview workspace",
      description: "Cost summary, product cost rows, supplier comparison, and margin review without leaving the finance workspace.",
      notice: "UI preview only. No accounting integration, no real cost engine, no margin computation runtime, and no approval workflow are connected.",
      badges: [{ label: "Finance / Costing" }, { label: "Margin review", variant: "secondary" }, { label: "Current release", variant: "outline" }],
      pageActions: [
        { label: "Open Reports", href: "/reports" },
        { label: "Open POS Reports", href: "/reports/pos", variant: "outline" },
        { label: "Open Supplier", href: "/psi/supplier", variant: "outline" },
      ],
      meta: [
        { label: "Scope", value: "Product cost / margin preview" },
        { label: "Branch", value: "All Stores / KCH" },
        { label: "Source", value: "Current finance review" },
        { label: "Writes", value: "Disabled" },
      ],
      recordSummary: {
        title: "FIN-KCH-DAILY",
        subtitle: "Daily cost and margin preview",
        status: "Monitoring",
        guardrail: "Current service scope",
        meta: [
          { label: "Lead branch", value: "KCH" },
          { label: "Product line", value: "Core menu" },
          { label: "Supplier comparison", value: "Visible" },
          { label: "Margin watch", value: "2 items" },
          { label: "Owner", value: "Finance review" },
          { label: "Last updated", value: "Today 13:30" },
        ],
      },
      actionBar: [
        { label: "Review Costing", href: "#" },
        { label: "Open Margin Preview", href: "#", variant: "secondary" },
        { label: "Open Supplier Comparison", href: "#", variant: "outline" },
        { label: "Export Snapshot", href: "#", variant: "outline" },
        { label: "View History", href: "#", variant: "ghost" },
      ],
      tabs: [
        { label: "Overview", active: true },
        { label: "Product Cost" },
        { label: "Supplier Cost" },
        { label: "Margin Preview" },
        { label: "Activity" },
      ],
      metrics: [
        { label: "Cost watch items", value: "5", description: "Five cost rows remain under review in the preview workspace." },
        { label: "Margin preview", value: "31.2%", description: "Preview-only gross margin output with no live formula engine." },
        { label: "Supplier comparisons", value: "3", description: "Visible supplier-cost comparison cards across core SKUs." },
      ],
      filters: [
        { label: "Branch", value: "KCH" },
        { label: "Category", value: "Core menu" },
        { label: "Supplier", value: "ABC Food Supply" },
        { label: "Period", value: "Today / 7 days" },
      ],
      sections: [
        {
          kind: "cards",
          title: "Cost Summary",
          description: "Preview-only cost and margin indicators for finance review.",
          cards: [
            { title: "Estimated input cost", value: "RM 12.6k", description: "Static preview amount across the active branch set." },
            { title: "Margin watch", value: "2 items", description: "Two products remain on the margin review watchlist." },
            { title: "Supplier cost drift", value: "+3.1%", description: "Supplier cost comparison delta for current finance review." },
          ],
        },
        {
          kind: "table",
          title: "Product Cost Table",
          description: "Product-level cost preview without a real formula or accounting engine.",
          columns: ["Product", "Input Cost", "Sell Price", "Margin Preview", "Status"],
          rows: [
            ["Chicken broth bowl", "RM 7.40", "RM 18.90", "60.8%", "Monitoring"],
            ["Coated fries side", "RM 4.10", "RM 9.90", "58.6%", "Watch"],
            ["Combo add-on", "RM 5.30", "RM 11.90", "55.4%", "Operations Review"],
          ],
        },
        {
          kind: "table",
          title: "Supplier Cost Comparison",
          description: "Supplier comparison rows kept as finance metadata only.",
          columns: ["Input", "Current Supplier", "Alt Supplier", "Delta", "Action"],
          rows: [
            ["Broth base", "ABC Food Supply", "North Pantry Co", "+2.8%", "Review supplier"],
            ["Coated fries", "ABC Food Supply", "Cold Chain Hub", "+1.1%", "Monitor"],
            ["Garnish pack", "ABC Food Supply", "Local Fresh", "-0.9%", "Operations Review"],
          ],
        },
      ],
      timeline: {
        title: "Finance Activity",
        items: [
          { title: "Cost snapshot prepared", description: "Daily finance preview assembled for KCH core menu items.", time: "09:15" },
          { title: "Supplier comparison linked", description: "ABC Food Supply comparison rows attached to the cost table.", time: "11:00" },
          { title: "Margin watch surfaced", description: "Two products remain on the margin preview watchlist.", time: "13:30" },
        ],
      },
      rightRail: [
        { title: "Finance Context", badge: "Current release", items: ["Cost review", "Margin outlook", "Supplier comparison"] },
        { title: "Related Surfaces", items: ["POS Reports", "Supplier detail", "SOP / Recipes"] },
        { title: "Service Scope", badge: "Current release", items: ["Cost visibility", "Margin review", "Supplier comparison"] },
      ],
      footerNote: "Finance / Costing is rendered as a review workspace only. No accounting integration, no margin engine, and no approval execution were added.",
    },
  },
];
