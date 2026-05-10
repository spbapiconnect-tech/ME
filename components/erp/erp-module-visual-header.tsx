import { Building2, Network, PackageSearch, UtensilsCrossed } from "lucide-react";

export function ErpModuleVisualHeader() {
  return (
    <div className="rounded-xl border border-border/70 bg-gradient-to-br from-emerald-500/10 via-background to-cyan-500/10 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">ME Branch</p>
          <h3 className="mt-1 text-sm font-semibold text-foreground">Restaurant Operations Platform</h3>
          <div className="mt-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            All Branches
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[Building2, PackageSearch, UtensilsCrossed, Network].map((Icon, index) => (
            <div
              key={index}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/80 text-muted-foreground"
            >
              <Icon className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
