export type SopBuilderV4CommandKey =
  | "heading"
  | "text"
  | "step"
  | "image"
  | "gif"
  | "video"
  | "pdf"
  | "warning"
  | "checklist"
  | "proof"
  | "acknowledgement";

export type SopBuilderV4Command = {
  key: SopBuilderV4CommandKey;
  slash: string;
  label: string;
  description: string;
  group: "write" | "media" | "control";
  defaultTitle: string;
};

export const sopBuilderV4Commands: SopBuilderV4Command[] = [
  {
    key: "heading",
    slash: "/heading",
    label: "Section Heading",
    description: "Add a clear section title.",
    group: "write",
    defaultTitle: "Section title",
  },
  {
    key: "text",
    slash: "/text",
    label: "Instruction Text",
    description: "Write SOP explanation or staff instruction.",
    group: "write",
    defaultTitle: "Instruction",
  },
  {
    key: "step",
    slash: "/step",
    label: "Step by Step",
    description: "Add steps that can include media and checklist.",
    group: "write",
    defaultTitle: "Step-by-step execution",
  },
  {
    key: "image",
    slash: "/image",
    label: "Photo Guide",
    description: "Insert an inline photo below the instruction.",
    group: "media",
    defaultTitle: "Photo guide",
  },
  {
    key: "gif",
    slash: "/gif",
    label: "GIF Guide",
    description: "Insert an inline GIF for movement or process.",
    group: "media",
    defaultTitle: "GIF guide",
  },
  {
    key: "video",
    slash: "/video",
    label: "Training Video",
    description: "Insert an inline training video.",
    group: "media",
    defaultTitle: "Training video",
  },
  {
    key: "pdf",
    slash: "/pdf",
    label: "PDF / Document",
    description: "Attach a formal PDF or document.",
    group: "media",
    defaultTitle: "PDF document",
  },
  {
    key: "warning",
    slash: "/warning",
    label: "Warning / Common Mistake",
    description: "Highlight risk, safety, or quality issue.",
    group: "control",
    defaultTitle: "Important warning",
  },
  {
    key: "checklist",
    slash: "/checklist",
    label: "Checklist",
    description: "Add confirmation checklist.",
    group: "control",
    defaultTitle: "Checklist",
  },
  {
    key: "proof",
    slash: "/proof",
    label: "Required Proof",
    description: "Tell staff what photo/video proof is required.",
    group: "control",
    defaultTitle: "Required proof",
  },
  {
    key: "acknowledgement",
    slash: "/acknowledgement",
    label: "Acknowledgement",
    description: "Add final staff acknowledgement requirement.",
    group: "control",
    defaultTitle: "Acknowledgement",
  },
];

export function searchSopBuilderV4Commands(query: string) {
  const normalized = query.trim().replace("/", "").toLowerCase();

  if (!normalized) return sopBuilderV4Commands;

  return sopBuilderV4Commands.filter((command) => {
    return (
      command.key.includes(normalized) ||
      command.label.toLowerCase().includes(normalized) ||
      command.description.toLowerCase().includes(normalized)
    );
  });
}
