import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MeTabsProps {
  style?: "pill" | "detail";
  tabs: Array<{ label: string; active?: boolean; badge?: string }>;
}

export function MeTabs({ tabs, style = "pill" }: MeTabsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        style === "pill"
          ? "rounded-[24px] border border-border/70 bg-white/88 p-2 shadow-[0_14px_30px_-26px_rgba(15,23,42,0.18)]"
          : "border-b border-slate-200/80 pb-2",
      )}
    >
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors",
            style === "pill" && "rounded-2xl px-3.5 py-2",
            style === "detail" && "relative rounded-xl px-2.5 py-2",
            style === "pill"
              ? tab.active
                ? "bg-[linear-gradient(180deg,rgba(239,246,255,0.96),rgba(219,234,254,0.92))] text-blue-700 shadow-[inset_0_0_0_1px_rgba(191,219,254,0.7)]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              : tab.active
                ? "bg-slate-50 text-slate-950"
                : "text-slate-500 hover:text-slate-900",
          )}
        >
          <span>{tab.label}</span>
          {tab.badge ? <Badge variant={tab.active ? "default" : "outline"}>{tab.badge}</Badge> : null}
          {style === "detail" && tab.active ? <span className="absolute inset-x-2 bottom-[-9px] h-0.5 rounded-full bg-blue-600" /> : null}
        </div>
      ))}
    </div>
  );
}
