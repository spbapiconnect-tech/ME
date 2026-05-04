import type { ActionContract } from "@/types/action-contract";

import { commonActions } from "./common-actions";
import { demoActions } from "./demo-actions";
import { moduleActions } from "./module-actions";
import { taskActions } from "./task-actions";

export const actionRegistry: ActionContract[] = [
  ...commonActions,
  ...moduleActions,
  ...demoActions,
  ...taskActions,
];

export const actionRegistryByKey: Record<string, ActionContract> = Object.fromEntries(
  actionRegistry.map((action) => [action.key, action])
);
