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
  useEffect(() => {
    const shell = document.querySelector(".sop-builder-route-shell") as HTMLElement | null;
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


  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  const [previewDocument, setPreviewDocument] = useState<SopBlockNoteDocument>([]);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<"preview" | "settings">("preview");
  const [previewFull, setPreviewFull] = useState(false);
  const [renameTarget, setRenameTarget] = useState<SopBuilderV3Page | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [titleOverrides, setTitleOverrides] = useState<Record<string, string>>({});

  const pages = useMemo(
    () => pagesInput ?? sopDocument?.pages ?? [],
    [pagesInput, sopDocument?.pages],
  );

  const resolvedSettings = useMemo(
    () => settingsInput ?? sopDocument?.settings ?? fallbackSettings,
    [settingsInput, sopDocument?.settings],
  );

  const [localSettings, setLocalSettings] = useState<SopBuilderV3Settings>(resolvedSettings);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
const settings = localSettings;

  const [settingsDraft, setSettingsDraft] = useState(() => ({
    title: resolvedSettings.title || "",
    category: resolvedSettings.category || "",
    version: resolvedSettings.version || "v1.0",
  }));

  useEffect(() => {
    if (!renameTarget) return;

    const focusInput = () => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    };

    focusInput();
    const frame = window.requestAnimationFrame(focusInput);
    const timer = window.setTimeout(focusInput, 80);

    
return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [renameTarget]);


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


  function displayTitle(page: SopBuilderV3Page) {
    return cleanOutlineTitle(titleOverrides[page.id] ?? page.title);
  }

  function handleDocumentChange(blocks: SopBlockNoteDocument) {
    setPreviewDocument(blocks);
    onDocumentChange?.(blocks);
  }



  function patchSettingsDraft(
    field: "title" | "category" | "version",
    value: string,
  ) {
    setSettingsDraft((current) => ({
      ...current,
      [field]: value,
    }));

    setLocalSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function commitSettingsDraft(
    field: "title" | "category" | "version",
    value: string,
  ) {
    patchSettingsDraft(field, value);
    onUpdateSettings({ [field]: value } as Partial<SopBuilderV3Settings>);
  }



  function openRename(page: SopBuilderV3Page) {
    const activeElement = globalThis.document?.activeElement as HTMLElement | null;
    activeElement?.blur?.();

    setRenameTarget(page);
    setRenameValue(displayTitle(page));
  }

  function closeRename() {
    setRenameTarget(null);
    setRenameValue("");
  }

  function saveRename() {
    if (!renameTarget) return;

    const nextTitle = renameValue.trim() || "Untitled";

    setTitleOverrides((current) => ({
      ...current,
      [renameTarget.id]: nextTitle,
    }));

    onUpdatePage(renameTarget.id, { title: nextTitle });
    closeRename();
  }

  const createAction = onCreateSop || onCreateSOP || onCreate || onSubmit;

  return (
    <div
      ref={workspaceRef}
      className="sop-builder-workspace flex h-full min-h-0 flex-col overflow-hidden bg-background"
    >
      <div className="sop-builder-document-header shrink-0 border-b px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground">SOP Builder V3</div>
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold tracking-tight">
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


              <Button
                variant="outline"
                onClick={() => {
                  const savedAt = new Date().toISOString();

                  window.localStorage.setItem(
                    "me:sop-builder:v3:draft",
                    JSON.stringify({
                      version: 1,
                      savedAt,
                      sopDocument,
                      pages,
                      selectedPageId,
                      settings: localSettings,
                    }),
                  );

                  setDraftSavedAt(savedAt);
                }}
              >
                Save Draft
              </Button>
              {draftSavedAt ? (
                <span className="hidden text-xs text-muted-foreground md:inline">
                  Saved {new Date(draftSavedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ) : null}
<Button onClick={createAction}>Create SOP</Button>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="sop-builder-panel-group min-h-0 flex-1 overflow-hidden">
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
          <main className="sop-builder-editor-main h-full min-h-0 overflow-hidden bg-background">
            <SopBlockNoteEditor disabled={Boolean(renameTarget) || (inspectorOpen && inspectorTab === "settings")} onDocumentChange={handleDocumentChange} />
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
                      category={settings.category}
                    />
                  </div>
                ) : (
                  <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="space-y-5">
                      <section className="border-b pb-5">
                        <div className="mb-4">
                          <div className="text-sm font-semibold">File settings</div>
                          <div className="text-xs text-muted-foreground">
                            Basic file identity only. Outlet and role assignment will happen during Publish.
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="space-y-1.5">
                            <Label>File Name</Label>
                            <Input
                              value={settingsDraft.title}
                              placeholder="Example: Opening / Closing SOP"
                              onChange={(event) => patchSettingsDraft("title", event.target.value)}
                              onBlur={(event) => commitSettingsDraft("title", event.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label>Category</Label>
                            <Input
                              value={settingsDraft.category}
                              placeholder="Example: Recipe / Product SOP"
                              onChange={(event) => patchSettingsDraft("category", event.target.value)}
                              onBlur={(event) => commitSettingsDraft("category", event.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label>Version</Label>
                            <Input
                              value={settingsDraft.version}
                              placeholder="v1.0"
                              onChange={(event) => patchSettingsDraft("version", event.target.value)}
                              onBlur={(event) => commitSettingsDraft("version", event.target.value)}
                            />
                          </div>
                        </div>
                      </section>

                      <section className="rounded-2xl border bg-muted/20 p-4">
                        <div className="text-sm font-semibold">Publish assignment</div>
                        <div className="mt-1 text-xs leading-5 text-muted-foreground">
                          Outlet assignment, required readers, visibility, and reviewer permission will be configured when publishing this SOP.
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
              category={settings.category}
            />
          </div>
        </div>
      ) : null}

      {renameTarget ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/55 backdrop-blur-sm"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeRename();
            }
          }}
        >
          <form
            className="w-full max-w-sm rounded-2xl border bg-popover p-4 text-popover-foreground shadow-2xl"
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
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
              autoFocus
              className="mt-4"
              value={renameValue}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => setRenameValue(event.target.value)}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                event.stopPropagation();

                if (event.key === "Escape") {
                  event.preventDefault();
                  closeRename();
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
                  closeRename();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
