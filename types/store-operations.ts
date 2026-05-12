export type StoreOperationModuleId =
  | "branch-control"
  | "outlet-execution"
  | "store-inspection"
  | "incident-center"
  | "fefo-waste-control"
  | "sop-training";

export type StoreOperationStatusFlow =
  | "Draft"
  | "Setup Required"
  | "Active"
  | "Attention"
  | "Suspended"
  | "Closed"
  | "Scheduled"
  | "Due Today"
  | "Submitted"
  | "Pending Review"
  | "Completed"
  | "Overdue"
  | "Escalated"
  | "In Progress"
  | "Failed Items"
  | "Issue Created"
  | "New"
  | "Contained"
  | "Assigned"
  | "Resolved"
  | "Reopened"
  | "Fresh"
  | "Expiring Soon"
  | "Use First"
  | "Hold"
  | "Expired"
  | "Disposed"
  | "Review"
  | "Approved"
  | "Effective"
  | "Need Review"
  | "Superseded"
  | "Obsolete"
  | "Rejected"
  | "Rework Required";

export type ModuleKpiDefinition = {
  key: string;
  label: string;
  calculatorKey?: string;
};

export type StoreOperationModule = {
  id: StoreOperationModuleId;
  label: string;
  shortLabel: string;
  route: string;
  description: string;
  primaryActionLabel: string;
  searchPlaceholder: string;
  filters: string[];
  kpis: ModuleKpiDefinition[];
  recordLabel: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  detailTitle: string;
  statusFlow: StoreOperationStatusFlow[];
  masterDataDependencies: string[];
  linkedModules: string[];
};

type BaseOperationRecord = {
  id: string;
  status: StoreOperationStatusFlow;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  linkedRecordIds: string[];
  notes?: string;
};

export type BranchRecord = BaseOperationRecord & {
  branchId: string;
  branchName: string;
  name?: string;
  code?: string;
  branchCode?: string;
  regionId?: string;
  brandId?: string;
  outletType?: string;
  address?: string;
  managerId?: string;
  supervisorId?: string;
  operatingHours?: string;
  openingWindow?: string;
  closingWindow?: string;
  posId?: string;
  serviceChannels?: string[];
  stationAreas?: string[];
  setupStatus?: "Not Started" | "In Progress" | "Ready" | "Missing Setup" | "Review Required";
  openTodayStatus?: "Not Opened" | "Opening Pending" | "Open" | "Issue Found" | "Closed";
  healthScore?: number;
  riskScore?: number;
  attentionLevel?: "Healthy" | "Watch" | "Attention" | "Critical";
  missingSetupItems?: string[];
  linkedTaskIds?: string[];
  linkedInspectionIds?: string[];
  linkedIncidentIds?: string[];
  linkedFefoWasteIds?: string[];
};

export type OutletExecutionRecord = BaseOperationRecord & {
  title: string;
  branchId?: string;
  taskType?: "Opening Check" | "Closing Check" | "Daily Operation" | "Corrective Action" | "Photo Recheck" | "Training Acknowledgement" | "FEFO Action" | "Campaign Execution";
  priority?: "Low" | "Normal" | "High" | "Critical";
  sourceRecordId?: string;
  assignedRole?: string;
  assignedTo?: string;
  dueDate?: string;
  dueTime?: string;
  dueAt?: string;
  completedAt?: string;
  submittedAt?: string;
  reviewedAt?: string;
  repeatRule?: string;
  completionStandard?: string;
  checklistItems?: string[];
  photoProofRequired?: boolean;
  photoProofStatus?: "Not Required" | "Required" | "Missing" | "Submitted" | "Accepted" | "Rejected" | "Recheck Required";
  photoUrls?: string[];
  proofComment?: string;
  managerReviewStatus?: "Not Submitted" | "Pending Review" | "Accepted" | "Rejected" | "Rework Required";
  managerReviewComment?: string;
  linkedIncidentId?: string;
  linkedInspectionId?: string;
  linkedInspectionFailedItemId?: string;
  linkedFefoWasteId?: string;
  escalationLevel?: "None" | "Supervisor" | "Manager" | "HQ" | "Critical";
  slaStatus?: "On Track" | "Due Soon" | "Overdue" | "Breached";
  targetBranchIds: string[];
  proofType?: string;
};

export type StoreInspectionRecord = BaseOperationRecord & {
  branchId: string;
  title: string;
  inspectionType?: string;
  checklistTemplateId?: string;
  inspectorId?: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  failedItemCount: number;
  failedItems: InspectionFailedItem[];
  linkedOutletExecutionId?: string;
  linkedIncidentIds: string[];
  linkedCorrectiveActionIds: string[];
  photoProofRequired?: boolean;
  reviewStatus?: string;
};

export type InspectionFailedItem = {
  id: string;
  checklistItemId?: string;
  label: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  result: "failed" | "warning" | "pass";
  comment?: string;
  photoRequired: boolean;
  photoUrls: string[];
  shouldCreateIncident: boolean;
  correctiveActionRequired: boolean;
};

export type IncidentRecord = BaseOperationRecord & {
  branchId: string;
  title: string;
  summary?: string;
  sourceRecordId?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  category?: string;
  impactArea?: string;
  reportedAt?: string;
  reportedBy?: string;
  immediateContainment?: string;
  containmentStatus?: string;
  rootCause?: string;
  nextAction?: string;
  dueAt?: string;
  slaStatus?: "On Track" | "Due Soon" | "Overdue" | "Breached";
  escalationLevel?: "None" | "Supervisor" | "Manager" | "HQ" | "Critical";
  linkedInspectionId?: string;
  linkedInspectionFailedItemId?: string;
  linkedOutletExecutionId?: string;
  linkedFefoWasteId?: string;
  linkedCorrectiveActionIds: string[];
  resolutionEvidence?: string;
  reviewStatus?: string;
};

export type FefoWasteRecord = BaseOperationRecord & {
  branchId: string;
  productName?: string;
  category?: string;
  batchNo?: string;
  lotNo?: string;
  productId?: string;
  supplierId?: string;
  receivingRef?: string;
  storageLocation?: string;
  quantity?: number;
  unit?: string;
  receivedDate?: string;
  expiryDate?: string;
  batchLot?: string;
  remainingDays?: number;
  fefoPriority?: "Low" | "Medium" | "High" | "Critical";
  actionRequired?: boolean;
  actionType?: "Use First" | "Transfer" | "Hold" | "Dispose" | "Report Incident" | "No Action";
  checkedBy?: string;
  checkedAt?: string;
  usedQuantity?: number;
  disposedQuantity?: number;
  transferredQuantity?: number;
  wasteReason?: string;
  wasteCost?: number;
  photoProofRequired?: boolean;
  photoProofStatus?: "Not Required" | "Required" | "Missing" | "Submitted" | "Accepted" | "Rejected";
  photoUrls?: string[];
  linkedOutletExecutionId?: string;
  linkedIncidentId?: string;
  linkedInventoryItemId?: string;
  linkedSupplierId?: string;
  linkedReceivingId?: string;
  managerReviewStatus?: "Not Submitted" | "Pending Review" | "Accepted" | "Rejected";
};

export type SopTrainingRecord = BaseOperationRecord & {
  title: string;
  documentCode?: string;
  category?: string;
  processArea?: string;
  version?: string;
  processOwnerId?: string;
  approverId?: string;
  effectiveDate?: string;
  reviewDate?: string;
  reviewDueDate?: string;
  reviewCycle?: string;
  targetRoleIds?: string[];
  targetBranchIds?: string[];
  targetDepartmentIds?: string[];
  acknowledgementRequired?: boolean;
  acknowledgementStatus?: "Not Required" | "Assigned" | "Pending" | "Overdue" | "Acknowledged" | "Failed / Reassigned";
  assignedTrainingIds?: string[];
  linkedChecklistTemplateIds?: string[];
  linkedInspectionTemplateIds?: string[];
  linkedTaskTemplateIds?: string[];
  linkedOutletExecutionTaskIds?: string[];
  riskPoints?: string[];
  steps?: string[];
  attachments?: string[];
  previousVersionId?: string;
  replacementVersionId?: string;
  obsoleteReason?: string;
};
