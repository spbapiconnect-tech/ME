export type MeLocalizedText = {
  zh: string;
  en: string;
};

export type MeRealDataSourceKind =
  | "database-table"
  | "api-endpoint"
  | "computed-view"
  | "external-system"
  | "file-import"
  | "manual-entry"
  | "placeholder";

export type MeRealDataReadiness =
  | "ready-to-map"
  | "needs-schema"
  | "needs-api"
  | "needs-permission"
  | "needs-workflow"
  | "deferred"
  | "placeholder-only";

export type MeRealDataWriteScope =
  | "read-only"
  | "draft-write-future"
  | "approval-write-future"
  | "system-write-future"
  | "external-sync-future"
  | "not-planned";

export type MeUiSurfaceKey =
  | "dashboard"
  | "psi-procurement"
  | "psi-supplier"
  | "psi-inventory"
  | "branch-workspace"
  | "reports"
  | "roles"
  | "tasks"
  | "demo-readiness"
  | "stakeholder-summary"
  | "system-foundation";

export interface MeUiDataBlock {
  key: string;
  surface: MeUiSurfaceKey;
  label: MeLocalizedText;
  description: MeLocalizedText;
  currentSource: string;
  futureSource: string;
  sourceKind: MeRealDataSourceKind;
  readiness: MeRealDataReadiness;
  writeScope: MeRealDataWriteScope;
  requiredEntities: string[];
  requiredFields: string[];
  relatedRoutes: string[];
  guardrails: string[];
  notes?: MeLocalizedText;
}

export interface MeEntityMapping {
  entity: string;
  label: MeLocalizedText;
  description: MeLocalizedText;
  futureTableName: string;
  primaryKey: string;
  requiredFields: string[];
  optionalFields: string[];
  relationships: string[];
  usedBySurfaces: MeUiSurfaceKey[];
  readiness: MeRealDataReadiness;
  notes?: MeLocalizedText;
}

export type MeApiBoundaryReadMode = "read-only" | "write-future";

export type MeApiBoundaryStatus = "draft-read-only" | "future-write-deferred";

export interface MeApiBoundaryDraft {
  key: string;
  method: "GET" | "POST" | "PATCH";
  path: string;
  purpose: MeLocalizedText;
  entities: string[];
  readOrWrite: MeApiBoundaryReadMode;
  authRequiredFuture: boolean;
  permissionRequiredFuture: boolean;
  status: MeApiBoundaryStatus;
  guardrails: string[];
}

export interface MeMigrationStep {
  key: string;
  title: MeLocalizedText;
  description: MeLocalizedText;
  status: "planned" | "deferred";
  guardrails: string[];
}

export interface MeRealDataMappingPageData {
  title: MeLocalizedText;
  subtitle: MeLocalizedText;
  uiBlocks: MeUiDataBlock[];
  entities: MeEntityMapping[];
  apiBoundaries: MeApiBoundaryDraft[];
  migrationSteps: MeMigrationStep[];
  guardrails: string[];
  generatedAt: string;
}
