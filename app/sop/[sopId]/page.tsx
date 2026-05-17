"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  Copy,
  GraduationCap,
  History,
  Pencil,
  ScrollText,
  Trash2,
  Users,
} from "lucide-react";

import { ErpShell } from "@/components/erp/erp-shell";
import { SopDocumentHeader } from "@/components/sop/sop-document-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ModuleRow } from "@/components/module/module-page-shell";
import { useMeRuntimeStore } from "@/stores/me-runtime";

type ReaderActionPanel = "draft" | "publish" | "duplicate" | "delete" | "training" | "activity" | "audit" | null;

type SopBlock = {
  id: string;
  type: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  pdfUrl?: string;
};

type SopPage = {
  id: string;
  pageNo: number;
  title: string;
  blocks: SopBlock[];
};

type SopContent = {
  mode: string;
  pages: SopPage[];
};

function detailValue(row: ModuleRow | undefined, label: string) {
  return row?.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function upsertDetail(items: ModuleRow["detailItems"], label: string, value: string) {
  const next = [...(items ?? [])];
  const index = next.findIndex((item) => item.label === label);

  if (index >= 0) next[index] = { label, value };
  else next.push({ label, value });

  return next;
}

function auditActorFromDetail(detail: string) {
  const match = detail.match(/\bBy\s+(.+)$/i);
  return match?.[1]?.trim() || "System / older event";
}

function auditDetailWithoutActor(detail: string) {
  return detail.replace(/\s*·\s*By\s+.+$/i, "");
}

function blockText(value: unknown): string {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String((item as { text?: unknown }).text || "");
        }

        return "";
      })
      .filter(Boolean)
      .join("");
  }

  return "";
}

function parseSopContent(sop: ModuleRow | undefined): SopContent {
  const raw = detailValue(sop, "SOP Content JSON");

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as {
        mode?: string;
        source?: string;
        pages?: Array<{
          id?: string;
          pageNo?: number;
          title?: string;
          blocks?: SopBlock[];
        }>;
        blocks?: unknown[];
        plainText?: string;
      };

      if (parsed.source === "blocknote") {
        const blocks = (parsed.blocks ?? [])
          .map((block, index): SopBlock | null => {
            const record = block as Record<string, unknown>;
            const type = String(record.type || "paragraph");
            const props = (record.props || {}) as Record<string, unknown>;
            const text = blockText(record.content).trim();
            const id = String(record.id || `blocknote-${index + 1}`);

            if (!text && !props.url && !props.name) return null;

            if (type.includes("heading")) {
              return { id, type: "heading", title: text || "Section" };
            }

            if (type === "image" || type === "video") {
              return {
                id,
                type: "image",
                title: text || "Media",
                imageUrl: String(props.url || ""),
              };
            }

            if (type === "file") {
              return {
                id,
                type: "pdf",
                title: text || String(props.name || "Attachment"),
                pdfUrl: String(props.url || ""),
              };
            }

            return { id, type: "text", body: text };
          })
          .filter(Boolean) as SopBlock[];

        return {
          mode: "Interactive Book",
          pages: [
            {
              id: "document",
              pageNo: 1,
              title: "Document",
              blocks: blocks.length
                ? blocks
                : [{ id: "empty", type: "text", body: parsed.plainText || "No SOP content yet." }],
            },
          ],
        };
      }

      if (Array.isArray(parsed.pages) && parsed.pages.length) {
        return {
          mode: parsed.mode || "Interactive Book",
          pages: parsed.pages.map((page, index) => ({
            id: page.id || `page-${index + 1}`,
            pageNo: page.pageNo || index + 1,
            title: page.title || `Page ${index + 1}`,
            blocks: Array.isArray(page.blocks) && page.blocks.length ? page.blocks : [],
          })),
        };
      }
    } catch {
      // Fall through to default reader content.
    }
  }

  return {
    mode: "Interactive Book",
    pages: [
      {
        id: "document",
        pageNo: 1,
        title: "Document",
        blocks: [
          {
            id: "empty",
            type: "text",
            body: sop?.detailNote || "No SOP content yet. Use Edit / Builder to write this SOP.",
          },
        ],
      },
    ],
  };
}

function readCountFromTask(task: ModuleRow) {
  const direct = detailValue(task, "Read Count") || detailValue(task, "View Count") || detailValue(task, "Read Attempts");

  if (direct) {
    const parsed = Number(direct);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return detailValue(task, "Last Read") || detailValue(task, "Completed At") ? 1 : 0;
}

function FieldLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="max-w-[62%] text-right font-medium">{value || "—"}</div>
    </div>
  );
}

function InspectorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b px-4 py-4 last:border-b-0">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </div>
      {children}
    </section>
  );
}

function ReaderActivityRow({ task }: { task: ModuleRow }) {
  const readCount = readCountFromTask(task);
  const lastRead = detailValue(task, "Last Read") || detailValue(task, "Completed At") || "Not read";
  const ackStatus =
    detailValue(task, "Acknowledgement Status") ||
    detailValue(task, "Ack Status") ||
    task.status ||
    "Pending";
  const outlet = detailValue(task, "Branch") || detailValue(task, "Outlet") || task.subtitle || "All Branches";
  const examScore = detailValue(task, "Exam Score") || detailValue(task, "Score");

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_86px] gap-3 border-b py-3 text-sm last:border-b-0">
      <div className="min-w-0">
        <div className="truncate font-medium">{detailValue(task, "Reader") || detailValue(task, "Staff") || task.title}</div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{outlet}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">Reads</div>
        <div className="font-semibold">{readCount}</div>
      </div>
      <div className="text-right">
        <div className="truncate text-xs text-muted-foreground">{lastRead}</div>
        <div className="truncate text-xs font-medium">{ackStatus}</div>
        {examScore ? <div className="truncate text-xs text-muted-foreground">Exam {examScore}</div> : null}
      </div>
    </div>
  );
}

function renderBlock(block: SopBlock) {
  if (block.type === "heading") {
    return (
      <section key={block.id} className="border-b py-6">
        <h2 className="text-2xl font-semibold tracking-tight">{block.title}</h2>
      </section>
    );
  }

  if (block.type === "image") {
    return (
      <section key={block.id} className="border-b py-6">
        {block.title ? <div className="mb-3 text-lg font-semibold">{block.title}</div> : null}
        {block.imageUrl ? (
          <img src={block.imageUrl} alt={block.title || "SOP media"} className="max-h-[420px] rounded-2xl border object-contain" />
        ) : (
          <div className="rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">Media attachment</div>
        )}
      </section>
    );
  }

  if (block.type === "pdf") {
    return (
      <section key={block.id} className="border-b py-6">
        <div className="text-lg font-semibold">{block.title || "PDF Attachment"}</div>
        <div className="mt-2 rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
          {block.pdfUrl || "PDF attachment not available in local preview."}
        </div>
      </section>
    );
  }

  return (
    <section key={block.id} className="border-b py-5">
      {block.title ? <h3 className="mb-2 text-lg font-semibold">{block.title}</h3> : null}
      <div className="whitespace-pre-wrap text-sm leading-7">{block.body || "No content in this section."}</div>
    </section>
  );
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const sopId = String(params?.sopId ?? "");
  const requestedReaderAction =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("action") : null;
  const initialReaderActionPanel: ReaderActionPanel =
    requestedReaderAction === "draft" ||
    requestedReaderAction === "publish" ||
    requestedReaderAction === "duplicate" ||
    requestedReaderAction === "delete" ||
    requestedReaderAction === "training" ||
    requestedReaderAction === "activity" ||
    requestedReaderAction === "audit"
      ? requestedReaderAction
      : null;

  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const deleteRecord = useMeRuntimeStore((state) => state.deleteRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const auditTrail = useMeRuntimeStore((state) => state.auditTrail);

  const [isMounted, setIsMounted] = useState(false);
  const [readerActionPanel, setReaderActionPanel] = useState<ReaderActionPanel>(initialReaderActionPanel);
  const [assignmentRole, setAssignmentRole] = useState("Outlet Staff");
  const [assignmentOutlet, setAssignmentOutlet] = useState("All Branches");
  const [assignmentDueDate, setAssignmentDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [actionMessage, setActionMessage] = useState("");
  const [currentActor, setCurrentActor] = useState(() => {
    if (typeof window === "undefined") return "Local user";
    return window.localStorage.getItem("me:sop:audit-actor") || window.localStorage.getItem("me:current-actor") || "Local user";
  });
  const [draftVersion, setDraftVersion] = useState("v1.1");
  const [draftEffectiveDate, setDraftEffectiveDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [draftSummary, setDraftSummary] = useState("");
  const [approvalNote, setApprovalNote] = useState("");

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("me:sop:audit-actor", currentActor);
    window.localStorage.setItem("me:current-actor", currentActor);
  }, [currentActor]);

  const sopRows = getRows("sop", []);
  const taskRows = getRows("tasks", []);
  const sop = sopRows.find((row) => row.id === sopId);

  const content = parseSopContent(sop);
  const pages = content.pages;
  const activePage = pages[0];

  const detail = {
      code:
        detailValue(sop, "Document Code") ||
        detailValue(sop, "SOP Code") ||
        detailValue(sop, "Code") ||
        "Not Set",
      category: detailValue(sop, "Category") || "Kitchen",
      processArea: detailValue(sop, "Process Area") || "Operations",
      version: detailValue(sop, "Version") || "v1.0",
      status: sop?.status || detailValue(sop, "Status") || "Draft",
      owner: sop?.owner || detailValue(sop, "Owner") || "SOP Control",
      approver: detailValue(sop, "Approver") || "Unassigned",
      effective: detailValue(sop, "Effective Date") || detailValue(sop, "Effective") || "Not Set",
      reviewDue: detailValue(sop, "Review Due") || "Not Set",
      targetRole: detailValue(sop, "Target Role") || "Outlet Staff",
      targetOutlet: detailValue(sop, "Target Outlet") || detailValue(sop, "Target Branch") || "All Branches",
      acknowledgement: detailValue(sop, "Acknowledgement") || detailValue(sop, "Acknowledgement Status") || "Pending",
      exam: detailValue(sop, "Linked Exam") || detailValue(sop, "Exam") || "Not Set",
      passMark: detailValue(sop, "Pass Mark") || "Not Set",
      approvalStatus: detailValue(sop, "Approval Status") || "Not Set",
      changedBy: detailValue(sop, "Changed By") || detailValue(sop, "Published By") || detailValue(sop, "Approved By") || "Not Set",
  };

  const sourceSopId = detailValue(sop, "Source SOP ID") || detailValue(sop, "Draft Of SOP ID");
  const sourceSop = sourceSopId ? sopRows.find((row) => row.id === sourceSopId) : undefined;
  const isDraftVersion = Boolean(sourceSopId) || /draft version|pending approval/i.test(detail.status);

  const linkedTrainingTasks = sop
    ? taskRows.filter((task) => {
      const linkedSopId = detailValue(task, "Linked SOP ID");
      const linkedSop = detailValue(task, "Linked SOP");
      return linkedSopId === sop.id || linkedSop === sop.title;
    })
    : [];

  const relatedVersions = (() => {
    if (!sop) return [];

    return sopRows.filter((row) => {
      const rowSourceId = detailValue(row, "Source SOP ID") || detailValue(row, "Draft Of SOP ID");
      return row.id === sop.id || row.id === sourceSopId || rowSourceId === sop.id || rowSourceId === sourceSopId;
    });
  })();

  const assignmentSummary = (() => {
    const assigned = linkedTrainingTasks.length;
    const read = linkedTrainingTasks.filter((task) => readCountFromTask(task) > 0).length;
    const acknowledged = linkedTrainingTasks.filter((task) =>
      /ack|complete|done|submitted/i.test(detailValue(task, "Acknowledgement Status") || task.status || ""),
    ).length;
    const overdue = linkedTrainingTasks.filter((task) =>
      /overdue/i.test(detailValue(task, "Acknowledgement Status") || task.status || ""),
    ).length;
    const notRead = Math.max(assigned - read, 0);
    const readRate = assigned ? Math.round((read / assigned) * 100) : 0;

    return { assigned, read, notRead, acknowledged, overdue, readRate };
  })();

  const relevantAuditTrail = (() => {
    if (!sop) return [];

    return auditTrail
      .filter((event) => {
        if (event.moduleKey !== "sop" && event.moduleKey !== "tasks") return false;
        return (
          event.detail.includes(sop.id) ||
          event.detail.includes(sop.title) ||
          Boolean(sourceSopId && event.detail.includes(sourceSopId))
        );
      })
      .slice(0, 16);
  })();

  async function handleCreateDraftVersion() {
    if (!sop) return;

    const nextVersion = draftVersion.trim() || "vNext";
    let draftDetails = [...(sop.detailItems ?? [])];
    draftDetails = upsertDetail(draftDetails, "Source SOP ID", sourceSopId || sop.id);
    draftDetails = upsertDetail(draftDetails, "Draft Of SOP ID", sourceSopId || sop.id);
    draftDetails = upsertDetail(draftDetails, "Based On Version", detail.version);
    draftDetails = upsertDetail(draftDetails, "Version", nextVersion);
    draftDetails = upsertDetail(draftDetails, "Status", "Draft Version");
    draftDetails = upsertDetail(draftDetails, "Approval Status", "Draft");
    draftDetails = upsertDetail(draftDetails, "Effective Date", draftEffectiveDate);
    draftDetails = upsertDetail(draftDetails, "Change Summary", draftSummary || "Draft version created");
    draftDetails = upsertDetail(draftDetails, "Changed By", currentActor);
    draftDetails = upsertDetail(draftDetails, "Draft Created At", new Date().toISOString());

    const created = await createRecordWithPayload("sop", {
      title: `${sop.title} ${nextVersion}`,
      subtitle: `Draft version of ${sourceSop?.title || sop.title}`,
      status: "Draft Version",
      owner: currentActor,
      detailItems: draftDetails,
      detailNote: sop.detailNote,
      nextAction: "Review Draft",
    });

    await logAction(
      "sop",
      "create-draft-version",
      `Created draft version ${created.title} (${created.id}) from ${sop.title} (${sop.id}) · By ${currentActor}`,
    );
    router.push(`/sop/${created.id}`);
  }

  async function handlePublishDraftVersion() {
    if (!sop) return;

    const now = new Date().toISOString();
    let draftDetails = [...(sop.detailItems ?? [])];
    draftDetails = upsertDetail(draftDetails, "Status", "Published");
    draftDetails = upsertDetail(draftDetails, "Approval Status", "Approved");
    draftDetails = upsertDetail(draftDetails, "Approved By", currentActor);
    draftDetails = upsertDetail(draftDetails, "Approval Note", approvalNote || "Approved and published");
    draftDetails = upsertDetail(draftDetails, "Published By", currentActor);
    draftDetails = upsertDetail(draftDetails, "Published At", now);
    draftDetails = upsertDetail(draftDetails, "Effective Date", draftEffectiveDate || detail.effective || new Date().toISOString().slice(0, 10));

    await updateRecord("sop", sop.id, {
      status: "Published",
      owner: currentActor,
      detailItems: draftDetails,
      nextAction: "Assign Training",
    });

    if (sourceSop) {
      let sourceDetails = upsertDetail(sourceSop.detailItems, "Superseded By SOP ID", sop.id);
      sourceDetails = upsertDetail(sourceDetails, "Superseded At", now);
      sourceDetails = upsertDetail(sourceDetails, "Superseded By", currentActor);
      await updateRecord("sop", sourceSop.id, {
        status: "Archived",
        detailItems: sourceDetails,
        nextAction: "View New Version",
      });
    }

    await logAction(
      "sop",
      "publish-draft-version",
      `Published SOP version ${sop.title} (${sop.id})${sourceSop ? ` replacing ${sourceSop.title} (${sourceSop.id})` : ""} · By ${currentActor}`,
    );
    setActionMessage("Draft version approved and published.");
    setReaderActionPanel("audit");
  }

  async function handleDuplicateSop() {
    if (!sop) return;

    let copiedDetails = upsertDetail(sop.detailItems, "Duplicated From SOP ID", sop.id);
    copiedDetails = upsertDetail(copiedDetails, "Changed By", currentActor);
    const created = await createRecordWithPayload("sop", {
      title: `${sop.title} Copy`,
      subtitle: sop.subtitle,
      status: "Draft",
      owner: currentActor,
      detailItems: upsertDetail(copiedDetails, "Status", "Draft"),
      detailNote: sop.detailNote,
      nextAction: "Open SOP",
    });

    await logAction("sop", "duplicate", `Duplicated SOP ${sop.title} (${sop.id}) to ${created.id} · By ${currentActor}`);
    router.push(`/sop/${created.id}`);
  }

  async function handleDeleteSop() {
    if (!sop) return;

    await logAction("sop", "delete-request", `Deleting SOP ${sop.title} (${sop.id}) · By ${currentActor}`);
    await deleteRecord("sop", sop.id);
    router.push("/sop");
  }

  async function handleAssignTraining() {
    if (!sop) return;

    const created = await createRecordWithPayload("tasks", {
      title: `Training: ${sop.title}`,
      subtitle: `${assignmentRole} · ${assignmentOutlet}`,
      status: "Pending",
      owner: "SOP Control",
      detailItems: [
        { label: "Type", value: "SOP Training" },
        { label: "Linked SOP ID", value: sop.id },
        { label: "Linked SOP", value: sop.title },
        { label: "Target Role", value: assignmentRole },
        { label: "Branch", value: assignmentOutlet },
        { label: "Due Date", value: assignmentDueDate },
        { label: "Read Count", value: "0" },
        { label: "Acknowledgement Status", value: "Pending" },
        { label: "Completion Status", value: "Open" },
        { label: "Assigned By", value: currentActor },
      ],
      detailNote: `Read and acknowledge SOP: ${sop.title}`,
      nextAction: "Read SOP",
    });

    await logAction(
      "sop",
      "assign-training",
      `Assigned SOP training ${created.id} for ${sop.title} (${sop.id}) to ${assignmentRole} / ${assignmentOutlet} · By ${currentActor}`,
    );
    setActionMessage("Training task created and linked to this SOP.");
    setReaderActionPanel("activity");
  }

  if (!isMounted) {
    return (
      <ErpShell>
        <div className="flex h-[calc(100vh-56px)] items-center justify-center bg-background">
          <div className="rounded-2xl border bg-card px-6 py-5 text-sm text-muted-foreground shadow-xs">
            Loading SOP reader...
          </div>
        </div>
      </ErpShell>
    );
  }

  if (!sop) {
    return (
      <ErpShell>
        <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center gap-3 bg-background p-6 text-center">
          <ScrollText className="h-8 w-8 text-muted-foreground" />
          <div className="text-lg font-semibold">SOP not found</div>
          <p className="max-w-md text-sm text-muted-foreground">
            This SOP may have been deleted or is not available in the local runtime store.
          </p>
          <Button onClick={() => router.push("/sop")}>Back to SOP Library</Button>
        </div>
      </ErpShell>
    );
  }

  return (
    <ErpShell>
      <div className="sop-reader-route-shell relative -m-4 h-[calc(100vh-56px)] min-h-0 overflow-hidden bg-background">
        <div className="flex h-full min-h-0 flex-col">
          <SopDocumentHeader
            eyebrow={`SOP Library / ${detail.code}`}
            title={sop.title}
            badges={
              <>
                <Badge variant="secondary">{detail.status}</Badge>
                <Badge variant="secondary">{detail.version}</Badge>
                <Badge variant="secondary">{detail.acknowledgement}</Badge>
                {isDraftVersion ? (
                  <Badge className="border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Version Draft
                  </Badge>
                ) : null}
              </>
            }
            onBack={() => router.push("/sop")}
            actions={
              <>
                <Button variant="outline" onClick={() => router.push(`/sop?editSopId=${sop.id}`)}>
                  <Pencil className="h-4 w-4" />
                  Edit / Builder
                </Button>
                <Button variant="outline" onClick={() => setReaderActionPanel("training")}>
                  <GraduationCap className="h-4 w-4" />
                  Assign Training
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Actions
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>SOP Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/sop?editSopId=${sop.id}`)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit content
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReaderActionPanel("draft")}>
                      <History className="mr-2 h-4 w-4" />
                      Create draft version
                    </DropdownMenuItem>
                    {isDraftVersion ? (
                      <DropdownMenuItem onClick={() => setReaderActionPanel("publish")}>
                        <History className="mr-2 h-4 w-4" />
                        Approve / Publish draft
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onClick={() => setReaderActionPanel("duplicate")}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate SOP
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReaderActionPanel("training")}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Assign training
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReaderActionPanel("activity")}>
                      <Users className="mr-2 h-4 w-4" />
                      View reader activity
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReaderActionPanel("audit")}>
                      <History className="mr-2 h-4 w-4" />
                      Audit log / version history
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setReaderActionPanel("delete")} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete SOP
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            }
          />

          <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_360px] overflow-hidden">
            <aside className="min-h-0 overflow-y-auto border-r bg-muted/20">
              <div className="border-b px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Document</div>
                <div className="mt-2 font-semibold">Chapters</div>
              </div>
              <div className="space-y-1 p-3">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <span className="text-xs text-muted-foreground">{page.pageNo}</span>
                    <span className="truncate">{page.title}</span>
                  </button>
                ))}
              </div>
            </aside>

            <main className="min-h-0 overflow-y-auto">
              <article className="mx-auto max-w-4xl px-10 py-8">
                <div className="mb-8 text-sm text-muted-foreground">
                  <ScrollText className="mr-2 inline h-4 w-4" />
                  {detail.category} · {detail.processArea} · {content.mode}
                </div>

                <h2 className="text-4xl font-semibold tracking-tight">{sop.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                  Staff-facing SOP reader. Content stays in a clean document flow; management metadata stays in the inspector panel.
                </p>

                <div className="my-8 border-t" />

                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Chapter {activePage?.pageNo || 1}
                </div>
                <h3 className="mb-6 text-3xl font-semibold tracking-tight">{activePage?.title || "Document"}</h3>

                <div>{(activePage?.blocks?.length ? activePage.blocks : [{ id: "empty", type: "text", body: "No content yet." }]).map(renderBlock)}</div>
              </article>
            </main>

            <aside className="min-h-0 overflow-y-auto border-l bg-muted/10">
              <div className="sticky top-0 z-10 border-b bg-background/95 px-4 py-4 backdrop-blur">
                <div className="text-sm font-semibold">SOP Information</div>
                <div className="text-xs text-muted-foreground">Reader progress, assignment status, and governance.</div>
              </div>

              <InspectorSection title="Assignment Summary">
                <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Assigned</div>
                    <div className="mt-0.5 text-xl font-semibold">{assignmentSummary.assigned}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Read</div>
                    <div className="mt-0.5 text-xl font-semibold">{assignmentSummary.read}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Not Read</div>
                    <div className="mt-0.5 text-xl font-semibold">{assignmentSummary.notRead}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Acknowledged</div>
                    <div className="mt-0.5 text-xl font-semibold">{assignmentSummary.acknowledged}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                    <div className="mt-0.5 text-xl font-semibold">{assignmentSummary.overdue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Read Rate</div>
                    <div className="mt-0.5 text-xl font-semibold">{assignmentSummary.readRate}%</div>
                  </div>
                </div>
              </InspectorSection>

              <InspectorSection title="Training / Exam">
                <div className="divide-y">
                  <FieldLine label="Target Role" value={detail.targetRole} />
                  <FieldLine label="Target Outlet" value={detail.targetOutlet} />
                  <FieldLine label="Acknowledgement" value={detail.acknowledgement} />
                  <FieldLine label="Training Total" value={assignmentSummary.assigned} />
                  <FieldLine label="Completed" value={assignmentSummary.acknowledged} />
                  <FieldLine label="Exam" value={detail.exam} />
                  <FieldLine label="Pass Mark" value={detail.passMark} />
                </div>
              </InspectorSection>

              <InspectorSection title="Reader Activity">
                {linkedTrainingTasks.length ? (
                  <div>{linkedTrainingTasks.slice(0, 8).map((task) => <ReaderActivityRow key={task.id} task={task} />)}</div>
                ) : (
                  <div className="rounded-xl border border-dashed px-3 py-4 text-sm text-muted-foreground">
                    No reader activity yet. Assign training to start tracking read count, acknowledgement, and exam results.
                  </div>
                )}
              </InspectorSection>

              <InspectorSection title="Governance">
                <div className="divide-y">
                  <FieldLine label="Status" value={detail.status} />
                  <FieldLine label="Approval" value={detail.approvalStatus} />
                  <FieldLine label="Changed By" value={detail.changedBy} />
                  <FieldLine label="Owner" value={detail.owner} />
                  <FieldLine label="Approver" value={detail.approver} />
                  <FieldLine label="Effective" value={detail.effective} />
                  <FieldLine label="Review Due" value={detail.reviewDue} />
                </div>
              </InspectorSection>
            </aside>
          </div>
        </div>

        {readerActionPanel ? (
          <aside className="sop-reader-action-panel fixed right-4 top-[72px] z-50 flex h-[calc(100vh-96px)] w-[460px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4">
              <div>
                <div className="text-sm font-semibold">
                  {readerActionPanel === "draft"
                    ? "Create Draft Version"
                    : readerActionPanel === "publish"
                      ? "Approve / Publish Draft"
                      : readerActionPanel === "duplicate"
                        ? "Duplicate SOP"
                        : readerActionPanel === "delete"
                          ? "Delete SOP"
                          : readerActionPanel === "training"
                            ? "Assign Training"
                            : readerActionPanel === "activity"
                              ? "Reader Activity"
                              : "Audit Log"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {readerActionPanel === "draft"
                    ? "Prepare the next SOP version without changing the live SOP yet."
                    : readerActionPanel === "publish"
                      ? "Approve the draft and make it the active SOP version."
                      : readerActionPanel === "duplicate"
                        ? "Create a separate copy using the same SOP content and metadata."
                        : readerActionPanel === "delete"
                          ? "Remove this SOP from the library."
                          : readerActionPanel === "training"
                            ? "Create a linked training task for role/outlet tracking."
                            : readerActionPanel === "activity"
                              ? "Review reading progress and acknowledgement status."
                              : "See create, edit, duplicate, delete, and assignment history."}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActionMessage("");
                  setReaderActionPanel(null);
                }}
                className="rounded-full border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <label className="mb-4 block">
                <div className="mb-1 text-xs font-semibold text-muted-foreground">Current user / editor</div>
                <input
                  value={currentActor}
                  onChange={(event) => setCurrentActor(event.target.value)}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Who is making this change?"
                />
              </label>

              {actionMessage ? (
                <div className="mb-4 rounded-xl border bg-muted/40 px-3 py-2 text-sm font-medium">{actionMessage}</div>
              ) : null}

              {readerActionPanel === "draft" ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <div className="font-semibold">Create safe draft version</div>
                    <p className="mt-2 leading-6 text-muted-foreground">
                      This creates a separate draft record. Staff continue seeing the current SOP until the draft is approved and published.
                    </p>
                  </div>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">New Version</div>
                    <input
                      value={draftVersion}
                      onChange={(event) => setDraftVersion(event.target.value)}
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Effective Date</div>
                    <input
                      type="date"
                      value={draftEffectiveDate}
                      onChange={(event) => setDraftEffectiveDate(event.target.value)}
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Change Summary</div>
                    <textarea
                      value={draftSummary}
                      onChange={(event) => setDraftSummary(event.target.value)}
                      className="min-h-24 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="What will change in this version?"
                    />
                  </label>

                  <Button className="w-full" onClick={handleCreateDraftVersion}>
                    <History className="h-4 w-4" />
                    Create Draft Version
                  </Button>
                </div>
              ) : null}

              {readerActionPanel === "publish" ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <div className="font-semibold">Approve and publish draft</div>
                    <p className="mt-2 leading-6 text-muted-foreground">
                      This marks the draft as Published and archives the source SOP when available.
                    </p>
                  </div>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Publish Effective Date</div>
                    <input
                      type="date"
                      value={draftEffectiveDate}
                      onChange={(event) => setDraftEffectiveDate(event.target.value)}
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Approval Note</div>
                    <textarea
                      value={approvalNote}
                      onChange={(event) => setApprovalNote(event.target.value)}
                      className="min-h-24 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Approval note / reason"
                    />
                  </label>

                  <Button className="w-full" onClick={handlePublishDraftVersion}>
                    <History className="h-4 w-4" />
                    Approve / Publish Draft
                  </Button>
                </div>
              ) : null}

              {readerActionPanel === "duplicate" ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <div className="font-semibold">Duplicate current SOP</div>
                    <p className="mt-2 leading-6 text-muted-foreground">
                      This creates a new Draft SOP with the same content, metadata, and reader settings. It does not affect this SOP.
                    </p>
                  </div>
                  <Button className="w-full" onClick={handleDuplicateSop}>
                    <Copy className="h-4 w-4" />
                    Duplicate SOP
                  </Button>
                </div>
              ) : null}

              {readerActionPanel === "delete" ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <div className="font-semibold text-destructive">Delete this SOP?</div>
                    <p className="mt-2 leading-6 text-muted-foreground">
                      This removes the SOP from the local runtime library and records the action in audit log.
                    </p>
                  </div>
                  <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteSop}>
                    <Trash2 className="h-4 w-4" />
                    Confirm Delete
                  </Button>
                </div>
              ) : null}

              {readerActionPanel === "training" ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <div className="font-semibold">Assign training</div>
                    <p className="mt-2 leading-6 text-muted-foreground">
                      This creates a linked training task so the SOP can start tracking read count and acknowledgement status.
                    </p>
                  </div>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Target Role</div>
                    <input
                      value={assignmentRole}
                      onChange={(event) => setAssignmentRole(event.target.value)}
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Target Outlet</div>
                    <input
                      value={assignmentOutlet}
                      onChange={(event) => setAssignmentOutlet(event.target.value)}
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Due Date</div>
                    <input
                      type="date"
                      value={assignmentDueDate}
                      onChange={(event) => setAssignmentDueDate(event.target.value)}
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <Button className="w-full" onClick={handleAssignTraining}>
                    <GraduationCap className="h-4 w-4" />
                    Create Training Assignment
                  </Button>
                </div>
              ) : null}

              {readerActionPanel === "activity" ? (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border p-3">
                      <div className="text-xs text-muted-foreground">Assigned</div>
                      <div className="mt-1 text-xl font-semibold">{assignmentSummary.assigned}</div>
                    </div>
                    <div className="rounded-xl border p-3">
                      <div className="text-xs text-muted-foreground">Read</div>
                      <div className="mt-1 text-xl font-semibold">{assignmentSummary.read}</div>
                    </div>
                    <div className="rounded-xl border p-3">
                      <div className="text-xs text-muted-foreground">Not Read</div>
                      <div className="mt-1 text-xl font-semibold">{assignmentSummary.notRead}</div>
                    </div>
                    <div className="rounded-xl border p-3">
                      <div className="text-xs text-muted-foreground">Read Rate</div>
                      <div className="mt-1 text-xl font-semibold">{assignmentSummary.readRate}%</div>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    {linkedTrainingTasks.length ? (
                      <div>{linkedTrainingTasks.map((task) => <ReaderActivityRow key={task.id} task={task} />)}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No reader activity yet.</div>
                    )}
                  </div>
                </div>
              ) : null}

              {readerActionPanel === "audit" ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <div className="font-semibold">Version History</div>
                    <div className="mt-3 space-y-2">
                      {relatedVersions.length ? (
                        relatedVersions.map((version) => (
                          <button
                            key={version.id}
                            type="button"
                            onClick={() => router.push(`/sop/${version.id}`)}
                            className="flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left hover:bg-muted"
                          >
                            <span className="min-w-0">
                              <span className="block truncate font-medium">{version.title}</span>
                              <span className="block text-xs text-muted-foreground">
                                {detailValue(version, "Version") || "v1.0"} · {version.status}
                              </span>
                            </span>
                            <span className="text-xs text-muted-foreground">Open</span>
                          </button>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No linked versions yet.</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {relevantAuditTrail.length ? (
                      relevantAuditTrail.map((event) => (
                        <div key={event.id} className="rounded-xl border p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">{event.action}</div>
                            <div className="text-xs text-muted-foreground">{new Date(event.at).toLocaleString()}</div>
                          </div>
                          <div className="mt-1 text-xs font-medium">By: {auditActorFromDetail(event.detail)}</div>
                          <div className="mt-2 leading-6 text-muted-foreground">{auditDetailWithoutActor(event.detail)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed px-3 py-4 text-sm text-muted-foreground">
                        No audit events found for this SOP yet.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </ErpShell>
  );
}
