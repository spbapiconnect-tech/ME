export type StoreOperationRuleContext = {
  now: string;
};

export type StoreOperationRuleResult = {
  matched: boolean;
  nextStatus?: string;
  suggestedAction?: string;
  reason: string;
  metadata?: Record<string, string>;
};

export type StoreOperationRule<TRecord = Record<string, unknown>> = {
  id: string;
  moduleId: string;
  description: string;
  run: (record: TRecord, context: StoreOperationRuleContext) => StoreOperationRuleResult;
};
