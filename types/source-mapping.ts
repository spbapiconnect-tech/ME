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

export interface TaskSourceMapping {
  source_module: string;
  source_record_id: string;
  source_page: string;
  source_component: string;
  source_event: string;
  target_module: string;
  target_route: string;
  target_action: string;
  api_action: string;
  audit_required: boolean;
  permission_required: string;
}
