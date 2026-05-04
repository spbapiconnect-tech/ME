import { create } from "zustand";

import type { SupportedLocale, ThemeMode } from "@/types/module";

const THEME_STORAGE_KEY = "me-theme";
const LOCALE_STORAGE_KEY = "me-locale";

interface UiPreferencesState {
  locale: SupportedLocale;
  theme: ThemeMode;
  viewportLabel: string;
  hydrated: boolean;
  hydrate: () => void;
  setLocale: (locale: SupportedLocale) => void;
  setTheme: (theme: ThemeMode) => void;
  setViewportLabel: (label: string) => void;
}

export const useUiPreferencesStore = create<UiPreferencesState>((set) => ({
  locale: "en",
  theme: "bright",
  viewportLabel: "Desktop Shell",
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") {
      return;
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocale | null;

    set({
      hydrated: true,
      theme: savedTheme === "bright" || savedTheme === "dark" || savedTheme === "moon" ? savedTheme : "bright",
      locale: savedLocale === "en" || savedLocale === "zh" ? savedLocale : "en",
    });
  },
  setLocale: (locale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }

    set({ locale });
  },
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    set({ theme });
  },
  setViewportLabel: (viewportLabel) => set({ viewportLabel }),
}));
