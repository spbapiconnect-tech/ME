import Link from "next/link";

import { StakeholderSummaryChip } from "@/components/stakeholder-summary/stakeholder-summary-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeStakeholderSummaryCard } from "@/types/stakeholder-summary";

interface StakeholderSummaryCardProps {
  card: MeStakeholderSummaryCard;
}

export function StakeholderSummaryCard({ card }: StakeholderSummaryCardProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{card.title.en}</CardTitle>
            <CardDescription>{card.description.en}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <StakeholderSummaryChip label={card.kind.split("-").join(" ")} tone={card.tone} />
            {card.isPlaceholder ? <StakeholderSummaryChip label="placeholder" tone="muted" /> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          {card.highlights.map((highlight) => (
            <div key={`${card.key}-${highlight.en}`} className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-muted-foreground">
              {highlight.en}
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Proof Points</p>
          {card.proofPoints.map((point) => (
            <p key={`${card.key}-${point.en}`} className="text-sm text-muted-foreground">
              {point.en}
            </p>
          ))}
        </div>
        {card.route ? (
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={card.route}>Open Route</Link>
            </Button>
            <div className="rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground">{card.route}</div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
