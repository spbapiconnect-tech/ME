"use client";

import { useState } from "react";

export type ErpLanguage = "en" | "zh";

export const ERP_LANGUAGE_STORAGE_KEY = "me-erp-language";

export const erpLanguages: { value: ErpLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

export const erpDictionary = {
  en: {
    dashboard: "Dashboard",
    branches: "Branches",
    inspection: "Inspection",
    issues: "Issues",
    tasks: "Tasks",
    psiOverview: "PSI Overview",
    procurement: "Procurement",
    supplier: "Supplier",
    inventory: "Inventory",
    receiving: "Receiving",
    staff: "Staff",
    schedule: "Schedule",
    training: "Training",
    reports: "Reports",
    rolesPermission: "Roles & Permission",
    settings: "Settings",
    integration: "Integration",
    add: "Add",
    export: "Export",
    viewReports: "View Reports",
    openTasks: "Open Tasks",
    openDetail: "Open Detail",
    createTask: "Create Task",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    status: "Status",
    manager: "Manager",
    region: "Region",
    lastUpdate: "Last Update",
  },
  zh: {
    dashboard: "工作台",
    branches: "门店管理",
    inspection: "巡检管理",
    issues: "异常事件",
    tasks: "任务管理",
    psiOverview: "采购库存总览",
    procurement: "采购管理",
    supplier: "供应商管理",
    inventory: "库存管理",
    receiving: "收货管理",
    staff: "员工管理",
    schedule: "排班管理",
    training: "培训与 SOP",
    reports: "报表中心",
    rolesPermission: "权限管理",
    settings: "系统设置",
    integration: "集成管理",
    add: "新增",
    export: "导出",
    viewReports: "查看报表",
    openTasks: "打开任务",
    openDetail: "查看详情",
    createTask: "创建任务",
    save: "保存",
    cancel: "取消",
    search: "搜索",
    status: "状态",
    manager: "经理",
    region: "区域",
    lastUpdate: "最后更新",
  },
} as const;

export type ErpDictionaryKey = keyof typeof erpDictionary.en;

function isErpLanguage(value: string | null): value is ErpLanguage {
  return value === "en" || value === "zh";
}

function readInitialLanguage(defaultLanguage: ErpLanguage): ErpLanguage {
  if (typeof window === "undefined") return defaultLanguage;
  const stored = window.localStorage.getItem(ERP_LANGUAGE_STORAGE_KEY);
  return isErpLanguage(stored) ? stored : defaultLanguage;
}

export function useErpLanguage(defaultLanguage: ErpLanguage = "en") {
  const [language, setLanguageState] = useState<ErpLanguage>(() => readInitialLanguage(defaultLanguage));

  const setLanguage = (next: ErpLanguage) => {
    setLanguageState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ERP_LANGUAGE_STORAGE_KEY, next);
    }
  };

  const t = (key: ErpDictionaryKey) => erpDictionary[language][key];

  return { language, setLanguage, languages: erpLanguages, t };
}
