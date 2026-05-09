"use client";

import Link from "next/link";

import {
  MeActionBar,
  MeDataTable,
  MeDetailWorkspace,
  MeRecordSummary,
  MeRightRail,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { ErpPageHeader, ErpShell } from "@/components/erp";
import type { TaskRecord } from "@/types/task";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { getTaskCopy, type TaskLocale } from "@/config/task-language-copy";

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

function getLocalizedTaskText(text: { en: string; zh: string }, locale: TaskLocale) {
  return locale === "zh" ? text.zh : text.en;
}

interface TaskDetailPageProps {
  taskId: string;
  task?: TaskRecord | null;
  dataError?: string;
}

export function TaskDetailPage({ taskId, task, dataError }: TaskDetailPageProps) {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: TaskLocale = rawLocale === "zh" ? "zh" : "en";
  const taskCopy = getTaskCopy(currentLocale);

  if (!task) {
    return (
      <ErpShell activeHref="/tasks">
        <div className="space-y-6">
          <ErpPageHeader
            breadcrumbs={["ME", "Tasks", taskId]}
            title={taskCopy.page.emptyTitle}
            zhTitle="任务详情"
            subtitle={dataError ?? taskCopy.page.emptyDescription}
          />
        </div>
      </ErpShell>
    );
  }

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: taskCopy.rightRail.taskStatus,
          badge: titleCaseStatus(task.status),
          items: [`${taskCopy.fields.priority}: ${titleCaseStatus(task.priority)}`, `${taskCopy.fields.owner}: ${task.ownerRole}`, `${taskCopy.fields.branch}: ${task.store}`],
        },
        {
          title: taskCopy.rightRail.followUp,
          items: [taskCopy.rightRail.commentTrail, taskCopy.rightRail.escalationReview, taskCopy.rightRail.relatedRecordCoordination],
        },
        {
          title: taskCopy.rightRail.relatedModules,
          items: task.linkedRecords.map((record) => `${titleCaseStatus(record.moduleCode)} · ${record.recordId}`),
        },
      ]}
    />
  );

  return (
    <ErpShell activeHref="/tasks">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "Tasks", task.id]}
          title={task.id}
          zhTitle="任务详情"
          subtitle={getLocalizedTaskText(task.title, currentLocale)}
        />

      <MeRecordSummary
        title={task.id}
        subtitle={getLocalizedTaskText(task.title, currentLocale)}
        status={titleCaseStatus(task.status)}
        guardrail={taskCopy.fields.currentServiceScope}
        meta={[
          { label: taskCopy.fields.taskType, value: titleCaseStatus(task.taskType) },
          { label: taskCopy.fields.sourceRecord, value: task.sourceRecordId },
          { label: taskCopy.fields.sourceModule, value: titleCaseStatus(task.sourceModule) },
          { label: taskCopy.fields.assignedTo, value: `${task.ownerName} · ${task.ownerRole}` },
          { label: taskCopy.fields.created, value: task.createdAt },
          { label: taskCopy.fields.updated, value: task.updatedAt },
        ]}
      />

      <MeActionBar
        actions={[
          { label: taskCopy.actions.complete, href: "#", variant: "default" },
          { label: taskCopy.actions.reassign, href: "#", variant: "secondary" },
          { label: taskCopy.actions.addComment, href: "#", variant: "outline" },
          { label: taskCopy.actions.escalate, href: "#", variant: "outline" },
          { label: taskCopy.actions.backToQueue, href: "/tasks", variant: "ghost" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: taskCopy.tabs.overview, active: true },
          { label: taskCopy.tabs.relatedRecords, badge: String(task.linkedRecords.length) },
          { label: taskCopy.tabs.activity, badge: String(task.timeline.length) },
          { label: taskCopy.tabs.evidence, badge: String(task.evidence.length) },
          { label: taskCopy.tabs.audit },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={taskCopy.sections.taskOverview} description={taskCopy.sections.taskOverviewDescription}>
              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    [taskCopy.fields.taskId, task.id],
                    [taskCopy.fields.taskTitle, getLocalizedTaskText(task.title, currentLocale)],
                    [taskCopy.fields.branch, task.store],
                    [taskCopy.fields.owner, `${task.ownerName} · ${task.ownerRole}`],
                    [taskCopy.fields.priority, titleCaseStatus(task.priority)],
                    [taskCopy.fields.status, titleCaseStatus(task.status)],
                    [taskCopy.fields.taskType, titleCaseStatus(task.taskType)],
                    [taskCopy.fields.sourceRecord, task.sourceRecordId],
                    [taskCopy.fields.created, task.createdAt],
                    [taskCopy.fields.dueDate, task.dueAt],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[12px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{taskCopy.fields.businessSummary}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{getLocalizedTaskText(task.description, currentLocale)}</p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title={taskCopy.sections.relatedRecords} description={taskCopy.sections.relatedRecordsDescription}>
              <MeDataTable
                embedded
                columns={[taskCopy.fields.module, taskCopy.fields.record, taskCopy.fields.label, taskCopy.fields.route]}
                rows={task.linkedRecords.map((record) => [
                  titleCaseStatus(record.moduleCode),
                  record.recordId,
                  getLocalizedTaskText(record.label, currentLocale),
                  <Link key={`${record.recordId}-route`} href={mapModuleRoute(record.moduleCode)} className="text-blue-700 hover:underline">
                    {taskCopy.actions.openWorkspace}
                  </Link>,
                ])}
              />
            </MeWorkspaceSection>

            <MeWorkspaceSection title={taskCopy.sections.evidenceAndNotes} description={taskCopy.sections.evidenceAndNotesDescription}>
              <MeDataTable
                embedded
                columns={[taskCopy.fields.evidence, taskCopy.fields.type, taskCopy.fields.detail]}
                rows={task.evidence.map((item) => [getLocalizedTaskText(item.label, currentLocale), titleCaseStatus(item.type), item.value.replace(/placeholder/gi, "reference")])}
              />
            </MeWorkspaceSection>
          </>
        }
        context={<MeStatusTimeline embedded title={taskCopy.sections.activity} items={task.timeline.map((entry) => ({ title: getLocalizedTaskText(entry.title, currentLocale), description: getLocalizedTaskText(entry.description, currentLocale), time: entry.timestamp }))} />}
      />
      </div>
    </ErpShell>
  );
}
