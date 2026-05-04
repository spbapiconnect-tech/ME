"use client";

import { Languages } from "lucide-react";

import type { SupportedLocale } from "@/types/module";

interface LanguageSwitcherProps {
  currentLanguage: SupportedLocale;
  onLanguageChange: (language: SupportedLocale) => void;
  labels: Record<SupportedLocale, string>;
  title: string;
}

const locales: SupportedLocale[] = ["en", "zh"];

export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  labels,
  title,
}: LanguageSwitcherProps) {
  return (
    <div className="switcher-group" aria-label={title}>
      <div className="control-note">{title}</div>
      <div className="switcher-grid">
        {locales.map((locale) => (
          <button
            key={locale}
            className="control-button"
            type="button"
            data-active={currentLanguage === locale}
            aria-pressed={currentLanguage === locale}
            onClick={() => onLanguageChange(locale)}
          >
            <Languages size={16} />
            <span>{labels[locale]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
