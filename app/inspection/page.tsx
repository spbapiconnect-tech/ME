import { notFound } from "next/navigation";

import { InspectionErpPage } from "@/components/inspection/inspection-erp-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function InspectionPage() {
  const moduleItem = getRestaurantModuleByKey("inspection");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <InspectionErpPage module={moduleItem} />;
}
