export type OutletStaffWorkType =
  | "task"
  | "inspection"
  | "training"
  | "sop"
  | "complaint"
  | "rework"
  | "proof";

export type OutletInboxGroup =
  | "Customer Complaint"
  | "GrabFood Complaint"
  | "Inspection Follow-up"
  | "Rework / Proof"
  | "Training / SOP"
  | "Special Task";

export type OutletStaffWorkItem = {
  id: string;
  sourceModule: "tasks" | "inspection" | "sop" | "issues";
  sourceRecordId: string;
  type: OutletStaffWorkType;
  inboxGroup: OutletInboxGroup;
  title: string;
  description: string;
  status: string;
  date: string;
  startTime: string;
  endTime?: string;
  priority: "low" | "normal" | "high" | "urgent";
  primaryAction: string;
  proofRequired: boolean;
  reviewState?: string;
  contentJson?: string;
  mediaUrl?: string;
  pdfUrl?: string;
  checklistText?: string;
};

type RuntimeDetail = {
  label: string;
  value?: string;
};

type RuntimeRow = {
  id: string;
  title?: string;
  status?: string;
  description?: string;
  detailItems?: RuntimeDetail[];
  createdAt?: string;
  updatedAt?: string;
};

function detailValue(row: RuntimeRow, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value || "";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeDate(value: string) {
  if (!value) return todayISO();

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);

  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  return todayISO();
}

function normalizeTime(value: string, fallback = "09:00") {
  if (!value) return fallback;

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  const match = value.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return fallback;

  let hour = Number(match[1]);
  const minute = match[2] || "00";
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function priorityFromStatus(status: string): OutletStaffWorkItem["priority"] {
  const value = status.toLowerCase();

  if (value.includes("overdue") || value.includes("rejected") || value.includes("failed")) return "urgent";
  if (value.includes("review") || value.includes("rework") || value.includes("pending")) return "high";
  if (value.includes("scheduled") || value.includes("assigned")) return "normal";

  return "normal";
}

function classifyIssue(row: RuntimeRow): OutletInboxGroup {
  const source = `${detailValue(row, "Source")} ${detailValue(row, "Category")} ${row.title || ""}`.toLowerCase();

  if (source.includes("grab")) return "GrabFood Complaint";
  if (source.includes("customer") || source.includes("complaint")) return "Customer Complaint";

  return "Rework / Proof";
}

function taskGroup(row: RuntimeRow): OutletInboxGroup {
  const source = `${detailValue(row, "Source")} ${detailValue(row, "Task Type")} ${row.title || ""}`.toLowerCase();

  if (source.includes("inspection")) return "Inspection Follow-up";
  if (source.includes("recheck") || source.includes("proof") || source.includes("corrective")) return "Rework / Proof";
  if (source.includes("training") || source.includes("sop")) return "Training / SOP";

  return "Special Task";
}

export function buildOutletStaffWorkItems(input: {
  taskRows: RuntimeRow[];
  inspectionRows: RuntimeRow[];
  sopRows: RuntimeRow[];
  issueRows: RuntimeRow[];
}) {
  const taskItems: OutletStaffWorkItem[] = input.taskRows.map((row) => {
    const dueAt = detailValue(row, "Due At");
    const dueDate = detailValue(row, "Due Date");
    const dueTime = detailValue(row, "Due Time");
    const photoRequired = detailValue(row, "Photo Required");
    const proofStatus = detailValue(row, "Photo Proof Status");
    const status = row.status || "Scheduled";

    return {
      id: `task-${row.id}`,
      sourceModule: "tasks",
      sourceRecordId: row.id,
      type: taskGroup(row) === "Training / SOP" ? "training" : "task",
      inboxGroup: taskGroup(row),
      title: row.title || "Outlet Task",
      description: detailValue(row, "Completion Standard") || detailValue(row, "Task Type") || "Outlet task",
      status,
      date: normalizeDate(dueAt || dueDate),
      startTime: normalizeTime(dueAt || dueTime, "09:00"),
      priority: priorityFromStatus(`${status} ${proofStatus}`),
      primaryAction: proofStatus === "Rejected" ? "Fix Again" : proofStatus === "Missing" ? "Upload Proof" : "Open",
      proofRequired: photoRequired === "Required" || proofStatus === "Missing" || proofStatus === "Rejected",
      reviewState: detailValue(row, "Manager Review Status"),
    };
  });

  const inspectionItems: OutletStaffWorkItem[] = input.inspectionRows.map((row) => {
    const scheduledTime = detailValue(row, "Scheduled Time");
    const status = row.status || "Pending";

    return {
      id: `inspection-${row.id}`,
      sourceModule: "inspection",
      sourceRecordId: row.id,
      type: "inspection",
      inboxGroup: "Inspection Follow-up",
      title: row.title || "Inspection",
      description: detailValue(row, "Inspection Type") || "Checklist runner",
      status,
      date: normalizeDate(scheduledTime),
      startTime: normalizeTime(scheduledTime, "10:00"),
      priority: priorityFromStatus(status),
      primaryAction: "Run Checklist",
      proofRequired: detailValue(row, "Photo Proof Required") === "Yes",
      reviewState: detailValue(row, "Review Status"),
    };
  });

  const sopItems: OutletStaffWorkItem[] = input.sopRows.map((row) => {
    const due = detailValue(row, "Review Due") || detailValue(row, "Due Date");
    const acknowledgement = detailValue(row, "Acknowledgement") || detailValue(row, "Acknowledgement Status") || "Pending";

    return {
      id: `sop-${row.id}`,
      sourceModule: "sop",
      sourceRecordId: row.id,
      type: "sop",
      inboxGroup: "Training / SOP",
      title: row.title || "SOP",
      description: `${detailValue(row, "Version") || "v1.0"} · ${detailValue(row, "Target Role") || "Outlet Staff"}`,
      status: acknowledgement,
      date: normalizeDate(due),
      startTime: "12:00",
      priority: priorityFromStatus(acknowledgement),
      primaryAction: "Read",
      proofRequired: false,
      reviewState: acknowledgement,
      contentJson:
        detailValue(row, "SOP Content JSON") ||
        detailValue(row, "Content JSON") ||
        detailValue(row, "Employee Content JSON") ||
        detailValue(row, "Pages JSON"),
      mediaUrl:
        detailValue(row, "Cover Media") ||
        detailValue(row, "Cover Image") ||
        detailValue(row, "Training Video") ||
        detailValue(row, "Media URL"),
      pdfUrl:
        detailValue(row, "PDF URL") ||
        detailValue(row, "PDF") ||
        detailValue(row, "PDF Attachment"),
      checklistText:
        detailValue(row, "Checklist Items") ||
        detailValue(row, "Checklist") ||
        detailValue(row, "SOP Checklist"),
    };
  });

  const issueItems: OutletStaffWorkItem[] = input.issueRows.map((row) => {
    const status = row.status || "Open";
    const group = classifyIssue(row);

    return {
      id: `issue-${row.id}`,
      sourceModule: "issues",
      sourceRecordId: row.id,
      type: group.includes("Complaint") ? "complaint" : "rework",
      inboxGroup: group,
      title: row.title || "Issue",
      description: detailValue(row, "Category") || detailValue(row, "Source") || "Follow-up required",
      status,
      date: normalizeDate(detailValue(row, "Due At") || row.createdAt || row.updatedAt || ""),
      startTime: normalizeTime(detailValue(row, "Due At"), "15:00"),
      priority: priorityFromStatus(status),
      primaryAction: status.toLowerCase().includes("resolved") ? "View" : "Fix Again",
      proofRequired: !status.toLowerCase().includes("resolved"),
      reviewState: status,
    };
  });

  return [...taskItems, ...inspectionItems, ...sopItems, ...issueItems].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

export function getOutletWorkForDate(items: OutletStaffWorkItem[], date: string) {
  return items.filter((item) => item.date === date);
}

export function getOutletInboxItems(items: OutletStaffWorkItem[]) {
  return items.filter((item) => item.inboxGroup !== "Training / SOP");
}

export function getOutletTrainingItems(items: OutletStaffWorkItem[]) {
  return items.filter((item) => item.inboxGroup === "Training / SOP");
}
