import type { LocalizedText, SupportedLocale } from "@/types/module";
import type { PageSchemaFieldType } from "@/types/page-schema";

import { UploadPlaceholder } from "@/components/form/upload-placeholder";
import { getLocalizedText } from "@/lib/localized";

interface FormFieldProps {
  locale: SupportedLocale;
  label: string | LocalizedText;
  hint?: string | LocalizedText;
  required?: boolean;
  type?: PageSchemaFieldType | "upload";
  placeholder?: string | LocalizedText;
}

export function FormField({ locale, label, hint, required = false, type = "text", placeholder }: FormFieldProps) {
  return (
    <label className="me-form-field">
      <span className="me-form-field-label">
        {getLocalizedText(label, locale)}
        {required ? <em>*</em> : null}
      </span>
      {type === "upload" ? (
        <UploadPlaceholder locale={locale} />
      ) : (
        <div className="me-input-placeholder" data-field-type={type}>
          {getLocalizedText(
            placeholder ??
              (locale === "zh"
                ? `占位: ${getLocalizedText(label, locale)}`
                : `Placeholder: ${getLocalizedText(label, locale)}`),
            locale,
          )}
        </div>
      )}
      {hint ? <small className="me-form-field-hint">{getLocalizedText(hint, locale)}</small> : null}
    </label>
  );
}
