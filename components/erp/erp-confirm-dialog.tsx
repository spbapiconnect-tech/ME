import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ErpConfirmDialog({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-4 flex justify-end gap-2">{actions ?? <Button>Confirm</Button>}</div>
    </div>
  );
}
