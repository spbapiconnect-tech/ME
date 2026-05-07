import { notFound } from "next/navigation";

import { RestaurantModulePage } from "@/components/operations";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function IssuesPage() {
  const moduleItem = getRestaurantModuleByKey("issues");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModulePage module={moduleItem} />;
}
