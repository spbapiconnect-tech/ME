export type SopCreateType =
  | "recipe"
  | "opening-closing"
  | "cleaning"
  | "service"
  | "safety"
  | "training"
  | "product-launch";

export type SopCreateIcon =
  | "chef"
  | "door"
  | "cleaning"
  | "book"
  | "shield"
  | "graduation"
  | "sparkles";

export type SopCreateTypeConfig = {
  key: SopCreateType;
  title: string;
  description: string;
  category: string;
  processArea: string;
  targetRole: string;
  acknowledgementRequired: "Yes" | "No";
  trainingRequired: "Yes" | "No";
  icon: SopCreateIcon;
  isActive: boolean;
};

export const sopCreateTypes: SopCreateTypeConfig[] = [
  {
    key: "recipe",
    title: "Recipe / Product SOP",
    description: "Burger build, product recipe, kitchen process, product standard.",
    category: "Kitchen",
    processArea: "Product",
    targetRole: "Kitchen Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
    icon: "chef",
    isActive: true,
  },
  {
    key: "opening-closing",
    title: "Opening / Closing",
    description: "Daily opening, closing, cash-up, handover and outlet readiness.",
    category: "Operations",
    processArea: "Outlet",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "No",
    icon: "door",
    isActive: true,
  },
  {
    key: "cleaning",
    title: "Cleaning",
    description: "Cleaning checklist, hygiene, station reset and proof requirements.",
    category: "Cleaning",
    processArea: "Outlet",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "No",
    icon: "cleaning",
    isActive: true,
  },
  {
    key: "service",
    title: "Service",
    description: "Cashier, front counter, customer handling and complaint prevention.",
    category: "Service",
    processArea: "Front",
    targetRole: "Front Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "No",
    icon: "book",
    isActive: true,
  },
  {
    key: "safety",
    title: "Safety",
    description: "Food safety, equipment safety, risk control and escalation rules.",
    category: "Safety",
    processArea: "Compliance",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
    icon: "shield",
    isActive: true,
  },
  {
    key: "training",
    title: "Training",
    description: "Onboarding, staff learning path, required reading and acknowledgement.",
    category: "Training",
    processArea: "People",
    targetRole: "New Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
    icon: "graduation",
    isActive: true,
  },
  {
    key: "product-launch",
    title: "Product Launch",
    description: "New item rollout, launch briefing, media guide and staff acknowledgement.",
    category: "Product",
    processArea: "Launch",
    targetRole: "Outlet Staff",
    acknowledgementRequired: "Yes",
    trainingRequired: "Yes",
    icon: "sparkles",
    isActive: true,
  },
];

export function activeSopCreateTypes() {
  return sopCreateTypes.filter((type) => type.isActive);
}
