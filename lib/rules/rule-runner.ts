import { storeOperationRules } from "@/lib/rules/store-operation-rules";
import type { StoreOperationRuleContext } from "@/lib/rules/rule-types";

export function runStoreOperationRules(moduleId: string, record: Record<string, unknown>, context?: Partial<StoreOperationRuleContext>) {
  const runtimeContext: StoreOperationRuleContext = {
    now: context?.now ?? new Date().toISOString(),
  };

  return storeOperationRules
    .filter((rule) => rule.moduleId === moduleId)
    .map((rule) => ({ ruleId: rule.id, result: rule.run(record, runtimeContext) }))
    .filter((item) => item.result.matched);
}
