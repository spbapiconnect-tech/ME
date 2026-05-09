import { notFound } from "next/navigation";

import { PsiReceivingErpPage } from "@/components/psi/psi-receiving-erp-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function ReceivingPage() {
  const moduleItem = getRestaurantModuleByKey("receiving");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <PsiReceivingErpPage module={moduleItem} />;
}
