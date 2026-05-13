"use client";

import { BookOpen, ChefHat, DoorOpen, GraduationCap, ShieldCheck, Sparkles, SprayCan, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { activeSopCreateTypes, type SopCreateIcon, type SopCreateTypeConfig } from "@/lib/sop/sop-create-types";

const iconMap: Record<SopCreateIcon, React.ComponentType<{ className?: string }>> = {
  chef: ChefHat,
  door: DoorOpen,
  cleaning: SprayCan,
  book: BookOpen,
  shield: ShieldCheck,
  graduation: GraduationCap,
  sparkles: Sparkles,
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
          {activeSopCreateTypes().map((item) => {
            const Icon = iconMap[item.icon];

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
