import type { SupportedLocale } from "@/types/module";

interface FormFooterProps {
  locale: SupportedLocale;
  sticky?: boolean;
}

export function FormFooter({ locale, sticky = true }: FormFooterProps) {
  return (
    <footer className="me-form-footer" data-sticky={sticky}>
      <button className="me-action-button me-action-button--ghost" type="button">
        {locale === "zh" ? "取消" : "Cancel"}
      </button>
      <div className="me-form-footer-actions">
        <button className="me-action-button me-action-button--secondary" type="button">
          {locale === "zh" ? "保存" : "Save"}
        </button>
        <button className="me-action-button me-action-button--primary" type="button">
          {locale === "zh" ? "提交" : "Submit"}
        </button>
      </div>
    </footer>
  );
}
