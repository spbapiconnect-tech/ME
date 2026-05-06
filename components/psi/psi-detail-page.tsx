import { PsiDetailLayoutV072 } from "@/components/psi/detail/x1";
import type { PsiDetailPanelData } from "@/types/psi";

interface PsiDetailPageProps {
  title: string;
  source: string;
  isMock: boolean;
  error?: string;
  rows: Array<{ key: string; value: string }>;
  backHref: string;
  detailPanelData?: PsiDetailPanelData | null;
  relatedActions?: Array<{ label: string; actionKey: string }>;
}
export function PsiDetailPage({ title, source, isMock, error, rows, backHref, detailPanelData = null, relatedActions = [] }: PsiDetailPageProps) {
  return (
    <PsiDetailLayoutV072
      title={title}
      source={source}
      isMock={isMock}
      error={error}
      rows={rows}
      backHref={backHref}
      detailPanelData={detailPanelData}
      relatedActions={relatedActions}
    />
  );
}
