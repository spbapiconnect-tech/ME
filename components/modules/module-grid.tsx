import type { ModuleDefinition, SupportedLocale } from "@/types/module";

import { ModuleCard } from "@/components/modules/module-card";

interface ModuleGridProps {
  modules: ModuleDefinition[];
  locale: SupportedLocale;
  labels: Parameters<typeof ModuleCard>[0]["labels"];
  variant?: "compact" | "detailed";
}

export function ModuleGrid({ modules, locale, labels, variant = "detailed" }: ModuleGridProps) {
  return (
    <div className="modules-grid">
      {modules.map((module) => (
        <ModuleCard
          key={module.code}
          locale={locale}
          module={module}
          labels={labels}
          variant={variant}
        />
      ))}
    </div>
  );
}
