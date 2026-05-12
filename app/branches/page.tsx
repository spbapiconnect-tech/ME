import { Suspense } from "react";
import { BranchControlPage } from "@/components/branches/branch-control-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BranchControlPage />
    </Suspense>
  );
}
