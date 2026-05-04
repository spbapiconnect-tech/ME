export type SourceMappingStatus = "draft" | "mapped" | "review-needed";
export type SourceContentType = "page" | "widget" | "action" | "field";

export interface SourceMappingDefinition {
  sourceId: string;
  moduleCode: string;
  pageId: string;
  contentType: SourceContentType;
  targetKey: string;
  notes?: string;
  status: SourceMappingStatus;
}
