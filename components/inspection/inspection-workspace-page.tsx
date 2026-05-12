"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, ClipboardList, FileWarning, Link2, ListChecks, Plus, ShieldAlert } from "lucide-react";

import { ErpShell } from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { checklistMaster } from "@/lib/master-data/checklist";
import { issueMasterData } from "@/lib/master-data/issue";
import { taskMasterData } from "@/lib/master-data/task";
import { runStoreOperationRules } from "@/lib/rules/rule-runner";
import {
  getExecutionSignals,
  getFailedInspectionItems,
  getInspectionKpis,
  getInspectionNextActions,
  getInspectionQueue,
  getInspectionReviewSummary,
  type InspectionFailedItemView,
  type InspectionSignal,
} from "@/lib/store-operations/inspection-workspace";
import { createIncidentFromInspectionFailure, createTaskFromIncident } from "@/lib/store-operations/store-operation-links";
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

function statusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("failed") || value.includes("critical") || value.includes("overdue") || value.includes("rejected")) return "destructive";
  if (value.includes("pending") || value.includes("review") || value.includes("scheduled") || value.includes("new")) return "secondary";
  return "outline";
}

type InspectionForm = {
  title: string;
  branch: string;
  inspectionType: string;
  checklistTemplate: string;
  scheduledTime: string;
  inspector: string;
  source: string;
  photoProofRequired: string;
  autoIncidentSuggestion: string;
  correctiveActionRequired: string;
  linkedExecutionId: string;
  note: string;
};

type ReviewForm = {
  score: string;
  reviewStatus: string;
  failedLabel: string;
  failedSeverity: string;
  failedComment: string;
  photoRequired: string;
  shouldCreateIncident: string;
  correctiveActionRequired: string;
};

const inspectionTypes = ["Execution Review", "Spot Check", "Follow-up Inspection", "Incident Follow-up", "FEFO / Waste Check"];
const sourceOptions = ["Manual Inspection", "From Outlet Execution", "From Incident Follow-up", "From FEFO / Waste Alert"];
const reviewStatuses = ["Pending Review", "Passed", "Failed", "Recheck Required"];

export function InspectionWorkspacePage() {
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const syncStatus = useMeRuntimeStore((state) => state.syncStatus);
  const syncMessage = useMeRuntimeStore((state) => state.lastSyncMessage);

  const inspectionRows = getRows("inspection", []);
  const taskRows = getRows("tasks", []);
  const issueRows = getRows("issues", []);
  const branchRows = getRows("branches", []);

  const [selectedInspectionId, setSelectedInspectionId] = useState<string | undefined>(inspectionRows[0]?.id);
  const [activeFilter, setActiveFilter] = useState("Pending Review");
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<InspectionForm>({
    title: "",
    branch: "",
    inspectionType: "Execution Review",
    checklistTemplate: "",
    scheduledTime: "",
    inspector: "",
    source: "Manual Inspection",
    photoProofRequired: "Required",
    autoIncidentSuggestion: "Yes",
    correctiveActionRequired: "Yes",
    linkedExecutionId: "",
    note: "",
  });
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    score: "85",
    reviewStatus: "Pending Review",
    failedLabel: "",
    failedSeverity: "High",
    failedComment: "",
    photoRequired: "Yes",
    shouldCreateIncident: "Yes",
    correctiveActionRequired: "Yes",
  });
  const [draftFailedItems, setDraftFailedItems] = useState<InspectionFailedItemView[]>([]);

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const branchOptions = useMemo(() => branchRows.map((row) => row.title), [branchRows]);
  const queue = useMemo(() => getInspectionQueue(inspectionRows), [inspectionRows]);
  const signals = useMemo(() => getExecutionSignals(taskRows), [taskRows]);
  const kpis = useMemo(() => getInspectionKpis(inspectionRows, taskRows, issueRows), [inspectionRows, taskRows, issueRows]);

  const filteredQueue = useMemo(() => {
    if (!activeFilter) return queue;
    return queue.filter((row) => {
      if (activeFilter === "Today") return (detailValue(row, "Scheduled Time") || "").slice(0, 10) === new Date().toISOString().slice(0, 10);
      if (activeFilter === "Pending Review") return row.status === "Pending Review";
      if (activeFilter === "Failed") return row.status === "Failed Items";
      if (activeFilter === "Corrective Action") return Boolean(detailValue(row, "Linked Corrective Action IDs"));
      if (activeFilter === "Completed") return row.status === "Completed";
      return true;
    });
  }, [activeFilter, queue]);

  const selectedInspection = inspectionRows.find((row) => row.id === selectedInspectionId) ?? filteredQueue[0] ?? queue[0];
  const selectedSignal = signals.find((signal) => signal.id === selectedSignalId);
  const failedItems = useMemo(() => getFailedInspectionItems(selectedInspection), [selectedInspection]);
  const reviewSummary = useMemo(() => getInspectionReviewSummary(selectedInspection), [selectedInspection]);
  const nextActions = useMemo(() => getInspectionNextActions(selectedInspection), [selectedInspection]);
  const checklistTemplates = checklistMaster.checklistTemplate as ReadonlyArray<{ id?: string; name?: string }>;
  const checklistOptions = checklistTemplates.map((item) => item.name || item.id || "").filter(Boolean);

  function resetInspectionForm(signal?: InspectionSignal) {
    setForm({
      title: signal ? `Execution Review · ${signal.taskTitle}` : "",
      branch: signal?.branchName ?? "",
      inspectionType: "Execution Review",
      checklistTemplate: checklistOptions[0] ?? "",
      scheduledTime: signal?.dueAt ? signal.dueAt.replace(" ", "T").slice(0, 16) : "",
      inspector: "",
      source: signal ? "From Outlet Execution" : "Manual Inspection",
      photoProofRequired: "Required",
      autoIncidentSuggestion: "Yes",
      correctiveActionRequired: "Yes",
      linkedExecutionId: signal?.taskId ?? "",
      note: signal ? `Inspection started from execution signal: ${signal.reason}` : "",
    });
  }

  function openManualInspection() {
    setSelectedSignalId(undefined);
    resetInspectionForm();
    setInspectionDialogOpen(true);
  }

  function openSignalInspection(signal: InspectionSignal) {
    setSelectedSignalId(signal.id);
    resetInspectionForm(signal);
    setInspectionDialogOpen(true);
  }

  async function saveInspection() {
    if (!form.branch || !form.inspectionType) return;
    const created = await createRecordWithPayload("inspection", {
      title: form.title.trim() || `${form.inspectionType} · ${form.branch}`,
      subtitle: `${form.branch} · ${form.source}`,
      status: form.linkedExecutionId ? "Scheduled" : "In Progress",
      owner: form.inspector || "Store Inspection",
      detailItems: [
        { label: "Branch", value: form.branch },
        { label: "Inspection Type", value: form.inspectionType },
        { label: "Checklist Template", value: form.checklistTemplate || "Not configured" },
        { label: "Scheduled Time", value: form.scheduledTime || "Not scheduled" },
        { label: "Inspector", value: form.inspector || "Unassigned" },
        { label: "Score", value: "0" },
        { label: "Failed Items", value: "0" },
        { label: "Review Status", value: "Pending Review" },
        { label: "Source", value: form.source },
        { label: "Linked Outlet Execution ID", value: form.linkedExecutionId },
        { label: "Linked Outlet Execution", value: taskRows.find((row) => row.id === form.linkedExecutionId)?.title ?? "" },
        { label: "Linked Incident IDs", value: "" },
        { label: "Linked Incident Titles", value: "" },
        { label: "Linked Corrective Action IDs", value: "" },
        { label: "Linked Corrective Actions", value: "" },
        { label: "Corrective Action Status", value: "Not Created" },
        { label: "Photo Proof Required", value: form.photoProofRequired },
        { label: "Required New Photo Proof", value: "No" },
        { label: "Auto Incident Suggestion", value: form.autoIncidentSuggestion },
        { label: "Corrective Action Required", value: form.correctiveActionRequired },
        { label: "Failed Item Payload", value: "[]" },
      ],
      detailNote: form.note || "Inspect outlet execution, review failed points, and decide next action.",
      nextAction: "Run Inspection Review",
    });
    setSelectedInspectionId(created.id);
    setInspectionDialogOpen(false);
    await logAction("inspection", "schedule-inspection", `Created inspection ${created.title}`);
  }

  function openReviewDialog() {
    const currentFailedItems = getFailedInspectionItems(selectedInspection);
    setDraftFailedItems(currentFailedItems);
    setReviewForm({
      score: reviewSummary?.score || "85",
      reviewStatus: reviewSummary?.reviewStatus || "Pending Review",
      failedLabel: "",
      failedSeverity: "High",
      failedComment: "",
      photoRequired: "Yes",
      shouldCreateIncident: "Yes",
      correctiveActionRequired: "Yes",
    });
    setReviewDialogOpen(true);
  }

  function addDraftFailedItem() {
    if (!reviewForm.failedLabel.trim()) return;
    setDraftFailedItems((current) => [
      ...current,
      {
        id: `failed-${Date.now()}`,
        label: reviewForm.failedLabel.trim(),
        severity: reviewForm.failedSeverity,
        result: "failed",
        comment: reviewForm.failedComment.trim(),
        photoRequired: reviewForm.photoRequired === "Yes",
        photoUrls: [],
        shouldCreateIncident: reviewForm.shouldCreateIncident === "Yes",
        correctiveActionRequired: reviewForm.correctiveActionRequired === "Yes",
      },
    ]);
    setReviewForm((current) => ({ ...current, failedLabel: "", failedComment: "" }));
  }

  async function saveReview() {
    if (!selectedInspection) return;
    const score = Number(reviewForm.score || 0);
    const photoRecheckRequired = draftFailedItems.some((item) => item.photoRequired && item.photoUrls.length === 0);
    const ruleMatches = runStoreOperationRules("store-inspection", {
      failedItems: draftFailedItems.length,
      score,
      photoRecheckRequired,
    });

    let nextStatus = score > 0 && draftFailedItems.length === 0 ? "Completed" : "Pending Review";
    if (ruleMatches.find((item) => item.result.nextStatus === "Failed Items")) nextStatus = "Failed Items";
    else if (ruleMatches.find((item) => item.result.nextStatus === "Pending Review")) nextStatus = "Pending Review";

    let nextDetails = selectedInspection.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Score", String(score));
    nextDetails = upsertDetail(nextDetails, "Failed Items", String(draftFailedItems.length));
    nextDetails = upsertDetail(nextDetails, "Review Status", reviewForm.reviewStatus);
    nextDetails = upsertDetail(nextDetails, "Required New Photo Proof", photoRecheckRequired ? "Yes" : "No");
    nextDetails = upsertDetail(nextDetails, "Failed Item Payload", JSON.stringify(draftFailedItems));

    await updateRecord("inspection", selectedInspection.id, {
      status: nextStatus,
      detailItems: nextDetails,
      nextAction: draftFailedItems.length ? "Create Incident or Corrective Action" : "Close Inspection",
      detailNote: draftFailedItems.length
        ? "Inspection found failed execution points. Review incidents and corrective actions before closure."
        : "Inspection completed with acceptable result.",
    });
    setReviewDialogOpen(false);
    await logAction("inspection", "review-inspection", `Reviewed inspection ${selectedInspection.title}`);
  }

  async function createIncident(item: InspectionFailedItemView) {
    if (!selectedInspection) return;
    const incidentSeed = createIncidentFromInspectionFailure(selectedInspection, item);
    const created = await createRecordWithPayload("issues", {
      title: incidentSeed.title,
      subtitle: `${reviewSummary?.branch || "Outlet"} · inspection failure`,
      status: "New",
      owner: "Incident Center",
      detailItems: [
        { label: "Branch", value: reviewSummary?.branch || "" },
        { label: "Severity", value: incidentSeed.severity },
        { label: "Category", value: Array.from(issueMasterData.issueCategory)[0] || "Store Inspection Failure" },
        { label: "Impact Area", value: item.label },
        { label: "Immediate Containment", value: item.comment || "Contain and verify outlet correction." },
        { label: "Linked Inspection", value: selectedInspection.title },
        { label: "Linked Inspection ID", value: selectedInspection.id },
        { label: "Linked Failed Item ID", value: item.id },
        { label: "Source", value: "inspection" },
      ],
      detailNote: item.comment || "Incident raised from failed inspection item.",
      nextAction: "Create Corrective Action",
    });

    const incidentIds = splitList(detailValue(selectedInspection, "Linked Incident IDs"));
    const incidentTitles = splitList(detailValue(selectedInspection, "Linked Incident Titles"));
    incidentIds.push(created.id);
    incidentTitles.push(created.title);
    let nextDetails = selectedInspection.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Linked Incident IDs", incidentIds.join(", "));
    nextDetails = upsertDetail(nextDetails, "Linked Incident Titles", incidentTitles.join(", "));
    await updateRecord("inspection", selectedInspection.id, {
      status: "Issue Created",
      detailItems: nextDetails,
      nextAction: "Push corrective action",
    });
    await logAction("inspection", "create-incident", `Created incident ${created.title} from ${selectedInspection.title}`);
  }

  async function createCorrectiveAction() {
    if (!selectedInspection) return;
    const incidentId = splitList(detailValue(selectedInspection, "Linked Incident IDs"))[0];
    const incident = issueRows.find((row) => row.id === incidentId);
    const seed = createTaskFromIncident(incident ?? selectedInspection, {
      linkedInspectionId: selectedInspection.id,
      dueAt: detailValue(selectedInspection, "Scheduled Time") || undefined,
      photoProofRequired: detailValue(selectedInspection, "Required New Photo Proof") === "Yes",
    });
    const branch = reviewSummary?.branch || detailValue(selectedInspection, "Branch");
    const created = await createRecordWithPayload("tasks", {
      title: seed.title,
      subtitle: `${branch} · corrective action`,
      status: "Scheduled",
      owner: "Outlet Execution",
      detailItems: [
        { label: "Task Type", value: Array.from(taskMasterData.taskType)[0] || "Corrective Action" },
        { label: "Outlets", value: branch },
        { label: "Completed Outlets", value: "" },
        { label: "Photo Proofs", value: "" },
        { label: "Due Date", value: (seed.dueAt || "").slice(0, 10) },
        { label: "Due Time", value: (seed.dueAt || "").slice(11, 16) },
        { label: "Time Trigger", value: "After Inspection Failure" },
        { label: "Repeat Rule", value: Array.from(taskMasterData.repeatRule)[0] || "Once" },
        { label: "Photo Required", value: seed.photoProofRequired ? "Required" : "Optional" },
        { label: "Completion Standard", value: seed.completionStandard },
        { label: "Linked Incident", value: incident?.title || "" },
        { label: "Linked Incident ID", value: incident?.id || "" },
        { label: "Linked Inspection", value: selectedInspection.title },
        { label: "Inspection Source", value: selectedInspection.title },
      ],
      detailNote: "Corrective action created from store inspection. Outlet must upload new photo proof after rework.",
      nextAction: "Submit new photo proof",
    });

    const actionIds = splitList(detailValue(selectedInspection, "Linked Corrective Action IDs"));
    const actionTitles = splitList(detailValue(selectedInspection, "Linked Corrective Actions"));
    actionIds.push(created.id);
    actionTitles.push(created.title);
    let nextDetails = selectedInspection.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Linked Corrective Action IDs", actionIds.join(", "));
    nextDetails = upsertDetail(nextDetails, "Linked Corrective Actions", actionTitles.join(", "));
    nextDetails = upsertDetail(nextDetails, "Corrective Action Status", created.status);
    await updateRecord("inspection", selectedInspection.id, {
      detailItems: nextDetails,
      nextAction: "Review outlet rework proof",
    });
    await logAction("inspection", "create-corrective-action", `Created corrective action ${created.title} from ${selectedInspection.title}`);
  }

  return (
    <ErpShell>
      <div className="space-y-5 pb-24 md:pb-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Store Inspection</h1>
            <p className="text-sm text-muted-foreground">Inspect outlet execution, review failed tasks, create incidents, and push corrective action back to outlets.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => selectedSignal ? openSignalInspection(selectedSignal) : signals[0] ? openSignalInspection(signals[0]) : openManualInspection()}>
              <ClipboardList className="h-4 w-4" />
              Review Execution
            </Button>
            <Button variant="outline" onClick={createCorrectiveAction} disabled={!selectedInspection}>
              <Link2 className="h-4 w-4" />
              Create Corrective Action
            </Button>
            <Button onClick={openManualInspection}>
              <Plus className="h-4 w-4" />
              New Inspection
            </Button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {kpis.slice(0, 6).map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_420px]">
          <Card className="min-h-[620px]">
            <CardHeader className="space-y-3">
              <div>
                <CardTitle className="text-base">Inspection Queue</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Scheduled, failed, and pending-review inspections.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Today", "Pending Review", "Failed", "Corrective Action", "Completed"].map((filter) => (
                  <button key={filter} type="button" onClick={() => setActiveFilter(filter)}>
                    <Badge variant={activeFilter === filter ? "secondary" : "outline"}>{filter}</Badge>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!filteredQueue.length ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Start from outlet execution signals or schedule a branch inspection.
                </div>
              ) : null}
              {filteredQueue.map((row) => {
                const branch = detailValue(row, "Branch") || row.subtitle;
                const corrective = detailValue(row, "Corrective Action Status") || "Not Created";
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedInspectionId(row.id)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition-colors hover:border-primary/60",
                      selectedInspection?.id === row.id ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-muted-foreground">{branch}</p>
                      </div>
                      <Badge variant={statusTone(row.status)}>{row.status}</Badge>
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>Checklist</span><span>{detailValue(row, "Checklist Template") || "Not configured"}</span></div>
                      <div className="flex justify-between"><span>Failed Items</span><span>{detailValue(row, "Failed Items") || "0"}</span></div>
                      <div className="flex justify-between"><span>Corrective Action</span><span>{corrective}</span></div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="min-h-[620px]">
            <CardHeader>
              <CardTitle className="text-base">Execution Signals</CardTitle>
              <p className="text-sm text-muted-foreground">Outlet execution items that should trigger inspection review.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {!signals.length ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  No outlet execution signals need inspection yet. Overdue tasks, missing proof, or linked incidents will appear here.
                </div>
              ) : null}
              {signals.map((signal) => (
                <div key={signal.id} className={cn("rounded-xl border p-3", selectedSignalId === signal.id ? "border-primary bg-primary/5" : "border-border")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{signal.taskTitle}</p>
                      <p className="text-xs text-muted-foreground">{signal.branchName}</p>
                    </div>
                    <Badge variant={statusTone(signal.status)}>{signal.status}</Badge>
                  </div>
                  <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Reason</span><span>{signal.reason}</span></div>
                    <div className="flex justify-between"><span>Due</span><span>{signal.dueAt || "Not set"}</span></div>
                    <div className="flex justify-between"><span>Photo Proof</span><span>{signal.photoProofStatus}</span></div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => openSignalInspection(signal)}>
                      Inspect This Execution
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSignalId(signal.id)}>
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="min-h-[620px]">
            <CardHeader>
              <CardTitle className="text-base">Inspection Review Detail</CardTitle>
              <p className="text-sm text-muted-foreground">Review checklist result, linked incident, corrective action, and new photo proof requirement.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedInspection || !reviewSummary ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Select an inspection or start from an execution signal.
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-medium">{selectedInspection.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedInspection.subtitle}</p>
                  </div>

                  <div className="grid gap-2 text-sm">
                    {[
                      ["Branch", reviewSummary.branch],
                      ["Inspection Type", reviewSummary.inspectionType],
                      ["Checklist", reviewSummary.checklist],
                      ["Score", reviewSummary.score],
                      ["Failed Items", reviewSummary.failedItems],
                      ["Linked Execution", reviewSummary.linkedExecutionTask],
                      ["Linked Incident", reviewSummary.linkedIncident],
                      ["Corrective Action", reviewSummary.correctiveActionStatus],
                      ["New Photo Proof", reviewSummary.requiredNewPhotoProof],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-right font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileWarning className="h-4 w-4 text-primary" />
                      Failed Checklist Items
                    </div>
                    {!failedItems.length ? (
                      <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                        No failed items recorded yet. Run inspection review to capture checklist failures.
                      </div>
                    ) : (
                      failedItems.map((item) => (
                        <div key={item.id} className="rounded-xl border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.comment || "No comment recorded."}</p>
                            </div>
                            <Badge variant={statusTone(item.severity)}>{item.severity}</Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {item.photoRequired ? <span className="rounded-md border px-2 py-1">Photo required</span> : null}
                            {item.shouldCreateIncident ? <span className="rounded-md border px-2 py-1">Incident suggested</span> : null}
                            {item.correctiveActionRequired ? <span className="rounded-md border px-2 py-1">Corrective action required</span> : null}
                          </div>
                          {item.shouldCreateIncident ? (
                            <Button size="sm" className="mt-3" onClick={() => createIncident(item)}>
                              <ShieldAlert className="h-4 w-4" />
                              Create Incident
                            </Button>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ListChecks className="h-4 w-4 text-primary" />
                      Next Actions
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {nextActions.map((action) => (
                        <div key={action} className="rounded-lg border px-3 py-2">{action}</div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Button onClick={openReviewDialog}>
                      <CheckCircle2 className="h-4 w-4" />
                      Run Inspection Review
                    </Button>
                    <Button variant="outline" onClick={createCorrectiveAction}>
                      <Camera className="h-4 w-4" />
                      Push Corrective Action
                    </Button>
                  </div>
                </>
              )}
              <p className="text-xs text-muted-foreground">Sync: {syncStatus} · {syncMessage}</p>
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog open={inspectionDialogOpen} onOpenChange={setInspectionDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{selectedSignal ? "Review Outlet Execution" : "New Inspection"}</DialogTitle>
            <DialogDescription>
              Schedule or start a store inspection from outlet execution, incident follow-up, or manual branch review.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Branch *</Label>
                <Select value={form.branch || undefined} onValueChange={(value) => setForm((current) => ({ ...current, branch: value }))}>
                  <SelectTrigger><SelectValue placeholder={branchOptions.length ? "Select branch" : "No branches registered"} /></SelectTrigger>
                  <SelectContent>
                    {branchOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Inspection Type *</Label>
                <Select value={form.inspectionType} onValueChange={(value) => setForm((current) => ({ ...current, inspectionType: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select inspection type" /></SelectTrigger>
                  <SelectContent>
                    {inspectionTypes.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Checklist Template</Label>
                {checklistOptions.length ? (
                  <Select value={form.checklistTemplate || undefined} onValueChange={(value) => setForm((current) => ({ ...current, checklistTemplate: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select checklist template" /></SelectTrigger>
                    <SelectContent>
                      {checklistOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={form.checklistTemplate} placeholder="No checklist templates configured yet" onChange={(event) => setForm((current) => ({ ...current, checklistTemplate: event.target.value }))} />
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Scheduled Time</Label>
                <Input type="datetime-local" value={form.scheduledTime} onChange={(event) => setForm((current) => ({ ...current, scheduledTime: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Inspector</Label>
                <Input value={form.inspector} placeholder="Inspector name or role" onChange={(event) => setForm((current) => ({ ...current, inspector: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(value) => setForm((current) => ({ ...current, source: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Photo Proof Required</Label>
                <Select value={form.photoProofRequired} onValueChange={(value) => setForm((current) => ({ ...current, photoProofRequired: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[(Array.from(taskMasterData.proofType)[0] || "Required"), "Optional"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Auto Incident Suggestion</Label>
                <Select value={form.autoIncidentSuggestion} onValueChange={(value) => setForm((current) => ({ ...current, autoIncidentSuggestion: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Corrective Action Required If Failed</Label>
                <Select value={form.correctiveActionRequired} onValueChange={(value) => setForm((current) => ({ ...current, correctiveActionRequired: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5 rounded-md border p-3">
              <Label>Inspection Notes</Label>
              <Textarea value={form.note} placeholder="Capture why this inspection is being run and what should be checked." onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInspectionDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveInspection} disabled={!form.branch || !form.inspectionType}>{selectedSignal ? "Start Inspection" : "Schedule Inspection"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>Run Inspection Review</DialogTitle>
            <DialogDescription>
              Record failed checklist items, review score, and decide whether incident or corrective action is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Score</Label>
                <Input type="number" value={reviewForm.score} onChange={(event) => setReviewForm((current) => ({ ...current, score: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Review Status</Label>
                <Select value={reviewForm.reviewStatus} onValueChange={(value) => setReviewForm((current) => ({ ...current, reviewStatus: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {reviewStatuses.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 rounded-md border p-3">
              <div>
                <p className="text-sm font-semibold">Add Failed Item</p>
                <p className="mt-1 text-xs text-muted-foreground">Capture the failed point that should create incident review or corrective action.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Failed Item Label</Label>
                  <Input value={reviewForm.failedLabel} onChange={(event) => setReviewForm((current) => ({ ...current, failedLabel: event.target.value }))} placeholder="Example: fryer cleaning not completed" />
                </div>
                <div className="space-y-1.5">
                  <Label>Severity</Label>
                  <Select value={reviewForm.failedSeverity} onValueChange={(value) => setReviewForm((current) => ({ ...current, failedSeverity: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Array.from(issueMasterData.severity).length ? Array.from(issueMasterData.severity) : ["Low", "Medium", "High", "Critical"]).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Comment</Label>
                  <Textarea value={reviewForm.failedComment} onChange={(event) => setReviewForm((current) => ({ ...current, failedComment: event.target.value }))} placeholder="Explain what was wrong and what new evidence is required." />
                </div>
                <div className="space-y-1.5">
                  <Label>Photo Required</Label>
                  <Select value={reviewForm.photoRequired} onValueChange={(value) => setReviewForm((current) => ({ ...current, photoRequired: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Create Incident Suggestion</Label>
                  <Select value={reviewForm.shouldCreateIncident} onValueChange={(value) => setReviewForm((current) => ({ ...current, shouldCreateIncident: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Corrective Action Required</Label>
                  <Select value={reviewForm.correctiveActionRequired} onValueChange={(value) => setReviewForm((current) => ({ ...current, correctiveActionRequired: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" onClick={addDraftFailedItem}>
                <AlertTriangle className="h-4 w-4" />
                Add Failed Item
              </Button>
            </div>

            <div className="space-y-3 rounded-md border p-3">
              <div>
                <p className="text-sm font-semibold">Failed Item Review</p>
              </div>
              {!draftFailedItems.length ? (
                <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No failed items added yet.</div>
              ) : (
                draftFailedItems.map((item) => (
                  <div key={item.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.comment || "No comment"}</p>
                      </div>
                      <Badge variant={statusTone(item.severity)}>{item.severity}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveReview}>Save Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
