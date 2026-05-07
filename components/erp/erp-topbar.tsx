"use client";

import { BellIcon, Globe2Icon, MoonStarIcon, SearchIcon, SunMediumIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ErpLocale } from "@/lib/erp/erp-i18n";
import { erpThemeLabels, erpThemeModes, type ErpThemeMode } from "@/lib/erp/erp-theme";

export function ErpTopbar({
  locale,
  theme,
  onLocaleChange,
  onThemeChange,
  searchPlaceholder,
}: {
  locale: ErpLocale;
  theme: ErpThemeMode;
  onLocaleChange: (locale: ErpLocale) => void;
  onThemeChange: (theme: ErpThemeMode) => void;
  searchPlaceholder: string;
}) {
  return (
    <header className="flex h-14 items-center gap-3 rounded-lg border bg-card px-4 text-card-foreground shadow-sm">
      <label className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="h-9 rounded-lg pl-9" placeholder={searchPlaceholder} />
      </label>
      <Select value={theme} onValueChange={(value) => onThemeChange(value as ErpThemeMode)}>
        <SelectTrigger size="sm" className="hidden w-32 rounded-lg md:flex">
          <SunMediumIcon className="size-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {erpThemeModes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {erpThemeLabels[mode][locale]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={locale} onValueChange={(value) => onLocaleChange(value as ErpLocale)}>
        <SelectTrigger size="sm" className="hidden w-28 rounded-lg md:flex">
          <Globe2Icon className="size-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="outline">
            <BellIcon />
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{locale === "zh" ? "提醒" : "Notifications"}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>{locale === "zh" ? "3 个任务待处理" : "3 tasks pending"}</DropdownMenuItem>
            <DropdownMenuItem>{locale === "zh" ? "2 个库存预警" : "2 stock alerts"}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onThemeChange(theme === "moon" ? "bright" : theme === "bright" ? "dark" : "moon")}>
            <MoonStarIcon />
            {locale === "zh" ? "切换主题" : "Cycle theme"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLocaleChange(locale === "zh" ? "en" : "zh")}>
            <Globe2Icon />
            {locale === "zh" ? "Switch to English" : "切换中文"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
