import type { SupplierPageData } from "@/types/psi";

const CNY = "CNY";

export const psiSupplierPageData: SupplierPageData = {
  suppliers: [
    { supplierId: "SUP-1001", supplierCode: "SUP-1001", name: "Northwind Supply Co.", category: "Dairy", status: "active", serviceRegion: "East", leadTimeDays: 2, sourceRef: { moduleCode: "supplier", recordId: "SUP-1001", recordType: "supplier", route: "/psi/supplier/SUP-1001" }, audit: { createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" } },
    { supplierId: "SUP-1002", supplierCode: "SUP-1002", name: "BlueRiver Trading", category: "Beverage", status: "active", serviceRegion: "North", leadTimeDays: 3, sourceRef: { moduleCode: "supplier", recordId: "SUP-1002", recordType: "supplier", route: "/psi/supplier/SUP-1002" }, audit: { createdAt: "2026-01-05T00:00:00Z", updatedAt: "2026-04-30T00:00:00Z" } },
    { supplierId: "SUP-1003", supplierCode: "SUP-1003", name: "Prime Sourcing Group", category: "Chilled", status: "review", serviceRegion: "South", leadTimeDays: 4, sourceRef: { moduleCode: "supplier", recordId: "SUP-1003", recordType: "supplier", route: "/psi/supplier/SUP-1003" }, audit: { createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-05-02T00:00:00Z" } },
    { supplierId: "SUP-1004", supplierCode: "SUP-1004", name: "Harvest Food Ltd.", category: "Coffee", status: "blocked", serviceRegion: "West", leadTimeDays: 5, sourceRef: { moduleCode: "supplier", recordId: "SUP-1004", recordType: "supplier", route: "/psi/supplier/SUP-1004" }, audit: { createdAt: "2026-02-18T00:00:00Z", updatedAt: "2026-05-03T00:00:00Z" } },
    { supplierId: "SUP-1005", supplierCode: "SUP-1005", name: "FreshFoods Industrial", category: "Frozen", status: "pending", serviceRegion: "Central", leadTimeDays: 2, sourceRef: { moduleCode: "supplier", recordId: "SUP-1005", recordType: "supplier", route: "/psi/supplier/SUP-1005" }, audit: { createdAt: "2026-03-11T00:00:00Z", updatedAt: "2026-05-03T00:00:00Z" } },
  ],
  contacts: [
    { contactId: "SUP-1001-C1", supplierId: "SUP-1001", name: "Chen Li", phone: "13800010001", email: "chen.li@northwind.example", role: "Sales", status: "active" },
    { contactId: "SUP-1002-C1", supplierId: "SUP-1002", name: "Tom Wang", phone: "13800010002", email: "tom.wang@blueriver.example", role: "Account", status: "active" },
    { contactId: "SUP-1003-C1", supplierId: "SUP-1003", name: "Mia Yu", phone: "13800010003", email: "mia.yu@prime.example", role: "Coordinator", status: "review" },
    { contactId: "SUP-1004-C1", supplierId: "SUP-1004", name: "Evan Hu", status: "blocked" },
    { contactId: "SUP-1005-C1", supplierId: "SUP-1005", name: "Ivy Xu", status: "pending" },
  ],
  products: [
    { productLinkId: "SUP-1001-P1", supplierId: "SUP-1001", skuId: "SKU-1001", productName: "Fresh Milk 1L", moq: 24, leadTimeDays: 2, quotedPrice: { amount: 7.1, currency: CNY }, status: "active" },
    { productLinkId: "SUP-1001-P2", supplierId: "SUP-1001", skuId: "SKU-1002", productName: "Bakery Flour 2kg", moq: 20, leadTimeDays: 2, quotedPrice: { amount: 17.8, currency: CNY }, status: "active" },
    { productLinkId: "SUP-1002-P1", supplierId: "SUP-1002", skuId: "SKU-1003", productName: "Mineral Water 550ml", moq: 100, leadTimeDays: 3, quotedPrice: { amount: 2.4, currency: CNY }, status: "active" },
    { productLinkId: "SUP-1003-P1", supplierId: "SUP-1003", skuId: "SKU-1004", productName: "Yogurt Cup", moq: 120, leadTimeDays: 4, quotedPrice: { amount: 4.1, currency: CNY }, status: "review" },
    { productLinkId: "SUP-1005-P1", supplierId: "SUP-1005", skuId: "SKU-1006", productName: "Frozen Fries 2.5kg", moq: 30, leadTimeDays: 2, quotedPrice: { amount: 26, currency: CNY }, status: "pending" },
  ],
  quotations: [
    { quotationId: "SUP-1001-Q1", supplierId: "SUP-1001", skuId: "SKU-1001", effectiveFrom: "2026-05-01", effectiveTo: "2026-05-31", unitPrice: { amount: 7.1, currency: CNY }, status: "active", sourceRef: { moduleCode: "supplier", recordId: "SUP-1001-Q1", recordType: "quotation" } },
    { quotationId: "SUP-1002-Q1", supplierId: "SUP-1002", skuId: "SKU-1003", effectiveFrom: "2026-05-01", unitPrice: { amount: 2.4, currency: CNY }, status: "active", sourceRef: { moduleCode: "supplier", recordId: "SUP-1002-Q1", recordType: "quotation" } },
    { quotationId: "SUP-1003-Q1", supplierId: "SUP-1003", skuId: "SKU-1004", effectiveFrom: "2026-05-01", unitPrice: { amount: 4.1, currency: CNY }, status: "review", sourceRef: { moduleCode: "supplier", recordId: "SUP-1003-Q1", recordType: "quotation" } },
  ],
  contracts: [
    { contractId: "SUP-1001-CT1", supplierId: "SUP-1001", contractNo: "CT-1001", status: "active", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", sourceRef: { moduleCode: "supplier", recordId: "CT-1001", recordType: "contract" } },
    { contractId: "SUP-1003-CT1", supplierId: "SUP-1003", contractNo: "CT-1003", status: "review", effectiveFrom: "2026-02-01", sourceRef: { moduleCode: "supplier", recordId: "CT-1003", recordType: "contract" } },
    { contractId: "SUP-1004-CT1", supplierId: "SUP-1004", contractNo: "CT-1004", status: "blocked", effectiveFrom: "2026-01-15", sourceRef: { moduleCode: "supplier", recordId: "CT-1004", recordType: "contract" } },
  ],
  ratings: [
    { ratingId: "SUP-1001-R1", supplierId: "SUP-1001", score: 4.8, grade: "A", period: "2026-04", status: "active" },
    { ratingId: "SUP-1002-R1", supplierId: "SUP-1002", score: 4.6, grade: "A", period: "2026-04", status: "active" },
    { ratingId: "SUP-1003-R1", supplierId: "SUP-1003", score: 3.9, grade: "B", period: "2026-04", status: "review" },
    { ratingId: "SUP-1004-R1", supplierId: "SUP-1004", score: 2.8, grade: "C", period: "2026-04", status: "blocked" },
    { ratingId: "SUP-1005-R1", supplierId: "SUP-1005", score: 3.5, grade: "B", period: "2026-04", status: "pending" },
  ],
  issues: [
    { issueId: "PI-2001", supplierId: "SUP-1003", title: { zh: "发货延迟", en: "Late dispatch" }, status: "active", priority: "high", sourceRef: { moduleCode: "supplier", recordId: "PI-2001", recordType: "supplier-issue" }, linkedTask: { taskId: "TASK-2001", title: { zh: "跟进延迟发货", en: "Follow delayed dispatch" }, status: "active", sourceRef: { moduleCode: "task", recordId: "TASK-2001", recordType: "task" } }, openedAt: "2026-05-02T08:00:00Z" },
    { issueId: "PI-2002", supplierId: "SUP-1004", title: { zh: "合同争议", en: "Contract dispute" }, status: "disputed", priority: "critical", sourceRef: { moduleCode: "supplier", recordId: "PI-2002", recordType: "supplier-issue" }, openedAt: "2026-05-03T09:00:00Z" },
    { issueId: "PI-2003", supplierId: "SUP-1005", title: { zh: "资质待审核", en: "Certification pending review" }, status: "review", priority: "medium", sourceRef: { moduleCode: "supplier", recordId: "PI-2003", recordType: "supplier-issue" }, openedAt: "2026-05-03T10:00:00Z" },
  ],
  stats: {
    totalSuppliers: 5,
    activeSuppliers: 2,
    reviewSuppliers: 1,
    blockedSuppliers: 1,
    issueOpenCount: 3,
    averageScore: 3.92,
  },
};
