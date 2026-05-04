import type { SupportedLocale } from "@/types/module";

interface UploadPlaceholderProps {
  locale: SupportedLocale;
  title?: string;
  description?: string;
}

export function UploadPlaceholder({
  locale,
  title,
  description,
}: UploadPlaceholderProps) {
  return (
    <div className="me-upload-placeholder">
      <strong>{title ?? (locale === "zh" ? "上传占位" : "Upload Placeholder")}</strong>
      <p>{description ?? (locale === "zh" ? "后续可用于发票、收货照片、SOP 文件与问题证据。" : "Later used for invoices, receiving photos, SOP files, and issue evidence.")}</p>
      <button className="me-action-button me-action-button--ghost" type="button">
        {locale === "zh" ? "选择文件占位" : "Select File Placeholder"}
      </button>
    </div>
  );
}
