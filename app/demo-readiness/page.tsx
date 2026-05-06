import { DemoReadinessPage } from "@/components/demo-readiness";
import { getDemoReadinessPageData } from "@/lib/demo-readiness";

export default function DemoReadinessRoute() {
  return <DemoReadinessPage data={getDemoReadinessPageData()} />;
}
