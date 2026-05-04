export type DataSource = "mock" | "api" | "db";

export type DataTimestamp = string;

export interface DataMeta {
  source: DataSource;
  generatedAt: DataTimestamp;
}

export interface DataError {
  code: string;
  message: string;
}

export interface PageInfo {
  limit: number;
  offset: number;
  total?: number;
}
