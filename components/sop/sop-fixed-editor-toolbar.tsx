"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code2,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  Palette,
  Pilcrow,
  Strikethrough,
  Type,
  Underline,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { insertOrUpdateBlockForSlashMenu } from "@blocknote/core";
import type { useCreateBlockNote } from "@blocknote/react";

type SopEditorInstance = ReturnType<typeof useCreateBlockNote>;
type SopBlock = ReturnType<SopEditorInstance["getTextCursorPosition"]>["block"];
type SopStylePatch = Parameters<SopEditorInstance["addStyles"]>[0];
type SopUpdatePatch = Parameters<SopEditorInstance["updateBlock"]>[1];

type ToolbarPanel = "block" | "textColor" | "highlight" | "table" | "tableColor" | "tableDensity" | null;

type ToolbarPanelPosition = {
  top: number;
  left: number;
};

type SavedTextSelection = {
  from: number;
  to: number;
};

type TiptapChainLike = {
  [key: string]: unknown;
  focus?: () => TiptapChainLike;
  setTextSelection?: (range: SavedTextSelection) => TiptapChainLike;
  setTextAlign?: (value: string) => TiptapChainLike;
  run?: () => boolean;
};

type TiptapLikeEditor = {
  state?: {
    selection?: SavedTextSelection;
  };
  chain?: () => TiptapChainLike;
};

type NestCapableEditor = SopEditorInstance & {
  nestBlock?: (block?: SopBlock) => boolean | void;
  unnestBlock?: (block?: SopBlock) => boolean | void;
};

const textColors = [
  { label: "Default", value: "default", swatch: "hsl(var(--foreground))" },
  { label: "Gray", value: "gray", swatch: "#6b7280" },
  { label: "Red", value: "red", swatch: "#ef4444" },
  { label: "Orange", value: "orange", swatch: "#f97316" },
  { label: "Yellow", value: "yellow", swatch: "#eab308" },
  { label: "Green", value: "green", swatch: "#22c55e" },
  { label: "Blue", value: "blue", swatch: "#3b82f6" },
  { label: "Purple", value: "purple", swatch: "#a855f7" },
  { label: "Pink", value: "pink", swatch: "#ec4899" },
];

const highlightColors = [
  { label: "Clear", value: "default", swatch: "transparent" },
  { label: "Gray", value: "gray", swatch: "#e5e7eb" },
  { label: "Yellow", value: "yellow", swatch: "#fef08a" },
  { label: "Green", value: "green", swatch: "#bbf7d0" },
  { label: "Blue", value: "blue", swatch: "#bfdbfe" },
  { label: "Red", value: "red", swatch: "#fecaca" },
  { label: "Purple", value: "purple", swatch: "#e9d5ff" },
  { label: "Pink", value: "pink", swatch: "#fbcfe8" },
];

const tableCellColors = [
  { label: "Clear", value: "", swatch: "transparent" },
  { label: "Gray", value: "#f8fafc", swatch: "#f8fafc" },
  { label: "Yellow", value: "#fef3c7", swatch: "#fef3c7" },
  { label: "Green", value: "#dcfce7", swatch: "#dcfce7" },
  { label: "Blue", value: "#dbeafe", swatch: "#dbeafe" },
  { label: "Red", value: "#fee2e2", swatch: "#fee2e2" },
  { label: "Purple", value: "#f3e8ff", swatch: "#f3e8ff" },
  { label: "Dark", value: "#111827", swatch: "#111827" },
];

const blockOptions = [
  { label: "Paragraph", description: "Normal SOP instruction", value: "paragraph", icon: Pilcrow },
  { label: "Heading 1", description: "Main section title", value: "heading1", icon: Type },
  { label: "Heading 2", description: "Subsection title", value: "heading2", icon: Type },
  { label: "Heading 3", description: "Small group heading", value: "heading3", icon: Type },
  { label: "Bullet list", description: "Simple notes", value: "bulletListItem", icon: List },
  { label: "Numbered list", description: "Step sequence", value: "numberedListItem", icon: ListOrdered },
  { label: "Checklist", description: "Task item", value: "checkListItem", icon: ListChecks },
  { label: "Code block", description: "Script / terminal note", value: "codeBlock", icon: Code2 },
];

function stopToolbarEvent(event: ReactPointerEvent<HTMLElement>) {
  event.preventDefault();
  event.stopPropagation();
}

function getTiptapEditor(editor: SopEditorInstance): TiptapLikeEditor | undefined {
  return (editor as unknown as { _tiptapEditor?: TiptapLikeEditor })._tiptapEditor;
}

function getSelectedEditorBlocks(editor: SopEditorInstance): SopBlock[] {
  return editor.getSelection()?.blocks || [editor.getTextCursorPosition().block];
}

function SopToolbarPortalPanel({
  children,
  className,
  panelRef,
  position,
}: {
  children: React.ReactNode;
  className: string;
  panelRef: React.RefObject<HTMLDivElement | null>;
  position: ToolbarPanelPosition;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      className={`sop-fixed-toolbar-panel sop-fixed-toolbar-portal-panel ${className}`}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export function SopFixedEditorToolbar({
  editor,
  disabled,
}: {
  editor: SopEditorInstance;
  disabled: boolean;
}) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const savedBlocksRef = useRef<SopBlock[] | null>(null);
  const savedTextSelectionRef = useRef<SavedTextSelection | null>(null);
  const [openPanel, setOpenPanel] = useState<ToolbarPanel>(null);
  const [panelPosition, setPanelPosition] = useState<ToolbarPanelPosition>({
    top: 0,
    left: 0,
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (shellRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpenPanel(null);
      setStatus("");
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPanel(null);
        setStatus("");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  if (disabled) return null;

  function runToolbarAction(
    event: ReactPointerEvent<HTMLElement>,
    action: () => void,
  ) {
    stopToolbarEvent(event);
    action();
  }

  function rememberEditorStateForToolbar() {
    savedBlocksRef.current = getSelectedEditorBlocks(editor);

    const selection = getTiptapEditor(editor)?.state?.selection;

    if (
      selection &&
      typeof selection.from === "number" &&
      typeof selection.to === "number"
    ) {
      savedTextSelectionRef.current = {
        from: selection.from,
        to: selection.to,
      };
    }
  }

  function clearNativeSelection() {
    requestAnimationFrame(() => {
      window.getSelection()?.removeAllRanges();
    });
  }

  function restoreSavedTextSelection() {
    const savedSelection = savedTextSelectionRef.current;
    const chain = getTiptapEditor(editor)?.chain?.();

    if (
      !savedSelection ||
      !chain ||
      typeof chain.focus !== "function" ||
      typeof chain.setTextSelection !== "function"
    ) {
      return;
    }

    const focusedChain = chain.focus();
    const selectedChain = focusedChain.setTextSelection?.(savedSelection);

    if (selectedChain && typeof selectedChain.run === "function") {
      selectedChain.run();
    }
  }

  function updateSavedBlocks(
    patch: { type?: string; props?: Record<string, unknown> },
  ) {
    const blocks = savedBlocksRef.current?.length
      ? savedBlocksRef.current
      : getSelectedEditorBlocks(editor);

    editor.focus();

    for (const block of blocks) {
      editor.updateBlock(block, patch as SopUpdatePatch);
    }
  }

  function insertToolbarBlock(block: Record<string, unknown>) {
    editor.focus();
    insertOrUpdateBlockForSlashMenu(
      editor as Parameters<typeof insertOrUpdateBlockForSlashMenu>[0],
      block as Parameters<typeof insertOrUpdateBlockForSlashMenu>[1],
    );
    setOpenPanel(null);
  }

  function updatePanelPosition() {
    const rect = shellRef.current?.getBoundingClientRect();

    if (!rect) return;

    setPanelPosition({
      top: rect.bottom + 8,
      left: rect.left + 12,
    });
  }

  function togglePanel(panel: Exclude<ToolbarPanel, null>) {
    setStatus("");
    rememberEditorStateForToolbar();
    updatePanelPosition();

    if (panel !== "table" && panel !== "tableColor" && panel !== "tableDensity") {
      clearNativeSelection();
    }

    setOpenPanel((current) => (current === panel ? null : panel));
  }

  function toggleStyle(style: "bold" | "italic" | "underline" | "strike") {
    editor.focus();
    editor.toggleStyles({ [style]: true } as SopStylePatch);
  }

  function applyAlignment(textAlignment: "left" | "center" | "right") {
    updateSavedBlocks({ props: { textAlignment } });

    const chain = getTiptapEditor(editor)?.chain?.();

    if (
      chain &&
      typeof chain.focus === "function" &&
      typeof chain.setTextAlign === "function"
    ) {
      const focusedChain = chain.focus();
      const alignedChain = focusedChain.setTextAlign?.(textAlignment);

      if (alignedChain && typeof alignedChain.run === "function") {
        alignedChain.run();
      }
    }

    setStatus(`Aligned ${textAlignment}.`);
  }

  function applyTextColor(color: string) {
    restoreSavedTextSelection();
    editor.addStyles({ textColor: color } as SopStylePatch);
    setOpenPanel(null);
  }

  function applyHighlight(color: string) {
    restoreSavedTextSelection();
    editor.addStyles({ backgroundColor: color } as SopStylePatch);
    setOpenPanel(null);
  }

  function applyBlockType(type: string) {
    if (type === "paragraph") {
      insertToolbarBlock({ type: "paragraph" });
      return;
    }

    if (type === "heading1") {
      insertToolbarBlock({ type: "heading", props: { level: 1 } });
      return;
    }

    if (type === "heading2") {
      insertToolbarBlock({ type: "heading", props: { level: 2 } });
      return;
    }

    if (type === "heading3") {
      insertToolbarBlock({ type: "heading", props: { level: 3 } });
      return;
    }

    if (type === "bulletListItem") {
      insertToolbarBlock({ type: "bulletListItem" });
      return;
    }

    if (type === "numberedListItem") {
      insertToolbarBlock({ type: "numberedListItem" });
      return;
    }

    if (type === "checkListItem") {
      insertToolbarBlock({ type: "checkListItem" });
      return;
    }

    if (type === "codeBlock") {
      editor.focus();

      const currentBlock = editor.getTextCursorPosition().block;

      try {
        editor.updateBlock(currentBlock, {
          type: "codeBlock",
        } as SopUpdatePatch);

        setStatus("Code block enabled.");
      } catch {
        insertToolbarBlock({ type: "codeBlock" });
        setStatus("Code block inserted.");
      }

      setOpenPanel(null);
    }
  }

  function runNesting(direction: "indent" | "outdent") {
    editor.focus();

    const nestEditor = editor as NestCapableEditor;
    const block = editor.getTextCursorPosition().block;

    if (direction === "indent") {
      const result = nestEditor.nestBlock?.(block);
      if (result === false || result === undefined) {
        setStatus("Indent works on nested/list blocks.");
      }
      return;
    }

    const result = nestEditor.unnestBlock?.(block);
    if (result === false || result === undefined) {
      setStatus("Outdent works on nested/list blocks.");
    }
  }

  function runTableCommand(
    commandName: string,
    args: unknown[],
    successMessage: string,
    fallbackMessage = "Click inside a native table first.",
  ) {
    editor.focus();

    const tiptap = getTiptapEditor(editor);
    const chain = tiptap?.chain?.();

    if (!chain || typeof chain.focus !== "function") {
      setStatus(fallbackMessage);
      return false;
    }

    const focusedChain = chain.focus();
    const command = focusedChain[commandName];

    if (typeof command !== "function") {
      setStatus(fallbackMessage);
      return false;
    }

    const nextChain = command.apply(focusedChain, args) as TiptapChainLike | undefined;
    const runnable = nextChain && typeof nextChain.run === "function" ? nextChain : focusedChain;
    const didRun = typeof runnable.run === "function" ? runnable.run() : false;

    if (didRun === false) {
      setStatus(fallbackMessage);
      return false;
    }

    setStatus(successMessage);
    return true;
  }

  function insertNativeTable(rows = 3, cols = 3, withHeaderRow = true) {
    runTableCommand(
      "insertTable",
      [{ rows, cols, withHeaderRow }],
      `Inserted ${rows} × ${cols} table.`,
      "Native table command is not available here. Type /table in the editor.",
    );
    setOpenPanel(null);
  }

  function applyTableCellColor(color: string) {
    const didRun = runTableCommand(
      "setCellAttribute",
      ["backgroundColor", color || null],
      color ? "Applied cell color." : "Cleared cell color.",
      "Select a table cell first.",
    );

    if (didRun) setOpenPanel(null);
  }

  function runTableDensity(mode: "compact" | "normal" | "comfortable") {
    document.documentElement.dataset.sopTableDensity = mode;
    setStatus(`Table density: ${mode}.`);
    setOpenPanel(null);
  }

  function showLinkCommandHint() {
    editor.focus();
    setOpenPanel(null);
    setStatus("Use /link-url, /link-sop, /link-training, or /link-exam.");
  }

  function onShellKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpenPanel(null);
      setStatus("");
    }
  }

  return (
    <div
      ref={shellRef}
      className="sop-fixed-editor-toolbar-shell"
      onKeyDown={onShellKeyDown}
    >
      <div className="sop-fixed-editor-toolbar">
        <button type="button" title="Text style" aria-expanded={openPanel === "block"} onPointerDown={(event) => runToolbarAction(event, () => togglePanel("block"))}>
          <Type size={15} />
          <ChevronDown size={12} />
        </button>

        <span className="sop-toolbar-divider" />

        <button type="button" title="Bold" onPointerDown={(event) => runToolbarAction(event, () => toggleStyle("bold"))}><Bold size={14} /></button>
        <button type="button" title="Italic" onPointerDown={(event) => runToolbarAction(event, () => toggleStyle("italic"))}><Italic size={14} /></button>
        <button type="button" title="Underline" onPointerDown={(event) => runToolbarAction(event, () => toggleStyle("underline"))}><Underline size={14} /></button>
        <button type="button" title="Strikethrough" onPointerDown={(event) => runToolbarAction(event, () => toggleStyle("strike"))}><Strikethrough size={14} /></button>

        <span className="sop-toolbar-divider" />

        <button type="button" title="Align left" onPointerDown={(event) => runToolbarAction(event, () => applyAlignment("left"))}><AlignLeft size={14} /></button>
        <button type="button" title="Align center" onPointerDown={(event) => runToolbarAction(event, () => applyAlignment("center"))}><AlignCenter size={14} /></button>
        <button type="button" title="Align right" onPointerDown={(event) => runToolbarAction(event, () => applyAlignment("right"))}><AlignRight size={14} /></button>

        <span className="sop-toolbar-divider" />

        <button type="button" title="Text color" aria-expanded={openPanel === "textColor"} onPointerDown={(event) => runToolbarAction(event, () => togglePanel("textColor"))}><Palette size={14} /></button>
        <button type="button" title="Highlight" aria-expanded={openPanel === "highlight"} onPointerDown={(event) => runToolbarAction(event, () => togglePanel("highlight"))}><Highlighter size={14} /></button>

        <span className="sop-toolbar-divider" />

        <button type="button" title="Indent" onPointerDown={(event) => runToolbarAction(event, () => runNesting("indent"))}><IndentIncrease size={14} /></button>
        <button type="button" title="Outdent" onPointerDown={(event) => runToolbarAction(event, () => runNesting("outdent"))}><IndentDecrease size={14} /></button>

        <span className="sop-toolbar-divider" />

        <button type="button" title="Use slash command for links" onPointerDown={(event) => runToolbarAction(event, showLinkCommandHint)}><LinkIcon size={14} /></button>

        <span className="sop-toolbar-divider" />

        <button type="button" title="Insert 3 × 3 table" onPointerDown={(event) => runToolbarAction(event, () => insertNativeTable(3, 3, true))}>
          <span className="sop-toolbar-text-icon">▦</span>
        </button>
        <button type="button" title="Table tools" aria-expanded={openPanel === "table"} onPointerDown={(event) => runToolbarAction(event, () => togglePanel("table"))}>
          <ChevronDown size={12} />
        </button>
      </div>

      {status ? <div className="sop-fixed-toolbar-status">{status}</div> : null}

      {openPanel === "block" ? (
        <SopToolbarPortalPanel panelRef={panelRef} position={panelPosition} className="sop-fixed-toolbar-block-panel">
          <div className="sop-fixed-toolbar-panel-head">
            <div>
              <div className="sop-fixed-toolbar-panel-title">Text style</div>
              <p>Choose a block style for the selected line.</p>
            </div>
            <button type="button" title="Close" onPointerDown={(event) => runToolbarAction(event, () => setOpenPanel(null))}>
              <X size={13} />
            </button>
          </div>

          <div className="sop-fixed-toolbar-block-grid">
            {blockOptions.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  title={option.description}
                  className="sop-fixed-toolbar-block-card"
                  onPointerDown={(event) => runToolbarAction(event, () => applyBlockType(option.value))}
                >
                  <Icon size={15} />
                  <span>{option.label}</span>
                  <small>{option.description}</small>
                </button>
              );
            })}
          </div>
        </SopToolbarPortalPanel>
      ) : null}

      {openPanel === "table" ? (
        <SopToolbarPortalPanel panelRef={panelRef} position={panelPosition} className="sop-fixed-toolbar-table-panel sop-fixed-toolbar-table-pro-panel">
          <div className="sop-fixed-toolbar-panel-head">
            <div>
              <div className="sop-fixed-toolbar-panel-title">Table tools</div>
              <p>Use native table handles for fast row/column changes. Use this panel for full actions.</p>
            </div>
            <button type="button" title="Close" onPointerDown={(event) => runToolbarAction(event, () => setOpenPanel(null))}>
              <X size={13} />
            </button>
          </div>

          <div className="sop-table-tool-section">
            <div className="sop-table-tool-label">Insert</div>
            <div className="sop-fixed-toolbar-table-grid">
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => insertNativeTable(2, 2, true))}>2 × 2</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => insertNativeTable(3, 3, true))}>3 × 3</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => insertNativeTable(4, 4, true))}>4 × 4</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => insertNativeTable(5, 5, true))}>5 × 5</button>
            </div>
          </div>

          <div className="sop-table-tool-section">
            <div className="sop-table-tool-label">Rows</div>
            <div className="sop-fixed-toolbar-table-grid">
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("addRowBefore", [], "Added row above."))}>Row above</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("addRowAfter", [], "Added row below."))}>Row below</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("deleteRow", [], "Deleted row."))}>Delete row</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("toggleHeaderRow", [], "Toggled header row."))}>Header row</button>
            </div>
          </div>

          <div className="sop-table-tool-section">
            <div className="sop-table-tool-label">Columns</div>
            <div className="sop-fixed-toolbar-table-grid">
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("addColumnBefore", [], "Added column left."))}>Column left</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("addColumnAfter", [], "Added column right."))}>Column right</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("deleteColumn", [], "Deleted column."))}>Delete column</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("toggleHeaderColumn", [], "Toggled header column."))}>Header column</button>
            </div>
          </div>

          <div className="sop-table-tool-section">
            <div className="sop-table-tool-label">Cells</div>
            <div className="sop-fixed-toolbar-table-grid">
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("mergeCells", [], "Merged cells.", "Select adjacent table cells first."))}>Merge cells</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("splitCell", [], "Split cell.", "Select a merged table cell first."))}>Split cell</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("toggleHeaderCell", [], "Toggled header cell."))}>Header cell</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => togglePanel("tableColor"))}>Cell color</button>
            </div>
          </div>

          <div className="sop-table-tool-section">
            <div className="sop-table-tool-label">Table</div>
            <div className="sop-fixed-toolbar-table-grid">
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("fixTables", [], "Fixed table structure.", "No table repair needed."))}>Fix table</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableCommand("deleteTable", [], "Deleted table."))}>Delete table</button>
              <button type="button" onPointerDown={(event) => runToolbarAction(event, () => togglePanel("tableDensity"))}>Density</button>
            </div>
          </div>
        </SopToolbarPortalPanel>
      ) : null}

      {openPanel === "tableColor" ? (
        <SopToolbarPortalPanel panelRef={panelRef} position={panelPosition} className="sop-fixed-toolbar-color-panel sop-fixed-toolbar-table-color-panel">
          <div className="sop-fixed-toolbar-panel-head">
            <div>
              <div className="sop-fixed-toolbar-panel-title">Table cell color</div>
              <p>Apply background color to selected table cells.</p>
            </div>
            <button type="button" title="Close" onPointerDown={(event) => runToolbarAction(event, () => setOpenPanel(null))}>
              <X size={13} />
            </button>
          </div>

          <div className="sop-fixed-toolbar-swatch-grid">
            {tableCellColors.map((color) => (
              <button
                key={color.label}
                type="button"
                title={color.label}
                className="sop-fixed-toolbar-swatch-item"
                onPointerDown={(event) => runToolbarAction(event, () => applyTableCellColor(color.value))}
              >
                <span
                  className="sop-fixed-toolbar-swatch"
                  style={{
                    background: color.swatch,
                    borderStyle: color.value ? "solid" : "dashed",
                  }}
                />
                <span>{color.label}</span>
              </button>
            ))}
          </div>
        </SopToolbarPortalPanel>
      ) : null}

      {openPanel === "tableDensity" ? (
        <SopToolbarPortalPanel panelRef={panelRef} position={panelPosition} className="sop-fixed-toolbar-table-panel">
          <div className="sop-fixed-toolbar-panel-head">
            <div>
              <div className="sop-fixed-toolbar-panel-title">Table density</div>
              <p>Change row height and cell padding.</p>
            </div>
            <button type="button" title="Close" onPointerDown={(event) => runToolbarAction(event, () => setOpenPanel(null))}>
              <X size={13} />
            </button>
          </div>
          <div className="sop-fixed-toolbar-table-grid">
            <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableDensity("compact"))}>Compact</button>
            <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableDensity("normal"))}>Normal</button>
            <button type="button" onPointerDown={(event) => runToolbarAction(event, () => runTableDensity("comfortable"))}>Comfortable</button>
          </div>
        </SopToolbarPortalPanel>
      ) : null}

      {openPanel === "textColor" ? (
        <SopToolbarPortalPanel panelRef={panelRef} position={panelPosition} className="sop-fixed-toolbar-color-panel">
          <div className="sop-fixed-toolbar-panel-head">
            <div>
              <div className="sop-fixed-toolbar-panel-title">Text color</div>
              <p>Apply color to selected words.</p>
            </div>
            <button type="button" title="Close" onPointerDown={(event) => runToolbarAction(event, () => setOpenPanel(null))}>
              <X size={13} />
            </button>
          </div>

          <div className="sop-fixed-toolbar-swatch-grid">
            {textColors.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.label}
                className="sop-fixed-toolbar-swatch-item"
                onPointerDown={(event) => runToolbarAction(event, () => applyTextColor(color.value))}
              >
                <span className="sop-fixed-toolbar-swatch" style={{ background: color.swatch }} />
                <span>{color.label}</span>
              </button>
            ))}
          </div>
        </SopToolbarPortalPanel>
      ) : null}

      {openPanel === "highlight" ? (
        <SopToolbarPortalPanel panelRef={panelRef} position={panelPosition} className="sop-fixed-toolbar-color-panel">
          <div className="sop-fixed-toolbar-panel-head">
            <div>
              <div className="sop-fixed-toolbar-panel-title">Highlight</div>
              <p>Mark important warnings or key actions.</p>
            </div>
            <button type="button" title="Close" onPointerDown={(event) => runToolbarAction(event, () => setOpenPanel(null))}>
              <X size={13} />
            </button>
          </div>

          <div className="sop-fixed-toolbar-swatch-grid">
            {highlightColors.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.label}
                className="sop-fixed-toolbar-swatch-item"
                onPointerDown={(event) => runToolbarAction(event, () => applyHighlight(color.value))}
              >
                <span
                  className="sop-fixed-toolbar-swatch"
                  style={{
                    background: color.swatch,
                    borderStyle: color.value === "default" ? "dashed" : "solid",
                  }}
                />
                <span>{color.label}</span>
              </button>
            ))}
          </div>
        </SopToolbarPortalPanel>
      ) : null}
    </div>
  );
}
