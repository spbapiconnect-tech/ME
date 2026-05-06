import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MeActionBarAction {
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: ReactNode;
  href?: string;
}

export function MeActionBar({ actions }: { actions: MeActionBarAction[] }) {
  return (
    <Card size="sm" className="border-border/60 bg-white/88 shadow-[0_14px_26px_-24px_rgba(15,23,42,0.16)]">
      <CardContent className="flex flex-wrap items-center gap-2 pt-4">
        {actions.map((action) =>
          action.href ? (
            <Button key={action.label} asChild size="sm" variant={action.variant ?? "outline"} className="min-w-[6rem] justify-center">
              <Link href={action.href}>
                {action.icon}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button key={action.label} size="sm" variant={action.variant ?? "outline"} className="min-w-[6rem] justify-center">
              {action.icon}
              {action.label}
            </Button>
          ),
        )}
      </CardContent>
    </Card>
  );
}
