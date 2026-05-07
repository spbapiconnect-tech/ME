"use client";

import type { ReactNode } from "react";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ErpFilterOption {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

export function ErpFilterBar({
  searchLabel,
  searchValue,
  onSearchChange,
  filters = [],
  actions,
}: {
  searchLabel: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: ErpFilterOption[];
  actions?: ReactNode;
}) {
  return (
    <Card size="sm">
      <CardContent className="grid gap-3 pt-4 lg:grid-cols-[minmax(18rem,1fr)_auto]">
        <div className="grid gap-3 md:grid-cols-[minmax(16rem,1.3fr)_repeat(3,minmax(10rem,0.7fr))]">
          <label className="relative block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder={searchLabel}
              className="pl-9"
            />
          </label>
          {filters.map((filter) => (
            <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
        </div>
        {actions ? <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div> : <Button variant="outline">{searchLabel}</Button>}
      </CardContent>
    </Card>
  );
}
