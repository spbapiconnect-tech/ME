import type { DemoModuleData } from "@/data/demo";

export const taskDemoData: DemoModuleData = {
  moduleCode: "task",
  scenario: {
    zh: "围绕 TASK-1001 演示门店跟进任务、升级与关闭动作。",
    en: "Uses TASK-1001 to demonstrate store follow-up tasks, escalation, and close actions.",
  },
  summary: {
    zh: "把库存与供应商风险拆解成门店执行任务，形成可展示的闭环。",
    en: "Breaks inventory and supplier risks into store execution tasks for a believable demo close loop.",
  },
  kpis: [
    { label: { zh: "我的任务", en: "My Tasks" }, value: "14", trend: "+2", tone: "brand" },
    { label: { zh: "团队任务", en: "Team Tasks" }, value: "38", trend: "North cluster", tone: "info" },
    { label: { zh: "逾期", en: "Overdue" }, value: "5", trend: "Need action", tone: "warning" },
    { label: { zh: "今日完成", en: "Completed Today" }, value: "11", trend: "+4", tone: "success" },
  ],
  listingRows: [
    {
      taskNo: "TASK-1001",
      taskTitle: "Review low stock replenishment plan",
      status: "in-progress",
      owner: "Mia Chen",
      dueDate: "2026-05-05",
      priority: "high",
    },
    {
      taskNo: "TASK-1002",
      taskTitle: "Confirm supplier late delivery response",
      status: "review",
      owner: "Leo Wong",
      dueDate: "2026-05-05",
      priority: "medium",
    },
    {
      taskNo: "TASK-1003",
      taskTitle: "Complete replenishment SOP refresh",
      status: "open",
      owner: "June Li",
      dueDate: "2026-05-06",
      priority: "medium",
    },
  ],
  detailRecord: {
    taskNo: "TASK-1001",
    taskTitle: "Review low stock replenishment plan",
    sourceSignal: "SKU-1001 / PR-1001",
    assignee: "Mia Chen",
    reviewer: "Jason Wu",
    branch: "Central Flagship",
    dueDate: "2026-05-05 17:00",
    updateAt: "2026-05-04 15:20",
    status: "In Progress",
    escalation: "Regional Ops after 24h",
  },
  detailSections: [
    {
      title: { zh: "任务概览", en: "Task Overview" },
      rows: [
        { label: "Task", value: "TASK-1001" },
        { label: "Name", value: "Review low stock replenishment plan" },
        { label: "Signal", value: "SKU-1001 / PR-1001" },
        { label: "Branch", value: "Central Flagship" },
      ],
    },
    {
      title: { zh: "执行上下文", en: "Execution Context" },
      rows: [
        { label: "Assignee", value: "Mia Chen" },
        { label: "Reviewer", value: "Jason Wu" },
        { label: "Due", value: "2026-05-05 17:00" },
        { label: "Escalation", value: "Regional Ops after 24h" },
      ],
    },
  ],
  issues: [
    {
      id: "TASK-ISS-1001",
      title: "Overdue task on replenishment review",
      severity: "High",
      status: "open",
      owner: "Mia Chen",
      dueDate: "2026-05-05",
    },
    {
      id: "TASK-ISS-1002",
      title: "Rejected submission requires update",
      severity: "Medium",
      status: "review",
      owner: "Leo Wong",
      dueDate: "2026-05-06",
    },
    {
      id: "TASK-ISS-1003",
      title: "Escalation pending regional response",
      severity: "Medium",
      status: "in-progress",
      owner: "Jason Wu",
      dueDate: "2026-05-06",
    },
  ],
  timeline: [
    { title: { zh: "任务已创建", en: "Task Created" }, timestamp: "2026-05-04 11:10", status: "closed" },
    { title: { zh: "已分配负责人", en: "Assigned" }, timestamp: "2026-05-04 11:18", status: "closed" },
    { title: { zh: "执行进度已更新", en: "Updated" }, timestamp: "2026-05-04 15:20", status: "active" },
    { title: { zh: "待关闭", en: "Pending Close" }, timestamp: "2026-05-05 17:00", status: "pending" },
  ],
  formPlaceholders: [
    {
      title: { zh: "任务创建", en: "Task Creation" },
      fields: [
        { key: "taskNo", label: { zh: "任务编号", en: "Task No" }, type: "text", value: "TASK-1001", required: true },
        { key: "taskTitle", label: { zh: "任务标题", en: "Task Title" }, type: "text", value: "Review low stock replenishment plan", required: true },
        { key: "assignee", label: { zh: "负责人", en: "Assignee" }, type: "user", value: "Mia Chen" },
      ],
    },
    {
      title: { zh: "执行与关闭", en: "Execution & Close" },
      fields: [
        { key: "dueDate", label: { zh: "截止时间", en: "Due Date" }, type: "date", value: "2026-05-05 17:00" },
        { key: "note", label: { zh: "更新说明", en: "Update Note" }, type: "textarea", value: "Store replenishment review placeholder" },
        { key: "evidence", label: { zh: "附件", en: "Evidence" }, type: "upload", value: "Task evidence placeholder" },
      ],
    },
  ],
  statusDistribution: [
    { label: { zh: "进行中", en: "In Progress" }, value: "18", tone: "brand" },
    { label: { zh: "待复核", en: "Review" }, value: "9", tone: "info" },
    { label: { zh: "逾期", en: "Overdue" }, value: "5", tone: "warning" },
    { label: { zh: "已关闭", en: "Closed" }, value: "11", tone: "success" },
  ],
  reportRows: [
    { queue: "Replenishment", open: "8", overdue: "2", completedToday: "4" },
    { queue: "Supplier Follow-Up", open: "6", overdue: "1", completedToday: "3" },
    { queue: "SOP Actions", open: "5", overdue: "2", completedToday: "4" },
  ],
  chartSeries: [
    { label: "Mon", value: 44 },
    { label: "Tue", value: 57 },
    { label: "Wed", value: 62 },
    { label: "Thu", value: 71 },
    { label: "Fri", value: 69 },
  ],
  ctaPlaceholders: [
    { zh: "创建任务", en: "Create Task" },
    { zh: "分配", en: "Assign" },
    { zh: "关闭", en: "Close" },
  ],
};
