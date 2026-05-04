import { createModulePageSchemas } from "@/config/page-schemas/_shared";

export const taskPageSchemas = createModulePageSchemas({
  moduleCode: "task",
  moduleName: { zh: "任务", en: "Task" },
  moduleShortName: { zh: "任务", en: "Task" },
  moduleDescription: { zh: "门店任务协同模板。", en: "Store task collaboration templates." },
  dashboardWidgets: [
    { key: "openTasks", title: { zh: "待办任务", en: "Open Tasks" }, description: { zh: "当前待办任务数量", en: "Open task placeholders" } },
    { key: "overdue", title: { zh: "逾期任务", en: "Overdue Tasks" }, description: { zh: "逾期关注项", en: "Overdue watch items" } },
    { key: "completion", title: { zh: "完成率", en: "Completion Rate" }, description: { zh: "执行完成率占位", en: "Execution completion placeholder" } },
    { key: "focus", title: { zh: "重点跟进", en: "Focus Follow-up" }, description: { zh: "重点跟进事项", en: "Focus follow-up items" } }
  ],
  listingColumns: [
    { key: "taskNo", label: { zh: "任务编号", en: "Task No" }, emphasis: true },
    { key: "taskTitle", label: { zh: "任务标题", en: "Task Title" } },
    { key: "status", label: { zh: "状态", en: "Status" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" } },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" } },
    { key: "priority", label: { zh: "优先级", en: "Priority" } }
  ],
  filters: [
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status" },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "owner" },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date-range" }
  ],
  detailSections: [
    { key: "summary", title: { zh: "任务摘要", en: "Task Summary" }, layout: "panel", fieldKeys: ["taskNo", "taskTitle", "status", "priority"] },
    { key: "ownership", title: { zh: "责任信息", en: "Ownership" }, layout: "panel", fieldKeys: ["owner", "dueDate"] },
    { key: "timeline", title: { zh: "任务时间线", en: "Task Timeline" }, layout: "timeline" }
  ],
  issueFields: [
    { key: "issueType", label: { zh: "问题类型", en: "Issue Type" }, type: "select", placeholder: { zh: "选择问题类型", en: "Select Issue Type" } },
    { key: "taskTitle", label: { zh: "任务标题", en: "Task Title" }, type: "text", placeholder: { zh: "请输入任务标题", en: "Enter Task Title" } },
    { key: "severity", label: { zh: "严重级别", en: "Severity" }, type: "status", placeholder: { zh: "选择严重级别", en: "Select Severity" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" } },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date", placeholder: { zh: "选择截止日期", en: "Select Due Date" } },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status", placeholder: { zh: "选择状态", en: "Select Status" } }
  ],
  formFields: [
    { key: "taskNo", label: { zh: "任务编号", en: "Task No" }, type: "text", placeholder: { zh: "请输入任务编号", en: "Enter Task No" }, required: true },
    { key: "taskTitle", label: { zh: "任务标题", en: "Task Title" }, type: "text", placeholder: { zh: "请输入任务标题", en: "Enter Task Title" }, required: true },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" }, required: true },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date", placeholder: { zh: "选择截止日期", en: "Select Due Date" }, required: true },
    { key: "priority", label: { zh: "优先级", en: "Priority" }, type: "select", placeholder: { zh: "选择优先级", en: "Select Priority" }, required: true },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "select", placeholder: { zh: "选择状态", en: "Select Status" } },
    { key: "notes", label: { zh: "备注", en: "Notes" }, type: "textarea", placeholder: { zh: "请输入备注", en: "Enter Notes" } }
  ],
});
