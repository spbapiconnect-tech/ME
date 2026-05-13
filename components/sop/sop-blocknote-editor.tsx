"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

export function SopBlockNoteEditor() {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      editor.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [editor]);

  return (
    <div className="min-h-full bg-background px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <BlockNoteView
          editor={editor}
          theme="light"
          className="min-h-[calc(100vh-220px)] rounded-2xl bg-background"
        />
      </div>
    </div>
  );
}
