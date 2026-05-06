import { MeNavigationCard } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeBranchNavigationPreview } from "@/types/branch-context";

interface BranchNavigationPreviewProps {
  navigationPreview: MeBranchNavigationPreview;
}

export function BranchNavigationPreview({ navigationPreview }: BranchNavigationPreviewProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Visible Navigation Preview</CardTitle>
        <CardDescription>{navigationPreview.notice.en}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {navigationPreview.visibleItems.map((item) => (
          <MeNavigationCard key={item.key} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
