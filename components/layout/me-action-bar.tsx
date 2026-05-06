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
    <Card size="sm" className="border-border/70 bg-white/88 shadow-[0_16px_34px_-30px_rgba(15,23,42,0.18)]">
      <CardContent className="flex flex-wrap items-center gap-2.5 pt-4">
        {actions.map((action) => (
          <Button key={action.label} size="sm" variant={action.variant ?? "outline"} className="min-w-[6.25rem] justify-center">
            {action.icon}
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
