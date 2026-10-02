export type NavItem = { label: string; path: string; module: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", path: "dashboard", module: "Dashboard" },
      { label: "Reports", path: "reports", module: "Reports" },
    ],
  },
  {
    label: "SALES",
    items: [
      { label: "Orders", path: "orders", module: "Orders" },
      { label: "Quotes", path: "quotes", module: "Quotes" },
      { label: "Payments", path: "payments", module: "Payments" },
      { label: "Invoices", path: "invoices", module: "Invoices" },
      { label: "Customers", path: "customers", module: "Customers" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Installations", path: "installations", module: "Installations" },
      { label: "Returns and repairs", path: "repairs", module: "Returns and repairs" },
      { label: "Site surveys", path: "surveys", module: "Site surveys" },
      { label: "Inventory", path: "inventory", module: "Inventory" },
      { label: "Suppliers and POs", path: "suppliers", module: "Suppliers and POs" },
      { label: "Engineer app", path: "engineer", module: "Installations" },
    ],
  },
  {
    label: "CATALOGUE",
    items: [
      { label: "Products", path: "products", module: "Products" },
      { label: "Categories", path: "categories", module: "Categories" },
      { label: "Kits", path: "kits", module: "Kits" },
      { label: "Bulk upload", path: "bulk", module: "Bulk upload" },
      { label: "Discounts", path: "discounts", module: "Discounts" },
    ],
  },
  {
    label: "STOREFRONT",
    items: [
      { label: "Content", path: "content", module: "Content" },
      { label: "Reviews", path: "reviews", module: "Reviews" },
      { label: "Delivery zones", path: "zones", module: "Delivery zones" },
      { label: "Notifications", path: "notifications", module: "Notifications" },
    ],
  },
  {
    label: "PEOPLE",
    items: [
      { label: "Business accounts", path: "accounts", module: "Business accounts" },
      { label: "Enquiries", path: "enquiries", module: "Enquiries" },
      { label: "Staff and roles", path: "staff", module: "Staff and roles" },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ label: "Settings", path: "settings", module: "Settings" }],
  },
];
