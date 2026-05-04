import type { LocalizedText } from "@/types/module";
import type { LayoutPageType } from "@/types/layout-engine";

export interface DisplayMeta {
  label: LocalizedText;
  value: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
}

export interface DisplayAction {
  key: string;
  label: LocalizedText;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
  disabled?: boolean;
  sourceEvent?: string;
}

export interface DisplaySource {
  moduleCode: string;
  recordId: string;
  pageType: LayoutPageType;
  sourceComponent: string;
  sourceEvent: string;
}

export interface DisplayRecord {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  priority: string;
  meta: DisplayMeta[];
  actions: DisplayAction[];
  source: DisplaySource;
}
