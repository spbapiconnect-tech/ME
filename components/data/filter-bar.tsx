import type { LocalizedText, SupportedLocale } from "@/types/module";
import type { PageSchemaFilter } from "@/types/page-schema";

import { getLocalizedText } from "@/lib/localized";

interface FilterBarProps {
  locale: SupportedLocale;
  filters: PageSchemaFilter[];
  searchPlaceholder?: string | LocalizedText;
  dateRangeLabel?: string | LocalizedText;
  viewSwitchLabel?: string | LocalizedText;
  actionSlot?: React.ReactNode;
}

export function FilterBar({
  locale,
  filters,
  searchPlaceholder,
  dateRangeLabel,
  viewSwitchLabel,
  actionSlot,
}: FilterBarProps) {
  return (
    <section className="me-filter-bar">
      <div className="me-filter-bar-main">
        <div className="me-input-placeholder me-filter-search">
          {getLocalizedText(searchPlaceholder ?? { zh: "搜索占位", en: "Search placeholder" }, locale)}
        </div>
        <div className="me-filter-chip-group">
          {filters.map((filter) => (
            <span key={filter.key} className="me-filter-chip">
              {getLocalizedText(filter.label, locale)}
            </span>
          ))}
        </div>
        <div className="me-input-placeholder me-filter-inline">
          {getLocalizedText(dateRangeLabel ?? { zh: "日期范围占位", en: "Date Range Placeholder" }, locale)}
        </div>
        <div className="me-input-placeholder me-filter-inline">
          {getLocalizedText(viewSwitchLabel ?? { zh: "视图切换占位", en: "View Switch Placeholder" }, locale)}
        </div>
      </div>
      {actionSlot ? <div className="me-filter-bar-actions">{actionSlot}</div> : null}
    </section>
  );
}
