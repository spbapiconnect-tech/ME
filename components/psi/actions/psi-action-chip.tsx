import { Badge } from "@/components/ui/badge";

import type { PsiActionDraftCategory, PsiActionDraftIntent, PsiActionDraftStatus } from "@/types/psi/actions";

interface PsiActionChipProps {
  status: PsiActionDraftStatus;
  category: PsiActionDraftCategory;
  intent: PsiActionDraftIntent;
}

export function PsiActionChip({ status, category, intent }: PsiActionChipProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Badge variant={status === "draft" ? "default" : "outline"}>{status}</Badge>
      <Badge variant="secondary">{category}</Badge>
      <Badge variant="outline">{intent}</Badge>
    </div>
  );
}
