"use client";

import { useEffect, useMemo, useState } from "react";
import { ErpShell } from "@/components/erp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErpDataTable } from "@/components/erp/erp-data-table";
import { branchMaster, staffMaster } from "@/lib/me/master-data";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useMeRuntimeStore } from "@/stores/me-runtime";

export type ModuleRow = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  owner?: string;
  detailItems?: Array<{ label: string; value: string }>;
  nextAction?: string;
  detailNote?: string;
};
type ModuleTableRow = ModuleRow & Record<string, unknown>;

export type KpiItem = {
  label: string;
  value: string;
};

export type ModulePageConfig = {
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction?: string;
  kpis: KpiItem[];
  chips?: string[];
  searchPlaceholder: string;
  tableTitle: string;
  detailTitle?: string;
  detailActionLabel?: string;
  emptyStateTitle?: string;
  emptyGuide?: string;
  processSteps?: string[];
  quickActions?: string[];
  workspaceCards?: Array<{ label: string; value: string; note: string }>;
  rows: ModuleRow[];
};

type FormField = {
  key: string;
  label: string;
  required?: boolean;
  type?: "text" | "number" | "date" | "datetime-local" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
  span?: "full";
};

const branchOptions = branchMaster.map((branch) => `${branch.branchId} · ${branch.name}`);
const staffOptions = staffMaster.map((staff) => `${staff.name} · ${staff.role}`);

const statusOptionsByModule: Record<string, string[]> = {
  branches: ["Draft", "Setup Required", "Active", "Attention", "Suspended", "Closed"],
  inspection: ["Scheduled", "In Progress", "Failed Items", "Pending Review", "Completed", "Issue Created"],
  issues: ["New", "Contained", "Assigned", "In Progress", "Pending Review", "Resolved", "Reopened"],
  tasks: ["Scheduled", "Due Today", "Submitted", "Pending Review", "Completed", "Overdue", "Escalated"],
  expiry: ["Fresh", "Expiring Soon", "Use First", "Hold", "Expired", "Disposed"],
  sop: ["Draft", "Review", "Approved", "Effective", "Need Review", "Superseded", "Obsolete"],
};

function statusVariant(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("critical") || value.includes("failed") || value.includes("overdue") || value.includes("error")) return "destructive";
  if (value.includes("pending") || value.includes("review") || value.includes("draft") || value.includes("setup")) return "secondary";
  return "outline";
}

function getFormFields(moduleKey: string): FormField[] {
  switch (moduleKey) {
    case "branches":
      return [
        { key: "branchCode", label: "Branch Code", required: true, placeholder: "Outlet code" },
        { key: "manager", label: "Manager", type: "select", options: staffOptions },
        { key: "operatingHours", label: "Operating Hours", placeholder: "10:00-22:00" },
        { key: "posTerminal", label: "POS Terminal ID", placeholder: "POS terminal ID" },
        { key: "todaySales", label: "Today Sales", type: "number", placeholder: "0" },
        { key: "openTasks", label: "Open Tasks", type: "number", placeholder: "0" },
        { key: "stockAlerts", label: "Stock Alerts", type: "number", placeholder: "0" },
        { key: "inspectionScore", label: "Inspection Score", type: "number", placeholder: "0" },
      ];
    case "inspection":
      return [
        { key: "branch", label: "Branch", type: "select", options: branchOptions, required: true },
        { key: "checklistName", label: "Checklist", required: true, placeholder: "Opening hygiene checklist" },
        { key: "inspectionType", label: "Inspection Type", type: "select", options: ["Opening", "Closing", "Hygiene", "Stock", "Safety"] },
        { key: "scheduledFor", label: "Scheduled Time", type: "datetime-local" },
        { key: "inspector", label: "Inspector", type: "select", options: staffOptions },
        { key: "score", label: "Score", type: "number", placeholder: "0" },
        { key: "failedItems", label: "Failed Items", type: "number", placeholder: "0" },
        { key: "reviewStatus", label: "Review Status", type: "select", options: ["Pending Review", "Passed", "Failed", "Follow-up Required"] },
      ];
    case "issues":
      return [
        { key: "branch", label: "Branch", type: "select", options: branchOptions, required: true },
        { key: "severity", label: "Severity", type: "select", options: ["Low", "Medium", "High", "Critical"], required: true },
        { key: "category", label: "Category", type: "select", options: ["Store Operation", "Equipment", "Stock", "People", "POS", "Safety"] },
        { key: "impactArea", label: "Impact Area", placeholder: "Kitchen, counter, chiller, POS..." },
        { key: "reportedTime", label: "Reported Time", type: "datetime-local" },
        { key: "customerImpact", label: "Customer / Service Impact", type: "select", options: ["None", "Minor Delay", "Service Stopped", "Food Safety Risk", "Revenue Loss"] },
        { key: "containment", label: "Immediate Containment", type: "textarea", span: "full", placeholder: "What was done immediately to reduce risk?" },
        { key: "nextAction", label: "Next Action", placeholder: "Assign technician, isolate batch..." },
      ];
    case "tasks":
      return [
        { key: "branch", label: "Branch", type: "select", options: branchOptions, required: true },
        { key: "taskType", label: "Task Type", type: "select", options: ["Checklist", "Corrective Action", "Call", "Approval", "Stock Action", "Maintenance", "Training"] },
        { key: "dueTime", label: "Due Time", type: "datetime-local" },
        { key: "triggerType", label: "Time Trigger", type: "select", options: ["Manual", "Scheduled Time", "Before Expiry", "After Inspection Failure", "After Issue Created", "Daily Opening", "Daily Closing", "Weekly"] },
        { key: "referenceEvent", label: "Reference Event", placeholder: "Expiry date, inspection time, opening time..." },
        { key: "offsetDays", label: "Offset Days", type: "number", placeholder: "0" },
        { key: "triggerTime", label: "Trigger Time", placeholder: "09:00" },
        { key: "repeatRule", label: "Repeat Rule", type: "select", options: ["None", "Daily", "Weekdays", "Weekly", "Monthly", "By Completion"] },
        { key: "priority", label: "Priority", type: "select", options: ["Low", "Normal", "High", "Critical"] },
        { key: "source", label: "Source", type: "select", options: ["Manual", "Inspection", "Issue", "Expiry", "Manager Request"] },
        { key: "progress", label: "Progress %", type: "number", placeholder: "0" },
        { key: "completionStatus", label: "Completion Status", type: "select", options: ["Open", "In Progress", "Waiting", "Completed"] },
        { key: "checklist", label: "Checklist Items", type: "textarea", span: "full", placeholder: "One item per line: verify stock, take photo, manager sign-off..." },
      ];
    case "expiry":
      return [
        { key: "branch", label: "Branch", type: "select", options: branchOptions, required: true },
        { key: "batch", label: "Batch / Lot No.", required: true, placeholder: "LOT-20260512-A" },
        { key: "storage", label: "Storage Location", placeholder: "Chiller A / Dry Store 2" },
        { key: "quantity", label: "Quantity", type: "number", placeholder: "0" },
        { key: "expiryDate", label: "Expiry Date", type: "date", required: true },
        { key: "remainingDays", label: "Remaining Days", type: "number", placeholder: "0" },
        { key: "checkedBy", label: "Checked By", type: "select", options: staffOptions },
        { key: "actionRequired", label: "Action Required", type: "select", options: ["Monitor", "Use First", "Discount", "Dispose", "Manager Review"] },
      ];
    case "sop":
      return [
        { key: "documentCode", label: "Document Code", required: true, placeholder: "SOP-KIT-001" },
        { key: "category", label: "Category", type: "select", options: ["Kitchen", "Service", "Safety", "HR", "Finance", "System"], required: true },
        { key: "processArea", label: "Process Area", type: "select", options: ["Opening", "Closing", "Food Prep", "Storage", "Cashier", "Incident Response", "Cleaning"] },
        { key: "version", label: "Version", placeholder: "v1.0" },
        { key: "owner", label: "Process Owner", type: "select", options: staffOptions },
        { key: "approver", label: "Approver", type: "select", options: staffOptions },
        { key: "effectiveDate", label: "Effective Date", type: "date" },
        { key: "linkedTraining", label: "Linked Training", placeholder: "Food safety onboarding" },
        { key: "trainingRequired", label: "Training Acknowledgement", type: "select", options: ["Required", "Optional", "Not Required"] },
        { key: "reviewDue", label: "Review Due", type: "date" },
        { key: "reviewCycle", label: "Review Cycle", type: "select", options: ["Monthly", "Quarterly", "Semiannual", "Annual", "On Incident"] },
        { key: "lastUpdated", label: "Last Updated", type: "date" },
        { key: "procedureSummary", label: "Procedure Summary", type: "textarea", span: "full", placeholder: "Core steps, control point, and expected evidence." },
        { key: "controlledEvidence", label: "Required Evidence", type: "textarea", span: "full", placeholder: "Photo, manager sign-off, temperature log, checklist..." },
      ];
    default:
      return [
        { key: "reference", label: "Reference", placeholder: "Record reference" },
        { key: "owner", label: "Owner", type: "select", options: staffOptions },
      ];
  }
}

function mapFieldToLabel(fieldKey: string): string {
  const labels: Record<string, string> = {
    manager: "Manager",
    branchCode: "Branch Code",
    operatingHours: "Operating Hours",
    posTerminal: "POS Terminal ID",
    todaySales: "Today Sales",
    openTasks: "Open Tasks",
    stockAlerts: "Stock Alerts",
    inspectionScore: "Inspection Score",
    checklistName: "Checklist Name",
    branch: "Branch",
    score: "Score",
    failedItems: "Failed Items",
    inspector: "Inspector",
    reviewStatus: "Review Status",
    inspectionType: "Inspection Type",
    scheduledFor: "Scheduled Time",
    severity: "Severity",
    category: "Category",
    impactArea: "Impact Area",
    customerImpact: "Customer / Service Impact",
    containment: "Immediate Containment",
    reportedTime: "Reported Time",
    nextAction: "Next Action",
    taskType: "Task Type",
    dueTime: "Due Time",
    triggerType: "Time Trigger",
    referenceEvent: "Reference Event",
    offsetDays: "Offset Days",
    triggerTime: "Trigger Time",
    repeatRule: "Repeat Rule",
    priority: "Priority",
    source: "Source",
    progress: "Checklist / Progress",
    completionStatus: "Completion Status",
    checklist: "Checklist Items",
    quantity: "Quantity",
    batch: "Batch",
    storage: "Storage",
    expiryDate: "Expiry Date",
    remainingDays: "Remaining Days",
    checkedBy: "Checked By",
    actionRequired: "Action Required",
    documentCode: "Document Code",
    processArea: "Process Area",
    version: "Version",
    owner: "Owner",
    approver: "Approver",
    effectiveDate: "Effective Date",
    linkedTraining: "Linked Training",
    trainingRequired: "Training Acknowledgement",
    reviewDue: "Review Due",
    reviewCycle: "Review Cycle",
    lastUpdated: "Last Updated",
    procedureSummary: "Procedure Summary",
    controlledEvidence: "Required Evidence",
    reference: "Reference",
  };
  return labels[fieldKey] ?? fieldKey;
}

function getTitleLabel(moduleKey: string, tableTitle: string) {
  const labels: Record<string, string> = {
    branches: "Branch Name",
    inspection: "Inspection Name",
    issues: "Issue Title",
    tasks: "Task Title",
    expiry: "Product / Item",
    sop: "SOP Title",
  };
  return labels[moduleKey] ?? `${tableTitle} Title`;
}

function getSubtitleLabel(moduleKey: string) {
  const labels: Record<string, string> = {
    branches: "Region / Location",
    inspection: "Inspection Scope",
    issues: "Short Summary",
    tasks: "Work Scope",
    expiry: "Supplier / Receiving Reference",
    sop: "Operational Purpose",
  };
  return labels[moduleKey] ?? "Summary";
}

function getDefaultStatus(moduleKey: string) {
  return statusOptionsByModule[moduleKey]?.[0] ?? "Draft";
}

function getDialogDescription(moduleKey: string, tableTitle: string) {
  const descriptions: Record<string, string> = {
    branches: "Register an operating branch with manager, trading hours, POS reference, and daily control signals.",
    inspection: "Schedule or record a branch inspection with checklist scope, inspector, score, failed items, and review outcome.",
    issues: "Record incident source, severity, immediate containment, owner, and next action.",
    tasks: "Create an executable task with owner, due time, trigger logic, recurrence, source, and checklist.",
    expiry: "Register a perishable batch with lot, storage, quantity, expiry date, FEFO action, and checker.",
    sop: "Create a controlled SOP document with document code, version, process owner, approval, training acknowledgement, and review cycle.",
  };
  return descriptions[moduleKey] ?? `Create a usable ${tableTitle.toLowerCase()} record with operating context and accountable ownership.`;
}

function getFormSections(moduleKey: string, fields: FormField[]) {
  const byKey = new Map(fields.map((field) => [field.key, field]));
  const sectionKeys: Record<string, Array<{ title: string; keys: string[] }>> = {
    branches: [
      { title: "Branch Identity", keys: ["branchCode", "manager", "operatingHours", "posTerminal"] },
      { title: "Today Operating Signals", keys: ["todaySales", "openTasks", "stockAlerts", "inspectionScore"] },
    ],
    inspection: [
      { title: "Inspection Scope", keys: ["branch", "checklistName", "inspectionType", "scheduledFor"] },
      { title: "Result And Review", keys: ["inspector", "score", "failedItems", "reviewStatus"] },
    ],
    issues: [
      { title: "Incident Source", keys: ["branch", "severity", "category", "impactArea", "reportedTime", "customerImpact"] },
      { title: "Containment And Follow-up", keys: ["containment", "nextAction"] },
    ],
    tasks: [
      { title: "Execution Target", keys: ["branch", "taskType", "priority", "source"] },
      { title: "Time Trigger", keys: ["dueTime", "triggerType", "referenceEvent", "offsetDays", "triggerTime", "repeatRule"] },
      { title: "Completion Evidence", keys: ["progress", "completionStatus", "checklist"] },
    ],
    expiry: [
      { title: "Batch Identity", keys: ["branch", "batch", "storage", "quantity"] },
      { title: "Expiry Control", keys: ["expiryDate", "remainingDays", "checkedBy", "actionRequired"] },
    ],
    sop: [
      { title: "Controlled Document", keys: ["documentCode", "category", "processArea", "version"] },
      { title: "Approval And Release", keys: ["owner", "approver", "effectiveDate", "lastUpdated"] },
      { title: "Training And Review", keys: ["linkedTraining", "trainingRequired", "reviewDue", "reviewCycle"] },
      { title: "Procedure Evidence", keys: ["procedureSummary", "controlledEvidence"] },
    ],
  };

  const configured = sectionKeys[moduleKey];
  if (!configured) return [{ title: "Record Fields", fields }];

  return configured.map((section) => ({
    title: section.title,
    fields: section.keys.map((key) => byKey.get(key)).filter((field): field is FormField => Boolean(field)),
  }));
}

export function ModulePageShell({ config, moduleKey }: { config: ModulePageConfig; moduleKey?: string }) {
  const runtimeModuleKey = moduleKey ?? config.title.toLowerCase().replace(/\s+/g, "-");
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const deleteRecord = useMeRuntimeStore((state) => state.deleteRecord);
  const markReviewed = useMeRuntimeStore((state) => state.markReviewed);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const syncStatus = useMeRuntimeStore((state) => state.syncStatus);
  const syncMessage = useMeRuntimeStore((state) => state.lastSyncMessage);

  const rows = getRows(runtimeModuleKey, config.rows);
  const [selectedId, setSelectedId] = useState<string | undefined>(rows[0]?.id ?? config.rows[0]?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChip, setActiveChip] = useState(config.chips?.[0] ?? "");
  const [lastAction, setLastAction] = useState("Runtime ready.");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({ title: "", subtitle: "", status: "Draft", owner: "You", note: "" });

  const formFields = useMemo(() => getFormFields(runtimeModuleKey), [runtimeModuleKey]);
  const formSections = useMemo(() => getFormSections(runtimeModuleKey, formFields), [formFields, runtimeModuleKey]);
  const formIsValid = useMemo(
    () =>
      Boolean(formValues.title?.trim()) &&
      formFields.every((field) => !field.required || Boolean(formValues[field.key]?.trim())),
    [formFields, formValues],
  );

  const filteredRows = useMemo(() => {
    const bySearch = rows.filter((row) => {
      if (!searchTerm.trim()) return true;
      const text = `${row.title} ${row.subtitle} ${row.status} ${row.owner ?? ""}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });
    if (!activeChip || !config.chips?.length) return bySearch;
    const normalized = activeChip.toLowerCase();
    return bySearch.filter((row) => {
      const status = row.status.toLowerCase();
      if (normalized.includes("today")) return row.meta.toLowerCase().includes("today");
      if (normalized.includes("pending")) return status.includes("pending") || status.includes("review");
      if (normalized.includes("failed")) return status.includes("failed") || status.includes("critical") || status.includes("overdue");
      if (normalized.includes("completed")) return status.includes("completed") || status.includes("resolved") || status.includes("active");
      if (normalized.includes("open")) return status.includes("open");
      return true;
    });
  }, [rows, searchTerm, activeChip, config.chips]);

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const selected =
    filteredRows.find((item) => item.id === selectedId) ??
    rows.find((item) => item.id === selectedId) ??
    filteredRows[0] ??
    rows[0];

  const columns = useMemo(
    () => [
      {
        key: "title",
        label: config.tableTitle,
        type: "name" as const,
        render: (item: ModuleTableRow) => (
          <div className="space-y-0.5">
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        type: "text" as const,
        render: (item: ModuleTableRow) => <Badge variant={statusVariant(item.status)}>{item.status}</Badge>,
      },
      {
        key: "owner",
        label: "Owner",
        type: "text" as const,
        render: (item: ModuleTableRow) => <span>{item.owner || "System"}</span>,
      },
      {
        key: "meta",
        label: "Updated",
        type: "date" as const,
        align: "right" as const,
      },
    ],
    [config.tableTitle],
  );

  function openCreateDialog() {
    setEditingId(null);
    setFormValues({ title: "", subtitle: "", status: getDefaultStatus(runtimeModuleKey), owner: "You", note: "" });
    setDialogOpen(true);
  }

  function openEditDialog() {
    if (!selected) return;
    const detailMap = Object.fromEntries((selected.detailItems ?? []).map((item) => [item.label, item.value]));
    const next: Record<string, string> = {
      title: selected.title,
      subtitle: selected.subtitle,
      status: selected.status,
      owner: selected.owner ?? "",
      note: selected.detailNote ?? "",
    };
    formFields.forEach((field) => {
      next[field.key] = detailMap[field.label] ?? detailMap[mapFieldToLabel(field.key)] ?? "";
    });
    setFormValues(next);
    setEditingId(selected.id);
    setDialogOpen(true);
  }

  async function saveRecord() {
    if (!formIsValid) return;
    const detailItems = formFields
      .filter((field) => (formValues[field.key] ?? "").trim())
      .map((field) => ({ label: mapFieldToLabel(field.key), value: formValues[field.key].trim() }));

    if (editingId) {
      await updateRecord(runtimeModuleKey, editingId, {
        title: formValues.title.trim(),
        subtitle: formValues.subtitle?.trim() || "",
        status: formValues.status?.trim() || "Draft",
        owner: formValues.owner?.trim() || "You",
        detailItems,
        detailNote: formValues.note?.trim() || "",
      });
      setLastAction(`Updated ${config.tableTitle}: ${formValues.title.trim()}`);
    } else {
      const created = await createRecordWithPayload(runtimeModuleKey, {
        title: formValues.title.trim(),
        subtitle: formValues.subtitle?.trim() || "",
        status: formValues.status?.trim() || (runtimeModuleKey === "issues" ? "Open" : "Draft"),
        owner: formValues.owner?.trim() || "You",
        detailItems,
        detailNote: formValues.note?.trim() || "",
      });
      setSelectedId(created.id);
      setLastAction(`Created ${config.tableTitle}: ${created.title}`);
    }

    await logAction(runtimeModuleKey, editingId ? "edit" : "create", `${editingId ? "Edited" : "Created"}: ${formValues.title.trim()}`);
    setDialogOpen(false);
  }

  async function removeSelected() {
    if (!selected) return;
    await deleteRecord(runtimeModuleKey, selected.id);
    setSelectedId(undefined);
    setLastAction(`Deleted ${config.tableTitle}: ${selected.title}`);
    await logAction(runtimeModuleKey, "delete", `Deleted: ${selected.title}`);
  }

  function renderField(field: FormField) {
    const value = formValues[field.key] ?? "";
    const label = `${field.label}${field.required ? " *" : ""}`;

    if (field.type === "select" && field.options?.length) {
      return (
        <div key={field.key} className={cn("space-y-1.5", field.span === "full" && "md:col-span-2")}>
          <Label>{label}</Label>
          <Select value={value || undefined} onValueChange={(next) => setFormValues((prev) => ({ ...prev, [field.key]: next }))}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.key} className="space-y-1.5 md:col-span-2">
          <Label>{label}</Label>
          <Textarea
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
          />
        </div>
      );
    }

    return (
      <div key={field.key} className={cn("space-y-1.5", field.span === "full" && "md:col-span-2")}>
        <Label>{label}</Label>
        <Input
          type={field.type ?? "text"}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
        />
      </div>
    );
  }

  return (
    <ErpShell>
      <div className="space-y-4 pb-24 md:space-y-6 md:p-1 md:pb-6">
        <header className="space-y-2 px-3 md:px-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {config.secondaryAction ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={async () => {
                    if (!selected?.id) return;
                    await markReviewed(runtimeModuleKey, selected.id);
                    const message = `${config.secondaryAction}: ${selected.title}`;
                    setLastAction(message);
                    await logAction(runtimeModuleKey, "secondary", message);
                  }}
                >
                  {config.secondaryAction}
                </Button>
              ) : null}
              <Button size="sm" onClick={openCreateDialog}>{config.primaryAction}</Button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 px-3 md:grid-cols-4 md:gap-4 md:px-0">
          {config.kpis.map((kpi) => (
            <Card key={kpi.label} className="rounded-xl">
              <CardHeader className="pb-1"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
              <CardContent><p className="text-xl font-semibold md:text-2xl">{kpi.value}</p></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-3 px-3 md:grid-cols-3 md:px-0">
          {(config.workspaceCards ?? [
            { label: "Operational Queue", value: String(filteredRows.length), note: "Live records in current module scope" },
            { label: "Service Level", value: "Not Configured", note: "Define SLA thresholds in Rules / Workflow" },
            { label: "Data Readiness", value: "Input Required", note: "Create records to activate module runtime" },
          ]).map((card) => (
            <Card key={card.label} className="rounded-xl">
              <CardHeader className="pb-1"><CardTitle className="text-xs font-medium text-muted-foreground">{card.label}</CardTitle></CardHeader>
              <CardContent className="space-y-1.5">
                <p className="text-lg font-semibold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.note}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-3 md:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder={config.searchPlaceholder} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          {config.chips?.length ? (
            <div className="flex flex-wrap gap-2">
              {config.chips.slice(0, 4).map((chip, idx) => (
                <button key={chip} type="button" onClick={() => setActiveChip(chip)}>
                  <Badge variant={activeChip === chip || (idx === 0 && !activeChip) ? "secondary" : "outline"} className="h-7 rounded-md px-2.5">
                    {chip}
                  </Badge>
                </button>
              ))}
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground">{lastAction}</p>
          <p className="text-xs text-muted-foreground">Sync: {syncStatus} · {syncMessage}</p>
        </section>

        <section className="hidden gap-4 md:grid md:grid-cols-12">
          <div className={cn("space-y-4", config.detailTitle ? "md:col-span-8" : "md:col-span-12")}>
            {!filteredRows.length ? (
              <Card className="rounded-xl">
                <CardHeader><CardTitle className="text-base">{config.emptyStateTitle ?? "No Records Yet"}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{config.emptyGuide || "Create your first operational record to start this module."}</p>
                  <Button size="sm" onClick={openCreateDialog}>{config.primaryAction}</Button>
                </CardContent>
              </Card>
            ) : null}
            <ErpDataTable
              data={filteredRows as ModuleTableRow[]}
              columns={columns}
              getRowId={(row) => row.id}
              onRowSelect={(row) => setSelectedId(row.id)}
              selectedId={selected?.id}
            />
          </div>
          {config.detailTitle ? (
            <Card className="md:col-span-4 rounded-xl">
              <CardHeader><CardTitle className="text-sm">{config.detailTitle}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="font-medium">{selected?.title}</p><p className="text-sm text-muted-foreground">{selected?.subtitle}</p></div>
                {selected?.detailItems?.length ? (
                  <div className="space-y-2.5">
                    {selected.detailItems.map((item) => (
                      <div key={`${selected.id}-${item.label}`} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {selected?.detailNote ? <p className="rounded-lg border bg-muted/30 p-2.5 text-xs text-muted-foreground">{selected.detailNote}</p> : null}
                <div className="grid gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={openEditDialog} disabled={!selected}>Edit</Button>
                  <Button variant="destructive" size="sm" className="w-full" onClick={() => setDeleteDialogOpen(true)} disabled={!selected}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>

        <section className="space-y-3 px-3 md:hidden">
          {filteredRows.map((row) => (
            <Card key={row.id} className="rounded-xl">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-medium">{row.title}</p><p className="text-xs text-muted-foreground">{row.subtitle}</p></div>
                  <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{row.owner || "System"}</span><span>{row.meta}</span></div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedId(row.id)}>Open</Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>{editingId ? `Edit ${config.tableTitle}` : config.primaryAction}</DialogTitle>
            <DialogDescription>
              {getDialogDescription(runtimeModuleKey, config.tableTitle)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label>{getTitleLabel(runtimeModuleKey, config.tableTitle)} *</Label>
                <Input
                  value={formValues.title ?? ""}
                  placeholder={getTitleLabel(runtimeModuleKey, config.tableTitle)}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>{getSubtitleLabel(runtimeModuleKey)}</Label>
                <Input
                  value={formValues.subtitle ?? ""}
                  placeholder={getSubtitleLabel(runtimeModuleKey)}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, subtitle: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={formValues.status || getDefaultStatus(runtimeModuleKey)} onValueChange={(next) => setFormValues((prev) => ({ ...prev, status: next }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(statusOptionsByModule[runtimeModuleKey] ?? ["Draft", "Active", "Review", "Resolved"]).map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Responsible Owner</Label>
                <Select value={formValues.owner || undefined} onValueChange={(next) => setFormValues((prev) => ({ ...prev, owner: next }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {["You", ...staffOptions].map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formSections.map((section) => (
              <div key={section.title} className="space-y-3 rounded-md border p-3">
                <div>
                  <p className="text-sm font-semibold">{section.title}</p>
                  {runtimeModuleKey === "tasks" && section.title === "Time Trigger" ? (
                    <p className="mt-1 text-xs text-muted-foreground">Use trigger fields when the task should appear before expiry, after inspection failure, or on a store operating schedule.</p>
                  ) : null}
                  {runtimeModuleKey === "sop" && section.title === "Controlled Document" ? (
                    <p className="mt-1 text-xs text-muted-foreground">SOP records should identify the controlled document, revision, owner, and active process area before publication.</p>
                  ) : null}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {section.fields.map(renderField)}
                </div>
              </div>
            ))}

            <div className="space-y-1.5 rounded-md border p-3">
              <Label>Operational Notes</Label>
              <Textarea
                value={formValues.note ?? ""}
                placeholder="Capture decision, risk, follow-up, or handover note."
                onChange={(event) => setFormValues((prev) => ({ ...prev, note: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveRecord} disabled={!formIsValid}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete {config.tableTitle}</DialogTitle>
            <DialogDescription>
              {selected ? `${selected.title} will be removed from this module.` : "No record selected."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await removeSelected();
                setDeleteDialogOpen(false);
              }}
              disabled={!selected}
            >
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpShell>
  );
}
