import Link from "next/link";

import { demoModuleCodes } from "@/data/demo";
import { getLocalizedText } from "@/lib/localized";
import { getModuleByCode } from "@/lib/modules";
import type { SupportedLocale } from "@/types/module";

interface DemoModuleSwitcherProps {
  locale: SupportedLocale;
  activeModuleCode?: string;
}

export function DemoModuleSwitcher({ locale, activeModuleCode }: DemoModuleSwitcherProps) {
  return (
    <div className="demo-switcher">
      {demoModuleCodes.map((code) => {
        const moduleItem = getModuleByCode(code);

        if (!moduleItem) {
          return null;
        }

        return (
          <Link
            key={code}
            className="module-filter-button"
            data-active={activeModuleCode === code}
            href={`/demo/${code}`}
          >
            <span>{getLocalizedText(moduleItem.name, locale)}</span>
          </Link>
        );
      })}
    </div>
  );
}
