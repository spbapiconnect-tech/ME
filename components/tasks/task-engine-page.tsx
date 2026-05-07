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
import { Card, CardContent } from "@/components/ui/card";
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

function summarizeTasks(tasks: TaskRecord[]) {
  return tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      if (task.status === "overdue") acc.overdue += 1;
      if (task.status === "review") acc.review += 1;
      if (task.status === "in-progress") acc.inProgress += 1;
      if (task.priority === "critical") acc.critical += 1;
      return acc;
    },
    { total: 0, overdue: 0, review: 0, inProgress: 0, critical: 0 },
  );
}

interface TaskEnginePageProps {
  tasks: TaskRecord[];
  dataError?: string;
}

export function TaskEnginePage({ tasks, dataError }: TaskEnginePageProps) {
  const stats = summarizeTasks(tasks);
  const selectedTask = tasks[0];

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Task Context",
          badge: "Operations",
          items: ["Branch follow-up", "Issue coordination", "Inventory and procurement linkage"],
        },
        {
          title: "Current Focus",
          items: [`${stats.review} records waiting for review`, `${stats.overdue} overdue items`, `${stats.critical} critical-priority tasks`],
        },
        {
          title: "Today’s Priorities",
          items: ["Replenishment review", "Delivery-delay escalation", "Schedule and training follow-up"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="tasks" rightRail={rightRail}>
      <MePageHeader
        eyebrow="Task Management"
        title="Task operations workspace"
        description="Daily execution queue for branch follow-up, issue handling, procurement coordination, and cross-module work orders."
        notice={dataError ? `Task service notice: ${dataError}` : "Use this workspace to review assigned work, branch-linked tasks, comments, and operating timelines."}
        badges={[
          { label: "Task queue" },
          { label: "Branch follow-up", variant: "secondary" },
          { label: "Operational review", variant: "outline" },
        ]}
        meta={[
          { label: "Queue size", value: String(stats.total) },
          { label: "Branch scope", value: "All Stores / KCH / Central DC" },
          { label: "Priority watch", value: `${stats.critical} critical` },
          { label: "Workstream", value: "Daily operations" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review Queue" },
          { label: "Open Branches", href: "/branches", variant: "secondary" },
          { label: "Open Inspection", href: "/inspection", variant: "outline" },
          { label: "Open PSI", href: "/psi", variant: "outline" },
          { label: "Export Queue", href: "#", variant: "ghost" },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Open tasks", String(stats.total)],
          ["In progress", String(stats.inProgress)],
          ["Waiting review", String(stats.review)],
          ["Overdue", String(stats.overdue)],
          ["Critical", String(stats.critical)],
        ].map(([label, value]) => (
          <Card key={label} size="sm" className="border-border/60 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <CardContent className="pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-2 text-[1.55rem] font-semibold tracking-[-0.02em] text-slate-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {selectedTask ? (
        <MeRecordSummary
          title={selectedTask.id}
          subtitle={selectedTask.title.en}
          status={titleCaseStatus(selectedTask.status)}
          guardrail="Current service scope"
          meta={[
            { label: "Branch", value: selectedTask.store },
            { label: "Owner", value: `${selectedTask.ownerName} · ${selectedTask.ownerRole}` },
            { label: "Priority", value: titleCaseStatus(selectedTask.priority) },
            { label: "Module", value: titleCaseStatus(selectedTask.sourceModule) },
            { label: "Due", value: selectedTask.dueAt },
            { label: "Updated", value: selectedTask.updatedAt },
          ]}
        />
      ) : null}

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Queue", badge: String(stats.total) },
          { label: "Comments" },
          { label: "Activity" },
          { label: "Attachments" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Work Queue" description="Prioritized task records linked to branch operations, procurement, inventory, and incident handling.">
              <MeDataTable
                embedded
                columns={["Task", "Branch", "Owner", "Priority", "Status", "Due"]}
                rows={tasks.map((task) => [
                  <Link key={`${task.id}-link`} href={`/tasks/${task.id}`} className="font-medium text-slate-900 hover:text-blue-700">
                    {task.id}
                  </Link>,
                  task.store,
                  task.ownerRole,
                  titleCaseStatus(task.priority),
                  titleCaseStatus(task.status),
                  task.dueAt,
                ])}
              />
            </MeWorkspaceSection>

            {selectedTask ? (
              <>
                <MeWorkspaceSection title="Selected Task" description="Primary work order detail, assignment context, and linked business records.">
                  <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_18rem]">
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        ["Task ID", selectedTask.id],
                        ["Title", selectedTask.title.en],
                        ["Task type", titleCaseStatus(selectedTask.taskType)],
                        ["Source module", titleCaseStatus(selectedTask.sourceModule)],
                        ["Owner", `${selectedTask.ownerName} · ${selectedTask.ownerRole}`],
                        ["Current branch", selectedTask.store],
                        ["Priority", titleCaseStatus(selectedTask.priority)],
                        ["Current status", titleCaseStatus(selectedTask.status)],
                        ["Created", selectedTask.createdAt],
                        ["Due", selectedTask.dueAt],
                      ].map(([label, value]) => (
                        <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                          <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[12px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Task Note</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{selectedTask.description.en}</p>
                    </div>
                  </div>
                </MeWorkspaceSection>

                <MeWorkspaceSection title="Related Records" description="Connected procurement, supplier, inventory, and issue records used during task review.">
                  <MeDataTable
                    embedded
                    columns={["Module", "Record", "Description", "Route"]}
                    rows={selectedTask.linkedRecords.map((record) => [
                      titleCaseStatus(record.moduleCode),
                      record.recordId,
                      record.label.en,
                      <Link key={`${record.recordId}-route`} href={mapModuleRoute(record.moduleCode)} className="text-blue-700 hover:underline">
                        Open workspace
                      </Link>,
                    ])}
                  />
                </MeWorkspaceSection>
              </>
            ) : null}
          </>
        }
        context={
          selectedTask ? (
            <MeStatusTimeline
              embedded
              title="Activity"
              items={selectedTask.timeline.map((entry) => ({
                title: entry.title.en,
                description: `${entry.description.en} · ${selectedTask.ownerRole}`,
                time: entry.timestamp,
              }))}
            />
          ) : undefined
        }
      />
    </MeDashboardShell>
  );
}
