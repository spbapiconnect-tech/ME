import { MeNavigationCard } from "@/components/navigation";
import { RoleChip } from "@/components/roles/role-chip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeRoleFoundationPreview, MeRoleNavigationPreview } from "@/types/role-workspace";

interface RoleNavigationPreviewProps {
  navigationPreview: MeRoleNavigationPreview;
  foundationPreview: MeRoleFoundationPreview;
}

const foundationAccessLabel: Record<MeRoleFoundationPreview["accessLevel"], string> = {
  "hidden-preview": "Hidden Preview",
  "limited-preview": "Limited Preview",
  "full-preview": "Full Preview",
};

export function RoleNavigationPreview({ navigationPreview, foundationPreview }: RoleNavigationPreviewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <Card size="sm" className="border border-border/70 bg-card/95">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">Visible Navigation Preview</CardTitle>
          <CardDescription>{navigationPreview.notice.en}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {navigationPreview.visibleItems.map((item) => (
            <MeNavigationCard key={item.key} item={item} />
          ))}
        </CardContent>
      </Card>

      <Card size="sm" className="border border-border/70 bg-card/95">
        <CardHeader className="gap-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">Foundation Visibility</CardTitle>
            <RoleChip label={foundationAccessLabel[foundationPreview.accessLevel]} tone="muted" />
          </div>
          <CardDescription>{foundationPreview.description.en}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {foundationPreview.visibleItems.length > 0 ? (
            foundationPreview.visibleItems.map((item) => <MeNavigationCard key={item.key} item={item} />)
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
              Foundation routes are not highlighted for this role. Global routes remain unchanged.
            </div>
          )}
          <div className="rounded-xl border border-dashed border-border/70 p-3 text-xs text-muted-foreground">
            Hidden foundation items in this preview: {navigationPreview.hiddenFoundationCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
