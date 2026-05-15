"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";
import "@blocknote/shadcn/style.css";
import "./sop-blocknote-editor.css";
import { SopFixedEditorToolbar } from "./sop-fixed-editor-toolbar";

import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  type DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { FileUp, ImageIcon, Video } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent} from "react";

import type { SopBlockNoteDocument } from "@/components/sop/sop-blocknote-preview";

type SopEditorInstance = ReturnType<typeof useCreateBlockNote>;

type KeyboardCapableBlockNoteEditor = {
  _tiptapEditor?: {
    commands?: {
      selectAll?: () => boolean;
    };
  };
};

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

const sopBlockNoteSchema = BlockNoteSchema.create().extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec({
      ...codeBlockOptions,
      indentLineWithTab: true,
      defaultLanguage: "text",
    }),
  },
});

function looksLikeCode(text: string) {
  const trimmed = text.trim();

  if (!trimmed) return false;

  return (
    trimmed.includes("```") ||
    /(^|\n)\s*(import|export|const|let|var|function|class|type|interface|return|if|for|while|switch|case)\b/.test(trimmed) ||
    /(^|\n)\s*(cd |git |npm |pnpm |yarn |python3 |cat >|EOF)/.test(trimmed) ||
    (trimmed.length > 180 && trimmed.includes("{") && trimmed.includes("}"))
  );
}

function fenceCode(text: string) {
  return "```text\n" + text.replace(/```/g, "\`\`\`") + "\n```";
}

function looksLikeTerminalOrCode(value: string) {
  const text = value.trim();

  if (!text) return false;

  const lines = text.split("\n").filter(Boolean);
  const commandLikeLines = lines.filter((line) =>
    /^\s*(cd |git |npm |pnpm |yarn |python3? |npx |cat >|EOF|rm -rf|mkdir |grep |sed |python - <<|Last login:|mil@|[a-zA-Z0-9_-]+@)/.test(line),
  );

  return (
    text.includes("```") ||
    commandLikeLines.length >= 2 ||
    /(^|\n)\s*(import|export|const|let|var|function|class|type|interface|return|if|for|while|switch|case)\b/.test(text) ||
    /<\/?[a-zA-Z][\s\S]*?>/.test(text) ||
    (text.length > 240 && text.includes("{") && text.includes("}"))
  );
}

function toFencedCode(value: string) {
  return "```text\n" + value.replace(/```/g, "\`\`\`") + "\n```";
}

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


function insertSopLinkTemplate(
  editor: SopEditorInstance,
  label: string,
  placeholder: string,
) {
  const currentBlock = editor.getTextCursorPosition().block;

  editor.insertBlocks(
    [
      {
        type: "paragraph",
        content: `${label}: ${placeholder}`,
      },
    ],
    currentBlock,
    "after",
  );
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
  const sopLinkItems = [
    {
      title: "Link URL",
      subtext: "Insert an external URL placeholder.",
      aliases: ["link-url", "url", "external-link"],
      group: "ME Link",
      onItemClick: () =>
        insertSopLinkTemplate(editor, "External URL", "Paste URL here"),
    },
    {
      title: "Link SOP",
      subtext: "Link to another SOP page or document.",
      aliases: ["link-sop", "sop-link", "sop"],
      group: "ME Link",
      onItemClick: () =>
        insertSopLinkTemplate(editor, "SOP Link", "Type SOP title or /sop/path"),
    },
    {
      title: "Link Training",
      subtext: "Link to a staff training course.",
      aliases: ["link-training", "training-link", "course-link"],
      group: "ME Link",
      onItemClick: () =>
        insertSopLinkTemplate(editor, "Training Link", "Type training title or /training/path"),
    },
    {
      title: "Link Exam",
      subtext: "Link to quiz, test, or assessment.",
      aliases: ["link-exam", "exam-link", "quiz-link", "assessment-link"],
      group: "ME Link",
      onItemClick: () =>
        insertSopLinkTemplate(editor, "Exam Link", "Type exam title or /exam/path"),
    },
  ];



  return [...sopLinkItems, ...uploadItems, ...defaultItems];
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
    schema: sopBlockNoteSchema,
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
    uploadFile: uploadLocalPreviewFile,
    pasteHandler: ({ event, editor, defaultPasteHandler }) => {
      const text = event.clipboardData?.getData("text/plain") || "";
      const html = event.clipboardData?.getData("text/html") || "";

      if (text && html && looksLikeCode(text)) {
        editor.pasteMarkdown(fenceCode(text));
        return true;
      }

      if (text && html && text.length > 280) {
        editor.pasteText(text);
        return true;
      }

      return defaultPasteHandler({
        prioritizeMarkdownOverHTML: true,
        plainTextAsMarkdown: true,
      });
    },
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
    <div className="sop-blocknote-shell h-full min-h-0 overflow-hidden bg-background">
      <SopFixedEditorToolbar editor={editor} disabled={disabled} />
      <div
        onKeyDownCapture={(event) => {
          const target = event.target as HTMLElement | null;

          if (!target?.closest?.(".bn-editor")) return;

          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
            const tiptap = (editor as unknown as {
              _tiptapEditor?: {
                commands?: {
                  selectAll?: () => boolean;
                };
              };
            })._tiptapEditor;

            if (tiptap?.commands?.selectAll) {
              event.preventDefault();
              event.stopPropagation();
              tiptap.commands.selectAll();
            }
          }
        }}
        className="sop-blocknote-scroll h-full min-h-0 overflow-y-auto px-8 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="sop-blocknote-page mx-auto min-h-full max-w-5xl pb-40">
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
        formattingToolbar={false}
        slashMenu={false}
        sideMenu={false}
        tableHandles={false}
          editor={editor}
          theme={blockNoteTheme}
         
          editable={!disabled}
          filePanel={false}
         
          className="min-h-[680px] rounded-2xl bg-background"
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
    </div>
  );
}
