import {
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  Boxes,
  Calculator,
  CalendarClock,
  ChartColumn,
  ClipboardCheck,
  GitBranch,
  GraduationCap,
  Handshake,
  ListTodo,
  PlugZap,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  Waypoints,
  Workflow,
} from "lucide-react";

import type { ModuleDefinition, SupportedLocale } from "@/types/module";

interface ModuleCardLabels {
  category: string;
  status: string;
  plan: string;
  routeCount: string;
  permissionCount: string;
  apiScopeCount: string;
  ownerRole: string;
  sourceMapping: string;
  statusMap: Record<ModuleDefinition["status"], string>;
  categoryMap: Record<ModuleDefinition["category"], string>;
  planMap: Record<ModuleDefinition["plan"], string>;
}

interface ModuleCardProps {
  locale: SupportedLocale;
  module: ModuleDefinition;
  labels: ModuleCardLabels;
  variant?: "compact" | "detailed";
}

const iconMap = {
  ShoppingCart,
  Truck,
  Boxes,
  ChartColumn,
  GraduationCap,
  ListTodo,
  BadgeCheck,
  Bell,
  PlugZap,
  Workflow,
  ShieldCheck,
  Calculator,
  BarChart3,
  Bot,
  GitBranch,
  ClipboardCheck,
  CalendarClock,
  Users,
  Handshake,
  Waypoints,
  Warehouse,
} as const;

const fallbackIcon = Boxes;

export function ModuleCard({
  locale,
  module,
  labels,
  variant = "detailed",
}: ModuleCardProps) {
  const Icon = iconMap[module.icon as keyof typeof iconMap] ?? fallbackIcon;
  const routeCount = Object.keys(module.routes).length;
  const permissionCount = module.permissions.length;
  const apiScopeCount = module.apiScope.length;
  const isCompact = variant === "compact";

  return (
    <article className={`module-card ${isCompact ? "module-card--compact" : "module-card--detailed"}`}>
      <div className="card-header">
        <div className="card-icon">
          <Icon size={22} />
        </div>
        <div className="module-chip-row">
          <span className="status-chip" data-status={module.status}>
            {labels.statusMap[module.status]}
          </span>
          <span className="module-chip module-chip--plan">
            {labels.planMap[module.plan]}
          </span>
        </div>
      </div>

      <div className="card-title-block">
        <p className="module-code">{module.code}</p>
        <h3 className="module-title">{module.name[locale]}</h3>
        <p className="module-short-name">{module.shortName[locale]}</p>
        <p className="module-card-description">{module.description[locale]}</p>
      </div>

      <div className="module-chip-row">
        <span className="module-chip">{labels.category}: {labels.categoryMap[module.category]}</span>
        <span className="module-chip">{labels.plan}: {labels.planMap[module.plan]}</span>
      </div>

      <div className="module-metric-grid">
        <div className="module-metric">
          <span>{labels.routeCount}</span>
          <strong>{routeCount}</strong>
        </div>
        <div className="module-metric">
          <span>{labels.permissionCount}</span>
          <strong>{permissionCount}</strong>
        </div>
        <div className="module-metric">
          <span>{labels.apiScopeCount}</span>
          <strong>{apiScopeCount}</strong>
        </div>
      </div>

      {!isCompact ? (
        <div className="module-meta-list">
          <div className="stat-row">
            <span className="card-meta">{labels.ownerRole}</span>
            <span>{module.ownerRole}</span>
          </div>
          <div className="stat-row">
            <span className="card-meta">{labels.sourceMapping}</span>
            <span>{module.sourceMapping.permissionNamespace}</span>
          </div>
        </div>
      ) : null}
    </article>
  );
}
