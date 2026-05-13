export type SopBuilderV3BlockType =
  | "heading"
  | "text"
  | "step-list"
  | "image"
  | "video"
  | "pdf"
  | "warning"
  | "checklist";

export type SopBuilderV3Status =
  | "Draft"
  | "Review"
  | "Approved"
  | "Published"
  | "Archived";

export type SopBuilderV3Block = {
  id: string;
  type: SopBuilderV3BlockType;
  title: string;
  body: string;
  assetUrl?: string;
  assetId?: string;
  mimeType?: string;
  steps?: string[];
  checklist?: string[];
  warningLevel?: "Info" | "Warning" | "Critical";
};

export type SopBuilderV3Page = {
  id: string;
  title: string;
  coverAssetUrl?: string;
  blocks: SopBuilderV3Block[];
};

export type SopBuilderV3Settings = {
  title: string;
  documentCode: string;
  category: string;
  processArea: string;
  version: string;
  owner: string;
  approver: string;
  targetOutlet: string;
  targetRole: string;
  acknowledgementRequired: "Yes" | "No";
  trainingRequired: "Yes" | "No";
  reviewCycle: string;
  reviewDueDate: string;
  status: SopBuilderV3Status;
};

export type SopBuilderV3Document = {
  settings: SopBuilderV3Settings;
  pages: SopBuilderV3Page[];
};

export type LegacySopFormLike = {
  title?: string;
  documentCode?: string;
  category?: string;
  processArea?: string;
  version?: string;
  processOwner?: string;
  approver?: string;
  targetBranch?: string;
  targetRole?: string;
  acknowledgementRequired?: string;
  trainingRequired?: string;
  reviewCycle?: string;
  reviewDueDate?: string;
};

export type LegacySopBlockLike = {
  id?: string;
  type?: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  pdfUrl?: string;
  stepsText?: string;
  checklistText?: string;
  warningLevel?: "Info" | "Warning" | "Critical";
};

export type LegacySopPageLike = {
  id?: string;
  title?: string;
  coverImageUrl?: string;
  blocks?: LegacySopBlockLike[];
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeYesNo(value?: string): "Yes" | "No" {
  return value === "Yes" ? "Yes" : "No";
}

function normalizeBlockType(type?: string): SopBuilderV3BlockType {
  if (
    type === "heading" ||
    type === "text" ||
    type === "step-list" ||
    type === "image" ||
    type === "video" ||
    type === "pdf" ||
    type === "warning" ||
    type === "checklist"
  ) {
    return type;
  }

  return "text";
}

function lines(value?: string) {
  return (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createSopBuilderV3Block(type: SopBuilderV3BlockType): SopBuilderV3Block {
  return {
    id: uid("sop-block"),
    type,
    title:
      type === "heading"
        ? "Section title"
        : type === "step-list"
          ? "Step-by-step execution"
          : type === "checklist"
            ? "Checklist"
            : type === "warning"
              ? "Important warning"
              : type === "image"
                ? "Photo / GIF guide"
                : type === "video"
                  ? "Training video"
                  : type === "pdf"
                    ? "PDF document"
                    : "Instruction",
    body: "",
    steps: type === "step-list" ? ["Prepare the station", "Follow the standard", "Take proof photo if required"] : undefined,
    checklist: type === "checklist" ? ["I have read the SOP", "I understand the key steps", "I know when to ask manager"] : undefined,
    warningLevel: type === "warning" ? "Warning" : undefined,
  };
}

export function createSopBuilderV3Page(index: number): SopBuilderV3Page {
  return {
    id: uid("sop-page"),
    title: `Page ${index}: What staff need to know`,
    blocks: [
      createSopBuilderV3Block("heading"),
      createSopBuilderV3Block("text"),
      createSopBuilderV3Block("step-list"),
    ],
  };
}

export function legacyFormToV3Settings(form: LegacySopFormLike): SopBuilderV3Settings {
  return {
    title: form.title || "",
    documentCode: form.documentCode || "",
    category: form.category || "",
    processArea: form.processArea || "",
    version: form.version || "v1.0",
    owner: form.processOwner || "",
    approver: form.approver || "",
    targetOutlet: form.targetBranch || "",
    targetRole: form.targetRole || "",
    acknowledgementRequired: normalizeYesNo(form.acknowledgementRequired),
    trainingRequired: normalizeYesNo(form.trainingRequired),
    reviewCycle: form.reviewCycle || "",
    reviewDueDate: form.reviewDueDate || "",
    status: "Draft",
  };
}

export function legacyPagesToV3Pages(pages: LegacySopPageLike[]): SopBuilderV3Page[] {
  return pages.map((page, pageIndex) => ({
    id: page.id || uid("sop-page"),
    title: page.title || `Page ${pageIndex + 1}`,
    coverAssetUrl: page.coverImageUrl || "",
    blocks: (page.blocks || []).map((block) => {
      const type = normalizeBlockType(block.type);

      return {
        id: block.id || uid("sop-block"),
        type,
        title: block.title || "",
        body: block.body || "",
        assetUrl: type === "pdf" ? block.pdfUrl || "" : block.imageUrl || "",
        steps: type === "step-list" ? lines(block.stepsText) : undefined,
        checklist: type === "checklist" ? lines(block.checklistText) : undefined,
        warningLevel: block.warningLevel,
      };
    }),
  }));
}

export function createSopBuilderV3Document(
  form: LegacySopFormLike,
  pages: LegacySopPageLike[],
): SopBuilderV3Document {
  return {
    settings: legacyFormToV3Settings(form),
    pages: pages.length ? legacyPagesToV3Pages(pages) : [createSopBuilderV3Page(1)],
  };
}

export function sopBuilderV3Readiness(document: SopBuilderV3Document) {
  const { settings, pages } = document;

  return [
    { key: "title", label: "SOP title", done: Boolean(settings.title.trim()) },
    { key: "targetRole", label: "Target role", done: Boolean(settings.targetRole.trim()) },
    { key: "owner", label: "Owner", done: Boolean(settings.owner.trim()) },
    { key: "approver", label: "Approver", done: Boolean(settings.approver.trim()) },
    { key: "page", label: "At least one page", done: pages.length > 0 },
    { key: "content", label: "At least one content block", done: pages.some((page) => page.blocks.length > 0) },
  ];
}
