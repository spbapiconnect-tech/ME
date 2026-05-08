export type BranchLocale = "en" | "zh";

export const branchLanguageCopy = {
  en: {
    page: {
      title: "Branch Management",
      subtitle: "Manage branch operating status, performance, staffing, tasks, and alerts across all stores.",
      breadcrumbs: ["ME", "Store Operations", "Branch Management"],
    },
    actions: {
      addBranch: "Add Branch",
      createBranch: "Create Branch",
      export: "Export",
      viewReports: "View Reports",
      openTasks: "Open Tasks",
      importBranches: "Import Branches",
      batchEdit: "Batch Edit",
      deleteArchive: "Delete Archive",
      createTask: "Create Task",
      more: "More",
    },
    filters: {
      allBranches: "All Branches",
      allRegions: "All Regions",
      allStatus: "All Status",
      moreFilters: "More Filters",
      searchPlaceholder: "Search branch, region, manager...",
    },
    fields: {
      branchName: "Branch Name",
      branchCode: "Branch Code",
      region: "Region",
      manager: "Manager",
      phone: "Phone",
      address: "Address",
      status: "Status",
    },
    detail: {
      currentShift: "Current Shift",
      recentActivity: "Recent Activity",
      regionSuffix: "Region",
      upcoming: "Content will be available soon.",
      salesInsightPrefix: "Sales for",
      salesInsightSuffix: "are up by 12% compared to last week. Productivity is high.",
    },
    tabs: {
      overview: "Overview",
      branchHealth: "Branch Health",
      todayOperations: "Today Operations",
      relatedRecords: "Related Records",
      tasks: "Tasks",
      activity: "Activity",
    },
    status: {
      operating: "Operating",
      attention: "Attention",
      preparation: "Preparation",
      inactive: "Inactive",
    },
  },
  zh: {
    page: {
      title: "门店管理",
      subtitle: "管理所有门店的营运状态、绩效、人手、任务与警报。",
      breadcrumbs: ["ME", "门店营运", "门店管理"],
    },
    actions: {
      addBranch: "新增门店",
      createBranch: "创建门店",
      export: "导出",
      viewReports: "查看报表",
      openTasks: "打开任务",
      importBranches: "导入门店",
      batchEdit: "批量编辑",
      deleteArchive: "归档门店",
      createTask: "创建任务",
      more: "更多",
    },
    filters: {
      allBranches: "全部门店",
      allRegions: "全部区域",
      allStatus: "全部状态",
      moreFilters: "更多筛选",
      searchPlaceholder: "搜索门店、区域、负责人...",
    },
    fields: {
      branchName: "门店名称",
      branchCode: "门店编号",
      region: "区域",
      manager: "负责人",
      phone: "电话",
      address: "地址",
      status: "状态",
    },
    detail: {
      currentShift: "当前班次",
      recentActivity: "最近动态",
      regionSuffix: "区域",
      upcoming: "内容即将开放。",
      salesInsightPrefix: "",
      salesInsightSuffix: "较上周提升 12%。当前生产效率良好。",
    },
    tabs: {
      overview: "概览",
      branchHealth: "门店健康",
      todayOperations: "今日营运",
      relatedRecords: "关联记录",
      tasks: "任务",
      activity: "动态",
    },
    status: {
      operating: "营运中",
      attention: "需关注",
      preparation: "准备中",
      inactive: "未启用",
    },
  },
} as const;

export function getBranchCopy(locale: BranchLocale) {
  return branchLanguageCopy[locale] ?? branchLanguageCopy.en;
}
