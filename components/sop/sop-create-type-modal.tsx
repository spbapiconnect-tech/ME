"use client";

import { BookOpen, ChefHat, DoorOpen, GraduationCap, ShieldCheck, Sparkles, SprayCan, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SopCreateType =
  | "recipe"
  | "opening-closing"
  | "cleaning"
  | "service"
  | "safety"
  | "training"
  | "product-launch";

export type SopCreateTypeConfig = {
  key: SopCreateType;
  title: string;
  description: string;
  category: string;
  processArea: string;
  targetRole: string;
  acknowledgementRequired: "Yes" | "No";
  trainingRequired: "Yes" | "No";
};

export const sopCreateTypes: SopCreateTypeConfig[] = [
  {
    key: "recipe",
    title: "Recipe / Product SOP",
    description: "Burger build, product recipe, kitchen process, product standard.",
    category: "Kitchen",
    processArea: "Product",
    targetRole: "Kitchen Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
  },
  {
    key: "opening-closing",
    title: "Opening / Closing",
    description: "Daily opening, closing, cash-up, handover and outlet readiness.",
    category: "Operations",
    processArea: "Outlet",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "No",
  },
  {
    key: "cleaning",
    title: "Cleaning",
    description: "Cleaning checklist, hygiene, station reset and proof requirements.",
    category: "Cleaning",
    processArea: "Outlet",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "No",
  },
  {
    key: "service",
    title: "Service",
    description: "Cashier, front counter, customer handling and complaint prevention.",
    category: "Service",
    processArea: "Front",
    targetRole: "Front Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "No",
  },
  {
    key: "safety",
    title: "Safety",
    description: "Food safety, equipment safety, risk control and escalation rules.",
    category: "Safety",
    processArea: "Compliance",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
  },
  {
    key: "training",
    title: "Training",
    description: "Onboarding, staff learning path, required reading and acknowledgement.",
    category: "Training",
    processArea: "People",
    targetRole: "New Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
  },
  {
    key: "product-launch",
    title: "Product Launch",
    description: "New item rollout, launch briefing, media guide and staff acknowledgement.",
    category: "Product",
    processArea: "Launch",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
  },
];

const iconMap: Record<SopCreateType, React.ComponentType<{ className?: string }>> = {
  recipe: ChefHat,
  "opening-closing": DoorOpen,
  cleaning: SprayCan,
  service: BookOpen,
  safety: ShieldCheck,
  training: GraduationCap,
  "product-launch": Sparkles,
};

export function SopCreateTypeModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: SopCreateTypeConfig) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border bg-background shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b p-5">
          <div>
            <div className="text-sm text-muted-foreground">Create SOP</div>
            <h2 className="text-2xl font-semibold tracking-tight">Choose SOP type</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Start with the type of SOP. The builder will stay clean and only show the setup, writing area, preview, and publish readiness.
            </p>
          </div>

          <button type="button" onClick={onClose} className="rounded-xl border p-2 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid max-h-[70dvh] gap-3 overflow-y-auto p-5 [scrollbar-width:none] md:grid-cols-2 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {sopCreateTypes.map((item) => {
            const Icon = iconMap[item.key];

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "group rounded-2xl border bg-card p-4 text-left transition hover:border-primary hover:bg-muted/30",
                )}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border bg-background text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold">{item.title}</div>
                <p className="mt-2 min-h-[44px] text-sm leading-6 text-muted-foreground">{item.description}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border px-2 py-1">{item.category}</span>
                  <span className="rounded-full border px-2 py-1">{item.processArea}</span>
                  <span className="rounded-full border px-2 py-1">{item.targetRole}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-4">
          <div className="text-xs text-muted-foreground">
            Mobile staff will only read and acknowledge. SOP creation stays manager-only.
          </div>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
