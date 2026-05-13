"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./sop-blocknote-editor.css";

import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  type DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { FileUp, ImageIcon, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  document?: unknown[];
  focus: () => void;
  getTextCursorPosition?: () => { block?: unknown };
  insertBlocks: (
    blocks: InsertableFileBlock[],
    referenceBlock?: unknown,
    placement?: "before" | "after" | "nested",
  ) => void;
};

async function uploadLocalPreviewFile(file: File) {
  return URL.createObjectURL(file);
}

function useResolvedBlockNoteTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    function resolveTheme() {
      const root = document.documentElement;
      const isDark =
        root.classList.contains("dark") ||
        root.style.colorScheme === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      setTheme(isDark ? "dark" : "light");
    }

    resolveTheme();

    const observer = new MutationObserver(resolveTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", resolveTheme);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", resolveTheme);
    };
  }, []);

  return theme;
}

function getSopSlashMenuItems(
  editor: unknown,
  openUploadPicker: (kind: UploadKind) => void,
): DefaultReactSuggestionItem[] {
  const slashEditor = editor as Parameters<typeof getDefaultReactSlashMenuItems>[0];

  const defaultItems = getDefaultReactSlashMenuItems(slashEditor).filter((item) => {
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
  disabled = false,
}: {
  onDocumentChange?: (blocks: SopBlockNoteDocument) => void;
  disabled?: boolean;
}) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const blockNoteTheme = useResolvedBlockNoteTheme();

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
      if (!disabled) editor.focus();
      onDocumentChange?.(editor.document as SopBlockNoteDocument);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [editor, onDocumentChange, disabled]);

  useEffect(() => {
    if (!disabled) return;

    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement?.isContentEditable || activeElement?.closest?.(".sop-blocknote-shell")) {
      activeElement.blur();
    }
  }, [disabled]);

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
            props: { url },
          }
        : file.type === "application/pdf"
          ? {
              type: "file",
              props: {
                url,
                name: "Attached document",
              },
            }
          : {
              type: "image",
              props: {
                url,
                caption: "",
              },
            };

    if (referenceBlock) {
      editorApi.insertBlocks([block], referenceBlock, "after");
    } else {
      editorApi.insertBlocks([block]);
    }

    window.setTimeout(() => {
      editor.focus();
      onDocumentChange?.(editor.document as SopBlockNoteDocument);
    }, 60);
  }

  async function handleFiles(files: FileList | null, input: HTMLInputElement | null) {
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      await insertUploadedFile(file);
    }

    if (input) input.value = "";
  }

  return (
    <div className="sop-blocknote-shell h-full min-h-0 bg-background px-8 py-8">
      <div className="mx-auto h-full max-w-5xl">
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
          theme={blockNoteTheme}
          slashMenu={false}
          editable={!disabled}
          filePanel={false}
          formattingToolbar={true}
          className="min-h-[calc(100vh-220px)] rounded-2xl bg-background"
          onChange={(currentEditor) => {
            onDocumentChange?.(currentEditor.document as SopBlockNoteDocument);
          }}
        >
          {!disabled ? (
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={async (query) =>
                filterSuggestionItems(getSopSlashMenuItems(editor, openUploadPicker), query)
              }
            />
          ) : null}
        </BlockNoteView>
      </div>
    </div>
  );
}
