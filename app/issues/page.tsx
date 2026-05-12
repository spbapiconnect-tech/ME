import { Suspense } from "react";
import { IncidentCenterPage } from "@/components/issues/incident-center-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <IncidentCenterPage />
    </Suspense>
  );
}
