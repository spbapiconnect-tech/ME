import { CardList } from "@/components/data/card-list";
import type { DisplayRecord } from "@/types/display-model";
import type { SupportedLocale } from "@/types/module";

interface DisplayRecordPreviewProps {
  records: DisplayRecord[];
  locale: SupportedLocale;
}

export function DisplayRecordPreview({ records, locale }: DisplayRecordPreviewProps) {
  return (
    <CardList
      locale={locale}
      items={records.map((record) => ({
        id: record.id,
        title: record.title,
        subtitle: record.subtitle,
        meta: record.meta.map((item) => `${item.label.en}: ${item.value}`).join(" · "),
        status: record.status,
        actionLabel: locale === "zh" ? "预览" : "Preview",
      }))}
    />
  );
}
