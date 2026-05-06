import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MeRecordSummaryProps {
  title: string;
  subtitle?: string;
  status: string;
  guardrail?: string;
  meta: Array<{ label: string; value: string }>;
}

export function MeRecordSummary({ title, subtitle, status, guardrail, meta }: MeRecordSummaryProps) {
  return (
    <Card size="sm" className="border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,254,0.94))] shadow-[0_18px_28px_-24px_rgba(15,23,42,0.16)]">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Record Summary</p>
            <CardTitle className="text-[1.65rem] leading-tight text-slate-950">{title}</CardTitle>
            {subtitle ? <p className="text-sm font-medium text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{status}</Badge>
            {guardrail ? <Badge variant="outline">{guardrail}</Badge> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 border-t border-slate-200/70 pt-4 md:grid-cols-2 xl:grid-cols-4">
        {meta.map((item) => (
          <div key={item.label} className="rounded-[20px] bg-slate-50/82 px-4 py-3 ring-1 ring-slate-200/65">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
