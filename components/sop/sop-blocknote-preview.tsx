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
  outlets,
  readRoles,
  visibleRoles,
}: {
  blocks: SopBlockNoteDocument;
  title: string;
  version: string;
  outlets: string[];
  readRoles: string[];
  visibleRoles: string[];
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
    <div className="flex justify-center overflow-x-auto py-3">
      <div className="relative h-[720px] w-[360px] rounded-[2.4rem] border border-border bg-muted p-3 shadow-2xl">
        <div className="absolute left-1/2 top-3 h-1.5 w-20 -translate-x-1/2 rounded-full bg-border" />

        <div className="h-full w-full overflow-hidden rounded-[2rem] border bg-background">
          <div className="h-full w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="sticky top-0 z-10 border-b bg-background/95 px-4 py-4 pt-6 backdrop-blur">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                SOP Reader
              </div>
              <div className="mt-1 line-clamp-2 text-base font-semibold">{title || "Untitled SOP"}</div>
              <div className="mt-1 text-xs text-muted-foreground">{version || "v1.0"}</div>
            </div>

            <div className="border-b px-4 py-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Assigned outlets</div>
              <div className="mt-1">{outlets.length ? outlets.join(", ") : "Not assigned"}</div>

              <div className="mt-3 font-medium text-foreground">Required to read</div>
              <div className="mt-1">{readRoles.length ? readRoles.join(", ") : "No role selected"}</div>

              <div className="mt-3 font-medium text-foreground">Visible to</div>
              <div className="mt-1">{visibleRoles.length ? visibleRoles.join(", ") : "No visibility role selected"}</div>
            </div>

            <div className="sop-reader-preview px-2 py-4">
              <BlockNoteView
                editor={editor}
                editable={false}
                theme="light"
                formattingToolbar={false}
                slashMenu={false}
                sideMenu={false}
                filePanel={false}
                tableHandles={false}
                className="min-h-[480px] bg-background"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
