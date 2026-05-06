import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MeActionBarAction {
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: ReactNode;
}

export function MeActionBar({ actions }: { actions: MeActionBarAction[] }) {
  return (
    <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
      <CardContent className="flex flex-wrap gap-2 pt-4">
        {actions.map((action) => (
          <Button key={action.label} size="sm" variant={action.variant ?? "outline"}>
            {action.icon}
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
