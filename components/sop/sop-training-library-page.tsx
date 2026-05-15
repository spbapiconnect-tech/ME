"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  ChevronDown,
  FileQuestion,
  GraduationCap,
  Library,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { ErpShell } from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ModuleRow } from "@/components/module/module-page-shell";
import { cn } from "@/lib/utils";
import {
  getAcknowledgementStatusTone,
  getLinkedTemplateSummary,
  getSopKpis,
  getSopLifecycleTone,
  getTemplateGeneratorQueue,
  getTrainingAcknowledgementQueue,
  getTrainingCompletionSummary,
} from "@/lib/store-operations/sop-training-workspace";
import { useMeRuntimeStore } from "@/stores/me-runtime";
import { SopTrainingControlPage } from "@/components/sop/sop-training-control-page";

type TabKey = "library" | "training" | "exams" | "readers";
type StatusFilterKey = "all" | "effective" | "need-review" | "draft-review" | "training-pending" | "training-overdue";
type ExtraFilterKey = "has-exam" | "missing-template" | "ack-required";

type MatrixRecord = Record<string, ReactNode> & {
  id: string;
  sopId?: string;
  status?: string;
  acknowledgementStatus?: string;
  pending?: ReactNode;
  overdue?: ReactNode;
  missingTemplate?: boolean;
};

type MatrixColumn<T extends MatrixRecord> = {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
};

const PAGE_SIZE = 20;

function detailValue(row: ModuleRow | undefined, label: string) {
  return row?.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function statusBadge(status: string | undefined) {
  return <Badge variant={getSopLifecycleTone(status || "Draft")}>{status || "Draft"}</Badge>;
}

function acknowledgementBadge(status: string | undefined) {
  return <Badge variant={getAcknowledgementStatusTone(status || "Pending")}>{status || "Pending"}</Badge>;
}

function numberValue(value: ReactNode) {
  const numeric = String(value ?? "0").replace(/[^0-9.-]/g, "");
  const parsed = Number(numeric || "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function actionCell(row: MatrixRecord, openLegacyTools: () => void) {
  const sopId = row.sopId || row.id.replace(/^exam-/, "").replace(/^training-/, "").replace(/^reader-/, "");
  const href = sopId ? `/sop/${sopId}` : "/sop";

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild size="sm" variant="outline" className="h-8 px-3">
        <Link href={href}>Read</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <span className="sr-only">Open actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={href}>Read SOP</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openLegacyTools}>Edit / Builder</DropdownMenuItem>
          <DropdownMenuItem onClick={openLegacyTools}>Assign Training</DropdownMenuItem>
          <DropdownMenuItem onClick={openLegacyTools}>Publish / Template</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function FixedMatrixTable<T extends MatrixRecord>({
  title,
  subtitle,
  columns,
  rows,
  emptyLabel = "No record in this slot",
}: {
  title: string;
  subtitle?: string;
  columns: MatrixColumn<T>[];
  rows: T[];
  emptyLabel?: string;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);
  const emptyRows = Math.max(0, PAGE_SIZE - pageRows.length);

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          {subtitle ? <div className="truncate text-xs text-muted-foreground">{subtitle}</div> : null}
        </div>
        <Badge variant="outline" className="shrink-0">20 / page</Badge>
      </div>

      <div className="max-h-[72vh] overflow-auto">
        <Table className="min-w-[1240px] table-fixed">
          <TableHeader>
            <TableRow className="h-10 bg-muted/35 hover:bg-muted/35">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  style={column.width ? { width: column.width } : undefined}
                  className={cn(
                    "sticky top-0 z-20 h-10 border-b bg-background px-3 align-middle text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                  )}
                >
                  <span className="block truncate">{column.label}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id} className="h-12">
                {columns.map((column) => {
                  const value = column.render ? column.render(row) : row[column.key as keyof T];

                  return (
                    <TableCell
                      key={String(column.key)}
                      className={cn(
                        "h-12 px-3 py-2 align-middle text-sm leading-5 whitespace-nowrap",
                        column.align === "right" && "text-right tabular-nums",
                        column.align === "center" && "text-center",
                      )}
                    >
                      <span className="block truncate">{value || "—"}</span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}

            {Array.from({ length: emptyRows }).map((_, index) => (
              <TableRow key={`empty-${index}`} className="h-12 bg-muted/[0.08]">
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={`${String(column.key)}-${index}`}
                    className={cn(
                      "h-12 px-3 py-2 align-middle text-sm text-muted-foreground/45 whitespace-nowrap",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                    )}
                  >
                    <span className="block truncate">{columnIndex === 0 ? emptyLabel : "—"}</span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground">
        <span>
          {rows.length ? `${start + 1}-${Math.min(start + PAGE_SIZE, rows.length)} of ${rows.length}` : "0 records"} · fixed {PAGE_SIZE} listing slots
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={safePage <= 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
          >
            Prev
          </Button>
          <span className="tabular-nums">{safePage + 1} / {totalPages}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-1 p-4">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

export function SopTrainingLibraryPage() {
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);

  const sopRows = getRows("sop", []);
  const taskRows = getRows("tasks", []);

  const [activeTab, setActiveTab] = useState<TabKey>("library");
  const [searchTerm, setSearchTerm] = useState("");
  const [legacyMode, setLegacyMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterKey>("all");
  const [extraFilters, setExtraFilters] = useState<ExtraFilterKey[]>([]);

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const kpis = useMemo(() => getSopKpis(sopRows, taskRows), [sopRows, taskRows]);
  const templateQueue = useMemo(() => getTemplateGeneratorQueue(sopRows), [sopRows]);
  const trainingQueue = useMemo(() => getTrainingAcknowledgementQueue(sopRows, taskRows), [sopRows, taskRows]);

  function toggleExtraFilter(key: ExtraFilterKey) {
    setExtraFilters((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  const libraryRows = useMemo<MatrixRecord[]>(() => {
    return sopRows.map((row) => {
      const training = getTrainingCompletionSummary(row, taskRows);
      const templates = getLinkedTemplateSummary(row);
      const hasExam = detailValue(row, "Linked Exam") || detailValue(row, "Exam");

      return {
        id: row.id,
        sopId: row.id,
        code: detailValue(row, "Document Code") || row.id,
        title: row.title,
        category: detailValue(row, "Category") || "Unsorted",
        processArea: detailValue(row, "Process Area") || row.subtitle || "Operations",
        version: detailValue(row, "Version") || "v1.0",
        status: row.status,
        owner: detailValue(row, "Process Owner") || row.owner || "Unassigned",
        targetRole: detailValue(row, "Target Role") || "All Roles",
        training: training.total ? `${training.completed}/${training.total}` : "Not Assigned",
        pending: training.pending,
        overdue: training.overdue,
        exam: hasExam || "Not Set",
        readers: training.total ? `${training.pending} pending` : "0",
        templates: `${templates.checklist}/${templates.inspection}/${templates.task}`,
        missingTemplate: templates.checklist === 0 || templates.inspection === 0 || templates.task === 0,
        acknowledgementStatus: detailValue(row, "Acknowledgement Status") || "Not Required",
        reviewDue: detailValue(row, "Review Due Date") || "Not Set",
        action: actionCell({ id: row.id, sopId: row.id }, () => setLegacyMode(true)),
      };
    });
  }, [sopRows, taskRows]);

  const trainingRows = useMemo<MatrixRecord[]>(() => {
    return trainingQueue.map((item) => ({
      id: `training-${item.row.id}`,
      sopId: item.row.id,
      training: item.row.title,
      version: item.version,
      outlet: item.targetBranch,
      role: item.targetRole,
      acknowledgementStatus: item.acknowledgementStatus,
      pending: item.training.pending,
      overdue: item.training.overdue,
      completed: item.training.completed,
      rate: `${item.training.rate}%`,
      action: actionCell({ id: `training-${item.row.id}`, sopId: item.row.id }, () => setLegacyMode(true)),
    }));
  }, [trainingQueue]);

  const examRows = useMemo<MatrixRecord[]>(() => {
    return sopRows.map((row) => ({
      id: `exam-${row.id}`,
      sopId: row.id,
      sop: row.title,
      exam: detailValue(row, "Linked Exam") || detailValue(row, "Exam") || "Not Set",
      passMark: detailValue(row, "Pass Mark") || "Not Set",
      attemptLimit: detailValue(row, "Attempt Limit") || "Not Set",
      retakeRule: detailValue(row, "Retake Rule") || "Not Set",
      passed: detailValue(row, "Exam Passed") || "0",
      failed: detailValue(row, "Exam Failed") || "0",
      status: detailValue(row, "Exam Status") || "Not Configured",
      owner: detailValue(row, "Process Owner") || row.owner || "Unassigned",
      action: actionCell({ id: `exam-${row.id}`, sopId: row.id }, () => setLegacyMode(true)),
    }));
  }, [sopRows]);

  const readerRows = useMemo<MatrixRecord[]>(() => {
    const trainingTasks = taskRows.filter(
      (row) => detailValue(row, "Source") === "SOP & Training" || detailValue(row, "Linked SOP ID"),
    );

    return trainingTasks.map((row) => {
      const sopId = detailValue(row, "Linked SOP ID");
      return {
        id: `reader-${row.id}`,
        sopId,
        staff: row.owner || detailValue(row, "Role Target") || "Unassigned",
        outlet: detailValue(row, "Branch") || detailValue(row, "Outlets") || "All Branches",
        role: detailValue(row, "Role Target") || row.owner || "All Roles",
        sop: detailValue(row, "Linked SOP") || row.title,
        readStatus: detailValue(row, "Instruction Mode") ? "Assigned" : row.status,
        acknowledgementStatus: row.status,
        examStatus: detailValue(row, "Exam Status") || "Not Required",
        score: detailValue(row, "Score") || "—",
        dueDate: detailValue(row, "Due Date") || detailValue(row, "Due At") || "—",
        completedAt: detailValue(row, "Completed At") || "—",
        pending: row.status === "Completed" ? 0 : 1,
        overdue: row.status === "Overdue" ? 1 : 0,
        action: actionCell({ id: `reader-${row.id}`, sopId }, () => setLegacyMode(true)),
      };
    });
  }, [taskRows]);

  const rowsByTab = useMemo<Record<TabKey, MatrixRecord[]>>(() => ({
    library: libraryRows,
    training: trainingRows,
    exams: examRows,
    readers: readerRows,
  }), [libraryRows, trainingRows, examRows, readerRows]);

  const activeRows = useMemo(() => {
    const sourceRows = rowsByTab[activeTab];
    const needle = searchTerm.trim().toLowerCase();

    return sourceRows.filter((row) => {
      const searchMatch = !needle || Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle));
      if (!searchMatch) return false;

      const status = String(row.status ?? row.acknowledgementStatus ?? "").toLowerCase();
      const pending = numberValue(row.pending);
      const overdue = numberValue(row.overdue);
      const exam = String(row.exam ?? row.examStatus ?? "").toLowerCase();

      if (statusFilter === "effective" && !(status.includes("effective") || status.includes("completed"))) return false;
      if (statusFilter === "need-review" && !status.includes("review")) return false;
      if (statusFilter === "draft-review" && !(status.includes("draft") || status.includes("review"))) return false;
      if (statusFilter === "training-pending" && pending <= 0) return false;
      if (statusFilter === "training-overdue" && overdue <= 0) return false;

      if (extraFilters.includes("has-exam") && (!exam || exam.includes("not set") || exam.includes("not configured") || exam.includes("not required"))) return false;
      if (extraFilters.includes("missing-template") && !row.missingTemplate) return false;
      if (extraFilters.includes("ack-required") && !String(row.acknowledgementStatus ?? "").toLowerCase().includes("pending") && !String(row.acknowledgementStatus ?? "").toLowerCase().includes("assigned")) return false;

      return true;
    });
  }, [activeTab, extraFilters, rowsByTab, searchTerm, statusFilter]);

  const columnsByTab = useMemo<Record<TabKey, MatrixColumn<MatrixRecord>[]>>(() => ({
    library: [
      { key: "code", label: "SOP Code", width: "120px" },
      { key: "title", label: "SOP Title", width: "210px" },
      { key: "category", label: "Category", width: "120px" },
      { key: "processArea", label: "Process Area", width: "140px" },
      { key: "version", label: "Version", width: "80px", align: "center" },
      { key: "status", label: "Status", width: "120px", render: (row) => statusBadge(String(row.status || "Draft")) },
      { key: "owner", label: "Owner", width: "140px" },
      { key: "targetRole", label: "Target Role", width: "130px" },
      { key: "training", label: "Training", width: "110px", align: "center" },
      { key: "exam", label: "Exam", width: "120px" },
      { key: "readers", label: "Readers", width: "110px", align: "center" },
      { key: "templates", label: "C/I/T", width: "80px", align: "center" },
      { key: "reviewDue", label: "Review Due", width: "120px", align: "right" },
      { key: "action", label: "Action", width: "138px", align: "right" },
    ],
    training: [
      { key: "training", label: "Training Program", width: "230px" },
      { key: "version", label: "Version", width: "80px", align: "center" },
      { key: "outlet", label: "Outlet", width: "150px" },
      { key: "role", label: "Role", width: "130px" },
      { key: "acknowledgementStatus", label: "Ack", width: "120px", render: (row) => acknowledgementBadge(String(row.acknowledgementStatus || "Pending")) },
      { key: "pending", label: "Pending", width: "90px", align: "right" },
      { key: "overdue", label: "Overdue", width: "90px", align: "right" },
      { key: "completed", label: "Completed", width: "100px", align: "right" },
      { key: "rate", label: "Rate", width: "80px", align: "right" },
      { key: "action", label: "Action", width: "138px", align: "right" },
    ],
    exams: [
      { key: "sop", label: "Linked SOP", width: "220px" },
      { key: "exam", label: "Exam Paper", width: "180px" },
      { key: "passMark", label: "Pass Mark", width: "100px", align: "center" },
      { key: "attemptLimit", label: "Attempts", width: "90px", align: "center" },
      { key: "retakeRule", label: "Retake Rule", width: "130px" },
      { key: "passed", label: "Passed", width: "90px", align: "right" },
      { key: "failed", label: "Failed", width: "90px", align: "right" },
      { key: "status", label: "Status", width: "130px" },
      { key: "owner", label: "Owner", width: "130px" },
      { key: "action", label: "Action", width: "138px", align: "right" },
    ],
    readers: [
      { key: "staff", label: "Reader / Staff", width: "160px" },
      { key: "outlet", label: "Outlet", width: "150px" },
      { key: "role", label: "Role", width: "130px" },
      { key: "sop", label: "SOP / Training", width: "220px" },
      { key: "readStatus", label: "Read", width: "100px" },
      { key: "acknowledgementStatus", label: "Ack", width: "120px", render: (row) => acknowledgementBadge(String(row.acknowledgementStatus || "Pending")) },
      { key: "examStatus", label: "Exam", width: "120px" },
      { key: "score", label: "Score", width: "80px", align: "right" },
      { key: "dueDate", label: "Due", width: "120px", align: "right" },
      { key: "completedAt", label: "Completed", width: "120px", align: "right" },
      { key: "action", label: "Action", width: "138px", align: "right" },
    ],
  }), []);

  const tabs: Array<{ key: TabKey; label: string; icon: ReactNode; count: number }> = [
    { key: "library", label: "Library", icon: <Library className="h-4 w-4" />, count: libraryRows.length },
    { key: "training", label: "Training", icon: <GraduationCap className="h-4 w-4" />, count: trainingRows.length },
    { key: "exams", label: "Exams", icon: <FileQuestion className="h-4 w-4" />, count: examRows.length },
    { key: "readers", label: "Readers", icon: <Users className="h-4 w-4" />, count: readerRows.length },
  ];

  const statusLabels: Record<StatusFilterKey, string> = {
    all: "All Status",
    effective: "Effective",
    "need-review": "Need Review",
    "draft-review": "Draft / Review",
    "training-pending": "Training Pending",
    "training-overdue": "Training Overdue",
  };

  if (legacyMode) {
    return <SopTrainingControlPage />;
  }

  return (
    <ErpShell>
      <div className="space-y-5 p-4 pb-24 md:p-6">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              SOP & Training
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Library Control Center</h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Search, filter, read, edit, assign, and publish SOP files from one table. Only the table header is sticky.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setLegacyMode(true)}>
              <Plus className="h-4 w-4" />
              Create SOP
            </Button>
            <Button variant="outline" onClick={() => setLegacyMode(true)}>
              <Pencil className="h-4 w-4" />
              Open Builder
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          <SummaryCard label="Effective SOPs" value={kpis.find((item) => item.label === "Effective SOPs")?.value || "0"} />
          <SummaryCard label="Need Review" value={kpis.find((item) => item.label === "Need Review")?.value || "0"} />
          <SummaryCard label="Training Pending" value={kpis.find((item) => item.label === "Training Pending")?.value || "0"} />
          <SummaryCard label="Training Overdue" value={kpis.find((item) => item.label === "Training Overdue")?.value || "0"} />
          <SummaryCard label="Template Queue" value={String(templateQueue.filter((item) => item.checklistMissing || item.inspectionMissing || item.taskMissing).length)} />
          <SummaryCard label="Ack Queue" value={String(trainingQueue.length)} />
        </section>

        <section className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-[340px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-10 pl-9"
                  value={searchTerm}
                  placeholder="Search SOP / training / exam"
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 min-w-[150px] justify-between">
                    {statusLabels[statusFilter]}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(Object.entries(statusLabels) as Array<[StatusFilterKey, string]>).map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={statusFilter === key}
                      onCheckedChange={() => setStatusFilter(key)}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 min-w-[150px] justify-between">
                    More Filters
                    <Badge variant="secondary" className="ml-2">{extraFilters.length}</Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>More Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={extraFilters.includes("has-exam")} onCheckedChange={() => toggleExtraFilter("has-exam")}>
                    Has Exam
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={extraFilters.includes("missing-template")} onCheckedChange={() => toggleExtraFilter("missing-template")}>
                    Missing Template
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={extraFilters.includes("ack-required")} onCheckedChange={() => toggleExtraFilter("ack-required")}>
                    Ack Required
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setExtraFilters([]);
                    }}
                  >
                    Clear filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}>
                  <Badge
                    variant={activeTab === tab.key ? "secondary" : "outline"}
                    className="h-10 gap-2 rounded-lg px-3 text-sm"
                  >
                    {tab.icon}
                    {tab.label}
                    <span className="text-xs text-muted-foreground">{tab.count}</span>
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </section>

        <FixedMatrixTable
          title={tabs.find((tab) => tab.key === activeTab)?.label || "Library"}
          subtitle="Action column is restored but not sticky. Use Read or the row menu."
          columns={columnsByTab[activeTab]}
          rows={activeRows}
        />
      </div>
    </ErpShell>
  );
}
