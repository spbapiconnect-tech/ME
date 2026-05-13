"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Check,
  ChevronLeft,
  Plus,
  Settings2,
  Smartphone,
  X,

  Pencil,
  Trash2,} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SopBlockNoteDocument } from "@/components/sop/sop-blocknote-preview";
import {
  sopBuilderV3Readiness,
  type SopBuilderV3Block,
  type SopBuilderV3BlockType,
  type SopBuilderV3Document,
  type SopBuilderV3Page,
  type SopBuilderV3Settings,
} from "@/lib/sop/sop-builder-v3-types";



const SopEmployeePreviewDevice = dynamic(
  () => import("@/components/sop/sop-blocknote-preview").then((mod) => mod.SopEmployeePreviewDevice),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading employee preview...
      </div>
    ),
  },
);

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


export function SopBuilderWorkspaceV3({
  document: sopDocument,
  selectedPageId,
  onBack,
  onCreate,
  onSelectPage,
  onAddPage,
  onAddSubPage,
  onDeletePage,
  onUpdatePage,
  onUpdateSettings,
  onDocumentChange,
}: {
  document: SopBuilderV3Document;
  selectedPageId?: string;
  onBack: () => void;
  onCreate: () => void | Promise<void>;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onAddSubPage?: (parentPageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onUpdatePage: (pageId: string, patch: Partial<SopBuilderV3Page>) => void;
  onAddBlock: (pageId: string, type: SopBuilderV3BlockType) => void;
  onUpdateBlock: (pageId: string, blockId: string, patch: Partial<SopBuilderV3Block>) => void;
  onDeleteBlock: (pageId: string, blockId: string) => void;
  onUpdateSettings: (patch: Partial<SopBuilderV3Settings>) => void;
  onDocumentChange?: (blocks: SopBlockNoteDocument) => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFull, setPreviewFull] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SopBlockNoteDocument>([]);
  const [visibleRoles, setVisibleRoles] = useState<string[]>(["Outlet Manager", "Branch Manager"]);
  const [reviewerRoles, setReviewerRoles] = useState<string[]>(["Outlet Manager"]);
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const { settings, pages } = sopDocument;

  const activePage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) || pages[0],
    [pages, selectedPageId],
  );

  const rootPages = useMemo(() => {
    const roots = pages.filter((page) => !page.parentPageId);
    return roots.length ? roots : pages;
  }, [pages]);

  const subPagesByParent = useMemo(() => {
    return pages.reduce<Record<string, SopBuilderV3Page[]>>((groups, page) => {
      if (!page.parentPageId) return groups;
      groups[page.parentPageId] = [...(groups[page.parentPageId] || []), page];
      return groups;
    }, {});
  }, [pages]);

  const checks = sopBuilderV3Readiness(sopDocument);
  const readyCount = checks.filter((item) => item.done).length;

  const outletOptions = ["All Outlets", "RR-KCH", "SKONE-BTU", "Branch A", "Branch B"];
  const roleOptions = ["Kitchen Staff", "Front Staff", "Cashier", "Outlet Manager", "Branch Manager", "Area Manager", "Trainer"];

  function csvToArray(value?: string) {
    return (value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function arrayToCsv(value: string[]) {
    return value.join(", ");
  }

  function toggleCsvSetting(field: "targetOutlet" | "targetRole", value: string) {
    const current = csvToArray(settings[field]);
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    onUpdateSettings({ [field]: arrayToCsv(next) } as Partial<SopBuilderV3Settings>);
  }

  function toggleLocalList(list: string[], setList: (value: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function cleanOutlineTitle(title?: string) {
    const clean = (title || "")
      .replace(/^Page\s+\d+\s*[·:-]\s*/i, "")
      .replace(/^New\s+/i, "")
      .trim();

    return clean || "Untitled";
  }

  function beginRename(page: SopBuilderV3Page) {
    setRenamingPageId(page.id);
    setRenameValue(cleanOutlineTitle(page.title));
  }

  function commitRename(pageId: string) {
    const nextTitle = renameValue.trim() || "Untitled";
    onUpdatePage(pageId, { title: nextTitle });
    setRenamingPageId(null);
    setRenameValue("");
  }

  function handleBlockNoteDocumentChange(blocks: SopBlockNoteDocument) {
    setPreviewDocument(blocks);
    onDocumentChange?.(blocks);
  }


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
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant={previewOpen ? "default" : "outline"}
              onClick={() => setPreviewOpen((value) => !value)}
            >
              <Smartphone className="h-4 w-4" />
              {previewOpen ? "Hide Preview" : "Preview"}
            </Button>
            <Button onClick={onCreate}>Create SOP</Button>
          </div>
        </div>
      </header>

      <div className={cn("grid min-h-0 flex-1 overflow-hidden", previewOpen ? "lg:grid-cols-[280px_minmax(0,1fr)_360px]" : "lg:grid-cols-[280px_minmax(0,1fr)]")}>
        <aside className="hidden h-full min-h-0 overflow-hidden border-r bg-background lg:block">
          <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b px-3 py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Document</div>
                  <div className="mt-1 text-sm font-semibold">Chapters</div>
                </div>
                <Button size="sm" variant="outline" className="h-8 px-2 text-xs" onClick={onAddPage}>
                  <Plus className="h-3.5 w-3.5" />
                  Chapter
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {!pages.length ? (
                <button
                  type="button"
                  onClick={onAddPage}
                  className="w-full rounded-lg border border-dashed px-3 py-5 text-center text-sm text-muted-foreground hover:bg-muted/30"
                >
                  Add chapter
                </button>
              ) : (
                <div className="space-y-1">
                  {rootPages.map((chapter, chapterIndex) => {
                    const active = activePage?.id === chapter.id;
                    const subPages = subPagesByParent[chapter.id] || [];

                    return (
                      <div key={chapter.id} className="space-y-1">
                        <div
                          className={cn(
                            "group flex items-center gap-1 rounded-lg pr-1 transition hover:bg-muted/50",
                            active && "bg-primary/10 text-primary",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => onSelectPage(chapter.id)}
                            className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm"
                          >
                            <span className="w-4 shrink-0 text-[11px] font-medium text-muted-foreground">
                              {chapterIndex + 1}
                            </span>

                            {renamingPageId === chapter.id ? (
                              <input
                                autoFocus
                                value={renameValue}
                                onChange={(event) => setRenameValue(event.target.value)}
                                onBlur={() => commitRename(chapter.id)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") commitRename(chapter.id);
                                  if (event.key === "Escape") setRenamingPageId(null);
                                }}
                                className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1 text-sm text-foreground"
                              />
                            ) : (
                              <span className="min-w-0 flex-1 truncate font-medium">
                                {cleanOutlineTitle(chapter.title)}
                              </span>
                            )}
                          </button>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 opacity-0 transition group-hover:opacity-100"
                            onClick={() => onAddSubPage?.(chapter.id)}
                            title="Add page"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 opacity-0 transition group-hover:opacity-100"
                            onClick={() => beginRename(chapter)}
                            title="Rename chapter"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                            onClick={() => onDeletePage(chapter.id)}
                            title="Delete chapter"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {subPages.map((page, pageIndex) => {
                          const subActive = activePage?.id === page.id;

                          return (
                            <div
                              key={page.id}
                              className={cn(
                                "group ml-4 flex items-center gap-1 rounded-lg pr-1 transition hover:bg-muted/50",
                                subActive && "bg-primary/10 text-primary",
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => onSelectPage(page.id)}
                                className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left text-sm"
                              >
                                <span className="w-7 shrink-0 text-[11px] text-muted-foreground">
                                  {chapterIndex + 1}.{pageIndex + 1}
                                </span>

                                {renamingPageId === page.id ? (
                                  <input
                                    autoFocus
                                    value={renameValue}
                                    onChange={(event) => setRenameValue(event.target.value)}
                                    onBlur={() => commitRename(page.id)}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") commitRename(page.id);
                                      if (event.key === "Escape") setRenamingPageId(null);
                                    }}
                                    className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1 text-sm text-foreground"
                                  />
                                ) : (
                                  <span className="min-w-0 flex-1 truncate">
                                    {cleanOutlineTitle(page.title)}
                                  </span>
                                )}
                              </button>

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 opacity-0 transition group-hover:opacity-100"
                                onClick={() => beginRename(page)}
                                title="Rename page"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                                onClick={() => onDeletePage(page.id)}
                                title="Delete page"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="h-full min-h-0 overflow-y-auto bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <SopBlockNoteEditor onDocumentChange={handleBlockNoteDocumentChange} />
        </main>

        {previewOpen ? (
          <div className="fixed inset-0 z-40 bg-background/45 backdrop-blur-sm">
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              onClick={() => {
                setPreviewOpen(false);
                setPreviewFull(false);
              }}
              aria-label="Close preview"
            />

            <aside
              className={cn(
                "absolute right-0 top-0 h-full w-full overflow-y-auto border-l bg-background p-5 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                previewFull ? "max-w-none" : "max-w-[720px]",
              )}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Employee Reading Preview</div>
                  <div className="text-xs text-muted-foreground">Read-only SOP content as staff will see it.</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewFull((value) => !value)}>
                    {previewFull ? "Side view" : "Full view"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreviewOpen(false);
                      setPreviewFull(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>

              <SopEmployeePreviewDevice
                blocks={previewDocument}
                title={settings.title}
                version={settings.version}
                outlets={csvToArray(settings.targetOutlet)}
                readRoles={csvToArray(settings.targetRole)}
                visibleRoles={visibleRoles}
              />

              <div className="mt-4 rounded-2xl border bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Publish Readiness</div>
                    <div className="text-xs text-muted-foreground">{readyCount}/{checks.length} ready</div>
                  </div>
                  <Badge variant={readyCount === checks.length ? "default" : "outline"}>
                    {readyCount === checks.length ? "Ready" : "Not published"}
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
            </aside>
          </div>
        ) : null}
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

            <div className="space-y-6">
              <section className="border-b pb-5">
                <div className="mb-3">
                  <div className="text-sm font-semibold">Document</div>
                  <div className="text-xs text-muted-foreground">Basic SOP identity and version control.</div>
                </div>

                <div className="grid gap-3">
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
                </div>
              </section>

              <section className="border-b pb-5">
                <div className="mb-3">
                  <div className="text-sm font-semibold">Assigned outlets</div>
                  <div className="text-xs text-muted-foreground">Select every outlet that should receive this SOP.</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {outletOptions.map((outlet) => {
                    const active = csvToArray(settings.targetOutlet).includes(outlet);

                    return (
                      <button
                        key={outlet}
                        type="button"
                        onClick={() => toggleCsvSetting("targetOutlet", outlet)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm transition hover:bg-muted/50",
                          active && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {outlet}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="border-b pb-5">
                <div className="mb-3">
                  <div className="text-sm font-semibold">Required to read</div>
                  <div className="text-xs text-muted-foreground">These roles must read and acknowledge the SOP.</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {roleOptions.map((role) => {
                    const active = csvToArray(settings.targetRole).includes(role);

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleCsvSetting("targetRole", role)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm transition hover:bg-muted/50",
                          active && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="border-b pb-5">
                <div className="mb-3">
                  <div className="text-sm font-semibold">Visible in library</div>
                  <div className="text-xs text-muted-foreground">Roles that can view this SOP even when acknowledgement is not required.</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {roleOptions.map((role) => {
                    const active = visibleRoles.includes(role);

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleLocalList(visibleRoles, setVisibleRoles, role)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm transition hover:bg-muted/50",
                          active && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="mb-3">
                  <div className="text-sm font-semibold">Can review / publish</div>
                  <div className="text-xs text-muted-foreground">Manager roles allowed to review, update, or publish this SOP.</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {roleOptions.map((role) => {
                    const active = reviewerRoles.includes(role);

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleLocalList(reviewerRoles, setReviewerRoles, role)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm transition hover:bg-muted/50",
                          active && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </section>
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
