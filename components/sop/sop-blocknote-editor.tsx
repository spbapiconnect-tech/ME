"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./sop-blocknote-editor.css";

import type { PartialBlock } from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  CreateLinkButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  type DefaultReactSuggestionItem,
  UnnestBlockButton,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useBlockNoteEditor,
  useComponentsContext,
  useCreateBlockNote,
  useEditorState,
  useSelectedBlocks,
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

type SopTextColor = "default" | "gray" | "brown" | "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink";

function SopColorButton({
  color,
  label,
  mode = "text",
}: {
  color: SopTextColor;
  label: string;
  mode?: "text" | "background";
}) {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const blocks = useSelectedBlocks();

  const isSelected = useEditorState({
    editor,
    selector: ({ editor }) => {
      const styles = editor.getActiveStyles();
      return mode === "text" ? styles.textColor === color : styles.backgroundColor === color;
    },
  });

  if (blocks.filter((block) => block.content !== undefined).length === 0) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={`${label} ${mode === "text" ? "text" : "background"}`}
      onClick={() =>
        editor.toggleStyles(
          mode === "text"
            ? { textColor: color }
            : { backgroundColor: color },
        )
      }
      isSelected={isSelected}
    >
      <span className="flex items-center gap-1 text-xs">
        <span
          className="h-3 w-3 rounded-full border"
          style={{ backgroundColor: color === "default" ? "transparent" : color }}
        />
        {mode === "text" ? label : `BG ${label}`}
      </span>
    </Components.FormattingToolbar.Button>
  );
}

function SopFormattingToolbar() {
  return (
    <FormattingToolbar>
      <BlockTypeSelect key="blockTypeSelect" />
      <BasicTextStyleButton basicTextStyle="bold" key="bold" />
      <BasicTextStyleButton basicTextStyle="italic" key="italic" />
      <BasicTextStyleButton basicTextStyle="underline" key="underline" />
      <BasicTextStyleButton basicTextStyle="strike" key="strike" />
      <TextAlignButton textAlignment="left" key="alignLeft" />
      <TextAlignButton textAlignment="center" key="alignCenter" />
      <TextAlignButton textAlignment="right" key="alignRight" />
      <SopColorButton color="default" label="Auto" key="colorAuto" />
      <SopColorButton color="gray" label="Gray" key="colorGray" />
      <SopColorButton color="brown" label="Brown" key="colorBrown" />
      <SopColorButton color="red" label="Red" key="colorRed" />
      <SopColorButton color="orange" label="Orange" key="colorOrange" />
      <SopColorButton color="yellow" label="Yellow" key="colorYellow" />
      <SopColorButton color="green" label="Green" key="colorGreen" />
      <SopColorButton color="blue" label="Blue" key="colorBlue" />
      <SopColorButton color="purple" label="Purple" key="colorPurple" />
      <SopColorButton color="pink" label="Pink" key="colorPink" />
      <SopColorButton color="yellow" label="Yellow" mode="background" key="bgYellow" />
      <SopColorButton color="red" label="Red" mode="background" key="bgRed" />
      <SopColorButton color="blue" label="Blue" mode="background" key="bgBlue" />
      <NestBlockButton key="nest" />
      <UnnestBlockButton key="unnest" />
      <CreateLinkButton key="link" />
    </FormattingToolbar>
  );
}

function getSopSlashMenuItems(
  editor: unknown,
  openUploadPicker: (kind: UploadKind) => void,
): DefaultReactSuggestionItem[] {
  const slashEditor = editor as unknown as Parameters<typeof getDefaultReactSlashMenuItems>[0];
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
            },
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
          formattingToolbar={false}
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
          <FormattingToolbarController formattingToolbar={SopFormattingToolbar} />
        </BlockNoteView>
      </div>
    </div>
  );
}
