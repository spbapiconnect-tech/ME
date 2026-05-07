import Link from "next/link";

import {
  MeActionBar,
  MeDashboardShell,
  MeDataTable,
  MeDetailWorkspace,
  MePageHeader,
  MeRecordSummary,
  MeRightRail,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import type { TaskRecord } from "@/types/task";

function mapModuleRoute(sourceModule: TaskRecord["sourceModule"]) {
  switch (sourceModule) {
    case "inventory":
      return "/psi/inventory";
    case "procurement":
      return "/psi/procurement";
    case "supplier":
      return "/psi/supplier";
    case "pos-report":
      return "/reports/pos";
    case "education":
      return "/training";
    case "task":
    default:
      return "/tasks";
  }
}

function titleCaseStatus(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

interface TaskDetailPageProps {
  taskId: string;
  task?: TaskRecord | null;
  dataError?: string;
}

export function TaskDetailPage({ taskId, task, dataError }: TaskDetailPageProps) {
  if (!task) {
    return (
      <MeDashboardShell activeKey="tasks">
        <MePageHeader
          eyebrow="Task Management"
          title="Task record not available"
          description="The selected task could not be loaded into the current workspace."
          notice={dataError ?? "Return to the task queue to continue reviewing operational work orders."}
          badges={[{ label: "Task queue" }, { label: "Record check", variant: "outline" }]}
          meta={[
            { label: "Requested record", value: taskId },
            { label: "Queue route", value: "/tasks" },
          ]}
        />
      </MeDashboardShell>
    );
  }

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Task Status",
          badge: titleCaseStatus(task.status),
          items: [`Priority: ${titleCaseStatus(task.priority)}`, `Owner: ${task.ownerRole}`, `Branch: ${task.store}`],
        },
        {
          title: "Follow-up",
          items: ["Comment trail", "Escalation review", "Related record coordination"],
        },
        {
          title: "Related Modules",
          items: task.linkedRecords.map((record) => `${titleCaseStatus(record.moduleCode)} · ${record.recordId}`),
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="tasks" rightRail={rightRail}>
      <MePageHeader
        eyebrow="Task Management"
        title={task.id}
        description={task.title.en}
        notice={task.description.en}
        badges={[
          { label: titleCaseStatus(task.taskType) },
          { label: titleCaseStatus(task.sourceModule), variant: "secondary" },
          { label: titleCaseStatus(task.priority), variant: "outline" },
        ]}
        meta={[
          { label: "Branch", value: task.store },
          { label: "Owner", value: `${task.ownerName} · ${task.ownerRole}` },
          { label: "Status", value: titleCaseStatus(task.status) },
          { label: "Due", value: task.dueAt },
        ]}
      />

      <MeRecordSummary
        title={task.id}
        subtitle={task.title.en}
        status={titleCaseStatus(task.status)}
        guardrail="Current service scope"
        meta={[
          { label: "Task type", value: titleCaseStatus(task.taskType) },
          { label: "Source record", value: task.sourceRecordId },
          { label: "Source module", value: titleCaseStatus(task.sourceModule) },
          { label: "Assigned to", value: `${task.ownerName} · ${task.ownerRole}` },
          { label: "Created", value: task.createdAt },
          { label: "Updated", value: task.updatedAt },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Complete", href: "#", variant: "default" },
          { label: "Reassign", href: "#", variant: "secondary" },
          { label: "Add Comment", href: "#", variant: "outline" },
          { label: "Escalate", href: "#", variant: "outline" },
          { label: "Back to Queue", href: "/tasks", variant: "ghost" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Related Records", badge: String(task.linkedRecords.length) },
          { label: "Activity", badge: String(task.timeline.length) },
          { label: "Evidence", badge: String(task.evidence.length) },
          { label: "Audit" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Task Overview" description="Assignment context, branch impact, and linked operational summary for the selected work order.">
              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["Task ID", task.id],
                    ["Task title", task.title.en],
                    ["Branch", task.store],
                    ["Owner", `${task.ownerName} · ${task.ownerRole}`],
                    ["Priority", titleCaseStatus(task.priority)],
                    ["Status", titleCaseStatus(task.status)],
                    ["Task type", titleCaseStatus(task.taskType)],
                    ["Source record", task.sourceRecordId],
                    ["Created", task.createdAt],
                    ["Due date", task.dueAt],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[12px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Business Summary</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{task.description.en}</p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Related Records" description="Business records referenced by this task across inventory, procurement, supplier, and reporting workspaces.">
              <MeDataTable
                embedded
                columns={["Module", "Record", "Label", "Route"]}
                rows={task.linkedRecords.map((record) => [
                  titleCaseStatus(record.moduleCode),
                  record.recordId,
                  record.label.en,
                  <Link key={`${record.recordId}-route`} href={mapModuleRoute(record.moduleCode)} className="text-blue-700 hover:underline">
                    Open workspace
                  </Link>,
                ])}
              />
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Evidence and Notes" description="Supporting notes, documents, and operational evidence referenced during task follow-up.">
              <MeDataTable
                embedded
                columns={["Evidence", "Type", "Detail"]}
                rows={task.evidence.map((item) => [item.label.en, titleCaseStatus(item.type), item.value.replace(/placeholder/gi, "reference")])}
              />
            </MeWorkspaceSection>
          </>
        }
        context={<MeStatusTimeline embedded title="Activity" items={task.timeline.map((entry) => ({ title: entry.title.en, description: entry.description.en, time: entry.timestamp }))} />}
      />
    </MeDashboardShell>
  );
}
