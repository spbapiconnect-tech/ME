"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

export type SopBlockNoteDocument = PartialBlock[];

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
      initialContent,
    },
    [JSON.stringify(initialContent)],
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm">
        <div className="border-b bg-muted/20 px-5 py-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            SOP Reader Preview
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{title || "Untitled SOP"}</h2>
            <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
              {version || "v1.0"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 border-b bg-muted/10 px-5 py-4 text-xs text-muted-foreground sm:grid-cols-3">
          <div>
            <div className="font-medium text-foreground">Outlets</div>
            <div className="mt-1 line-clamp-2">{outlets.length ? outlets.join(", ") : "Not assigned"}</div>
          </div>

          <div>
            <div className="font-medium text-foreground">Required to read</div>
            <div className="mt-1 line-clamp-2">{readRoles.length ? readRoles.join(", ") : "No role selected"}</div>
          </div>

          <div>
            <div className="font-medium text-foreground">Visible to</div>
            <div className="mt-1 line-clamp-2">
              {visibleRoles.length ? visibleRoles.join(", ") : "No visibility role selected"}
            </div>
          </div>
        </div>

        <div className="sop-reader-preview min-h-0 flex-1 overflow-y-auto px-5 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <BlockNoteView
            editor={editor}
            editable={false}
            theme="light"
            formattingToolbar={false}
            slashMenu={false}
            sideMenu={false}
            filePanel={false}
            tableHandles={false}
            className="min-h-[360px] bg-background"
          />
        </div>
      </div>
    </div>
  );
}
