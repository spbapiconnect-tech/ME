"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MeTabsProps {
  style?: "pill" | "detail";
  tabs: Array<{ label: string; active?: boolean; badge?: string }>;
  onTabChange?: (label: string) => void;
}

export function MeTabs({ tabs, style = "pill", onTabChange }: MeTabsProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1",
        style === "pill"
          ? "rounded-[20px] border border-border/60 bg-white/90 p-2 shadow-[0_14px_24px_-24px_rgba(15,23,42,0.14)]"
          : "border-b border-slate-200/80",
      )}
    >
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.label}
          onClick={() => onTabChange?.(tab.label)}
          className={cn(
            "shrink-0 flex items-center gap-2 text-sm font-medium transition-colors",
            style === "pill" && "rounded-xl px-3.5 py-2",
            style === "detail" && "relative rounded-lg px-3 py-2.5",
            style === "pill"
              ? tab.active
                ? "bg-[linear-gradient(180deg,rgba(239,246,255,0.96),rgba(224,231,255,0.92))] text-blue-700 shadow-[inset_0_0_0_1px_rgba(191,219,254,0.7)]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              : tab.active
                ? "bg-slate-50 text-slate-950"
                : "text-slate-500 hover:text-slate-900",
          )}
        >
          <span>{tab.label}</span>
          {tab.badge ? <Badge variant={tab.active ? "default" : "outline"}>{tab.badge}</Badge> : null}
          {style === "detail" && tab.active ? <span className="absolute inset-x-2 bottom-[-1px] h-0.5 rounded-full bg-blue-600" /> : null}
        </button>
      ))}
    </div>
  );
}
