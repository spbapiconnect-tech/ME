"use client";

import dynamic from "next/dynamic";
import {
  ChevronLeft,
  Maximize2,
  Pencil,
  Plus,
  Settings2,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { SopBlockNoteDocument } from "@/components/sop/sop-blocknote-preview";
import type {
  SopBuilderV3Document,
  SopBuilderV3Page,
  SopBuilderV3Settings,
} from "@/lib/sop/sop-builder-v3-types";
import { cn } from "@/lib/utils";

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

const SopEmployeePreviewDevice = dynamic(
  () =>
    import("@/components/sop/sop-blocknote-preview").then(
      (mod) => mod.SopEmployeePreviewDevice,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading employee preview...
      </div>
    ),
  },
);

type SopBuilderWorkspaceV3Props = {
  document?: SopBuilderV3Document;
  pages?: SopBuilderV3Page[];
  selectedPageId?: string;
  settings?: SopBuilderV3Settings;
  onBack?: () => void;
  onCreate?: () => void;
  onCreateSop?: () => void;
  onCreateSOP?: () => void;
  onSubmit?: () => void;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onAddSubPage?: (parentPageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onUpdatePage: (pageId: string, patch: Partial<SopBuilderV3Page>) => void;
  onUpdateSettings: (patch: Partial<SopBuilderV3Settings>) => void;
  onDocumentChange?: (blocks: SopBlockNoteDocument) => void;
} & Record<string, unknown>;

const fallbackSettings = {
  title: "Untitled SOP",
  documentCode: "",
  version: "v1.0",
  category: "",
  processArea: "",
  employeeReadMode: "",
  owner: "",
  approver: "",
  targetOutlet: "",
  targetRole: "",
  acknowledgementRequired: "",
  trainingRequired: "",
  reviewCycle: "",
  reviewDueDate: "",
  status: "draft",
} as unknown as SopBuilderV3Settings;

function csvToArray(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToCsv(value: string[]) {
  return value.join(", ");
}

function cleanOutlineTitle(title?: string) {
  const clean = (title || "")
    .replace(/^Page\s+\d+\s*[·:-]\s*/i, "")
    .replace(/^What staff need to know$/i, "Overview")
    .replace(/^New\s+/i, "")
    .trim();

  return clean || "Untitled";
}

export function SopBuilderWorkspaceV3({
  document: sopDocument,
  pages: pagesInput,
  selectedPageId,
  settings: settingsInput,
  onBack,
  onCreate,
  onCreateSop,
  onCreateSOP,
  onSubmit,
  onSelectPage,
  onAddPage,
  onAddSubPage,
  onDeletePage,
  onUpdatePage,
  onUpdateSettings,
  onDocumentChange,
}: SopBuilderWorkspaceV3Props) {
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const renameInputRef = useRef<HTMLInputElement | null>(null);
  const [previewDocument, setPreviewDocument] = useState<SopBlockNoteDocument>([]);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<"preview" | "settings">("preview");
  const [previewFull, setPreviewFull] = useState(false);
  const [visibleRoles, setVisibleRoles] = useState<string[]>(["Outlet Manager", "Branch Manager"]);
  const [reviewerRoles, setReviewerRoles] = useState<string[]>(["Outlet Manager"]);
  const [renameTarget, setRenameTarget] = useState<SopBuilderV3Page | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [titleOverrides, setTitleOverrides] = useState<Record<string, string>>({});

  const pages = pagesInput ?? sopDocument?.pages ?? [];
  const settings = settingsInput ?? sopDocument?.settings ?? fallbackSettings;

  useEffect(() => {
    if (!renameTarget) return;

    const timer = window.setTimeout(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }, 30);

    return () => window.clearTimeout(timer);
  }, [renameTarget]);

  useEffect(() => {
    const browserDocument = globalThis.document;
    if (!browserDocument?.body) return;

    const body = browserDocument.body;
    const html = browserDocument.documentElement;

    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.scrollTop = 0;
    html.scrollTop = 0;

    const lockedParents: Array<{ element: HTMLElement; overflow: string; overflowY: string }> = [];
    let parent = workspaceRef.current?.parentElement || null;

    while (parent && parent !== body) {
      const computed = window.getComputedStyle(parent);
      const canScroll =
        parent.tagName.toLowerCase() === "main" ||
        computed.overflow === "auto" ||
        computed.overflow === "scroll" ||
        computed.overflowY === "auto" ||
        computed.overflowY === "scroll";

      if (canScroll) {
        lockedParents.push({
          element: parent,
          overflow: parent.style.overflow,
          overflowY: parent.style.overflowY,
        });

        parent.style.overflow = "hidden";
        parent.style.overflowY = "hidden";
        parent.scrollTop = 0;
      }

      parent = parent.parentElement;
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;

      lockedParents.forEach(({ element, overflow, overflowY }) => {
        element.style.overflow = overflow;
        element.style.overflowY = overflowY;
      });
    };
  }, []);

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

  const outletOptions = ["All Outlets", "RR-KCH", "SKONE-BTU", "Branch A", "Branch B"];
  const roleOptions = [
    "Kitchen Staff",
    "Front Staff",
    "Cashier",
    "Outlet Manager",
    "Branch Manager",
    "Area Manager",
    "Trainer",
  ];

  function displayTitle(page: SopBuilderV3Page) {
    return cleanOutlineTitle(titleOverrides[page.id] ?? page.title);
  }

  function handleDocumentChange(blocks: SopBlockNoteDocument) {
    setPreviewDocument(blocks);
    onDocumentChange?.(blocks);
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

  function openRename(page: SopBuilderV3Page) {
    setRenameTarget(page);
    setRenameValue(displayTitle(page));
  }

  function saveRename() {
    if (!renameTarget) return;

    const nextTitle = renameValue.trim() || "Untitled";

    setTitleOverrides((current) => ({
      ...current,
      [renameTarget.id]: nextTitle,
    }));

    onUpdatePage(renameTarget.id, { title: nextTitle });
    setRenameTarget(null);
    setRenameValue("");
  }

  const createAction = onCreateSop || onCreateSOP || onCreate || onSubmit;

  return (
    <div
      ref={workspaceRef}
      className="flex h-[calc(100dvh-56px)] min-h-0 flex-col overflow-hidden bg-background"
    >
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">SOP Builder V3</div>
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-semibold tracking-tight">
                  {settings.title || "Untitled SOP"}
                </h1>
                <Badge variant="outline">{settings.version || "v1.0"}</Badge>
                <Badge variant="secondary">Not published</Badge>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant={inspectorOpen && inspectorTab === "settings" ? "default" : "outline"}
              onClick={() => {
                if (inspectorOpen && inspectorTab === "settings") {
                  setInspectorOpen(false);
                  return;
                }

                setInspectorOpen(true);
                setInspectorTab("settings");
              }}
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </Button>

            <Button
              variant={inspectorOpen && inspectorTab === "preview" ? "default" : "outline"}
              onClick={() => {
                if (inspectorOpen && inspectorTab === "preview") {
                  setInspectorOpen(false);
                  setPreviewFull(false);
                  return;
                }

                setInspectorOpen(true);
                setInspectorTab("preview");
              }}
            >
              <Smartphone className="h-4 w-4" />
              Preview
            </Button>

            <Button onClick={createAction}>Create SOP</Button>
          </div>
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-0 flex-1 overflow-hidden"
      >
        <ResizablePanel defaultSize={16} minSize={12} maxSize={22}>
          <aside className="flex h-full min-h-0 flex-col border-r bg-background">
            <div className="shrink-0 border-b px-3 py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Document
                  </div>
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
                            <span className="min-w-0 flex-1 truncate font-medium">
                              {displayTitle(chapter)}
                            </span>
                          </button>

                          <div className="flex shrink-0 gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => onAddSubPage?.(chapter.id)}
                              title="Add page"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => openRename(chapter)}
                              title="Rename chapter"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => onDeletePage(chapter.id)}
                              title="Delete chapter"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
                                <span className="min-w-0 flex-1 truncate">
                                  {displayTitle(page)}
                                </span>
                              </button>

                              <div className="flex shrink-0 gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => openRename(page)}
                                  title="Rename page"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>

                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => onDeletePage(page.id)}
                                  title="Delete page"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={inspectorOpen ? 56 : 84} minSize={36}>
          <main className="h-full min-h-0 overflow-y-auto bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <SopBlockNoteEditor onDocumentChange={handleDocumentChange} />
          </main>
        </ResizablePanel>

        {inspectorOpen ? (
          <>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={28} minSize={20} maxSize={42}>
              <aside className="flex h-full min-h-0 flex-col border-l bg-background">
                <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold">
                      {inspectorTab === "preview" ? "Preview" : "Settings"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {inspectorTab === "preview"
                        ? "Staff reading view while writing."
                        : "SOP assignment and publishing setup."}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {inspectorTab === "preview" ? (
                      <Button variant="outline" size="sm" onClick={() => setPreviewFull(true)}>
                        <Maximize2 className="h-3.5 w-3.5" />
                        Full view
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setInspectorOpen(false);
                        setPreviewFull(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {inspectorTab === "preview" ? (
                  <div className="min-h-0 flex-1 overflow-hidden p-4">
                    <SopEmployeePreviewDevice
                      blocks={previewDocument}
                      title={settings.title}
                      version={settings.version}
                      outlets={csvToArray(settings.targetOutlet)}
                      readRoles={csvToArray(settings.targetRole)}
                      visibleRoles={visibleRoles}
                    />
                  </div>
                ) : (
                  <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="space-y-6">
                      <section className="border-b pb-5">
                        <div className="mb-3">
                          <div className="text-sm font-semibold">Document</div>
                          <div className="text-xs text-muted-foreground">Basic SOP identity and version control.</div>
                        </div>

                        <div className="grid gap-3">
                          <div className="space-y-1.5">
                            <Label>SOP Title</Label>
                            <Input
                              value={settings.title}
                              onChange={(event) => onUpdateSettings({ title: event.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label>Document Code</Label>
                              <Input
                                value={settings.documentCode}
                                onChange={(event) =>
                                  onUpdateSettings({ documentCode: event.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label>Version</Label>
                              <Input
                                value={settings.version}
                                onChange={(event) => onUpdateSettings({ version: event.target.value })}
                              />
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
                  </div>
                )}
              </aside>
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>

      {previewFull ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
            <div>
              <div className="text-sm font-semibold">Full Preview</div>
              <div className="text-xs text-muted-foreground">Staff reading view.</div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setPreviewFull(false)}>
              Close
            </Button>
          </div>

          <div className="min-h-0 flex-1 p-5">
            <SopEmployeePreviewDevice
              blocks={previewDocument}
              title={settings.title}
              version={settings.version}
              outlets={csvToArray(settings.targetOutlet)}
              readRoles={csvToArray(settings.targetRole)}
              visibleRoles={visibleRoles}
            />
          </div>
        </div>
      ) : null}

      {renameTarget ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/55 backdrop-blur-sm"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <form
            className="w-full max-w-sm rounded-2xl border bg-popover p-4 text-popover-foreground shadow-2xl"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              saveRename();
            }}
          >
            <div className="text-sm font-semibold">Rename</div>
            <div className="mt-1 text-xs text-muted-foreground">Rename this chapter or page.</div>

            <Input
              ref={renameInputRef}
              className="mt-4"
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                event.stopPropagation();

                if (event.key === "Escape") {
                  event.preventDefault();
                  setRenameTarget(null);
                  setRenameValue("");
                }
              }}
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setRenameTarget(null);
                  setRenameValue("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      ) : null}
      ) : null}
    </div>
  );
}
