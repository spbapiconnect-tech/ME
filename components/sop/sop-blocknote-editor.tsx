"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./sop-blocknote-editor.css";

import { useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import { Button } from "@/components/ui/button";

async function uploadLocalPreviewFile(file: File) {
  // Temporary local browser preview.
  // Later replace this with API / Supabase / S3 upload and return permanent URL.
  return URL.createObjectURL(file);
}

export function SopBlockNoteEditor() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  async function insertUploadedFile(file: File) {
    const url = await uploadLocalPreviewFile(file);
    const editorApi = editor as any;
    const cursorBlock = editorApi.getTextCursorPosition?.()?.block;
    const lastBlock = editorApi.document?.[editorApi.document.length - 1];
    const referenceBlock = cursorBlock || lastBlock;

    const block =
      file.type.startsWith("video/")
        ? {
            type: "video",
            props: {
              url,
              name: file.name,
            },
          }
        : file.type === "application/pdf"
          ? {
              type: "file",
              props: {
                url,
                name: file.name,
              },
            }
          : {
              type: "image",
              props: {
                url,
                caption: file.name,
              },
            };

    if (referenceBlock) {
      editorApi.insertBlocks([block], referenceBlock, "after");
    } else {
      editorApi.insertBlocks([block]);
    }

    window.setTimeout(() => editor.focus(), 60);
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      await insertUploadedFile(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="sop-blocknote-shell min-h-full bg-background px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload media
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            multiple
            className="hidden"
            onChange={(event) => void handleFiles(event.target.files)}
          />
        </div>

        <BlockNoteView
          editor={editor}
          theme="light"
          filePanel={false}
          className="min-h-[calc(100vh-220px)] rounded-2xl bg-background"
        />
      </div>
    </div>
  );
}
