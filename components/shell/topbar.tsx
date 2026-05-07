"use client";

import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useDictionary } from "@/lib/i18n";

export function Topbar() {
  const dict = useDictionary();

  return (
    <header className="topbar-fixed">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder={dict.common.search + "..."} 
            className="pl-10 h-9 bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-8 text-xs border-transparent bg-muted/40 hover:bg-muted/60 transition-colors">
              <SelectValue placeholder={dict.common.allBranches} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.common.allBranches}</SelectItem>
              <SelectItem value="kuching">Kuching</SelectItem>
              <SelectItem value="bintulu">Bintulu</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[120px] h-8 text-xs border-transparent bg-muted/40 hover:bg-muted/60 transition-colors">
              <SelectValue placeholder={dict.common.allRegions} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.common.allRegions}</SelectItem>
              <SelectItem value="central">Central</SelectItem>
              <SelectItem value="north">North</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 mr-2 pr-2 border-r">
          <LanguageSwitcher variant="compact" />
          <ThemeSwitcher variant="compact" />
        </div>

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden border ml-1 hover:border-primary/30 transition-colors">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground font-normal">admin@me-branch.com</span>
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
