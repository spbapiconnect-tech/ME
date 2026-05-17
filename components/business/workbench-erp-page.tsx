"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  ClipboardCheck,
  FileSearch,
  Flame,
  ShieldAlert,
  Siren,
  Store,
} from "lucide-react";

import {
  ErpDataTable,
  type ErpDataTableColumn,
  ErpPageHeader,
  ErpShell,
  ErpStatusBadge,
} from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBranchAttentionQueue,
  getBranchDetail,
  getBranchHealthBoard,
  getBranchKpis,
  getBranchNextActions,
  getTodayOperationSummary,
} from "@/lib/store-operations/branch-control-workspace";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";

type HealthBoardItem = ReturnType<typeof getBranchHealthBoard>[number];
type AttentionItem = ReturnType<typeof getBranchAttentionQueue>[number];
type BranchDetail = NonNullable<ReturnType<typeof getBranchDetail>>;
type TodaySummary = ReturnType<typeof getTodayOperationSummary>;

type ControlRoomRow = {
  board: HealthBoardItem;
  latestSignal?: AttentionItem;
  today?: TodaySummary;
};

function toneClasses(level: string) {
  const value = level.toLowerCase();

  if (value.includes("critical") || value.includes("breach") || value.includes("high")) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (value.includes("medium") || value.includes("watch") || value.includes("warning")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (value.includes("healthy") || value.includes("open") || value.includes("low")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function scoreTone(score: number) {
  if (score < 70) return "text-red-600";
  if (score < 85) return "text-amber-600";
  return "text-emerald-600";
}

function pill(label: string, tone: string) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2.5 text-[10px] font-bold uppercase tracking-[0.12em]",
        toneClasses(tone),
      )}
    >
      {label}
    </span>
  );
}

function routeForSource(sourceModule: string, linkedRecordId?: string) {
  if (sourceModule === "Outlet Execution") {
    return linkedRecordId ? `/tasks?taskId=${linkedRecordId}` : "/tasks";
  }
  if (sourceModule === "Store Inspection") {
    return linkedRecordId ? `/inspection?inspectionId=${linkedRecordId}` : "/inspection";
  }
  if (sourceModule === "Incident Center") {
    return linkedRecordId ? `/issues?incidentId=${linkedRecordId}` : "/issues";
  }
  if (sourceModule === "FEFO / Waste Control") {
    return linkedRecordId ? `/expiry?fefoId=${linkedRecordId}` : "/expiry";
  }
  return "/branches";
}

function openActionRoute(
  router: ReturnType<typeof useRouter>,
  action: { sourceModule: string; linkedRecordId?: string; route?: string },
) {
  if (action.route) {
    if (action.linkedRecordId) {
      const route = action.route;
      if (route === "/tasks") return router.push(`/tasks?taskId=${action.linkedRecordId}`);
      if (route === "/inspection") return router.push(`/inspection?inspectionId=${action.linkedRecordId}`);
      if (route === "/issues") return router.push(`/issues?incidentId=${action.linkedRecordId}`);
      if (route === "/expiry") return router.push(`/expiry?fefoId=${action.linkedRecordId}`);
    }
    return router.push(action.route);
  }

  return router.push(routeForSource(action.sourceModule, action.linkedRecordId));
}

function StatStrip({
  stats,
}: {
  stats: ReadonlyArray<{
    label: string;
    value: string;
    context: string;
    tone: "critical" | "warning" | "normal" | "success";
  }>;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-6">
        {stats.map((item) => (
          <div key={item.label} className="bg-card px-4 py-3">
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </div>
            <div className="mt-2 flex items-end gap-2">
              <div
                className={cn(
                  "text-2xl font-black tracking-tight",
                  item.tone === "critical" && "text-red-600",
                  item.tone === "warning" && "text-amber-600",
                  item.tone === "success" && "text-emerald-600",
                  item.tone === "normal" && "text-foreground",
                )}
              >
                {item.value}
              </div>
              <div className="pb-1 text-[11px] text-muted-foreground">{item.context}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WorkbenchErpPage() {
  const router = useRouter();
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);

  const branchRows = getRows("branches", []);
  const taskRows = getRows("tasks", []);
  const inspectionRows = getRows("inspection", []);
  const incidentRows = getRows("issues", []);
  const fefoRows = getRows("expiry", []);

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const kpis = useMemo(
    () => getBranchKpis(branchRows, taskRows, inspectionRows, incidentRows, fefoRows),
    [branchRows, taskRows, inspectionRows, incidentRows, fefoRows],
  );
  const healthBoard = useMemo(
    () => getBranchHealthBoard(branchRows, taskRows, inspectionRows, incidentRows, fefoRows),
    [branchRows, taskRows, inspectionRows, incidentRows, fefoRows],
  );
  const todayOperation = useMemo(
    () => branchRows.map((branch) => getTodayOperationSummary(branch, taskRows, inspectionRows, incidentRows, fefoRows)),
    [branchRows, taskRows, inspectionRows, incidentRows, fefoRows],
  );
  const attentionQueue = useMemo(
    () => getBranchAttentionQueue(branchRows, taskRows, inspectionRows, incidentRows, fefoRows),
    [branchRows, taskRows, inspectionRows, incidentRows, fefoRows],
  );

  const [selectedId, setSelectedId] = useState<string | undefined>();

  const selectedBoard = useMemo(
    () => healthBoard.find((item) => item.row.id === selectedId) ?? healthBoard[0],
    [healthBoard, selectedId],
  );
  const selectedBranch = selectedBoard?.row;
  const selectedDetail = useMemo<BranchDetail | null>(
    () => getBranchDetail(selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows),
    [selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows],
  );
  const selectedNextActions = useMemo(
    () => (selectedBranch ? getBranchNextActions(selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows) : []),
    [selectedBranch, taskRows, inspectionRows, incidentRows, fefoRows],
  );

  const latestSignalByBranch = useMemo(() => {
    return attentionQueue.reduce<Record<string, AttentionItem>>((acc, item) => {
      if (!acc[item.branch]) acc[item.branch] = item;
      return acc;
    }, {});
  }, [attentionQueue]);

  const todayByBranch = useMemo(() => {
    return todayOperation.reduce<Record<string, TodaySummary>>((acc, item) => {
      acc[item.branch] = item;
      return acc;
    }, {});
  }, [todayOperation]);

  const controlRows = useMemo<ControlRoomRow[]>(
    () =>
      healthBoard.map((board) => ({
        board,
        latestSignal: latestSignalByBranch[board.branch],
        today: todayByBranch[board.branch],
      })),
    [healthBoard, latestSignalByBranch, todayByBranch],
  );

  const statStrip = useMemo<Array<{
    label: string;
    value: string;
    context: string;
    tone: "critical" | "warning" | "normal" | "success";
  }>>(() => {
    const byLabel = Object.fromEntries(kpis.map((item) => [item.label, item.value]));
    const criticalOutlets = healthBoard.filter((item) => item.attentionLevel === "Critical").length;
    const proofWaiting = taskRows.filter((row) =>
      String(row.detailItems?.find((item) => item.label === "Photo Proof Status")?.value || "").includes("Submitted"),
    ).length;

    return [
      {
        label: "Critical Outlets",
        value: String(criticalOutlets),
        context: `${healthBoard.filter((item) => item.attentionLevel === "Attention").length} more on watch`,
        tone: criticalOutlets > 0 ? "critical" : "success",
      },
      {
        label: "Overdue Tasks",
        value: byLabel["Overdue Tasks"] || "0",
        context: `${healthBoard.filter((item) => item.overdueTasks > 0).length} outlets affected`,
        tone: Number(byLabel["Overdue Tasks"] || 0) > 0 ? "warning" : "success",
      },
      {
        label: "Proof Waiting Review",
        value: String(proofWaiting),
        context: "Needs HQ review",
        tone: proofWaiting > 0 ? "warning" : "normal",
      },
      {
        label: "Failed Inspections",
        value: byLabel["Failed Inspections"] || "0",
        context: "Follow-up and corrective action",
        tone: Number(byLabel["Failed Inspections"] || 0) > 0 ? "critical" : "success",
      },
      {
        label: "Open Incidents",
        value: byLabel["Open Incidents"] || "0",
        context: "Containment and escalation",
        tone: Number(byLabel["Open Incidents"] || 0) > 0 ? "critical" : "success",
      },
      {
        label: "FEFO Risk",
        value: byLabel["FEFO Risk"] || "0",
        context: "Expiry and disposal pressure",
        tone: Number(byLabel["FEFO Risk"] || 0) > 0 ? "warning" : "success",
      },
    ];
  }, [healthBoard, kpis, taskRows]);

  const controlRoomColumns: ErpDataTableColumn<ControlRoomRow>[] = [
    {
      key: "branch",
      label: "Outlet",
      type: "name",
      width: "220px",
      render: ({ board }) => (
        <div className="min-w-0">
          <div className="truncate font-semibold text-foreground">{board.branch}</div>
          <div className="truncate text-xs text-muted-foreground">
            {board.manager} · {board.openTodayStatus}
          </div>
        </div>
      ),
    },
    {
      key: "attention",
      label: "Attention",
      type: "status",
      width: "120px",
      render: ({ board }) => pill(board.attentionLevel, board.attentionLevel),
    },
    {
      key: "health",
      label: "Health",
      type: "score",
      width: "88px",
      render: ({ board }) => <span className={cn("font-semibold", scoreTone(board.healthScore))}>{board.healthScore}%</span>,
    },
    {
      key: "risk",
      label: "Risk",
      type: "score",
      width: "88px",
      render: ({ board }) => <span className={cn("font-semibold", board.riskScore >= 70 ? "text-red-600" : board.riskScore >= 45 ? "text-amber-600" : "text-emerald-600")}>{board.riskScore}%</span>,
    },
    {
      key: "latestSignal",
      label: "Latest Exception",
      type: "text",
      width: "240px",
      render: ({ latestSignal }) => latestSignal?.riskReason || "No urgent exception",
    },
    {
      key: "sourceModule",
      label: "Source",
      type: "text",
      width: "150px",
      render: ({ latestSignal }) =>
        latestSignal ? (
          <span className="inline-flex rounded-full bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {latestSignal.sourceModule}
          </span>
        ) : (
          "All Clear"
        ),
    },
    {
      key: "overdue",
      label: "Overdue",
      type: "number",
      width: "86px",
      render: ({ board }) => board.overdueTasks,
    },
    {
      key: "incidents",
      label: "Incidents",
      type: "number",
      width: "86px",
      render: ({ board }) => board.openIncidents,
    },
    {
      key: "fefo",
      label: "FEFO",
      type: "number",
      width: "86px",
      render: ({ board }) => Math.round(board.fefoRisk),
    },
    {
      key: "readiness",
      label: "Readiness",
      type: "percent",
      width: "96px",
      render: ({ today }) => `${today?.readinessScore ?? 0}%`,
    },
  ];

  return (
    <ErpShell activeHref="/">
      <div className="space-y-5">
        <ErpPageHeader
          breadcrumbs={["ME", "Dashboard", "Operations Control Room"]}
          title="Operations Control Room"
          zhTitle="运营指挥台"
          subtitle="Give HQ one place to see which outlets need intervention now, why they need it, and which module to open next."
          actions={
            <>
              <Button size="sm" onClick={() => router.push("/branches")}>
                <Store className="size-4" />
                Branch Control
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/tasks")}>
                <ClipboardCheck className="size-4" />
                Outlet Execution
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/issues")}>
                <ShieldAlert className="size-4" />
                Incident Center
              </Button>
            </>
          }
        />

        <StatStrip stats={statStrip} />

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">Outlet Risk Control Grid</CardTitle>
                      <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        {controlRows.length}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sort outlets by risk, latest exception, and readiness. This is the first place HQ should look before opening module-specific pages.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push("/inspection")}>
                      <FileSearch className="size-4" />
                      Inspection
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push("/expiry")}>
                      <Flame className="size-4" />
                      FEFO
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push("/branches")}>
                      Open Branch Board
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ErpDataTable
                  columns={controlRoomColumns}
                  data={controlRows}
                  getRowId={(row) => row.board.row.id}
                  selectedId={selectedBoard?.row.id}
                  onRowSelect={(row) => setSelectedId(row.board.row.id)}
                  onOpenDetail={(row) => router.push(`/branches?branchId=${row.board.row.id}`)}
                  rowActions={(row) => (
                    <Button
                      type="button"
                      size="sm"
                      className="h-8"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (row.latestSignal) {
                          router.push(routeForSource(row.latestSignal.sourceModule, row.latestSignal.linkedRecordId));
                          return;
                        }
                        router.push(`/branches?branchId=${row.board.row.id}`);
                      }}
                    >
                      {row.latestSignal ? "Review" : "Inspect"}
                    </Button>
                  )}
                  emptyMessage="No branch records yet. Create branches first so HQ can monitor real operating risk."
                />
              </CardContent>
            </Card>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-base">Live Attention Queue</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Cross-module exceptions that require HQ review now. Use this queue when you are firefighting instead of hunting through five modules.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {attentionQueue.length ? (
                    attentionQueue.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => router.push(routeForSource(item.sourceModule, item.linkedRecordId))}
                        className="flex w-full items-start justify-between gap-3 rounded-xl border border-border p-3 text-left transition hover:border-primary/40 hover:bg-muted/30"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {item.severity === "Critical" ? (
                              <Siren className="size-4 text-red-600" />
                            ) : (
                              <AlertTriangle className="size-4 text-amber-600" />
                            )}
                            <div className="truncate font-semibold text-foreground">{item.branch}</div>
                          </div>
                          <div className="mt-1 text-sm text-foreground">{item.riskReason}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            {item.sourceModule}
                          </div>
                        </div>
                        {pill(item.severity, item.severity)}
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                      No urgent queue items. All current outlets are within normal operating tolerance.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-base">Module Pulse</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Use this when you need to jump straight into the module with the most pressure.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {[
                    {
                      label: "Branch Control",
                      value: `${healthBoard.filter((item) => item.attentionLevel !== "Healthy").length} need attention`,
                      route: "/branches",
                    },
                    {
                      label: "Outlet Execution",
                      value: `${kpis.find((item) => item.label === "Overdue Tasks")?.value || 0} overdue tasks`,
                      route: "/tasks",
                    },
                    {
                      label: "Store Inspection",
                      value: `${kpis.find((item) => item.label === "Failed Inspections")?.value || 0} failed inspections`,
                      route: "/inspection",
                    },
                    {
                      label: "Incident Center",
                      value: `${kpis.find((item) => item.label === "Open Incidents")?.value || 0} open incidents`,
                      route: "/issues",
                    },
                    {
                      label: "FEFO / Waste",
                      value: `${kpis.find((item) => item.label === "FEFO Risk")?.value || 0} risky batches`,
                      route: "/expiry",
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => router.push(item.route)}
                      className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-3 text-left transition hover:border-primary/40 hover:bg-muted/30"
                    >
                      <div>
                        <div className="font-semibold text-foreground">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.value}</div>
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="space-y-5">
            <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Outlet Inspector</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Keep the selected outlet context visible while you work across modules.
                    </p>
                  </div>
                  {selectedDetail ? pill(selectedDetail.attentionLevel, selectedDetail.attentionLevel) : null}
                </div>
              </CardHeader>

              <CardContent className="space-y-5 p-4">
                {selectedDetail ? (
                  <>
                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-lg font-semibold text-foreground">{selectedDetail.branchName}</div>
                          <div className="truncate text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            {selectedDetail.code} · {selectedDetail.region}
                          </div>
                        </div>
                        <ErpStatusBadge status={selectedBranch?.status || "Draft"} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-border bg-card px-3 py-2">
                          <div className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Health</div>
                          <div className={cn("mt-1 text-xl font-black", scoreTone(selectedDetail.healthScore))}>
                            {selectedDetail.healthScore}%
                          </div>
                        </div>
                        <div className="rounded-lg border border-border bg-card px-3 py-2">
                          <div className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Risk</div>
                          <div className={cn("mt-1 text-xl font-black", selectedDetail.riskScore >= 70 ? "text-red-600" : selectedDetail.riskScore >= 45 ? "text-amber-600" : "text-emerald-600")}>
                            {selectedDetail.riskScore}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        Today Snapshot
                      </div>
                      <div className="grid gap-2 text-sm">
                        {[
                          ["Open Today", selectedDetail.todayOperation.openTodayStatus],
                          ["Due Tasks", String(selectedDetail.todayOperation.dueTasks)],
                          ["Pending Review", String(selectedDetail.todayOperation.pendingReview)],
                          ["Inspection", selectedDetail.todayOperation.inspectionStatus],
                          ["Critical Incident", selectedDetail.todayOperation.criticalIncident],
                          ["Expiring Items", String(selectedDetail.todayOperation.expiringItems)],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-semibold text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        Next Actions
                      </div>
                      <div className="space-y-2">
                        {selectedNextActions.length ? (
                          selectedNextActions.slice(0, 4).map((action) => (
                            <button
                              key={action.actionId}
                              type="button"
                              onClick={() => openActionRoute(router, action)}
                              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border px-3 py-3 text-left transition hover:border-primary/40 hover:bg-muted/30"
                            >
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-foreground">{action.label}</div>
                                <div className="truncate text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                  {action.sourceModule}
                                </div>
                              </div>
                              {pill(action.severity, action.severity)}
                            </button>
                          ))
                        ) : (
                          <div className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
                            No urgent next actions for this outlet.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        Setup Gaps
                      </div>
                      {selectedDetail.missingSetupItems.length ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedDetail.missingSetupItems.map((item) => (
                            <Badge key={item} variant="outline">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                          No setup blockers on this outlet.
                        </div>
                      )}
                    </div>

                    <Button className="w-full" onClick={() => selectedBranch ? router.push(`/branches?branchId=${selectedBranch.id}`) : undefined}>
                      Open Branch Control
                    </Button>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    No outlet selected yet. Register a branch and start feeding execution, inspection, incident, and FEFO data.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </ErpShell>
  );
}
