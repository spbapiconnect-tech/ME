export interface ErpBranchRecord {
  id: string;
  branchCode: string;
  branchName: string;
  region: string;
  manager: string;
  status: string;
  todaySales: string;
  openTasks: number;
  stockAlerts: number;
  inspection: string;
  lastUpdate: string;
  businessHours: string;
  phone: string;
  address: string;
  staffToday: string;
  currentShift: string;
  lastInspection: string;
  inventoryReview: string;
  detailHref: string;
}

export const erpBranchRecords: ErpBranchRecord[] = [
  {
    id: "KCH-001",
    branchCode: "KCH-001",
    branchName: "KCH Central Kitchen",
    region: "Kuching",
    manager: "Chin Ling",
    status: "Operating",
    todaySales: "RM 28,750",
    openTasks: 5,
    stockAlerts: 2,
    inspection: "94%",
    lastUpdate: "10:15",
    businessHours: "10:00-00:00",
    phone: "082-000 123",
    address: "Kuching Central, Sarawak",
    staffToday: "18",
    currentShift: "Day / Night transition",
    lastInspection: "2026-05-06",
    inventoryReview: "4 alerts",
    detailHref: "/branches/KCH-001",
  },
  {
    id: "BTU-001",
    branchCode: "BTU-001",
    branchName: "BTU Outlet",
    region: "Bintulu",
    manager: "Morexson",
    status: "Operating",
    todaySales: "RM 18,420",
    openTasks: 4,
    stockAlerts: 1,
    inspection: "91%",
    lastUpdate: "09:45",
    businessHours: "10:00-22:00",
    phone: "086-111 222",
    address: "Bintulu Times Square",
    staffToday: "12",
    currentShift: "Lunch / Dinner",
    lastInspection: "2026-05-06",
    inventoryReview: "2 alerts",
    detailHref: "/branches/BTU-001",
  },
  {
    id: "KCH-002",
    branchCode: "KCH-002",
    branchName: "KCH Pickup Point",
    region: "Kuching",
    manager: "Lydia",
    status: "Preparation",
    todaySales: "RM 6,880",
    openTasks: 2,
    stockAlerts: 1,
    inspection: "88%",
    lastUpdate: "08:30",
    businessHours: "11:00-21:30",
    phone: "082-222 333",
    address: "Kuching Pickup Hub",
    staffToday: "6",
    currentShift: "Preparation / Evening",
    lastInspection: "2026-05-05",
    inventoryReview: "1 alert",
    detailHref: "/branches/KCH-002",
  },
  {
    id: "HQ-001",
    branchCode: "HQ-001",
    branchName: "Head Office",
    region: "HQ",
    manager: "Admin",
    status: "Active",
    todaySales: "-",
    openTasks: 1,
    stockAlerts: 0,
    inspection: "-",
    lastUpdate: "Yesterday",
    businessHours: "09:00-18:00",
    phone: "082-999 000",
    address: "HQ Operations Center",
    staffToday: "9",
    currentShift: "Office Hours",
    lastInspection: "-",
    inventoryReview: "0 alerts",
    detailHref: "/branches/HQ-001",
  },
];

export const erpBranchOpenTasks = [
  { id: "TSK-2301", task: "Opening checklist", owner: "Zhang", due: "Today 11:00", status: "In Progress" },
  { id: "TSK-2298", task: "Fridge temp check", owner: "Chin Ling", due: "Today 14:00", status: "Pending" },
  { id: "TSK-2285", task: "Shift handover", owner: "Lydia", due: "Overdue", status: "Overdue" },
];

export const erpBranchInventoryAlerts = [
  { id: "inv-fries", item: "French Fries", branch: "KCH Central Kitchen", onHand: "8 kg", safetyStock: "15 kg", status: "Low Stock" },
  { id: "inv-sauce", item: "Tomato Sauce", branch: "KCH Central Kitchen", onHand: "3 bottles", safetyStock: "10 bottles", status: "Critical" },
  { id: "inv-wings", item: "Chicken Wings", branch: "BTU Outlet", onHand: "12 kg", safetyStock: "20 kg", status: "Low Stock" },
  { id: "inv-buns", item: "Burger Buns", branch: "KCH Pickup Point", onHand: "15 pcs", safetyStock: "50 pcs", status: "Low Stock" },
];
