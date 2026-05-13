"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./sop-blocknote-editor.css";

import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

async function uploadLocalPreviewFile(file: File) {
  // Temporary local browser preview.
  // Later replace this with API / Supabase / S3 upload and return permanent URL.
  return URL.createObjectURL(file);
}

export function SopBlockNoteEditor() {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
    uploadFile: uploadLocalPreviewFile,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      editor.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [editor]);

  return (
    <div className="sop-blocknote-shell min-h-full bg-background px-8 py-8">
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
