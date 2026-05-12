import { Suspense } from "react";
import { OutletWorkspacePage } from "@/components/outlet/outlet-workspace-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OutletWorkspacePage />
    </Suspense>
  );
}
