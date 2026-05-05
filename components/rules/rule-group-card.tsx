import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { RuleGroupContract } from "@/types/rule";

import { RuleChip } from "./rule-chip";

export function RuleGroupCard({ group, locale }: { group: RuleGroupContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? group.name.zh : group.name.en}</CardTitle>
        <CardDescription className="text-xs">{group.key}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? group.description.zh : group.description.en}</div>
        <div className="flex flex-wrap gap-1.5">
          <RuleChip kind="status" locale={locale} status={group.status} />
          <span className="rounded-md bg-muted px-2 py-1">{group.category}</span>
          {group.sourceModule ? <span className="rounded-md bg-muted px-2 py-1">{group.sourceModule}</span> : null}
        </div>
        <div>{locale === "zh" ? "规则数" : "Rule Count"}: {group.rules.length}</div>
        <div className="rounded-xl bg-muted/40 p-3">
          {group.rules.map((ruleKey) => (
            <div key={ruleKey}>{ruleKey}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
