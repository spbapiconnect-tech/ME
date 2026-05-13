"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckSquare,
  FileText,
  ImageIcon,
  ListChecks,
  PlaySquare,
  Plus,
  ShieldCheck,
  Trash2,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  searchSopBuilderV4Commands,
  sopBuilderV4Commands,
  type SopBuilderV4Command,
  type SopBuilderV4CommandKey,
} from "@/lib/sop/sop-builder-v4-command-map";

export type SopBuilderV4Section = {
  id: string;
  type: SopBuilderV4CommandKey;
  title: string;
  content: string;
  mediaUrl?: string;
  checklist?: string[];
  steps?: Array<{
    id: string;
    title: string;
    instruction: string;
    mediaUrl?: string;
    proofRequired?: boolean;
  }>;
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function SopCommandIcon({
  type,
  className,
}: {
  type: SopBuilderV4CommandKey;
  className?: string;
}) {
  if (type === "heading") return <Type className={className} />;
  if (type === "step") return <ListChecks className={className} />;
  if (type === "image" || type === "gif") return <ImageIcon className={className} />;
  if (type === "video") return <PlaySquare className={className} />;
  if (type === "warning") return <AlertTriangle className={className} />;
  if (type === "checklist") return <CheckSquare className={className} />;
  if (type === "proof") return <ShieldCheck className={className} />;
  return <FileText className={className} />;
}

function defaultSection(command: SopBuilderV4Command): SopBuilderV4Section {
  if (command.key === "step") {
    return {
      id: uid("sop-v4-section"),
      type: command.key,
      title: command.defaultTitle,
      content: "",
      steps: [
        {
          id: uid("sop-v4-step"),
          title: "Step 1",
          instruction: "Write the staff action here.",
        },
      ],
    };
  }

  if (command.key === "checklist" || command.key === "acknowledgement") {
    return {
      id: uid("sop-v4-section"),
      type: command.key,
      title: command.defaultTitle,
      content: "",
      checklist: ["I have read this SOP", "I understand the key steps"],
    };
  }

  return {
    id: uid("sop-v4-section"),
    type: command.key,
    title: command.defaultTitle,
    content: "",
  };
}

function commandLabel(type: SopBuilderV4CommandKey) {
  return sopBuilderV4Commands.find((command) => command.key === type)?.label || type;
}

function SectionPreview({ section }: { section: SopBuilderV4Section }) {
  if (section.type === "step") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SopCommandIcon type={section.type} className="h-4 w-4 text-primary" />
          {section.title || "Step by Step"}
        </div>

        <div className="space-y-2">
          {(section.steps || []).map((step, index) => (
            <div key={step.id} className="rounded-2xl border bg-background p-3">
              <div className="text-sm font-medium">{step.title || `Step ${index + 1}`}</div>
              <div className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {step.instruction || "No instruction yet."}
              </div>
              {step.mediaUrl ? (
                <div className="mt-3 rounded-xl border border-dashed bg-muted/30 px-3 py-5 text-center text-xs text-muted-foreground">
                  {step.mediaUrl}
                </div>
              ) : null}
              {step.proofRequired ? (
                <div className="mt-3 inline-flex rounded-full border px-2 py-1 text-xs text-muted-foreground">
                  Proof required
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "image" || section.type === "gif" || section.type === "video" || section.type === "pdf") {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SopCommandIcon type={section.type} className="h-4 w-4 text-primary" />
          {section.title || commandLabel(section.type)}
        </div>
        <div className="mt-3 rounded-2xl border border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          {section.mediaUrl || "Media preview after API storage is connected."}
        </div>
        {section.content ? (
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{section.content}</div>
        ) : null}
      </div>
    );
  }

  if (section.type === "checklist" || section.type === "acknowledgement") {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SopCommandIcon type={section.type} className="h-4 w-4 text-primary" />
          {section.title || commandLabel(section.type)}
        </div>
        <div className="mt-3 space-y-2">
          {(section.checklist || []).map((item, index) => (
            <div key={`${item}-${index}`} className="flex gap-2 rounded-xl border px-3 py-2 text-sm">
              <CheckSquare className="mt-0.5 h-4 w-4 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "warning") {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SopCommandIcon type={section.type} className="h-4 w-4 text-destructive" />
          {section.title || "Warning"}
        </div>
        <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {section.content || "Write warning or common mistake here."}
        </div>
      </div>
    );
  }

  if (section.type === "heading") {
    return (
      <div>
        <div className="text-2xl font-semibold tracking-tight">{section.title || "Section title"}</div>
        {section.content ? (
          <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{section.content}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <SopCommandIcon type={section.type} className="h-4 w-4 text-primary" />
        {section.title || commandLabel(section.type)}
      </div>
      <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
        {section.content || "Write instruction here."}
      </div>
    </div>
  );
}

export function SopBuilderCanvasV4({
  title,
  sections,
  onChange,
}: {
  title: string;
  sections: SopBuilderV4Section[];
  onChange: (sections: SopBuilderV4Section[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [commandQuery, setCommandQuery] = useState("");
  const [activeEditId, setActiveEditId] = useState<string | null>(null);

  const commandOpen = draft.startsWith("/");
  const commands = useMemo(() => searchSopBuilderV4Commands(draft), [draft]);

  function insertCommand(command: SopBuilderV4Command) {
    onChange([...sections, defaultSection(command)]);
    setDraft("");
    setCommandQuery("");
  }

  function updateSection(sectionId: string, patch: Partial<SopBuilderV4Section>) {
    onChange(sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)));
  }

  function deleteSection(sectionId: string) {
    onChange(sections.filter((section) => section.id !== sectionId));
  }

  function addTextAsInstruction() {
    const value = draft.trim();
    if (!value) return;

    const textCommand = sopBuilderV4Commands.find((command) => command.key === "text");
    if (!textCommand) return;

    onChange([
      ...sections,
      {
        ...defaultSection(textCommand),
        title: "Instruction",
        content: value,
      },
    ]);
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">SOP Document</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title || "Untitled SOP"}</h1>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const editing = activeEditId === section.id;

          return (
            <div
              key={section.id}
              className={cn(
                "group rounded-3xl border border-transparent p-4 transition hover:border-border hover:bg-card",
                editing && "border-primary bg-card",
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-3 opacity-0 transition group-hover:opacity-100">
                <div className="text-xs text-muted-foreground">{commandLabel(section.type)}</div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setActiveEditId(editing ? null : section.id)}>
                    {editing ? "Done" : "Edit"}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteSection(section.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <Textarea
                    value={section.title}
                    onChange={(event) => updateSection(section.id, { title: event.target.value })}
                    rows={1}
                    className="resize-none border-0 bg-muted/40 text-lg font-semibold shadow-none focus-visible:ring-1"
                    placeholder="Section title"
                  />

                  {section.type === "step" ? (
                    <div className="space-y-3">
                      {(section.steps || []).map((step, index) => (
                        <div key={step.id} className="rounded-2xl border bg-background p-3">
                          <Textarea
                            value={step.title}
                            onChange={(event) => {
                              const nextSteps = [...(section.steps || [])];
                              nextSteps[index] = { ...step, title: event.target.value };
                              updateSection(section.id, { steps: nextSteps });
                            }}
                            rows={1}
                            className="resize-none border-0 bg-muted/40 font-medium shadow-none"
                            placeholder="Step title"
                          />
                          <Textarea
                            value={step.instruction}
                            onChange={(event) => {
                              const nextSteps = [...(section.steps || [])];
                              nextSteps[index] = { ...step, instruction: event.target.value };
                              updateSection(section.id, { steps: nextSteps });
                            }}
                            rows={3}
                            className="mt-2 resize-none"
                            placeholder="Step instruction"
                          />
                          <Textarea
                            value={step.mediaUrl || ""}
                            onChange={(event) => {
                              const nextSteps = [...(section.steps || [])];
                              nextSteps[index] = { ...step, mediaUrl: event.target.value };
                              updateSection(section.id, { steps: nextSteps });
                            }}
                            rows={1}
                            className="mt-2 resize-none"
                            placeholder="Optional image / GIF / video URL"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateSection(section.id, {
                            steps: [
                              ...(section.steps || []),
                              {
                                id: uid("sop-v4-step"),
                                title: `Step ${(section.steps || []).length + 1}`,
                                instruction: "",
                              },
                            ],
                          })
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Add Step
                      </Button>
                    </div>
                  ) : section.type === "checklist" || section.type === "acknowledgement" ? (
                    <Textarea
                      value={(section.checklist || []).join("\n")}
                      onChange={(event) =>
                        updateSection(section.id, {
                          checklist: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                        })
                      }
                      rows={5}
                      placeholder="One checklist item per line"
                    />
                  ) : section.type === "image" || section.type === "gif" || section.type === "video" || section.type === "pdf" ? (
                    <>
                      <Textarea
                        value={section.mediaUrl || ""}
                        onChange={(event) => updateSection(section.id, { mediaUrl: event.target.value })}
                        rows={1}
                        placeholder="Media URL after API storage is connected"
                      />
                      <Textarea
                        value={section.content}
                        onChange={(event) => updateSection(section.id, { content: event.target.value })}
                        rows={3}
                        placeholder="Optional caption or instruction"
                      />
                    </>
                  ) : (
                    <Textarea
                      value={section.content}
                      onChange={(event) => updateSection(section.id, { content: event.target.value })}
                      rows={section.type === "heading" ? 3 : 6}
                      placeholder="Write here"
                    />
                  )}
                </div>
              ) : (
                <SectionPreview section={section} />
              )}
            </div>
          );
        })}

        <div className="relative rounded-3xl border border-dashed bg-card/50 p-4">
          <Textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setCommandQuery(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !commandOpen) {
                event.preventDefault();
                addTextAsInstruction();
              }
            }}
            rows={3}
            className="resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            placeholder='Type instruction, or type "/" for SOP commands...'
          />

          {commandOpen ? (
            <div className="absolute left-4 top-[92px] z-20 w-[360px] overflow-hidden rounded-2xl border bg-popover shadow-2xl">
              <div className="border-b px-3 py-2 text-xs text-muted-foreground">
                SOP commands {commandQuery ? `for ${commandQuery}` : ""}
              </div>
              <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {commands.map((command) => {
                  return (
                    <button
                      key={command.key}
                      type="button"
                      onClick={() => insertCommand(command)}
                      className="flex w-full gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border bg-background text-primary">
                        <SopCommandIcon type={command.key} className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{command.label}</span>
                        <span className="block text-xs leading-5 text-muted-foreground">{command.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
