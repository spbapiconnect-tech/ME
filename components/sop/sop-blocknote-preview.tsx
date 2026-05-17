"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";
import "@blocknote/shadcn/style.css";

import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useEffect, useState } from "react";

export type SopBlockNoteDocument = PartialBlock[];

const sopPreviewBlockNoteSchema = BlockNoteSchema.create().extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec({
      ...codeBlockOptions,
      indentLineWithTab: true,
      defaultLanguage: "text",
    }),
  },
});

function useResolvedBlockNoteTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    function resolveTheme() {
      const root = document.documentElement;
      const declaredTheme =
        root.getAttribute("data-theme") ||
        root.getAttribute("data-mode") ||
        root.style.colorScheme;

      const isDark =
        root.classList.contains("dark") ||
        declaredTheme === "dark" ||
        root.dataset.theme === "dark" ||
        root.dataset.mode === "dark";

      setTheme(isDark ? "dark" : "light");
    }

    resolveTheme();

    const observer = new MutationObserver(resolveTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-mode"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

export function SopEmployeePreviewDevice({
  blocks,
  title,
  version,
  category,
}: {
  blocks: SopBlockNoteDocument;
  title: string;
  version: string;
  category?: string;
}) {
  const blockNoteTheme = useResolvedBlockNoteTheme();

  const initialContent: SopBlockNoteDocument = blocks.length
    ? blocks
    : [
        {
          type: "paragraph",
          content: "No SOP content yet.",
        },
      ];

  const editor = useCreateBlockNote(
    {
      schema: sopPreviewBlockNoteSchema,
      initialContent,
    },
    [JSON.stringify(initialContent)],
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground">
      <div className="shrink-0 border-b bg-muted/20 px-4 py-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          SOP Reader Preview
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h2 className="line-clamp-1 text-base font-semibold tracking-tight">
            {title || "Untitled SOP"}
          </h2>

          <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {version || "v1.0"}
          </span>
        </div>
      </div>

      <div className="shrink-0 border-b bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Category</div>
        <div className="mt-1 line-clamp-2">{category || "Uncategorized"}</div>
      </div>

      <div className="sop-reader-preview min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <BlockNoteView
          editor={editor}
          editable={false}
          theme={blockNoteTheme}
          formattingToolbar={false}
          slashMenu={false}
          sideMenu={false}
          filePanel={false}
          tableHandles={false}
          className="sop-reader-preview-blocknote min-h-[360px] bg-transparent"
        />
      </div>
    </div>
  );
}
