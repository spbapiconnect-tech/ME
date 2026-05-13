"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronLeft, FileText, List, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OutletStaffWorkItem } from "@/lib/store-operations/outlet-staff-workspace";

type ReaderPageType = "text" | "media" | "pdf" | "checklist";

type ReaderPage = {
  id: string;
  title: string;
  body: string;
  type: ReaderPageType;
  asset?: string;
  checklist?: string[];
};

type ParsedBlock = {
  id?: string;
  type?: string;
  title?: string;
  body?: string;
  content?: string;
  instruction?: string;
  checklistItems?: string[];
  checklist?: string[];
  asset?: unknown;
  mediaUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  url?: string;
};

type ParsedContentPage = {
  id?: string;
  title?: string;
  blocks?: ParsedBlock[];
};

type ReaderAsset = {
  src: string;
  label: string;
  mimeType?: string;
  fileName?: string;
};

function assetString(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function blockAssetValue(block: ParsedBlock) {
  return (
    assetString(block.asset) ||
    block.mediaUrl ||
    block.imageUrl ||
    block.videoUrl ||
    block.pdfUrl ||
    block.url ||
    ""
  );
}

function parseReaderAsset(value?: string): ReaderAsset | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value);
    const src =
      parsed.previewUrl ||
      parsed.url ||
      parsed.localUrl ||
      parsed.localPreviewUrl ||
      parsed.href ||
      parsed.src ||
      "";

    return {
      src: String(src || ""),
      label: String(parsed.label || parsed.fileName || parsed.name || "Training media"),
      mimeType: String(parsed.mimeType || parsed.type || ""),
      fileName: String(parsed.fileName || parsed.name || ""),
    };
  } catch {
    return {
      src: value,
      label: value.split("/").pop() || "Training media",
      mimeType: "",
      fileName: value.split("/").pop() || "",
    };
  }
}

function readerAssetKind(asset?: ReaderAsset): "image" | "video" | "pdf" | "file" {
  const source = `${asset?.mimeType || ""} ${asset?.fileName || ""} ${asset?.src || ""}`.toLowerCase();

  if (source.includes("video") || source.endsWith(".mp4") || source.endsWith(".mov") || source.endsWith(".webm")) return "video";
  if (source.includes("pdf") || source.endsWith(".pdf")) return "pdf";
  if (
    source.includes("image") ||
    source.endsWith(".png") ||
    source.endsWith(".jpg") ||
    source.endsWith(".jpeg") ||
    source.endsWith(".webp") ||
    source.endsWith(".gif") ||
    source.startsWith("data:image")
  ) return "image";

  return "file";
}

function blockReaderType(block: ParsedBlock, asset: string): ReaderPageType {
  const source = `${block.type || ""} ${asset}`.toLowerCase();

  if (source.includes("pdf") || source.endsWith(".pdf")) return "pdf";
  if (
    source.includes("image") ||
    source.includes("video") ||
    source.endsWith(".png") ||
    source.endsWith(".jpg") ||
    source.endsWith(".jpeg") ||
    source.endsWith(".webp") ||
    source.endsWith(".gif") ||
    source.endsWith(".mp4") ||
    source.endsWith(".mov") ||
    source.endsWith(".webm")
  ) return "media";

  return "text";
}

function buildReaderPages(item?: OutletStaffWorkItem): ReaderPage[] {
  if (!item) {
    return [{
      id: "empty",
      title: "No SOP selected",
      body: "Choose a document from the SOP library to start reading.",
      type: "text",
    }];
  }

  const pages: ReaderPage[] = [];

  if (item.contentJson) {
    try {
      const parsed = JSON.parse(item.contentJson);
      const parsedPages: ParsedContentPage[] = Array.isArray(parsed?.pages) ? parsed.pages : [];

      parsedPages.forEach((contentPage, pageIndex) => {
        const blocks = Array.isArray(contentPage.blocks) ? contentPage.blocks : [];
        const textBlocks: string[] = [];

        blocks.forEach((block, blockIndex) => {
          const asset = blockAssetValue(block);
          const checklist = block.checklistItems || block.checklist || [];

          if (asset) {
            pages.push({
              id: `${contentPage.id || `page-${pageIndex}`}-media-${blockIndex}`,
              title: block.title || contentPage.title || `Media ${blockIndex + 1}`,
              body: block.body || block.content || block.instruction || "Review this media before continuing.",
              type: blockReaderType(block, asset),
              asset,
            });
            return;
          }

          if (checklist.length) {
            pages.push({
              id: `${contentPage.id || `page-${pageIndex}`}-checklist-${blockIndex}`,
              title: block.title || "Checklist",
              body: block.body || block.content || block.instruction || "Complete this checklist after reading.",
              type: "checklist",
              checklist,
            });
            return;
          }

          const textContent = [block.title, block.body, block.content, block.instruction].filter(Boolean).join("\n");
          if (textContent) textBlocks.push(textContent);
        });

        if (textBlocks.length) {
          pages.push({
            id: String(contentPage.id || `page-${pageIndex}`),
            title: contentPage.title || `Page ${pageIndex + 1}`,
            body: textBlocks.join("\n\n"),
            type: "text",
          });
        }
      });
    } catch {
      pages.push({
        id: "content-json",
        title: "SOP Content",
        body: item.contentJson,
        type: "text",
      });
    }
  }

  if (!pages.length) {
    pages.push({
      id: "summary",
      title: item.title,
      body: item.description || "Read this SOP carefully before acknowledging.",
      type: "text",
    });
  }

  if (item.mediaUrl) {
    pages.push({
      id: "media",
      title: "Training Media",
      body: "Watch the media before continuing.",
      type: "media",
      asset: item.mediaUrl,
    });
  }

  if (item.pdfUrl) {
    pages.push({
      id: "pdf",
      title: "PDF Document",
      body: "Read the attached PDF like a handbook.",
      type: "pdf",
      asset: item.pdfUrl,
    });
  }

  const checklist = (item.checklistText || "")
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  pages.push({
    id: "acknowledgement",
    title: "Checklist / Acknowledgement",
    body: "Confirm only after reading and understanding the SOP.",
    type: "checklist",
    checklist: checklist.length ? checklist : ["I have read the SOP", "I understand the key steps", "I know when to ask manager"],
  });

  return pages;
}

function MediaFrame({ value, title }: { value?: string; title: string }) {
  const asset = parseReaderAsset(value);
  const [failed, setFailed] = useState(false);
  const kind = readerAssetKind(asset);

  if (!asset?.src || failed) {
    return (
      <div className="rounded-3xl border bg-muted/30 p-5">
        <div className="text-sm font-semibold">{title}</div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Preview is not available in this browser session. Attach or upload the file again to show it inline.
        </p>
        {asset?.label ? (
          <div className="mt-3 rounded-xl border bg-background px-3 py-2 text-xs text-muted-foreground">
            {asset.label}
          </div>
        ) : null}
      </div>
    );
  }

  if (kind === "image") {
    return (
      <figure className="overflow-hidden rounded-3xl border bg-card">
        <div className="flex min-h-[220px] items-center justify-center bg-muted/20">
          <img
            src={asset.src}
            alt={asset.label}
            className="max-h-[58dvh] w-full object-contain"
            onError={() => setFailed(true)}
          />
        </div>
        <figcaption className="border-t px-4 py-3 text-xs text-muted-foreground">
          {asset.label}
        </figcaption>
      </figure>
    );
  }

  if (kind === "video") {
    return (
      <figure className="overflow-hidden rounded-3xl border bg-black">
        <video
          src={asset.src}
          controls
          playsInline
          className="max-h-[58dvh] w-full bg-black"
          onError={() => setFailed(true)}
        />
        <figcaption className="border-t border-white/10 bg-card px-4 py-3 text-xs text-muted-foreground">
          {asset.label}
        </figcaption>
      </figure>
    );
  }

  if (kind === "pdf") {
    return (
      <div className="overflow-hidden rounded-3xl border bg-card">
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{asset.label}</div>
        </div>
        <iframe
          src={asset.src}
          title={asset.label}
          className="h-[58dvh] w-full bg-background"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">
        This attachment type cannot be previewed inline yet.
      </p>
      <div className="mt-3 rounded-xl border bg-background px-3 py-2 text-xs text-muted-foreground">
        {asset.label}
      </div>
    </div>
  );
}

function PageBody({ page }: { page: ReaderPage }) {
  if ((page.type === "media" || page.type === "pdf") && page.asset) {
    return (
      <div className="space-y-4">
        <MediaFrame value={page.asset} title={page.title} />
        {page.body ? <p className="text-sm leading-7 text-muted-foreground">{page.body}</p> : null}
      </div>
    );
  }

  if (page.type === "checklist") {
    return (
      <div className="space-y-3">
        {(page.checklist || []).map((check) => (
          <div key={check} className="rounded-2xl border bg-card px-4 py-3 text-sm">
            {check}
          </div>
        ))}
        <p className="pt-2 text-sm leading-7 text-muted-foreground">{page.body}</p>
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap text-base leading-8 text-muted-foreground">
      {page.body}
    </div>
  );
}

export function SopMobileReader({
  item,
  onClose,
}: {
  item: OutletStaffWorkItem;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [showPages, setShowPages] = useState(false);

  const pages = useMemo(() => buildReaderPages(item), [item]);
  const safePage = Math.min(page, pages.length - 1);
  const active = pages[safePage] || pages[0];
  const progress = Math.round(((safePage + 1) / pages.length) * 100);

  useEffect(() => {
    setPage(0);
  }, [item.id]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[90] flex h-[100dvh] w-screen flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 rounded-xl border p-2"
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">SOP Reader</div>
            <div className="truncate text-lg font-semibold">{item.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">Page {safePage + 1} of {pages.length}</div>
          </div>

          <button
            type="button"
            onClick={() => setShowPages(true)}
            className="mt-0.5 rounded-xl border p-2"
            aria-label="Pages"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <article className="mx-auto max-w-[68ch]">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Page {safePage + 1}
          </div>

          <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">
            {active.title}
          </h1>

          <div className="mt-6">
            <PageBody page={active} />
          </div>
        </article>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-[92] border-t bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur">
        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="outline"
            disabled={safePage === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
          >
            Previous
          </Button>

          {safePage === pages.length - 1 ? (
            <Button className="flex-1">
              Mark understood
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={() => setPage((value) => Math.min(pages.length - 1, value + 1))}
            >
              Next
            </Button>
          )}
        </div>
      </footer>

      {showPages ? (
        <div className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm">
          <button className="absolute inset-0 cursor-default" type="button" onClick={() => setShowPages(false)} />

          <div className="absolute inset-x-0 bottom-0 max-h-[74dvh] rounded-t-3xl border bg-background p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Pages</div>
                <div className="text-sm text-muted-foreground">Jump to a section</div>
              </div>
              <button type="button" className="rounded-xl border p-2" onClick={() => setShowPages(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[58dvh] space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {pages.map((readerPage, index) => (
                <button
                  key={readerPage.id}
                  type="button"
                  onClick={() => {
                    setPage(index);
                    setShowPages(false);
                  }}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left",
                    safePage === index ? "border-primary bg-primary/10" : "bg-card",
                  )}
                >
                  <div className="text-xs text-muted-foreground">Page {index + 1}</div>
                  <div className="mt-1 font-medium">{readerPage.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
