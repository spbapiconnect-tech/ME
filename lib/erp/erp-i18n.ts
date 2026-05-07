export type ErpLocale = "en" | "zh";

export const ERP_LOCALE_STORAGE_KEY = "me-erp-locale";

export const erpDictionary = {
  dashboard: { en: "Dashboard", zh: "工作台" },
  branches: { en: "Branches", zh: "门店管理" },
  inspection: { en: "Inspection", zh: "巡检管理" },
  issues: { en: "Issues", zh: "异常事件" },
  tasks: { en: "Tasks", zh: "任务管理" },
  psiOverview: { en: "PSI Overview", zh: "采购库存总览" },
  procurement: { en: "Procurement", zh: "采购管理" },
  supplier: { en: "Supplier", zh: "供应商管理" },
  inventory: { en: "Inventory", zh: "库存管理" },
  receiving: { en: "Receiving", zh: "收货管理" },
  staff: { en: "Staff", zh: "员工管理" },
  schedule: { en: "Schedule", zh: "排班管理" },
  training: { en: "Training", zh: "培训与 SOP" },
  reports: { en: "Reports", zh: "报表中心" },
  rolesPermission: { en: "Roles & Permission", zh: "权限管理" },
  settings: { en: "Settings", zh: "系统设置" },
  integration: { en: "Integration", zh: "集成管理" },
  add: { en: "Add", zh: "新增" },
  export: { en: "Export", zh: "导出" },
  viewReports: { en: "View Reports", zh: "查看报表" },
  openTasks: { en: "Open Tasks", zh: "打开任务" },
  openDetail: { en: "Open Detail", zh: "查看详情" },
  save: { en: "Save", zh: "保存" },
  cancel: { en: "Cancel", zh: "取消" },
  search: { en: "Search", zh: "搜索" },
  status: { en: "Status", zh: "状态" },
} as const;

export type ErpDictionaryKey = keyof typeof erpDictionary;

export function resolveErpLabel(key: ErpDictionaryKey, locale: ErpLocale = "en") {
  return erpDictionary[key][locale];
}

export function isErpLocale(value: string | null): value is ErpLocale {
  return value === "en" || value === "zh";
}
