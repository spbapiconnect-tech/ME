"use client";

import Link from "next/link";
import * as React from "react";

import { NotificationPreviewCard } from "@/components/notifications/notification-preview-card";
import { NotificationRuleCard } from "@/components/notifications/notification-rule-card";
import { NotificationSourceCard } from "@/components/notifications/notification-source-card";
import { NotificationTemplateCard } from "@/components/notifications/notification-template-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notificationRules, notificationTemplateCatalog } from "@/config/notifications";
import {
  getHumanReviewNotifications,
  getNotificationByKey,
  getNotificationPreview,
  getPlaceholderNotifications,
} from "@/lib/notifications";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale } from "@/types/module";
import type { NotificationCategory, NotificationChannel, NotificationStatus } from "@/types/notification";

const channelOptions: Array<NotificationChannel | "all"> = [
  "all",
  "in-app",
  "email-placeholder",
  "whatsapp-placeholder",
  "sms-placeholder",
  "push-placeholder",
  "webhook-placeholder",
  "system",
];

const categoryOptions: Array<NotificationCategory | "all"> = [
  "all",
  "task",
  "approval",
  "alert",
  "reminder",
  "report",
  "audit",
  "workflow",
  "system",
  "placeholder",
];

const statusOptions: Array<NotificationStatus | "all"> = ["all", "active", "preview-only", "placeholder", "coming-soon", "blocked", "disabled"];

function groupBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function NotificationsPage() {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";

  const [channelFilter, setChannelFilter] = React.useState<NotificationChannel | "all">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<NotificationCategory | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<NotificationStatus | "all">("all");
  const [sourceModuleFilter, setSourceModuleFilter] = React.useState<string>("all");
  const [selectedNotificationKey, setSelectedNotificationKey] = React.useState<string>(notificationRules[0]?.key ?? "");

  const sourceModules = React.useMemo(() => {
    const modules = Array.from(new Set(notificationRules.map((item) => item.source.sourceModule))).sort();
    return ["all", ...modules];
  }, []);
  const filteredNotifications = React.useMemo(() => {
    return notificationRules.filter((item) => {
      if (channelFilter !== "all" && item.channel !== channelFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (sourceModuleFilter !== "all" && item.source.sourceModule !== sourceModuleFilter) return false;
      return true;
    });
  }, [channelFilter, categoryFilter, statusFilter, sourceModuleFilter]);

  const selectedNotification = React.useMemo(() => {
    if (!selectedNotificationKey) return undefined;
    return filteredNotifications.find((item) => item.key === selectedNotificationKey) ?? getNotificationByKey(selectedNotificationKey);
  }, [filteredNotifications, selectedNotificationKey]);

  const selectedPreview = React.useMemo(() => {
    if (!selectedNotification) return undefined;
    return getNotificationPreview(selectedNotification);
  }, [selectedNotification]);

  const stats = React.useMemo(() => {
    return {
      total: notificationRules.length,
      placeholder: getPlaceholderNotifications().length,
      humanReview: getHumanReviewNotifications().length,
      byChannel: groupBy(notificationRules.map((item) => item.channel)),
      byCategory: groupBy(notificationRules.map((item) => item.category)),
      bySourceModule: groupBy(notificationRules.map((item) => item.source.sourceModule)),
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">ME Notifications</CardTitle>
          <CardDescription>Message Contract / Notification Preview Foundation</CardDescription>
          <CardDescription>
            {currentLocale === "zh"
              ? "该页面仅用于通知元数据和消息合同预览。"
              : "This page is metadata-only notification and message-contract preview."}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/">Back To Dashboard</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/workflow">ME Workflow</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/reports">ME Reports</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/action-contracts">ME Action Contracts</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/access-control">ME Access Control</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/audit-trail">ME Audit Trail</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/layout-engine">ME Layout Engine</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/components">ME Core Components</Link></Button>
          </div>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Notification Stats</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-3 gap-2 md:max-w-md">
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Total</div><div className="text-lg font-semibold">{stats.total}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Placeholder</div><div className="text-lg font-semibold">{stats.placeholder}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Human Review</div><div className="text-lg font-semibold">{stats.humanReview}</div></div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byChannel).map(([key, value]) => <Badge key={key} variant="outline">{key}: {value}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byCategory).map(([key, value]) => <Badge key={key} variant="secondary">{key}: {value}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.bySourceModule).map(([key, value]) => <Badge key={key} variant="outline">{key}: {value}</Badge>)}</div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={channelFilter} onValueChange={(value) => setChannelFilter(value as NotificationChannel | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Channel" /></SelectTrigger>
            <SelectContent>{channelOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as NotificationCategory | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categoryOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as NotificationStatus | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{statusOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sourceModuleFilter} onValueChange={setSourceModuleFilter}>
            <SelectTrigger size="sm"><SelectValue placeholder="Source Module" /></SelectTrigger>
            <SelectContent>{sourceModules.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>
      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Notification Rules</CardTitle><CardDescription className="text-xs">{filteredNotifications.length} / {notificationRules.length}</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {filteredNotifications.map((item) => (
              <button key={item.key} type="button" className="text-left" onClick={() => setSelectedNotificationKey(item.key)}>
                <NotificationRuleCard notification={item} locale={currentLocale} />
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {selectedPreview ? <NotificationPreviewCard preview={selectedPreview} locale={currentLocale} /> : null}
          {selectedNotification ? <NotificationSourceCard notification={selectedNotification} locale={currentLocale} /> : null}
          {selectedNotification ? (
            <Card size="sm">
              <CardHeader className="gap-1"><CardTitle className="text-sm">Related Contract Keys</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {selectedNotification.source.workflowKey ? <div>WorkflowContract key: {selectedNotification.source.workflowKey}</div> : null}
                {selectedNotification.source.actionKey ? <div>ActionContract key: {selectedNotification.source.actionKey}</div> : null}
                {selectedNotification.source.auditEventKey ? <div>AuditEventContract key: {selectedNotification.source.auditEventKey}</div> : null}
                {selectedNotification.source.accessRuleKey ? <div>AccessRule key: {selectedNotification.source.accessRuleKey}</div> : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Notification Template Catalog</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {notificationTemplateCatalog.map((template) => (
            <NotificationTemplateCard key={template.code} template={template} locale={currentLocale} />
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
