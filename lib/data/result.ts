import type { DataError, DataMeta, DataSource } from "./types";

export type DataResult<T> =
  | {
      ok: true;
      data: T;
      meta: DataMeta;
    }
  | {
      ok: false;
      error: DataError;
      meta: DataMeta;
    };

function meta(source: DataSource): DataMeta {
  return {
    source,
    generatedAt: new Date().toISOString(),
  };
}

export function okResult<T>(data: T, source: DataSource = "mock"): DataResult<T> {
  return {
    ok: true,
    data,
    meta: meta(source),
  };
}

export function errResult<T = never>(error: DataError, source: DataSource = "mock"): DataResult<T> {
  return {
    ok: false,
    error,
    meta: meta(source),
  };
}

export function isOk<T>(result: DataResult<T>): result is { ok: true; data: T; meta: DataMeta } {
  return result.ok;
}
