import type { RoleRegistryItem } from "@/types/access-control"

export const roleRegistry: RoleRegistryItem[] = [
  {
    code: "owner",
    name: { zh: "负责人", en: "Owner" },
    description: { zh: "门店或业务主体的最终负责人。", en: "Final owner of a store or operating entity." },
    category: "leadership",
    defaultLanding: "/modules",
    notes: { zh: "通常关注跨模块经营结果。", en: "Usually focuses on cross-module operating outcomes." },
  },
  {
    code: "operations-manager",
    name: { zh: "运营经理", en: "Operations Manager" },
    description: { zh: "负责整体营运节奏与执行质量。", en: "Leads operational cadence and execution quality." },
    category: "operations",
    defaultLanding: "/tasks",
  },
  {
    code: "purchasing-manager",
    name: { zh: "采购经理", en: "Purchasing Manager" },
    description: { zh: "负责采购审批、供应协同与采购策略。", en: "Owns purchasing approvals, supplier collaboration, and procurement strategy." },
    category: "operations",
    defaultLanding: "/modules/procurement/listing",
  },
  {
    code: "store-manager",
    name: { zh: "店长", en: "Store Manager" },
    description: { zh: "负责门店日常运营、人员与任务闭环。", en: "Manages day-to-day store execution, staffing, and task closure." },
    category: "store",
    defaultLanding: "/tasks",
  },
  {
    code: "warehouse-handler",
    name: { zh: "仓储专员", en: "Warehouse Handler" },
    description: { zh: "负责库存收发、盘点与异常处理。", en: "Handles stock in/out operations, counting, and exceptions." },
    category: "warehouse",
    defaultLanding: "/modules/inventory/listing",
  },
  {
    code: "supplier-coordinator",
    name: { zh: "供应商协同员", en: "Supplier Coordinator" },
    description: { zh: "负责供应商信息维护与协作跟进。", en: "Maintains supplier records and collaboration follow-up." },
    category: "supplier",
    defaultLanding: "/modules/supplier/listing",
  },
  {
    code: "staff",
    name: { zh: "员工", en: "Staff" },
    description: { zh: "执行门店任务与标准操作流程。", en: "Executes store tasks and standard operating procedures." },
    category: "store",
    defaultLanding: "/tasks",
  },
  {
    code: "admin",
    name: { zh: "平台管理员", en: "Admin" },
    description: { zh: "负责平台级配置与治理策略。", en: "Owns platform-wide settings and governance policies." },
    category: "platform",
    defaultLanding: "/components",
  },
  {
    code: "system",
    name: { zh: "系统", en: "System" },
    description: { zh: "用于系统级任务与未来自动化执行身份。", en: "Represents system-level tasks and future automation identity." },
    category: "system",
    defaultLanding: "/access-control",
    notes: { zh: "仅用于元数据描述，不代表真实服务账号。", en: "Metadata only, not a real service account." },
  },
]

export const roleRegistryByCode: Record<string, RoleRegistryItem> = Object.fromEntries(roleRegistry.map((role) => [role.code, role]))
