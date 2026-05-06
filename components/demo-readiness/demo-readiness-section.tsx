import type { MeDemoReadinessSection as MeDemoReadinessSectionData } from "@/types/demo-readiness";

import { DemoReadinessChecklistCard } from "./demo-readiness-checklist-card";
import { DemoReadinessChip } from "./demo-readiness-chip";

interface DemoReadinessSectionProps {
  section: MeDemoReadinessSectionData;
}

export function DemoReadinessSection({ section }: DemoReadinessSectionProps) {
  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{section.title.en}</p>
          {section.description ? <p className="text-sm text-muted-foreground">{section.description.en}</p> : null}
        </div>
        <DemoReadinessChip tone={section.tone} label={section.category.replace(/-/g, " ")} className="capitalize" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {section.items.map((item) => (
          <DemoReadinessChecklistCard key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
