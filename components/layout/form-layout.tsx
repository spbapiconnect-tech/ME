import { FormField } from "@/components/form/form-field";
import { FormFooter } from "@/components/form/form-footer";
import { FormSection } from "@/components/form/form-section";
import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

interface FormLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function FormLayout({ schema, demoData, locale }: FormLayoutProps) {
  return (
    <PageTemplateShell schema={schema} locale={locale} footer={<FormFooter locale={locale} />}>
      <div className="template-form-shell">
        {schema.sections.map((section) => (
          <FormSection key={section.key} locale={locale} title={section.title} description={section.description}>
            <div className="template-form-grid">
              {(section.fieldKeys ?? []).map((fieldKey) => {
                const field = schema.fields.find((entry) => entry.key === fieldKey);
                if (!field) {
                  return null;
                }

                return (
                  <FormField
                    key={field.key}
                    locale={locale}
                    label={field.label}
                    hint={field.helpText ?? (field.required ? { zh: "必填占位", en: "Required placeholder" } : { zh: "校验提示占位", en: "Validation hint placeholder" })}
                    required={field.required}
                    type={field.key.toLowerCase().includes("file") || field.key.toLowerCase().includes("evidence") ? "upload" : field.type}
                    placeholder={demoData.formValues[field.key] ?? getLocalizedText(field.placeholder ?? field.label, locale)}
                  />
                );
              })}
            </div>
          </FormSection>
        ))}
      </div>
    </PageTemplateShell>
  );
}
