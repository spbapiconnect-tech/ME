import { moduleRegistry } from "@/config/modules";
import type { ModuleCategory, ModuleDefinition } from "@/types/module";

export function sortModulesByPriority(modules: ModuleDefinition[]) {
  return [...modules].sort((left, right) => {
    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }

    return left.name.en.localeCompare(right.name.en);
  });
}

export function getEnabledModules(modules: ModuleDefinition[] = moduleRegistry) {
  return sortModulesByPriority(
    modules.filter((module) => module.status === "enabled" || module.status === "beta"),
  );
}

export function getVisibleModules(modules: ModuleDefinition[] = moduleRegistry) {
  return sortModulesByPriority(modules.filter((module) => module.status !== "disabled"));
}

export function getCoreModules(modules: ModuleDefinition[] = moduleRegistry) {
  return sortModulesByPriority(modules.filter((module) => module.category === "core"));
}

export function getModuleByCode(code: string, modules: ModuleDefinition[] = moduleRegistry) {
  return modules.find((module) => module.code === code);
}

export function getModulesByCategory(modules: ModuleDefinition[] = moduleRegistry) {
  const categories: ModuleCategory[] = ["core", "control", "admin", "future"];

  return categories.reduce<Record<ModuleCategory, ModuleDefinition[]>>((groups, category) => {
    groups[category] = sortModulesByPriority(
      modules.filter((module) => module.category === category),
    );
    return groups;
  }, {
    core: [],
    control: [],
    admin: [],
    future: [],
  });
}

export function getModuleStats(modules: ModuleDefinition[] = moduleRegistry) {
  const groups = getModulesByCategory(modules);

  return {
    total: modules.length,
    enabled: modules.filter((module) => module.status === "enabled").length,
    beta: modules.filter((module) => module.status === "beta").length,
    comingSoon: modules.filter((module) => module.status === "coming-soon").length,
    disabled: modules.filter((module) => module.status === "disabled").length,
    core: groups.core.length,
    control: groups.control.length,
    admin: groups.admin.length,
    future: groups.future.length,
  };
}
