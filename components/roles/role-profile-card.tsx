import Link from "next/link";

import { RoleChip } from "@/components/roles/role-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveRoleName } from "@/lib/role-workspace";
import type { MeRoleProfile } from "@/types/role-workspace";

interface RoleProfileCardProps {
  role: MeRoleProfile;
}

const foundationAccessLabel: Record<MeRoleProfile["foundationAccessLevel"], string> = {
  "hidden-preview": "Restricted",
  "limited-preview": "Limited",
  "full-preview": "Full",
};

export function RoleProfileCard({ role }: RoleProfileCardProps) {
  return (
    <Card size="sm" className="h-full border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{resolveRoleName(role)}</CardTitle>
            <CardDescription>{role.name.zh}</CardDescription>
          </div>
          <RoleChip label={role.status} tone={role.tone} status={role.status} />
        </div>
        <CardDescription>{`${role.suggestedModules.length} linked modules · ${foundationAccessLabel[role.foundationAccessLevel]} foundation access`}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="grid gap-1 rounded-[10px] border border-border bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Role Focus</p>
          <p className="font-medium">{role.primaryGoal.en}</p>
          <p className="text-xs text-muted-foreground">{role.defaultRoute}</p>
        </div>
        <div className="grid gap-1 text-xs text-muted-foreground">
          <p>Default route: {role.defaultRoute}</p>
          <p>Foundation access: {foundationAccessLabel[role.foundationAccessLevel]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {role.suggestedModules.map((moduleKey) => (
            <RoleChip key={moduleKey} label={moduleKey} tone="muted" />
          ))}
        </div>
        <Button asChild size="sm" variant="outline" className="justify-center">
          <Link href={`/roles/${role.key}`}>Open Role Workspace</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
