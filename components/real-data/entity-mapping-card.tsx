import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeEntityMapping } from "@/types/real-data-mapping";

const readinessTone: Record<MeEntityMapping["readiness"], "default" | "secondary" | "outline"> = {
  "ready-to-map": "default",
  "needs-schema": "secondary",
  "needs-api": "secondary",
  "needs-permission": "outline",
  "needs-workflow": "outline",
  deferred: "outline",
  "placeholder-only": "outline",
};

export function EntityMappingCard({ entity }: { entity: MeEntityMapping }) {
  return (
    <Card size="sm" className="border-border/60 bg-white/92 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.14)]">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm text-slate-950">{entity.label.en}</CardTitle>
            <CardDescription className="mt-1 font-mono text-xs text-slate-500">{entity.futureTableName}</CardDescription>
          </div>
          <Badge variant={readinessTone[entity.readiness]}>{entity.readiness}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600">
        <p className="leading-6">{entity.description.en}</p>
        <div className="grid gap-2 rounded-[20px] bg-slate-50/85 px-4 py-3.5 ring-1 ring-slate-200/70">
          <p>
            <span className="font-semibold text-slate-800">Primary key:</span> {entity.primaryKey}
          </p>
          <p>
            <span className="font-semibold text-slate-800">Required:</span> {entity.requiredFields.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-slate-800">Optional:</span> {entity.optionalFields.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-slate-800">Relationships:</span> {entity.relationships.join(" | ")}
          </p>
          <p>
            <span className="font-semibold text-slate-800">Surfaces:</span> {entity.usedBySurfaces.join(", ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
