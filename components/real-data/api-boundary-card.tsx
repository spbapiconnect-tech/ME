import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeApiBoundaryDraft } from "@/types/real-data-mapping";

export function ApiBoundaryCard({ boundary }: { boundary: MeApiBoundaryDraft }) {
  const badgeVariant = boundary.readOrWrite === "read-only" ? "secondary" : "outline";

  return (
    <Card size="sm" className="border-border/60 bg-white/92 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.14)]">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm text-slate-950">
              {boundary.method} {boundary.path}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-500">{boundary.purpose.en}</CardDescription>
          </div>
          <Badge variant={badgeVariant}>{boundary.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Mode:</span> {boundary.readOrWrite}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Entities:</span> {boundary.entities.join(", ")}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Future auth:</span> {boundary.authRequiredFuture ? "Required" : "Not planned"}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Future permission:</span> {boundary.permissionRequiredFuture ? "Required" : "Not planned"}
        </p>
        <div className="rounded-[20px] bg-slate-50/85 px-4 py-3.5 ring-1 ring-slate-200/70">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Guardrails</p>
          <div className="mt-2 grid gap-2">
            {boundary.guardrails.map((guardrail) => (
              <div key={guardrail} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span>{guardrail}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
