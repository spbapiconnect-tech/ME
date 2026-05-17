"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { modulePages } from "@/lib/me/module-shell-data";
import type { ModuleRow } from "@/components/module/module-page-shell";
import { getMeDataProvider } from "@/lib/me/data-provider";
import {
  createBranchSetupTask as createBranchSetupTaskSeed,
  createDisposalTaskFromFefoRecord as createDisposalTaskSeed,
  createIncidentFromInspectionFailure as createIncidentFromInspectionFailureSeed,
  createTaskFromIncident as createTaskFromIncidentSeed,
  createUseFirstTaskFromFefoRecord as createUseFirstTaskSeed,
} from "@/lib/store-operations/store-operation-links";

type RuntimeModuleKey = keyof typeof modulePages;

type ModuleRuntimeState = {
  rows: ModuleRow[];
  lastUpdatedAt: string;
};

type RuntimeAuditEvent = {
  id: string;
  at: string;
  moduleKey: string;
  action: string;
  detail: string;
};

type MeRuntimeState = {
  modules: Record<string, ModuleRuntimeState>;
  auditTrail: RuntimeAuditEvent[];
  syncStatus: "idle" | "syncing" | "ok" | "error";
  lastSyncMessage: string;
  hydrateFromFoundation: () => void;
  getRows: (moduleKey: string, fallbackRows: ModuleRow[]) => ModuleRow[];
  createRecord: (moduleKey: string, title: string) => Promise<ModuleRow>;
  createRecordWithPayload: (
    moduleKey: string,
    payload: {
      title: string;
      subtitle?: string;
      status?: string;
      owner?: string;
      detailItems?: Array<{ label: string; value: string }>;
      detailNote?: string;
      nextAction?: string;
    },
  ) => Promise<ModuleRow>;
  updateRecord: (
    moduleKey: string,
    rowId: string,
    payload: {
      title?: string;
      subtitle?: string;
      status?: string;
      owner?: string;
      detailItems?: Array<{ label: string; value: string }>;
      detailNote?: string;
      nextAction?: string;
    },
  ) => Promise<void>;
  deleteRecord: (moduleKey: string, rowId: string) => Promise<void>;
  markReviewed: (moduleKey: string, rowId: string) => Promise<void>;
  logAction: (moduleKey: string, action: string, detail: string) => Promise<void>;
  raiseIssueFromRecord: (sourceModuleKey: string, rowId: string) => Promise<ModuleRow | null>;
  createTaskFromIssue: (issueRowId: string) => Promise<ModuleRow | null>;
  resolveRecord: (moduleKey: string, rowId: string, resolutionNote?: string) => Promise<void>;
  createIncidentFromInspectionFailure: (inspectionId: string, failedItemId?: string) => Promise<ModuleRow | null>;
  createTaskFromIncident: (incidentId: string) => Promise<ModuleRow | null>;
  createUseFirstTaskFromFefoRecord: (fefoId: string) => Promise<ModuleRow | null>;
  createDisposalTaskFromFefoRecord: (fefoId: string) => Promise<ModuleRow | null>;
  createBranchSetupTask: (branchId: string, missingSetupItem?: string) => Promise<ModuleRow | null>;
  updateTaskProofAccepted: (taskId: string) => Promise<void>;
  updateTaskProofRejected: (taskId: string) => Promise<void>;
  transitionIncidentStatus: (incidentId: string, status: string, note?: string) => Promise<void>;
  transitionInspectionReviewStatus: (inspectionId: string, status: string, note?: string) => Promise<void>;
  transitionFefoReviewStatus: (fefoId: string, status: string, note?: string) => Promise<void>;
};

function nowIso() {
  return new Date().toISOString();
}

function runtimeActor() {
  if (typeof window === "undefined") return "System";
  return (
    window.localStorage.getItem("me:sop:audit-actor") ||
    window.localStorage.getItem("me:current-actor") ||
    "Local user"
  );
}

function withAuditActor(detail: string) {
  if (/\bBy\s+[^·]+/i.test(detail)) return detail;
  return `${detail} · By ${runtimeActor()}`;
}

function toLabel(moduleKey: string) {
  return moduleKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function moduleRecordTemplate(moduleKey: string, title: string): Pick<ModuleRow, "subtitle" | "detailItems" | "nextAction" | "detailNote"> {
  const now = new Date().toLocaleString();

  switch (moduleKey) {
    case "branches":
      return {
        subtitle: "Branch profile created",
        detailItems: [
          { label: "Branch Status", value: "Draft" },
          { label: "Manager", value: "Unassigned" },
          { label: "Today Sales", value: "0" },
          { label: "Open Tasks", value: "0" },
          { label: "Stock Alerts", value: "0" },
          { label: "Inspection Score", value: "Not Rated" },
          { label: "Last Sync", value: now },
        ],
        nextAction: "Open Branch Detail",
        detailNote: "Assign branch manager and operating profile before go-live.",
      };
    case "inspection":
      return {
        subtitle: "Inspection checklist initiated",
        detailItems: [
          { label: "Checklist Name", value: title },
          { label: "Branch", value: "Not Assigned" },
          { label: "Score", value: "0%" },
          { label: "Failed Items", value: "0" },
          { label: "Inspector", value: "Unassigned" },
          { label: "Review Status", value: "Pending Review" },
          { label: "Last Checked", value: now },
        ],
        nextAction: "Start Checklist",
        detailNote: "Complete checklist items and submit for review.",
      };
    case "issues":
      return {
        subtitle: "Issue ticket opened",
        detailItems: [
          { label: "Issue Title", value: title },
          { label: "Severity", value: "Medium" },
          { label: "Branch", value: "Not Assigned" },
          { label: "Owner", value: "Unassigned" },
          { label: "Status", value: "Open" },
          { label: "Reported Time", value: now },
        ],
        nextAction: "Assign Owner",
        detailNote: "Triage severity and assign a responsible owner.",
      };
    case "tasks":
      return {
        subtitle: "Task created",
        detailItems: [
          { label: "Task Title", value: title },
          { label: "Branch", value: "Not Assigned" },
          { label: "Owner", value: "Unassigned" },
          { label: "Due Time", value: "Not Scheduled" },
          { label: "Priority", value: "Normal" },
          { label: "Checklist / Progress", value: "0%" },
          { label: "Completion Status", value: "Open" },
        ],
        nextAction: "Start Task",
        detailNote: "Define due time and checklist before execution.",
      };
    case "expiry":
      return {
        subtitle: "Expiry batch registered",
        detailItems: [
          { label: "Product / Item", value: title },
          { label: "Batch", value: "Not Set" },
          { label: "Storage", value: "Not Set" },
          { label: "Expiry Date", value: "Not Set" },
          { label: "Remaining Days", value: "Unknown" },
          { label: "Checked By", value: "Unassigned" },
          { label: "Action Required", value: "Review" },
          { label: "Disposal / Check Status", value: "Pending" },
        ],
        nextAction: "Update Batch Check",
        detailNote: "Capture expiry date and confirm storage action.",
      };
    case "sop":
      return {
        subtitle: "SOP record created",
        detailItems: [
          { label: "SOP Title", value: title },
          { label: "Category", value: "Unassigned" },
          { label: "Version", value: "v1.0" },
          { label: "Owner", value: "Unassigned" },
          { label: "Linked Training", value: "Not Linked" },
          { label: "Review Due", value: "Not Scheduled" },
          { label: "Last Updated", value: now },
        ],
        nextAction: "Open SOP",
        detailNote: "Link SOP to training and assign review schedule.",
      };
    default:
      return {
        subtitle: `${toLabel(moduleKey)} record created`,
        detailItems: [
          { label: "Record", value: title },
          { label: "Status", value: "Draft" },
          { label: "Owner", value: "You" },
          { label: "Created", value: now },
        ],
        nextAction: "Open Detail",
        detailNote: "Complete required fields and assign owner.",
      };
  }
}

function seedModules(): Record<string, ModuleRuntimeState> {
  const seeded: Record<string, ModuleRuntimeState> = {};
  (Object.keys(modulePages) as RuntimeModuleKey[]).forEach((key) => {
    seeded[key] = {
      rows: modulePages[key].rows,
      lastUpdatedAt: nowIso(),
    };
  });
  return seeded;
}

function upsertDetail(items: ModuleRow["detailItems"], label: string, value: string) {
  const next = [...(items ?? [])];
  const index = next.findIndex((item) => item.label === label);
  if (index >= 0) next[index] = { label, value };
  else next.push({ label, value });
  return next;
}

function detailValue(items: ModuleRow["detailItems"], label: string) {
  return items?.find((item) => item.label === label)?.value ?? "";
}

export const useMeRuntimeStore = create<MeRuntimeState>()(
  persist(
    (set, get) => ({
      modules: seedModules(),
      auditTrail: [],
      syncStatus: "idle",
      lastSyncMessage: "Local runtime ready.",
      hydrateFromFoundation: () => {
        set((state) => {
          const next = { ...state.modules };
          (Object.keys(modulePages) as RuntimeModuleKey[]).forEach((key) => {
            if (!next[key]) {
              next[key] = { rows: modulePages[key].rows, lastUpdatedAt: nowIso() };
            }
          });
          return { ...state, modules: next };
        });
      },
      getRows: (moduleKey, fallbackRows) => {
        const state = get();
        return state.modules[moduleKey]?.rows ?? fallbackRows;
      },
      createRecord: async (moduleKey, title) => {
        const template = moduleRecordTemplate(moduleKey, title);
        const newRow: ModuleRow = {
          id: `${moduleKey}-${Date.now()}`,
          title,
          subtitle: template.subtitle,
          status: "Draft",
          meta: "Just now",
          owner: "You",
          detailItems: template.detailItems,
          nextAction: template.nextAction,
          detailNote: template.detailNote,
        };

        set((state) => {
          const current = state.modules[moduleKey] ?? { rows: [], lastUpdatedAt: nowIso() };
          return {
            ...state,
            modules: {
              ...state.modules,
              [moduleKey]: {
                rows: [newRow, ...current.rows],
                lastUpdatedAt: nowIso(),
              },
            },
            auditTrail: [
              {
                id: `AUD-${Date.now()}`,
                at: nowIso(),
                moduleKey,
                action: "create",
                detail: withAuditActor(`Created record: ${title}`),
              },
              ...state.auditTrail,
            ].slice(0, 300),
          };
        });

        const provider = getMeDataProvider();
        set({ syncStatus: "syncing", lastSyncMessage: `Syncing create to ${provider.mode}...` });
        try {
          await provider.syncCreateRecord(moduleKey, newRow);
          set({ syncStatus: "ok", lastSyncMessage: `Create synced to ${provider.mode}.` });
        } catch (error) {
          set({ syncStatus: "error", lastSyncMessage: `Create sync failed (${provider.mode}). ${error instanceof Error ? error.message : "Unknown error"}` });
        }
        return newRow;
      },
      createRecordWithPayload: async (moduleKey, payload) => {
        const template = moduleRecordTemplate(moduleKey, payload.title);
        const newRow: ModuleRow = {
          id: `${moduleKey}-${Date.now()}`,
          title: payload.title,
          subtitle: payload.subtitle ?? template.subtitle,
          status: payload.status ?? "Draft",
          meta: "Just now",
          owner: payload.owner ?? "You",
          detailItems: payload.detailItems ?? template.detailItems,
          nextAction: payload.nextAction ?? template.nextAction,
          detailNote: payload.detailNote ?? template.detailNote,
        };

        set((state) => {
          const current = state.modules[moduleKey] ?? { rows: [], lastUpdatedAt: nowIso() };
          return {
            ...state,
            modules: {
              ...state.modules,
              [moduleKey]: {
                rows: [newRow, ...current.rows],
                lastUpdatedAt: nowIso(),
              },
            },
            auditTrail: [
              {
                id: `AUD-${Date.now()}`,
                at: nowIso(),
                moduleKey,
                action: "create",
                detail: withAuditActor(`Created record: ${payload.title}`),
              },
              ...state.auditTrail,
            ].slice(0, 300),
          };
        });

        const provider = getMeDataProvider();
        set({ syncStatus: "syncing", lastSyncMessage: `Syncing create to ${provider.mode}...` });
        try {
          await provider.syncCreateRecord(moduleKey, newRow);
          set({ syncStatus: "ok", lastSyncMessage: `Create synced to ${provider.mode}.` });
        } catch (error) {
          set({ syncStatus: "error", lastSyncMessage: `Create sync failed (${provider.mode}). ${error instanceof Error ? error.message : "Unknown error"}` });
        }
        return newRow;
      },
      updateRecord: async (moduleKey, rowId, payload) => {
        let patch: Partial<ModuleRow> = {};
        set((state) => {
          const current = state.modules[moduleKey];
          if (!current) return state;
          const rows = current.rows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  title: payload.title ?? row.title,
                  subtitle: payload.subtitle ?? row.subtitle,
                  status: payload.status ?? row.status,
                  owner: payload.owner ?? row.owner,
                  detailItems: payload.detailItems ?? row.detailItems,
                  detailNote: payload.detailNote ?? row.detailNote,
                  nextAction: payload.nextAction ?? row.nextAction,
                  meta: "Updated just now",
                }
              : row,
          );
          const updated = rows.find((item) => item.id === rowId);
          patch = updated
            ? {
                title: updated.title,
                subtitle: updated.subtitle,
                status: updated.status,
                owner: updated.owner,
                detailItems: updated.detailItems,
                detailNote: updated.detailNote,
                nextAction: updated.nextAction,
                meta: updated.meta,
              }
            : {};
          return {
            ...state,
            modules: {
              ...state.modules,
              [moduleKey]: { rows, lastUpdatedAt: nowIso() },
            },
            auditTrail: [
              {
                id: `AUD-${Date.now()}`,
                at: nowIso(),
                moduleKey,
                action: "update",
                detail: withAuditActor(`Updated record: ${rowId}`),
              },
              ...state.auditTrail,
            ].slice(0, 300),
          };
        });
        const provider = getMeDataProvider();
        set({ syncStatus: "syncing", lastSyncMessage: `Syncing update to ${provider.mode}...` });
        try {
          await provider.syncUpdateRecord(moduleKey, rowId, patch);
          set({ syncStatus: "ok", lastSyncMessage: `Update synced to ${provider.mode}.` });
        } catch (error) {
          set({ syncStatus: "error", lastSyncMessage: `Update sync failed (${provider.mode}). ${error instanceof Error ? error.message : "Unknown error"}` });
        }
      },
      deleteRecord: async (moduleKey, rowId) => {
        set((state) => {
          const current = state.modules[moduleKey];
          if (!current) return state;
          return {
            ...state,
            modules: {
              ...state.modules,
              [moduleKey]: {
                rows: current.rows.filter((row) => row.id !== rowId),
                lastUpdatedAt: nowIso(),
              },
            },
            auditTrail: [
              {
                id: `AUD-${Date.now()}`,
                at: nowIso(),
                moduleKey,
                action: "delete",
                detail: withAuditActor(`Deleted record: ${rowId}`),
              },
              ...state.auditTrail,
            ].slice(0, 300),
          };
        });
        set({ syncStatus: "ok", lastSyncMessage: `Deleted record locally. Delete API hook pending for provider.` });
      },
      markReviewed: async (moduleKey, rowId) => {
        let patch: Partial<ModuleRow> = {};
        set((state) => {
          const current = state.modules[moduleKey];
          if (!current) return state;
          const rows = current.rows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  status: row.status === "Active" ? "Review" : "Active",
                  meta: "Updated just now",
                }
              : row,
          );
          const updated = rows.find((item) => item.id === rowId);
          patch = updated ? { status: updated.status, meta: updated.meta } : {};

          return {
            ...state,
            modules: {
              ...state.modules,
              [moduleKey]: { rows, lastUpdatedAt: nowIso() },
            },
            auditTrail: [
              {
                id: `AUD-${Date.now()}`,
                at: nowIso(),
                moduleKey,
                action: "update",
                detail: withAuditActor(`Toggled status for ${rowId}`),
              },
              ...state.auditTrail,
            ].slice(0, 300),
          };
        });
        const provider = getMeDataProvider();
        set({ syncStatus: "syncing", lastSyncMessage: `Syncing update to ${provider.mode}...` });
        try {
          await provider.syncUpdateRecord(moduleKey, rowId, patch);
          set({ syncStatus: "ok", lastSyncMessage: `Update synced to ${provider.mode}.` });
        } catch (error) {
          set({ syncStatus: "error", lastSyncMessage: `Update sync failed (${provider.mode}). ${error instanceof Error ? error.message : "Unknown error"}` });
        }
      },
      logAction: async (moduleKey, action, detail) => {
        set((state) => ({
          ...state,
          auditTrail: [
            { id: `AUD-${Date.now()}`, at: nowIso(), moduleKey, action, detail: withAuditActor(detail) },
            ...state.auditTrail,
          ].slice(0, 300),
        }));
        const provider = getMeDataProvider();
        try {
          await provider.syncActionLog({ moduleKey, action, detail });
          set({ syncStatus: "ok", lastSyncMessage: `Action log synced to ${provider.mode}.` });
        } catch (error) {
          set({ syncStatus: "error", lastSyncMessage: `Action log sync failed (${provider.mode}). ${error instanceof Error ? error.message : "Unknown error"}` });
        }
      },
      raiseIssueFromRecord: async (sourceModuleKey, rowId) => {
        const sourceRows = get().modules[sourceModuleKey]?.rows ?? [];
        const source = sourceRows.find((row) => row.id === rowId);
        if (!source) return null;

        const issueTitle = `Issue: ${source.title}`;
        const created = await get().createRecord("issues", issueTitle);
        set((state) => {
          const issuesModule = state.modules["issues"];
          if (!issuesModule) return state;
          const rows = issuesModule.rows.map((row) =>
            row.id === created.id
              ? {
                  ...row,
                  subtitle: source.subtitle,
                  status: "Open",
                  detailItems: [
                    { label: "Issue Title", value: issueTitle },
                    { label: "Source Module", value: sourceModuleKey },
                    { label: "Source Record", value: source.title },
                    { label: "Severity", value: "High" },
                    { label: "Status", value: "Open" },
                  ],
                  nextAction: "Resolve Issue",
                  detailNote: "Raised from module operation. Investigate and assign owner.",
                }
              : row,
          );
          return {
            ...state,
            modules: {
              ...state.modules,
              issues: { ...issuesModule, rows, lastUpdatedAt: nowIso() },
            },
          };
        });

        await get().logAction("issues", "raised-from-record", `Raised issue from ${sourceModuleKey}:${source.id}`);
        return get().modules["issues"]?.rows.find((row) => row.id === created.id) ?? null;
      },
      createTaskFromIssue: async (issueRowId) => {
        const issueRow = (get().modules["issues"]?.rows ?? []).find((row) => row.id === issueRowId);
        if (!issueRow) return null;
        const taskTitle = `Task: ${issueRow.title}`;
        const created = await get().createRecord("tasks", taskTitle);
        set((state) => {
          const tasksModule = state.modules["tasks"];
          if (!tasksModule) return state;
          const rows = tasksModule.rows.map((row) =>
            row.id === created.id
              ? {
                  ...row,
                  subtitle: issueRow.subtitle,
                  status: "Open",
                  detailItems: [
                    { label: "Task Title", value: taskTitle },
                    { label: "Source Issue", value: issueRow.title },
                    { label: "Priority", value: "High" },
                    { label: "Completion Status", value: "Open" },
                  ],
                  nextAction: "Mark Completed",
                  detailNote: "Task created from issue workflow. Complete and verify closure.",
                }
              : row,
          );
          return {
            ...state,
            modules: {
              ...state.modules,
              tasks: { ...tasksModule, rows, lastUpdatedAt: nowIso() },
            },
          };
        });
        await get().logAction("tasks", "created-from-issue", `Created task from issue:${issueRowId}`);
        return get().modules["tasks"]?.rows.find((row) => row.id === created.id) ?? null;
      },
      createIncidentFromInspectionFailure: async (inspectionId, failedItemId) => {
        const inspection = (get().modules["inspection"]?.rows ?? []).find((row) => row.id === inspectionId);
        if (!inspection) return null;
        const payload = detailValue(inspection.detailItems, "Failed Item Payload");
        let failedItem: { id?: string; label: string; severity?: string; comment?: string } | undefined;
        if (payload) {
          try {
            const parsed = JSON.parse(payload);
            failedItem = Array.isArray(parsed) ? parsed.find((item) => item.id === failedItemId) : undefined;
          } catch {}
        }
        const seed = createIncidentFromInspectionFailureSeed(inspection, failedItem);
        const created = await get().createRecordWithPayload("issues", {
          title: seed.title,
          subtitle: `${detailValue(inspection.detailItems, "Branch") || inspection.subtitle} · Store Inspection`,
          status: "New",
          owner: "Incident Center",
          detailItems: [
            { label: "Branch", value: detailValue(inspection.detailItems, "Branch") || inspection.subtitle },
            { label: "Source", value: "Store Inspection" },
            { label: "Source Record ID", value: inspection.id },
            { label: "Severity", value: seed.severity || "High" },
            { label: "Category", value: "Store Inspection Failure" },
            { label: "Impact Area", value: "Outlet Execution" },
            { label: "Immediate Containment", value: "" },
            { label: "Containment Status", value: "Open" },
            { label: "Due Time", value: "" },
            { label: "SLA Status", value: "On Track" },
            { label: "Escalation Level", value: seed.severity === "Critical" ? "Critical" : "None" },
            { label: "Linked Inspection ID", value: inspection.id },
            { label: "Linked Inspection", value: inspection.title },
            { label: "Linked Inspection Failed Item ID", value: failedItem?.id || "" },
            { label: "Linked Outlet Execution ID", value: detailValue(inspection.detailItems, "Linked Outlet Execution ID") },
            { label: "Linked Outlet Execution", value: detailValue(inspection.detailItems, "Linked Outlet Execution") },
            { label: "Linked Corrective Actions", value: "" },
            { label: "Resolution Evidence", value: "" },
            { label: "Review Status", value: "New" },
          ],
          detailNote: seed.summary || "Incident created from failed inspection item.",
          nextAction: "Capture containment and create corrective action",
        });
        let nextDetails = inspection.detailItems ?? [];
        const ids = [detailValue(nextDetails, "Linked Incident IDs"), created.id].filter(Boolean).join(", ");
        const titles = [detailValue(nextDetails, "Linked Incident Titles"), created.title].filter(Boolean).join(", ");
        nextDetails = upsertDetail(nextDetails, "Linked Incident IDs", ids);
        nextDetails = upsertDetail(nextDetails, "Linked Incident Titles", titles);
        await get().updateRecord("inspection", inspection.id, { detailItems: nextDetails, status: "Failed Items", nextAction: "Create corrective action" });
        return created;
      },
      createTaskFromIncident: async (incidentId) => {
        const incident = (get().modules["issues"]?.rows ?? []).find((row) => row.id === incidentId);
        if (!incident) return null;
        const seed = createTaskFromIncidentSeed(incident, {
          linkedInspectionId: detailValue(incident.detailItems, "Linked Inspection ID"),
        });
        const branch = detailValue(incident.detailItems, "Branch") || incident.subtitle;
        const dueAt = seed.dueAt || new Date().toISOString().slice(0, 16);
        const created = await get().createRecordWithPayload("tasks", {
          title: seed.title,
          subtitle: `${branch} · Corrective Action`,
          status: "Scheduled",
          owner: "Outlet Manager",
          detailItems: [
            { label: "Branch", value: branch },
            { label: "Task Type", value: "Corrective Action" },
            { label: "Role Target", value: "Outlet Manager" },
            { label: "Outlets", value: branch },
            { label: "Completed Outlets", value: "" },
            { label: "Due Date", value: dueAt.slice(0, 10) },
            { label: "Due Time", value: dueAt.slice(11, 16) },
            { label: "Due At", value: dueAt },
            { label: "Repeat Rule", value: "Once" },
            { label: "Completion Standard", value: seed.completionStandard },
            { label: "Photo Required", value: seed.photoProofRequired ? "Required" : "Not Required" },
            { label: "Photo Proof Status", value: seed.photoProofRequired ? "Missing" : "Not Required" },
            { label: "Photo Proofs", value: "" },
            { label: "Manager Review Status", value: "Not Submitted" },
            { label: "Source", value: "Incident Center" },
            { label: "Linked Incident ID", value: incident.id },
            { label: "Linked Incident", value: incident.title },
            { label: "Linked Inspection ID", value: detailValue(incident.detailItems, "Linked Inspection ID") },
            { label: "Linked Inspection", value: detailValue(incident.detailItems, "Linked Inspection") },
            { label: "SLA Status", value: detailValue(incident.detailItems, "SLA Status") || "On Track" },
          ],
          detailNote: seed.completionStandard,
          nextAction: "Start corrective action",
        });
        let nextDetails = incident.detailItems ?? [];
        nextDetails = upsertDetail(nextDetails, "Linked Corrective Actions", [detailValue(nextDetails, "Linked Corrective Actions"), created.title].filter(Boolean).join(", "));
        await get().updateRecord("issues", incident.id, { detailItems: nextDetails, status: "Assigned", nextAction: "Track corrective action" });
        return created;
      },
      createUseFirstTaskFromFefoRecord: async (fefoId) => {
        const fefo = (get().modules["expiry"]?.rows ?? []).find((row) => row.id === fefoId);
        if (!fefo) return null;
        const seed = createUseFirstTaskSeed(fefo, { dueAt: new Date().toISOString().slice(0, 16) });
        const branch = detailValue(fefo.detailItems, "Branch") || fefo.subtitle;
        const created = await get().createRecordWithPayload("tasks", {
          title: seed.title,
          subtitle: `${branch} · FEFO Action`,
          status: "Scheduled",
          owner: "Outlet Manager",
          detailItems: [
            { label: "Branch", value: branch },
            { label: "Task Type", value: "FEFO Action" },
            { label: "Role Target", value: "Outlet Manager" },
            { label: "Outlets", value: branch },
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
            { label: "Linked FEFO / Waste ID", value: fefo.id },
            { label: "Linked FEFO / Waste", value: fefo.title },
            { label: "SLA Status", value: "On Track" },
          ],
          detailNote: seed.completionStandard,
          nextAction: "Complete FEFO action",
        });
        let nextDetails = fefo.detailItems ?? [];
        nextDetails = upsertDetail(nextDetails, "Linked Outlet Execution ID", created.id);
        nextDetails = upsertDetail(nextDetails, "Linked Outlet Execution", created.title);
        nextDetails = upsertDetail(nextDetails, "Action Type", "Use First");
        await get().updateRecord("expiry", fefo.id, { detailItems: nextDetails, status: "Use First", nextAction: "Review FEFO task proof" });
        return created;
      },
      createDisposalTaskFromFefoRecord: async (fefoId) => {
        const fefo = (get().modules["expiry"]?.rows ?? []).find((row) => row.id === fefoId);
        if (!fefo) return null;
        const seed = createDisposalTaskSeed(fefo, { dueAt: new Date().toISOString().slice(0, 16) });
        const branch = detailValue(fefo.detailItems, "Branch") || fefo.subtitle;
        const created = await get().createRecordWithPayload("tasks", {
          title: seed.title,
          subtitle: `${branch} · FEFO Action`,
          status: "Scheduled",
          owner: "Outlet Manager",
          detailItems: [
            { label: "Branch", value: branch },
            { label: "Task Type", value: "FEFO Action" },
            { label: "Role Target", value: "Outlet Manager" },
            { label: "Outlets", value: branch },
            { label: "Completed Outlets", value: "" },
            { label: "Due Date", value: (seed.dueAt || "").slice(0, 10) },
            { label: "Due Time", value: (seed.dueAt || "").slice(11, 16) },
            { label: "Due At", value: seed.dueAt || "" },
            { label: "Repeat Rule", value: "Once" },
            { label: "Completion Standard", value: seed.completionStandard },
            { label: "Photo Required", value: "Required" },
            { label: "Photo Proof Status", value: "Missing" },
            { label: "Photo Proofs", value: "" },
            { label: "Manager Review Status", value: "Not Submitted" },
            { label: "Source", value: "FEFO / Waste Control" },
            { label: "Linked FEFO / Waste ID", value: fefo.id },
            { label: "Linked FEFO / Waste", value: fefo.title },
            { label: "SLA Status", value: "On Track" },
          ],
          detailNote: seed.completionStandard,
          nextAction: "Upload disposal proof",
        });
        let nextDetails = fefo.detailItems ?? [];
        nextDetails = upsertDetail(nextDetails, "Linked Outlet Execution ID", created.id);
        nextDetails = upsertDetail(nextDetails, "Linked Outlet Execution", created.title);
        nextDetails = upsertDetail(nextDetails, "Action Type", "Dispose");
        await get().updateRecord("expiry", fefo.id, { detailItems: nextDetails, status: "Expired", nextAction: "Review disposal proof" });
        return created;
      },
      createBranchSetupTask: async (branchId, missingSetupItem) => {
        const branch = (get().modules["branches"]?.rows ?? []).find((row) => row.id === branchId);
        if (!branch) return null;
        const seed = createBranchSetupTaskSeed(branch, { missingSetupItem, dueAt: `${new Date().toISOString().slice(0, 10)}T18:00` });
        const created = await get().createRecordWithPayload("tasks", {
          title: seed.title,
          subtitle: `${branch.title} · Branch Setup`,
          status: "Scheduled",
          owner: "Outlet Manager",
          detailItems: [
            { label: "Branch", value: branch.title },
            { label: "Task Type", value: "Daily Operation" },
            { label: "Role Target", value: "Outlet Manager" },
            { label: "Outlets", value: branch.title },
            { label: "Completed Outlets", value: "" },
            { label: "Due Date", value: (seed.dueAt || "").slice(0, 10) },
            { label: "Due Time", value: "18:00" },
            { label: "Due At", value: seed.dueAt || "" },
            { label: "Repeat Rule", value: "Once" },
            { label: "Completion Standard", value: seed.completionStandard },
            { label: "Photo Required", value: seed.photoProofRequired ? "Required" : "Not Required" },
            { label: "Photo Proof Status", value: seed.photoProofRequired ? "Missing" : "Not Required" },
            { label: "Photo Proofs", value: "" },
            { label: "Manager Review Status", value: "Not Submitted" },
            { label: "Source", value: "Branch Control" },
            { label: "Linked Branch ID", value: branch.id },
            { label: "Linked Branch", value: branch.title },
            { label: "SLA Status", value: "On Track" },
          ],
          detailNote: seed.completionStandard,
          nextAction: "Complete branch setup item",
        });
        let nextDetails = branch.detailItems ?? [];
        nextDetails = upsertDetail(nextDetails, "Linked Task IDs", [detailValue(nextDetails, "Linked Task IDs"), created.id].filter(Boolean).join(", "));
        nextDetails = upsertDetail(nextDetails, "Setup Status", "In Progress");
        await get().updateRecord("branches", branch.id, { detailItems: nextDetails, status: "Setup Required", nextAction: "Track branch setup completion" });
        return created;
      },
      updateTaskProofAccepted: async (taskId) => {
        const task = (get().modules["tasks"]?.rows ?? []).find((row) => row.id === taskId);
        if (!task) return;
        let taskDetails = task.detailItems ?? [];
        taskDetails = upsertDetail(taskDetails, "Photo Proof Status", "Accepted");
        taskDetails = upsertDetail(taskDetails, "Manager Review Status", "Accepted");
        taskDetails = upsertDetail(taskDetails, "Reviewed At", nowIso());
        await get().updateRecord("tasks", task.id, { status: "Completed", detailItems: taskDetails, nextAction: "Close linked review" });

        const linkedIncidentId = detailValue(task.detailItems, "Linked Incident ID");
        if (linkedIncidentId) {
          const incident = (get().modules["issues"]?.rows ?? []).find((row) => row.id === linkedIncidentId);
          if (incident) {
            let incidentDetails = incident.detailItems ?? [];
            incidentDetails = upsertDetail(incidentDetails, "Linked Corrective Actions", task.title);
            incidentDetails = upsertDetail(incidentDetails, "Review Status", "Pending Review");
            incidentDetails = upsertDetail(incidentDetails, "Resolution Evidence", "Corrective action proof accepted.");
            await get().updateRecord("issues", incident.id, { status: "Pending Review", detailItems: incidentDetails, nextAction: "Resolve incident after final review" });
          }
        }
        const linkedInspectionId = detailValue(task.detailItems, "Linked Inspection ID");
        if (linkedInspectionId) {
          const inspection = (get().modules["inspection"]?.rows ?? []).find((row) => row.id === linkedInspectionId);
          if (inspection) {
            let inspectionDetails = inspection.detailItems ?? [];
            inspectionDetails = upsertDetail(inspectionDetails, "Required New Photo Proof", "Accepted");
            inspectionDetails = upsertDetail(inspectionDetails, "Corrective Action Status", "Completed");
            await get().updateRecord("inspection", inspection.id, { detailItems: inspectionDetails, nextAction: "Close inspection review" });
          }
        }
        const linkedFefoId = detailValue(task.detailItems, "Linked FEFO / Waste ID");
        if (linkedFefoId) {
          const fefo = (get().modules["expiry"]?.rows ?? []).find((row) => row.id === linkedFefoId);
          if (fefo) {
            let fefoDetails = fefo.detailItems ?? [];
            fefoDetails = upsertDetail(fefoDetails, "Photo Proof Status", "Accepted");
            fefoDetails = upsertDetail(fefoDetails, "Manager Review Status", "Accepted");
            fefoDetails = upsertDetail(fefoDetails, "Linked Outlet Execution", task.title);
            fefoDetails = upsertDetail(fefoDetails, "Linked Outlet Execution ID", task.id);
            const nextStatus = task.title.toLowerCase().includes("dispose") ? "Reviewed" : fefo.status;
            await get().updateRecord("expiry", fefo.id, { status: nextStatus, detailItems: fefoDetails, nextAction: nextStatus === "Reviewed" ? "Close FEFO review" : "Monitor next expiry action" });
          }
        }
      },
      updateTaskProofRejected: async (taskId) => {
        const task = (get().modules["tasks"]?.rows ?? []).find((row) => row.id === taskId);
        if (!task) return;
        let taskDetails = task.detailItems ?? [];
        taskDetails = upsertDetail(taskDetails, "Photo Proof Status", "Recheck Required");
        taskDetails = upsertDetail(taskDetails, "Manager Review Status", "Rejected");
        taskDetails = upsertDetail(taskDetails, "Manager Review Comment", "Proof rejected. Rework and upload new evidence.");
        await get().updateRecord("tasks", task.id, { status: "Rework Required", detailItems: taskDetails, nextAction: "Upload new proof" });
        const linkedInspectionId = detailValue(task.detailItems, "Linked Inspection ID");
        if (linkedInspectionId) {
          const inspection = (get().modules["inspection"]?.rows ?? []).find((row) => row.id === linkedInspectionId);
          if (inspection) {
            let inspectionDetails = inspection.detailItems ?? [];
            inspectionDetails = upsertDetail(inspectionDetails, "Required New Photo Proof", "Rejected");
            inspectionDetails = upsertDetail(inspectionDetails, "Corrective Action Status", "Rework Required");
            await get().updateRecord("inspection", inspection.id, { detailItems: inspectionDetails, nextAction: "Request new proof" });
          }
        }
        const linkedFefoId = detailValue(task.detailItems, "Linked FEFO / Waste ID");
        if (linkedFefoId) {
          const fefo = (get().modules["expiry"]?.rows ?? []).find((row) => row.id === linkedFefoId);
          if (fefo) {
            let fefoDetails = fefo.detailItems ?? [];
            fefoDetails = upsertDetail(fefoDetails, "Photo Proof Status", "Rejected");
            fefoDetails = upsertDetail(fefoDetails, "Manager Review Status", "Rejected");
            fefoDetails = upsertDetail(fefoDetails, "Action Required", "Yes");
            await get().updateRecord("expiry", fefo.id, { detailItems: fefoDetails, nextAction: "Upload new FEFO / disposal proof" });
          }
        }
      },
      transitionIncidentStatus: async (incidentId, status, note) => {
        const incident = (get().modules["issues"]?.rows ?? []).find((row) => row.id === incidentId);
        if (!incident) return;
        let details = incident.detailItems ?? [];
        details = upsertDetail(details, "Review Status", status);
        if (note) details = upsertDetail(details, "Resolution Evidence", note);
        await get().updateRecord("issues", incident.id, { status, detailItems: details, nextAction: status === "Resolved" ? "Closed after review" : incident.nextAction });
      },
      transitionInspectionReviewStatus: async (inspectionId, status, note) => {
        const inspection = (get().modules["inspection"]?.rows ?? []).find((row) => row.id === inspectionId);
        if (!inspection) return;
        let details = inspection.detailItems ?? [];
        details = upsertDetail(details, "Review Status", status);
        if (note) details = upsertDetail(details, "Review Note", note);
        await get().updateRecord("inspection", inspection.id, { status, detailItems: details, nextAction: status === "Completed" ? "Inspection closed" : inspection.nextAction });
      },
      transitionFefoReviewStatus: async (fefoId, status, note) => {
        const fefo = (get().modules["expiry"]?.rows ?? []).find((row) => row.id === fefoId);
        if (!fefo) return;
        let details = fefo.detailItems ?? [];
        details = upsertDetail(details, "Manager Review Status", status);
        if (note) details = upsertDetail(details, "Review Note", note);
        await get().updateRecord("expiry", fefo.id, { status: status === "Accepted" ? "Reviewed" : fefo.status, detailItems: details, nextAction: status === "Accepted" ? "Close FEFO review" : fefo.nextAction });
      },
      resolveRecord: async (moduleKey, rowId, resolutionNote) => {
        let patch: Partial<ModuleRow> = {};
        set((state) => {
          const current = state.modules[moduleKey];
          if (!current) return state;
          const rows = current.rows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  status: "Resolved",
                  meta: "Resolved just now",
                  detailItems: upsertDetail(row.detailItems, "Resolution", resolutionNote || "Resolved by operator"),
                  detailNote: resolutionNote || "Record resolved and closed by operator.",
                  nextAction: "Reopen Record",
                }
              : row,
          );
          const updated = rows.find((item) => item.id === rowId);
          patch = updated
            ? { status: updated.status, meta: updated.meta, detailItems: updated.detailItems, detailNote: updated.detailNote }
            : {};
          return {
            ...state,
            modules: {
              ...state.modules,
              [moduleKey]: { rows, lastUpdatedAt: nowIso() },
            },
          };
        });
        await get().logAction(moduleKey, "resolve", `Resolved ${rowId}`);
        const provider = getMeDataProvider();
        try {
          await provider.syncUpdateRecord(moduleKey, rowId, patch);
          set({ syncStatus: "ok", lastSyncMessage: `Resolution synced to ${provider.mode}.` });
        } catch (error) {
          set({ syncStatus: "error", lastSyncMessage: `Resolution sync failed (${provider.mode}). ${error instanceof Error ? error.message : "Unknown error"}` });
        }
      },
    }),
    {
      name: "me-runtime-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ modules: state.modules, auditTrail: state.auditTrail }),
    },
  ),
);
