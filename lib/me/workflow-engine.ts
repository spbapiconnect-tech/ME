import type { WorkflowDefinition } from "@/lib/me/types";

export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: "WF-PROCUREMENT-REQUEST",
    module: "procurement",
    states: ["draft", "submitted", "approved", "ordered", "closed"],
    transitions: [
      { from: "draft", to: "submitted", action: "Submit Request", ownerRole: "Requester", nextActionLabel: "Await Approval" },
      { from: "submitted", to: "approved", action: "Approve Request", ownerRole: "Manager", nextActionLabel: "Create PO" },
      { from: "approved", to: "ordered", action: "Issue PO", ownerRole: "Procurement", nextActionLabel: "Track Receiving" },
      { from: "ordered", to: "closed", action: "Close Request", ownerRole: "Procurement", nextActionLabel: "Archive" },
    ],
  },
  {
    id: "WF-RECEIVING",
    module: "receiving",
    states: ["awaiting", "received", "variance", "posted"],
    transitions: [
      { from: "awaiting", to: "received", action: "Receive Shipment", ownerRole: "Storekeeper", nextActionLabel: "Run Checks" },
      { from: "received", to: "variance", action: "Log Variance", ownerRole: "Receiver", nextActionLabel: "Resolve Variance" },
      { from: "received", to: "posted", action: "Post Inventory", ownerRole: "Inventory Controller", nextActionLabel: "Complete" },
    ],
  },
  {
    id: "WF-ISSUE-RESOLUTION",
    module: "issues",
    states: ["open", "in_review", "resolved", "closed"],
    transitions: [
      { from: "open", to: "in_review", action: "Assign Owner", ownerRole: "Branch Manager", nextActionLabel: "Investigate" },
      { from: "in_review", to: "resolved", action: "Apply Fix", ownerRole: "Owner", nextActionLabel: "Confirm Resolution" },
      { from: "resolved", to: "closed", action: "Close Issue", ownerRole: "Manager", nextActionLabel: "Archive" },
    ],
  },
  {
    id: "WF-INSPECTION-FOLLOWUP",
    module: "inspection",
    states: ["checked", "failed", "task_created", "verified"],
    transitions: [
      { from: "checked", to: "failed", action: "Flag Failed Item", ownerRole: "Inspector", nextActionLabel: "Create Task" },
      { from: "failed", to: "task_created", action: "Create Follow-up Task", ownerRole: "Supervisor", nextActionLabel: "Track Completion" },
      { from: "task_created", to: "verified", action: "Verify Fix", ownerRole: "Reviewer", nextActionLabel: "Complete Review" },
    ],
  },
  {
    id: "WF-STAFF-TRAINING",
    module: "training",
    states: ["assigned", "in_progress", "completed", "expired"],
    transitions: [
      { from: "assigned", to: "in_progress", action: "Start Course", ownerRole: "Staff", nextActionLabel: "Continue Training" },
      { from: "in_progress", to: "completed", action: "Complete Course", ownerRole: "Staff", nextActionLabel: "Record Completion" },
      { from: "completed", to: "expired", action: "Mark Expired", ownerRole: "HR", nextActionLabel: "Reassign Training" },
    ],
  },
  {
    id: "WF-EXPIRY-CONTROL",
    module: "expiry",
    states: ["monitored", "expiring", "actioned", "closed"],
    transitions: [
      { from: "monitored", to: "expiring", action: "Flag Expiry Risk", ownerRole: "Storekeeper", nextActionLabel: "Take Action" },
      { from: "expiring", to: "actioned", action: "Transfer or Dispose", ownerRole: "Kitchen Lead", nextActionLabel: "Verify Record" },
      { from: "actioned", to: "closed", action: "Close Batch", ownerRole: "Supervisor", nextActionLabel: "Archive" },
    ],
  },
];

export function getWorkflowByModule(module: string) {
  return workflowDefinitions.filter((item) => item.module === module);
}
