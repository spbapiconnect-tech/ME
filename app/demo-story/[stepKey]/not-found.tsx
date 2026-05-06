import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoStoryStepNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl">ME Demo Story Step Not Found</CardTitle>
          <CardDescription>The requested guided-demo step does not exist.</CardDescription>
          <CardDescription>
            Available ME demo story pages remain static, read-only, and do not track user progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/demo-story">Back To ME Demo Story</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/">Open ME Workspace</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
