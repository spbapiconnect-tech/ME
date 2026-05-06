import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PsiRelatedActionsCardProps {
  actionKeys: string[];
}

export function PsiRelatedActionsCard({ actionKeys }: PsiRelatedActionsCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Related Action Placeholders</CardTitle>
        <CardDescription>Actions route to draft previews and do not submit data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {actionKeys.map((actionKey) => (
          <Link key={actionKey} href={`/psi/actions/${actionKey}`} className="rounded-lg border px-2 py-1 text-xs hover:bg-muted/40">
            {actionKey}
          </Link>
        ))}
        {actionKeys.length === 0 ? <div className="text-xs text-muted-foreground">No related action placeholders</div> : null}
      </CardContent>
    </Card>
  );
}
