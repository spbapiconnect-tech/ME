import { PsiActionDetailPage } from "@/components/psi/actions";
import { getPsiActionDraftByKey } from "@/lib/psi-actions";

interface PageProps {
  params: Promise<{ actionKey: string }>;
}

export default async function PsiActionDetailRoutePage({ params }: PageProps) {
  const resolved = await params;
  const action = getPsiActionDraftByKey(resolved.actionKey) ?? null;

  return <PsiActionDetailPage action={action} actionKey={resolved.actionKey} />;
}
