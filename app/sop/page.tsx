import { Suspense } from "react";
import { SopTrainingLibraryPage } from "@/components/sop/sop-training-library-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SopTrainingLibraryPage />
    </Suspense>
  );
}
