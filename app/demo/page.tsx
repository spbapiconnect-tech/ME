import { DemoWorkspace } from "@/components/demo/demo-workspace";
import { getDemoWorkspacePageData } from "@/lib/page-data";

export default async function DemoPage() {
  const pageData = await getDemoWorkspacePageData();

  return <DemoWorkspace pageData={pageData} />;
}
