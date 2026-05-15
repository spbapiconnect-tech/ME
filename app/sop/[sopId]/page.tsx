"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  ListChecks,
  Pencil,
  ScrollText,
} from "lucide-react";

import { ErpShell } from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  getAcknowledgementStatusTone,
  getLinkedTemplateSummary,
  getSopDetail,
  getSopLifecycleTone,
  getSopNextActions,
  getTrainingCompletionSummary,
  type SopPreviewBlock,
  type SopPreviewPage,
} from "@/lib/store-operations/sop-training-workspace";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";
import { SopTrainingControlPage } from "@/components/sop/sop-training-control-page";

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> } | undefined, label: string) {
  return row?.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function FieldLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid grid-cols-[132px_minmax(0,1fr)] gap-3 border-b py-2.5 text-sm last:border-b-0">
      <div className="text-muted-foreground">{label}</div>
      <div className="min-w-0 truncate font-medium">{value || "—"}</div>
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

function BlockView({ block }: { block: SopPreviewBlock }) {
  if (block.type === "heading") {
    return (
      <section className="border-b py-8">
        <h2 className="text-3xl font-semibold tracking-tight">{block.title || block.body || "Heading"}</h2>
        {block.body && block.title ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{block.body}</p>
        ) : null}
      </section>
    );
  }

  if (block.type === "warning") {
    return (
      <section className="border-b py-6">
        <div className="mb-2 text-sm font-semibold text-amber-500">{block.title || block.warningLevel || "Warning"}</div>
        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{block.body || "No warning content."}</p>
      </section>
    );
  }

  if (block.type === "step-list") {
    const steps = block.steps || [];
    return (
      <section className="border-b py-6">
        <div className="mb-4 flex items-center gap-2 text-base font-semibold">
          <ListChecks className="h-4 w-4" />
          {block.title || "Step by Step"}
        </div>
        <div className="divide-y rounded-xl border">
          {steps.length ? steps.map((step, index) => (
            <div key={step.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 px-4 py-3 text-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="whitespace-pre-wrap leading-6">{step.instruction}</div>
            </div>
          )) : (
            <div className="px-4 py-3 text-sm text-muted-foreground">No steps captured.</div>
          )}
        </div>
      </section>
    );
  }

  if (block.type === "checklist") {
    const items = block.checklistItems || [];
    return (
      <section className="border-b py-6">
        <div className="mb-4 flex items-center gap-2 text-base font-semibold">
          <ClipboardCheck className="h-4 w-4" />
          {block.title || "Checklist"}
        </div>
        <div className="divide-y rounded-xl border">
          {items.length ? items.map((item) => (
            <div key={item} className="flex items-start gap-3 px-4 py-3 text-sm">
              <span className="mt-1 h-4 w-4 rounded border bg-background" />
              <span className="leading-6">{item}</span>
            </div>
          )) : (
            <div className="px-4 py-3 text-sm text-muted-foreground">No checklist items captured.</div>
          )}
        </div>
      </section>
    );
  }

  if (block.type === "image" || block.type === "pdf") {
    return (
      <section className="border-b py-6">
        <div className="mb-3 text-base font-semibold">{block.title || (block.type === "pdf" ? "PDF Attachment" : "Media Attachment")}</div>
        <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
          {block.imageUrl || block.pdfUrl || "Attachment preview placeholder."}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b py-6">
      {block.title ? <div className="mb-3 text-base font-semibold">{block.title}</div> : null}
      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
        {block.body || "No text content captured."}
      </p>
    </section>
  );
}

function PageContent({ page }: { page: SopPreviewPage }) {
  return (
    <article id={page.id} className="scroll-mt-8">
      <section className="border-b py-8">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Chapter {page.pageNo}
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{page.title}</h2>
      </section>
      {page.blocks.map((block) => <BlockView key={block.id} block={block} />)}
    </article>
  );
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ sopId: string }>();
  const sopId = params?.sopId;

  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);

  const sopRows = getRows("sop", []);
  const taskRows = getRows("tasks", []);
  const [legacyMode, setLegacyMode] = useState(false);

  useEffect(() => {
    const shell = document.querySelector(".sop-reader-route-shell") as HTMLElement | null;
    const main = shell?.closest("main") as HTMLElement | null;
    const lockedTargets = [main].filter(Boolean) as HTMLElement[];

    for (const target of lockedTargets) {
      target.classList.add("sop-builder-main-lock");
      target.scrollTop = 0;
    }

    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      for (const target of lockedTargets) {
        target.scrollTop = 0;
      }

      window.scrollTo(0, 0);
    });

    return () => {
      for (const target of lockedTargets) {
        target.classList.remove("sop-builder-main-lock");
        target.scrollTop = 0;
      }

      window.scrollTo(0, 0);
    };
  }, []);

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const sop = sopRows.find((row) => row.id === sopId) ?? sopRows[0];
  const detail = useMemo(() => getSopDetail(sop), [sop]);
  const training = useMemo(() => getTrainingCompletionSummary(sop, taskRows), [sop, taskRows]);
  const templates = useMemo(() => getLinkedTemplateSummary(sop), [sop]);
  const nextActions = useMemo(() => getSopNextActions(sop), [sop]);

  if (legacyMode) {
    return <SopTrainingControlPage />;
  }

  if (!sop || !detail) {
    return (
      <ErpShell>
        <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-3 p-6 text-center">
          <ScrollText className="h-8 w-8 text-muted-foreground" />
          <div className="text-lg font-semibold">SOP not found</div>
          <p className="max-w-md text-sm text-muted-foreground">Return to the library and open another SOP record.</p>
          <Button asChild>
            <Link href="/sop">Back to SOP Library</Link>
          </Button>
        </div>
      </ErpShell>
    );
  }

  const pages: SopPreviewPage[] = detail.content.pages.length ? detail.content.pages : [
    {
      id: "empty-content",
      pageNo: 1,
      title: "No reader content yet",
      blocks: [
        {
          id: "empty-block",
          type: "text",
          title: "Content not built",
          body: "Use Edit / Builder to create staff-friendly SOP pages with steps, warnings, media, PDF, and checklist blocks.",
        },
      ],
    },
  ];

  return (
    <ErpShell>
      <div className="sop-reader-route-shell sop-builder-route-shell h-[calc(100vh-56px)] min-h-0 overflow-hidden bg-background">
        <div className="sop-builder-workspace flex h-full min-h-0 flex-col overflow-hidden bg-background">
          <div className="sop-builder-document-header shrink-0 border-b border-border bg-background px-4 py-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => router.push("/sop")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground">
                    <Link href="/sop" className="hover:text-foreground">SOP Library</Link>
                    <span className="mx-1.5">/</span>
                    <span>{detail.documentCode}</span>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <h1 className="truncate text-lg font-semibold tracking-tight">{detail.title}</h1>
                    <Badge variant={getSopLifecycleTone(sop.status)}>{sop.status}</Badge>
                    <Badge variant="outline">{detail.version}</Badge>
                    <Badge variant={getAcknowledgementStatusTone(detail.acknowledgementStatus)}>{detail.acknowledgementStatus}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" onClick={() => setLegacyMode(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit / Builder
                </Button>
                <Button variant="outline" onClick={() => setLegacyMode(true)}>
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
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>SOP Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLegacyMode(true)}>Edit content</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLegacyMode(true)}>Publish new version</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLegacyMode(true)}>Assign training</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLegacyMode(true)}>Create templates</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <ResizablePanelGroup direction="horizontal" className="sop-builder-panel-group min-h-0 flex-1 overflow-hidden">
            <ResizablePanel defaultSize={16} minSize={12} maxSize={22}>
              <aside className="flex h-full min-h-0 flex-col border-r bg-background">
                <div className="shrink-0 border-b px-3 py-4">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Document
                  </div>
                  <div className="mt-1 text-sm font-semibold">Chapters</div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="space-y-1">
                    {pages.map((page) => (
                      <a
                        key={page.id}
                        href={`#${page.id}`}
                        className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted/50"
                      >
                        <span className="w-4 shrink-0 text-[11px] font-medium text-muted-foreground">{page.pageNo}</span>
                        <span className="min-w-0 flex-1 truncate">{page.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={56} minSize={36}>
              <main className="h-full min-h-0 overflow-y-auto overscroll-contain bg-background">
                <div className="mx-auto max-w-4xl px-10 py-8">
                  <section className="border-b pb-8">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <ScrollText className="h-4 w-4" />
                      {detail.category} · {detail.processArea} · {detail.content.mode}
                    </div>
                    <h2 className="mt-4 text-4xl font-semibold tracking-tight">{detail.title}</h2>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                      Staff-facing SOP reader. Content stays in a clean document flow; management metadata stays in the inspector panel.
                    </p>
                  </section>

                  {pages.map((page) => <PageContent key={page.id} page={page} />)}
                </div>
              </main>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={28} minSize={22} maxSize={42}>
              <aside className="flex h-full min-h-0 flex-col border-l bg-background">
                <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold">SOP Information</div>
                    <div className="text-xs text-muted-foreground">Replaces the builder preview panel.</div>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <InspectorSection title="Summary">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                        <div className="mt-0.5 text-xl font-semibold">{training.pending}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Overdue</div>
                        <div className="mt-0.5 text-xl font-semibold">{training.overdue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Rate</div>
                        <div className="mt-0.5 text-xl font-semibold">{training.rate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Pages</div>
                        <div className="mt-0.5 text-xl font-semibold">{pages.length}</div>
                      </div>
                    </div>
                  </InspectorSection>

                  <InspectorSection title="Document">
                    <div className="divide-y">
                      <FieldLine label="Code" value={detail.documentCode} />
                      <FieldLine label="Category" value={detail.category} />
                      <FieldLine label="Process Area" value={detail.processArea} />
                      <FieldLine label="Version" value={detail.version} />
                      <FieldLine label="Status" value={sop.status} />
                      <FieldLine label="Owner" value={detail.owner} />
                      <FieldLine label="Approver" value={detail.approver} />
                      <FieldLine label="Effective" value={detail.effectiveDate} />
                      <FieldLine label="Review Due" value={detail.reviewDueDate} />
                    </div>
                  </InspectorSection>

                  <InspectorSection title="Training / Exam">
                    <div className="divide-y">
                      <FieldLine label="Target Role" value={detail.targetRole} />
                      <FieldLine label="Target Outlet" value={detail.targetBranch} />
                      <FieldLine label="Acknowledgement" value={detail.acknowledgementStatus} />
                      <FieldLine label="Training Total" value={training.total} />
                      <FieldLine label="Completed" value={training.completed} />
                      <FieldLine label="Exam" value={detailValue(sop, "Linked Exam") || detailValue(sop, "Exam") || "Not Set"} />
                      <FieldLine label="Pass Mark" value={detailValue(sop, "Pass Mark") || "Not Set"} />
                    </div>
                  </InspectorSection>

                  <InspectorSection title="Templates">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Checklist</div>
                        <div className="mt-0.5 text-xl font-semibold">{templates.checklist}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Inspect</div>
                        <div className="mt-0.5 text-xl font-semibold">{templates.inspection}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Task</div>
                        <div className="mt-0.5 text-xl font-semibold">{templates.task}</div>
                      </div>
                    </div>
                  </InspectorSection>

                  <InspectorSection title="Next Actions">
                    <div className="space-y-2">
                      {nextActions.length ? nextActions.map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => setLegacyMode(true)}
                          className="block w-full rounded-lg px-0 py-1.5 text-left text-sm hover:text-primary"
                        >
                          + {action}
                        </button>
                      )) : (
                        <div className="text-sm text-muted-foreground">No pending action.</div>
                      )}
                    </div>
                  </InspectorSection>
                </div>
              </aside>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ErpShell>
  );
}
