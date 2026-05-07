"use client";

import type { ReactNode } from "react";

import { ErpSidebar } from "@/components/erp/erp-sidebar";
import { ErpTopbar } from "@/components/erp/erp-topbar";
import { resolveErpLabel } from "@/lib/erp/erp-i18n";
import { useErpPreferences } from "@/lib/erp/erp-theme";

export function ErpShell({
  activeHref = "/",
  children,
  rightRail,
}: {
  activeHref?: string;
  children: ReactNode;
  rightRail?: ReactNode;
}) {
  const { locale, theme, setLocale, setTheme } = useErpPreferences();

  return (
    <main className="min-h-screen bg-background px-5 py-5 text-foreground">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[14rem_minmax(0,1fr)] 2xl:grid-cols-[14rem_minmax(0,1fr)_20rem]">
        <ErpSidebar activeHref={activeHref} locale={locale} />
        <div className="grid min-w-0 content-start gap-4">
          <ErpTopbar
            locale={locale}
            theme={theme}
            onLocaleChange={setLocale}
            onThemeChange={setTheme}
            searchPlaceholder={`${resolveErpLabel("search", locale)}...`}
          />
          {children}
          {rightRail ? <div className="2xl:hidden">{rightRail}</div> : null}
        </div>
        {rightRail ? <div className="hidden 2xl:block">{rightRail}</div> : null}
      </div>
    </main>
  );
}
