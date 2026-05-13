import { Suspense } from "react";
import { OutletStaffHomePage } from "@/components/outlet/outlet-staff-home-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OutletStaffHomePage />
    </Suspense>
  );
}
