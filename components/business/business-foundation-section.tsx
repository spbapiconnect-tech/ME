import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWorkspaceFoundationLink } from "@/types/business-workspace";

interface BusinessFoundationSectionProps {
  links: BusinessWorkspaceFoundationLink[];
}

export function BusinessFoundationSection({ links }: BusinessFoundationSectionProps) {
  return (
    <Card size="sm" className="border-dashed">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">System Foundation</CardTitle>
        <CardDescription>Metadata contracts and platform foundations for future configuration.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-3">
        {links.map((item) => (
          <Button key={item.key} asChild variant="outline" size="sm" className="justify-start">
            <Link href={item.route}>{item.label.en}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
