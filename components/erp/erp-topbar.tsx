"use client";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useErpTheme } from "@/lib/erp/erp-theme";
import { useErpLanguage } from "@/lib/erp/erp-i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, Globe, User, MoonStar, Sparkles, SunMedium, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useDictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const themeIcons = {
  bright: SunMedium,
  dark: Sparkles,
  moon: MoonStar,
} as const;

export function ErpTopbar({
  isSidebarVisible = true,
  onToggleSidebar,
}: {
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}) {

  const { theme, setTheme } = useErpTheme();
  const { language, setLanguage } = useErpLanguage();
  const dict = useDictionary();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-4 flex-1">
        {onToggleSidebar ? (
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={onToggleSidebar} aria-label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}>
            {isSidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
        ) : null}
        <div className="relative w-full max-w-[320px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder={dict.common.search + "..."}
            className="h-9 w-full rounded-md bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-all pl-10"
          />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-[140px] text-xs border-transparent bg-muted/40 hover:bg-muted/60 transition-colors">
              <SelectValue placeholder={dict.common.allBranches} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.common.allBranches}</SelectItem>
              <SelectItem value="kuching">Kuching</SelectItem>
              <SelectItem value="bintulu">Bintulu</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="7d">
            <SelectTrigger className="h-8 w-[120px] text-xs border-transparent bg-muted/40 hover:bg-muted/60 transition-colors">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 mr-2 pr-2 border-r">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")} className={cn(language === "en" && "bg-accent")}>
                <span className="mr-2 text-xs font-bold uppercase opacity-60">EN</span>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("zh")} className={cn(language === "zh" && "bg-accent")}>
                <span className="mr-2 text-xs font-bold uppercase opacity-60">ZH</span>
                中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 rounded-full border border-current/40" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["bright", "dark", "moon"] as const).map((t) => {
                const Icon = themeIcons[t];
                return (
                  <DropdownMenuItem key={t} onClick={() => setTheme(t)} className={cn(theme === t && "bg-accent")}>
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="capitalize">{t}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full overflow-hidden border ml-1 hover:border-primary/30 transition-colors p-0">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Operations Manager</span>
                <span className="text-xs text-muted-foreground font-normal">manager@me-branch.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
