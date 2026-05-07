import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ErpStatusBadge } from "./erp-status-badge";

export function ErpDetailPanel({
  title,
  status,
  subtitle,
  actions,
  children,
}: {
  title: string;
  status?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-border p-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {status ? <ErpStatusBadge status={status} /> : null}
          </div>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}
