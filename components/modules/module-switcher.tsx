import type { ModuleCategory } from "@/types/module";

type ModuleFilter = "all" | ModuleCategory;

interface ModuleSwitcherProps {
  activeFilter: ModuleFilter;
  counts: Record<ModuleFilter, number>;
  labels: Record<ModuleFilter, string>;
  onChange: (filter: ModuleFilter) => void;
}

const filterOrder: ModuleFilter[] = ["all", "core", "control", "admin", "future"];

export function ModuleSwitcher({ activeFilter, counts, labels, onChange }: ModuleSwitcherProps) {
  return (
    <div className="module-switcher" role="tablist" aria-label="Module category filters">
      {filterOrder.map((filter) => (
        <button
          key={filter}
          className="module-filter-button"
          type="button"
          data-active={activeFilter === filter}
          onClick={() => onChange(filter)}
        >
          <span>{labels[filter]}</span>
          <span className="module-filter-count">{counts[filter]}</span>
        </button>
      ))}
    </div>
  );
}
