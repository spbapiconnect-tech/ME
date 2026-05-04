import { DemoModulePage } from "@/components/demo/demo-module-page";

interface DemoModuleRouteProps {
  params: Promise<{
    module: string;
  }>;
}

export default async function DemoModuleRoute({ params }: DemoModuleRouteProps) {
  const resolvedParams = await params;

  return <DemoModulePage moduleCode={resolvedParams.module} />;
}
