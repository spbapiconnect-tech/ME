import { DemoModePage } from "@/components/demo-mode";
import { getDemoModePageData } from "@/lib/demo-mode";

export default function DemoModeRoute() {
  return <DemoModePage data={getDemoModePageData()} />;
}
