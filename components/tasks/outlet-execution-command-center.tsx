"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCheck, ClipboardList, Clock3, FileSearch, Plus, RefreshCw, ShieldAlert, Target, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { ErpShell } from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { taskMasterData } from "@/lib/master-data/task";
import { runStoreOperationRules } from "@/lib/rules/rule-runner";
import {
  getBranchCompletionSummary,
  getCalendarDayStats,
  getCorrectiveActionQueue,
  getDailyExecutionPlan,
  getExecutionBoard,
  getExecutionDetail,
  getExecutionNextActions,
  getExecutionSlaSummary,
  getManagerReviewStatusTone,
  getOutletExecutionKpis,
  getPhotoProofQueue,
  getPhotoProofStatusTone,
  getReviewQueue,
  getTaskStatusTone,
} from "@/lib/store-operations/outlet-execution-workspace";
import { serializeUploadAsset, uploadAssetLabel, uploadLocalPreviewAsset } from "@/lib/uploads/upload-provider";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function upsertDetail(items: Array<{ label: string; value: string }> | undefined, label: string, value: string) {
  const next = [...(items ?? [])];
  const index = next.findIndex((item) => item.label === label);
  if (index >= 0) next[index] = { label, value };
  else next.push({ label, value });
  return next;
}

type TaskLinkedSopStep = {
  id: string;
  title?: string;
  instruction: string;
};

type TaskLinkedSopBlock = {
  id: string;
  type: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  pdfUrl?: string;
  checklistItems?: string[];
  steps?: TaskLinkedSopStep[];
};

type TaskLinkedSopPage = {
  id: string;
  pageNo: number;
  title: string;
  coverImageUrl?: string;
  blocks: TaskLinkedSopBlock[];
};

type TaskLinkedSopContent = {
  mode?: string;
  pages: TaskLinkedSopPage[];
};

function parseLinkedSopContent(row: { detailItems?: Array<{ label: string; value: string }> }): TaskLinkedSopContent {
  const raw = detailValue(row, "SOP Content JSON");
  if (!raw) return { mode: "Linked SOP", pages: [] };

  try {
    const parsed = JSON.parse(raw) as TaskLinkedSopContent;
    return {
      mode: parsed.mode || "Linked SOP",
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
    };
  } catch {
    return { mode: "Linked SOP", pages: [] };
  }
}

function renderLinkedSopBlock(block: TaskLinkedSopBlock) {
  if (block.type === "heading") {
    return <div className="text-base font-semibold">{block.title || block.body || "Heading"}</div>;
  }

  if (block.type === "text") {
    return <div className="whitespace-pre-wrap text-sm text-muted-foreground">{block.body || "No text content."}</div>;
  }

  if (block.type === "image") {
    return (
      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
        <div className="font-medium">Image</div>
        <div className="break-all text-muted-foreground">{block.imageUrl || "Image placeholder not set."}</div>
      </div>
    );
  }

  if (block.type === "pdf") {
    return (
      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
        <div className="font-medium">PDF</div>
        <div className="break-all text-muted-foreground">{block.pdfUrl || "PDF placeholder not set."}</div>
      </div>
    );
  }

  if (block.type === "warning") {
    return (
      <div className="rounded-lg border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-sm">
        <div className="font-medium">{block.title || "Warning"}</div>
        <div className="whitespace-pre-wrap text-muted-foreground">{block.body || "No warning content."}</div>
      </div>
    );
  }

  if (block.type === "checklist") {
    const items = block.checklistItems ?? [];
    return (
      <div className="space-y-2 rounded-lg border px-3 py-2 text-sm">
        <div className="font-medium">{block.title || "Checklist"}</div>
        {items.length ? items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <span className="mt-1 h-3 w-3 rounded border" />
            <span>{item}</span>
          </div>
        )) : <div className="text-muted-foreground">No checklist items.</div>}
      </div>
    );
  }

  const steps = block.steps ?? [];
  return (
    <div className="space-y-2 rounded-lg border px-3 py-2 text-sm">
      <div className="font-medium">{block.title || "Step By Step"}</div>
      {steps.length ? steps.map((step, index) => (
        <div key={step.id} className="rounded-md bg-muted/40 px-3 py-2">
          <div className="font-medium">Step {index + 1}{step.title ? ` · ${step.title}` : ""}</div>
          <div className="whitespace-pre-wrap text-muted-foreground">{step.instruction}</div>
        </div>
      )) : <div className="text-muted-foreground">No steps.</div>}
    </div>
  );
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayIso() {
  return formatLocalDate(new Date());
}

function monthDays(anchor: Date) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

type TaskFormMode = "new" | "corrective" | "recheck";

type TaskInstructionBuilderStep = {
  id: string;
  title: string;
  instruction: string;
  imageUrl: string;
  proofRequired: "Required" | "Not Required";
};

function newTaskInstructionStep(index: number): TaskInstructionBuilderStep {
  return {
    id: `task-step-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: `Step ${index}`,
    instruction: "",
    imageUrl: "",
    proofRequired: "Not Required",
  };
}

type TaskForm = {
  title: string;
  taskType: string;
  branchTarget: string;
  roleTarget: string;
  dueDate: string;
  dueTime: string;
  repeatRule: string;
  completionStandard: string;
  photoProofRequired: string;
  checklist: string;
  managerNote: string;
  linkedSop: string;
  autoEscalateIfOverdue: string;
  linkedIncidentId: string;
  linkedInspectionId: string;
  linkedInspectionFailedItemId: string;
  requiredNewProof: string;
  rejectionInstruction: string;
};

const taskTypeOptions = Array.from(taskMasterData.taskType).length
  ? Array.from(taskMasterData.taskType)
  : ["Opening Check", "Closing Check", "Daily Operation", "Corrective Action", "Photo Recheck", "Training Acknowledgement", "FEFO Action", "Campaign Execution"];
const repeatRuleOptions = Array.from(taskMasterData.repeatRule).length ? Array.from(taskMasterData.repeatRule) : ["Once", "Daily", "Weekdays", "Weekly", "Monthly"];
const roleTargets = ["Outlet Manager", "Shift Leader", "Kitchen", "Service Crew", "Supervisor"];

export function OutletExecutionCommandCenter() {
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const updateTaskProofAccepted = useMeRuntimeStore((state) => state.updateTaskProofAccepted);
  const updateTaskProofRejected = useMeRuntimeStore((state) => state.updateTaskProofRejected);
  const syncStatus = useMeRuntimeStore((state) => state.syncStatus);
  const syncMessage = useMeRuntimeStore((state) => state.lastSyncMessage);
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskRows = getRows("tasks", []);
  const branchRows = getRows("branches", []);
  const incidentRows = getRows("issues", []);
  const inspectionRows = getRows("inspection", []);
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [calendarAnchor, setCalendarAnchor] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<TaskFormMode>("new");
  const [instructionMode, setInstructionMode] = useState<"Simple" | "Step By Step" | "Linked SOP">("Simple");
  const [instructionSteps, setInstructionSteps] = useState<TaskInstructionBuilderStep[]>([
    newTaskInstructionStep(1),
  ]);
  const [form, setForm] = useState<TaskForm>({
    title: "",
    taskType: "Daily Operation",
    branchTarget: "",
    roleTarget: "Outlet Manager",
    dueDate: todayIso(),
    dueTime: "09:00",
    repeatRule: "Once",
    completionStandard: "Upload clear execution proof before manager review.",
    photoProofRequired: "Required",
    checklist: "",
    managerNote: "",
    linkedSop: "",
    autoEscalateIfOverdue: "Yes",
    linkedIncidentId: "",
    linkedInspectionId: "",
    linkedInspectionFailedItemId: "",
    requiredNewProof: "",
    rejectionInstruction: "",
  });

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const board = useMemo(() => getExecutionBoard(taskRows), [taskRows]);
  const reviewQueue = useMemo(() => getReviewQueue(taskRows), [taskRows]);
  const photoProofQueue = useMemo(() => getPhotoProofQueue(taskRows), [taskRows]);
  const correctiveQueue = useMemo(() => getCorrectiveActionQueue(taskRows), [taskRows]);
  const dailyPlan = useMemo(() => getDailyExecutionPlan(taskRows, selectedDate), [taskRows, selectedDate]);
  const branchSummary = useMemo(() => getBranchCompletionSummary(taskRows), [taskRows]);
  const calendarStats = useMemo(() => getCalendarDayStats(taskRows), [taskRows]);
  const kpis = useMemo(() => getOutletExecutionKpis(taskRows), [taskRows]);
  const slaSummary = useMemo(() => getExecutionSlaSummary(taskRows), [taskRows]);
  const days = useMemo(() => monthDays(calendarAnchor), [calendarAnchor]);

  const requestedTaskId = useMemo(() => {
    const taskId = searchParams.get("taskId");
    if (taskId && taskRows.some((row) => row.id === taskId)) return taskId;
    const branchId = searchParams.get("branchId");
    if (branchId) {
      const branch = branchRows.find((row) => row.id === branchId)?.title;
      const linked = branch ? taskRows.find((row) => detailValue(row, "Branch") === branch || detailValue(row, "Outlets").includes(branch)) : undefined;
      if (linked) return linked.id;
    }
    const incidentId = searchParams.get("incidentId");
    if (incidentId) {
      const linked = taskRows.find((row) => detailValue(row, "Linked Incident ID") === incidentId);
      if (linked) return linked.id;
    }
    const inspectionId = searchParams.get("inspectionId");
    if (inspectionId) {
      const linked = taskRows.find((row) => detailValue(row, "Linked Inspection ID") === inspectionId);
      if (linked) return linked.id;
    }
    const fefoId = searchParams.get("fefoId");
    if (fefoId) {
      const linked = taskRows.find((row) => detailValue(row, "Linked FEFO / Waste ID") === fefoId);
      if (linked) return linked.id;
    }
    return undefined;
  }, [searchParams, taskRows, branchRows]);
  const selectedTask = taskRows.find((row) => row.id === selectedTaskId)
    ?? taskRows.find((row) => row.id === requestedTaskId)
    ?? dailyPlan.tasks[0]?.row
    ?? reviewQueue[0]?.row
    ?? taskRows[0];
  const detail = useMemo(() => getExecutionDetail(selectedTask), [selectedTask]);
  const nextActions = useMemo(() => getExecutionNextActions(selectedTask), [selectedTask]);
  const branchOptions = useMemo(() => branchRows.map((row) => row.title), [branchRows]);

  function updateInstructionStep(stepId: string, patch: Partial<TaskInstructionBuilderStep>) {
    setInstructionSteps((current) => current.map((step) => step.id === stepId ? { ...step, ...patch } : step));
  }

  function addInstructionStep() {
    setInstructionSteps((current) => [...current, newTaskInstructionStep(current.length + 1)]);
  }

  function removeInstructionStep(stepId: string) {
    setInstructionSteps((current) => current.length <= 1 ? current : current.filter((step) => step.id !== stepId));
  }

  function openNewTask() {
    setDialogMode("new");
    setForm((current) => ({
      ...current,
      title: "",
      taskType: "Daily Operation",
      branchTarget: "",
      dueDate: todayIso(),
      dueTime: "09:00",
      linkedIncidentId: "",
      linkedInspectionId: "",
      linkedInspectionFailedItemId: "",
      requiredNewProof: "",
      rejectionInstruction: "",
    }));
    setInstructionMode("Simple");
    setInstructionSteps([newTaskInstructionStep(1)]);
    setDialogOpen(true);
  }

  function openCorrectiveAction() {
    const incident = incidentRows.find((row) => row.id === detail?.linkedIncidentId) ?? incidentRows[0];
    setDialogMode("corrective");
    setForm((current) => ({
      ...current,
      title: incident ? `Corrective Action: ${incident.title}` : "",
      taskType: "Corrective Action",
      branchTarget: incident ? detailValue(incident, "Branch") : detail?.branch || "",
      dueDate: todayIso(),
      dueTime: "18:00",
      completionStandard: incident ? "Complete corrective action and upload proof before manager closes incident." : current.completionStandard,
      linkedIncidentId: incident?.id || detail?.linkedIncidentId || "",
      linkedInspectionId: detailValue(incident ?? { detailItems: [] }, "Linked Inspection ID") || "",
      photoProofRequired: "Required",
    }));
    setDialogOpen(true);
  }

  function openPhotoReview() {
    setDialogMode("recheck");
    setForm((current) => ({
      ...current,
      title: detail ? `Photo Recheck: ${detail.row.title}` : "",
      taskType: "Photo Recheck",
      branchTarget: detail?.branch || "",
      dueDate: todayIso(),
      dueTime: "20:00",
      linkedInspectionId: detail?.linkedInspectionId || "",
      linkedInspectionFailedItemId: detail?.linkedInspectionFailedItemId || "",
      requiredNewProof: detail?.proofComment || "Upload new photo proof for failed checklist item.",
      rejectionInstruction: detail?.managerReviewComment || "Clarify rejection reason and required new evidence.",
      photoProofRequired: "Required",
    }));
    setDialogOpen(true);
  }

  async function saveTask() {
    if (!form.title.trim() || !form.branchTarget || !form.dueDate) return;
    const dueAt = `${form.dueDate} ${form.dueTime}`;
    const taskType = dialogMode === "corrective" ? "Corrective Action" : dialogMode === "recheck" ? "Photo Recheck" : form.taskType;
    const created = await createRecordWithPayload("tasks", {
      title: form.title.trim(),
      subtitle: `${form.branchTarget} · ${taskType}`,
      status: "Scheduled",
      owner: form.roleTarget,
      detailItems: [
        { label: "Branch", value: form.branchTarget },
        { label: "Task Type", value: taskType },
        { label: "Role Target", value: form.roleTarget },
        { label: "Assigned To", value: "" },
        { label: "Outlets", value: form.branchTarget },
        { label: "Completed Outlets", value: "" },
        { label: "Due Date", value: form.dueDate },
        { label: "Due Time", value: form.dueTime },
        { label: "Due At", value: dueAt },
        { label: "Repeat Rule", value: form.repeatRule },
        { label: "Completion Standard", value: form.completionStandard },
        { label: "Instruction Mode", value: instructionMode },
        {
          label: "Task Instruction JSON",
          value: JSON.stringify({
            mode: instructionMode,
            steps: instructionSteps.map((step, index) => ({
              id: step.id,
              stepNo: index + 1,
              title: step.title || `Step ${index + 1}`,
              instruction: step.instruction,
              imageUrl: step.imageUrl,
              proofRequired: step.proofRequired === "Required",
              proofStatus: step.proofRequired === "Required" ? "Required" : "Not Required",
            })).filter((step) => step.title || step.instruction || step.imageUrl),
          }),
        },
        { label: "Checklist Items", value: form.checklist },
        { label: "Photo Required", value: form.photoProofRequired },
        { label: "Photo Proof Status", value: form.photoProofRequired === "Required" ? "Missing" : "Not Required" },
        { label: "Photo Proofs", value: "" },
        { label: "Proof Comment", value: form.requiredNewProof || "" },
        { label: "Manager Review Status", value: "Not Submitted" },
        { label: "Manager Review Comment", value: form.rejectionInstruction || "" },
        { label: "Source", value: dialogMode === "corrective" ? "Incident Center" : dialogMode === "recheck" ? "Store Inspection" : "Manual" },
        { label: "Linked SOP", value: form.linkedSop },
        { label: "Linked Incident ID", value: form.linkedIncidentId },
        { label: "Linked Incident", value: incidentRows.find((row) => row.id === form.linkedIncidentId)?.title || "" },
        { label: "Linked Inspection ID", value: form.linkedInspectionId },
        { label: "Linked Inspection", value: inspectionRows.find((row) => row.id === form.linkedInspectionId)?.title || "" },
        { label: "Linked Inspection Failed Item ID", value: form.linkedInspectionFailedItemId },
        { label: "Escalation Level", value: "None" },
        { label: "SLA Status", value: "On Track" },
      ],
      detailNote: form.managerNote,
      nextAction: dialogMode === "corrective" ? "Start corrective action" : dialogMode === "recheck" ? "Upload new proof" : "Start outlet execution",
    });
    setSelectedTaskId(created.id);
    setDialogOpen(false);
    await logAction("tasks", dialogMode === "corrective" ? "create-corrective-action" : dialogMode === "recheck" ? "request-photo-recheck" : "create-outlet-task", `Created ${taskType}: ${created.title}`);
  }

  async function patchTask(rowId: string, patch: { status?: string; detailItems?: Array<{ label: string; value: string }>; nextAction?: string }) {
    const task = taskRows.find((row) => row.id === rowId);
    if (!task) return;
    const view = getExecutionDetail(task);
    const record = {
      dueDate: view?.dueDate,
      dueAt: view?.dueAt,
      photoProofStatus: detailValue(task, "Photo Proof Status"),
      managerReviewStatus: detailValue(task, "Manager Review Status"),
      status: patch.status ?? task.status,
    };
    const matches = runStoreOperationRules("outlet-execution", record);
    const derivedStatus = matches.find((item) => item.result.nextStatus)?.result.nextStatus;
    let nextDetails = patch.detailItems ?? task.detailItems ?? [];
    const slaFromRule = matches.find((item) => item.result.metadata?.slaStatus)?.result.metadata?.slaStatus;
    if (slaFromRule) nextDetails = upsertDetail(nextDetails, "SLA Status", slaFromRule);
    await updateRecord("tasks", rowId, {
      status: derivedStatus ?? patch.status,
      detailItems: nextDetails,
      nextAction: patch.nextAction,
    });
  }

  async function startTask() {
    if (!selectedTask) return;
    await patchTask(selectedTask.id, { status: "In Progress", nextAction: "Upload proof or submit completion" });
    await logAction("tasks", "start-task", `Started ${selectedTask.title}`);
  }

  async function uploadProof(fileName: string) {
    if (!selectedTask || !fileName) return;
    let nextDetails = selectedTask.detailItems ?? [];
    const currentProofs = splitList(detailValue(selectedTask, "Photo Proofs"));
    currentProofs.push(fileName);
    nextDetails = upsertDetail(nextDetails, "Photo Proofs", currentProofs.join(", "));
    nextDetails = upsertDetail(nextDetails, "Photo Proof Status", "Submitted");
    nextDetails = upsertDetail(nextDetails, "Manager Review Status", "Pending Review");
    await patchTask(selectedTask.id, { status: "Pending Review", detailItems: nextDetails, nextAction: "Manager review proof" });
    await logAction("tasks", "upload-proof", `Uploaded proof for ${selectedTask.title}`);

    const linkedInspectionId = detailValue(selectedTask, "Linked Inspection ID");
    if (linkedInspectionId) {
      const inspection = inspectionRows.find((row) => row.id === linkedInspectionId);
      if (inspection) {
        let inspectionDetails = inspection.detailItems ?? [];
        inspectionDetails = upsertDetail(inspectionDetails, "Required New Photo Proof", "Submitted");
        inspectionDetails = upsertDetail(inspectionDetails, "Corrective Action Status", "Submitted");
        await updateRecord("inspection", inspection.id, { detailItems: inspectionDetails, nextAction: "Review new proof" });
      }
    }
  }

  async function submitForReview() {
    if (!selectedTask) return;
    let nextDetails = selectedTask.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Manager Review Status", "Pending Review");
    await patchTask(selectedTask.id, { status: "Pending Review", detailItems: nextDetails, nextAction: "Await manager review" });
    await logAction("tasks", "submit-for-review", `Submitted ${selectedTask.title} for review`);
  }

  async function acceptProof() {
    if (!selectedTask) return;
    await updateTaskProofAccepted(selectedTask.id);
    await logAction("tasks", "accept-proof", `Accepted proof for ${selectedTask.title}`);
  }

  async function rejectProof() {
    if (!selectedTask) return;
    await updateTaskProofRejected(selectedTask.id);
    await logAction("tasks", "reject-proof", `Rejected proof for ${selectedTask.title}`);
  }

  async function completeCorrectiveAction() {
    if (!selectedTask) return;
    await acceptProof();
  }

  const boardSections = [
    { key: "dueToday", label: "Due Today", items: board.dueToday },
    { key: "inProgress", label: "In Progress", items: board.inProgress },
    { key: "pendingReview", label: "Pending Review", items: board.pendingReview },
    { key: "correctiveAction", label: "Corrective Action", items: board.correctiveAction },
    { key: "reworkRequired", label: "Rework Required", items: board.reworkRequired },
    { key: "overdue", label: "Overdue", items: board.overdue },
  ];

  return (
    <ErpShell>
      <div className="space-y-5 pb-24 md:pb-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Outlet Execution</h1>
            <p className="text-sm text-muted-foreground">Command daily outlet work, corrective actions, photo proof, and manager review across branches.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={openPhotoReview}><FileSearch className="h-4 w-4" />Review Photo Proof</Button>
            <Button variant="outline" onClick={openCorrectiveAction}><Target className="h-4 w-4" />Create Corrective Action</Button>
            <Button onClick={openNewTask}><Plus className="h-4 w-4" />New Outlet Task</Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="px-3 pb-1 pt-3"><CardTitle className="text-[11px] font-medium text-muted-foreground md:text-xs">{kpi.label}</CardTitle></CardHeader>
              <CardContent className="px-3 pb-3 pt-0"><p className="text-xl font-semibold md:text-2xl">{kpi.value}</p></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Execution Board</CardTitle>
                <p className="text-sm text-muted-foreground">Operational states across daily execution, corrective action, rework, and review.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {!taskRows.length ? <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Create outlet execution tasks, assign corrective action from incidents, or request photo recheck from inspection failures.</div> : null}
                {boardSections.map((section) => (
                  <div key={section.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium"><span>{section.label}</span><Badge variant="outline">{section.items.length}</Badge></div>
                    {!section.items.length ? <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">No items in {section.label.toLowerCase()}.</div> : null}
                    {section.items.slice(0, 3).map((task) => (
                      <button key={task.row.id} type="button" onClick={() => setSelectedTaskId(task.row.id)} className={cn("w-full rounded-lg border p-3 text-left transition hover:border-primary", selectedTaskId === task.row.id && "border-primary bg-primary/5")}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{task.row.title}</p>
                            <p className="text-xs text-muted-foreground">{task.branch} · {task.taskType}</p>
                          </div>
                          <Badge variant={getTaskStatusTone(task.status)}>{task.status}</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{task.source}</span>
                          {task.linkedIncident ? <span>Incident linked</span> : null}
                          {task.linkedInspection ? <span>Inspection linked</span> : null}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Daily Plan</CardTitle>
                  <p className="text-sm text-muted-foreground">Selected date workload and branch completion.</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCalendarAnchor(new Date(calendarAnchor.getFullYear(), calendarAnchor.getMonth() - 1, 1))}>Prev</Button>
                  <Button variant="outline" size="sm" onClick={() => setCalendarAnchor(new Date(calendarAnchor.getFullYear(), calendarAnchor.getMonth() + 1, 1))}>Next</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium"><CalendarDays className="h-4 w-4 text-primary" />{calendarAnchor.toLocaleDateString("en-MY", { month: "long", year: "numeric" })}</div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}</div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((date) => {
                    const iso = formatLocalDate(date);
                    const stats = calendarStats.get(iso);
                    const rate = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0;
                    return (
                      <button key={iso} type="button" onClick={() => setSelectedDate(iso)} className={cn("min-h-12 rounded-md border p-1 text-left text-xs transition hover:border-primary", iso === selectedDate && "border-primary bg-primary/10", date.getMonth() !== calendarAnchor.getMonth() && "opacity-40")}>
                        <span>{date.getDate()}</span>
                        {stats ? <span className={cn("mt-2 block rounded-full px-1 text-[10px]", rate === 100 ? "bg-emerald-500/20 text-emerald-300" : rate > 0 ? "bg-amber-500/20 text-amber-300" : "bg-destructive/20 text-destructive")}>{stats.completed}/{stats.total}</span> : null}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  {!dailyPlan.tasks.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No outlet work scheduled for the selected day.</div> : null}
                  {dailyPlan.tasks.map((task) => (
                    <button key={task.row.id} type="button" onClick={() => setSelectedTaskId(task.row.id)} className={cn("w-full rounded-lg border p-3 text-left transition hover:border-primary", selectedTaskId === task.row.id && "border-primary bg-primary/5")}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{task.row.title}</p>
                          <p className="text-xs text-muted-foreground">{task.branch} · {task.dueAt || "No due time"}</p>
                        </div>
                        <Badge variant={getTaskStatusTone(task.status)}>{task.status}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Branch Completion</p>
                  {branchSummary.slice(0, 4).map((branch) => (
                    <div key={branch.branch} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                      <span>{branch.branch}</span>
                      <span className="font-medium">{branch.completionRate}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Queue</CardTitle>
                <p className="text-sm text-muted-foreground">Submitted proof waiting for manager decision. {photoProofQueue.length} proof items and {correctiveQueue.length} corrective action items are active.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {!reviewQueue.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No submitted proof is waiting for manager review.</div> : null}
                {reviewQueue.map((task) => (
                  <button key={task.row.id} type="button" onClick={() => setSelectedTaskId(task.row.id)} className={cn("w-full rounded-lg border p-3 text-left transition hover:border-primary", selectedTaskId === task.row.id && "border-primary bg-primary/5")}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{task.row.title}</p>
                        <p className="text-xs text-muted-foreground">{task.branch} · {task.taskType}</p>
                      </div>
                      <Badge variant={getManagerReviewStatusTone(task.managerReviewStatus)}>{task.managerReviewStatus}</Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Execution Detail</CardTitle>
              <p className="text-sm text-muted-foreground">Selected task, proof, linked incident, linked inspection, and next action.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!detail ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Create outlet execution work or select a task to review details.</div>
              ) : (
                <>
                  <div>
                    <p className="font-medium">{detail.row.title}</p>
                    <p className="text-sm text-muted-foreground">{detail.branch} · {detail.taskType}</p>
                  </div>
                  <div className="grid gap-2 text-sm">
                    {[
                      ["Source", detail.source],
                      ["Priority", detail.priority],
                      ["Due", detail.dueAt || "Not set"],
                      ["Status", detail.status],
                      ["Photo Proof", detail.photoProofStatus],
                      ["Manager Review", detail.managerReviewStatus],
                      ["Linked Incident", detail.linkedIncident || "Not linked"],
                      ["Linked Inspection", detail.linkedInspection || "Not linked"],
                      ["Completion Standard", detail.completionStandard || "Not set"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detail.linkedIncidentId ? <Button variant="outline" size="sm" onClick={() => router.push(`/issues?incidentId=${detail.linkedIncidentId}`)}>Open Incident</Button> : null}
                    {detail.linkedInspectionId ? <Button variant="outline" size="sm" onClick={() => router.push(`/inspection?inspectionId=${detail.linkedInspectionId}`)}>Open Inspection</Button> : null}
                    {detail.linkedFefoWasteId ? <Button variant="outline" size="sm" onClick={() => router.push(`/expiry?fefoId=${detail.linkedFefoWasteId}`)}>Open FEFO</Button> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getTaskStatusTone(detail.status)}>{detail.status}</Badge>
                    <Badge variant={getPhotoProofStatusTone(detail.photoProofStatus)}>{detail.photoProofStatus}</Badge>
                    <Badge variant={getManagerReviewStatusTone(detail.managerReviewStatus)}>{detail.managerReviewStatus}</Badge>
                  </div>
                  {(() => {
                    const linkedSopContent = parseLinkedSopContent(detail.row);
                    const linkedSopName = detailValue(detail.row, "Linked SOP");
                    const isTrainingTask = detail.taskType === "Training Acknowledgement" || Boolean(detailValue(detail.row, "Linked SOP ID")) || Boolean(linkedSopName);

                    if (!isTrainingTask) {
                      const taskInstructionMode = detailValue(detail.row, "Instruction Mode") || "Simple";
                      const rawTaskInstruction = detailValue(detail.row, "Task Instruction JSON");
                      let taskSteps: Array<{
                        id: string;
                        stepNo: number;
                        title: string;
                        instruction: string;
                        imageUrl?: string;
                        proofRequired?: boolean;
                        proofStatus?: string;
                      }> = [];

                      if (rawTaskInstruction) {
                        try {
                          const parsed = JSON.parse(rawTaskInstruction) as { steps?: typeof taskSteps };
                          taskSteps = Array.isArray(parsed.steps) ? parsed.steps : [];
                        } catch {
                          taskSteps = [];
                        }
                      }

                      if (taskInstructionMode === "Step By Step") {
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold">Task Step-by-Step Instructions</p>
                              <Badge variant="outline">{taskSteps.length} Steps</Badge>
                            </div>
                            {!taskSteps.length ? (
                              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No step-by-step instructions were added for this task.</div>
                            ) : taskSteps.map((step) => (
                              <div key={step.id} className="rounded-xl border p-3 text-sm">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-xs font-medium uppercase text-muted-foreground">Step {step.stepNo}</div>
                                    <div className="font-semibold">{step.title}</div>
                                  </div>
                                  <Badge variant={step.proofRequired ? "secondary" : "outline"}>{step.proofRequired ? "Proof Required" : "No Proof"}</Badge>
                                </div>
                                <div className="mt-2 whitespace-pre-wrap text-muted-foreground">{step.instruction || "No instruction."}</div>
                                {step.imageUrl ? <div className="mt-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">Image: {uploadAssetLabel(step.imageUrl)}</div> : null}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      if (taskInstructionMode === "Linked SOP") {
                        return (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Linked SOP Instruction</p>
                            <div className="rounded-lg border px-3 py-2 text-sm">
                              <div className="font-medium">{detailValue(detail.row, "Linked SOP") || "Linked SOP"}</div>
                              <div className="text-muted-foreground">This task is intended to follow a linked SOP. Add SOP content through SOP & Training, then assign it as a training task for full employee preview.</div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Task Instructions</p>
                          <div className="rounded-lg border px-3 py-2 text-sm">
                            <div className="font-medium">Completion Standard</div>
                            <div className="whitespace-pre-wrap text-muted-foreground">{detail.completionStandard || "No completion standard defined."}</div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">Linked SOP Employee Preview</p>
                          <Badge variant="outline">{linkedSopContent.mode || "Linked SOP"}</Badge>
                        </div>
                        <div className="rounded-lg border px-3 py-2 text-sm">
                          <div className="font-medium">{linkedSopName || "Linked SOP"}</div>
                          <div className="text-muted-foreground">Staff should read this SOP content before acknowledging the task.</div>
                        </div>
                        {!linkedSopContent.pages.length ? (
                          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                            This task is linked to an SOP, but no page-by-page SOP content was stored on the task yet.
                          </div>
                        ) : linkedSopContent.pages.map((page) => (
                          <div key={page.id} className="rounded-xl border p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-xs font-medium uppercase text-muted-foreground">Page {page.pageNo}</div>
                                <div className="font-semibold">{page.title}</div>
                              </div>
                              <Badge variant="secondary">{page.blocks.length} Blocks</Badge>
                            </div>
                            {page.coverImageUrl ? <div className="mt-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">Cover: {page.coverImageUrl}</div> : null}
                            <div className="mt-3 space-y-3">
                              {page.blocks.map((block) => <div key={block.id}>{renderLinkedSopBlock(block)}</div>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Checklist</p>
                    {detail.checklistItems.length ? detail.checklistItems.map((item) => <div key={item} className="rounded-lg border px-3 py-2 text-sm">{item}</div>) : <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No checklist defined.</div>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Photo Proof</p>
                    {!detail.photoProofs.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No photo proof uploaded yet.</div> : detail.photoProofs.map((proof) => <div key={proof} className="rounded-lg border px-3 py-2 text-sm">{proof}</div>)}
                    {detail.proofComment ? <div className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">{detail.proofComment}</div> : null}
                    {detail.managerReviewComment ? <div className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">{detail.managerReviewComment}</div> : null}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Next Actions</p>
                    {nextActions.map((action) => <div key={action} className="rounded-lg border px-3 py-2 text-sm">{action}</div>)}
                  </div>
                  <div className="grid gap-2">
                    <Button variant="outline" onClick={startTask}><Clock3 className="h-4 w-4" />Start Execution</Button>
                    <Label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-sm">
                      <Upload className="h-4 w-4" />Upload New Proof
                      <Input className="hidden" type="file" accept="image/*" onChange={(event) => uploadProof(event.target.files?.[0]?.name ?? "")} />
                    </Label>
                    <Button variant="outline" onClick={submitForReview}><ClipboardList className="h-4 w-4" />Submit For Review</Button>
                    <Button variant="outline" onClick={acceptProof}><CheckCheck className="h-4 w-4" />Accept Proof</Button>
                    <Button variant="outline" onClick={rejectProof}><RefreshCw className="h-4 w-4" />Reject / Request Rework</Button>
                    {detail.taskType === "Corrective Action" ? <Button onClick={completeCorrectiveAction}><ShieldAlert className="h-4 w-4" />Complete Corrective Action</Button> : null}
                  </div>
                </>
              )}
              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                SLA: {slaSummary.onTrack} on track · {slaSummary.dueSoon} due soon · {slaSummary.overdue} overdue · {slaSummary.breached} breached
              </div>
              <p className="text-xs text-muted-foreground">Sync: {syncStatus} · {syncMessage}</p>
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={cn(
            "max-h-[90vh] overflow-y-auto",
            dialogMode === "new" ? "w-[94vw] max-w-[1320px]" : "sm:max-w-[860px]",
          )}
        >
          <DialogHeader>
            <DialogTitle>{dialogMode === "corrective" ? "Create Corrective Action" : dialogMode === "recheck" ? "Request Photo Recheck" : "New Outlet Task"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "corrective"
                ? "Create a corrective action task linked to an incident and require proof before closure."
                : dialogMode === "recheck"
                  ? "Request new photo proof for a failed inspection item or rejected execution evidence."
                  : "Schedule outlet execution, set proof requirement, and define branch-level completion standard."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2"><Label>Task Title</Label><Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Task Type</Label><Select value={form.taskType} onValueChange={(value) => setForm((current) => ({ ...current, taskType: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{taskTypeOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Branch Target</Label><Select value={form.branchTarget || undefined} onValueChange={(value) => setForm((current) => ({ ...current, branchTarget: value }))}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Role Target</Label><Select value={form.roleTarget} onValueChange={(value) => setForm((current) => ({ ...current, roleTarget: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roleTargets.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Repeat Rule</Label><Select value={form.repeatRule} onValueChange={(value) => setForm((current) => ({ ...current, repeatRule: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{repeatRuleOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-3">
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Due Time</Label><Input value={form.dueTime} onChange={(event) => setForm((current) => ({ ...current, dueTime: event.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Photo Proof Required</Label><Select value={form.photoProofRequired} onValueChange={(value) => setForm((current) => ({ ...current, photoProofRequired: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Required">Required</SelectItem><SelectItem value="Not Required">Not Required</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5"><Label>Completion Standard</Label><Textarea value={form.completionStandard} onChange={(event) => setForm((current) => ({ ...current, completionStandard: event.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Checklist For Outlet</Label><Textarea value={form.checklist} onChange={(event) => setForm((current) => ({ ...current, checklist: event.target.value }))} placeholder="One line per execution item." /></div>
              <div className="space-y-1.5"><Label>Manager Note</Label><Textarea value={form.managerNote} onChange={(event) => setForm((current) => ({ ...current, managerNote: event.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Linked SOP</Label><Input value={form.linkedSop} onChange={(event) => setForm((current) => ({ ...current, linkedSop: event.target.value }))} /></div>
            </div>

            {dialogMode === "new" ? (
              <div className="space-y-3 rounded-md border p-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold">Execution Instruction Builder</div>
                    <div className="text-xs text-muted-foreground">Choose simple instruction, step-by-step execution, or linked SOP mode.</div>
                  </div>
                  <div className="w-full md:w-56">
                    <Select value={instructionMode} onValueChange={(value) => setInstructionMode(value as "Simple" | "Step By Step" | "Linked SOP")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Step By Step">Step By Step</SelectItem>
                        <SelectItem value="Linked SOP">Linked SOP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {instructionMode === "Step By Step" ? (
                  <div className="space-y-3">
                    {instructionSteps.map((step, index) => (
                      <div key={step.id} className="rounded-xl border bg-background p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="text-sm font-medium">Step {index + 1}</div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeInstructionStep(step.id)} disabled={instructionSteps.length === 1}>Remove</Button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1.5"><Label>Step Title</Label><Input value={step.title} onChange={(event) => updateInstructionStep(step.id, { title: event.target.value })} /></div>
                          <div className="space-y-1.5"><Label>Proof Required</Label><Select value={step.proofRequired} onValueChange={(value) => updateInstructionStep(step.id, { proofRequired: value as "Required" | "Not Required" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Required">Required</SelectItem><SelectItem value="Not Required">Not Required</SelectItem></SelectContent></Select></div>
                          <div className="space-y-1.5 md:col-span-2"><Label>Instruction</Label><Textarea rows={4} value={step.instruction} onChange={(event) => updateInstructionStep(step.id, { instruction: event.target.value })} placeholder="Explain exactly what outlet staff should do in this step." /></div>
                          <div className="space-y-1.5 md:col-span-2"><Label>Image URL / File Name Placeholder</Label><Input type="file" accept="image/*" onChange={async (event) => {
                              const asset = await uploadLocalPreviewAsset(event.target.files?.[0], "task");
                              updateInstructionStep(step.id, { imageUrl: serializeUploadAsset(asset) });
                            }} />
                            {step.imageUrl ? <div className="text-xs text-muted-foreground">Selected: {uploadAssetLabel(step.imageUrl)}</div> : null}</div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addInstructionStep}><Plus className="h-4 w-4" />Add Step</Button>
                  </div>
                ) : instructionMode === "Linked SOP" ? (
                  <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Enter the linked SOP name above. For full page-by-page SOP preview, assign the SOP from SOP & Training so the task receives SOP Content JSON.</div>
                ) : (
                  <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Simple mode will use Completion Standard as the main staff instruction.</div>
                )}
              </div>
            ) : null}
            {dialogMode !== "new" ? (
              <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Linked Incident</Label><Select value={form.linkedIncidentId || undefined} onValueChange={(value) => setForm((current) => ({ ...current, linkedIncidentId: value }))}><SelectTrigger><SelectValue placeholder="Select incident" /></SelectTrigger><SelectContent>{incidentRows.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Linked Inspection</Label><Select value={form.linkedInspectionId || undefined} onValueChange={(value) => setForm((current) => ({ ...current, linkedInspectionId: value }))}><SelectTrigger><SelectValue placeholder="Select inspection" /></SelectTrigger><SelectContent>{inspectionRows.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></div>
                {dialogMode === "recheck" ? (
                  <>
                    <div className="space-y-1.5"><Label>Required New Proof</Label><Textarea value={form.requiredNewProof} onChange={(event) => setForm((current) => ({ ...current, requiredNewProof: event.target.value }))} /></div>
                    <div className="space-y-1.5"><Label>Rejection Reason / Instruction</Label><Textarea value={form.rejectionInstruction} onChange={(event) => setForm((current) => ({ ...current, rejectionInstruction: event.target.value }))} /></div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTask} disabled={!form.title.trim() || !form.branchTarget || !form.dueDate}>{dialogMode === "corrective" ? "Create Corrective Action" : dialogMode === "recheck" ? "Request Photo Recheck" : "Schedule Task"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
