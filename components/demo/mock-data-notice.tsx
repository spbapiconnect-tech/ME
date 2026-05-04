import { getLocalizedText } from "@/lib/localized";
import type { LocalizedText, SupportedLocale } from "@/types/module";

interface MockDataNoticeProps {
  locale: SupportedLocale;
  compact?: boolean;
  title?: LocalizedText;
  message?: LocalizedText;
  detail?: LocalizedText;
  tags?: LocalizedText[];
}

export function MockDataNotice({
  locale,
  compact = false,
  title = { zh: "Prototype Demo", en: "Prototype Demo" },
  message = { zh: "这是一个原型演示，当前数据为本地 mock data。", en: "This is a prototype demo with local mock data only." },
  detail = { zh: "当前未连接真实 API 或数据库，也不包含真实业务执行逻辑。", en: "No real API or database is connected, and no real business execution logic is included." },
  tags = [
    { zh: "本地数据", en: "Local Data" },
    { zh: "无 API", en: "No API" },
    { zh: "无数据库", en: "No Database" },
  ],
}: MockDataNoticeProps) {
  return (
    <section className="mock-data-notice" data-compact={compact}>
      <div className="mock-data-notice-copy">
        <span className="mock-data-notice-eyebrow">{getLocalizedText(title, locale)}</span>
        <strong>{getLocalizedText(message, locale)}</strong>
        <p>{getLocalizedText(detail, locale)}</p>
      </div>
      <div className="mock-data-notice-tags">
        {tags.map((tag) => (
          <span key={tag.en} className="module-chip">{getLocalizedText(tag, locale)}</span>
        ))}
      </div>
    </section>
  );
}
