import { Suspense } from "react";
import { FefoWasteControlPage } from "@/components/expiry/fefo-waste-control-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FefoWasteControlPage />
    </Suspense>
  );
}
