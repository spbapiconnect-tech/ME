import { BusinessWorkspacePage } from "@/components/business";
import { getBusinessWorkspacePageData } from "@/lib/page-data/business-workspace-page-data";

export default async function HomePage() {
  const data = await getBusinessWorkspacePageData();

  return <BusinessWorkspacePage data={data} />;
}
