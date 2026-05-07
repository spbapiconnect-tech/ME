import { notFound } from "next/navigation";

import { ErpDetailPanel, ErpPageHeader, ErpRightRail, ErpShell, ErpStatusBadge } from "@/components/erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { erpBranchRecords } from "@/lib/erp/erp-sample-data";

export function BranchErpDetailPage({ id }: { id: string }) {
  const branch = erpBranchRecords.find((record) => record.id === id);

  if (!branch) {
    notFound();
  }

  return (
    <ErpShell
      activeHref="/branches"
      rightRail={
        <ErpRightRail
          sections={[
            { title: "Top Branch Alerts", items: ["Inventory below safety stock", "Opening checklist submitted", "Staffing coverage needs review"] },
            { title: "Recent Activity", items: ["10:15 Checklist submitted", "09:40 Stock alert created", "09:10 Shift change approved"] },
          ]}
        />
      }
    >
      <ErpPageHeader
        eyebrow="Branch Management"
        title={branch.branchName}
        description="Branch operating profile, daily status, related records, and activity."
        meta={[
          { label: "Branch Code", value: branch.branchCode },
          { label: "Region", value: branch.region },
          { label: "Manager", value: branch.manager },
        ]}
      />

      <ErpDetailPanel
        title={branch.branchName}
        description={branch.status}
        fields={[
          { label: "Branch Code", value: branch.branchCode },
          { label: "Region", value: branch.region },
          { label: "Manager", value: branch.manager },
          { label: "Business Hours", value: branch.businessHours },
          { label: "Phone", value: branch.phone },
          { label: "Address", value: branch.address },
          { label: "Staff Today", value: branch.staffToday },
          { label: "Current Shift", value: branch.currentShift },
          { label: "Last Inspection", value: branch.lastInspection },
          { label: "Inventory Review", value: branch.inventoryReview },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Branch Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="records">Related Records</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <div className="flex flex-wrap gap-2">
                <ErpStatusBadge tone="success">Operations: On Track</ErpStatusBadge>
                <ErpStatusBadge tone="warning">Inventory: Warning</ErpStatusBadge>
                <ErpStatusBadge tone="info">Sales: +12.6%</ErpStatusBadge>
              </div>
            </TabsContent>
            <TabsContent value="operations" className="pt-4 text-sm text-muted-foreground">
              Daily operations, staffing, and stock review are visible from this branch detail view.
            </TabsContent>
            <TabsContent value="records" className="pt-4 text-sm text-muted-foreground">
              Related records include tasks, inventory alerts, inspections, and reports.
            </TabsContent>
            <TabsContent value="activity" className="pt-4 text-sm text-muted-foreground">
              Recent activity is shown in the right rail.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ErpShell>
  );
}
