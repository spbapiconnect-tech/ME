"use client";

import { useEffect, useState } from "react";

import { isErpLocale, type ErpLocale, ERP_LOCALE_STORAGE_KEY } from "@/lib/erp/erp-i18n";

export type ErpThemeMode = "bright" | "dark" | "moon";

export const ERP_THEME_STORAGE_KEY = "me-erp-theme";

export const erpThemeModes: ErpThemeMode[] = ["bright", "dark", "moon"];

export const erpThemeLabels: Record<ErpThemeMode, Record<ErpLocale, string>> = {
  bright: { en: "Bright", zh: "明亮" },
  dark: { en: "Dark", zh: "深色" },
  moon: { en: "Moon", zh: "月夜" },
};

const ERP_PREFERENCES_EVENT = "me-erp-preferences-change";

interface ErpPreferencesEventDetail {
  theme?: ErpThemeMode;
  locale?: ErpLocale;
}

export function isErpTheme(value: string | null): value is ErpThemeMode {
  return value === "bright" || value === "dark" || value === "moon";
}

export function applyErpTheme(theme: ErpThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function useErpPreferences() {
  const [state, setState] = useState<{ hydrated: boolean; theme: ErpThemeMode; locale: ErpLocale }>(() => ({
    hydrated: false,
    theme: "bright",
    locale: "en",
  }));

  useEffect(() => {
    const syncFromStorage = () => {
      const storedTheme = window.localStorage.getItem(ERP_THEME_STORAGE_KEY);
      const storedLocale = window.localStorage.getItem(ERP_LOCALE_STORAGE_KEY);
      const nextTheme = isErpTheme(storedTheme) ? storedTheme : "bright";
      const nextLocale = isErpLocale(storedLocale) ? storedLocale : "en";

      applyErpTheme(nextTheme);
      setState({ hydrated: true, theme: nextTheme, locale: nextLocale });
    };

    const handlePreferenceEvent = (event: Event) => {
      const detail = (event as CustomEvent<ErpPreferencesEventDetail>).detail;
      setState((current) => ({
        hydrated: true,
        theme: detail.theme ?? current.theme,
        locale: detail.locale ?? current.locale,
      }));
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ERP_THEME_STORAGE_KEY || event.key === ERP_LOCALE_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener(ERP_PREFERENCES_EVENT, handlePreferenceEvent);
    window.addEventListener("storage", handleStorage);
    window.requestAnimationFrame(() => {
      syncFromStorage();
    });

    return () => {
      window.removeEventListener(ERP_PREFERENCES_EVENT, handlePreferenceEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setTheme = (nextTheme: ErpThemeMode) => {
    window.localStorage.setItem(ERP_THEME_STORAGE_KEY, nextTheme);
    applyErpTheme(nextTheme);
    setState((current) => ({ ...current, theme: nextTheme }));
    window.dispatchEvent(new CustomEvent<ErpPreferencesEventDetail>(ERP_PREFERENCES_EVENT, { detail: { theme: nextTheme } }));
  };

  const setLocale = (nextLocale: ErpLocale) => {
    window.localStorage.setItem(ERP_LOCALE_STORAGE_KEY, nextLocale);
    setState((current) => ({ ...current, locale: nextLocale }));
    window.dispatchEvent(new CustomEvent<ErpPreferencesEventDetail>(ERP_PREFERENCES_EVENT, { detail: { locale: nextLocale } }));
  };

  return { ...state, setTheme, setLocale };
}
