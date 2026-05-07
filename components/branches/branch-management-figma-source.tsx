"use client";

import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Download,
  FileText,
  CheckSquare,
  MoreHorizontal,
  Home,
  Store,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Plug,
  ChevronRight,
  Filter,
  Phone,
  MapPin,
  Clock,
  User,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Circle
} from "lucide-react";
import { useState } from "react";
import { Button } from "./figma-ui/button";
import { Input } from "./figma-ui/input";
import { Badge } from "./figma-ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./figma-ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./figma-ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./figma-ui/select";

export function BranchManagement() {
  const [storeOpsExpanded, setStoreOpsExpanded] = useState(true);
  const [psiExpanded, setPsiExpanded] = useState(true);
  const [workforceExpanded, setWorkforceExpanded] = useState(true);
  const [businessExpanded, setBusinessExpanded] = useState(false);
  const [systemExpanded, setSystemExpanded] = useState(false);

  const branches = [
    {
      code: "KCH-001",
      name: "KCH Central Kitchen",
      region: "Kuching",
      manager: "Chin Ling",
      status: "Operating",
      sales: "RM 28,750",
      tasks: 5,
      alerts: 2,
      score: "94%",
      updated: "10:15"
    },
    {
      code: "BTU-001",
      name: "BTU Outlet",
      region: "Bintulu",
      manager: "Morexson",
      status: "Operating",
      sales: "RM 18,420",
      tasks: 4,
      alerts: 1,
      score: "91%",
      updated: "09:45"
    },
    {
      code: "KCH-002",
      name: "KCH Pickup Point",
      region: "Kuching",
      manager: "Lydia",
      status: "Preparation",
      sales: "RM 6,880",
      tasks: 2,
      alerts: 1,
      score: "88%",
      updated: "08:30"
    },
    {
      code: "HQ-001",
      name: "Head Office",
      region: "HQ",
      manager: "Admin",
      status: "Active",
      sales: "-",
      tasks: 1,
      alerts: 0,
      score: "-",
      updated: "Yesterday"
    }
  ];

  const openTasks = [
    { id: "TSK-2301", task: "Opening checklist", owner: "Zhang", due: "Today 11:00", status: "In Progress" },
    { id: "TSK-2298", task: "Fridge temp check", owner: "Chin Ling", due: "Today 14:00", status: "Pending" },
    { id: "TSK-2285", task: "Shift handover", owner: "Lydia", due: "Overdue", status: "Overdue" }
  ];

  const inventoryAlerts = [
    { item: "French Fries", location: "KCH Central Kitchen", onHand: "8 kg", reorderLevel: "15 kg", status: "Low Stock" },
    { item: "Tomato Sauce", location: "KCH Central Kitchen", onHand: "3 bottles", reorderLevel: "10 bottles", status: "Critical" },
    { item: "Chicken Wings", location: "BTU Outlet", onHand: "12 kg", reorderLevel: "20 kg", status: "Low Stock" },
    { item: "Burger Buns", location: "KCH Pickup Point", onHand: "15 pcs", reorderLevel: "50 pcs", status: "Low Stock" }
  ];

  return (
    <div className="flex h-screen bg-[#f5f6f8]">
      {/* Left Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-semibold">ME</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">ME Branch ERP</div>
              <div className="text-xs text-gray-500">Restaurant Operations</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-0.5">
            <NavItem icon={<Home className="w-4 h-4" />} label="Dashboard" />

            <NavGroup
              label="Store Operations"
              expanded={storeOpsExpanded}
              onToggle={() => setStoreOpsExpanded(!storeOpsExpanded)}
            >
              <NavItem icon={<Store className="w-4 h-4" />} label="Branches" active child />
              <NavItem icon={<ClipboardCheck className="w-4 h-4" />} label="Inspection" child />
              <NavItem icon={<AlertCircle className="w-4 h-4" />} label="Issues" child />
              <NavItem icon={<CheckCircle2 className="w-4 h-4" />} label="Tasks" child />
            </NavGroup>

            <NavGroup
              label="PSI"
              expanded={psiExpanded}
              onToggle={() => setPsiExpanded(!psiExpanded)}
            >
              <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Overview" child />
              <NavItem icon={<ShoppingCart className="w-4 h-4" />} label="Procurement" child />
              <NavItem icon={<Package className="w-4 h-4" />} label="Supplier" child />
              <NavItem icon={<Package className="w-4 h-4" />} label="Inventory" child />
              <NavItem icon={<CheckCircle2 className="w-4 h-4" />} label="Receiving" child />
            </NavGroup>

            <NavGroup
              label="Workforce"
              expanded={workforceExpanded}
              onToggle={() => setWorkforceExpanded(!workforceExpanded)}
            >
              <NavItem icon={<Users className="w-4 h-4" />} label="Staff" child />
              <NavItem icon={<Calendar className="w-4 h-4" />} label="Schedule" child />
              <NavItem icon={<FileText className="w-4 h-4" />} label="Training" child />
            </NavGroup>

            <NavGroup
              label="Business"
              expanded={businessExpanded}
              onToggle={() => setBusinessExpanded(!businessExpanded)}
            >
              <NavItem icon={<FileText className="w-4 h-4" />} label="Reports" child />
            </NavGroup>

            <NavGroup
              label="System"
              expanded={systemExpanded}
              onToggle={() => setSystemExpanded(!systemExpanded)}
            >
              <NavItem icon={<Settings className="w-4 h-4" />} label="Roles & Permission" child />
              <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" child />
              <NavItem icon={<Plug className="w-4 h-4" />} label="Integration" child />
            </NavGroup>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-9 h-9 bg-gray-50 border-gray-200"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40 h-9 bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="kch">Kuching</SelectItem>
                <SelectItem value="btu">Bintulu</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="7d">
              <SelectTrigger className="w-36 h-9 bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Operations Manager</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-6 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>ME</span>
            <ChevronRight className="w-4 h-4" />
            <span>Store Operations</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Branch Management</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    Branch Management <span className="text-gray-400">门店管理</span>
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage branch operating status, performance, staffing, tasks, and alerts across all stores.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Branch
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <FileText className="w-4 h-4 mr-1" />
                    View Reports
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <CheckSquare className="w-4 h-4 mr-1" />
                    Open Tasks
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-8 gap-3 mb-6">
              <KPICard label="Total Branches" value="8" />
              <KPICard label="Open Stores" value="7 / 8" trend="positive" />
              <KPICard label="Today Sales" value="RM 28,750" trend="positive" />
              <KPICard label="Open Tasks" value="12" />
              <KPICard label="Inventory Alerts" value="4" trend="warning" />
              <KPICard label="Staff On Duty" value="18" />
              <KPICard label="Inspection Score" value="92%" trend="positive" />
              <KPICard label="Critical Issues" value="3" trend="warning" />
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search branch name / code / manager"
                  className="pl-9 h-9 bg-white border-gray-200"
                />
              </div>
              <Select defaultValue="all-branches">
                <SelectTrigger className="w-40 h-9 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-branches">All Branches</SelectItem>
                  <SelectItem value="kch">Kuching</SelectItem>
                  <SelectItem value="btu">Bintulu</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-regions">
                <SelectTrigger className="w-36 h-9 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-regions">All Regions</SelectItem>
                  <SelectItem value="kuching">Kuching</SelectItem>
                  <SelectItem value="bintulu">Bintulu</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-status">
                <SelectTrigger className="w-32 h-9 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="operating">Operating</SelectItem>
                  <SelectItem value="preparation">Preparation</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="w-4 h-4 mr-1" />
                More Filters
              </Button>
            </div>

            {/* Branch Table - Full Width */}
            <div className="mb-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-28 align-middle">Branch Code</TableHead>
                      <TableHead className="align-middle">Branch Name</TableHead>
                      <TableHead className="w-24 align-middle">Region</TableHead>
                      <TableHead className="w-28 align-middle">Manager</TableHead>
                      <TableHead className="w-28 align-middle">Status</TableHead>
                      <TableHead className="w-32 align-middle">Today Sales</TableHead>
                      <TableHead className="w-28 text-center align-middle">Open Tasks</TableHead>
                      <TableHead className="w-28 text-center align-middle">Stock Alerts</TableHead>
                      <TableHead className="w-28 align-middle">Inspection</TableHead>
                      <TableHead className="w-28 align-middle">Last Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.map((branch, idx) => (
                      <TableRow
                        key={branch.code}
                        className={idx === 0 ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50 cursor-pointer"}
                      >
                        <TableCell className="font-mono text-xs">{branch.code}</TableCell>
                        <TableCell className="font-medium">{branch.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{branch.region}</TableCell>
                        <TableCell className="text-sm">{branch.manager}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              branch.status === "Operating" ? "default" :
                              branch.status === "Preparation" ? "secondary" :
                              "outline"
                            }
                            className="text-xs"
                          >
                            {branch.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{branch.sales}</TableCell>
                        <TableCell className="text-center">
                          {branch.tasks > 0 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                              {branch.tasks}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {branch.alerts > 0 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-700 rounded text-xs font-medium">
                              {branch.alerts}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{branch.score}</TableCell>
                        <TableCell className="text-xs text-gray-500">{branch.updated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Selected Branch Detail + Right Rail */}
            <div className="grid grid-cols-12 gap-4">
              {/* Branch Detail - Left Column */}
              <div className="col-span-8">
                {/* Selected Branch Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">KCH Central Kitchen</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">Operating</Badge>
                        <span className="text-xs text-gray-500">KCH-001</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">Create Task</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs">View Report</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs">Open Detail</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-x-6 gap-y-3 text-sm mb-5">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Region</div>
                      <div className="font-medium">Kuching</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Manager</div>
                      <div className="font-medium">Chin Ling</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Business Hours</div>
                      <div className="font-medium">10:00–00:00</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Phone</div>
                      <div className="font-medium">082-000 123</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 mb-1">Address</div>
                      <div className="font-medium">Kuching Central, Sarawak</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Staff Today</div>
                      <div className="font-medium">18</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Current Shift</div>
                      <div className="font-medium">Day / Night transition</div>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="mt-5">
                    <TabsList className="grid grid-cols-6 h-9 bg-gray-100">
                      <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                      <TabsTrigger value="health" className="text-xs">Branch Health</TabsTrigger>
                      <TabsTrigger value="operations" className="text-xs">Today Operations</TabsTrigger>
                      <TabsTrigger value="records" className="text-xs">Related Records</TabsTrigger>
                      <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
                      <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded p-3">
                          <div className="text-xs font-semibold text-gray-700 mb-2">Basic Information</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Last Inspection</span>
                              <span className="font-medium">2026-05-06</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Inventory Review</span>
                              <span className="font-medium text-orange-600">4 alerts</span>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded p-3">
                          <div className="text-xs font-semibold text-gray-700 mb-2">Today Shift Coverage</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Morning Shift</span>
                              <span className="font-medium">6 / 6</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Afternoon Shift</span>
                              <span className="font-medium">8 / 8</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Night Shift</span>
                              <span className="font-medium text-orange-600">3 / 4</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="health" className="mt-4">
                      <div className="border border-gray-200 rounded p-4">
                        <div className="space-y-2.5">
                          <HealthItem label="Operations" status="On Track" variant="success" />
                          <HealthItem label="Staffing" status="Attention" variant="warning" />
                          <HealthItem label="Inventory" status="Warning" variant="error" />
                          <HealthItem label="Inspection" status="Passed" variant="success" />
                          <HealthItem label="Sales" status="+12.6% vs yesterday" variant="success" />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="operations" className="mt-4">
                      <div className="border border-gray-200 rounded p-4">
                        <div className="text-sm text-gray-600">Today's operations data</div>
                      </div>
                    </TabsContent>
                    <TabsContent value="records" className="mt-4">
                      <div className="border border-gray-200 rounded p-4">
                        <div className="text-sm text-gray-600">Related records</div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

              </div>

              {/* Right Rail */}
              <div className="col-span-4 space-y-4">
                {/* Top Branch Alerts */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Branch Alerts</h3>
                  <div className="space-y-2.5">
                    <ActionItem
                      icon={<AlertCircle className="w-4 h-4 text-red-600" />}
                      text="3 overdue tasks need review"
                      variant="error"
                      severity="Critical"
                    />
                    <ActionItem
                      icon={<AlertTriangle className="w-4 h-4 text-orange-600" />}
                      text="2 inventory alerts below safety stock"
                      variant="warning"
                      severity="High"
                    />
                    <ActionItem
                      icon={<ClipboardCheck className="w-4 h-4 text-blue-600" />}
                      text="1 inspection item awaiting verification"
                      variant="info"
                      severity="Medium"
                    />
                    <ActionItem
                      icon={<Package className="w-4 h-4 text-gray-600" />}
                      text="1 supplier delivery delay"
                      variant="default"
                      severity="Low"
                    />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
                  <div className="relative">
                    <div className="absolute left-1 top-2 bottom-2 w-px bg-gray-200"></div>
                    <div className="space-y-4 relative">
                      <TimelineItem time="10:15" text="Zhang submitted opening checklist" />
                      <TimelineItem time="09:40" text="Inventory alert created for fries stock" />
                      <TimelineItem time="09:10" text="Chin Ling approved staff shift change" />
                      <TimelineItem time="Yesterday" text="POS report synced successfully" />
                    </div>
                  </div>
                </div>

                {/* Open Tasks Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Open Tasks</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100">
                      <span className="text-gray-700">Opening checklist</span>
                      <Badge variant="secondary" className="text-xs">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100">
                      <span className="text-gray-700">Fridge temp check</span>
                      <Badge variant="outline" className="text-xs">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1.5">
                      <span className="text-gray-700">Shift handover</span>
                      <Badge variant="destructive" className="text-xs">Overdue</Badge>
                    </div>
                  </div>
                </div>

                {/* Inventory Alerts Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Inventory Alerts</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100">
                      <span className="text-gray-700">French Fries</span>
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">Low Stock</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100">
                      <span className="text-gray-700">Tomato Sauce</span>
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100">
                      <span className="text-gray-700">Chicken Wings</span>
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">Low Stock</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1.5">
                      <span className="text-gray-700">Burger Buns</span>
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">Low Stock</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Tasks Section */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Open Tasks</h3>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-24">Task ID</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead className="w-32">Owner</TableHead>
                      <TableHead className="w-32">Due</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs">{task.id}</TableCell>
                        <TableCell className="font-medium">{task.task}</TableCell>
                        <TableCell className="text-sm">{task.owner}</TableCell>
                        <TableCell className={task.status === "Overdue" ? "text-red-600 font-medium" : ""}>
                          {task.due}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.status === "In Progress" ? "default" :
                              task.status === "Overdue" ? "destructive" :
                              "secondary"
                            }
                            className="text-xs"
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Inventory Alerts Section */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Inventory Alerts</h3>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Item</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="w-32">On Hand</TableHead>
                      <TableHead className="w-32">Reorder Level</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryAlerts.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.location}</TableCell>
                        <TableCell className="font-medium">{item.onHand}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.reorderLevel}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "Critical" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavGroup({
  label,
  expanded,
  onToggle,
  children
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors text-gray-700 hover:bg-gray-100"
      >
        <span className="font-medium">{label}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>
      {expanded && <div className="mt-0.5">{children}</div>}
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  child = false
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  child?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-2 py-2 rounded text-sm transition-colors relative ${
        child ? "pl-8 pr-3" : "px-3"
      } ${
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 rounded-r" />}
      {icon}
      <span>{label}</span>
    </button>
  );
}

function KPICard({
  label,
  value,
  trend
}: {
  label: string;
  value: string;
  trend?: "positive" | "negative" | "warning"
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 h-[72px] flex flex-col justify-between">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-lg font-semibold text-gray-900">{value}</div>
        {trend === "positive" && <TrendingUp className="w-4 h-4 text-green-600" />}
        {trend === "warning" && <AlertTriangle className="w-4 h-4 text-orange-600" />}
      </div>
    </div>
  );
}

function HealthItem({
  label,
  status,
  variant
}: {
  label: string;
  status: string;
  variant: "success" | "warning" | "error"
}) {
  const colors = {
    success: "text-green-700 bg-green-50",
    warning: "text-orange-700 bg-orange-50",
    error: "text-red-700 bg-red-50"
  };

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-700">{label}</span>
      <span className={`px-2 py-0.5 rounded ${colors[variant]}`}>{status}</span>
    </div>
  );
}

function ActionItem({
  icon,
  text,
  variant,
  severity
}: {
  icon: React.ReactNode;
  text: string;
  variant: "error" | "warning" | "info" | "default";
  severity: string;
}) {
  const severityColors = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-blue-100 text-blue-700",
    Low: "bg-gray-100 text-gray-700"
  };

  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="flex items-start gap-2">
          <span className="text-gray-700 flex-1">{text}</span>
          <Badge
            variant="outline"
            className={`text-xs h-5 ${severityColors[severity as keyof typeof severityColors]}`}
          >
            {severity}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ time, text }: { time: string; text: string }) {
  return (
    <div className="flex gap-3 relative">
      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 z-10"></div>
      <div className="flex-1 -ml-1">
        <div className="text-xs text-gray-500 mb-0.5">{time}</div>
        <div className="text-sm text-gray-700">{text}</div>
      </div>
    </div>
  );
}