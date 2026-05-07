import { useUiPreferencesStore } from "@/stores/ui-preferences";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

const catalogs = {
  en: enMessages,
  zh: zhMessages,
} as const;

export function useDictionary() {
  const { locale } = useUiPreferencesStore();
  return catalogs[locale as keyof typeof catalogs] || catalogs.en;
}
