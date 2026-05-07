import Link from "next/link";

import { BranchChip } from "@/components/branches/branch-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveBranchName } from "@/lib/branch-context";
import type { MeBranchProfile } from "@/types/branch-context";

interface BranchProfileCardProps {
  branch: MeBranchProfile;
}

function getContextKindLabel(branch: MeBranchProfile) {
  if (branch.isAggregate) {
    return "Group Overview";
  }

  if (branch.status === "coming-soon") {
    return "Expansion Branch";
  }

  return "Operating Branch";
}

function getStatusLabel(branch: MeBranchProfile) {
  if (branch.status === "coming-soon") {
    return "Expansion";
  }

  return branch.status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function BranchProfileCard({ branch }: BranchProfileCardProps) {
  return (
    <Card size="sm" className="h-full border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{resolveBranchName(branch)}</CardTitle>
            <CardDescription>{branch.name.zh}</CardDescription>
          </div>
          <BranchChip label={getStatusLabel(branch)} tone={branch.tone} status={branch.status} />
        </div>
        <CardDescription>{branch.region?.en ?? "Branch operations workspace"}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="grid gap-1 rounded-[10px] border border-border bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Context</p>
          <p className="font-medium">{getContextKindLabel(branch)}</p>
          <p className="text-xs text-muted-foreground">{branch.region?.en ?? "Branch operations context"}</p>
        </div>
        <div className="grid gap-1 text-xs text-muted-foreground">
          <p>Short name: {branch.shortName}</p>
          <p>Default route: {branch.defaultRoute}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {branch.linkedModules.map((moduleKey) => (
            <BranchChip key={moduleKey} label={moduleKey} tone="muted" />
          ))}
        </div>
        <Button asChild size="sm" variant="outline" className="justify-center">
          <Link href={`/branches/${branch.key}`}>Open Branch Workspace</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
