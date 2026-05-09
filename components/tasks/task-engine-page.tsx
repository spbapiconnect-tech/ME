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
import { Card, CardContent } from "@/components/ui/card";
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

function getLocalizedTaskText(text: { en: string; zh: string }, locale: TaskLocale) {
  return locale === "zh" ? text.zh : text.en;
}

interface TaskEnginePageProps {
  tasks: TaskRecord[];
  dataError?: string;
}

export function TaskEnginePage({ tasks, dataError }: TaskEnginePageProps) {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: TaskLocale = rawLocale === "zh" ? "zh" : "en";
  const taskCopy = getTaskCopy(currentLocale);
  const stats = summarizeTasks(tasks);
  const selectedTask = tasks[0];

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: taskCopy.rightRail.taskContext,
          badge: taskCopy.rightRail.operations,
          items: [taskCopy.rightRail.branchFollowUp, taskCopy.rightRail.issueCoordination, taskCopy.rightRail.inventoryProcurementLinkage],
        },
        {
          title: taskCopy.rightRail.currentFocus,
          items: [`${stats.review} ${taskCopy.rightRail.recordsWaitingForReview}`, `${stats.overdue} ${taskCopy.rightRail.overdueItems}`, `${stats.critical} ${taskCopy.rightRail.criticalPriorityTasks}`],
        },
        {
          title: taskCopy.rightRail.todaysPriorities,
          items: [taskCopy.rightRail.replenishmentReview, taskCopy.rightRail.deliveryDelayEscalation, taskCopy.rightRail.scheduleTrainingFollowUp],
        },
      ]}
    />
  );

  return (
    <ErpShell activeHref="/tasks">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "Tasks", taskCopy.page.eyebrow]}
          title={taskCopy.page.title}
          zhTitle="任务工作台"
          subtitle={dataError ? `${taskCopy.page.serviceNoticePrefix} ${dataError}` : taskCopy.page.description}
        />

      <MeActionBar
        actions={[
          { label: taskCopy.actions.reviewQueue },
          { label: taskCopy.actions.openBranches, href: "/branches", variant: "secondary" },
          { label: taskCopy.actions.openInspection, href: "/inspection", variant: "outline" },
          { label: taskCopy.actions.openPsi, href: "/psi", variant: "outline" },
          { label: taskCopy.actions.exportQueue, href: "#", variant: "ghost" },
        ]}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          [taskCopy.kpis.openTasks, String(stats.total)],
          [taskCopy.kpis.inProgress, String(stats.inProgress)],
          [taskCopy.kpis.waitingReview, String(stats.review)],
          [taskCopy.kpis.overdue, String(stats.overdue)],
          [taskCopy.kpis.critical, String(stats.critical)],
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
          subtitle={getLocalizedTaskText(selectedTask.title, currentLocale)}
          status={titleCaseStatus(selectedTask.status)}
          guardrail={taskCopy.fields.currentServiceScope}
          meta={[
            { label: taskCopy.fields.branch, value: selectedTask.store },
            { label: taskCopy.fields.owner, value: `${selectedTask.ownerName} · ${selectedTask.ownerRole}` },
            { label: taskCopy.fields.priority, value: titleCaseStatus(selectedTask.priority) },
            { label: taskCopy.fields.module, value: titleCaseStatus(selectedTask.sourceModule) },
            { label: taskCopy.fields.due, value: selectedTask.dueAt },
            { label: taskCopy.fields.updated, value: selectedTask.updatedAt },
          ]}
        />
      ) : null}

      <MeTabs
        style="detail"
        tabs={[
          { label: taskCopy.tabs.overview, active: true },
          { label: taskCopy.tabs.queue, badge: String(stats.total) },
          { label: taskCopy.tabs.comments },
          { label: taskCopy.tabs.activity },
          { label: taskCopy.tabs.attachments },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={taskCopy.sections.workQueue} description={taskCopy.sections.workQueueDescription}>
              <MeDataTable
                embedded
                columns={[taskCopy.fields.task, taskCopy.fields.branch, taskCopy.fields.owner, taskCopy.fields.priority, taskCopy.fields.status, taskCopy.fields.due]}
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
                <MeWorkspaceSection title={taskCopy.sections.selectedTask} description={taskCopy.sections.selectedTaskDescription}>
                  <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_18rem]">
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        [taskCopy.fields.taskId, selectedTask.id],
                        [taskCopy.fields.title, getLocalizedTaskText(selectedTask.title, currentLocale)],
                        [taskCopy.fields.taskType, titleCaseStatus(selectedTask.taskType)],
                        [taskCopy.fields.sourceModule, titleCaseStatus(selectedTask.sourceModule)],
                        [taskCopy.fields.owner, `${selectedTask.ownerName} · ${selectedTask.ownerRole}`],
                        [taskCopy.fields.currentBranch, selectedTask.store],
                        [taskCopy.fields.priority, titleCaseStatus(selectedTask.priority)],
                        [taskCopy.fields.currentStatus, titleCaseStatus(selectedTask.status)],
                        [taskCopy.fields.created, selectedTask.createdAt],
                        [taskCopy.fields.due, selectedTask.dueAt],
                      ].map(([label, value]) => (
                        <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                          <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[12px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{taskCopy.fields.taskNote}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{getLocalizedTaskText(selectedTask.description, currentLocale)}</p>
                    </div>
                  </div>
                </MeWorkspaceSection>

                <MeWorkspaceSection title={taskCopy.sections.relatedRecords} description={taskCopy.sections.relatedRecordsDescription}>
                  <MeDataTable
                    embedded
                    columns={[taskCopy.fields.module, taskCopy.fields.record, taskCopy.fields.description, taskCopy.fields.route]}
                    rows={selectedTask.linkedRecords.map((record) => [
                      titleCaseStatus(record.moduleCode),
                      record.recordId,
                      getLocalizedTaskText(record.label, currentLocale),
                      <Link key={`${record.recordId}-route`} href={mapModuleRoute(record.moduleCode)} className="text-blue-700 hover:underline">
                        {taskCopy.actions.openWorkspace}
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
              title={taskCopy.sections.activity}
              items={selectedTask.timeline.map((entry) => ({
                title: getLocalizedTaskText(entry.title, currentLocale),
                description: `${getLocalizedTaskText(entry.description, currentLocale)} · ${selectedTask.ownerRole}`,
                time: entry.timestamp,
              }))}
            />
          ) : undefined
        }
      />
      </div>
    </ErpShell>
  );
}
