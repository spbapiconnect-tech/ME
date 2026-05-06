import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveUiBlockLabel } from "@/lib/real-data-mapping";
import type { MeUiDataBlock, MeUiSurfaceKey } from "@/types/real-data-mapping";

const readinessTone: Record<MeUiDataBlock["readiness"], "default" | "secondary" | "outline"> = {
  "ready-to-map": "default",
  "needs-schema": "secondary",
  "needs-api": "secondary",
  "needs-permission": "outline",
  "needs-workflow": "outline",
  deferred: "outline",
  "placeholder-only": "outline",
};

interface RealDataSurfaceCardProps {
  surface: MeUiSurfaceKey;
  title: string;
  blocks: MeUiDataBlock[];
}

export function RealDataSurfaceCard({ surface, title, blocks }: RealDataSurfaceCardProps) {
  return (
    <Card size="sm" className="border-border/60 bg-white/92 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.14)]">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm text-slate-950">{title}</CardTitle>
            <CardDescription className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{surface}</CardDescription>
          </div>
          <Badge variant="secondary">{blocks.length} blocks</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {blocks.map((block) => (
          <div key={block.key} className="rounded-[20px] bg-slate-50/85 px-4 py-3.5 ring-1 ring-slate-200/70">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{resolveUiBlockLabel(block)}</p>
              <Badge variant={readinessTone[block.readiness]}>{block.readiness}</Badge>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">{block.description.en}</p>
            <div className="mt-3 grid gap-2 text-xs text-slate-500">
              <p>
                <span className="font-semibold text-slate-700">Current:</span> {block.currentSource}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Future:</span> {block.futureSource}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Entities:</span> {block.requiredEntities.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
