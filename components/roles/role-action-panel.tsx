import Link from "next/link";

import { RoleChip } from "@/components/roles/role-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeRoleWorkspaceAction } from "@/types/role-workspace";

interface RoleActionPanelProps {
  actions: MeRoleWorkspaceAction[];
}

export function RoleActionPanel({ actions }: RoleActionPanelProps) {
  return (
    <Card size="sm" className="h-full border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Role Actions</CardTitle>
        <CardDescription>Read-only role actions and placeholder next steps</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <div key={action.key} className="rounded-xl border border-border/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{action.label.en}</p>
              <RoleChip label={action.isPlaceholder ? "placeholder" : "active"} tone={action.tone} />
            </div>
            {action.description ? <p className="mb-3 text-xs text-muted-foreground">{action.description.en}</p> : null}
            <Button asChild size="sm" variant="outline" className="w-full justify-center">
              <Link href={action.route}>Open</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
