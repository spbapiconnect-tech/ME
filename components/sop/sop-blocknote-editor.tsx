"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./sop-blocknote-editor.css";

import type { PartialBlock } from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  type DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { FileUp, ImageIcon, Video } from "lucide-react";
import { useEffect, useRef } from "react";

import type { SopBlockNoteDocument } from "@/components/sop/sop-blocknote-preview";

type UploadKind = "image" | "video" | "file";

type InsertableFileBlock = {
  type: "image" | "video" | "file";
  props: {
    url: string;
    name?: string;
    caption?: string;
  };
};

type InsertableEditor = {
  document?: PartialBlock[];
  focus: () => void;
  getTextCursorPosition?: () => { block?: PartialBlock };
  insertBlocks: (
    blocks: InsertableFileBlock[],
    referenceBlock?: PartialBlock,
    placement?: "before" | "after" | "nested",
  ) => void;
};

async function uploadLocalPreviewFile(file: File) {
  return URL.createObjectURL(file);
}

function getSopSlashMenuItems(
  editor: Parameters<typeof getDefaultReactSlashMenuItems>[0],
  openUploadPicker: (kind: UploadKind) => void,
): DefaultReactSuggestionItem[] {
  const defaultItems = getDefaultReactSlashMenuItems(editor).filter((item) => {
    const title = item.title.toLowerCase();
    return !["image", "video", "audio", "file"].some((keyword) => title.includes(keyword));
  });

  const uploadItems: DefaultReactSuggestionItem[] = [
    {
      title: "Upload image",
      subtext: "Choose photo or GIF from computer / phone.",
      aliases: ["image", "photo", "picture", "gif", "upload"],
      group: "SOP Media",
      icon: <ImageIcon size={18} />,
      onItemClick: () => openUploadPicker("image"),
    },
    {
      title: "Upload video",
      subtext: "Choose training video from computer / phone.",
      aliases: ["video", "clip", "training", "upload"],
      group: "SOP Media",
      icon: <Video size={18} />,
      onItemClick: () => openUploadPicker("video"),
    },
    {
      title: "Upload PDF / file",
      subtext: "Attach PDF or document reference.",
      aliases: ["pdf", "file", "document", "upload"],
      group: "SOP Media",
      icon: <FileUp size={18} />,
      onItemClick: () => openUploadPicker("file"),
    },
  ];

  return [...uploadItems, ...defaultItems];
}

export function SopBlockNoteEditor({
  onDocumentChange,
}: {
  onDocumentChange?: (blocks: SopBlockNoteDocument) => void;
}) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
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
      onDocumentChange?.(editor.document as SopBlockNoteDocument);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [editor, onDocumentChange]);

  function openUploadPicker(kind: UploadKind) {
    if (kind === "image") imageInputRef.current?.click();
    if (kind === "video") videoInputRef.current?.click();
    if (kind === "file") fileInputRef.current?.click();
  }

  async function insertUploadedFile(file: File) {
    const url = await uploadLocalPreviewFile(file);
    const editorApi = editor as unknown as InsertableEditor;
    const cursorBlock = editorApi.getTextCursorPosition?.()?.block;
    const lastBlock = editorApi.document?.[editorApi.document.length - 1];
    const referenceBlock = cursorBlock || lastBlock;

    const block: InsertableFileBlock =
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

    onDocumentChange?.(editor.document as SopBlockNoteDocument);
    window.setTimeout(() => editor.focus(), 60);
  }

  async function handleFiles(files: FileList | null, input: HTMLInputElement | null) {
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      await insertUploadedFile(file);
    }

    if (input) input.value = "";
  }

  return (
    <div className="sop-blocknote-shell min-h-full bg-background px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files, event.currentTarget)}
        />

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files, event.currentTarget)}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files, event.currentTarget)}
        />

        <BlockNoteView
          editor={editor}
          theme="light"
          slashMenu={false}
          filePanel={false}
          className="min-h-[calc(100vh-220px)] rounded-2xl bg-background"
          onChange={(currentEditor) => {
            onDocumentChange?.(currentEditor.document as SopBlockNoteDocument);
          }}
        >
          <SuggestionMenuController
            triggerCharacter="/"
            getItems={async (query) =>
              filterSuggestionItems(getSopSlashMenuItems(editor, openUploadPicker), query)
            }
          />
        </BlockNoteView>
      </div>
    </div>
  );
}
