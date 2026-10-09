/** Admin modules, ids and copy exactly as "DSource Admin v3.dc.html".
 * Each id is a route: /admin/<id>. `module` is the role_permissions module
 * name the backend enforces for that page's API calls. */
export type NavItem = { id: string; label: string; module: string; badge?: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  { label: "OVERVIEW", items: [{ id: "dash", label: "Dashboard", module: "Dashboard" }, { id: "reports", label: "Reports", module: "Reports" }] },
  {
    label: "SALES",
    items: [
      { id: "orders", label: "Orders", module: "Orders", badge: "orders" },
      { id: "quotes", label: "Quotes", module: "Quotes", badge: "quotes" },
      { id: "payments", label: "Payments", module: "Payments", badge: "payments" },
      { id: "invoices", label: "Invoices", module: "Invoices", badge: "invoices" },
      { id: "customers", label: "Customers", module: "Customers" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { id: "schedule", label: "Installations", module: "Installations", badge: "unassigned" },
      { id: "returns", label: "Returns", module: "Returns and repairs", badge: "returns" },
      { id: "repairs", label: "Repairs", module: "Returns and repairs", badge: "repairs" },
      { id: "surveys", label: "Site surveys", module: "Site surveys", badge: "surveys" },
      { id: "inventory", label: "Inventory", module: "Inventory", badge: "inventory" },
      { id: "suppliers", label: "Suppliers and POs", module: "Suppliers and POs" },
      { id: "engineer", label: "Engineer app", module: "Installations" },
    ],
  },
  {
    label: "CATALOGUE",
    items: [
      { id: "products", label: "Products", module: "Products" },
      { id: "cats", label: "Categories", module: "Categories" },
      { id: "kits", label: "Kits", module: "Kits" },
      { id: "bulk", label: "Bulk upload", module: "Bulk upload" },
      { id: "discounts", label: "Discounts", module: "Discounts" },
    ],
  },
  {
    label: "STOREFRONT",
    items: [
      { id: "content", label: "Content", module: "Content" },
      { id: "reviews", label: "Reviews", module: "Reviews", badge: "reviews" },
      { id: "zones", label: "Delivery zones", module: "Delivery zones" },
      { id: "notify", label: "Notifications", module: "Notifications" },
    ],
  },
  {
    label: "PEOPLE",
    items: [
      { id: "accounts", label: "Business accounts", module: "Business accounts", badge: "accounts" },
      { id: "enquiries", label: "Requests", module: "Enquiries", badge: "enquiries" },
      { id: "roles", label: "Staff and roles", module: "Staff and roles" },
    ],
  },
  { label: "SYSTEM", items: [{ id: "settings", label: "Settings", module: "Settings" }] },
];

/** Header title and subtitle per module (the prototype's T map, verbatim). */
export const TITLES: Record<string, [string, string]> = {
  reports: ["Reports", "Sample data until the order system is connected"],
  payments: ["Payments", "Confirm transfers and pay on delivery, refund when needed"],
  invoices: ["Invoices", "Business accounts on 30-day invoice"],
  customers: ["Customers", "Everyone who has bought, quoted or applied"],
  schedule: ["Installations", "Engineer calendar for set-ups, surveys and collections"],
  repairs: ["Repairs", "Collect, diagnose, quote before any work, approval, fix, return"],
  returns: ["Returns and inspections", "7-day returns and items that fail inspection at the door"],
  inventory: ["Inventory", "Stock on hand, reserved, and reorder levels"],
  suppliers: ["Suppliers and POs", "Where stock comes from"],
  engineer: ["Engineer app", "What engineers see on their phones"],
  kits: ["Kits", "Place kits on the storefront"],
  bulk: ["Bulk upload", "Add or update products from a spreadsheet"],
  discounts: ["Discounts", "Only for real offers"],
  content: ["Content", "Front page words, best sellers and help text"],
  zones: ["Delivery zones", "Fees, times and pay on delivery by zone"],
  notify: ["Notifications", "Messages to customers and alerts to staff"],
  roles: ["Staff and roles", "Who can see and change what"],
  dash: ["Dashboard", "What needs you today"],
  orders: ["Orders", "Personal and business orders, from Ordered to Delivered"],
  quotes: ["Quotes", "Reply within 24 hours"],
  products: ["Products", "One catalogue: condition, grade and Buy now or Quote"],
  cats: ["Categories", "What customers see in the category bar"],
  reviews: ["Reviews", "Check each review against a real purchase"],
  accounts: ["Business accounts", "Approve accounts for 30-day invoice"],
  surveys: ["Site surveys", "Free surveys booked from the storefront"],
  enquiries: ["Requests", "Sourcing requests (1 hour, 8am–8pm), business requests (24 hours), returns and repairs"],
  settings: ["Settings", "Delivery, payment, policies and contact details"],
};

export const searchPlaceholder = (id: string) => (id === "products" ? "Search products…" : id === "orders" ? "Search orders, customers…" : "Search…");

export const moduleFor = (id: string) => NAV.flatMap((g) => g.items).find((i) => i.id === id)?.module;
