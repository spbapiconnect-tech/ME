export type OutletWorkspaceFilter = {
  outlet: string;
  role: string;
};

export type OutletActionTone = "default" | "warning" | "danger" | "success" | "muted";

export type OutletWorkspaceCard = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  tone: OutletActionTone;
  module: "tasks" | "sop" | "inspection" | "issues" | "expiry";
  href: string;
  dueLabel?: string;
  proofLabel?: string;
  actionLabel?: string;
};

export function outletDetailValue(row: any, label: string) {
  const item = row?.detailItems?.find((detail: any) => detail.label === label);
  return item?.value || "";
}

export function matchOutletTarget(row: any, filter: OutletWorkspaceFilter) {
  const targetOutlet =
    outletDetailValue(row, "Target Outlet") ||
    outletDetailValue(row, "Target Branch") ||
    outletDetailValue(row, "Branch") ||
    outletDetailValue(row, "Outlet") ||
    row?.branch ||
    row?.branchName ||
    "";

  if (!filter.outlet || filter.outlet === "All Branches") return true;
  if (!targetOutlet) return true;
  return targetOutlet === filter.outlet || targetOutlet === "All Branches";
}

export function matchRoleTarget(row: any, filter: OutletWorkspaceFilter) {
  const targetRole =
    outletDetailValue(row, "Target Role") ||
    outletDetailValue(row, "Role") ||
    row?.targetRole ||
    "";

  if (!filter.role || filter.role === "All Roles") return true;
  if (!targetRole) return true;
  return targetRole === filter.role || targetRole === "All Roles";
}

export function buildOutletTaskCards(rows: any[], filter: OutletWorkspaceFilter): OutletWorkspaceCard[] {
  return rows
    .filter((row) => matchOutletTarget(row, filter) && matchRoleTarget(row, filter))
    .map((row) => {
      const status = row.status || outletDetailValue(row, "Status") || "Pending";
      const proof =
        outletDetailValue(row, "Photo Proof Status") ||
        outletDetailValue(row, "Proof Status") ||
        outletDetailValue(row, "Manager Review Status") ||
        "";

      const due =
        outletDetailValue(row, "Due") ||
        outletDetailValue(row, "Due Date") ||
        outletDetailValue(row, "Due At") ||
        row.dueDate ||
        "";

      const lower = String(status).toLowerCase();
      const tone: OutletActionTone =
        lower.includes("overdue") ? "danger" :
        lower.includes("rework") || lower.includes("rejected") ? "warning" :
        lower.includes("complete") || lower.includes("accepted") ? "success" :
        "default";

      return {
        id: row.id,
        title: row.title || "Outlet Task",
        subtitle: outletDetailValue(row, "Task Type") || outletDetailValue(row, "Source") || row.description || "Outlet execution task",
        status,
        tone,
        module: "tasks",
        href: `/tasks?taskId=${row.id}`,
        dueLabel: due,
        proofLabel: proof,
        actionLabel: proof?.toLowerCase().includes("rejected") ? "Upload New Proof" : "Open Task",
      };
    });
}

export function buildOutletTrainingCards(rows: any[], filter: OutletWorkspaceFilter): OutletWorkspaceCard[] {
  return rows
    .filter((row) => matchOutletTarget(row, filter) && matchRoleTarget(row, filter))
    .filter((row) => {
      const acknowledgement =
        outletDetailValue(row, "Acknowledgement") ||
        outletDetailValue(row, "Acknowledgement Status") ||
        "";
      return acknowledgement || row.status === "Approved" || row.status === "Effective";
    })
    .map((row) => {
      const acknowledgement =
        outletDetailValue(row, "Acknowledgement") ||
        outletDetailValue(row, "Acknowledgement Status") ||
        "Pending";

      const version = outletDetailValue(row, "Version") || "v1.0";

      return {
        id: row.id,
        title: row.title || "SOP Training",
        subtitle: `${version} · ${outletDetailValue(row, "Target Role") || filter.role || "Outlet Staff"}`,
        status: acknowledgement,
        tone: String(acknowledgement).toLowerCase().includes("acknowledged") ? "success" : "warning",
        module: "sop",
        href: `/sop?sopId=${row.id}`,
        actionLabel: "Read SOP",
      };
    });
}

export function buildOutletSopLibrary(rows: any[], filter: OutletWorkspaceFilter): OutletWorkspaceCard[] {
  return rows
    .filter((row) => matchOutletTarget(row, filter) && matchRoleTarget(row, filter))
    .filter((row) => ["Approved", "Effective", "Review", "Draft"].includes(row.status || ""))
    .map((row) => ({
      id: row.id,
      title: row.title || "SOP",
      subtitle: `${outletDetailValue(row, "Document Code") || "SOP"} · ${outletDetailValue(row, "Version") || "v1.0"}`,
      status: row.status || "Draft",
      tone: row.status === "Effective" || row.status === "Approved" ? "success" : "muted",
      module: "sop",
      href: `/sop?sopId=${row.id}`,
      actionLabel: "Open SOP",
    }));
}

export function buildOutletInspectionCards(rows: any[], filter: OutletWorkspaceFilter): OutletWorkspaceCard[] {
  return rows
    .filter((row) => matchOutletTarget(row, filter))
    .map((row) => {
      const status = row.status || outletDetailValue(row, "Review Status") || "Pending";
      return {
        id: row.id,
        title: row.title || "Inspection",
        subtitle: outletDetailValue(row, "Checklist") || outletDetailValue(row, "Inspection Type") || "Store inspection",
        status,
        tone: String(status).toLowerCase().includes("failed") ? "danger" : "default",
        module: "inspection",
        href: `/inspection?inspectionId=${row.id}`,
        actionLabel: "Open Inspection",
      };
    });
}

export function buildOutletProofLog(taskRows: any[], inspectionRows: any[], issueRows: any[], filter: OutletWorkspaceFilter): OutletWorkspaceCard[] {
  const taskProofs = buildOutletTaskCards(taskRows, filter)
    .filter((item) => item.proofLabel || ["Pending Review", "Rework Required", "Completed"].includes(item.status))
    .map((item) => ({ ...item, subtitle: item.proofLabel || item.subtitle, actionLabel: "View Proof" }));

  const inspectionProofs = buildOutletInspectionCards(inspectionRows, filter)
    .filter((item) => ["Pending Review", "Rejected", "Failed Items", "Completed"].includes(item.status))
    .map((item) => ({ ...item, actionLabel: "View Review" }));

  const incidents = issueRows
    .filter((row) => matchOutletTarget(row, filter))
    .map((row) => ({
      id: row.id,
      title: row.title || "Incident",
      subtitle: outletDetailValue(row, "Category") || outletDetailValue(row, "Source") || "Incident review",
      status: row.status || "Open",
      tone: String(row.status).toLowerCase().includes("resolved") ? "success" : "warning",
      module: "issues" as const,
      href: `/issues?incidentId=${row.id}`,
      actionLabel: "View Incident",
    }));

  return [...taskProofs, ...inspectionProofs, ...incidents];
}
