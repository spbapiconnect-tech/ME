import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiLinkedRecord } from "@/types/psi";

interface PsiLinkedRecordsCardProps {
  records: PsiLinkedRecord[];
}

export function PsiLinkedRecordsCard({ records }: PsiLinkedRecordsCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Linked Source Records</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {records.map((record) => (
          <div key={record.key} className="rounded-lg border p-3 text-xs">
            <div className="font-medium">{record.label.en}</div>
            <div className="text-muted-foreground">
              {record.moduleCode} · {record.recordType} · {record.recordId}
            </div>
            <div className="text-muted-foreground">{record.status ?? "placeholder"}</div>
            {record.route ? (
              <Link href={record.route} className="text-primary hover:underline">
                Open linked record
              </Link>
            ) : null}
          </div>
        ))}
        {records.length === 0 ? <div className="text-xs text-muted-foreground">No linked records</div> : null}
      </CardContent>
    </Card>
  );
}
