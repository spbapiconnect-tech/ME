import { notFound } from "next/navigation";

import { DemoStoryDetailPage } from "@/components/demo-story";
import { getDemoStoryPageData } from "@/lib/demo-story";
import type { MeDemoStoryKey } from "@/types/demo-story";

interface DemoStoryStepRouteProps {
  params: Promise<{
    stepKey: string;
  }>;
}

export default async function DemoStoryStepRoute({ params }: DemoStoryStepRouteProps) {
  const resolvedParams = await params;
  const data = getDemoStoryPageData(resolvedParams.stepKey as MeDemoStoryKey);

  if (!data.currentStep) {
    notFound();
  }

  return <DemoStoryDetailPage data={data} />;
}
