"use client";

import { useMemo, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  Check,
  CheckSquare,
  ChevronLeft,
  FileText,
  ImageIcon,
  ListChecks,
  Plus,
  Settings2,
  Smartphone,
  Trash2,
  Type,
  Video,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SopBuilderCanvasV4, type SopBuilderV4Section } from "@/components/sop/sop-builder-canvas-v4";
import {
  sopBuilderV3Readiness,
  type SopBuilderV3Block,
  type SopBuilderV3BlockType,
  type SopBuilderV3Document,
  type SopBuilderV3Page,
  type SopBuilderV3Settings,
} from "@/lib/sop/sop-builder-v3-types";


const SopBlockNoteEditor = dynamic(
  () => import("@/components/sop/sop-blocknote-editor").then((mod) => mod.SopBlockNoteEditor),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-4xl px-10 py-10 text-sm text-muted-foreground">
        Loading document editor...
      </div>
    ),
  },
);

const insertSections: Array<{
  type: SopBuilderV3BlockType;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { type: "heading", label: "Section Heading", description: "Create a clear SOP section.", icon: Type },
  { type: "text", label: "Instruction Text", description: "Explain rules, reasons, or standards.", icon: FileText },
  { type: "step-list", label: "Step by Step", description: "One action per line.", icon: ListChecks },
  { type: "image", label: "Photo / GIF Guide", description: "Show examples or product build.", icon: ImageIcon },
  { type: "video", label: "Training Video", description: "Video block for API media later.", icon: Video },
  { type: "pdf", label: "PDF / Document", description: "Formal document reference.", icon: FileText },
  { type: "warning", label: "Warning / Risk", description: "Mistakes, risk, or safety warning.", icon: AlertTriangle },
  { type: "checklist", label: "Checklist", description: "Final confirmation before acknowledge.", icon: CheckSquare },
];

function sectionLabel(type: SopBuilderV3BlockType) {
  return insertSections.find((section) => section.type === type)?.label || type;
}

function sectionIcon(type: SopBuilderV3BlockType) {
  return insertSections.find((section) => section.type === type)?.icon || FileText;
}

function linesToText(value?: string[]) {
  return (value || []).join("\n");
}

function textToLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function PreviewBlock({ block }: { block: SopBuilderV3Block }) {
  if (block.type === "step-list") {
    return (
      <div className="rounded-2xl border bg-background p-3">
        <div className="text-sm font-semibold">{block.title || "Step by Step"}</div>
        <div className="mt-3 space-y-2">
          {(block.steps || []).length ? (block.steps || []).map((step, index) => (
            <div key={`${step}-${index}`} className="rounded-xl bg-muted/40 px-3 py-2 text-xs">
              <span className="font-medium">Step {index + 1}</span>
              <div className="mt-0.5 text-muted-foreground">{step}</div>
            </div>
          )) : <div className="text-xs text-muted-foreground">No steps yet.</div>}
        </div>
      </div>
    );
  }

  if (block.type === "checklist") {
    return (
      <div className="rounded-2xl border bg-background p-3">
        <div className="text-sm font-semibold">{block.title || "Checklist"}</div>
        <div className="mt-3 space-y-2">
          {(block.checklist || []).length ? (block.checklist || []).map((check, index) => (
            <div key={`${check}-${index}`} className="flex gap-2 rounded-xl border px-3 py-2 text-xs">
              <CheckSquare className="mt-0.5 h-3.5 w-3.5 text-primary" />
              <span>{check}</span>
            </div>
          )) : <div className="text-xs text-muted-foreground">No checklist yet.</div>}
        </div>
      </div>
    );
  }

  if (block.type === "image" || block.type === "video" || block.type === "pdf") {
    return (
      <div className="rounded-2xl border bg-background p-3">
        <div className="text-sm font-semibold">{block.title || sectionLabel(block.type)}</div>
        <div className="mt-3 rounded-xl border border-dashed bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground">
          {block.assetUrl || "Media preview will work after API storage is connected."}
        </div>
      </div>
    );
  }

  if (block.type === "warning") {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-3">
        <div className="text-sm font-semibold">{block.title || "Warning"}</div>
        <div className="mt-2 text-xs leading-5 text-muted-foreground">{block.body || "No warning message yet."}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-background p-3">
      <div className="text-sm font-semibold">{block.title || sectionLabel(block.type)}</div>
      <div className="mt-2 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">
        {block.body || "No content yet."}
      </div>
    </div>
  );
}


function v3BlockToV4Section(block: SopBuilderV3Block): SopBuilderV4Section {
  return {
    id: block.id,
    type: block.type === "step-list" ? "step" : block.type,
    title: block.title,
    content: block.body,
    mediaUrl: block.assetUrl,
    checklist: block.checklist,
    steps: block.steps?.map((step, index) => ({
      id: `${block.id}-step-${index}`,
      title: `Step ${index + 1}`,
      instruction: step,
    })),
  };
}

function v4TypeToV3Type(type: SopBuilderV4Section["type"]): SopBuilderV3BlockType {
  if (type === "step") return "step-list";
  if (type === "gif") return "image";
  if (type === "proof") return "checklist";
  if (type === "acknowledgement") return "checklist";
  return type;
}

function v4SectionsToV3Blocks(sections: SopBuilderV4Section[]): SopBuilderV3Block[] {
  return sections.map((section) => {
    const type = v4TypeToV3Type(section.type);

    return {
      id: section.id,
      type,
      title: section.title,
      body: section.content,
      assetUrl: section.mediaUrl,
      steps: section.steps?.map((step) => step.instruction).filter(Boolean),
      checklist: section.checklist,
      warningLevel: section.type === "warning" ? "Warning" : undefined,
    };
  });
}

export function SopBuilderWorkspaceV3({
  document: sopDocument,
  selectedPageId,
  onBack,
  onCreate,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onUpdatePage,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onUpdateSettings,
  onUseClassic,
}: {
  document: SopBuilderV3Document;
  selectedPageId?: string;
  onBack: () => void;
  onCreate: () => void | Promise<void>;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
  onUpdatePage: (pageId: string, patch: Partial<SopBuilderV3Page>) => void;
  onAddBlock: (pageId: string, type: SopBuilderV3BlockType) => void;
  onUpdateBlock: (pageId: string, blockId: string, patch: Partial<SopBuilderV3Block>) => void;
  onDeleteBlock: (pageId: string, blockId: string) => void;
  onUpdateSettings: (patch: Partial<SopBuilderV3Settings>) => void;
  onUseClassic?: () => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);

  const { settings, pages } = sopDocument;

  const activePage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) || pages[0],
    [pages, selectedPageId],
  );

  const checks = sopBuilderV3Readiness(sopDocument);
  const readyCount = checks.filter((item) => item.done).length;

  return (
    <div className="flex h-[calc(100vh-56px)] min-h-0 flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-b bg-background px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">SOP Builder V3</div>
              <div className="truncate text-xl font-semibold tracking-tight">{settings.title || "Untitled SOP"}</div>
            </div>

            <Badge variant="outline">{settings.version || "v1.0"}</Badge>
            <Badge variant="secondary">{settings.status}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onUseClassic ? (
              <Button variant="outline" onClick={onUseClassic}>
                Use Classic
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline">
              <Smartphone className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={onCreate}>Create SOP</Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="hidden min-h-0 border-r bg-muted/20 lg:block">
          <div className="border-b p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Pages</div>
                <div className="text-xs text-muted-foreground">Reader order</div>
              </div>
              <Button size="sm" variant="outline" onClick={onAddPage}>
                <Plus className="h-4 w-4" />
                Page
              </Button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-170px)] space-y-2 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {!pages.length ? (
              <div className="rounded-xl border border-dashed bg-background px-3 py-6 text-center text-sm text-muted-foreground">
                No page yet.
              </div>
            ) : pages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onSelectPage(page.id)}
                className={cn(
                  "w-full rounded-xl border bg-background p-3 text-left transition hover:bg-muted/30",
                  activePage?.id === page.id && "border-primary bg-primary/5",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">Page {index + 1}</div>
                  <Badge variant="outline">{page.blocks.length}</Badge>
                </div>
                <div className="mt-1 line-clamp-2 text-sm font-medium">{page.title || "Untitled page"}</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="min-h-0 overflow-y-auto bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <SopBlockNoteEditor />
        </main>

        <aside className="hidden min-h-0 overflow-y-auto border-l bg-muted/10 p-5 [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden">
          <div className="sticky top-0 space-y-4">
            <div>
              <div className="text-sm font-semibold">Employee View</div>
              <div className="text-xs text-muted-foreground">Phone reading preview</div>
            </div>

            <div className="rounded-[2rem] border bg-background p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-center">
                <div className="h-1.5 w-16 rounded-full bg-muted" />
              </div>

              <div className="max-h-[420px] overflow-y-auto rounded-[1.5rem] border bg-muted/10 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {!activePage ? (
                  <div className="text-sm text-muted-foreground">No page selected.</div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium uppercase text-muted-foreground">Page</div>
                      <div className="text-lg font-semibold">{activePage.title || "Untitled page"}</div>
                    </div>

                    {activePage.blocks.map((block) => (
                      <PreviewBlock key={block.id} block={block} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Publish Readiness</div>
                  <div className="text-xs text-muted-foreground">{readyCount}/{checks.length} ready</div>
                </div>
                <Badge variant={readyCount === checks.length ? "default" : "outline"}>
                  {readyCount === checks.length ? "Ready" : "Draft"}
                </Badge>
              </div>

              <div className="space-y-2">
                {checks.map((item) => (
                  <div key={item.key} className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      item.done && "border-primary bg-primary text-primary-foreground",
                    )}>
                      {item.done ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {settingsOpen ? (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm">
          <button className="absolute inset-0 cursor-default" type="button" onClick={() => setSettingsOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l bg-background p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="text-xl font-semibold">SOP Settings</div>
                <div className="text-sm text-muted-foreground">Setup is here, not taking space from the writing canvas.</div>
              </div>
              <Button variant="outline" size="icon" onClick={() => setSettingsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="space-y-1.5">
                <Label>SOP Title</Label>
                <Input value={settings.title} onChange={(event) => onUpdateSettings({ title: event.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Document Code</Label>
                  <Input value={settings.documentCode} onChange={(event) => onUpdateSettings({ documentCode: event.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Version</Label>
                  <Input value={settings.version} onChange={(event) => onUpdateSettings({ version: event.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Owner</Label>
                  <Input value={settings.owner} onChange={(event) => onUpdateSettings({ owner: event.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Approver</Label>
                  <Input value={settings.approver} onChange={(event) => onUpdateSettings({ approver: event.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Target Outlet</Label>
                  <Input value={settings.targetOutlet} onChange={(event) => onUpdateSettings({ targetOutlet: event.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Target Role</Label>
                  <Input value={settings.targetRole} onChange={(event) => onUpdateSettings({ targetRole: event.target.value })} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSettingsOpen(false)}>Done</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
