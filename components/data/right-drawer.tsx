import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";

interface RightDrawerProps {
  locale: SupportedLocale;
  title: string | LocalizedText;
  description?: string | LocalizedText;
  open?: boolean;
  alwaysVisible?: boolean;
  children: React.ReactNode;
  actionSlot?: React.ReactNode;
}

export function RightDrawer({
  locale,
  title,
  description,
  open = true,
  alwaysVisible = false,
  children,
  actionSlot,
}: RightDrawerProps) {
  return (
    <aside className="me-right-drawer" data-open={open} data-visible={alwaysVisible || open}>
      <header className="me-right-drawer-header">
        <h3 className="me-panel-title">{getLocalizedText(title, locale)}</h3>
        {description ? <p>{getLocalizedText(description, locale)}</p> : null}
      </header>
      <div className="me-right-drawer-body">{children}</div>
      {actionSlot ? <footer className="me-right-drawer-footer">{actionSlot}</footer> : null}
    </aside>
  );
}
