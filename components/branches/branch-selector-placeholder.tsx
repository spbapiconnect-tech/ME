import Link from "next/link";

import { BranchChip } from "@/components/branches/branch-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MeBranchKey, MeBranchProfile } from "@/types/branch-context";

interface BranchSelectorPlaceholderProps {
  branches: MeBranchProfile[];
  selectedBranchKey?: MeBranchKey;
  compact?: boolean;
}

export function BranchSelectorPlaceholder({ branches, selectedBranchKey, compact = false }: BranchSelectorPlaceholderProps) {
  return (
    <Card className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Branch Directory</CardTitle>
        <CardDescription>
          Review branch workspaces, operating status, and linked modules from a shared management surface.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className={cn("grid gap-3", compact ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4")}>
          {branches.map((branch) => {
            const isSelected = branch.key === selectedBranchKey;

            return (
              <div
                key={branch.key}
                className={cn(
                  "rounded-xl border border-border/70 bg-background/80 p-3",
                  isSelected && "border-primary/50 bg-primary/5",
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{branch.name.en}</p>
                    <p className="text-xs text-muted-foreground">{branch.name.zh}</p>
                  </div>
                  <BranchChip label={branch.shortName} tone={branch.tone} status={branch.status} />
                </div>
                {!compact ? <p className="mb-3 text-xs text-muted-foreground">{branch.region?.en ?? "Branch operations workspace"}</p> : null}
                <Button asChild  variant={isSelected ? "default" : "outline"} className="w-full justify-center">
                  <Link href={`/branches/${branch.key}`}>{isSelected ? "Current Branch" : "Open Branch"}</Link>
                </Button>
              </div>
            );
          })}
        </div>
        <div className="rounded-xl border border-dashed border-border/70 p-3 text-xs text-muted-foreground">
          Branch selection drives operations, reporting, staffing, and inventory review across the shared platform.
        </div>
      </CardContent>
    </Card>
  );
}
