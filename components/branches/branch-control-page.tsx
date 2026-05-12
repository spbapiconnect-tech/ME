"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, ClipboardCheck, Plus } from "lucide-react";

import { ErpShell } from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { runStoreOperationRules } from "@/lib/rules/rule-runner";
import {
  getBranchAttentionQueue,
  getBranchAttentionTone,
  getBranchDetail,
  getBranchHealthBoard,
  getBranchKpis,
  getBranchNextActions,
  getBranchStatusTone,
  getMissingSetupItems,
  getTodayOperationSummary,
} from "@/lib/store-operations/branch-control-workspace";
import { createBranchSetupTask } from "@/lib/store-operations/store-operation-links";
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

type ModalMode = "register" | "open" | "setup";

type BranchForm = {
  branchName: string;
  branchCode: string;
  brand: string;
  region: string;
  outletType: string;
  address: string;
  manager: string;
  supervisor: string;
  operatingHours: string;
  openingWindow: string;
  closingWindow: string;
  posId: string;
  serviceChannels: string;
  stationAreas: string;
  setupChecklist: string;
  branch: string;
  openingStatus: string;
  openingTime: string;
  openingManager: string;
  openingChecklistStatus: string;
  staffReadiness: string;
  equipmentStatus: string;
  fefoCheckStatus: string;
  issueFound: string;
  notes: string;
  missingSetupItem: string;
  requiredAction: string;
  owner: string;
  dueDate: string;
  photoProofRequired: string;
  managerNote: string;
};

const outletTypes = ["Flagship", "Mall Outlet", "Street Outlet", "Kiosk", "Central Kitchen"];
const openingStatuses = ["Not Opened", "Opening Pending", "Open", "Issue Found", "Closed"];
const readinessStates = ["Ready", "Partial", "Blocked"];
const proofOptions = ["Required", "Not Required"];

export function BranchControlPage() {
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);

  const branchRows = getRows("branches", []);
  const taskRows = getRows("tasks", []);
  const inspectionRows = getRows("inspection", []);
  const incidentRows = getRows("issues", []);
  const fefoRows = getRows("expiry", []);

  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(branchRows[0]?.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ModalMode>("register");
  const [form, setForm] = useState<BranchForm>({
    branchName: "",
    branchCode: "",
    brand: "",
    region: "",
    outletType: "Mall Outlet",
    address: "",
    manager: "",
    supervisor: "",
    operatingHours: "09:00 - 22:00",
    openingWindow: "08:30",
    closingWindow: "22:30",
    posId: "",
    serviceChannels: "Dine-In,Takeaway",
    stationAreas: "Front Counter,Kitchen,Storage",
    setupChecklist: "Manager assignment, POS setup, service channels, FEFO check flow",
    branch: "",
    openingStatus: "Open",
    openingTime: new Date().toISOString().slice(0, 16),
    openingManager: "",
    openingChecklistStatus: "Ready",
    staffReadiness: "Ready",
    equipmentStatus: "Ready",
    fefoCheckStatus: "Ready",
    issueFound: "",
    notes: "",
    missingSetupItem: "",
    requiredAction: "",
    owner: "Outlet Manager",
    dueDate: new Date().toISOString().slice(0, 10),
    photoProofRequired: "Required",
    managerNote: "",
  });

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const branchOptions = useMemo(() => branchRows.map((row) => row.title), [branchRows]);
  const kpis = useMemo(() => getBranchKpis(branchRows, taskRows, inspectionRows, incidentRows, fefoRows), [branchRows, taskRows, inspectionRows, incidentRows, fefoRows]);
  const healthBoard = useMemo(() => getBranchHealthBoard(branchRows, taskRows, inspectionRows, incidentRows, fefoRows), [branchRows, taskRows, inspectionRows, incidentRows, fefoRows]);
  const todayOperation = useMemo(() => branchRows.map((branch) => getTodayOperationSummary(branch, taskRows, inspectionRows, incidentRows, fefoRows)), [branchRows, taskRows, inspectionRows, incidentRows, fefoRows]);
  const attentionQueue = useMemo(() => getBranchAttentionQueue(branchRows, taskRows, inspectionRows, incidentRows, fefoRows), [branchRows, taskRows, inspectionRows, incidentRows, fefoRows]);
  const selectedBranch = branchRows.find((row) => row.id === selectedBranchId) ?? healthBoard[0]?.row ?? branchRows[0];
  const branchDetail = useMemo(() => getBranchDetail(selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows), [selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows]);
  const nextActions = useMemo(() => selectedBranch ? getBranchNextActions(selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows) : [], [selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows]);

  function openModal(mode: ModalMode) {
    if (mode !== "register" && selectedBranch) {
      const missingSetupItems = getMissingSetupItems(selectedBranch);
      setForm((current) => ({
        ...current,
        branch: selectedBranch.title,
        openingManager: detailValue(selectedBranch, "Manager") || current.openingManager,
        missingSetupItem: missingSetupItems[0] || current.missingSetupItem,
      }));
    }
    setDialogMode(mode);
    setDialogOpen(true);
  }

  async function registerBranch() {
    if (!form.branchName.trim()) return;
    const missingSetupItems = [
      !form.manager.trim() ? "Manager" : "",
      !form.supervisor.trim() ? "Supervisor" : "",
      !form.posId.trim() ? "POS ID" : "",
      !form.serviceChannels.trim() ? "Service Channels" : "",
      !form.stationAreas.trim() ? "Station Areas" : "",
    ].filter(Boolean);
    const setupStatus = missingSetupItems.length ? "Missing Setup" : "Ready";
    const matches = runStoreOperationRules("branch-control", {
      setupStatus,
      criticalIncidentCount: 0,
      overdueTaskCount: 0,
      failedInspectionCount: 0,
      expiredFefoCount: 0,
      healthScore: 100,
      openTodayStatus: "Not Opened",
    });
    const attentionLevel = matches.find((item) => item.result.metadata?.attentionLevel)?.result.metadata?.attentionLevel || (missingSetupItems.length ? "Attention" : "Healthy");
    const status = missingSetupItems.length ? "Setup Required" : "Active";
    const created = await createRecordWithPayload("branches", {
      title: form.branchName.trim(),
      subtitle: `${form.region || "No Region"} · ${form.outletType}`,
      status,
      owner: form.manager || "Branch Control",
      detailItems: [
        { label: "Branch Name", value: form.branchName.trim() },
        { label: "Branch Code", value: form.branchCode.trim() },
        { label: "Brand", value: form.brand.trim() },
        { label: "Region", value: form.region.trim() },
        { label: "Outlet Type", value: form.outletType },
        { label: "Address", value: form.address.trim() },
        { label: "Manager", value: form.manager.trim() },
        { label: "Supervisor", value: form.supervisor.trim() },
        { label: "Operating Hours", value: form.operatingHours.trim() },
        { label: "Opening Window", value: form.openingWindow.trim() },
        { label: "Closing Window", value: form.closingWindow.trim() },
        { label: "POS ID", value: form.posId.trim() },
        { label: "Service Channels", value: form.serviceChannels.trim() },
        { label: "Station Areas", value: form.stationAreas.trim() },
        { label: "Setup Checklist", value: form.setupChecklist.trim() },
        { label: "Setup Status", value: setupStatus },
        { label: "Open Today Status", value: "Not Opened" },
        { label: "Health Score", value: "100" },
        { label: "Risk Score", value: "0" },
        { label: "Attention Level", value: attentionLevel },
        { label: "Missing Setup Items", value: missingSetupItems.join(", ") },
        { label: "Linked Task IDs", value: "" },
        { label: "Linked Inspection IDs", value: "" },
        { label: "Linked Incident IDs", value: "" },
        { label: "Linked FEFO IDs", value: "" },
      ],
      detailNote: missingSetupItems.length
        ? `Complete missing setup items: ${missingSetupItems.join(", ")}.`
        : "Branch ready for daily operation control.",
      nextAction: missingSetupItems.length ? "Create branch setup task" : "Confirm opening status",
    });
    setSelectedBranchId(created.id);
    setDialogOpen(false);
    await logAction("branches", "register-branch", `Registered branch ${created.title}`);
  }

  async function confirmOpeningStatus() {
    if (!selectedBranch || !form.branch) return;
    const boardItem = healthBoard.find((item) => item.row.id === selectedBranch.id);
    const matches = runStoreOperationRules("branch-control", {
      setupStatus: detailValue(selectedBranch, "Setup Status") || "Not Started",
      criticalIncidentCount: boardItem?.criticalIncidents ?? 0,
      overdueTaskCount: boardItem?.overdueTasks ?? 0,
      failedInspectionCount: boardItem?.failedInspections ?? 0,
      expiredFefoCount: Math.round((boardItem?.fefoRisk ?? 0) > 0 ? 1 : 0),
      healthScore: boardItem?.healthScore ?? 100,
      openTodayStatus: form.openingStatus,
    });
    const attentionLevel = matches.find((item) => item.result.metadata?.attentionLevel)?.result.metadata?.attentionLevel || detailValue(selectedBranch, "Attention Level") || "Healthy";
    let nextDetails = selectedBranch.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Open Today Status", form.openingStatus);
    nextDetails = upsertDetail(nextDetails, "Opening Time", form.openingTime);
    nextDetails = upsertDetail(nextDetails, "Opening Manager", form.openingManager);
    nextDetails = upsertDetail(nextDetails, "Opening Checklist Status", form.openingChecklistStatus);
    nextDetails = upsertDetail(nextDetails, "Staff Readiness", form.staffReadiness);
    nextDetails = upsertDetail(nextDetails, "Equipment Status", form.equipmentStatus);
    nextDetails = upsertDetail(nextDetails, "FEFO Check Status", form.fefoCheckStatus);
    nextDetails = upsertDetail(nextDetails, "Issue Found", form.issueFound || "None");
    nextDetails = upsertDetail(nextDetails, "Attention Level", attentionLevel);
    await updateRecord("branches", selectedBranch.id, {
      status: form.openingStatus === "Issue Found" ? "Attention" : selectedBranch.status,
      detailItems: nextDetails,
      detailNote: form.notes || `Opening status confirmed by ${form.openingManager || "branch operator"}.`,
      nextAction: form.openingStatus === "Issue Found" ? "Review opening issue" : "Monitor branch health",
    });
    setDialogOpen(false);
    await logAction("branches", "open-today-control", `Updated opening control for ${selectedBranch.title}`);
  }

  async function createSetupTask() {
    if (!selectedBranch) return;
    const seed = createBranchSetupTask(selectedBranch, {
      missingSetupItem: form.missingSetupItem,
      dueAt: `${form.dueDate}T18:00`,
      photoProofRequired: form.photoProofRequired === "Required",
    });
    const created = await createRecordWithPayload("tasks", {
      title: seed.title,
      subtitle: `${selectedBranch.title} · Branch Setup`,
      status: "Scheduled",
      owner: form.owner || "Outlet Manager",
      detailItems: [
        { label: "Branch", value: selectedBranch.title },
        { label: "Task Type", value: "Daily Operation" },
        { label: "Role Target", value: form.owner || "Outlet Manager" },
        { label: "Outlets", value: selectedBranch.title },
        { label: "Completed Outlets", value: "" },
        { label: "Due Date", value: form.dueDate },
        { label: "Due Time", value: "18:00" },
        { label: "Due At", value: `${form.dueDate}T18:00` },
        { label: "Repeat Rule", value: "Once" },
        { label: "Completion Standard", value: form.requiredAction || seed.completionStandard },
        { label: "Photo Required", value: form.photoProofRequired },
        { label: "Photo Proof Status", value: form.photoProofRequired === "Required" ? "Missing" : "Not Required" },
        { label: "Photo Proofs", value: "" },
        { label: "Manager Review Status", value: "Not Submitted" },
        { label: "Source", value: "Branch Control" },
        { label: "Linked Branch ID", value: selectedBranch.id },
        { label: "Linked Branch", value: selectedBranch.title },
        { label: "SLA Status", value: "On Track" },
      ],
      detailNote: form.managerNote || form.requiredAction || seed.completionStandard,
      nextAction: "Complete branch setup item",
    });

    let nextDetails = selectedBranch.detailItems ?? [];
    const linkedTaskIds = detailValue(selectedBranch, "Linked Task IDs");
    nextDetails = upsertDetail(nextDetails, "Linked Task IDs", [linkedTaskIds, created.id].filter(Boolean).join(", "));
    nextDetails = upsertDetail(nextDetails, "Missing Setup Items", form.missingSetupItem || detailValue(selectedBranch, "Missing Setup Items"));
    nextDetails = upsertDetail(nextDetails, "Setup Status", "In Progress");
    await updateRecord("branches", selectedBranch.id, {
      status: "Setup Required",
      detailItems: nextDetails,
      detailNote: form.managerNote || `Branch setup task created: ${created.title}`,
      nextAction: "Track branch setup completion",
    });
    setDialogOpen(false);
    await logAction("branches", "create-setup-task", `Created setup task for ${selectedBranch.title}`);
  }

  async function handleSubmit() {
    if (dialogMode === "register") await registerBranch();
    if (dialogMode === "open") await confirmOpeningStatus();
    if (dialogMode === "setup") await createSetupTask();
  }

  return (
    <ErpShell>
      <div className="space-y-6 p-4 md:p-6 pb-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Store Operations</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Branch Control</h1>
              <p className="text-muted-foreground">Monitor branch health, operation readiness, risk, and pending actions across all outlets.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => openModal("register")}><Plus className="h-4 w-4" />Register Branch</Button>
            <Button variant="outline" onClick={() => openModal("open")} disabled={!selectedBranch}><CalendarClock className="h-4 w-4" />Open Today Control</Button>
            <Button variant="outline" onClick={() => openModal("setup")} disabled={!selectedBranch}><ClipboardCheck className="h-4 w-4" />Create Branch Setup Task</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!branchRows.length ? (
          <Card>
            <CardHeader>
              <CardTitle>Register your first branch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Register your first branch to start monitoring outlet execution, inspections, incidents, and FEFO risk.</p>
              <Button onClick={() => openModal("register")}>Register Branch</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[1.35fr_1.1fr_1fr]">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Branch Health Board</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {healthBoard.map((item) => (
                    <button
                      key={item.row.id}
                      type="button"
                      onClick={() => setSelectedBranchId(item.row.id)}
                      className={cn(
                        "w-full rounded-lg border p-4 text-left transition hover:border-primary/50",
                        selectedBranch?.id === item.row.id && "border-primary bg-primary/5",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{item.branch}</div>
                          <div className="text-sm text-muted-foreground">{item.manager} · {item.openTodayStatus}</div>
                        </div>
                        <Badge variant={getBranchAttentionTone(item.attentionLevel)}>{item.attentionLevel}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                        <div><div className="text-muted-foreground">Health</div><div className="font-medium">{item.healthScore}%</div></div>
                        <div><div className="text-muted-foreground">Risk</div><div className="font-medium">{item.riskScore}%</div></div>
                        <div><div className="text-muted-foreground">Incidents</div><div className="font-medium">{item.openIncidents}</div></div>
                        <div><div className="text-muted-foreground">Overdue</div><div className="font-medium">{item.overdueTasks}</div></div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today Operation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayOperation.length ? todayOperation.map((item) => (
                    <div key={item.branch} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{item.branch}</div>
                          <div className="text-sm text-muted-foreground">Readiness {item.readinessScore}%</div>
                        </div>
                        <Badge variant={getBranchStatusTone(item.openTodayStatus)}>{item.openTodayStatus}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div><div className="text-muted-foreground">Due Tasks</div><div className="font-medium">{item.dueTasks}</div></div>
                        <div><div className="text-muted-foreground">Pending Review</div><div className="font-medium">{item.pendingReview}</div></div>
                        <div><div className="text-muted-foreground">Inspection</div><div className="font-medium">{item.inspectionStatus}</div></div>
                        <div><div className="text-muted-foreground">Expiring Items</div><div className="font-medium">{item.expiringItems}</div></div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">Incident: {item.criticalIncident}</div>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No branch operation data has been submitted for today yet.</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attention Queue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attentionQueue.length ? attentionQueue.map((item) => (
                    <div key={item.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{item.branch}</div>
                          <div className="text-sm text-muted-foreground">{item.riskReason}</div>
                        </div>
                        <Badge variant={getBranchAttentionTone(item.severity)}>{item.severity}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">{item.sourceModule}</div>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">All active branches are clear. No urgent operational attention is required.</p>}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Branch Detail</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {branchDetail ? (
                    <>
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xl font-semibold">{branchDetail.branchName}</div>
                            <div className="text-sm text-muted-foreground">{branchDetail.code} · {branchDetail.region}</div>
                          </div>
                          <Badge variant={getBranchAttentionTone(branchDetail.attentionLevel)}>{branchDetail.attentionLevel}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getBranchStatusTone(selectedBranch?.status || "Draft")}>{selectedBranch?.status || "Draft"}</Badge>
                          <Badge variant="outline">Setup {branchDetail.setupStatus}</Badge>
                          <Badge variant="outline">Open {branchDetail.openTodayStatus}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><div className="text-muted-foreground">Manager</div><div className="font-medium">{branchDetail.manager}</div></div>
                        <div><div className="text-muted-foreground">Supervisor</div><div className="font-medium">{branchDetail.supervisor}</div></div>
                        <div><div className="text-muted-foreground">Operating Hours</div><div className="font-medium">{branchDetail.operatingHours}</div></div>
                        <div><div className="text-muted-foreground">Outlet Type</div><div className="font-medium">{branchDetail.outletType}</div></div>
                        <div><div className="text-muted-foreground">Health Score</div><div className="font-medium">{branchDetail.healthScore}%</div></div>
                        <div><div className="text-muted-foreground">Risk Score</div><div className="font-medium">{branchDetail.riskScore}%</div></div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium">Health Breakdown</div>
                        <div className="space-y-2 text-sm">
                          {branchDetail.healthBreakdown.map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-md border px-3 py-2">
                              <span className="text-muted-foreground">{item.label}</span>
                              <span className="font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium">Risk Breakdown</div>
                        <div className="space-y-2 text-sm">
                          {branchDetail.riskBreakdown.map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-md border px-3 py-2">
                              <span className="text-muted-foreground">{item.label}</span>
                              <span className="font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium">Linked Records</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="rounded-md border px-3 py-2">Tasks: {branchDetail.linkedTasks.length}</div>
                          <div className="rounded-md border px-3 py-2">Inspections: {branchDetail.linkedInspections.length}</div>
                          <div className="rounded-md border px-3 py-2">Incidents: {branchDetail.linkedIncidents.length}</div>
                          <div className="rounded-md border px-3 py-2">FEFO: {branchDetail.linkedFefoRecords.length}</div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium">Next Actions</div>
                        <div className="space-y-2 text-sm">
                          {nextActions.length ? nextActions.map((action) => (
                            <div key={action.actionId} className="rounded-md border px-3 py-2">
                              <div className="font-medium">{action.label}</div>
                              <div className="text-muted-foreground">{action.sourceModule} · {action.severity}</div>
                            </div>
                          )) : <p className="text-muted-foreground">This branch has no execution, inspection, incident, or FEFO records yet.</p>}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Select a branch to review branch health, today operation, and linked risk records.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "register" ? "Register Branch" : dialogMode === "open" ? "Open Today Control" : "Create Branch Setup Task"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "register"
                ? "Register a branch with operating profile, service channels, and setup readiness."
                : dialogMode === "open"
                  ? "Confirm opening readiness, equipment status, and FEFO check before branch operation starts."
                  : "Create a branch setup action for missing operating requirements."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {dialogMode === "register" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Branch Name</Label><Input value={form.branchName} onChange={(e) => setForm((p) => ({ ...p, branchName: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Branch Code</Label><Input value={form.branchCode} onChange={(e) => setForm((p) => ({ ...p, branchCode: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Region</Label><Input value={form.region} onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Outlet Type</Label><Select value={form.outletType} onValueChange={(value) => setForm((p) => ({ ...p, outletType: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{outletTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>POS ID</Label><Input value={form.posId} onChange={(e) => setForm((p) => ({ ...p, posId: e.target.value }))} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} rows={2} /></div>
                <div className="space-y-2"><Label>Manager</Label><Input value={form.manager} onChange={(e) => setForm((p) => ({ ...p, manager: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Supervisor</Label><Input value={form.supervisor} onChange={(e) => setForm((p) => ({ ...p, supervisor: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Operating Hours</Label><Input value={form.operatingHours} onChange={(e) => setForm((p) => ({ ...p, operatingHours: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Opening Window</Label><Input value={form.openingWindow} onChange={(e) => setForm((p) => ({ ...p, openingWindow: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Closing Window</Label><Input value={form.closingWindow} onChange={(e) => setForm((p) => ({ ...p, closingWindow: e.target.value }))} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Service Channels</Label><Input value={form.serviceChannels} onChange={(e) => setForm((p) => ({ ...p, serviceChannels: e.target.value }))} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Station Areas</Label><Input value={form.stationAreas} onChange={(e) => setForm((p) => ({ ...p, stationAreas: e.target.value }))} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Setup Checklist</Label><Textarea value={form.setupChecklist} onChange={(e) => setForm((p) => ({ ...p, setupChecklist: e.target.value }))} rows={3} /></div>
              </div>
            )}

            {dialogMode === "open" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Branch</Label><Select value={form.branch} onValueChange={(value) => setForm((p) => ({ ...p, branch: value }))}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Opening Status</Label><Select value={form.openingStatus} onValueChange={(value) => setForm((p) => ({ ...p, openingStatus: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{openingStatuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Opening Time</Label><Input type="datetime-local" value={form.openingTime} onChange={(e) => setForm((p) => ({ ...p, openingTime: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Opening Manager</Label><Input value={form.openingManager} onChange={(e) => setForm((p) => ({ ...p, openingManager: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Opening Checklist Status</Label><Select value={form.openingChecklistStatus} onValueChange={(value) => setForm((p) => ({ ...p, openingChecklistStatus: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{readinessStates.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Staff Readiness</Label><Select value={form.staffReadiness} onValueChange={(value) => setForm((p) => ({ ...p, staffReadiness: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{readinessStates.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Equipment Status</Label><Select value={form.equipmentStatus} onValueChange={(value) => setForm((p) => ({ ...p, equipmentStatus: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{readinessStates.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>FEFO Check Status</Label><Select value={form.fefoCheckStatus} onValueChange={(value) => setForm((p) => ({ ...p, fefoCheckStatus: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{readinessStates.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2 md:col-span-2"><Label>Issue Found</Label><Textarea value={form.issueFound} onChange={(e) => setForm((p) => ({ ...p, issueFound: e.target.value }))} rows={2} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} /></div>
              </div>
            )}

            {dialogMode === "setup" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Branch</Label><Select value={form.branch} onValueChange={(value) => setForm((p) => ({ ...p, branch: value }))}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Missing Setup Item</Label><Input value={form.missingSetupItem} onChange={(e) => setForm((p) => ({ ...p, missingSetupItem: e.target.value }))} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Required Action</Label><Textarea value={form.requiredAction} onChange={(e) => setForm((p) => ({ ...p, requiredAction: e.target.value }))} rows={3} /></div>
                <div className="space-y-2"><Label>Owner</Label><Input value={form.owner} onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Photo Proof Required</Label><Select value={form.photoProofRequired} onValueChange={(value) => setForm((p) => ({ ...p, photoProofRequired: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{proofOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2 md:col-span-2"><Label>Manager Note</Label><Textarea value={form.managerNote} onChange={(e) => setForm((p) => ({ ...p, managerNote: e.target.value }))} rows={3} /></div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {dialogMode === "register" ? "Register Branch" : dialogMode === "open" ? "Confirm Opening Status" : "Create Setup Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
