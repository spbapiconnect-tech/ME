export type SortDirection = "asc" | "desc";

export interface SortSpec {
  field: string;
  direction: SortDirection;
}

export interface ListQuery {
  limit?: number;
  offset?: number;
  search?: string;
  filters?: Record<string, string | number | boolean | undefined>;
  sort?: SortSpec[];
}
