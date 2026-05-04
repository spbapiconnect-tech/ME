"use client";

import { MoonStar, Sparkles, SunMedium } from "lucide-react";

import type { ThemeMode } from "@/types/module";

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  labels: Record<ThemeMode, string>;
  title: string;
}

const icons = {
  bright: SunMedium,
  dark: Sparkles,
  moon: MoonStar,
} as const;

const themeOrder: ThemeMode[] = ["bright", "dark", "moon"];

export function ThemeSwitcher({
  currentTheme,
  onThemeChange,
  labels,
  title,
}: ThemeSwitcherProps) {
  return (
    <div className="switcher-group" aria-label={title}>
      <div className="control-note">{title}</div>
      <div className="switcher-grid">
        {themeOrder.map((theme) => {
          const Icon = icons[theme];

          return (
            <button
              key={theme}
              className="control-button"
              type="button"
              data-active={currentTheme === theme}
              aria-pressed={currentTheme === theme}
              onClick={() => onThemeChange(theme)}
            >
              <Icon size={16} />
              <span>{labels[theme]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
