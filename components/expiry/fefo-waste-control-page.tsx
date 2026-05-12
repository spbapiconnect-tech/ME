"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Camera, ClipboardCheck, PackagePlus, ShieldAlert, Target, Trash2 } from "lucide-react";
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
import { productExpiryMaster } from "@/lib/master-data/product-expiry";
import { runStoreOperationRules } from "@/lib/rules/rule-runner";
import {
  getBatchDetail,
  getBatchRiskBoard,
  getBranchExpiryRiskSummary,
  getExpiryReviewQueue,
  getFefoNextActions,
  getFefoPriorityTone,
  getFefoStatusTone,
  getFefoWasteKpis,
  getUseFirstQueue,
  getWasteDisposalQueue,
  getWasteReasonSummary,
} from "@/lib/store-operations/fefo-waste-workspace";
import {
  createDisposalTaskFromFefoRecord,
  createIncidentFromExpiredWasteRecord,
  createTransferTaskFromFefoRecord,
  createUseFirstTaskFromFefoRecord,
} from "@/lib/store-operations/store-operation-links";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";

function upsertDetail(items: Array<{ label: string; value: string }> | undefined, label: string, value: string) {
  const next = [...(items ?? [])];
  const index = next.findIndex((item) => item.label === label);
  if (index >= 0) next[index] = { label, value };
  else next.push({ label, value });
  return next;
}

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

type ModalMode = "register" | "daily-check" | "action" | "disposal";

type FefoForm = {
  branch: string;
  product: string;
  batchNo: string;
  lotNo: string;
  supplier: string;
  receivingRef: string;
  storageLocation: string;
  quantity: string;
  unit: string;
  receivedDate: string;
  expiryDate: string;
  notes: string;
  checkedBy: string;
  checkDate: string;
  itemsChecked: string;
  expiringItems: string;
  missingLabel: string;
  actionRequired: string;
  actionType: string;
  dueTime: string;
  completionStandard: string;
  photoProofRequired: string;
  assignedRole: string;
  managerNote: string;
  disposedQuantity: string;
  wasteReason: string;
  wasteCost: string;
};

const actionTypes = ["Use First", "Transfer", "Hold", "Dispose", "Report Incident", "No Action"];
const roleTargets = ["Outlet Manager", "Kitchen", "Store Supervisor", "Operations Manager"];
const wasteReasons = Array.from(productExpiryMaster.wasteReason).length ? Array.from(productExpiryMaster.wasteReason) : ["Expired", "Damaged", "Unknown Batch", "Label Missing", "Quality Issue"];

export function FefoWasteControlPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const syncStatus = useMeRuntimeStore((state) => state.syncStatus);
  const syncMessage = useMeRuntimeStore((state) => state.lastSyncMessage);

  const fefoRows = getRows("expiry", []);
  const branchRows = getRows("branches", []);

  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ModalMode>("register");
  const [form, setForm] = useState<FefoForm>({
    branch: "",
    product: "",
    batchNo: "",
    lotNo: "",
    supplier: "",
    receivingRef: "",
    storageLocation: "",
    quantity: "0",
    unit: "pcs",
    receivedDate: new Date().toISOString().slice(0, 10),
    expiryDate: new Date().toISOString().slice(0, 10),
    notes: "",
    checkedBy: "",
    checkDate: new Date().toISOString().slice(0, 16),
    itemsChecked: "",
    expiringItems: "",
    missingLabel: "No",
    actionRequired: "Yes",
    actionType: "Use First",
    dueTime: new Date().toISOString().slice(0, 16),
    completionStandard: "Use or confirm stock rotation before expiry.",
    photoProofRequired: "Required",
    assignedRole: "Outlet Manager",
    managerNote: "",
    disposedQuantity: "0",
    wasteReason: wasteReasons[0],
    wasteCost: "0",
  });

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const kpis = useMemo(() => getFefoWasteKpis(fefoRows), [fefoRows]);
  const riskBoard = useMemo(() => getBatchRiskBoard(fefoRows), [fefoRows]);
  const useFirstQueue = useMemo(() => getUseFirstQueue(fefoRows), [fefoRows]);
  const wasteQueue = useMemo(() => getWasteDisposalQueue(fefoRows), [fefoRows]);
  const reviewQueue = useMemo(() => getExpiryReviewQueue(fefoRows), [fefoRows]);
  const branchRisk = useMemo(() => getBranchExpiryRiskSummary(fefoRows), [fefoRows]);
  const wasteReasonSummary = useMemo(() => getWasteReasonSummary(fefoRows), [fefoRows]);
  const requestedBatchId = useMemo(() => {
    const fefoId = searchParams.get("fefoId");
    if (fefoId && fefoRows.some((row) => row.id === fefoId)) return fefoId;
    const taskId = searchParams.get("taskId");
    if (taskId) {
      const linked = fefoRows.find((row) => detailValue(row, "Linked Outlet Execution ID") === taskId);
      if (linked) return linked.id;
    }
    const branchId = searchParams.get("branchId");
    if (branchId) {
      const branch = branchRows.find((row) => row.id === branchId)?.title;
      const linked = branch ? fefoRows.find((row) => detailValue(row, "Branch") === branch) : undefined;
      if (linked) return linked.id;
    }
    return undefined;
  }, [searchParams, fefoRows, branchRows]);
  const selectedBatch = fefoRows.find((row) => row.id === selectedBatchId)
    ?? fefoRows.find((row) => row.id === requestedBatchId)
    ?? useFirstQueue[0]?.row
    ?? wasteQueue[0]?.row
    ?? fefoRows[0];
  const detail = useMemo(() => getBatchDetail(selectedBatch), [selectedBatch]);
  const nextActions = useMemo(() => getFefoNextActions(selectedBatch), [selectedBatch]);
  const branchOptions = useMemo(() => branchRows.map((row) => row.title), [branchRows]);

  function openModal(mode: ModalMode) {
    setDialogMode(mode);
    setDialogOpen(true);
  }

  async function registerBatch() {
    if (!form.branch || !form.product || !form.expiryDate) return;
    const expiryMs = new Date(form.expiryDate).getTime();
    const remainingDays = Math.max(0, Math.ceil((expiryMs - Date.now()) / (24 * 60 * 60 * 1000)));
    const matches = runStoreOperationRules("fefo-waste-control", {
      remainingDays,
      status: "Fresh",
      photoProofRequired: form.photoProofRequired === "Required",
      photoUrls: "",
      wasteReason: form.wasteReason,
      disposedQuantity: Number(form.disposedQuantity),
      wasteCost: Number(form.wasteCost),
    });
    const nextStatus = matches.find((item) => item.result.nextStatus)?.result.nextStatus || (remainingDays <= 7 ? "Use First" : remainingDays <= 3 ? "Expiring Soon" : "Fresh");
    const priority = matches.find((item) => item.result.metadata?.fefoPriority)?.result.metadata?.fefoPriority || (remainingDays <= 1 ? "Critical" : remainingDays <= 3 ? "High" : remainingDays <= 7 ? "Medium" : "Low");
    const photoProofStatus = matches.find((item) => item.result.metadata?.photoProofStatus)?.result.metadata?.photoProofStatus || (form.photoProofRequired === "Required" ? "Missing" : "Not Required");
    const created = await createRecordWithPayload("expiry", {
      title: form.product,
      subtitle: `${form.branch} · ${form.storageLocation}`,
      status: nextStatus,
      owner: form.checkedBy || "FEFO Control",
      detailItems: [
        { label: "Branch", value: form.branch },
        { label: "Product Name", value: form.product },
        { label: "Batch No.", value: form.batchNo },
        { label: "Lot No.", value: form.lotNo },
        { label: "Supplier", value: form.supplier },
        { label: "Receiving Ref", value: form.receivingRef },
        { label: "Storage Location", value: form.storageLocation },
        { label: "Quantity", value: form.quantity },
        { label: "Unit", value: form.unit },
        { label: "Received Date", value: form.receivedDate },
        { label: "Expiry Date", value: form.expiryDate },
        { label: "Remaining Days", value: String(remainingDays) },
        { label: "FEFO Priority", value: priority },
        { label: "Action Type", value: form.actionType },
        { label: "Checked By", value: form.checkedBy },
        { label: "Checked At", value: form.checkDate },
        { label: "Disposed Quantity", value: form.disposedQuantity },
        { label: "Waste Reason", value: form.wasteReason },
        { label: "Waste Cost", value: form.wasteCost },
        { label: "Photo Proof Required", value: form.photoProofRequired },
        { label: "Photo Proof Status", value: photoProofStatus },
        { label: "Photo Proofs", value: "" },
        { label: "Linked Outlet Execution ID", value: "" },
        { label: "Linked Outlet Execution", value: "" },
        { label: "Linked Incident ID", value: "" },
        { label: "Linked Incident", value: "" },
        { label: "Manager Review Status", value: "Not Submitted" },
      ],
      detailNote: form.notes || "Batch registered for FEFO tracking and expiry control.",
      nextAction: nextStatus === "Use First" ? "Create FEFO action" : "Run daily expiry check",
    });
    setSelectedBatchId(created.id);
    setDialogOpen(false);
    await logAction("expiry", "register-batch", `Registered FEFO batch ${created.title}`);
  }

  async function createFefoTask(action: "Use First" | "Transfer" | "Dispose", row = selectedBatch) {
    if (!row) return;
    const detail = getBatchDetail(row);
    if (!detail) return;
    const seed = action === "Use First"
      ? createUseFirstTaskFromFefoRecord(row, { dueAt: new Date().toISOString().slice(0, 16) })
      : action === "Transfer"
        ? createTransferTaskFromFefoRecord(row, { dueAt: new Date().toISOString().slice(0, 16) })
        : createDisposalTaskFromFefoRecord(row, { dueAt: new Date().toISOString().slice(0, 16) });
    const created = await createRecordWithPayload("tasks", {
      title: seed.title,
      subtitle: `${detail.branch} · FEFO Action`,
      status: "Scheduled",
      owner: form.assignedRole || "Outlet Manager",
      detailItems: [
        { label: "Branch", value: detail.branch },
        { label: "Task Type", value: "FEFO Action" },
        { label: "Role Target", value: form.assignedRole || "Outlet Manager" },
        { label: "Outlets", value: detail.branch },
        { label: "Completed Outlets", value: "" },
        { label: "Due Date", value: (seed.dueAt || "").slice(0, 10) },
        { label: "Due Time", value: (seed.dueAt || "").slice(11, 16) },
        { label: "Due At", value: seed.dueAt || "" },
        { label: "Repeat Rule", value: "Once" },
        { label: "Completion Standard", value: seed.completionStandard },
        { label: "Photo Required", value: seed.photoProofRequired ? "Required" : "Not Required" },
        { label: "Photo Proof Status", value: seed.photoProofRequired ? "Missing" : "Not Required" },
        { label: "Photo Proofs", value: "" },
        { label: "Manager Review Status", value: "Not Submitted" },
        { label: "Source", value: "FEFO / Waste Control" },
        { label: "Linked FEFO / Waste ID", value: row.id },
        { label: "Linked FEFO / Waste", value: row.title },
        { label: "SLA Status", value: "On Track" },
      ],
      detailNote: form.managerNote || seed.completionStandard,
      nextAction: action === "Dispose" ? "Upload disposal proof" : "Complete FEFO action",
    });

    let nextDetails = row.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Linked Outlet Execution ID", created.id);
    nextDetails = upsertDetail(nextDetails, "Linked Outlet Execution", created.title);
    nextDetails = upsertDetail(nextDetails, "Action Type", action);
    nextDetails = upsertDetail(nextDetails, "Photo Proof Status", seed.photoProofRequired ? "Missing" : "Not Required");
    await updateRecord("expiry", row.id, { status: action === "Dispose" ? "Expired" : action === "Transfer" ? "Hold" : "Use First", detailItems: nextDetails, nextAction: "Review FEFO task proof" });
    await logAction("expiry", "create-fefo-task", `Created ${action} task ${created.title} from ${row.title}`);
  }

  async function recordDisposal() {
    if (!selectedBatch) return;
    let nextDetails = selectedBatch.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Disposed Quantity", form.disposedQuantity);
    nextDetails = upsertDetail(nextDetails, "Waste Reason", form.wasteReason);
    nextDetails = upsertDetail(nextDetails, "Waste Cost", form.wasteCost);
    nextDetails = upsertDetail(nextDetails, "Photo Proof Status", "Submitted");
    nextDetails = upsertDetail(nextDetails, "Manager Review Status", "Pending Review");
    await updateRecord("expiry", selectedBatch.id, { status: "Disposed", detailItems: nextDetails, nextAction: "Manager review disposal proof" });
    setDialogOpen(false);
    await logAction("expiry", "record-disposal", `Recorded disposal for ${selectedBatch.title}`);
  }

  async function createWasteIncident(row = selectedBatch) {
    if (!row) return;
    const seed = createIncidentFromExpiredWasteRecord(row);
    const detail = getBatchDetail(row);
    const created = await createRecordWithPayload("issues", {
      title: seed.title,
      subtitle: `${detail?.branch || "Branch"} · FEFO / Waste`,
      status: "New",
      owner: "Incident Center",
      detailItems: [
        { label: "Branch", value: detail?.branch || "" },
        { label: "Source", value: "fefo-waste" },
        { label: "Severity", value: seed.severity },
        { label: "Category", value: "Expiry / Waste" },
        { label: "Impact Area", value: "Food Safety" },
        { label: "Immediate Containment", value: "Hold item and stop usage." },
        { label: "Linked FEFO / Waste ID", value: row.id },
        { label: "Linked FEFO / Waste", value: row.title },
      ],
      detailNote: "Expired or serious waste record raised to incident center.",
      nextAction: "Create corrective action",
    });
    let nextDetails = row.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Linked Incident ID", created.id);
    nextDetails = upsertDetail(nextDetails, "Linked Incident", created.title);
    await updateRecord("expiry", row.id, { detailItems: nextDetails, nextAction: "Review linked incident" });
    await logAction("expiry", "create-waste-incident", `Created waste incident ${created.title}`);
  }

  const boardSections = [
    { key: "critical", label: "Critical", items: riskBoard.critical },
    { key: "useFirst", label: "Use First", items: riskBoard.useFirst },
    { key: "expiringSoon", label: "Expiring Soon", items: riskBoard.expiringSoon },
    { key: "fresh", label: "Fresh", items: riskBoard.fresh },
    { key: "hold", label: "Hold", items: riskBoard.hold },
    { key: "expired", label: "Expired", items: riskBoard.expired },
  ];

  return (
    <ErpShell>
      <div className="space-y-5 pb-24 md:pb-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">FEFO / Waste Control</h1>
            <p className="text-sm text-muted-foreground">Control expiring batches, use-first actions, disposal proof, and waste reasons across branches.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openModal("daily-check")}><ClipboardCheck className="h-4 w-4" />Daily Expiry Check</Button>
            <Button variant="outline" onClick={() => openModal("action")}><Target className="h-4 w-4" />Create FEFO Action</Button>
            <Button variant="outline" onClick={() => openModal("disposal")}><Trash2 className="h-4 w-4" />Record Disposal</Button>
            <Button onClick={() => openModal("register")}><PackagePlus className="h-4 w-4" />Register Batch</Button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="pb-1"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-semibold">{kpi.value}</p></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_420px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batch Risk Board</CardTitle>
              <p className="text-sm text-muted-foreground">Group batches by FEFO priority and expiry state.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {!fefoRows.length ? <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Register received batches to start FEFO tracking and expiry control.</div> : null}
              {boardSections.map((section) => (
                <div key={section.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium"><span>{section.label}</span><Badge variant="outline">{section.items.length}</Badge></div>
                  {!section.items.length ? <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">No batches in {section.label.toLowerCase()}.</div> : null}
                  {section.items.slice(0, 3).map((item) => (
                    <button key={item.row.id} type="button" onClick={() => setSelectedBatchId(item.row.id)} className={cn("w-full rounded-lg border p-3 text-left transition hover:border-primary", selectedBatchId === item.row.id && "border-primary bg-primary/5")}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.branch} · {item.batchNo || item.lotNo}</p>
                        </div>
                        <Badge variant={getFefoPriorityTone(item.fefoPriority)}>{item.fefoPriority}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Use First Queue</CardTitle>
                <p className="text-sm text-muted-foreground">Batches that should be rotated first or pushed to outlet execution.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {!useFirstQueue.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No batches require use-first action right now.</div> : null}
                {useFirstQueue.map((item) => (
                  <div key={item.row.id} className={cn("rounded-lg border p-3", selectedBatchId === item.row.id && "border-primary bg-primary/5")}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">{item.branch} · {item.storageLocation}</p>
                      </div>
                      <Badge variant={getFefoStatusTone(item.status)}>{item.status}</Badge>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>Remaining Days</span><span>{item.remainingDays}</span></div>
                      <div className="flex justify-between"><span>Qty</span><span>{item.quantity} {item.unit}</span></div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => createFefoTask("Use First", item.row)}>Create Use First Task</Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBatchId(item.row.id)}>Select</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Waste / Disposal Review</CardTitle>
                <p className="text-sm text-muted-foreground">Expired, disposed, hold, and waste records waiting for review.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {!wasteQueue.length ? <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No disposal or waste record is waiting for manager review.</div> : null}
                {wasteQueue.map((item) => (
                  <div key={item.row.id} className={cn("rounded-lg border p-3", selectedBatchId === item.row.id && "border-primary bg-primary/5")}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">{item.branch} · {item.batchNo || item.lotNo}</p>
                      </div>
                      <Badge variant={getFefoStatusTone(item.status)}>{item.status}</Badge>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>Disposed Qty</span><span>{item.disposedQuantity}</span></div>
                      <div className="flex justify-between"><span>Waste Reason</span><span>{item.wasteReason || "Missing"}</span></div>
                      <div className="flex justify-between"><span>Proof</span><span>{item.photoProofStatus}</span></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batch Detail</CardTitle>
              <p className="text-sm text-muted-foreground">Selected batch, FEFO priority, linked task, proof, waste reason, and next action.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!detail ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Register a batch or select one to review FEFO control details.</div>
              ) : (
                <>
                  <div>
                    <p className="font-medium">{detail.productName}</p>
                    <p className="text-sm text-muted-foreground">{detail.branch} · {detail.batchNo || detail.lotNo}</p>
                  </div>
                  <div className="grid gap-2 text-sm">
                    {[
                      ["Supplier", detail.supplier || "Not set"],
                      ["Receiving Ref", detail.receivingRef || "Not set"],
                      ["Storage", detail.storageLocation || "Not set"],
                      ["Quantity", `${detail.quantity} ${detail.unit}`],
                      ["Expiry Date", detail.expiryDate || "Not set"],
                      ["Remaining Days", String(detail.remainingDays)],
                      ["FEFO Priority", detail.fefoPriority],
                      ["Status", detail.status],
                      ["Linked Task", detail.linkedOutletExecution || "Not linked"],
                      ["Linked Incident", detail.linkedIncident || "Not linked"],
                      ["Proof", detail.photoProofStatus],
                      ["Waste Reason", detail.wasteReason || "Not recorded"],
                    ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detail.linkedOutletExecutionId ? <Button variant="outline" size="sm" onClick={() => router.push(`/tasks?taskId=${detail.linkedOutletExecutionId}`)}>Open Task</Button> : null}
                    {detail.linkedIncidentId ? <Button variant="outline" size="sm" onClick={() => router.push(`/issues?incidentId=${detail.linkedIncidentId}`)}>Open Incident</Button> : null}
                    {detail.branch ? <Button variant="outline" size="sm" onClick={() => {
                      const branchId = branchRows.find((row) => row.title === detail.branch)?.id;
                      router.push(branchId ? `/branches?branchId=${branchId}` : "/branches");
                    }}>Open Branch</Button> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getFefoPriorityTone(detail.fefoPriority)}>{detail.fefoPriority}</Badge>
                    <Badge variant={getFefoStatusTone(detail.status)}>{detail.status}</Badge>
                    <Badge variant={getFefoStatusTone(detail.photoProofStatus)}>{detail.photoProofStatus}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Next Actions</p>
                    {nextActions.map((action) => <div key={action} className="rounded-lg border px-3 py-2 text-sm">{action}</div>)}
                  </div>
                  <div className="grid gap-2">
                    <Button variant="outline" onClick={() => createFefoTask("Use First", detail.row)}><Target className="h-4 w-4" />Create Use First Task</Button>
                    <Button variant="outline" onClick={() => createFefoTask("Transfer", detail.row)}><ArrowRightLeft className="h-4 w-4" />Create Transfer Task</Button>
                    <Button variant="outline" onClick={() => createFefoTask("Dispose", detail.row)}><Trash2 className="h-4 w-4" />Create Disposal Task</Button>
                    <Button variant="outline" onClick={() => openModal("disposal")}><Camera className="h-4 w-4" />Record Disposal</Button>
                    <Button onClick={() => createWasteIncident(detail.row)}><ShieldAlert className="h-4 w-4" />Report Incident</Button>
                  </div>
                </>
              )}
              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                {branchRisk.slice(0, 3).map((item) => `${item.branch}: ${item.riskScore}%`).join(" · ") || "No branch expiry risk yet."}
              </div>
              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                {wasteReasonSummary.slice(0, 3).map((item) => `${item.reason}: ${item.count}`).join(" · ") || "No waste reasons recorded yet."}
              </div>
              <p className="text-xs text-muted-foreground">Pending FEFO review queue: {reviewQueue.length} · Sync: {syncStatus} · {syncMessage}</p>
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[860px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "register" ? "Register Batch" : dialogMode === "daily-check" ? "Daily Expiry Check" : dialogMode === "action" ? "Create FEFO Action" : "Record Disposal"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "register"
                ? "Register received batches to start FEFO tracking and expiry control."
                : dialogMode === "daily-check"
                  ? "Capture branch-level expiry checks, storage review, and missing labels."
                  : dialogMode === "action"
                    ? "Create a use-first, transfer, hold, or disposal action for this batch."
                    : "Record disposed quantity, waste reason, proof, and manager review requirement."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {dialogMode === "register" ? (
              <>
                <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
                  <div className="space-y-1.5"><Label>Branch</Label><Select value={form.branch || undefined} onValueChange={(value) => setForm((current) => ({ ...current, branch: value }))}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-1.5"><Label>Product</Label><Input value={form.product} onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Batch No.</Label><Input value={form.batchNo} onChange={(event) => setForm((current) => ({ ...current, batchNo: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Lot No.</Label><Input value={form.lotNo} onChange={(event) => setForm((current) => ({ ...current, lotNo: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Supplier</Label><Input value={form.supplier} onChange={(event) => setForm((current) => ({ ...current, supplier: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Receiving Ref</Label><Input value={form.receivingRef} onChange={(event) => setForm((current) => ({ ...current, receivingRef: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Storage Location</Label><Input value={form.storageLocation} onChange={(event) => setForm((current) => ({ ...current, storageLocation: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Quantity</Label><Input value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Unit</Label><Input value={form.unit} onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Received Date</Label><Input type="date" value={form.receivedDate} onChange={(event) => setForm((current) => ({ ...current, receivedDate: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Expiry Date</Label><Input type="date" value={form.expiryDate} onChange={(event) => setForm((current) => ({ ...current, expiryDate: event.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Checked By</Label><Input value={form.checkedBy} onChange={(event) => setForm((current) => ({ ...current, checkedBy: event.target.value }))} /></div>
                </div>
                <div className="space-y-1.5 rounded-md border p-3"><Label>Notes</Label><Textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} /></div>
              </>
            ) : null}
            {dialogMode === "daily-check" ? (
              <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Branch</Label><Select value={form.branch || undefined} onValueChange={(value) => setForm((current) => ({ ...current, branch: value }))}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Storage Location</Label><Input value={form.storageLocation} onChange={(event) => setForm((current) => ({ ...current, storageLocation: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Checked By</Label><Input value={form.checkedBy} onChange={(event) => setForm((current) => ({ ...current, checkedBy: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Check Date</Label><Input type="datetime-local" value={form.checkDate} onChange={(event) => setForm((current) => ({ ...current, checkDate: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Items Checked</Label><Textarea value={form.itemsChecked} onChange={(event) => setForm((current) => ({ ...current, itemsChecked: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Expiring Items / Missing Label / Action Required</Label><Textarea value={form.expiringItems} onChange={(event) => setForm((current) => ({ ...current, expiringItems: event.target.value }))} /></div>
              </div>
            ) : null}
            {dialogMode === "action" ? (
              <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Action Type</Label><Select value={form.actionType} onValueChange={(value) => setForm((current) => ({ ...current, actionType: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{actionTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Due Time</Label><Input type="datetime-local" value={form.dueTime} onChange={(event) => setForm((current) => ({ ...current, dueTime: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Completion Standard</Label><Textarea value={form.completionStandard} onChange={(event) => setForm((current) => ({ ...current, completionStandard: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Photo Proof Required</Label><Select value={form.photoProofRequired} onValueChange={(value) => setForm((current) => ({ ...current, photoProofRequired: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Required">Required</SelectItem><SelectItem value="Not Required">Not Required</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Assigned Role</Label><Select value={form.assignedRole} onValueChange={(value) => setForm((current) => ({ ...current, assignedRole: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roleTargets.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Manager Note</Label><Textarea value={form.managerNote} onChange={(event) => setForm((current) => ({ ...current, managerNote: event.target.value }))} /></div>
              </div>
            ) : null}
            {dialogMode === "disposal" ? (
              <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Disposed Quantity</Label><Input value={form.disposedQuantity} onChange={(event) => setForm((current) => ({ ...current, disposedQuantity: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Waste Reason</Label><Select value={form.wasteReason} onValueChange={(value) => setForm((current) => ({ ...current, wasteReason: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{wasteReasons.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Waste Cost</Label><Input value={form.wasteCost} onChange={(event) => setForm((current) => ({ ...current, wasteCost: event.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Checked By</Label><Input value={form.checkedBy} onChange={(event) => setForm((current) => ({ ...current, checkedBy: event.target.value }))} /></div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            {dialogMode === "register" ? <Button onClick={registerBatch} disabled={!form.branch || !form.product || !form.expiryDate}>Register Batch</Button> : null}
            {dialogMode === "daily-check" ? <Button onClick={() => setDialogOpen(false)}>Submit Daily Check</Button> : null}
            {dialogMode === "action" ? <Button onClick={() => { setDialogOpen(false); if (form.actionType === "Transfer") createFefoTask("Transfer"); else if (form.actionType === "Dispose") createFefoTask("Dispose"); else createFefoTask("Use First"); }}>Create FEFO Action</Button> : null}
            {dialogMode === "disposal" ? <Button onClick={recordDisposal}>Record Disposal</Button> : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
