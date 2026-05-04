import { createModulePageSchemas } from "@/config/page-schemas/_shared";

export const educationPageSchemas = createModulePageSchemas({
  moduleCode: "education",
  moduleName: { zh: "培训", en: "Education" },
  moduleShortName: { zh: "培训", en: "Learning" },
  moduleDescription: { zh: "SOP 与培训任务模板。", en: "SOP and training task templates." },
  dashboardWidgets: [
    { key: "learningTasks", title: { zh: "学习任务", en: "Learning Tasks" }, description: { zh: "当前培训任务占位", en: "Current learning task placeholders" } },
    { key: "completion", title: { zh: "完成率", en: "Completion Rate" }, description: { zh: "完成率观察项", en: "Completion rate watch items" } },
    { key: "sopUpdates", title: { zh: "SOP 更新", en: "SOP Updates" }, description: { zh: "SOP 更新提醒", en: "SOP update reminders" } },
    { key: "reviewQueue", title: { zh: "复盘队列", en: "Review Queue" }, description: { zh: "培训复盘事项", en: "Training review queue" } }
  ],
  listingColumns: [
    { key: "courseCode", label: { zh: "课程编码", en: "Course Code" }, emphasis: true },
    { key: "courseName", label: { zh: "课程名称", en: "Course Name" } },
    { key: "audience", label: { zh: "适用角色", en: "Audience" } },
    { key: "status", label: { zh: "状态", en: "Status" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" } }
  ],
  filters: [
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status" },
    { key: "audience", label: { zh: "适用角色", en: "Audience" }, type: "select" },
    { key: "courseName", label: { zh: "课程搜索", en: "Course Search" }, type: "search" }
  ],
  detailSections: [
    { key: "summary", title: { zh: "课程摘要", en: "Course Summary" }, layout: "panel", fieldKeys: ["courseCode", "courseName", "audience", "status"] },
    { key: "owner", title: { zh: "负责人与节奏", en: "Owner & Cadence" }, layout: "panel", fieldKeys: ["owner"] },
    { key: "timeline", title: { zh: "学习时间线", en: "Learning Timeline" }, layout: "timeline" }
  ],
  issueFields: [
    { key: "issueType", label: { zh: "问题类型", en: "Issue Type" }, type: "select", placeholder: { zh: "选择问题类型", en: "Select Issue Type" } },
    { key: "courseName", label: { zh: "课程名称", en: "Course Name" }, type: "text", placeholder: { zh: "请输入课程名称", en: "Enter Course Name" } },
    { key: "severity", label: { zh: "严重级别", en: "Severity" }, type: "status", placeholder: { zh: "选择严重级别", en: "Select Severity" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" } },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date", placeholder: { zh: "选择截止日期", en: "Select Due Date" } },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status", placeholder: { zh: "选择状态", en: "Select Status" } }
  ],
  formFields: [
    { key: "courseCode", label: { zh: "课程编码", en: "Course Code" }, type: "text", placeholder: { zh: "请输入课程编码", en: "Enter Course Code" }, required: true },
    { key: "courseName", label: { zh: "课程名称", en: "Course Name" }, type: "text", placeholder: { zh: "请输入课程名称", en: "Enter Course Name" }, required: true },
    { key: "audience", label: { zh: "适用角色", en: "Audience" }, type: "select", placeholder: { zh: "选择适用角色", en: "Select Audience" }, required: true },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" }, required: true },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "select", placeholder: { zh: "选择状态", en: "Select Status" } },
    { key: "publishDate", label: { zh: "发布时间", en: "Publish Date" }, type: "date", placeholder: { zh: "选择发布时间", en: "Select Publish Date" } },
    { key: "notes", label: { zh: "备注", en: "Notes" }, type: "textarea", placeholder: { zh: "请输入备注", en: "Enter Notes" } }
  ],
});
