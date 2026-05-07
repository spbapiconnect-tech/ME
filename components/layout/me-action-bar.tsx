"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MeActionBarAction {
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
}

export function MeActionBar({ actions }: { actions: MeActionBarAction[] }) {
  return (
    <Card size="sm" className="border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardContent className="flex flex-wrap items-center gap-2 pt-4">
        {actions.map((action) =>
          action.href ? (
            <Button key={action.label} asChild size="sm" variant={action.variant ?? "outline"} className="min-w-[6.5rem] justify-center sm:justify-start">
              <Link href={action.href}>
                {action.icon}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button
              key={action.label}
              size="sm"
              variant={action.variant ?? "outline"}
              className="min-w-[6.5rem] justify-center sm:justify-start"
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          ),
        )}
      </CardContent>
    </Card>
  );
}
