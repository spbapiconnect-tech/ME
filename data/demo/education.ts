import type { DemoModuleData } from "@/data/demo";

export const educationDemoData: DemoModuleData = {
  moduleCode: "education",
  scenario: {
    zh: "围绕 SOP-1001 与 CRS-1001 演示 SOP 更新、课程分配与学习闭环。",
    en: "Uses SOP-1001 and CRS-1001 to demonstrate SOP updates, course assignment, and learning follow-up.",
  },
  summary: {
    zh: "把门店执行问题连接到 SOP 与培训动作，形成演示闭环。",
    en: "Connects store execution issues to SOP and training actions for a complete demo loop.",
  },
  kpis: [
    { label: { zh: "活跃 SOP", en: "Active SOPs" }, value: "36", trend: "+2", tone: "brand" },
    { label: { zh: "已分派培训", en: "Training Assigned" }, value: "84", trend: "+11", tone: "info" },
    { label: { zh: "完成率", en: "Completion Rate" }, value: "92%", trend: "+3.6%", tone: "success" },
    { label: { zh: "逾期学习", en: "Overdue Learning" }, value: "6", trend: "Watch", tone: "warning" },
  ],
  listingRows: [
    {
      courseCode: "CRS-1001",
      courseName: "Replenishment Basics",
      audience: "Store Team",
      status: "active",
      owner: "Training Ops",
    },
    {
      courseCode: "SOP-1001",
      courseName: "Milk Replenishment SOP",
      audience: "Store Manager",
      status: "review",
      owner: "Store Excellence",
    },
    {
      courseCode: "CRS-1002",
      courseName: "Refund Audit Basics",
      audience: "Regional Ops",
      status: "watch",
      owner: "Regional Ops",
    },
  ],
  detailRecord: {
    sopCode: "SOP-1001",
    courseCode: "CRS-1001",
    title: "Milk Replenishment SOP",
    owner: "Store Excellence",
    assignedTo: "North Cluster Team",
    completionRate: "94%",
    overdueLearners: "6",
    quizPassRate: "91%",
    certificationExpiry: "2026-06-12",
    status: "Assigned",
  },
  detailSections: [
    {
      title: { zh: "课程 / SOP", en: "Course / SOP" },
      rows: [
        { label: "SOP", value: "SOP-1001" },
        { label: "Course", value: "CRS-1001" },
        { label: "Title", value: "Milk Replenishment SOP" },
        { label: "Owner", value: "Store Excellence" },
      ],
    },
    {
      title: { zh: "学习状态", en: "Learning Status" },
      rows: [
        { label: "Assigned To", value: "North Cluster Team" },
        { label: "Completion", value: "94%" },
        { label: "Quiz Pass Rate", value: "91%" },
        { label: "Expiry", value: "2026-06-12" },
      ],
    },
  ],
  issues: [
    {
      id: "EDU-ISS-1001",
      title: "Overdue training for replenishment SOP",
      severity: "High",
      status: "open",
      owner: "June Li",
      dueDate: "2026-05-06",
    },
    {
      id: "EDU-ISS-1002",
      title: "Failed quiz on store receiving steps",
      severity: "Medium",
      status: "review",
      owner: "Eric Sun",
      dueDate: "2026-05-07",
    },
    {
      id: "EDU-ISS-1003",
      title: "Expired certification pending renewal",
      severity: "Medium",
      status: "in-progress",
      owner: "Training Ops",
      dueDate: "2026-05-08",
    },
  ],
  timeline: [
    { title: { zh: "SOP 已更新", en: "SOP Updated" }, timestamp: "2026-05-03 15:00", status: "closed" },
    { title: { zh: "课程已分派", en: "Course Assigned" }, timestamp: "2026-05-04 08:45", status: "active" },
    { title: { zh: "测验已提交", en: "Quiz Submitted" }, timestamp: "2026-05-04 17:20", status: "pending" },
  ],
  formPlaceholders: [
    {
      title: { zh: "课程分派", en: "Course Assignment" },
      fields: [
        { key: "courseCode", label: { zh: "课程编码", en: "Course Code" }, type: "text", value: "CRS-1001", required: true },
        { key: "audience", label: { zh: "目标人群", en: "Audience" }, type: "select", value: "North Cluster Team" },
        { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date", value: "2026-05-10" },
      ],
    },
    {
      title: { zh: "知识材料", en: "Knowledge Materials" },
      fields: [
        { key: "sopCode", label: { zh: "SOP 编码", en: "SOP Code" }, type: "text", value: "SOP-1001" },
        { key: "note", label: { zh: "学习说明", en: "Learning Note" }, type: "textarea", value: "Follow replenishment exception flow" },
        { key: "attachment", label: { zh: "SOP 文件", en: "SOP File" }, type: "upload", value: "SOP PDF placeholder" },
      ],
    },
  ],
  statusDistribution: [
    { label: { zh: "进行中", en: "Active" }, value: "24", tone: "brand" },
    { label: { zh: "已完成", en: "Completed" }, value: "52", tone: "success" },
    { label: { zh: "逾期", en: "Overdue" }, value: "6", tone: "warning" },
    { label: { zh: "异常", en: "Issues" }, value: "3", tone: "danger" },
  ],
  reportRows: [
    { program: "Replenishment SOP", assigned: "28", completion: "94%", overdue: "2" },
    { program: "Refund Audit", assigned: "20", completion: "88%", overdue: "3" },
    { program: "Receiving Basics", assigned: "36", completion: "93%", overdue: "1" },
  ],
  chartSeries: [
    { label: "Week 1", value: 48 },
    { label: "Week 2", value: 63 },
    { label: "Week 3", value: 72 },
    { label: "Week 4", value: 81 },
    { label: "Week 5", value: 74 },
  ],
  ctaPlaceholders: [
    { zh: "分派课程", en: "Assign Course" },
    { zh: "复核", en: "Review" },
    { zh: "导出", en: "Export" },
  ],
};
