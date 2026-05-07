"use client";

import { useEffect, useState } from "react";

export type ErpTheme = "bright" | "dark" | "moon";

export const ERP_THEME_STORAGE_KEY = "me-erp-theme";

export const erpThemes: { value: ErpTheme; label: string }[] = [
  { value: "bright", label: "Bright" },
  { value: "dark", label: "Dark" },
  { value: "moon", label: "Moon" },
];

function isErpTheme(value: string | null): value is ErpTheme {
  return value === "bright" || value === "dark" || value === "moon";
}

function readInitialTheme(defaultTheme: ErpTheme): ErpTheme {
  if (typeof window === "undefined") return defaultTheme;
  const stored = window.localStorage.getItem(ERP_THEME_STORAGE_KEY);
  return isErpTheme(stored) ? stored : defaultTheme;
}

export function applyErpTheme(theme: ErpTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.remove("theme-bright", "theme-dark", "theme-moon");
  document.documentElement.classList.add(`theme-${theme}`);
}

export function useErpTheme(defaultTheme: ErpTheme = "bright") {
  const [theme, setThemeState] = useState<ErpTheme>(() => readInitialTheme(defaultTheme));

  useEffect(() => {
    applyErpTheme(theme);
  }, [theme]);

  const setTheme = (next: ErpTheme) => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ERP_THEME_STORAGE_KEY, next);
    }
  };

  return { theme, setTheme, themes: erpThemes };
}
