import type { LocalizedText, SupportedLocale } from "@/types/module";

export function getLocalizedText(text: string | LocalizedText, locale: SupportedLocale) {
  if (typeof text === "string") {
    return text;
  }

  return text[locale];
}
