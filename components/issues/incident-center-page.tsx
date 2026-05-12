"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, CheckCheck, ClipboardList, Flag, ShieldAlert, Siren, Target } from "lucide-react";
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
import { issueMasterData } from "@/lib/master-data/issue";
import { runStoreOperationRules } from "@/lib/rules/rule-runner";
import {
  getIncidentDueAtBySeverity,
  getIncidentKpis,
  getIncidentNextActions,
  getIncidentQueue,
  getIncidentReviewSummary,
  getIncidentSlaSummary,
  getIncidentSourceSignals,
  getIncidentStatusTone,
  getLinkedCorrectiveActions,
  type IncidentSourceSignal,
} from "@/lib/store-operations/incident-workspace";
import { serializeUploadAsset, uploadAssetLabel, uploadLocalPreviewAsset } from "@/lib/uploads/upload-provider";
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

type IncidentForm = {
  title: string;
  branch: string;
  source: string;
  severity: string;
  category: string;
  impactArea: string;
  reportedTime: string;
  customerImpact: string;
  immediateContainment: string;
  nextAction: string;
  owner: string;
  dueTime: string;
  createCorrectiveAction: string;
  linkedInspectionId: string;
  linkedInspectionFailedItemId: string;
  linkedOutletExecutionId: string;
  linkedFefoWasteId: string;
  evidenceAsset: string;
};

const sourceOptions = ["Manual Branch Report", "Store Inspection", "Outlet Execution", "FEFO / Waste Alert"];
const categoryOptions = Array.from(issueMasterData.issueCategory).length ? Array.from(issueMasterData.issueCategory) : ["Store Inspection Failure", "Outlet Execution", "Food Safety", "Equipment", "Waste Control"];
const severityOptions = Array.from(issueMasterData.severity).length ? Array.from(issueMasterData.severity) : ["Low", "Medium", "High", "Critical"];
const impactAreaOptions = Array.from(issueMasterData.impactArea).length ? Array.from(issueMasterData.impactArea) : ["Kitchen", "Service", "Food Safety", "Storage", "Outlet Execution", "Waste Control"];
const escalationLevels = ["None", "Supervisor", "Manager", "HQ", "Critical"];

export function IncidentCenterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const createTaskFromIncident = useMeRuntimeStore((state) => state.createTaskFromIncident);
  const transitionIncidentStatus = useMeRuntimeStore((state) => state.transitionIncidentStatus);
  const syncStatus = useMeRuntimeStore((state) => state.syncStatus);
  const syncMessage = useMeRuntimeStore((state) => state.lastSyncMessage);

  const incidentRows = getRows("issues", []);
  const inspectionRows = getRows("inspection", []);
  const taskRows = getRows("tasks", []);
  const expiryRows = getRows("expiry", []);
  const branchRows = getRows("branches", []);

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | undefined>();
  const [selectedSignalId, setSelectedSignalId] = useState<string | undefined>();
  const [activeFilter, setActiveFilter] = useState("New");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<IncidentForm>({
    title: "",
    branch: "",
    source: "Manual Branch Report",
    severity: "Medium",
    category: categoryOptions[0],
    impactArea: impactAreaOptions[0],
    reportedTime: new Date().toISOString().slice(0, 16),
    customerImpact: "Minor Delay",
    immediateContainment: "",
    nextAction: "",
    owner: "Incident Center",
    dueTime: getIncidentDueAtBySeverity("Medium"),
    createCorrectiveAction: "No",
    linkedInspectionId: "",
    linkedInspectionFailedItemId: "",
    linkedOutletExecutionId: "",
    linkedFefoWasteId: "",
    evidenceAsset: "",
  });

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const queue = useMemo(() => getIncidentQueue(incidentRows), [incidentRows]);
  const signals = useMemo(() => getIncidentSourceSignals(inspectionRows, taskRows, expiryRows), [inspectionRows, taskRows, expiryRows]);
  const kpis = useMemo(() => getIncidentKpis(incidentRows, taskRows), [incidentRows, taskRows]);
  const branchOptions = useMemo(() => branchRows.map((row) => row.title), [branchRows]);

  const filteredQueue = useMemo(() => {
    if (!activeFilter) return queue;
    return queue.filter((row) => {
      const sla = getIncidentSlaSummary(row).status;
      if (activeFilter === "Critical") return detailValue(row, "Severity") === "Critical";
      if (activeFilter === "New") return row.status === "New";
      if (activeFilter === "Contained") return row.status === "Contained";
      if (activeFilter === "Overdue") return ["Overdue", "Breached"].includes(sla);
      if (activeFilter === "Pending Review") return row.status === "Pending Review";
      if (activeFilter === "Resolved") return row.status === "Resolved";
      return true;
    });
  }, [activeFilter, queue]);

  const requestedIncidentId = useMemo(() => {
    const incidentId = searchParams.get("incidentId");
    if (incidentId && incidentRows.some((row) => row.id === incidentId)) return incidentId;
    const inspectionId = searchParams.get("inspectionId");
    if (inspectionId) {
      const linked = incidentRows.find((row) => detailValue(row, "Linked Inspection ID") === inspectionId);
      if (linked) return linked.id;
    }
    const taskId = searchParams.get("taskId");
    if (taskId) {
      const linked = incidentRows.find((row) => detailValue(row, "Linked Outlet Execution ID") === taskId || detailValue(row, "Linked Corrective Action IDs").includes(taskId));
      if (linked) return linked.id;
    }
    const branchId = searchParams.get("branchId");
    if (branchId) {
      const branch = branchRows.find((row) => row.id === branchId)?.title;
      const linked = branch ? incidentRows.find((row) => detailValue(row, "Branch") === branch) : undefined;
      if (linked) return linked.id;
    }
    return undefined;
  }, [searchParams, incidentRows, branchRows]);
  const selectedIncident = incidentRows.find((row) => row.id === selectedIncidentId)
    ?? incidentRows.find((row) => row.id === requestedIncidentId)
    ?? filteredQueue[0]
    ?? queue[0];
  const reviewSummary = useMemo(() => getIncidentReviewSummary(selectedIncident), [selectedIncident]);
  const nextActions = useMemo(() => getIncidentNextActions(selectedIncident), [selectedIncident]);
  const correctiveActions = useMemo(() => getLinkedCorrectiveActions(selectedIncident, taskRows), [selectedIncident, taskRows]);

  function openManualIncident() {
    setSelectedSignalId(undefined);
    setForm({
      title: "",
      branch: "",
      source: "Manual Branch Report",
      severity: "Medium",
      category: categoryOptions[0],
      impactArea: impactAreaOptions[0],
      reportedTime: new Date().toISOString().slice(0, 16),
      customerImpact: "Minor Delay",
      immediateContainment: "",
      nextAction: "",
      owner: "Incident Center",
      dueTime: getIncidentDueAtBySeverity("Medium"),
      createCorrectiveAction: "No",
      linkedInspectionId: "",
      linkedInspectionFailedItemId: "",
      linkedOutletExecutionId: "",
      linkedFefoWasteId: "",
      evidenceAsset: "",
    });
    setDialogOpen(true);
  }

  function openSignalIncident(signal: IncidentSourceSignal) {
    setSelectedSignalId(signal.id);
    setForm({
      title: signal.title,
      branch: signal.branch,
      source: signal.sourceType === "inspection" ? "Store Inspection" : signal.sourceType === "outlet-execution" ? "Outlet Execution" : "FEFO / Waste Alert",
      severity: signal.severity,
      category: categoryOptions[0],
      impactArea: impactAreaOptions[0],
      reportedTime: new Date().toISOString().slice(0, 16),
      customerImpact: signal.sourceType === "inspection" ? "Service Risk" : "Minor Delay",
      immediateContainment: "",
      nextAction: signal.sourceType === "inspection" ? "Create corrective action after manager review." : "Review source and assign owner.",
      owner: "Incident Center",
      dueTime: getIncidentDueAtBySeverity(signal.severity),
      createCorrectiveAction: signal.sourceType === "inspection" ? "Yes" : "No",
      linkedInspectionId: signal.linkedInspectionId || "",
      linkedInspectionFailedItemId: signal.linkedInspectionFailedItemId || "",
      linkedOutletExecutionId: signal.linkedOutletExecutionId || "",
      linkedFefoWasteId: signal.linkedFefoWasteId || "",
      evidenceAsset: "",
    });
    setDialogOpen(true);
  }

  async function saveIncident() {
    if (!form.title.trim() || !form.branch || !form.severity) return;
    const ruleMatches = runStoreOperationRules("incident-center", {
      severity: form.severity,
      status: "New",
      dueAt: form.dueTime,
      immediateContainment: form.immediateContainment,
    });
    const escalated = ruleMatches.find((item) => item.result.metadata?.escalationLevel)?.result.metadata?.escalationLevel as string | undefined;
    const slaStatus = ruleMatches.find((item) => item.result.metadata?.slaStatus)?.result.metadata?.slaStatus as string | undefined;

    const created = await createRecordWithPayload("issues", {
      title: form.title.trim(),
      subtitle: `${form.branch} · ${form.source}`,
      status: form.immediateContainment ? "Contained" : "New",
      owner: form.owner || "Incident Center",
      detailItems: [
        { label: "Branch", value: form.branch },
        { label: "Source", value: form.source },
        { label: "Source Record ID", value: form.linkedInspectionId || form.linkedOutletExecutionId || form.linkedFefoWasteId || "manual" },
        { label: "Severity", value: form.severity },
        { label: "Category", value: form.category },
        { label: "Impact Area", value: form.impactArea },
        { label: "Reported Time", value: form.reportedTime },
        { label: "Customer / Service Impact", value: form.customerImpact },
        { label: "Immediate Containment", value: form.immediateContainment },
        { label: "Containment Status", value: form.immediateContainment ? "Contained" : "Open" },
        { label: "Due Time", value: form.dueTime },
        { label: "SLA Status", value: slaStatus || getIncidentSlaSummary(undefined).status },
        { label: "Escalation Level", value: escalated || (form.severity === "Critical" ? "Critical" : "None") },
        { label: "Review Status", value: "Pending Review" },
        { label: "Resolution Evidence", value: form.evidenceAsset },
        { label: "Linked Inspection", value: inspectionRows.find((row) => row.id === form.linkedInspectionId)?.title || "" },
        { label: "Linked Inspection ID", value: form.linkedInspectionId },
        { label: "Linked Inspection Failed Item ID", value: form.linkedInspectionFailedItemId },
        { label: "Linked Outlet Execution", value: taskRows.find((row) => row.id === form.linkedOutletExecutionId)?.title || "" },
        { label: "Linked Outlet Execution ID", value: form.linkedOutletExecutionId },
        { label: "Linked FEFO / Waste ID", value: form.linkedFefoWasteId },
        { label: "Linked Corrective Action IDs", value: "" },
        { label: "Linked Corrective Actions", value: "" },
      ],
      detailNote: form.nextAction || "Review containment, assign owner, and prepare corrective action.",
      nextAction: form.createCorrectiveAction === "Yes" ? "Create corrective action" : "Assign owner",
    });
    setSelectedIncidentId(created.id);
    setDialogOpen(false);
    await logAction("issues", "report-incident", `Reported incident ${created.title}`);
    if (form.createCorrectiveAction === "Yes") {
      const createdIncident = getRows("issues", []).find((row) => row.id === created.id) ?? created;
      await createCorrectiveActionForIncident(createdIncident);
    }
  }

  async function createCorrectiveActionForIncident(incident = selectedIncident) {
    if (!incident) return;
    const created = await createTaskFromIncident(incident.id);
    if (created) {
      await logAction("issues", "create-corrective-action", `Created corrective action ${created.title} from ${incident.title}`);
    }
  }

  async function markContained() {
    if (!selectedIncident) return;
    const containment = detailValue(selectedIncident, "Immediate Containment") || "Temporary containment applied by manager.";
    let nextDetails = selectedIncident.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Immediate Containment", containment);
    nextDetails = upsertDetail(nextDetails, "Containment Status", "Contained");
    await updateRecord("issues", selectedIncident.id, { status: "Contained", detailItems: nextDetails, nextAction: "Assign owner" });
    await logAction("issues", "mark-contained", `Marked contained ${selectedIncident.title}`);
  }

  async function assignOwner() {
    if (!selectedIncident) return;
    await updateRecord("issues", selectedIncident.id, { status: "Assigned", owner: "Branch Manager", nextAction: "Create corrective action" });
    await logAction("issues", "assign-owner", `Assigned owner for ${selectedIncident.title}`);
  }

  async function escalateIncident() {
    if (!selectedIncident) return;
    const current = detailValue(selectedIncident, "Escalation Level") || "None";
    const index = escalationLevels.indexOf(current);
    const nextLevel = escalationLevels[Math.min(index + 1, escalationLevels.length - 1)] || "Supervisor";
    let nextDetails = selectedIncident.detailItems ?? [];
    nextDetails = upsertDetail(nextDetails, "Escalation Level", nextLevel);
    await updateRecord("issues", selectedIncident.id, { detailItems: nextDetails, nextAction: `Escalated to ${nextLevel}` });
    await logAction("issues", "escalate", `Escalated ${selectedIncident.title} to ${nextLevel}`);
  }

  async function markPendingReview() {
    if (!selectedIncident) return;
    await transitionIncidentStatus(selectedIncident.id, "Pending Review");
    await logAction("issues", "pending-review", `Marked pending review ${selectedIncident.title}`);
  }

  async function resolveIncident() {
    if (!selectedIncident) return;
    await transitionIncidentStatus(selectedIncident.id, "Resolved", "Manager verified corrective action and accepted proof.");
    await logAction("issues", "resolve-incident", `Resolved incident ${selectedIncident.title}`);
  }

  async function reopenIncident() {
    if (!selectedIncident) return;
    await transitionIncidentStatus(selectedIncident.id, "Reopened");
    await logAction("issues", "reopen-incident", `Reopened incident ${selectedIncident.title}`);
  }

  return (
    <ErpShell>
      <div className="space-y-5 pb-24 md:pb-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Incident Center</h1>
            <p className="text-sm text-muted-foreground">Control branch incidents, containment, escalation, corrective action, and resolution review.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => createCorrectiveActionForIncident()} disabled={!selectedIncident}>
              <Target className="h-4 w-4" />
              Create Corrective Action
            </Button>
            <Button variant="outline" onClick={escalateIncident} disabled={!selectedIncident}>
              <Siren className="h-4 w-4" />
              Escalate
            </Button>
            <Button onClick={openManualIncident}>
              <ShieldAlert className="h-4 w-4" />
              Report Incident
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
          {kpis.slice(0, 7).map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="px-3 pb-1 pt-3"><CardTitle className="text-[11px] font-medium text-muted-foreground md:text-xs">{kpi.label}</CardTitle></CardHeader>
              <CardContent className="px-3 pb-3 pt-0"><p className="text-xl font-semibold md:text-2xl">{kpi.value}</p></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_420px]">
          <Card className="min-h-[640px]">
            <CardHeader className="space-y-3">
              <div>
                <CardTitle className="text-base">Incident Queue</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Track incidents by severity, containment, SLA, and resolution state.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Critical", "New", "Contained", "Overdue", "Pending Review", "Resolved"].map((filter) => (
                  <button key={filter} type="button" onClick={() => setActiveFilter(filter)}>
                    <Badge variant={activeFilter === filter ? "secondary" : "outline"}>{filter}</Badge>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!filteredQueue.length ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Review source signals from inspection, outlet execution, or FEFO alerts before creating a manual incident.
                </div>
              ) : null}
              {filteredQueue.map((row) => {
                const sla = getIncidentSlaSummary(row);
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedIncidentId(row.id)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition-colors hover:border-primary/60",
                      selectedIncident?.id === row.id ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-muted-foreground">{detailValue(row, "Branch") || row.subtitle}</p>
                      </div>
                      <Badge variant={getIncidentStatusTone(detailValue(row, "Severity") || row.status)}>{detailValue(row, "Severity") || row.status}</Badge>
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>Status</span><span>{row.status}</span></div>
                      <div className="flex justify-between"><span>SLA</span><span>{sla.status}</span></div>
                      <div className="flex justify-between"><span>Corrective Action</span><span>{detailValue(row, "Linked Corrective Actions") || "Not created"}</span></div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="min-h-[640px]">
            <CardHeader>
              <CardTitle className="text-base">Incident Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">Follow the incident from report, containment, corrective action, review, and resolution.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedIncident || !reviewSummary ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    Select an incident from the queue, or create one from a source signal.
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Source Signals</div>
                    {!signals.length ? (
                      <div className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
                        No incident source signals yet. Failed inspection items, overdue execution, rejected proof, or FEFO exceptions will appear here.
                      </div>
                    ) : signals.slice(0, 4).map((signal) => (
                      <div key={signal.id} className={cn("rounded-xl border p-3", selectedSignalId === signal.id ? "border-primary bg-primary/5" : "border-border")}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{signal.title}</p>
                            <p className="text-xs text-muted-foreground">{signal.branch}</p>
                          </div>
                          <Badge variant={getIncidentStatusTone(signal.severity)}>{signal.severity}</Badge>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{signal.sourceType} · {signal.reason}</div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" onClick={() => openSignalIncident(signal)}>Create Incident</Button>
                          <Button variant="outline" size="sm" onClick={() => setSelectedSignalId(signal.id)}>Select</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Selected Incident</p>
                        <h2 className="text-lg font-semibold">{selectedIncident.title}</h2>
                        <p className="text-sm text-muted-foreground">{reviewSummary.branch} · {reviewSummary.source}</p>
                      </div>
                      <Badge variant={getIncidentStatusTone(reviewSummary.severity)}>{reviewSummary.severity}</Badge>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                      <div className="rounded-lg border bg-background px-3 py-2">
                        <div className="text-muted-foreground">SLA</div>
                        <div className="font-medium">{reviewSummary.slaStatus}</div>
                      </div>
                      <div className="rounded-lg border bg-background px-3 py-2">
                        <div className="text-muted-foreground">Escalation</div>
                        <div className="font-medium">{reviewSummary.escalationLevel}</div>
                      </div>
                      <div className="rounded-lg border bg-background px-3 py-2">
                        <div className="text-muted-foreground">Owner</div>
                        <div className="font-medium">{reviewSummary.owner}</div>
                      </div>
                      <div className="rounded-lg border bg-background px-3 py-2">
                        <div className="text-muted-foreground">Review</div>
                        <div className="font-medium">{reviewSummary.reviewStatus}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        label: "Reported",
                        value: detailValue(selectedIncident, "Reported Time") || "Not recorded",
                        active: true,
                      },
                      {
                        label: "Contained",
                        value: reviewSummary.containment || "Containment not applied",
                        active: selectedIncident.status === "Contained" || Boolean(detailValue(selectedIncident, "Immediate Containment")),
                      },
                      {
                        label: "Owner Assigned",
                        value: reviewSummary.owner || "No owner assigned",
                        active: Boolean(reviewSummary.owner),
                      },
                      {
                        label: "Corrective Action",
                        value: reviewSummary.linkedCorrectiveAction || "Not created",
                        active: Boolean(reviewSummary.linkedCorrectiveAction && reviewSummary.linkedCorrectiveAction !== "Not linked"),
                      },
                      {
                        label: "Pending Review",
                        value: reviewSummary.reviewStatus || "Pending Review",
                        active: selectedIncident.status === "Pending Review" || reviewSummary.reviewStatus === "Pending Review",
                      },
                      {
                        label: "Resolved",
                        value: reviewSummary.resolutionEvidence || "Resolution not verified",
                        active: selectedIncident.status === "Resolved",
                      },
                    ].map((step, index) => (
                      <div key={step.label} className="relative flex gap-3">
                        <div className="relative flex w-10 shrink-0 justify-center">
                          {index < 5 ? <div className="absolute left-1/2 top-1/2 h-full min-h-12 w-px -translate-x-1/2 bg-border" /> : null}
                          <div className={cn("relative mt-8 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-semibold", step.active ? "border-primary bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{index + 1}</div>
                        </div>
                        <div className="flex-1 rounded-xl border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{step.label}</p>
                              <p className="text-sm text-muted-foreground">{step.value}</p>
                            </div>
                            <Badge variant={step.active ? "secondary" : "outline"}>{step.active ? "Active" : "Waiting"}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Linked Navigation</div>
                    <div className="flex flex-wrap gap-2">
                      {detailValue(selectedIncident, "Linked Inspection ID") ? <Button variant="outline" size="sm" onClick={() => router.push(`/inspection?inspectionId=${detailValue(selectedIncident, "Linked Inspection ID")}`)}>Open Inspection</Button> : null}
                      {detailValue(selectedIncident, "Linked Outlet Execution ID") ? <Button variant="outline" size="sm" onClick={() => router.push(`/tasks?taskId=${detailValue(selectedIncident, "Linked Outlet Execution ID")}`)}>Open Task</Button> : null}
                      {detailValue(selectedIncident, "Linked FEFO / Waste ID") ? <Button variant="outline" size="sm" onClick={() => router.push(`/expiry?fefoId=${detailValue(selectedIncident, "Linked FEFO / Waste ID")}`)}>Open FEFO</Button> : null}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="min-h-[640px]">
            <CardHeader>
              <CardTitle className="text-base">Action Panel</CardTitle>
              <p className="text-sm text-muted-foreground">Take containment, assignment, escalation, corrective action, review, and resolution actions.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedIncident || !reviewSummary ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">Select an incident or create one from a source signal.</div>
              ) : (
                <>
                  <div>
                    <p className="font-medium">{selectedIncident.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedIncident.subtitle}</p>
                  </div>
                  <div className="grid gap-2 text-sm">
                    {[
                      ["Source", reviewSummary.source],
                      ["Branch", reviewSummary.branch],
                      ["Severity", reviewSummary.severity],
                      ["Category", reviewSummary.category],
                      ["Impact Area", reviewSummary.impactArea],
                      ["Containment", reviewSummary.containment],
                      ["Owner", reviewSummary.owner],
                      ["SLA", reviewSummary.slaStatus],
                      ["Escalation", reviewSummary.escalationLevel],
                      ["Linked Inspection", reviewSummary.linkedInspection],
                      ["Linked Execution", reviewSummary.linkedExecutionTask],
                      ["Corrective Action", reviewSummary.linkedCorrectiveAction],
                      ["Resolution Evidence", uploadAssetLabel(reviewSummary.resolutionEvidence)],
                      ["Review Status", reviewSummary.reviewStatus],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-right font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detailValue(selectedIncident, "Linked Inspection ID") ? <Button variant="outline" size="sm" onClick={() => router.push(`/inspection?inspectionId=${detailValue(selectedIncident, "Linked Inspection ID")}`)}>Open Inspection</Button> : null}
                    {detailValue(selectedIncident, "Linked Outlet Execution ID") ? <Button variant="outline" size="sm" onClick={() => router.push(`/tasks?taskId=${detailValue(selectedIncident, "Linked Outlet Execution ID")}`)}>Open Task</Button> : null}
                    {detailValue(selectedIncident, "Linked FEFO / Waste ID") ? <Button variant="outline" size="sm" onClick={() => router.push(`/expiry?fefoId=${detailValue(selectedIncident, "Linked FEFO / Waste ID")}`)}>Open FEFO</Button> : null}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium"><Flag className="h-4 w-4 text-primary" />Next Actions</div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {nextActions.map((action) => <div key={action} className="rounded-lg border px-3 py-2">{action}</div>)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium"><ClipboardList className="h-4 w-4 text-primary" />Linked Corrective Actions</div>
                    {!correctiveActions.length ? (
                      <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">No corrective action created yet.</div>
                    ) : (
                      correctiveActions.map((action) => (
                        <button key={action.id} type="button" onClick={() => router.push(`/tasks?taskId=${action.id}&incidentId=${selectedIncident.id}`)} className="w-full rounded-lg border p-3 text-left">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{action.title}</p>
                              <p className="text-xs text-muted-foreground">{action.subtitle}</p>
                            </div>
                            <Badge variant={getIncidentStatusTone(action.status)}>{action.status}</Badge>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Button variant="outline" onClick={markContained}><CheckCheck className="h-4 w-4" />Mark Contained</Button>
                    <Button variant="outline" onClick={assignOwner}><ArrowUpRight className="h-4 w-4" />Assign Owner</Button>
                    <Button variant="outline" onClick={() => createCorrectiveActionForIncident()}><Target className="h-4 w-4" />Create Corrective Action</Button>
                    <Button variant="outline" onClick={escalateIncident}><Siren className="h-4 w-4" />Escalate</Button>
                    <Button variant="outline" onClick={markPendingReview}><AlertTriangle className="h-4 w-4" />Mark Pending Review</Button>
                    <Button onClick={resolveIncident}><CheckCheck className="h-4 w-4" />Resolve Incident</Button>
                    <Button variant="outline" onClick={reopenIncident}>Reopen</Button>
                  </div>
                </>
              )}
              <p className="text-xs text-muted-foreground">Sync: {syncStatus} · {syncMessage}</p>
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>Report Incident</DialogTitle>
            <DialogDescription>Capture incident source, severity, containment, SLA, and whether corrective action should be created.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Incident Title</Label>
                <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Example: fryer cleaning missed before opening" />
              </div>
              <div className="space-y-1.5">
                <Label>Branch</Label>
                <Select value={form.branch || undefined} onValueChange={(value) => setForm((current) => ({ ...current, branch: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>{branchOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(value) => setForm((current) => ({ ...current, source: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{sourceOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Severity</Label>
                <Select value={form.severity} onValueChange={(value) => setForm((current) => ({ ...current, severity: value, dueTime: getIncidentDueAtBySeverity(value) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{severityOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(value) => setForm((current) => ({ ...current, category: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categoryOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Impact Area</Label>
                <Select value={form.impactArea} onValueChange={(value) => setForm((current) => ({ ...current, impactArea: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{impactAreaOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Reported Time</Label>
                <Input type="datetime-local" value={form.reportedTime} onChange={(event) => setForm((current) => ({ ...current, reportedTime: event.target.value }))} />
              </div>
            </div>

            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Customer / Service Impact</Label>
                <Input value={form.customerImpact} onChange={(event) => setForm((current) => ({ ...current, customerImpact: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Owner</Label>
                <Input value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Immediate Containment</Label>
                <Textarea value={form.immediateContainment} onChange={(event) => setForm((current) => ({ ...current, immediateContainment: event.target.value }))} placeholder="What was done immediately to reduce risk?" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Next Action</Label>
                <Textarea value={form.nextAction} onChange={(event) => setForm((current) => ({ ...current, nextAction: event.target.value }))} placeholder="Describe the expected review or follow-up step." />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Evidence Attachment</Label>
                <Input type="file" accept="image/*,application/pdf" onChange={async (event) => {
                  const asset = await uploadLocalPreviewAsset(event.target.files?.[0], "incident");
                  setForm((current) => ({ ...current, evidenceAsset: serializeUploadAsset(asset) }));
                }} />
                {form.evidenceAsset ? <div className="text-xs text-muted-foreground">Selected: {uploadAssetLabel(form.evidenceAsset)}</div> : null}
              </div>
              <div className="space-y-1.5">
                <Label>Due Time</Label>
                <Input type="datetime-local" value={form.dueTime} onChange={(event) => setForm((current) => ({ ...current, dueTime: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Create Corrective Action</Label>
                <Select value={form.createCorrectiveAction} onValueChange={(value) => setForm((current) => ({ ...current, createCorrectiveAction: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveIncident} disabled={!form.title.trim() || !form.branch}>Report Incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
