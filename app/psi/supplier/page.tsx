import { PsiSupplierPage } from "@/components/psi";
import { getPsiSupplierWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiSupplierRoute() {
  const data = await getPsiSupplierWorkspacePageData();

  return <PsiSupplierPage source={data.meta.source} isMock={data.isMock} />;
}
