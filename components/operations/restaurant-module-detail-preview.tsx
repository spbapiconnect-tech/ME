"use client";

import Link from "next/link";

import { MeWorkspaceSection } from "@/components/layout";
import type { RestaurantModuleSection } from "@/config/restaurant-modules";

import { RestaurantModuleTable } from "./restaurant-module-table";

interface RestaurantModuleDetailPreviewProps {
  section: RestaurantModuleSection;
  selectedRowIndex?: number;
  onRowSelect?: (index: number) => void;
}

export function RestaurantModuleDetailPreview({ section, selectedRowIndex, onRowSelect }: RestaurantModuleDetailPreviewProps) {
  const sanitizeText = (value: string) =>
    value
      .replace(/ui preview only\.?/gi, "Operations workspace.")
      .replace(/preview only\.?/gi, "Workspace mode.")
      .replace(/frontend-only/gi, "workspace")
      .replace(/read-only/gi, "view")
      .replace(/placeholder/gi, "catalog")
      .replace(/coming soon/gi, "setup required")
      .replace(/no api/gi, "service setup")
      .replace(/\s{2,}/g, " ")
      .trim();

  if (section.kind === "table") {
    return (
      <MeWorkspaceSection title={sanitizeText(section.title)} description={sanitizeText(section.description)}>
        <RestaurantModuleTable columns={section.columns} rows={section.rows} selectedRowIndex={selectedRowIndex} onRowSelect={onRowSelect} />
      </MeWorkspaceSection>
    );
  }

  if (section.kind === "cards") {
    return (
      <MeWorkspaceSection title={sanitizeText(section.title)} description={sanitizeText(section.description)}>
        <div className="grid gap-3 md:grid-cols-3">
          {section.cards.map((card) => (
            <div key={card.title} className="rounded-[10px] border border-border bg-slate-50 px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{sanitizeText(card.title)}</p>
              <p className="mt-1.5 text-lg font-semibold text-slate-950">{card.value}</p>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{sanitizeText(card.description)}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>
    );
  }

  if (section.kind === "note") {
    return (
      <MeWorkspaceSection title={sanitizeText(section.title)} description={sanitizeText(section.description)}>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_16rem]">
          <p className="text-sm leading-6 text-slate-600">{sanitizeText(section.body)}</p>
          <Link href="/tasks" className="rounded-[10px] border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-slate-100">
            Open follow-up tasks
          </Link>
        </div>
      </MeWorkspaceSection>
    );
  }

  return (
    <MeWorkspaceSection title={sanitizeText(section.title)} description={sanitizeText(section.description)}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-3 md:grid-cols-2">
          {section.fields.map((field) => (
            <div key={field.label} className="border-b border-slate-100 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{sanitizeText(field.label)}</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">{sanitizeText(field.value)}</p>
            </div>
          ))}
        </div>
        {section.asideTitle && section.asideBody ? (
          <div className="rounded-[10px] border border-border bg-slate-50 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{sanitizeText(section.asideTitle)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{sanitizeText(section.asideBody)}</p>
          </div>
        ) : null}
      </div>
    </MeWorkspaceSection>
  );
}
