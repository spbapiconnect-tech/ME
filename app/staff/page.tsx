import { notFound } from "next/navigation";

import { RestaurantModulePage } from "@/components/operations";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function StaffPage() {
  const moduleItem = getRestaurantModuleByKey("staff");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModulePage module={moduleItem} />;
}
