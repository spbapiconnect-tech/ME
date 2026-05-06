import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MeWorkspaceSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function MeWorkspaceSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: MeWorkspaceSectionProps) {
  return (
    <Card size="sm" className={cn("border-border/60 bg-white/92 shadow-[0_16px_28px_-30px_rgba(15,23,42,0.13)]", className)}>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-[15px] text-slate-900">{title}</CardTitle>
            {description ? <CardDescription className="mt-1 text-sm text-slate-500">{description}</CardDescription> : null}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent className={cn("grid gap-3", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
