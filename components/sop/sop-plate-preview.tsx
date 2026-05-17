"use client";

import type { SopBlockNoteDocument } from "@/components/sop/sop-blocknote-preview";

type PreviewBlock = {
  type?: string;
  content?: string;
  props?: {
    level?: number;
    html?: string;
    value?: unknown;
  };
};

function safeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
}

export function SopEmployeePreviewDevice({
  blocks,
  title,
  version,
  category,
}: {
  blocks: SopBlockNoteDocument;
  title: string;
  version: string;
  category?: string;
}) {
  const normalizedBlocks = (Array.isArray(blocks) ? blocks : []) as PreviewBlock[];
  const htmlBlock = normalizedBlocks.find((block) => block.type === "plateHtml" && block.props?.html);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground">
      <div className="shrink-0 border-b bg-muted/20 px-4 py-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          SOP Reader Preview
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h2 className="line-clamp-1 text-base font-semibold tracking-tight">
            {title || "Untitled SOP"}
          </h2>

          <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {version || "v1.0"}
          </span>
        </div>
      </div>

      <div className="shrink-0 border-b bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Category</div>
        <div className="mt-1 line-clamp-2">{category || "Uncategorized"}</div>
      </div>

      <div className="sop-plate-preview min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {htmlBlock?.props?.html ? (
          <div dangerouslySetInnerHTML={{ __html: safeHtml(String(htmlBlock.props.html)) }} />
        ) : normalizedBlocks.length ? (
          normalizedBlocks.map((block, index) => {
            if (block.type === "plateTable" && block.props?.html) {
              return (
                <div
                  key={index}
                  className="sop-plate-preview-table-wrap"
                  dangerouslySetInnerHTML={{ __html: safeHtml(String(block.props.html)) }}
                />
              );
            }

            if (block.type === "heading") {
              const level = block.props?.level || 2;
              if (level === 1) return <h1 key={index}>{block.content}</h1>;
              if (level === 3) return <h3 key={index}>{block.content}</h3>;
              return <h2 key={index}>{block.content}</h2>;
            }

            return <p key={index}>{block.content || ""}</p>;
          })
        ) : (
          <p className="text-sm text-muted-foreground">No SOP content yet.</p>
        )}
      </div>
    </div>
  );
}
