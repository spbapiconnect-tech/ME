export type ControlLayer =
  | "UI_ONLY"
  | "PREVIEW_ACTION"
  | "FORMULA_METADATA"
  | "BRAIN_METADATA"
  | "FUTURE_WRITE"
  | "EXTERNAL_INTEGRATION";

export type ControlStatus =
  | "active_preview"
  | "preview_only"
  | "metadata_only"
  | "future_write_disabled"
  | "integration_not_connected";

export interface MeControlRegistryItem {
  key: string;
  label: string;
  module: string;
  route: string;
  layer: ControlLayer;
  behavior: string;
  status: ControlStatus;
  allowedNow: boolean;
  executionBoundary: string;
  uiFeedback: string;
  futureConnection: string | null;
  notes?: string;
}
