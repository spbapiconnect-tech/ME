import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFoundationNavigationItems, resolveNavigationLabel } from "@/lib/navigation";
import type { BusinessWorkspaceFoundationLink } from "@/types/business-workspace";

interface BusinessFoundationSectionProps {
  links: BusinessWorkspaceFoundationLink[];
}

export function BusinessFoundationSection({ links }: BusinessFoundationSectionProps) {
  const navigationLinks = getFoundationNavigationItems()
    .filter((item) => item.key !== "system-foundation")
    .map((item) => ({ key: item.key, label: resolveNavigationLabel(item), route: item.href }));

  const items = navigationLinks.length > 0
    ? navigationLinks
    : links.map((item) => ({ key: item.key, label: item.label.en, route: item.route }));

  return (
    <Card size="sm" className="border-dashed">
      <CardHeader className="gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm">System Foundation</CardTitle>
            <CardDescription>Metadata contracts and platform foundations for future configuration.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/navigation">Navigation IA</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Button key={item.key} asChild variant="outline" size="sm" className="justify-start">
            <Link href={item.route}>{item.label}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
