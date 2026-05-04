import { DemoModulePage } from "@/components/demo/demo-module-page";
import { getDemoModuleRoutePageData } from "@/lib/page-data";

interface DemoModuleRouteProps {
  params: Promise<{
    module: string;
  }>;
}

export default async function DemoModuleRoute({ params }: DemoModuleRouteProps) {
  const resolvedParams = await params;
  const pageData = await getDemoModuleRoutePageData(resolvedParams.module);

  return <DemoModulePage moduleCode={resolvedParams.module} moduleCodes={pageData.moduleCodes} demoData={pageData.demoData} />;
}
