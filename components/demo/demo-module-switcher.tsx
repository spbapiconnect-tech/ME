import Link from "next/link";

import type { DemoModuleCode } from "@/data/demo";
import { getLocalizedText } from "@/lib/localized";
import { getModuleByCode } from "@/lib/modules";
import type { SupportedLocale } from "@/types/module";

interface DemoModuleSwitcherProps {
  locale: SupportedLocale;
  moduleCodes: DemoModuleCode[];
  activeModuleCode?: string;
}

export function DemoModuleSwitcher({ locale, moduleCodes, activeModuleCode }: DemoModuleSwitcherProps) {
  return (
    <div className="demo-switcher">
      {moduleCodes.map((code) => {
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
