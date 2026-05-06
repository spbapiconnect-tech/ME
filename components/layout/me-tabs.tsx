import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MeTabsProps {
  tabs: Array<{ label: string; active?: boolean; badge?: string }>;
}

export function MeTabs({ tabs }: MeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-border/40 bg-white/85 p-2 shadow-sm shadow-slate-900/5">
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={cn(
            "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors",
            tab.active ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
          )}
        >
          <span>{tab.label}</span>
          {tab.badge ? <Badge variant={tab.active ? "default" : "outline"}>{tab.badge}</Badge> : null}
        </div>
      ))}
    </div>
  );
}
