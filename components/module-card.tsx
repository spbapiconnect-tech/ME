import {
  Boxes,
  ChartColumn,
  GraduationCap,
  ListTodo,
  ShoppingCart,
  Truck,
} from "lucide-react";

import type { ModuleDefinition, SupportedLocale } from "@/types/module";

interface ModuleCardProps {
  locale: SupportedLocale;
  module: ModuleDefinition;
  labels: {
    category: string;
    status: string;
    placeholderRoutes: string;
    permissions: string;
    supportedThemes: string;
    statusMap: Record<ModuleDefinition["status"], string>;
    categoryMap: Record<ModuleDefinition["category"], string>;
    themeMap: Record<ModuleDefinition["themeSupport"][number], string>;
  };
}

const iconMap = {
  ShoppingCart,
  Truck,
  Boxes,
  ChartColumn,
  GraduationCap,
  ListTodo,
} as const;

export function ModuleCard({ locale, module, labels }: ModuleCardProps) {
  const Icon = iconMap[module.icon];

  return (
    <article className="module-card">
      <div className="card-header">
        <div className="card-icon">
          <Icon size={22} />
        </div>
        <span className="status-chip" data-status={module.status}>
          {labels.statusMap[module.status]}
        </span>
      </div>

      <div className="card-title-block">
        <h3 className="module-title">{module.name[locale]}</h3>
        <p className="module-short-name">{module.shortName[locale]}</p>
      </div>

      <div className="stat-row">
        <span className="card-meta">{labels.category}</span>
        <span>{labels.categoryMap[module.category]}</span>
      </div>

      <div>
        <p className="card-section-title">{labels.placeholderRoutes}</p>
        <div className="route-list">
          {Object.values(module.routes).map((route) => (
            <span key={route} className="route-pill">
              {route}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="card-section-title">{labels.permissions}</p>
        <div className="permission-list">
          {module.permissions.map((permission) => (
            <span key={permission} className="permission-pill">
              {permission}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="card-section-title">{labels.supportedThemes}</p>
        <div className="permission-list">
          {module.themeSupport.map((theme) => (
            <span key={theme} className="theme-chip">
              {labels.themeMap[theme]}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
