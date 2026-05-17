import type { ModuleRow } from "@/components/module/module-page-shell";
import {
  calculateChecklistLinkedCount,
  calculateEffectiveSopCount,
  calculateSopDraftReviewCount,
  calculateSopGovernanceRiskScore,
  calculateSopNeedReviewCount,
  calculateTemplatesGeneratedCount,
  calculateTrainingAcknowledgedCount,
  calculateTrainingOverdueCount,
  calculateTrainingPendingCount,
} from "@/lib/calculators/store-operation-calculators";

export type SopPreviewStep = {
  id: string;
  title?: string;
  instruction: string;
  imageUrl?: string;
  proofRequired?: boolean;
};

export type SopPreviewBlock = {
  id: string;
  type: "heading" | "text" | "image" | "step-list" | "warning" | "pdf" | "checklist";
  title?: string;
  body?: string;
  imageUrl?: string;
  pdfUrl?: string;
  checklistItems?: string[];
  steps?: SopPreviewStep[];
  warningLevel?: "Info" | "Warning" | "Critical";
};

export type SopPreviewPage = {
  id: string;
  pageNo: number;
  title: string;
  coverImageUrl?: string;
  blocks: SopPreviewBlock[];
};

export type SopPreviewContent = {
  mode: "Interactive Book" | "Checklist View" | "PDF View" | "Mixed";
  pages: SopPreviewPage[];
};

function detailValue(row: ModuleRow, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function blockNoteText(value: unknown): string {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String((item as { text?: unknown }).text || "");
        }
        return "";
      })
      .filter(Boolean)
      .join("");
  }

  return "";
}

function blockNoteJsonToSopContent(raw: { blocks?: unknown[]; plainText?: string }): SopPreviewContent {
  const blocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  const parsedBlocks = blocks
    .map((block, index): SopPreviewBlock | null => {
      const record = block as Record<string, unknown>;
      const type = String(record.type || "paragraph");
      const text = blockNoteText(record.content).trim();
      const props = (record.props || {}) as Record<string, unknown>;
      const id = String(record.id || `blocknote-${index + 1}`);

      if (!text && !props.url && !props.name) return null;

      if (type.includes("heading")) {
        return {
          id,
          type: "heading",
          title: text || "Section",
          body: "",
        };
      }

      if (type === "image" || type === "video") {
        return {
          id,
          type: "image",
          title: text || "Media",
          imageUrl: String(props.url || ""),
        };
      }

      if (type === "file") {
        return {
          id,
          type: "pdf",
          title: text || String(props.name || "Attachment"),
          pdfUrl: String(props.url || ""),
        };
      }

      return {
        id,
        type: "text",
        title: "",
        body: text,
      };
    })
    .filter(Boolean) as SopPreviewBlock[];

  if (!parsedBlocks.length && raw.plainText) {
    parsedBlocks.push({
      id: "blocknote-plain-text",
      type: "text",
      body: raw.plainText,
    });
  }

  return {
    mode: "Interactive Book",
    pages: [
      {
        id: "blocknote-reader-page",
        pageNo: 1,
        title: "Document",
        blocks: parsedBlocks.length
          ? parsedBlocks
          : [
              {
                id: "empty-blocknote-reader",
                type: "text",
                body: "No SOP content yet.",
              },
            ],
      },
    ],
  };
}

function parseSopContent(row: ModuleRow | undefined): SopPreviewContent {
  if (!row) return { mode: "Interactive Book", pages: [] };

  const raw = detailValue(row, "SOP Content JSON");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as SopPreviewContent & {
        source?: string;
        blocks?: unknown[];
        plainText?: string;
      };

      if (parsed.source === "blocknote") {
        return blockNoteJsonToSopContent(parsed);
      }

      return {
        mode: parsed.mode || "Interactive Book",
        pages: Array.isArray(parsed.pages) ? parsed.pages : [],
      };
    } catch {
      // fallback below
    }
  }

  const fallbackSteps = detailValue(row, "SOP Steps")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `${row.id}-fallback-step-${index + 1}`,
      title: `Step ${index + 1}`,
      instruction: line,
    }));

  if (!fallbackSteps.length) return { mode: "Interactive Book", pages: [] };

  return {
    mode: "Interactive Book",
    pages: [
      {
        id: `${row.id}-fallback-page-1`,
        pageNo: 1,
        title: "Page 1 · SOP Steps",
        blocks: [
          {
            id: `${row.id}-fallback-block-1`,
            type: "step-list",
            title: "Execution Steps",
            steps: fallbackSteps,
          },
        ],
      },
    ],
  };
}

export function getSopLifecycleTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("obsolete") || value.includes("superseded")) return "destructive";
  if (value.includes("draft") || value.includes("review") || value.includes("approved") || value.includes("need review")) return "secondary";
  return "outline";
}

export function getAcknowledgementStatusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("overdue") || value.includes("failed") || value.includes("reassigned")) return "destructive";
  if (value.includes("assigned") || value.includes("pending")) return "secondary";
  return "outline";
}

export function getSopReviewStatus(sop?: ModuleRow) {
  if (!sop) return "Not Scheduled";
  return detailValue(sop, "Review Due Date") || detailValue(sop, "Review Cycle") || "Not Scheduled";
}

export function getLinkedTemplateSummary(sop?: ModuleRow) {
  if (!sop) return { checklist: 0, inspection: 0, task: 0 };
  return {
    checklist: splitList(detailValue(sop, "Linked Checklist Template IDs")).length,
    inspection: splitList(detailValue(sop, "Linked Inspection Template IDs")).length,
    task: splitList(detailValue(sop, "Linked Task Template IDs")).length,
  };
}

export function getTrainingCompletionSummary(sop: ModuleRow | undefined, tasks: ModuleRow[]) {
  if (!sop) return { total: 0, completed: 0, overdue: 0, pending: 0, rate: 0 };
  const trainingIds = new Set(splitList(detailValue(sop, "Assigned Training IDs")));
  const linked = tasks.filter((row) => trainingIds.has(row.id) || detailValue(row, "Linked SOP ID") === sop.id);
  const completed = linked.filter((row) => row.status === "Completed").length;
  const overdue = linked.filter((row) => row.status === "Overdue").length;
  const pending = linked.filter((row) => !["Completed"].includes(row.status)).length;
  return {
    total: linked.length,
    completed,
    overdue,
    pending,
    rate: linked.length ? Math.round((completed / linked.length) * 100) : 0,
  };
}

export function getSopControlBoard(sops: ModuleRow[]) {
  const order = ["Draft", "Review", "Approved", "Effective", "Need Review", "Superseded", "Obsolete"];
  return order.map((status) => ({
    status,
    items: sops.filter((row) => row.status === status),
  }));
}

export function getTrainingAcknowledgementQueue(sops: ModuleRow[], tasks: ModuleRow[]) {
  return sops
    .filter((row) => detailValue(row, "Acknowledgement Required") === "Yes")
    .map((sop) => ({
      row: sop,
      version: detailValue(sop, "Version") || "v1.0",
      targetRole: detailValue(sop, "Target Role") || "All Roles",
      targetBranch: detailValue(sop, "Target Branch") || "All Branches",
      acknowledgementStatus: detailValue(sop, "Acknowledgement Status") || "Pending",
      training: getTrainingCompletionSummary(sop, tasks),
    }));
}

export function getTemplateGeneratorQueue(sops: ModuleRow[]) {
  return sops
    .filter((row) => ["Approved", "Effective", "Need Review"].includes(row.status))
    .map((row) => ({
      row,
      checklistMissing: !detailValue(row, "Linked Checklist Template IDs"),
      inspectionMissing: !detailValue(row, "Linked Inspection Template IDs"),
      taskMissing: !detailValue(row, "Linked Task Template IDs"),
    }));
}

export function getSopNextActions(sop?: ModuleRow) {
  if (!sop) return [];
  const actions = ["Review SOP lifecycle and assignment"];
  const content = parseSopContent(sop);
  if (!content.pages.length) actions.push("Build employee reading pages");
  if (!detailValue(sop, "Linked Checklist Template IDs")) actions.push("Create checklist template");
  if (!detailValue(sop, "Linked Inspection Template IDs")) actions.push("Create inspection template");
  if (!detailValue(sop, "Linked Task Template IDs")) actions.push("Create task template");
  if (detailValue(sop, "Acknowledgement Required") === "Yes" && !detailValue(sop, "Assigned Training IDs")) actions.push("Assign training acknowledgement");
  if (sop.status === "Need Review") actions.push("Publish updated version");
  return actions;
}

export function getSopDetail(sop?: ModuleRow) {
  if (!sop) return null;
  const content = parseSopContent(sop);
  return {
    row: sop,
    title: sop.title,
    documentCode: detailValue(sop, "Document Code") || "Not Set",
    category: detailValue(sop, "Category") || "Not Set",
    processArea: detailValue(sop, "Process Area") || "Operations",
    version: detailValue(sop, "Version") || "v1.0",
    owner: detailValue(sop, "Process Owner") || sop.owner || "Unassigned",
    approver: detailValue(sop, "Approver") || "Unassigned",
    effectiveDate: detailValue(sop, "Effective Date") || "Not Set",
    reviewDueDate: detailValue(sop, "Review Due Date") || "Not Set",
    reviewCycle: detailValue(sop, "Review Cycle") || "Not Set",
    targetRole: detailValue(sop, "Target Role") || "All Roles",
    targetBranch: detailValue(sop, "Target Branch") || "All Branches",
    acknowledgementRequired: detailValue(sop, "Acknowledgement Required") || "No",
    acknowledgementStatus: detailValue(sop, "Acknowledgement Status") || "Not Required",
    riskPoints: splitList(detailValue(sop, "Risk Points")),
    steps: detailValue(sop, "SOP Steps").split("\n").map((item) => item.trim()).filter(Boolean),
    linkedChecklist: splitList(detailValue(sop, "Linked Checklist Template IDs")),
    linkedInspection: splitList(detailValue(sop, "Linked Inspection Template IDs")),
    linkedTask: splitList(detailValue(sop, "Linked Task Template IDs")),
    linkedTraining: splitList(detailValue(sop, "Assigned Training IDs")),
    content,
  };
}

export function getSopKpis(sops: ModuleRow[], tasks: ModuleRow[]) {
  return [
    { label: "Effective SOPs", value: String(calculateEffectiveSopCount(sops)) },
    { label: "Need Review", value: String(calculateSopNeedReviewCount(sops)) },
    { label: "Draft / Review", value: String(calculateSopDraftReviewCount(sops)) },
    { label: "Training Pending", value: String(calculateTrainingPendingCount(tasks)) },
    { label: "Training Overdue", value: String(calculateTrainingOverdueCount(tasks)) },
    { label: "Acknowledged", value: String(calculateTrainingAcknowledgedCount(tasks)) },
    { label: "Checklist Linked", value: String(calculateChecklistLinkedCount(sops)) },
    { label: "Templates Generated", value: String(calculateTemplatesGeneratedCount(sops)) },
  ];
}

export function getSopGovernanceSummary(sops: ModuleRow[], tasks: ModuleRow[]) {
  return {
    governanceRisk: calculateSopGovernanceRiskScore(sops, tasks),
  };
}
