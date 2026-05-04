import type { DataResult } from "./result";
import type { ListQuery } from "./query";

export interface ReadonlyRepository<TEntity, TId = string> {
  list(query?: ListQuery): Promise<DataResult<TEntity[]>>;
  getById(id: TId): Promise<DataResult<TEntity | null>>;
}
