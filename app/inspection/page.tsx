import { Suspense } from "react";
import { InspectionWorkspacePage } from "@/components/inspection/inspection-workspace-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InspectionWorkspacePage />
    </Suspense>
  );
}
