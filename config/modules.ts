import type { ModuleDefinition } from "@/types/module";

const allThemes = ["bright", "dark", "moon"] as const;

export const coreModules: ModuleDefinition[] = [
  {
    code: "procurement",
    name: { zh: "采购", en: "Procurement" },
    shortName: { zh: "采购", en: "Procure" },
    category: "core",
    icon: "ShoppingCart",
    status: "enabled",
    routes: {
      home: "/modules/procurement",
      listing: "/modules/procurement/listing",
      detail: "/modules/procurement/detail",
      issue: "/modules/procurement/issue",
      form: "/modules/procurement/form"
    },
    permissions: ["procurement.view", "module.audit"],
    themeSupport: [...allThemes]
  },
  {
    code: "supplier",
    name: { zh: "供应商", en: "Supplier" },
    shortName: { zh: "供方", en: "Supplier" },
    category: "control",
    icon: "Truck",
    status: "enabled",
    routes: {
      home: "/modules/supplier",
      listing: "/modules/supplier/listing",
      detail: "/modules/supplier/detail",
      issue: "/modules/supplier/issue",
      form: "/modules/supplier/form"
    },
    permissions: ["supplier.view", "module.audit"],
    themeSupport: [...allThemes]
  },
  {
    code: "inventory",
    name: { zh: "库存", en: "Inventory" },
    shortName: { zh: "库存", en: "Stock" },
    category: "core",
    icon: "Boxes",
    status: "enabled",
    routes: {
      home: "/modules/inventory",
      listing: "/modules/inventory/listing",
      detail: "/modules/inventory/detail",
      issue: "/modules/inventory/issue",
      form: "/modules/inventory/form"
    },
    permissions: ["inventory.view", "module.audit"],
    themeSupport: [...allThemes]
  },
  {
    code: "pos-report",
    name: { zh: "POS 报表", en: "POS Report" },
    shortName: { zh: "报表", en: "POS" },
    category: "control",
    icon: "ChartColumn",
    status: "coming-soon",
    routes: {
      home: "/modules/pos-report",
      listing: "/modules/pos-report/listing",
      detail: "/modules/pos-report/detail",
      issue: "/modules/pos-report/issue",
      form: "/modules/pos-report/form"
    },
    permissions: ["pos-report.view", "module.audit"],
    themeSupport: [...allThemes]
  },
  {
    code: "education",
    name: { zh: "培训", en: "Education" },
    shortName: { zh: "培训", en: "Learning" },
    category: "future",
    icon: "GraduationCap",
    status: "coming-soon",
    routes: {
      home: "/modules/education",
      listing: "/modules/education/listing",
      detail: "/modules/education/detail",
      issue: "/modules/education/issue",
      form: "/modules/education/form"
    },
    permissions: ["education.view", "module.audit"],
    themeSupport: [...allThemes]
  },
  {
    code: "task",
    name: { zh: "任务", en: "Task" },
    shortName: { zh: "任务", en: "Task" },
    category: "core",
    icon: "ListTodo",
    status: "enabled",
    routes: {
      home: "/modules/task",
      listing: "/modules/task/listing",
      detail: "/modules/task/detail",
      issue: "/modules/task/issue",
      form: "/modules/task/form"
    },
    permissions: ["task.view", "task.manage", "module.audit"],
    themeSupport: [...allThemes]
  }
];
