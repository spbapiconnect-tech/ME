import { DemoStoryPage } from "@/components/demo-story";
import { getDemoStoryPageData } from "@/lib/demo-story";

export default function DemoStoryRoute() {
  return <DemoStoryPage data={getDemoStoryPageData()} />;
}
