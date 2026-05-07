import { MeWorkspaceSection } from "@/components/layout";
import type { RestaurantModuleSection } from "@/config/restaurant-modules";

import { RestaurantModuleTable } from "./restaurant-module-table";

export function RestaurantModuleDetailPreview({ section }: { section: RestaurantModuleSection }) {
  if (section.kind === "table") {
    return (
      <MeWorkspaceSection title={section.title} description={section.description}>
        <RestaurantModuleTable columns={section.columns} rows={section.rows} />
      </MeWorkspaceSection>
    );
  }

  if (section.kind === "cards") {
    return (
      <MeWorkspaceSection title={section.title} description={section.description}>
        <div className="grid gap-3 md:grid-cols-3">
          {section.cards.map((card) => (
            <div key={card.title} className="rounded-[10px] border border-border bg-slate-50 px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{card.title}</p>
              <p className="mt-1.5 text-lg font-semibold text-slate-950">{card.value}</p>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>
    );
  }

  if (section.kind === "note") {
    return (
      <MeWorkspaceSection title={section.title} description={section.description}>
        <p className="text-sm leading-6 text-slate-600">{section.body}</p>
      </MeWorkspaceSection>
    );
  }

  return (
    <MeWorkspaceSection title={section.title} description={section.description}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-3 md:grid-cols-2">
          {section.fields.map((field) => (
            <div key={field.label} className="border-b border-slate-100 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{field.label}</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">{field.value}</p>
            </div>
          ))}
        </div>
        {section.asideTitle && section.asideBody ? (
          <div className="rounded-[10px] border border-border bg-slate-50 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{section.asideTitle}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{section.asideBody}</p>
          </div>
        ) : null}
      </div>
    </MeWorkspaceSection>
  );
}
