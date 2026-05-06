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
    <Card size="sm" className="border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.985),rgba(248,250,254,0.95))] shadow-[0_18px_28px_-26px_rgba(15,23,42,0.14)]">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Record Summary</p>
            <CardTitle className="text-[1.5rem] leading-tight text-slate-950 sm:text-[1.65rem]">{title}</CardTitle>
            {subtitle ? <p className="text-sm font-medium text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{status}</Badge>
            {guardrail ? <Badge variant="outline" className="text-[10px]">{guardrail}</Badge> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-0 border-t border-slate-200/70 pt-3 md:grid-cols-2 xl:grid-cols-4">
        {meta.map((item) => (
          <div key={item.label} className="border-b border-slate-100/90 px-0 py-3.5 last:border-b-0 md:px-4 xl:border-b-0 xl:border-l xl:border-slate-100/90 xl:first:border-l-0 xl:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
