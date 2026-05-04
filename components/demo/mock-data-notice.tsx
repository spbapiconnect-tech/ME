import { getLocalizedText } from "@/lib/localized";
import type { SupportedLocale } from "@/types/module";

interface MockDataNoticeProps {
  locale: SupportedLocale;
  compact?: boolean;
}

export function MockDataNotice({ locale, compact = false }: MockDataNoticeProps) {
  return (
    <section className="mock-data-notice" data-compact={compact}>
      <div className="mock-data-notice-copy">
        <span className="mock-data-notice-eyebrow">
          {locale === "zh" ? "Prototype Demo" : "Prototype Demo"}
        </span>
        <strong>
          {locale === "zh"
            ? "这是一个原型演示，当前数据为本地 mock data。"
            : "This is a prototype demo with local mock data only."}
        </strong>
        <p>
          {locale === "zh"
            ? "当前未连接真实 API 或数据库，也不包含真实业务执行逻辑。"
            : "No real API or database is connected, and no real business execution logic is included."}
        </p>
      </div>
      <div className="mock-data-notice-tags">
        <span className="module-chip">{getLocalizedText({ zh: "本地数据", en: "Local Data" }, locale)}</span>
        <span className="module-chip">{getLocalizedText({ zh: "无 API", en: "No API" }, locale)}</span>
        <span className="module-chip">{getLocalizedText({ zh: "无数据库", en: "No Database" }, locale)}</span>
      </div>
    </section>
  );
}
