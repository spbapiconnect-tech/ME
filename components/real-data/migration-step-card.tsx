import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeMigrationStep } from "@/types/real-data-mapping";

export function MigrationStepCard({ step }: { step: MeMigrationStep }) {
  return (
    <Card size="sm" className="border-border/60 bg-white/92 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.14)]">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-sm text-slate-950">{step.title.en}</CardTitle>
          <Badge variant={step.status === "planned" ? "secondary" : "outline"}>{step.status}</Badge>
        </div>
        <CardDescription className="text-sm text-slate-500">{step.description.en}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-slate-600">
        {step.guardrails.map((guardrail) => (
          <div key={guardrail} className="flex items-start gap-2.5 rounded-[18px] bg-slate-50/85 px-3.5 py-2.5 ring-1 ring-slate-200/70">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span>{guardrail}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
