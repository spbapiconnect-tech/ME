"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Columns3,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Merge,
  PaintBucket,
  Plus,
  Rows3,
  Split,
  Table2,
  Trash2,
  Type,
  Underline,
  Video,
} from "lucide-react";

import type { SopBlockNoteDocument } from "@/components/sop/sop-blocknote-preview";

import "./sop-plate-editor.css";

type SopPlateEditorProps = {
  disabled?: boolean;
  initialContent?: SopBlockNoteDocument;
  storageKey?: string;
  onDocumentChange?: (blocks: SopBlockNoteDocument) => void;
};

type TableDensity = "compact" | "normal" | "comfortable";
type PanelMode = "table" | "cellColor" | "textColor" | "highlight" | "density" | "link" | null;
type LinkType = "url" | "sop" | "training" | "exam";

const EMPTY_HTML = "<p><br /></p>";

const cellColors = [
  { label: "Clear", value: "", swatch: "transparent", clear: true },
  { label: "Gray", value: "#f8fafc", swatch: "#f8fafc" },
  { label: "Yellow", value: "#fef3c7", swatch: "#fef3c7" },
  { label: "Green", value: "#dcfce7", swatch: "#dcfce7" },
  { label: "Blue", value: "#dbeafe", swatch: "#dbeafe" },
  { label: "Red", value: "#fee2e2", swatch: "#fee2e2" },
  { label: "Purple", value: "#f3e8ff", swatch: "#f3e8ff" },
  { label: "Dark", value: "#111827", swatch: "#111827" },
];

const textColors = [
  { label: "Default", value: "", swatch: "hsl(var(--foreground))", clear: true },
  { label: "Gray", value: "#64748b", swatch: "#64748b" },
  { label: "Red", value: "#dc2626", swatch: "#dc2626" },
  { label: "Orange", value: "#ea580c", swatch: "#ea580c" },
  { label: "Green", value: "#16a34a", swatch: "#16a34a" },
  { label: "Blue", value: "#2563eb", swatch: "#2563eb" },
  { label: "Purple", value: "#9333ea", swatch: "#9333ea" },
  { label: "Dark", value: "#0f172a", swatch: "#0f172a" },
];

const highlightColors = [
  { label: "Clear", value: "", swatch: "transparent", clear: true },
  { label: "Yellow", value: "#fef08a", swatch: "#fef08a" },
  { label: "Green", value: "#bbf7d0", swatch: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe", swatch: "#bfdbfe" },
  { label: "Red", value: "#fecaca", swatch: "#fecaca" },
  { label: "Purple", value: "#e9d5ff", swatch: "#e9d5ff" },
  { label: "Gray", value: "#e5e7eb", swatch: "#e5e7eb" },
];

function makeTable(rows: number, cols: number) {
  const body = Array.from({ length: rows })
    .map((_, rowIndex) => {
      const tag = rowIndex === 0 ? "th" : "td";
      return `<tr>${Array.from({ length: cols })
        .map(() => `<${tag}><br /></${tag}>`)
        .join("")}</tr>`;
    })
    .join("");

  return `<table><tbody>${body}</tbody></table><p><br /></p>`;
}

function closestCell(node: Node | null): HTMLTableCellElement | null {
  if (!node) return null;
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return element?.closest("td,th") as HTMLTableCellElement | null;
}

function closestEditableBlock(node: Node | null): HTMLElement | null {
  if (!node) return null;
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return element?.closest("p,h1,h2,h3,li,blockquote,td,th") as HTMLElement | null;
}

function cleanHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
}

function htmlToBlocks(html: string): SopBlockNoteDocument {
  const safeHtml = cleanHtml(html || EMPTY_HTML);

  return [
    {
      id: "dom-html-document",
      type: "plateHtml",
      props: { html: safeHtml },
      content: "",
    } as unknown,
  ] as SopBlockNoteDocument;
}

function normalizePastedText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function initialContentToHtml(blocks?: SopBlockNoteDocument) {
  if (!Array.isArray(blocks) || !blocks.length) return EMPTY_HTML;

  const htmlBlock = (blocks as Array<{ type?: string; props?: { html?: string }; content?: string }>).find(
    (block) => block.type === "plateHtml" && block.props?.html,
  );

  if (htmlBlock?.props?.html) return htmlBlock.props.html;

  return (blocks as Array<{ type?: string; props?: { level?: number }; content?: string }>)
    .map((block) => {
      const content = escapeHtml(String(block.content || ""));
      if (block.type === "heading") {
        const level = block.props?.level || 2;
        return `<h${level}>${content || "<br />"}</h${level}>`;
      }
      if (block.type === "plateTable" && (block as unknown as { props?: { html?: string } }).props?.html) {
        return String((block as unknown as { props?: { html?: string } }).props?.html);
      }
      return `<p>${content || "<br />"}</p>`;
    })
    .join("") || EMPTY_HTML;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ToolbarButton({
  children,
  title,
  disabled,
  active,
  onRun,
}: {
  children: ReactNode;
  title?: string;
  disabled?: boolean;
  active?: boolean;
  onRun: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      className={active ? "is-active" : ""}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!disabled) onRun();
      }}
    >
      {children}
    </button>
  );
}

export function SopPlateEditor({
  disabled = false,
  initialContent,
  storageKey: _storageKey,
  onDocumentChange,
}: SopPlateEditorProps) {
  void _storageKey;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedCellRef = useRef<HTMLTableCellElement | null>(null);
  const [selectedCellLabel, setSelectedCellLabel] = useState("");
  const [openPanel, setOpenPanel] = useState<PanelMode>(null);
  const [tableDensity, setTableDensity] = useState<TableDensity>("normal");
  const [status, setStatus] = useState("SOP Editor ready.");
  const [activeBlock, setActiveBlock] = useState("p");
  const [linkType, setLinkType] = useState<LinkType>("url");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkTarget, setLinkTarget] = useState("");

  function emit() {
    const html = editorRef.current?.innerHTML || EMPTY_HTML;
    onDocumentChange?.(htmlToBlocks(html));
  }

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    savedRangeRef.current = range.cloneRange();
  }

  function restoreSelection() {
    const range = savedRangeRef.current;
    if (!range) return false;

    const selection = window.getSelection();
    if (!selection) return false;

    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }

  function focusEditor() {
    if (disabled) return;
    editorRef.current?.focus();

    if (!restoreSelection()) {
      const editor = editorRef.current;
      if (!editor) return;

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      savedRangeRef.current = range.cloneRange();
    }
  }

  function updateActiveBlock() {
    const selection = window.getSelection();
    const block = closestEditableBlock(selection?.anchorNode || null);
    const tag = block?.tagName.toLowerCase() || "p";
    setActiveBlock(tag);
  }

  function refreshSelectedCellFromSelection() {
    const selection = window.getSelection();
    const cell = closestCell(selection?.anchorNode || null);

    if (cell) {
      selectedCellRef.current?.classList.remove("sop-selected-cell");
      selectedCellRef.current = cell;
      cell.classList.add("sop-selected-cell");

      const row = cell.parentElement;
      const rowIndex = row ? Array.from(row.parentElement?.children || []).indexOf(row) + 1 : 0;
      const colIndex = Array.from(row?.children || []).indexOf(cell) + 1;
      setSelectedCellLabel(rowIndex && colIndex ? `R${rowIndex} C${colIndex}` : "Cell selected");
    }

    updateActiveBlock();
  }

  function runCommand(command: string, value?: string, label?: string) {
    focusEditor();
    document.execCommand(command, false, value);
    saveSelection();
    setStatus(label || `${command} applied.`);
    window.setTimeout(emit, 0);
  }

  function setBlock(tag: "p" | "h1" | "h2" | "h3") {
    focusEditor();

    const selection = window.getSelection();
    const block = closestEditableBlock(selection?.anchorNode || null);

    if (block && editorRef.current?.contains(block) && !["td", "th"].includes(block.tagName.toLowerCase())) {
      const replacement = document.createElement(tag);
      replacement.innerHTML = block.innerHTML || "<br />";
      block.replaceWith(replacement);

      const range = document.createRange();
      range.selectNodeContents(replacement);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      savedRangeRef.current = range.cloneRange();
    } else {
      document.execCommand("formatBlock", false, `<${tag}>`);
    }

    setActiveBlock(tag);
    setStatus(tag === "p" ? "Paragraph." : `${tag.toUpperCase()} title.`);
    window.setTimeout(emit, 0);
  }

  function wrapSelectionWithSpan(style: Partial<CSSStyleDeclaration>, label: string) {
    focusEditor();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).collapsed) {
      setStatus("Select text first.");
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    Object.assign(span.style, style);

    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    newRange.collapse(false);
    selection.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();

    setStatus(label);
    window.setTimeout(emit, 0);
  }

  function applyTextColor(color: string) {
    if (color) {
      wrapSelectionWithSpan({ color }, "Applied text color.");
    } else {
      runCommand("removeFormat", undefined, "Cleared text format.");
    }

    setOpenPanel(null);
  }

  function applyHighlight(color: string) {
    if (color) {
      wrapSelectionWithSpan({ backgroundColor: color }, "Applied highlight.");
    } else {
      runCommand("removeFormat", undefined, "Cleared highlight.");
    }

    setOpenPanel(null);
  }

  function insertHtml(html: string) {
    focusEditor();
    document.execCommand("insertHTML", false, html);
    saveSelection();
    setStatus("Inserted.");
    window.setTimeout(emit, 0);
  }

  function insertTable(rows: number, cols: number) {
    insertHtml(makeTable(rows, cols));
    setOpenPanel(null);
  }

  function selectedCell() {
    refreshSelectedCellFromSelection();
    const cell = selectedCellRef.current;

    if (!cell || !editorRef.current?.contains(cell)) {
      setStatus("Click inside a table cell first.");
      return null;
    }

    return cell;
  }

  function tableFromCell(cell: HTMLTableCellElement) {
    return cell.closest("table") as HTMLTableElement | null;
  }

  function rowFromCell(cell: HTMLTableCellElement) {
    return cell.parentElement as HTMLTableRowElement | null;
  }

  function addRow(position: "above" | "below") {
    const cell = selectedCell();
    if (!cell) return;

    const row = rowFromCell(cell);
    const table = tableFromCell(cell);
    if (!row || !table) return;

    const columnCount = row.children.length;
    const newRow = document.createElement("tr");

    for (let index = 0; index < columnCount; index += 1) {
      const sourceCell = row.children[index] as HTMLTableCellElement | undefined;
      const newCell = document.createElement(sourceCell?.tagName.toLowerCase() === "th" ? "th" : "td");
      newCell.innerHTML = "<br />";
      newRow.appendChild(newCell);
    }

    if (position === "above") {
      row.before(newRow);
      setStatus("Added row above.");
    } else {
      row.after(newRow);
      setStatus("Added row below.");
    }

    emit();
  }

  function deleteCurrentRow() {
    const cell = selectedCell();
    if (!cell) return;

    const row = rowFromCell(cell);
    if (!row) return;

    const table = tableFromCell(cell);
    row.remove();

    if (table && !table.querySelector("tr")) {
      table.remove();
    }

    selectedCellRef.current = null;
    setSelectedCellLabel("");
    setStatus("Deleted row.");
    emit();
  }

  function addColumn(position: "left" | "right") {
    const cell = selectedCell();
    if (!cell) return;

    const row = rowFromCell(cell);
    const table = tableFromCell(cell);
    if (!row || !table) return;

    const columnIndex = Array.from(row.children).indexOf(cell);

    Array.from(table.rows).forEach((tableRow) => {
      const reference = tableRow.children[columnIndex] as HTMLTableCellElement | undefined;
      const newCell = document.createElement(reference?.tagName.toLowerCase() === "th" ? "th" : "td");
      newCell.innerHTML = "<br />";

      if (!reference) {
        tableRow.appendChild(newCell);
      } else if (position === "left") {
        reference.before(newCell);
      } else {
        reference.after(newCell);
      }
    });

    setStatus(position === "left" ? "Added column left." : "Added column right.");
    emit();
  }

  function deleteCurrentColumn() {
    const cell = selectedCell();
    if (!cell) return;

    const row = rowFromCell(cell);
    const table = tableFromCell(cell);
    if (!row || !table) return;

    const columnIndex = Array.from(row.children).indexOf(cell);

    Array.from(table.rows).forEach((tableRow) => {
      tableRow.children[columnIndex]?.remove();
    });

    if (!table.querySelector("td,th")) {
      table.remove();
    }

    selectedCellRef.current = null;
    setSelectedCellLabel("");
    setStatus("Deleted column.");
    emit();
  }

  function applyCellColor(color: string) {
    const cell = selectedCell();
    if (!cell) return;

    if (color) {
      cell.style.backgroundColor = color;
      if (color === "#111827") cell.style.color = "#ffffff";
    } else {
      cell.style.backgroundColor = "";
      cell.style.color = "";
    }

    setStatus(color ? "Applied cell color." : "Cleared cell color.");
    setOpenPanel(null);
    emit();
  }

  function toggleHeaderCell() {
    const cell = selectedCell();
    if (!cell) return;

    const replacement = document.createElement(cell.tagName.toLowerCase() === "th" ? "td" : "th");
    replacement.innerHTML = cell.innerHTML || "<br />";
    replacement.style.cssText = cell.style.cssText;

    Array.from(cell.attributes).forEach((attribute) => {
      if (attribute.name !== "style") replacement.setAttribute(attribute.name, attribute.value);
    });

    cell.replaceWith(replacement);
    selectedCellRef.current = replacement as HTMLTableCellElement;
    replacement.classList.add("sop-selected-cell");
    setStatus("Toggled header cell.");
    emit();
  }

  function mergeRight() {
    const cell = selectedCell();
    if (!cell) return;

    const next = cell.nextElementSibling as HTMLTableCellElement | null;
    if (!next) {
      setStatus("No cell on the right to merge.");
      return;
    }

    const currentSpan = Number(cell.getAttribute("colspan") || "1");
    const nextSpan = Number(next.getAttribute("colspan") || "1");
    cell.setAttribute("colspan", String(currentSpan + nextSpan));

    if ((next.textContent || "").trim()) {
      cell.innerHTML = `${cell.innerHTML}<br />${next.innerHTML}`;
    }

    next.remove();
    setStatus("Merged with right cell.");
    emit();
  }

  function splitCell() {
    const cell = selectedCell();
    if (!cell) return;

    const colspan = Number(cell.getAttribute("colspan") || "1");
    const rowspan = Number(cell.getAttribute("rowspan") || "1");

    if (colspan <= 1 && rowspan <= 1) {
      setStatus("Selected cell is not merged.");
      return;
    }

    cell.removeAttribute("colspan");
    cell.removeAttribute("rowspan");

    for (let index = 1; index < colspan; index += 1) {
      const newCell = document.createElement(cell.tagName.toLowerCase());
      newCell.innerHTML = "<br />";
      cell.after(newCell);
    }

    setStatus("Split cell.");
    emit();
  }

  function applyDensity(mode: TableDensity) {
    setTableDensity(mode);
    setStatus(`Table density: ${mode}.`);
    setOpenPanel(null);
  }

  function openMediaPicker() {
    fileInputRef.current?.click();
  }

  function handleMediaUpload(files: FileList | null) {
    if (!files?.length) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const src = String(reader.result || "");
        if (!src) return;

        if (file.type.startsWith("video/")) {
          insertHtml(`<figure class="sop-media sop-video"><video controls src="${src}"></video><figcaption>${escapeHtml(file.name)}</figcaption></figure><p><br /></p>`);
        } else {
          insertHtml(`<figure class="sop-media sop-image"><img src="${src}" alt="${escapeHtml(file.name)}" /><figcaption>${escapeHtml(file.name)}</figcaption></figure><p><br /></p>`);
        }

        setStatus(`Uploaded ${file.type.startsWith("video/") ? "video" : "image"}.`);
      };

      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function buildLinkHref(type: LinkType, target: string) {
    const cleanTarget = target.trim();

    if (type === "url") return cleanTarget || "#";
    if (type === "sop") return cleanTarget.startsWith("/sop/") ? cleanTarget : `/sop/${cleanTarget || "sop-id"}`;
    if (type === "training") return cleanTarget.startsWith("/training/") ? cleanTarget : `/training/${cleanTarget || "course-id"}`;
    return cleanTarget.startsWith("/exam/") ? cleanTarget : `/exam/${cleanTarget || "exam-id"}`;
  }

  function insertLink() {
    const href = buildLinkHref(linkType, linkTarget);
    const label = linkLabel.trim() || linkTarget.trim() || (linkType === "url" ? "Link" : `Link ${linkType}`);

    focusEditor();

    const selection = window.getSelection();
    if (selection && selection.rangeCount && !selection.getRangeAt(0).collapsed) {
      document.execCommand("createLink", false, href);
      const anchor = selection.anchorNode?.parentElement?.closest("a");
      anchor?.setAttribute("data-link-type", linkType);
      anchor?.classList.add("sop-link-chip");
    } else {
      insertHtml(`<a href="${escapeHtml(href)}" data-link-type="${linkType}" class="sop-link-chip">${escapeHtml(label)}</a>&nbsp;`);
    }

    setOpenPanel(null);
    setStatus(`Inserted ${linkType} link.`);
    window.setTimeout(emit, 0);
  }

  function handleEditorClick(event: MouseEvent<HTMLDivElement>) {
    const cell = closestCell(event.target as Node);
    if (cell) {
      selectedCellRef.current?.classList.remove("sop-selected-cell");
      selectedCellRef.current = cell;
      cell.classList.add("sop-selected-cell");

      const row = cell.parentElement;
      const rowIndex = row ? Array.from(row.parentElement?.children || []).indexOf(row) + 1 : 0;
      const colIndex = Array.from(row?.children || []).indexOf(cell) + 1;
      setSelectedCellLabel(rowIndex && colIndex ? `R${rowIndex} C${colIndex}` : "Cell selected");
    }

    saveSelection();
    updateActiveBlock();
  }

  function handleEditorKeyUp() {
    saveSelection();
    refreshSelectedCellFromSelection();
    emit();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");

    if (!html && text) {
      event.preventDefault();
      insertHtml(normalizePastedText(text));
    }

    window.setTimeout(emit, 0);
  }

  useEffect(() => {
    if (!editorRef.current) return;

    const html = initialContentToHtml(initialContent);
    editorRef.current.innerHTML = html || EMPTY_HTML;

    const frame = window.requestAnimationFrame(() => {
      onDocumentChange?.(htmlToBlocks(html || EMPTY_HTML));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialContent, onDocumentChange]);

  return (
    <div className={`sop-plate-shell sop-pro-editor sop-plate-density-${tableDensity}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(event) => handleMediaUpload(event.target.files)}
      />

      <div className="sop-plate-toolbar" aria-label="SOP editor toolbar">
        <div className="sop-plate-toolbar-scroll">
          <section className="sop-toolbar-group">
            <div className="sop-toolbar-group-label">Insert</div>
            <div className="sop-toolbar-group-actions">
              <ToolbarButton title="Upload image or video" disabled={disabled} onRun={openMediaPicker}>
                <span className="sop-toolbar-dual-icon">
                  <ImageIcon size={18} />
                  <Video size={15} />
                </span>
                <span>Media</span>
              </ToolbarButton>

              <ToolbarButton title="Link SOP / Training / Exam" disabled={disabled} onRun={() => setOpenPanel((current) => (current === "link" ? null : "link"))}>
                <LinkIcon size={17} />
                <span>Link</span>
              </ToolbarButton>
            </div>
          </section>

          <section className="sop-toolbar-group">
            <div className="sop-toolbar-group-label">Text</div>
            <div className="sop-toolbar-group-actions">
              <ToolbarButton title="Paragraph" disabled={disabled} active={activeBlock === "p"} onRun={() => setBlock("p")}>
                <Type size={16} />
                <span>Paragraph</span>
              </ToolbarButton>
              <ToolbarButton title="Heading 1" disabled={disabled} active={activeBlock === "h1"} onRun={() => setBlock("h1")}>
                <Heading1 size={16} />
                <span>H1</span>
              </ToolbarButton>
              <ToolbarButton title="Heading 2" disabled={disabled} active={activeBlock === "h2"} onRun={() => setBlock("h2")}>
                <Heading2 size={16} />
                <span>H2</span>
              </ToolbarButton>
              <ToolbarButton title="Heading 3" disabled={disabled} active={activeBlock === "h3"} onRun={() => setBlock("h3")}>
                <Heading3 size={16} />
                <span>H3</span>
              </ToolbarButton>
              <ToolbarButton title="Bold" disabled={disabled} onRun={() => runCommand("bold", undefined, "Bold.")}>
                <Bold size={15} />
                <span>Bold</span>
              </ToolbarButton>
              <ToolbarButton title="Italic" disabled={disabled} onRun={() => runCommand("italic", undefined, "Italic.")}>
                <Italic size={15} />
                <span>Italic</span>
              </ToolbarButton>
              <ToolbarButton title="Underline" disabled={disabled} onRun={() => runCommand("underline", undefined, "Underline.")}>
                <Underline size={15} />
                <span>Underline</span>
              </ToolbarButton>
              <ToolbarButton title="Text color" disabled={disabled} onRun={() => setOpenPanel((current) => (current === "textColor" ? null : "textColor"))}>
                <PaintBucket size={15} />
                <span>Text Color</span>
              </ToolbarButton>
              <ToolbarButton title="Highlight" disabled={disabled} onRun={() => setOpenPanel((current) => (current === "highlight" ? null : "highlight"))}>
                <Highlighter size={15} />
                <span>Highlight</span>
              </ToolbarButton>
            </div>
          </section>

          <section className="sop-toolbar-group">
            <div className="sop-toolbar-group-label">Paragraph</div>
            <div className="sop-toolbar-group-actions">
              <ToolbarButton title="Align left" disabled={disabled} onRun={() => runCommand("justifyLeft", undefined, "Aligned left.")}>
                <AlignLeft size={16} />
                <span>Left</span>
              </ToolbarButton>
              <ToolbarButton title="Align center" disabled={disabled} onRun={() => runCommand("justifyCenter", undefined, "Aligned center.")}>
                <AlignCenter size={16} />
                <span>Center</span>
              </ToolbarButton>
              <ToolbarButton title="Align right" disabled={disabled} onRun={() => runCommand("justifyRight", undefined, "Aligned right.")}>
                <AlignRight size={16} />
                <span>Right</span>
              </ToolbarButton>
            </div>
          </section>

          <section className="sop-toolbar-group sop-toolbar-group-table">
            <div className="sop-toolbar-group-label">Table</div>
            <div className="sop-toolbar-group-actions">
              <ToolbarButton title="Insert 3 × 3 table" disabled={disabled} onRun={() => insertTable(3, 3)}>
                <Table2 size={17} />
                <span>Insert Table</span>
              </ToolbarButton>
              <ToolbarButton title="Open table tools" disabled={disabled} onRun={() => setOpenPanel((current) => (current === "table" ? null : "table"))}>
                <Table2 size={17} />
                <span>Table Tools</span>
              </ToolbarButton>
              <ToolbarButton title="Cell color" disabled={disabled} onRun={() => setOpenPanel((current) => (current === "cellColor" ? null : "cellColor"))}>
                <PaintBucket size={16} />
                <span>Cell Color</span>
              </ToolbarButton>
              <ToolbarButton title="Table size" disabled={disabled} onRun={() => setOpenPanel((current) => (current === "density" ? null : "density"))}>
                <span className="sop-toolbar-size-icon">H</span>
                <span>Size</span>
              </ToolbarButton>
              <ToolbarButton title="Row above" disabled={disabled} onRun={() => addRow("above")}>
                <Rows3 size={14} />
                <span>Row Above</span>
              </ToolbarButton>
              <ToolbarButton title="Row below" disabled={disabled} onRun={() => addRow("below")}>
                <Rows3 size={14} />
                <span>Row Below</span>
              </ToolbarButton>
              <ToolbarButton title="Column left" disabled={disabled} onRun={() => addColumn("left")}>
                <Columns3 size={14} />
                <span>Column Left</span>
              </ToolbarButton>
              <ToolbarButton title="Column right" disabled={disabled} onRun={() => addColumn("right")}>
                <Columns3 size={14} />
                <span>Column Right</span>
              </ToolbarButton>
              <ToolbarButton title="Merge right" disabled={disabled} onRun={mergeRight}>
                <Merge size={14} />
                <span>Merge</span>
              </ToolbarButton>
              <ToolbarButton title="Split cell" disabled={disabled} onRun={splitCell}>
                <Split size={14} />
                <span>Split</span>
              </ToolbarButton>
              <ToolbarButton title="Delete row" disabled={disabled} onRun={deleteCurrentRow}>
                <Trash2 size={14} />
                <span>Delete Row</span>
              </ToolbarButton>
              <ToolbarButton title="Delete column" disabled={disabled} onRun={deleteCurrentColumn}>
                <Trash2 size={14} />
                <span>Delete Column</span>
              </ToolbarButton>
            </div>
          </section>
        </div>
      </div>

      {openPanel ? (
        <div
          className="sop-plate-panel"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          {openPanel === "table" ? (
            <>
              <div className="sop-plate-panel-title">Table tools {selectedCellLabel ? `· ${selectedCellLabel}` : ""}</div>
              <div className="sop-plate-grid">
                <button type="button" onClick={() => insertTable(2, 2)}><Plus size={14} /> 2 × 2</button>
                <button type="button" onClick={() => insertTable(3, 3)}><Plus size={14} /> 3 × 3</button>
                <button type="button" onClick={() => insertTable(4, 4)}><Plus size={14} /> 4 × 4</button>
                <button type="button" onClick={() => insertTable(5, 5)}><Plus size={14} /> 5 × 5</button>

                <button type="button" onClick={() => addRow("above")}><Rows3 size={14} /> Row above</button>
                <button type="button" onClick={() => addRow("below")}><Rows3 size={14} /> Row below</button>
                <button type="button" onClick={deleteCurrentRow}><Trash2 size={14} /> Delete row</button>

                <button type="button" onClick={() => addColumn("left")}><Columns3 size={14} /> Column left</button>
                <button type="button" onClick={() => addColumn("right")}><Columns3 size={14} /> Column right</button>
                <button type="button" onClick={deleteCurrentColumn}><Trash2 size={14} /> Delete column</button>

                <button type="button" onClick={mergeRight}><Merge size={14} /> Merge right</button>
                <button type="button" onClick={splitCell}><Split size={14} /> Split cell</button>
                <button type="button" onClick={toggleHeaderCell}>Header cell</button>
              </div>
            </>
          ) : null}

          {openPanel === "cellColor" ? (
            <>
              <div className="sop-plate-panel-title">Cell color {selectedCellLabel ? `· ${selectedCellLabel}` : ""}</div>
              <div className="sop-plate-color-grid">
                {cellColors.map((color) => (
                  <button key={color.label} type="button" onClick={() => applyCellColor(color.value)}>
                    <span style={{ background: color.swatch }} className={color.clear ? "is-clear" : ""} />
                    {color.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {openPanel === "textColor" ? (
            <>
              <div className="sop-plate-panel-title">Text color</div>
              <div className="sop-plate-color-grid">
                {textColors.map((color) => (
                  <button key={color.label} type="button" onClick={() => applyTextColor(color.value)}>
                    <span style={{ background: color.swatch }} className={color.clear ? "is-clear" : ""} />
                    {color.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {openPanel === "highlight" ? (
            <>
              <div className="sop-plate-panel-title">Highlight</div>
              <div className="sop-plate-color-grid">
                {highlightColors.map((color) => (
                  <button key={color.label} type="button" onClick={() => applyHighlight(color.value)}>
                    <span style={{ background: color.swatch }} className={color.clear ? "is-clear" : ""} />
                    {color.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {openPanel === "density" ? (
            <>
              <div className="sop-plate-panel-title">Table density</div>
              <div className="sop-plate-grid">
                <button type="button" onClick={() => applyDensity("compact")}>Compact</button>
                <button type="button" onClick={() => applyDensity("normal")}>Normal</button>
                <button type="button" onClick={() => applyDensity("comfortable")}>Comfortable</button>
              </div>
            </>
          ) : null}

          {openPanel === "link" ? (
            <>
              <div className="sop-plate-panel-title">Insert link</div>
              <div className="sop-link-form">
                <label>
                  Type
                  <select value={linkType} onChange={(event) => setLinkType(event.target.value as LinkType)}>
                    <option value="url">URL</option>
                    <option value="sop">SOP</option>
                    <option value="training">Training</option>
                    <option value="exam">Exam</option>
                  </select>
                </label>

                <label>
                  Label
                  <input value={linkLabel} onChange={(event) => setLinkLabel(event.target.value)} placeholder="Button text / selected text" />
                </label>

                <label>
                  Target
                  <input
                    value={linkTarget}
                    onChange={(event) => setLinkTarget(event.target.value)}
                    placeholder={linkType === "url" ? "https://..." : `${linkType}-id`}
                  />
                </label>

                <button type="button" onClick={insertLink}>
                  Insert {linkType} link
                </button>
              </div>
            </>
          ) : null}

          <button type="button" className="sop-plate-close" onClick={() => setOpenPanel(null)}>
            Close
          </button>
        </div>
      ) : null}

      <div
        ref={editorRef}
        className="sop-plate-content"
        contentEditable={!disabled}
        suppressContentEditableWarning
        onClick={handleEditorClick}
        onMouseUp={saveSelection}
        onInput={emit}
        onKeyUp={handleEditorKeyUp}
        onPaste={handlePaste}
        onBlur={() => {
          saveSelection();
          emit();
        }}
        role="textbox"
        aria-multiline="true"
      />

      <div className="sr-only" aria-live="polite">
        {status}
      </div>
    </div>
  );
}
