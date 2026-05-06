import { PsiInventoryPage } from "@/components/psi";
import { getPsiInventoryWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiInventoryRoute() {
  const data = await getPsiInventoryWorkspacePageData();

  return <PsiInventoryPage source={data.meta.source} isMock={data.isMock} />;
}
