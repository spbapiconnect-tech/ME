import { ModuleCenter } from "@/components/modules/module-center";
import { moduleRegistry } from "@/config/modules";

export default function ModulesPage() {
  return <ModuleCenter modules={moduleRegistry} />;
}
