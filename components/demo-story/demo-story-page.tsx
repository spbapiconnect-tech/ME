import Link from "next/link";

import { DemoStoryStepCard } from "@/components/demo-story/demo-story-step-card";
import { DemoStoryTimeline } from "@/components/demo-story/demo-story-timeline";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoStoryPageData } from "@/types/demo-story";

interface DemoStoryPageProps {
  data: MeDemoStoryPageData;
}

export function DemoStoryPage({ data }: DemoStoryPageProps) {
  const firstStep = data.steps[0];

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="demo-story" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">{data.title.en}</CardTitle>
                  <CardDescription>{data.subtitle.en}</CardDescription>
                  <CardDescription>{data.notice.en}</CardDescription>
                </div>
                {firstStep ? (
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/demo-story/${firstStep.key}`}>Start Guided Demo</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={firstStep.route}>Open First Route</Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardHeader>
          </Card>

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">No Persisted Progress</CardTitle>
              <CardDescription>
                Guided demo state is visual only. No onboarding engine, no localStorage/sessionStorage, no analytics, no tracking, and no personalization are added.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              <p>Use the step detail pages to move through the product narrative manually.</p>
              <p>The actual business, navigation, role, branch, PSI, report, and system foundation routes remain unchanged.</p>
            </CardContent>
          </Card>

          <DemoStoryTimeline steps={data.steps} />

          {data.sections.map((section) => (
            <section key={section.key} className="grid gap-3">
              <div>
                <p className="text-sm font-semibold">{section.title.en}</p>
                {section.description ? <p className="text-sm text-muted-foreground">{section.description.en}</p> : null}
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {section.steps.map((step) => (
                  <DemoStoryStepCard key={step.key} step={step} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
