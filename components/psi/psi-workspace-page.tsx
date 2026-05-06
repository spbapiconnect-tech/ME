import { PsiWorkspaceLayoutV072 } from "@/components/psi/detail/x2";

import type { DisplayRecord } from "@/types/display-model";

interface WorkspacePageProps {
  title: string;
  subtitle: string;
  source: string;
  isMock: boolean;
  error?: string;
  stats: Array<{ label: string; value: string | number }>;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
  detailBasePath: string;
  actionShortcuts?: Array<{ label: string; actionKey: string }>;
}

export function PsiWorkspacePage(props: WorkspacePageProps) {
  return <PsiWorkspaceLayoutV072 {...props} />;
}
