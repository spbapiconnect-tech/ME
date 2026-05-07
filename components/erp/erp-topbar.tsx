"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useErpTheme } from "@/lib/erp/erp-theme";
import { useErpLanguage } from "@/lib/erp/erp-i18n";

export function ErpTopbar() {
  const { theme, setTheme } = useErpTheme();
  const { language, setLanguage } = useErpLanguage();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-5">
      <Input className="h-10 w-[360px] rounded-xl" placeholder="Search..." />
      <Button variant="outline" className="h-10 rounded-xl">
        All Branches
      </Button>
      <Button variant="outline" className="h-10 rounded-xl">
        Last 7 days
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          className="h-10 rounded-xl"
          onClick={() => setTheme(theme === "bright" ? "dark" : theme === "dark" ? "moon" : "bright")}
        >
          {theme}
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-xl"
          onClick={() => setLanguage(language === "en" ? "zh" : "en")}
        >
          {language === "en" ? "English" : "中文"}
        </Button>
        <Button variant="ghost" className="h-10 rounded-xl">
          Operations Manager
        </Button>
      </div>
    </header>
  );
}
