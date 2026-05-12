"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { modulePages } from "@/lib/me/module-shell-data";
import type { ModuleRow } from "@/components/module/module-page-shell";
import { getMeDataProvider } from "@/lib/me/data-provider";

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
};

function nowIso() {
  return new Date().toISOString();
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
                detail: `Created record: ${title}`,
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
                detail: `Created record: ${payload.title}`,
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
                detail: `Updated record: ${rowId}`,
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
                detail: `Deleted record: ${rowId}`,
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
                detail: `Toggled status for ${rowId}`,
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
            { id: `AUD-${Date.now()}`, at: nowIso(), moduleKey, action, detail },
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
