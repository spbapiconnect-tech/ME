import { Suspense } from "react";
import { SopTrainingControlPage } from "@/components/sop/sop-training-control-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SopTrainingControlPage />
    </Suspense>
  );
}
