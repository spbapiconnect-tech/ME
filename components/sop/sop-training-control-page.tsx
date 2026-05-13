"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  FileText,
  GraduationCap,
  ImageIcon,
  Plus,
  ScrollText,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { ErpShell } from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  type SopPreviewBlock,
  type SopPreviewContent,
  type SopPreviewPage,
} from "@/lib/store-operations/sop-training-workspace";
import { UploadAssetPreview } from "@/components/uploads/upload-asset-preview";
import { uploadAssetLabel, serializeUploadAsset, uploadLocalPreviewAsset } from "@/lib/uploads/upload-provider";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";
import { SopCreateTypeModal } from "@/components/sop/sop-create-type-modal";
import type { SopCreateTypeConfig } from "@/lib/sop/sop-create-types";
import { SopBuilderWorkspaceV3 } from "@/components/sop/sop-builder-workspace-v3";
import {
  createSopBuilderV3Document,
  type SopBuilderV3Block,
  type SopBuilderV3BlockType,
  type SopBuilderV3Page,
  type SopBuilderV3Settings,
} from "@/lib/sop/sop-builder-v3-types";

type BlockType = "heading" | "text" | "image" | "step-list" | "warning" | "pdf" | "checklist";
type ModalMode = "create" | "publish" | "training" | "checklist";

type BuilderBlock = {
  id: string;
  type: BlockType;
  title: string;
  body: string;
  imageUrl: string;
  pdfUrl: string;
  stepsText: string;
  checklistText: string;
  warningLevel: "Info" | "Warning" | "Critical";
};

type BuilderPage = {
  id: string;
  parentPageId?: string;
  title: string;
  coverImageUrl: string;
  blocks: BuilderBlock[];
};

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
  riskPoints: string;
  notes: string;
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
  employeeReadMode: "Interactive Book" | "Checklist View" | "PDF View" | "Mixed";
};

const categoryOptions = Array.from(sopMasterData.sopCategory).length
  ? Array.from(sopMasterData.sopCategory)
  : ["Kitchen", "Service", "Safety", "HR", "Operations"];

const processAreaOptions = Array.from(sopMasterData.processArea).length
  ? Array.from(sopMasterData.processArea)
  : ["Operations", "Kitchen", "Service", "Storage", "Training"];

const reviewCycleOptions = Array.from(sopMasterData.reviewCycle).length
  ? Array.from(sopMasterData.reviewCycle)
  : ["30 Days", "90 Days", "180 Days", "365 Days"];

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

function newBlock(type: BlockType = "text"): BuilderBlock {
  return {
    id: `block-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    title: type === "step-list" ? "Step By Step" : type === "warning" ? "Important Notice" : "",
    body: "",
    imageUrl: "",
    pdfUrl: "",
    stepsText: "",
    checklistText: "",
    warningLevel: type === "warning" ? "Warning" : "Info",
  };
}

function newPage(index: number, parentPageId?: string): BuilderPage {
  return {
    id: `page-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    parentPageId,
    title: index === 1 ? "Page 1 · What staff need to know" : `Page ${index}`,
    coverImageUrl: "",
    blocks: [
      {
        ...newBlock("heading"),
        title: "SOP title / section heading",
        body: "Explain what this page is about.",
      },
      {
        ...newBlock("text"),
        title: "Instruction context",
        body: "Write the reason, standard, or important background here so staff understand what to do.",
      },
      {
        ...newBlock("step-list"),
        title: "Step-by-step execution",
        stepsText: "Step 1: Prepare the station\nStep 2: Follow the standard\nStep 3: Take proof photo if required",
      },
    ],
  };
}

function serializeContent(mode: SopForm["employeeReadMode"], pages: BuilderPage[]): SopPreviewContent {
  return {
    mode,
    pages: pages.map((page, pageIndex) => ({
      id: page.id,
      pageNo: pageIndex + 1,
      title: page.title || `Page ${pageIndex + 1}`,
      coverImageUrl: page.coverImageUrl,
      blocks: page.blocks.map((block): SopPreviewBlock => ({
        id: block.id,
        type: block.type,
        title: block.title,
        body: block.body,
        imageUrl: block.imageUrl,
        pdfUrl: block.pdfUrl,
        warningLevel: block.warningLevel ?? "Info",
        checklistItems: block.checklistText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        steps: block.stepsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, index) => ({
            id: `${block.id}-step-${index + 1}`,
            title: `Step ${index + 1}`,
            instruction: line,
            proofRequired: false,
          })),
      })),
    })),
  };
}

function renderBlock(block: SopPreviewBlock) {
  if (block.type === "heading") {
    return <div className="text-lg font-semibold">{block.title || block.body || "Heading"}</div>;
  }

  if (block.type === "text") {
    return <p className="whitespace-pre-wrap text-sm text-muted-foreground">{block.body || "No text content yet."}</p>;
  }

  if (block.type === "image") {
    return (
      <div className="rounded-xl border bg-muted/30 p-3 text-sm">

        <div className="mb-2 flex items-center gap-2 font-medium"><ImageIcon className="h-4 w-4" />Image</div>
        <div className="break-all text-muted-foreground">{block.imageUrl ? <UploadAssetPreview value={block.imageUrl} compact /> : "Media placeholder not set."}</div>
      </div>
    );
  }

  if (block.type === "pdf") {
    return (
      <div className="rounded-xl border bg-muted/30 p-3 text-sm">
        <div className="mb-2 flex items-center gap-2 font-medium"><FileText className="h-4 w-4" />PDF</div>
        <div className="break-all text-muted-foreground">{block.pdfUrl ? <UploadAssetPreview value={block.pdfUrl} compact /> : "PDF placeholder not set."}</div>
      </div>
    );
  }

  if (block.type === "warning") {
    return (
      <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-3 text-sm">
        <div className="font-medium">{block.title || block.warningLevel || "Warning"}</div>
        <div className="mt-1 whitespace-pre-wrap text-muted-foreground">{block.body || "No warning content yet."}</div>
      </div>
    );
  }

  if (block.type === "checklist") {
    const items = block.checklistItems || [];
    return (
      <div className="space-y-2 rounded-xl border p-3 text-sm">
        <div className="font-medium">{block.title || "Checklist"}</div>
        {items.length ? items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <span className="mt-1 h-3 w-3 rounded border" />
            <span>{item}</span>
          </div>
        )) : <div className="text-muted-foreground">No checklist items yet.</div>}
      </div>
    );
  }

  const steps = block.steps || [];

  return (
    <div className="space-y-2 rounded-xl border p-3 text-sm">
      <div className="font-medium">{block.title || "Step By Step"}</div>
      {steps.length ? steps.map((step, index) => (
        <div key={step.id} className="rounded-lg bg-muted/40 px-3 py-2">
          <div className="font-medium">Step {index + 1}</div>
          <div className="whitespace-pre-wrap text-muted-foreground">{step.instruction}</div>
        </div>
      )) : <div className="text-muted-foreground">No steps yet.</div>}
    </div>
  );
}

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
  const [createTypeModalOpen, setCreateTypeModalOpen] = useState(false);
  const [builderVariant, setBuilderVariant] = useState<"classic" | "v3">("v3");
  const [builderMode, setBuilderMode] = useState(false);
  const [pages, setPages] = useState<BuilderPage[]>([newPage(1)]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
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
    riskPoints: "",
    notes: "",
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
    employeeReadMode: "Interactive Book",
  });

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);
const kpis = useMemo(() => getSopKpis(sopRows, taskRows), [sopRows, taskRows]);
  const governance = useMemo(() => getSopGovernanceSummary(sopRows, taskRows), [sopRows, taskRows]);
  const controlBoard = useMemo(() => getSopControlBoard(sopRows), [sopRows]);
  const trainingQueue = useMemo(() => getTrainingAcknowledgementQueue(sopRows, taskRows), [sopRows, taskRows]);
  const templateQueue = useMemo(() => getTemplateGeneratorQueue(sopRows), [sopRows]);
  const branchOptions = useMemo(() => branchRows.map((row) => row.title), [branchRows]);

  const requestedSopId = useMemo(() => {
    const sopId = searchParams.get("sopId");
    return sopId && sopRows.some((row) => row.id === sopId) ? sopId : undefined;
  }, [searchParams, sopRows]);

  const selectedSop = sopRows.find((row) => row.id === selectedSopId)
    ?? sopRows.find((row) => row.id === requestedSopId)
    ?? sopRows[0];

  const detail = useMemo(() => getSopDetail(selectedSop), [selectedSop]);
  const nextActions = useMemo(() => getSopNextActions(selectedSop), [selectedSop]);

  function updatePage(pageId: string, patch: Partial<BuilderPage>) {
    setPages((current) => current.map((page) => page.id === pageId ? { ...page, ...patch } : page));
  }

  function updateBlock(pageId: string, blockId: string, patch: Partial<BuilderBlock>) {
    setPages((current) => current.map((page) => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        blocks: page.blocks.map((block) => block.id === blockId ? { ...block, ...patch } : block),
      };
    }));
  }

  function addBlock(pageId: string, type: BlockType) {
    setPages((current) => current.map((page) => (
      page.id === pageId ? { ...page, blocks: [...page.blocks, newBlock(type)] } : page
    )));
  }

  function removeBlock(pageId: string, blockId: string) {
    setPages((current) => current.map((page) => (
      page.id === pageId ? { ...page, blocks: page.blocks.filter((block) => block.id !== blockId) } : page
    )));
  }

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
    const content = serializeContent(form.employeeReadMode, pages);
    const matches = runStoreOperationRules("sop-training", {
      status: "Draft",
      reviewDueDate: form.reviewDueDate,
      acknowledgementRequired: form.acknowledgementRequired === "Yes",
      trainingTaskCount: 0,
      linkedChecklistTemplateIds: "",
      riskPointsCount: form.riskPoints.split(",").filter(Boolean).length,
      failedItemRule: "",
    });
    const nextAction = matches[0]?.result.suggestedAction || "Assign training or create templates";

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
        { label: "Risk Points", value: form.riskPoints },
        { label: "Employee Read Mode", value: form.employeeReadMode },
        { label: "SOP Content JSON", value: JSON.stringify(content) },
      ],
      detailNote: form.notes || "Controlled SOP created with interactive page content.",
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
        { label: "Instruction Mode", value: "Linked SOP" },
        { label: "Linked SOP ID", value: selectedSop.id },
        { label: "Linked SOP", value: selectedSop.title },
        { label: "SOP Content JSON", value: detailValue(selectedSop, "SOP Content JSON") },
        { label: "Photo Required", value: "Not Required" },
        { label: "Photo Proof Status", value: "Not Required" },
        { label: "Manager Review Status", value: "Not Submitted" },
        { label: "Source", value: "SOP & Training" },
        { label: "SLA Status", value: "On Track" },
      ],
      detailNote: `Read and acknowledge ${selectedSop.title} ${detailValue(selectedSop, "Version") || "current version"}.`,
      nextAction: "Acknowledge SOP training",
    });

    let details = selectedSop.detailItems ?? [];
    details = upsertDetail(details, "Assigned Training IDs", [detailValue(selectedSop, "Assigned Training IDs"), created.id].filter(Boolean).join(", "));
    details = upsertDetail(details, "Acknowledgement Status", "Assigned");
    details = upsertDetail(details, "Target Branch", form.targetBranch || detailValue(selectedSop, "Target Branch") || "All Branches");
    details = upsertDetail(details, "Target Role", form.targetRole || detailValue(selectedSop, "Target Role") || "Outlet Manager");
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
    if (dialogMode === "publish") await publishVersion();
    if (dialogMode === "training") await assignTraining();
    if (dialogMode === "checklist") await createChecklistTemplate();
  }


  function startCreateSopFromType(type: SopCreateTypeConfig) {
    setCreateTypeModalOpen(false);

    setForm((current) => ({
      ...current,
      title: current.title || type.title,
      category: categoryOptions.includes(type.category) ? type.category : current.category,
      processArea: processAreaOptions.includes(type.processArea) ? type.processArea : current.processArea,
      targetRole: type.targetRole || current.targetRole,
      acknowledgementRequired: type.acknowledgementRequired,
      trainingRequired: type.trainingRequired,
    }));

    const starterPage = pages[0] || newPage(1);
    if (!pages.length) setPages([starterPage]);

    setSelectedPageId(starterPage.id);
    setBuilderVariant("v3");
    setBuilderMode(true);
  }


  const v3Document = useMemo(() => createSopBuilderV3Document(form, pages), [form, pages]);

  function updateV3Settings(patch: Partial<SopBuilderV3Settings>) {
    setForm((current) => ({
      ...current,
      title: patch.title ?? current.title,
      documentCode: patch.documentCode ?? current.documentCode,
      category: patch.category ?? current.category,
      processArea: patch.processArea ?? current.processArea,
      version: patch.version ?? current.version,
      processOwner: patch.owner ?? current.processOwner,
      approver: patch.approver ?? current.approver,
      targetBranch: patch.targetOutlet ?? current.targetBranch,
      targetRole: patch.targetRole ?? current.targetRole,
      acknowledgementRequired: patch.acknowledgementRequired ?? current.acknowledgementRequired,
      trainingRequired: patch.trainingRequired ?? current.trainingRequired,
      reviewCycle: patch.reviewCycle ?? current.reviewCycle,
      reviewDueDate: patch.reviewDueDate ?? current.reviewDueDate,
    }));
  }

  function addV3Page() {
    const nextPage = { ...newPage(pages.length + 1), title: "New chapter" };
    setPages((current) => [...current, nextPage]);
    setSelectedPageId(nextPage.id);
  }

  function addV3SubPage(parentPageId: string) {
    const siblingCount = pages.filter((page) => page.parentPageId === parentPageId).length;

    const nextPage = {
      ...newPage(pages.length + 1, parentPageId),
      title: `New page ${siblingCount + 1}`,
    };

    setPages((current) => {
      const parentIndex = current.findIndex((page) => page.id === parentPageId);
      const childIndexes = current
        .map((page, index) => ({ page, index }))
        .filter((item) => item.page.parentPageId === parentPageId)
        .map((item) => item.index);

      const insertAt = childIndexes.length
        ? Math.max(...childIndexes) + 1
        : parentIndex + 1;

      const next = [...current];
      next.splice(insertAt, 0, nextPage);
      return next;
    });

    setSelectedPageId(nextPage.id);
  }

  function deleteV3Page(pageId: string) {
    if (pages.length <= 1) return;

    const idsToDelete = new Set([
      pageId,
      ...pages.filter((page) => page.parentPageId === pageId).map((page) => page.id),
    ]);

    const nextPages = pages.filter((page) => !idsToDelete.has(page.id));
    setPages(nextPages);

    if (activeBuilderPageId && idsToDelete.has(activeBuilderPageId)) {
      setSelectedPageId(nextPages[0]?.id);
    }
  }

  function v3BlockTypeToLegacy(type: SopBuilderV3BlockType): BlockType {
    return type === "video" ? "image" : type;
  }

  function v3BlockToLegacyBlock(block: SopBuilderV3Block): BuilderBlock {
    const legacyType = v3BlockTypeToLegacy(block.type);

    return {
      id: block.id,
      type: legacyType,
      title: block.title,
      body: block.body,
      imageUrl: legacyType === "image" ? block.assetUrl || "" : "",
      pdfUrl: legacyType === "pdf" ? block.assetUrl || "" : "",
      stepsText: block.steps ? block.steps.join("\\n") : "",
      checklistText: block.checklist ? block.checklist.join("\\n") : "",
      warningLevel: block.warningLevel ?? "Info",
    };
  }

  function updateV3Page(pageId: string, patch: Partial<SopBuilderV3Page>) {
    setPages((current) =>
      current.map((page) =>
        page.id === pageId
          ? {
              ...page,
              title: patch.title ?? page.title,
              coverImageUrl: patch.coverAssetUrl ?? page.coverImageUrl,
              parentPageId: patch.parentPageId ?? page.parentPageId,
              blocks: patch.blocks ? patch.blocks.map(v3BlockToLegacyBlock) : page.blocks,
            }
          : page,
      ),
    );
  }


  function addV3Block(pageId: string, type: SopBuilderV3BlockType) {
    const legacyType: BlockType = type === "video" ? "image" : type;
    addBlock(pageId, legacyType);
  }

  function updateV3Block(pageId: string, blockId: string, patch: Partial<SopBuilderV3Block>) {
    setPages((current) =>
      current.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) => {
            if (block.id !== blockId) return block;

            return {
              ...block,
              title: patch.title ?? block.title,
              body: patch.body ?? block.body,
              imageUrl: patch.assetUrl ?? block.imageUrl,
              pdfUrl: patch.assetUrl ?? block.pdfUrl,
              stepsText: patch.steps ? patch.steps.join("\n") : block.stepsText,
              checklistText: patch.checklist ? patch.checklist.join("\n") : block.checklistText,
              warningLevel: patch.warningLevel ?? block.warningLevel,
            };
          }),
        };
      }),
    );
  }

  function deleteV3Block(pageId: string, blockId: string) {
    setPages((current) =>
      current.map((page) =>
        page.id === pageId
          ? { ...page, blocks: page.blocks.filter((block) => block.id !== blockId) }
          : page,
      ),
    );
  }

  const createPreview = serializeContent(form.employeeReadMode, pages);

  const activeBuilderPageId = selectedPageId || pages[0]?.id || "";
  const activeBuilderPageIndex = Math.max(0, pages.findIndex((page) => page.id === activeBuilderPageId));
  const activeBuilderPageLabel = activeBuilderPageId ? `Adding to Page ${activeBuilderPageIndex + 1}` : "Select a page";

  if (builderMode) {
    return (
      <ErpShell>
        {builderVariant === "v3" ? (
          <SopBuilderWorkspaceV3
            document={v3Document}
            selectedPageId={activeBuilderPageId}
            onBack={() => setBuilderMode(false)}
            onCreate={async () => {
              await createSop();
              setBuilderMode(false);
            }}
            onSelectPage={setSelectedPageId}
            onAddPage={addV3Page}
            onAddSubPage={addV3SubPage}
            onDeletePage={deleteV3Page}
            onUpdatePage={updateV3Page}
            onAddBlock={addV3Block}
            onUpdateBlock={updateV3Block}
            onDeleteBlock={deleteV3Block}
            onUpdateSettings={updateV3Settings}
          />
        ) : (
        <div className="flex h-[calc(100vh-56px)] min-h-0 flex-col overflow-hidden bg-background">
          <div className="shrink-0 border-b bg-background px-5 py-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">SOP & Training</div>
                <h1 className="text-2xl font-semibold tracking-tight">Create SOP</h1>
                <p className="text-sm text-muted-foreground">Build a controlled SOP with setup, document content, employee preview, and publish readiness.</p>
                <div className="mt-4 grid gap-2 md:grid-cols-5">
                  {[
                    ["1", "Type", "Selected before builder"],
                    ["2", "Setup", "Owner, outlet, role"],
                    ["3", "Write", "Pages and content"],
                    ["4", "Preview", "Employee reading mode"],
                    ["5", "Publish", "Review and assign"],
                  ].map(([step, title, desc]) => (
                    <div key={step} className="rounded-xl border bg-card px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{step}</span>
                        <span className="text-sm font-medium">{title}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setBuilderVariant("v3")}>Use V3 Builder</Button>
                <Button variant="outline" onClick={() => setBuilderMode(false)}>Back</Button>
                <Button onClick={async () => {
                  await createSop();
                  setBuilderMode(false);
                }}>Create SOP</Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/10 px-3 py-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-semibold">Write SOP</div>
                  <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">{activeBuilderPageLabel}</span>
                </div>
                <div className="text-xs text-muted-foreground">Build the SOP page content. Add only the blocks staff need to read.</div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="h-8" onClick={() => {
                  const nextPage = newPage(pages.length + 1);
                  setPages((current) => [...current, nextPage]);
                  setSelectedPageId(nextPage.id);
                }}><Plus className="h-4 w-4" />Add Page</Button>

                <details className="relative">
                  <summary className="inline-flex h-8 cursor-pointer list-none items-center rounded-md border bg-background px-3 text-sm font-medium hover:bg-muted/30 [&::-webkit-details-marker]:hidden">
                    Add Content
                  </summary>
                  <div className="absolute right-0 top-9 z-40 w-56 rounded-xl border bg-popover p-2 shadow-xl">
                    {activeBuilderPageId ? (
                      (["heading", "text", "image", "step-list", "warning", "pdf", "checklist"] as BlockType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => addBlock(activeBuilderPageId, type)}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                        >
                          {type}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Select or add a page first.</div>
                    )}
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="space-y-3 overflow-y-auto border-r bg-muted/20 p-5">
              <div>
                <div className="text-sm font-semibold">SOP Setup</div>
                <div className="text-xs text-muted-foreground">Define owner, outlet, role, version, and governance before building pages.</div>
              </div>
              <div className="space-y-1.5"><Label>SOP Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Document Code</Label><Input value={form.documentCode} onChange={(e) => setForm((p) => ({ ...p, documentCode: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Version</Label><Input value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} /></div>
              </div>
              <div className="space-y-1.5"><Label>Category</Label><Select value={form.category} onValueChange={(value) => setForm((p) => ({ ...p, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categoryOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Process Area</Label><Select value={form.processArea} onValueChange={(value) => setForm((p) => ({ ...p, processArea: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{processAreaOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Employee Read Mode</Label><Select value={form.employeeReadMode} onValueChange={(value) => setForm((p) => ({ ...p, employeeReadMode: value as SopForm["employeeReadMode"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Interactive Book", "Checklist View", "PDF View", "Mixed"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Owner</Label><Input value={form.processOwner} onChange={(e) => setForm((p) => ({ ...p, processOwner: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Approver</Label><Input value={form.approver} onChange={(e) => setForm((p) => ({ ...p, approver: e.target.value }))} /></div>
              </div>
              <div className="space-y-1.5"><Label>Target Outlet</Label><Select value={form.targetBranch || undefined} onValueChange={(value) => setForm((p) => ({ ...p, targetBranch: value }))}><SelectTrigger><SelectValue placeholder="Select outlet" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Target Role</Label><Input value={form.targetRole} onChange={(e) => setForm((p) => ({ ...p, targetRole: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Acknowledgement Required</Label><Select value={form.acknowledgementRequired} onValueChange={(value) => setForm((p) => ({ ...p, acknowledgementRequired: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Yes", "No"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Effective Date</Label><Input type="date" value={form.effectiveDate} onChange={(e) => setForm((p) => ({ ...p, effectiveDate: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Review Due</Label><Input type="date" value={form.reviewDueDate} onChange={(e) => setForm((p) => ({ ...p, reviewDueDate: e.target.value }))} /></div>
              </div>
              <div className="space-y-1.5"><Label>Review Cycle</Label><Select value={form.reviewCycle} onValueChange={(value) => setForm((p) => ({ ...p, reviewCycle: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{reviewCycleOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Risk Points, comma separated</Label><Textarea rows={3} value={form.riskPoints} onChange={(e) => setForm((p) => ({ ...p, riskPoints: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></div>
            </div>

            <div className="grid min-h-0 gap-0 xl:grid-cols-[minmax(0,1fr)_460px]">
              <div className="min-h-0 space-y-4 overflow-y-auto p-5">
                <div className="space-y-4">
                  {pages.map((page, pageIndex) => (
                    <Card
                      key={page.id}
                      onClick={() => setSelectedPageId(page.id)}
                      className={cn("transition-colors", activeBuilderPageId === page.id ? "border-primary/50 bg-primary/[0.03]" : "border-border")}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">Page {pageIndex + 1}</CardTitle>
                            {activeBuilderPageId === page.id ? <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">Selected</span> : null}
                          </div>
                          <Button variant="ghost" size="sm" onClick={(event) => {
                            event.stopPropagation();
                            setPages((current) => {
                              const next = current.filter((item) => item.id !== page.id);
                              if (activeBuilderPageId === page.id) setSelectedPageId(next[0]?.id || "");
                              return next;
                            });
                          }} disabled={pages.length === 1}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1.5"><Label>Page Title</Label><Input value={page.title} onChange={(e) => updatePage(page.id, { title: e.target.value })} /></div>
                        <div className="space-y-1.5">
                          <Label>Cover Media</Label>
                          <Input type="file" accept="image/*,video/*" onChange={async (e) => {
                            const asset = await uploadLocalPreviewAsset(e.target.files?.[0], "sop");
                            updatePage(page.id, { coverImageUrl: serializeUploadAsset(asset) });
                          }} />
                          {page.coverImageUrl ? <div className="text-xs text-muted-foreground">Selected: {uploadAssetLabel(page.coverImageUrl)}</div> : null}
                        </div>

                        <div className="space-y-3">
                          {page.blocks.map((block) => (
                            <div key={block.id} className="rounded-xl border bg-background p-4">
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <Select value={block.type} onValueChange={(value) => updateBlock(page.id, block.id, { type: value as BlockType })}>
                                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                  <SelectContent>{(["heading", "text", "image", "step-list", "warning", "pdf", "checklist"] as BlockType[]).map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button variant="ghost" size="sm" onClick={() => removeBlock(page.id, block.id)}><Trash2 className="h-4 w-4" /></Button>
                              </div>

                              <div className="grid gap-3">
                                <div className="space-y-1.5"><Label>Block Title</Label><Input value={block.title} onChange={(e) => updateBlock(page.id, block.id, { title: e.target.value })} /></div>

                                {["heading", "text", "warning"].includes(block.type) ? (
                                  <div className="space-y-1.5"><Label>Content</Label><Textarea rows={3} value={block.body} onChange={(e) => updateBlock(page.id, block.id, { body: e.target.value })} /></div>
                                ) : null}

                                {block.type === "image" ? (
                                  <div className="space-y-1.5">
                                    <Label>Image / Video Upload</Label>
                                    <Input type="file" accept="image/*,video/*" onChange={async (e) => {
                                      const asset = await uploadLocalPreviewAsset(e.target.files?.[0], "sop");
                                      updateBlock(page.id, block.id, { imageUrl: serializeUploadAsset(asset) });
                                    }} />
                                    {block.imageUrl ? <div className="text-xs text-muted-foreground">Selected: {uploadAssetLabel(block.imageUrl)}</div> : null}
                                  </div>
                                ) : null}

                                {block.type === "pdf" ? (
                                  <div className="space-y-1.5">
                                    <Label>PDF Upload</Label>
                                    <Input type="file" accept="application/pdf" onChange={async (e) => {
                                      const asset = await uploadLocalPreviewAsset(e.target.files?.[0], "sop");
                                      updateBlock(page.id, block.id, { pdfUrl: serializeUploadAsset(asset) });
                                    }} />
                                    {block.pdfUrl ? <div className="text-xs text-muted-foreground">Selected: {uploadAssetLabel(block.pdfUrl)}</div> : null}
                                  </div>
                                ) : null}

                                {block.type === "step-list" ? (
                                  <div className="space-y-1.5"><Label>Steps, one instruction per line</Label><Textarea rows={7} value={block.stepsText} onChange={(e) => updateBlock(page.id, block.id, { stepsText: e.target.value })} placeholder={"Wash hands\nPrepare equipment\nTake photo proof"} /></div>
                                ) : null}

                                {block.type === "checklist" ? (
                                  <div className="space-y-1.5"><Label>Checklist Items, one per line</Label><Textarea rows={6} value={block.checklistText} onChange={(e) => updateBlock(page.id, block.id, { checklistText: e.target.value })} /></div>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto border-l bg-muted/10 p-5">
                <div className="sticky top-0 mx-auto max-w-[360px]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Live Employee Preview</div>
                      <div className="text-xs text-muted-foreground">Phone reading mode</div>
                    </div>
                    <Badge variant="outline">{createPreview.pages.length} Pages</Badge>
                  </div>

                  <div className="rounded-[2rem] border bg-background p-3 shadow-sm">
                    <div className="mb-3 flex items-center justify-center">
                      <div className="h-1.5 w-16 rounded-full bg-muted" />
                    </div>
                    <div className="max-h-[calc(100vh-250px)] space-y-3 overflow-y-auto rounded-[1.5rem] border bg-muted/10 p-3">
                      {createPreview.pages.map((page) => (
                        <div key={page.id} className="rounded-2xl border bg-background p-3">
                          <div className="text-xs font-medium uppercase text-muted-foreground">Page {page.pageNo}</div>
                          <div className="font-semibold">{page.title}</div>
                          {page.coverImageUrl ? <UploadAssetPreview value={page.coverImageUrl} label="Cover Media" compact /> : null}
                          <div className="mt-3 space-y-3">
                            {page.blocks.map((block) => <div key={block.id}>{renderBlock(block)}</div>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </ErpShell>
    );
  }

  return (
    <ErpShell>
      <SopCreateTypeModal
        open={createTypeModalOpen}
        onClose={() => setCreateTypeModalOpen(false)}
        onSelect={startCreateSopFromType}
      />


      <div className="space-y-6 p-4 pb-24 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Store Operations</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">SOP & Training</h1>
              <p className="text-muted-foreground">Build page-by-page SOPs, assign training to outlets, and generate execution templates.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setCreateTypeModalOpen(true)}><Plus className="h-4 w-4" />Create SOP</Button>
            <Button variant="outline" onClick={() => openModal("publish")} disabled={!selectedSop}><ScrollText className="h-4 w-4" />Publish Version</Button>
            <Button variant="outline" onClick={() => openModal("training")} disabled={!selectedSop}><GraduationCap className="h-4 w-4" />Assign Training</Button>
            <Button variant="outline" onClick={() => openModal("checklist")} disabled={!selectedSop}><ClipboardList className="h-4 w-4" />Create Templates</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="px-3 pb-1 pt-3"><CardTitle className="text-[11px] font-medium text-muted-foreground md:text-xs">{kpi.label}</CardTitle></CardHeader>
              <CardContent className="px-3 pb-3 pt-0"><div className="text-xl font-semibold md:text-2xl">{kpi.value}</div></CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_460px]">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>SOP Control Board</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {controlBoard.map((section) => (
                  <div key={section.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{section.status}</div>
                      <Badge variant={getSopLifecycleTone(section.status)}>{section.items.length}</Badge>
                    </div>
                    {!section.items.length ? (
                      <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">No {section.status.toLowerCase()} SOP.</div>
                    ) : section.items.map((row) => (
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
                {!templateQueue.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Create or approve an SOP before generating checklist, inspection, or task templates.</div> : templateQueue.map((item) => (
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
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Select or create a controlled SOP to review version, training, and linked templates.</div>
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
                        ["Target Role", detail.targetRole],
                        ["Target Outlet", detail.targetBranch],
                        ["Acknowledgement", detail.acknowledgementStatus],
                      ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getSopLifecycleTone(selectedSop?.status || "Draft")}>{selectedSop?.status || "Draft"}</Badge>
                      <Badge variant={getAcknowledgementStatusTone(detail.acknowledgementStatus)}>{detail.acknowledgementStatus}</Badge>
                      <Badge variant="outline">Risk {governance.governanceRisk}%</Badge>
                      <Badge variant="outline">{detail.content.mode}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Employee Reading Preview</div>
                        <Badge variant="outline">{detail.content.pages.length} Pages</Badge>
                      </div>
                      {!detail.content.pages.length ? (
                        <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No pages yet. Use Create SOP to build employee reading content with pages, images, steps, PDF, and checklist blocks.</div>
                      ) : detail.content.pages.map((page: SopPreviewPage) => (
                        <div key={page.id} className="rounded-xl border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-medium uppercase text-muted-foreground">Page {page.pageNo}</div>
                              <div className="font-semibold">{page.title}</div>
                            </div>
                            <Badge variant="secondary">{page.blocks.length} Blocks</Badge>
                          </div>
                          {page.coverImageUrl ? <UploadAssetPreview value={page.coverImageUrl} label="Cover Media" compact /> : null}
                          <div className="mt-3 space-y-3">
                            {page.blocks.map((block) => <div key={block.id}>{renderBlock(block)}</div>)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Risk Points</div>
                      {!detail.riskPoints.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No risk points captured.</div> : detail.riskPoints.map((item) => <div key={item} className="rounded-lg border px-3 py-2 text-sm">{item}</div>)}
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
                      {nextActions.length ? nextActions.map((item) => <div key={item} className="rounded-lg border px-3 py-2 text-sm">{item}</div>) : <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">This SOP has no pending action.</div>}
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
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "publish" ? "Publish Version" : dialogMode === "training" ? "Assign Training" : "Create Templates"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "publish"
                ? "Publish a new SOP version and supersede the previous release."
                : dialogMode === "training"
                  ? "Assign acknowledgement training to outlet and role targets."
                  : "Generate checklist, inspection, and task templates from this SOP."}
            </DialogDescription>
          </DialogHeader>

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
              <div className="space-y-1.5"><Label>Target Outlet</Label><Select value={form.targetBranch || undefined} onValueChange={(value) => setForm((p) => ({ ...p, targetBranch: value }))}><SelectTrigger><SelectValue placeholder="Select outlet" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{dialogMode === "publish" ? "Publish Version" : dialogMode === "training" ? "Assign Training" : "Create Templates"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
