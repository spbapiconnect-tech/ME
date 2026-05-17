"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SopDocumentHeaderProps = {
  eyebrow: string;
  title: string;
  badges?: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
};

export function SopDocumentHeader({
  eyebrow,
  title,
  badges,
  onBack,
  actions,
  className,
}: SopDocumentHeaderProps) {
  return (
    <div className={cn("sop-builder-document-header shrink-0 border-b border-border bg-background px-4 py-1.5", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <div className="truncate text-[11px] font-medium leading-none text-muted-foreground">{eyebrow}</div>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-lg font-semibold leading-none tracking-tight">{title}</h1>
              {badges}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
    </div>
  );
}
