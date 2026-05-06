import { PsiIssuesPage } from "@/components/psi/psi-issues-page";
import { getPsiIssuesPageData } from "@/lib/page-data/psi/issues-page-data";

export default async function PsiIssuesRoute() {
  const data = await getPsiIssuesPageData();
  return <PsiIssuesPage rows={data.rows} source={data.meta.source} isMock={data.isMock} error={data.error} />;
}
