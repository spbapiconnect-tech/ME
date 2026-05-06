import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWorkspaceAction } from "@/types/business-workspace";

const actionVariant: Record<BusinessWorkspaceAction["tone"], "default" | "secondary" | "destructive" | "outline"> = {
  neutral: "secondary",
  info: "default",
  success: "default",
  warning: "outline",
  danger: "destructive",
  muted: "outline",
};

interface BusinessActionPanelProps {
  actions: BusinessWorkspaceAction[];
}

export function BusinessActionPanel({ actions }: BusinessActionPanelProps) {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Workspace Actions</CardTitle>
        <CardDescription>Read-only action entry points for demo flow</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <div key={action.key} className="rounded-xl border border-border/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{action.label.en}</p>
              <Badge variant={actionVariant[action.tone]}>{action.isPlaceholder ? "placeholder" : "active"}</Badge>
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
