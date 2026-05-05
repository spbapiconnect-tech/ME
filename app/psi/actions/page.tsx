import { PsiActionsPage } from "@/components/psi/actions";
import { psiActionDrafts } from "@/config/psi";

export default function PsiActionsRoutePage() {
  return <PsiActionsPage actions={psiActionDrafts} />;
}
