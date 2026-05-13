"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

export function SopBlockNoteEditor() {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Page 1 · What staff need to know",
      },
      {
        type: "paragraph",
        content: "Type / to insert SOP content. Add text, checklist, image, video, or file blocks directly in the document.",
      },
      {
        type: "checkListItem",
        content: "I have read this SOP",
      },
      {
        type: "checkListItem",
        content: "I understand the key steps",
      },
    ],
  });

  return (
    <div className="min-h-[640px] bg-background px-10 py-8">
      <div className="mx-auto max-w-4xl">
        <BlockNoteView
          editor={editor}
          theme="light"
          className="min-h-[560px]"
        />
      </div>
    </div>
  );
}
