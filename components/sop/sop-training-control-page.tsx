"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, GraduationCap, Plus, ScrollText } from "lucide-react";
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
import { sopMasterData } from "@/lib/master-data/sop";
import { runStoreOperationRules } from "@/lib/rules/rule-runner";
import {
  createChecklistTemplateFromSop,
  createInspectionTemplateFromSop,
  createTaskTemplateFromSop,
  createTrainingTaskFromSop,
  publishNewSopVersion,
} from "@/lib/store-operations/store-operation-links";
import {
  getAcknowledgementStatusTone,
  getSopControlBoard,
  getSopDetail,
  getSopGovernanceSummary,
  getSopKpis,
  getSopLifecycleTone,
  getSopNextActions,
  getTemplateGeneratorQueue,
  getTrainingAcknowledgementQueue,
} from "@/lib/store-operations/sop-training-workspace";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function upsertDetail(items: Array<{ label: string; value: string }> | undefined, label: string, value: string) {
  const next = [...(items ?? [])];
  const index = next.findIndex((item) => item.label === label);
  if (index >= 0) next[index] = { label, value };
  else next.push({ label, value });
  return next;
}

type ModalMode = "create" | "publish" | "training" | "checklist";

type SopForm = {
  title: string;
  documentCode: string;
  category: string;
  processArea: string;
  version: string;
  processOwner: string;
  approver: string;
  targetRole: string;
  targetBranch: string;
  acknowledgementRequired: string;
  effectiveDate: string;
  reviewCycle: string;
  reviewDueDate: string;
  steps: string;
  riskPoints: string;
  notes: string;
  contentSourceType: string;
  employeeReadMode: string;
  page1Title: string;
  page1Description: string;
  page1Steps: string;
  page1ImageUrl: string;
  page2Title: string;
  page2Description: string;
  page2Steps: string;
  page2ImageUrl: string;
  pdfUrl: string;
  existingSopId: string;
  newVersion: string;
  changeSummary: string;
  trainingRequired: string;
  notifyTargetRoles: string;
  dueDate: string;
  checklistName: string;
  scoringRule: string;
  photoRequired: string;
  autoIssueSuggestion: string;
};

const categoryOptions = Array.from(sopMasterData.sopCategory).length ? Array.from(sopMasterData.sopCategory) : ["Kitchen", "Service", "Safety", "HR", "Operations"];
const processAreaOptions = Array.from(sopMasterData.processArea).length ? Array.from(sopMasterData.processArea) : ["Operations", "Kitchen", "Service", "Storage", "Training"];
const reviewCycleOptions = Array.from(sopMasterData.reviewCycle).length ? Array.from(sopMasterData.reviewCycle) : ["30 Days", "90 Days", "180 Days", "365 Days"];

export function SopTrainingControlPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const syncStatus = useMeRuntimeStore((state) => state.syncStatus);
  const syncMessage = useMeRuntimeStore((state) => state.lastSyncMessage);

  const sopRows = getRows("sop", []);
  const taskRows = getRows("tasks", []);
  const branchRows = getRows("branches", []);

  const [selectedSopId, setSelectedSopId] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ModalMode>("create");
  const [form, setForm] = useState<SopForm>({
    title: "",
    documentCode: "",
    category: categoryOptions[0],
    processArea: processAreaOptions[0],
    version: "v1.0",
    processOwner: "",
    approver: "",
    targetRole: "Outlet Manager",
    targetBranch: "",
    acknowledgementRequired: "Yes",
    effectiveDate: new Date().toISOString().slice(0, 10),
    reviewCycle: reviewCycleOptions[1] || "90 Days",
    reviewDueDate: new Date().toISOString().slice(0, 10),
    steps: "",
    riskPoints: "",
    notes: "",
    contentSourceType: "builder",
    employeeReadMode: "Page View",
    page1Title: "Page 1 · Standard Overview",
    page1Description: "",
    page1Steps: "",
    page1ImageUrl: "",
    page2Title: "Page 2 · Execution Steps",
    page2Description: "",
    page2Steps: "",
    page2ImageUrl: "",
    pdfUrl: "",
    existingSopId: "",
    newVersion: "v1.1",
    changeSummary: "",
    trainingRequired: "Yes",
    notifyTargetRoles: "Yes",
    dueDate: new Date().toISOString().slice(0, 10),
    checklistName: "",
    scoringRule: "100-point checklist",
    photoRequired: "Yes",
    autoIssueSuggestion: "Yes",
  });

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const kpis = useMemo(() => getSopKpis(sopRows, taskRows), [sopRows, taskRows]);
  const governance = useMemo(() => getSopGovernanceSummary(sopRows, taskRows), [sopRows, taskRows]);
  const controlBoard = useMemo(() => getSopControlBoard(sopRows), [sopRows]);
  const trainingQueue = useMemo(() => getTrainingAcknowledgementQueue(sopRows, taskRows), [sopRows, taskRows]);
  const templateQueue = useMemo(() => getTemplateGeneratorQueue(sopRows), [sopRows]);
  const requestedSopId = useMemo(() => {
    const sopId = searchParams.get("sopId");
    return sopId && sopRows.some((row) => row.id === sopId) ? sopId : undefined;
  }, [searchParams, sopRows]);
  const selectedSop = sopRows.find((row) => row.id === selectedSopId)
    ?? sopRows.find((row) => row.id === requestedSopId)
    ?? sopRows[0];
  const detail = useMemo(() => getSopDetail(selectedSop), [selectedSop]);
  const nextActions = useMemo(() => getSopNextActions(selectedSop), [selectedSop]);
  const branchOptions = useMemo(() => branchRows.map((row) => row.title), [branchRows]);

  function openModal(mode: ModalMode) {
    if (selectedSop) {
      setForm((current) => ({
        ...current,
        existingSopId: selectedSop.id,
        title: mode === "create" ? current.title : selectedSop.title,
        targetBranch: detailValue(selectedSop, "Target Branch") || current.targetBranch,
      }));
    }
    setDialogMode(mode);
    setDialogOpen(true);
  }

  async function createSop() {
    if (!form.title.trim()) return;
    const matches = runStoreOperationRules("sop-training", {
      status: "Draft",
      reviewDueDate: form.reviewDueDate,
      acknowledgementRequired: form.acknowledgementRequired === "Yes",
      trainingTaskCount: 0,
      linkedChecklistTemplateIds: "",
      riskPointsCount: form.riskPoints.split(",").filter(Boolean).length,
      failedItemRule: "",
    });
    const nextAction = matches[0]?.result.suggestedAction || "Create checklist template";
    const created = await createRecordWithPayload("sop", {
      title: form.title.trim(),
      subtitle: `${form.category} · ${form.processArea}`,
      status: "Draft",
      owner: form.processOwner || "SOP Control",
      detailItems: [
        { label: "Document Code", value: form.documentCode },
        { label: "Category", value: form.category },
        { label: "Process Area", value: form.processArea },
        { label: "Version", value: form.version },
        { label: "Process Owner", value: form.processOwner },
        { label: "Approver", value: form.approver },
        { label: "Effective Date", value: form.effectiveDate },
        { label: "Review Cycle", value: form.reviewCycle },
        { label: "Review Due Date", value: form.reviewDueDate },
        { label: "Target Role", value: form.targetRole },
        { label: "Target Branch", value: form.targetBranch },
        { label: "Acknowledgement Required", value: form.acknowledgementRequired },
        { label: "Acknowledgement Status", value: form.acknowledgementRequired === "Yes" ? "Pending" : "Not Required" },
        { label: "Linked Checklist Template IDs", value: "" },
        { label: "Linked Inspection Template IDs", value: "" },
        { label: "Linked Task Template IDs", value: "" },
        { label: "Assigned Training IDs", value: "" },
        { label: "SOP Steps", value: form.steps },
        { label: "Risk Points", value: form.riskPoints },
        { label: "Content Source Type", value: form.contentSourceType },
        { label: "Employee Read Mode", value: form.employeeReadMode },
        { label: "SOP Page 1 Title", value: form.page1Title },
        { label: "SOP Page 1 Description", value: form.page1Description },
        { label: "SOP Page 1 Steps", value: form.page1Steps },
        { label: "SOP Page 1 Image URL", value: form.page1ImageUrl },
        { label: "SOP Page 2 Title", value: form.page2Title },
        { label: "SOP Page 2 Description", value: form.page2Description },
        { label: "SOP Page 2 Steps", value: form.page2Steps },
        { label: "SOP Page 2 Image URL", value: form.page2ImageUrl },
        { label: "PDF URL", value: form.pdfUrl },
      ],
      detailNote: form.notes || "Controlled SOP created. Generate templates and assign training before rollout.",
      nextAction,
    });
    setSelectedSopId(created.id);
    setDialogOpen(false);
    await logAction("sop", "create-sop", `Created SOP ${created.title}`);
  }

  async function publishVersion() {
    if (!selectedSop) return;
    const seed = publishNewSopVersion(selectedSop, form.newVersion);
    const created = await createRecordWithPayload("sop", {
      title: seed.title,
      subtitle: selectedSop.subtitle,
      status: "Approved",
      owner: detailValue(selectedSop, "Process Owner") || selectedSop.owner || "SOP Control",
      detailItems: [
        ...((selectedSop.detailItems ?? []).filter((item) => item.label !== "Version" && item.label !== "Previous Version ID" && item.label !== "Replacement Version ID")),
        { label: "Version", value: form.newVersion },
        { label: "Previous Version ID", value: selectedSop.id },
        { label: "Change Summary", value: form.changeSummary },
        { label: "Effective Date", value: form.effectiveDate },
        { label: "Review Due Date", value: form.reviewDueDate },
      ],
      detailNote: form.changeSummary || "New SOP version published.",
      nextAction: form.trainingRequired === "Yes" ? "Assign training" : "Create checklist template",
    });
    let oldDetails = selectedSop.detailItems ?? [];
    oldDetails = upsertDetail(oldDetails, "Replacement Version ID", created.id);
    await updateRecord("sop", selectedSop.id, { status: "Superseded", detailItems: oldDetails, nextAction: "Retire old version" });
    setSelectedSopId(created.id);
    setDialogOpen(false);
    await logAction("sop", "publish-version", `Published ${created.title} ${form.newVersion}`);
  }

  async function assignTraining() {
    if (!selectedSop) return;
    const seed = createTrainingTaskFromSop(selectedSop);
    const created = await createRecordWithPayload("tasks", {
      title: seed.title,
      subtitle: `${form.targetBranch || detailValue(selectedSop, "Target Branch") || "All Branches"} · SOP Training`,
      status: "Scheduled",
      owner: form.targetRole || detailValue(selectedSop, "Target Role") || "Outlet Manager",
      detailItems: [
        { label: "Branch", value: form.targetBranch || detailValue(selectedSop, "Target Branch") || "All Branches" },
        { label: "Task Type", value: "Training Acknowledgement" },
        { label: "Role Target", value: form.targetRole || detailValue(selectedSop, "Target Role") || "Outlet Manager" },
        { label: "Outlets", value: form.targetBranch || detailValue(selectedSop, "Target Branch") || "All Branches" },
        { label: "Completed Outlets", value: "" },
        { label: "Due Date", value: form.dueDate },
        { label: "Due Time", value: "18:00" },
        { label: "Due At", value: `${form.dueDate}T18:00` },
        { label: "Repeat Rule", value: "Once" },
        { label: "Completion Standard", value: seed.completionStandard },
        { label: "Photo Required", value: "Not Required" },
        { label: "Photo Proof Status", value: "Not Required" },
        { label: "Manager Review Status", value: "Not Submitted" },
        { label: "Source", value: "SOP & Training" },
        { label: "Linked SOP ID", value: selectedSop.id },
        { label: "Linked SOP", value: selectedSop.title },
        { label: "SLA Status", value: "On Track" },
      ],
      detailNote: `Read and acknowledge ${selectedSop.title} ${detailValue(selectedSop, "Version") || "current version"}.`,
      nextAction: "Acknowledge SOP training",
    });
    let details = selectedSop.detailItems ?? [];
    details = upsertDetail(details, "Assigned Training IDs", [detailValue(selectedSop, "Assigned Training IDs"), created.id].filter(Boolean).join(", "));
    details = upsertDetail(details, "Acknowledgement Status", "Assigned");
    await updateRecord("sop", selectedSop.id, { detailItems: details, nextAction: "Track acknowledgement" });
    setDialogOpen(false);
    await logAction("sop", "assign-training", `Assigned training for ${selectedSop.title}`);
  }

  async function createChecklistTemplate() {
    if (!selectedSop) return;
    const checklist = createChecklistTemplateFromSop(selectedSop);
    const inspection = createInspectionTemplateFromSop(selectedSop);
    const taskTemplate = createTaskTemplateFromSop(selectedSop);
    let details = selectedSop.detailItems ?? [];
    details = upsertDetail(details, "Linked Checklist Template IDs", [detailValue(selectedSop, "Linked Checklist Template IDs"), checklist.id].filter(Boolean).join(", "));
    details = upsertDetail(details, "Linked Inspection Template IDs", [detailValue(selectedSop, "Linked Inspection Template IDs"), inspection.id].filter(Boolean).join(", "));
    details = upsertDetail(details, "Linked Task Template IDs", [detailValue(selectedSop, "Linked Task Template IDs"), taskTemplate.id].filter(Boolean).join(", "));
    await updateRecord("sop", selectedSop.id, { detailItems: details, nextAction: "Assign training or publish version" });
    setDialogOpen(false);
    await logAction("sop", "create-templates", `Generated templates from ${selectedSop.title}`);
  }

  async function handleSubmit() {
    if (dialogMode === "create") await createSop();
    if (dialogMode === "publish") await publishVersion();
    if (dialogMode === "training") await assignTraining();
    if (dialogMode === "checklist") await createChecklistTemplate();
  }

  return (
    <ErpShell>
      <div className="space-y-6 p-4 md:p-6 pb-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Store Operations</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">SOP & Training</h1>
              <p className="text-muted-foreground">Control operational standards, versions, training acknowledgement, and reusable execution templates.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => openModal("create")}><Plus className="h-4 w-4" />Create SOP</Button>
            <Button variant="outline" onClick={() => openModal("publish")} disabled={!selectedSop}><ScrollText className="h-4 w-4" />Publish Version</Button>
            <Button variant="outline" onClick={() => openModal("training")} disabled={!selectedSop}><GraduationCap className="h-4 w-4" />Assign Training</Button>
            <Button variant="outline" onClick={() => openModal("checklist")} disabled={!selectedSop}><ClipboardList className="h-4 w-4" />Create Checklist Template</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-semibold">{kpi.value}</div></CardContent>
            </Card>
          ))}
        </div>

        {!sopRows.length ? (
          <Card>
            <CardHeader><CardTitle>Create your first controlled SOP</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Create your first controlled SOP to generate checklists, inspection templates, task templates, and training acknowledgement.</p>
              <Button onClick={() => openModal("create")}>Create SOP</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_420px]">
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>SOP Control Board</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {controlBoard.map((section) => (
                    <div key={section.status} className="space-y-2">
                      <div className="flex items-center justify-between"><div className="text-sm font-medium">{section.status}</div><Badge variant={getSopLifecycleTone(section.status)}>{section.items.length}</Badge></div>
                      {!section.items.length ? null : section.items.map((row) => (
                        <button key={row.id} type="button" onClick={() => setSelectedSopId(row.id)} className={cn("w-full rounded-lg border p-3 text-left", selectedSop?.id === row.id && "border-primary bg-primary/5")}>
                          <div className="font-medium">{row.title}</div>
                          <div className="text-xs text-muted-foreground">{detailValue(row, "Document Code")} · {detailValue(row, "Version") || "v1.0"}</div>
                        </button>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Training Acknowledgement</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {!trainingQueue.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No SOP training acknowledgement is currently pending.</div> : trainingQueue.map((item) => (
                    <div key={item.row.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{item.row.title}</div>
                          <div className="text-xs text-muted-foreground">{item.version} · {item.targetRole} · {item.targetBranch}</div>
                        </div>
                        <Badge variant={getAcknowledgementStatusTone(item.acknowledgementStatus)}>{item.acknowledgementStatus}</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div><div className="text-muted-foreground">Pending</div><div className="font-medium">{item.training.pending}</div></div>
                        <div><div className="text-muted-foreground">Overdue</div><div className="font-medium">{item.training.overdue}</div></div>
                        <div><div className="text-muted-foreground">Acknowledged</div><div className="font-medium">{item.training.completed}</div></div>
                        <div><div className="text-muted-foreground">Rate</div><div className="font-medium">{item.training.rate}%</div></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Template Generator</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {!templateQueue.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Generate checklist, inspection, or task templates from approved SOPs.</div> : templateQueue.map((item) => (
                    <div key={item.row.id} className="rounded-lg border p-3">
                      <div className="font-medium">{item.row.title}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {item.checklistMissing ? <Badge variant="secondary">Checklist Missing</Badge> : <Badge variant="outline">Checklist Ready</Badge>}
                        {item.inspectionMissing ? <Badge variant="secondary">Inspection Missing</Badge> : <Badge variant="outline">Inspection Ready</Badge>}
                        {item.taskMissing ? <Badge variant="secondary">Task Template Missing</Badge> : <Badge variant="outline">Task Template Ready</Badge>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedSopId(item.row.id); openModal("checklist"); }}>Create Templates</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>SOP Detail</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {!detail ? (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Select an SOP to review lifecycle, templates, and training assignment.</div>
                  ) : (
                    <>
                      <div>
                        <div className="font-medium">{detail.title}</div>
                        <div className="text-sm text-muted-foreground">{detail.documentCode} · {detail.version}</div>
                      </div>
                      <div className="grid gap-2 text-sm">
                        {[
                          ["Status", selectedSop?.status || "Draft"],
                          ["Owner", detail.owner],
                          ["Approver", detail.approver],
                          ["Effective Date", detail.effectiveDate],
                          ["Review Due", detail.reviewDueDate],
                          ["Review Cycle", detail.reviewCycle],
                          ["Target Role", detail.targetRole],
                          ["Target Branch", detail.targetBranch],
                          ["Acknowledgement", detail.acknowledgementStatus],
                        ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getSopLifecycleTone(selectedSop?.status || "Draft")}>{selectedSop?.status || "Draft"}</Badge>
                        <Badge variant={getAcknowledgementStatusTone(detail.acknowledgementStatus)}>{detail.acknowledgementStatus}</Badge>
                        <Badge variant="outline">Risk {governance.governanceRisk}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Risk Points</div>
                        {!detail.riskPoints.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No risk points captured.</div> : detail.riskPoints.map((item) => <div key={item} className="rounded-lg border px-3 py-2 text-sm">{item}</div>)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold">Employee Reading Preview</div>
                          <Badge variant="outline">{detail.employeeReadMode}</Badge>
                        </div>
                        {!detail.pages.length ? (
                          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Add Page 1 and Page 2 to turn this SOP into staff reading content.</div>
                        ) : (
                          <div className="space-y-3">
                            {detail.pages.map((page) => (
                              <div key={page.id} className="rounded-xl border p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-xs font-medium uppercase text-muted-foreground">Page {page.pageNo}</div>
                                    <div className="font-medium">{page.title}</div>
                                    {page.description ? <div className="text-sm text-muted-foreground">{page.description}</div> : null}
                                  </div>
                                  {page.imageUrl ? <Badge variant="secondary">Image</Badge> : <Badge variant="outline">No Image</Badge>}
                                </div>
                                {page.imageUrl ? (
                                  <div className="mt-3 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">Image placeholder: {page.imageUrl}</div>
                                ) : null}
                                <div className="mt-3 space-y-2">
                                  {(page.steps || []).length ? page.steps.map((step) => (
                                    <div key={step.id} className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                                      <span className="font-medium">Step {step.stepNo}: {step.title}</span>
                                      <div className="text-muted-foreground">{step.instruction}</div>
                                    </div>
                                  )) : <div className="rounded-lg border border-dashed p-2 text-sm text-muted-foreground">No steps added for this page.</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {detail.pdfUrl ? (
                          <div className="rounded-lg border px-3 py-2 text-sm">
                            <div className="font-medium">PDF Attachment</div>
                            <div className="break-all text-muted-foreground">{detail.pdfUrl}</div>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No PDF attached. You can still use Page View content.</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Assignment Target</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="rounded-lg border px-3 py-2"><span className="text-muted-foreground">Outlet</span><div className="font-medium">{detail.targetBranch}</div></div>
                          <div className="rounded-lg border px-3 py-2"><span className="text-muted-foreground">Role</span><div className="font-medium">{detail.targetRole}</div></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Linked Templates</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="rounded-lg border px-3 py-2">Checklist: {detail.linkedChecklist.length}</div>
                          <div className="rounded-lg border px-3 py-2">Inspection: {detail.linkedInspection.length}</div>
                          <div className="rounded-lg border px-3 py-2">Task: {detail.linkedTask.length}</div>
                          <div className="rounded-lg border px-3 py-2">Training: {detail.linkedTraining.length}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Next Actions</div>
                        {nextActions.length ? nextActions.map((item) => <div key={item} className="rounded-lg border px-3 py-2 text-sm">{item}</div>) : <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">This SOP has not generated operational templates yet.</div>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {detail.linkedTraining.length ? <Button variant="outline" size="sm" onClick={() => router.push(`/tasks?taskId=${detail.linkedTraining[0]}`)}>Open Training Task</Button> : null}
                      </div>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground">Sync: {syncStatus} · {syncMessage}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Create SOP" : dialogMode === "publish" ? "Publish Version" : dialogMode === "training" ? "Assign Training" : "Create Checklist Template"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Create a controlled SOP and define lifecycle, review cycle, target roles, and risk points."
                : dialogMode === "publish"
                  ? "Publish a new SOP version and supersede the previous release."
                  : dialogMode === "training"
                    ? "Assign acknowledgement training to branch and role targets."
                    : "Generate checklist, inspection, and task templates from this SOP."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {dialogMode === "create" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>SOP Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Document Code</Label><Input value={form.documentCode} onChange={(e) => setForm((p) => ({ ...p, documentCode: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Category</Label><Select value={form.category} onValueChange={(value) => setForm((p) => ({ ...p, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categoryOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Process Area</Label><Select value={form.processArea} onValueChange={(value) => setForm((p) => ({ ...p, processArea: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{processAreaOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Version</Label><Input value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Process Owner</Label><Input value={form.processOwner} onChange={(e) => setForm((p) => ({ ...p, processOwner: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Approver</Label><Input value={form.approver} onChange={(e) => setForm((p) => ({ ...p, approver: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Target Role</Label><Input value={form.targetRole} onChange={(e) => setForm((p) => ({ ...p, targetRole: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Target Branch</Label><Select value={form.targetBranch || undefined} onValueChange={(value) => setForm((p) => ({ ...p, targetBranch: value }))}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Acknowledgement Required</Label><Select value={form.acknowledgementRequired} onValueChange={(value) => setForm((p) => ({ ...p, acknowledgementRequired: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Yes", "No"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Effective Date</Label><Input type="date" value={form.effectiveDate} onChange={(e) => setForm((p) => ({ ...p, effectiveDate: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Review Cycle</Label><Select value={form.reviewCycle} onValueChange={(value) => setForm((p) => ({ ...p, reviewCycle: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{reviewCycleOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Review Due Date</Label><Input type="date" value={form.reviewDueDate} onChange={(e) => setForm((p) => ({ ...p, reviewDueDate: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Content Source</Label><Select value={form.contentSourceType} onValueChange={(value) => setForm((p) => ({ ...p, contentSourceType: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["builder", "pdf", "external-link"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Employee Read Mode</Label><Select value={form.employeeReadMode} onValueChange={(value) => setForm((p) => ({ ...p, employeeReadMode: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Page View", "Checklist View", "PDF View"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>

                <div className="space-y-1.5 md:col-span-2"><Label>Page 1 Title</Label><Input value={form.page1Title} onChange={(e) => setForm((p) => ({ ...p, page1Title: e.target.value }))} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Page 1 Description</Label><Textarea rows={2} value={form.page1Description} onChange={(e) => setForm((p) => ({ ...p, page1Description: e.target.value }))} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Page 1 Steps, one per line</Label><Textarea rows={4} value={form.page1Steps} onChange={(e) => setForm((p) => ({ ...p, page1Steps: e.target.value }))} placeholder={"Step 1 instruction\nStep 2 instruction"} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Page 1 Image URL / File Name Placeholder</Label><Input value={form.page1ImageUrl} onChange={(e) => setForm((p) => ({ ...p, page1ImageUrl: e.target.value }))} /></div>

                <div className="space-y-1.5 md:col-span-2"><Label>Page 2 Title</Label><Input value={form.page2Title} onChange={(e) => setForm((p) => ({ ...p, page2Title: e.target.value }))} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Page 2 Description</Label><Textarea rows={2} value={form.page2Description} onChange={(e) => setForm((p) => ({ ...p, page2Description: e.target.value }))} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Page 2 Steps, one per line</Label><Textarea rows={4} value={form.page2Steps} onChange={(e) => setForm((p) => ({ ...p, page2Steps: e.target.value }))} placeholder={"Step 1 instruction\nStep 2 instruction"} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Page 2 Image URL / File Name Placeholder</Label><Input value={form.page2ImageUrl} onChange={(e) => setForm((p) => ({ ...p, page2ImageUrl: e.target.value }))} /></div>

                <div className="space-y-1.5 md:col-span-2"><Label>PDF URL / File Name Placeholder</Label><Input value={form.pdfUrl} onChange={(e) => setForm((p) => ({ ...p, pdfUrl: e.target.value }))} /></div>

                <div className="space-y-1.5 md:col-span-2"><Label>Fallback SOP Steps</Label><Textarea rows={4} value={form.steps} onChange={(e) => setForm((p) => ({ ...p, steps: e.target.value }))} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Risk Points</Label><Textarea rows={3} value={form.riskPoints} onChange={(e) => setForm((p) => ({ ...p, riskPoints: e.target.value }))} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></div>
              </div>
            ) : null}
            {dialogMode === "publish" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Existing SOP</Label><Select value={form.existingSopId || undefined} onValueChange={(value) => setForm((p) => ({ ...p, existingSopId: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sopRows.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>New Version</Label><Input value={form.newVersion} onChange={(e) => setForm((p) => ({ ...p, newVersion: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Effective Date</Label><Input type="date" value={form.effectiveDate} onChange={(e) => setForm((p) => ({ ...p, effectiveDate: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Review Due Date</Label><Input type="date" value={form.reviewDueDate} onChange={(e) => setForm((p) => ({ ...p, reviewDueDate: e.target.value }))} /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Change Summary</Label><Textarea rows={4} value={form.changeSummary} onChange={(e) => setForm((p) => ({ ...p, changeSummary: e.target.value }))} /></div>
              </div>
            ) : null}
            {dialogMode === "training" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>SOP</Label><Select value={form.existingSopId || undefined} onValueChange={(value) => setForm((p) => ({ ...p, existingSopId: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sopRows.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Target Branch</Label><Select value={form.targetBranch || undefined} onValueChange={(value) => setForm((p) => ({ ...p, targetBranch: value }))}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Target Role</Label><Input value={form.targetRole} onChange={(e) => setForm((p) => ({ ...p, targetRole: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} /></div>
              </div>
            ) : null}
            {dialogMode === "checklist" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>SOP</Label><Select value={form.existingSopId || undefined} onValueChange={(value) => setForm((p) => ({ ...p, existingSopId: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{sopRows.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Checklist Name</Label><Input value={form.checklistName} onChange={(e) => setForm((p) => ({ ...p, checklistName: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Scoring Rule</Label><Input value={form.scoringRule} onChange={(e) => setForm((p) => ({ ...p, scoringRule: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Photo Required</Label><Select value={form.photoRequired} onValueChange={(value) => setForm((p) => ({ ...p, photoRequired: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Yes", "No"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{dialogMode === "create" ? "Create SOP" : dialogMode === "publish" ? "Publish Version" : dialogMode === "training" ? "Assign Training" : "Create Checklist Template"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
