import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ClipboardList,
  Download,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Printer,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · SiteInventory" },
      { name: "description", content: "Manage construction stock, inward purchases, requisitions, reports, and site users." },
      { property: "og:title", content: "Dashboard · SiteInventory" },
      { property: "og:description", content: "Manage construction stock, inward purchases, requisitions, reports, and site users." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  component: InventoryApp,
});

type View = "dashboard" | "purchase" | "stock" | "items" | "categories" | "vendors" | "requisition" | "history" | "stock-report" | "transactions" | "users" | "roles";
type Status = "In Stock" | "Low Stock" | "Out of Stock";

const navGroups: { label: string; items: { id: View; label: string; icon: typeof LayoutDashboard }[] }[] = [
  { label: "Workspace", items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Inventory", items: [
    { id: "purchase", label: "Purchase / Inward", icon: ShoppingCart },
    { id: "stock", label: "Stock", icon: Package },
    { id: "items", label: "Items", icon: ClipboardList },
    { id: "categories", label: "Categories", icon: SlidersHorizontal },
    { id: "vendors", label: "Vendors", icon: Truck },
  ] },
  { label: "Outward", items: [
    { id: "requisition", label: "New Requisition", icon: ArrowUpFromLine },
    { id: "history", label: "Requisition History", icon: ClipboardList },
  ] },
  { label: "Reports", items: [
    { id: "stock-report", label: "Stock Report", icon: BarChart3 },
    { id: "transactions", label: "Stock Transactions", icon: ArrowDownToLine },
  ] },
  { label: "Administration", items: [
    { id: "users", label: "Users", icon: Users },
    { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  ] },
];

const stockItems = [
  { item: "OPC Cement 43", category: "Cement", unit: "bags", inward: 1200, outward: 962, available: 238, minimum: 300, rate: 420 },
  { item: "TMT Steel 12mm", category: "Steel", unit: "kg", inward: 8400, outward: 6930, available: 1470, minimum: 2000, rate: 68 },
  { item: "TMT Steel 16mm", category: "Steel", unit: "kg", inward: 7600, outward: 7580, available: 20, minimum: 600, rate: 72 },
  { item: "Glossy Tiles 600mm", category: "Tiles", unit: "box", inward: 620, outward: 310, available: 310, minimum: 120, rate: 1200 },
  { item: "PVC Pipe 1 inch", category: "Plumbing", unit: "pcs", inward: 800, outward: 776, available: 24, minimum: 150, rate: 155 },
  { item: "LED Bulb 9W", category: "Electrical", unit: "pcs", inward: 500, outward: 440, available: 60, minimum: 250, rate: 92 },
  { item: "Copper Wire 2.5 sqmm", category: "Electrical", unit: "rolls", inward: 180, outward: 76, available: 104, minimum: 40, rate: 3100 },
  { item: "Anchor Fastener 10mm", category: "Hardware", unit: "boxes", inward: 160, outward: 140, available: 20, minimum: 25, rate: 680 },
];

const transactions = [
  { date: "24 Mar", id: "TXN-240324-018", type: "Inward", item: "OPC Cement 43", quantity: "+500 bags", block: "Central", flat: "Store", user: "Arjun Mehta", ref: "PO-240324-09" },
  { date: "24 Mar", id: "TXN-240324-017", type: "Outward", item: "TMT Steel 12mm", quantity: "-80 kg", block: "B", flat: "402", user: "Ravi Kumar", ref: "REQ-240324-05" },
  { date: "23 Mar", id: "TXN-240323-016", type: "Outward", item: "Glossy Tiles 600mm", quantity: "-45 box", block: "C", flat: "214", user: "Priya Nair", ref: "REQ-240323-11" },
  { date: "23 Mar", id: "TXN-240323-015", type: "Inward", item: "PVC Pipe 1 inch", quantity: "+120 pcs", block: "Central", flat: "Store", user: "Arjun Mehta", ref: "PO-240323-06" },
  { date: "22 Mar", id: "TXN-240322-014", type: "Outward", item: "LED Bulb 9W", quantity: "-30 pcs", block: "A", flat: "118", user: "Suresh Iyer", ref: "REQ-240322-03" },
];

const purchases = [
  { id: "PO-240324-09", invoice: "INV/KA/0931", vendor: "Bharat Cement Co.", item: "OPC Cement 43", category: "Cement", quantity: "500 bags", rate: "₹420", total: "₹2,10,000", date: "24 Mar 2024", attachment: "invoice.pdf" },
  { id: "PO-240323-06", invoice: "INV/PL/1028", vendor: "Prime Pipe Traders", item: "PVC Pipe 1 inch", category: "Plumbing", quantity: "120 pcs", rate: "₹155", total: "₹18,600", date: "23 Mar 2024", attachment: "bill.jpg" },
  { id: "PO-240320-04", invoice: "INV/EL/7712", vendor: "Voltline Electricals", item: "LED Bulb 9W", category: "Electrical", quantity: "250 pcs", rate: "₹92", total: "₹23,000", date: "20 Mar 2024", attachment: "invoice.pdf" },
  { id: "PO-240318-02", invoice: "INV/SS/4410", vendor: "Shree Steel Depot", item: "TMT Steel 16mm", category: "Steel", quantity: "1,200 kg", rate: "₹72", total: "₹86,400", date: "18 Mar 2024", attachment: "challan.pdf" },
];

const requisitions = [
  { id: "REQ-240324-05", block: "B", flat: "402", requestedBy: "Ravi Kumar", items: "TMT Steel 12mm", quantity: "80 kg", date: "24 Mar 2024", status: "Pending" },
  { id: "REQ-240323-11", block: "C", flat: "214", requestedBy: "Priya Nair", items: "Glossy Tiles 600mm", quantity: "45 box", date: "23 Mar 2024", status: "Issued" },
  { id: "REQ-240322-08", block: "A", flat: "118", requestedBy: "Suresh Iyer", items: "LED Bulb 9W, Wire", quantity: "30 pcs", date: "22 Mar 2024", status: "Approved" },
  { id: "REQ-240321-04", block: "B", flat: "206", requestedBy: "Neha Shah", items: "PVC Pipe 1 inch", quantity: "180 pcs", date: "21 Mar 2024", status: "Rejected" },
];

const usersSeed = [
  { name: "Arjun Mehta", email: "arjun.mehta@pinnacle.in", phone: "+91 98765 43210", role: "Admin", site: "Tower B", status: "Active", lastLogin: "Today, 09:42" },
  { name: "Ravi Kumar", email: "ravi.kumar@pinnacle.in", phone: "+91 99887 22110", role: "Site Engineer", site: "Block B", status: "Active", lastLogin: "Today, 08:15" },
  { name: "Priya Nair", email: "priya.nair@pinnacle.in", phone: "+91 98220 11223", role: "Project Manager", site: "Tower A", status: "Active", lastLogin: "Yesterday" },
  { name: "Suresh Iyer", email: "suresh.iyer@pinnacle.in", phone: "+91 97654 77889", role: "Store Manager", site: "Central Store", status: "Inactive", lastLogin: "18 Mar 2024" },
];

function InventoryApp() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<(typeof stockItems)[number] | null>(null);
  const [users, setUsers] = useState(usersSeed);
  const [userOpen, setUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<(typeof usersSeed)[number] | null>(null);
  const [requisitionOpen, setRequisitionOpen] = useState(false);

  const setActiveView = (next: View) => {
    setView(next);
    setSidebarOpen(false);
    setSearch("");
  };

  const pageTitle = navGroups.flatMap((group) => group.items).find((item) => item.id === view)?.label ?? "Dashboard";

  return (
    <div className="app-aurora min-h-screen bg-app text-foreground">
      <Sidebar view={view} onNavigate={setActiveView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-h-screen lg:pl-64">
        <header className="app-glass sticky top-0 z-30 flex h-16 items-center gap-3 border-x-0 border-t-0 px-4 sm:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu /></Button>
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items, vendors, requisitions…" className="h-10 border-edge bg-foreground/[0.04] pl-9 text-sm" />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button className="hidden bg-gradient-to-br from-brand to-brand-strong text-brand-foreground shadow-lg shadow-brand/20 hover:from-brand hover:to-brand-strong sm:flex" onClick={() => setPurchaseOpen(true)}><Plus /> New Purchase</Button>
            <Button variant="ghost" size="icon" className="relative border border-edge" aria-label="Notifications" onClick={() => toast("You’re all caught up", { description: "No new store alerts." })}><Bell /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand" /></Button>
          </div>
        </header>
        <div className="app-gridline min-h-[calc(100vh-4rem)] p-4 sm:p-8">
          <div className="mx-auto max-w-[1480px] space-y-6">
            <PageHeader title={pageTitle} view={view} onAddPurchase={() => setPurchaseOpen(true)} onNewRequisition={() => setRequisitionOpen(true)} />
            {view === "dashboard" && <Dashboard onNavigate={setActiveView} onSelectStock={setSelectedStock} />}
            {view === "purchase" && <PurchasePage search={search} onAdd={() => setPurchaseOpen(true)} />}
            {view === "stock" && <StockPage search={search} onSelect={setSelectedStock} />}
            {view === "items" && <ItemsPage search={search} onAdd={() => toast.success("Item form opened", { description: "Mock item creation is ready for the next step." })} />}
            {view === "categories" && <CategoriesPage />}
            {view === "vendors" && <VendorsPage />}
            {view === "requisition" && <RequisitionPage onSubmit={() => toast.success("Requisition submitted", { description: "REQ-240325-01 is waiting for approval." })} />}
            {view === "history" && <HistoryPage />}
            {view === "stock-report" && <StockReportPage />}
            {view === "transactions" && <TransactionsPage search={search} />}
            {view === "users" && <UsersPage users={users} onAdd={() => { setEditingUser(null); setUserOpen(true); }} onEdit={(user) => { setEditingUser(user); setUserOpen(true); }} onToggle={(name) => { setUsers((current) => current.map((user) => user.name === name ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user)); toast.success("User status updated"); }} />}
            {view === "roles" && <RolesPage />}
          </div>
        </div>
      </main>
      <PurchaseModal open={purchaseOpen} onOpenChange={setPurchaseOpen} />
      <StockDetails stock={selectedStock} onClose={() => setSelectedStock(null)} />
      <UserModal open={userOpen} onOpenChange={setUserOpen} user={editingUser} onSave={(user) => { setUsers((current) => editingUser ? current.map((entry) => entry.name === editingUser.name ? user : entry) : [user, ...current]); setUserOpen(false); toast.success(editingUser ? "User updated" : "User added"); }} />
      <RequisitionModal open={requisitionOpen} onOpenChange={setRequisitionOpen} />
    </div>
  );
}

function Sidebar({ view, onNavigate, open, onClose }: { view: View; onNavigate: (view: View) => void; open: boolean; onClose: () => void }) {
  return <>
    {open && <Button variant="ghost" className="fixed inset-0 z-40 h-full w-full rounded-none bg-app/70 lg:hidden" onClick={onClose} aria-label="Close navigation" />}
    <aside className={cn("app-glass fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col border-y-0 border-l-0 bg-sidebar/95 text-sidebar-foreground transition-transform lg:translate-x-0", open && "translate-x-0")}>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-strong shadow-lg shadow-brand/20"><Building2 className="size-4 text-brand-foreground" /></div>
        <div className="min-w-0 leading-tight"><p className="font-display text-sm font-semibold tracking-tight text-sidebar-foreground">SiteInventory</p><p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Constructor</p></div>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={onClose} aria-label="Close navigation"><X /></Button>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => <div key={group.label} className="space-y-1">
          <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{group.label}</p>
          {group.items.map((item) => { const Icon = item.icon; return <Button key={item.id} variant="ghost" onClick={() => onNavigate(item.id)} className={cn("h-9 w-full justify-start gap-3 px-3 text-sm font-normal text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", view === item.id && "border border-brand/25 bg-brand/10 font-medium text-brand") }><Icon className="size-4" />{item.label}</Button>; })}
        </div>)}
      </nav>
      <div className="border-t border-sidebar-border p-3"><div className="flex items-center gap-3 rounded-lg px-3 py-2"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/15 text-xs font-semibold text-brand">AM</div><div className="min-w-0"><p className="truncate text-sm font-medium text-sidebar-foreground">Arjun Mehta</p><p className="truncate text-[11px] text-muted-foreground">Store Manager</p></div><Button variant="ghost" size="icon" className="ml-auto" aria-label="User settings" onClick={() => toast("Profile menu", { description: "Arjun Mehta · Store Manager" })}><Settings2 /></Button></div></div>
    </aside>
  </>;
}

function PageHeader({ title, view, onAddPurchase, onNewRequisition }: { title: string; view: View; onAddPurchase: () => void; onNewRequisition: () => void }) {
  return <div className="flex flex-wrap items-end justify-between gap-4">
    <div><p className="text-[11px] uppercase tracking-[0.25em] text-brand">Tower B · Pinnacle Residency</p><h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1><p className="mt-1 text-sm text-muted-foreground">Monday, 25 March 2024 · Central site store</p></div>
    <div className="flex gap-2">{view === "dashboard" && <><Button variant="outline" className="border-edge bg-panel/40" onClick={() => toast.success("Dashboard exported", { description: "CSV export prepared." })}><Download /> Export</Button><Button variant="outline" className="border-edge bg-panel/40" onClick={() => window.print()}><Printer /> Print</Button></>}{view === "purchase" && <Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={onAddPurchase}><Plus /> Add Purchase</Button>}{view === "requisition" && <Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={onNewRequisition}><Plus /> Quick Requisition</Button>}</div>
  </div>;
}

function Dashboard({ onNavigate, onSelectStock }: { onNavigate: (view: View) => void; onSelectStock: (stock: (typeof stockItems)[number]) => void }) {
  return <>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">{[
      ["Total Items", "1,284", "▲ 3.2% this week", "text-success", ClipboardList], ["Available Stock", "38,420", "units on hand", "text-muted-foreground", Package], ["Total Purchase", "₹42.6L", "▲ 12 invoices", "text-success", ShoppingCart], ["Total Outward", "₹28.1L", "issued to 6 blocks", "text-muted-foreground", ArrowUpFromLine], ["Low Stock", "7", "needs reorder", "text-warning", AlertTriangle], ["Pending Reqs", "5", "awaiting approval", "text-muted-foreground", ClipboardList],
    ].map(([label, value, sub, color, Icon]) => <div key={String(label)} className={cn("app-glass rounded-xl p-4", label === "Low Stock" && "ring-1 ring-brand/30")}><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{label}</p><Icon className={cn("size-4", color as string)} /></div><p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p><p className={cn("mt-1 text-[11px]", color as string)}>{sub}</p></div>)}</div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartCard />
      <LowStock onViewAll={() => onNavigate("stock")} onSelectStock={onSelectStock} />
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TransactionTable compact onViewAll={() => onNavigate("transactions")} />
      <QuickActions onNavigate={onNavigate} />
    </div>
  </>;
}

function ChartCard() {
  const bars = [[55, 38], [72, 52], [47, 62], [88, 70], [67, 78], [96, 59]];
  return <section className="app-glass rounded-xl p-5 lg:col-span-2"><div className="flex items-start justify-between"><div><h2 className="font-display font-semibold text-foreground">Inward vs Outward</h2><p className="mt-0.5 text-xs text-muted-foreground">Last 6 months · units moved</p></div><div className="flex items-center gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brand" />Inward</span><span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-foreground/25" />Outward</span></div></div><div className="mt-6 flex h-52 items-end gap-3 sm:gap-5">{bars.map(([inward, outward], index) => <div className="flex flex-1 flex-col items-center" key={index}><div className="flex h-40 w-full items-end gap-1"><div className="bar-brand flex-1 rounded-t" style={{ height: `${inward}%` }} /><div className="flex-1 rounded-t bg-foreground/20" style={{ height: `${outward}%` }} /></div><span className="mt-2 text-[10px] text-muted-foreground">{["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][index]}</span></div>)}</div></section>;
}

function LowStock({ onViewAll, onSelectStock }: { onViewAll: () => void; onSelectStock: (stock: (typeof stockItems)[number]) => void }) {
  const low = stockItems.filter((item) => item.available <= item.minimum).slice(0, 5);
  return <section className="app-glass rounded-xl p-5"><div className="flex items-center justify-between"><h2 className="font-display font-semibold text-foreground">Low Stock</h2><Badge className="border-danger/20 bg-danger/15 text-danger">{low.length} items</Badge></div><div className="mt-4 space-y-3">{low.map((item) => <Button variant="ghost" key={item.item} onClick={() => onSelectStock(item)} className="h-auto w-full justify-between rounded-lg px-0 py-1 text-left hover:bg-transparent"><span><span className="block text-sm text-foreground">{item.item}</span><span className="block text-[11px] text-muted-foreground">{item.category} · {item.available} / {item.minimum} {item.unit}</span></span><span className={cn("text-xs font-medium", item.available < item.minimum / 2 ? "text-danger" : "text-warning")}>{item.available < item.minimum / 2 ? "Critical" : "Reorder"}</span></Button>)}</div><Button variant="outline" className="mt-4 h-10 w-full border-edge bg-panel/40 text-muted-foreground" onClick={onViewAll}>View all low stock</Button></section>;
}

function TransactionTable({ compact = false, onViewAll }: { compact?: boolean; onViewAll?: () => void }) {
  return <section className="app-glass overflow-hidden rounded-xl lg:col-span-2"><div className="flex items-center justify-between border-b border-edge-soft px-5 py-4"><div><h2 className="font-display font-semibold text-foreground">Recent Transactions</h2><p className="mt-0.5 text-xs text-muted-foreground">Latest inward & outward movements</p></div>{onViewAll && <Button variant="outline" size="sm" className="border-edge bg-panel/40 text-muted-foreground" onClick={onViewAll}>All transactions</Button>}</div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b border-edge-soft text-[11px] uppercase tracking-wider text-muted-foreground"><th className="px-5 py-3 text-left font-medium">Date</th><th className="px-5 py-3 text-left font-medium">Type</th><th className="px-5 py-3 text-left font-medium">Item</th><th className="px-5 py-3 text-right font-medium">Qty</th><th className="px-5 py-3 text-left font-medium">Block · Flat</th><th className="px-5 py-3 text-left font-medium">User</th></tr></thead><tbody className="divide-y divide-edge-soft">{transactions.slice(0, compact ? 5 : transactions.length).map((txn) => <tr key={txn.id} className="hover:bg-foreground/[0.03]"><td className="px-5 py-3 text-muted-foreground">{txn.date}</td><td className="px-5 py-3"><Badge className={cn("border", txn.type === "Inward" ? "border-success/20 bg-success/15 text-success" : "border-brand/20 bg-brand/10 text-brand")}>{txn.type}</Badge></td><td className="px-5 py-3 text-foreground">{txn.item}</td><td className={cn("px-5 py-3 text-right font-medium", txn.type === "Inward" ? "text-success" : "text-brand")}>{txn.quantity}</td><td className="px-5 py-3 text-muted-foreground">{txn.block} · {txn.flat}</td><td className="px-5 py-3 text-muted-foreground">{txn.user}</td></tr>)}</tbody></table></div></section>;
}

function QuickActions({ onNavigate }: { onNavigate: (view: View) => void }) {
  return <section className="app-glass rounded-xl p-5"><h2 className="font-display font-semibold text-foreground">Quick Actions</h2><div className="mt-4 space-y-2"><Button className="h-11 w-full justify-start bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={() => onNavigate("requisition")}><ArrowUpFromLine /> New Requisition</Button><Button variant="outline" className="h-11 w-full justify-start border-edge bg-panel/40" onClick={() => onNavigate("purchase")}><Plus /> Add Purchase / Inward</Button><Button variant="outline" className="h-11 w-full justify-start border-edge bg-panel/40" onClick={() => onNavigate("stock-report")}><BarChart3 /> Generate Stock Report</Button><Button variant="outline" className="h-11 w-full justify-start border-edge bg-panel/40" onClick={() => onNavigate("users")}><Users /> Manage Users</Button></div><div className="mt-4 rounded-lg bg-sidebar p-3.5"><p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Site store</p><p className="mt-1 text-sm font-medium text-sidebar-foreground">Bin 04 · Cement · 62% full</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10"><div className="h-full w-[62%] rounded-full bg-brand" /></div></div></section>;
}

function SectionShell({ title, description, actions, children }: { title: string; description: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return <section className="app-glass overflow-hidden rounded-xl"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge-soft px-5 py-4"><div><h2 className="font-display font-semibold text-foreground">{title}</h2><p className="mt-0.5 text-xs text-muted-foreground">{description}</p></div>{actions}</div>{children}</section>;
}

function TableToolbar({ searchPlaceholder, filter = true }: { searchPlaceholder: string; filter?: boolean }) { return <div className="flex flex-wrap gap-2 border-b border-edge-soft p-4"><div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder={searchPlaceholder} className="border-edge bg-foreground/[0.04] pl-9" /></div>{filter && <><Button variant="outline" className="border-edge bg-panel/40"><Filter /> Filters</Button><Select defaultValue="all"><SelectTrigger className="w-[150px] border-edge bg-panel/40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent></Select></>}</div>; }

function PurchasePage({ search, onAdd }: { search: string; onAdd: () => void }) {
  const list = purchases.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(search.toLowerCase())));
  return <SectionShell title="Purchase / Inward" description="Record incoming materials, vendor invoices, and evidence attachments." actions={<Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={onAdd}><Plus /> Add Purchase</Button>}><TableToolbar searchPlaceholder="Search purchase, invoice, vendor…" /><DataTable headers={["Purchase ID", "Invoice", "Vendor", "Item", "Category", "Quantity", "Rate", "Total", "Date", "Attachment", "Actions"]}>{list.map((row) => <tr key={row.id} className="hover:bg-foreground/[0.03]"><Td strong>{row.id}</Td><Td>{row.invoice}</Td><Td>{row.vendor}</Td><Td>{row.item}</Td><Td><Badge variant="secondary">{row.category}</Badge></Td><Td>{row.quantity}</Td><Td>{row.rate}</Td><Td strong>{row.total}</Td><Td muted>{row.date}</Td><Td><Button variant="link" size="sm" className="h-auto p-0 text-brand" onClick={() => toast("Attachment preview", { description: row.attachment })}><FileText />{row.attachment}</Button></Td><Td><Button variant="ghost" size="icon" aria-label={`More actions for ${row.id}`} onClick={() => toast("Purchase actions", { description: `${row.id} · edit or delete` })}><MoreHorizontal /></Button></Td></tr>)}</DataTable></SectionShell>;
}

function StockPage({ search, onSelect }: { search: string; onSelect: (stock: (typeof stockItems)[number]) => void }) {
  const list = stockItems.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(search.toLowerCase())));
  return <SectionShell title="Current Stock" description="Click any item to inspect available quantity and recent movements." actions={<Button variant="outline" className="border-edge bg-panel/40" onClick={() => toast.success("Stock report exported") }><Download /> Export CSV</Button>}><TableToolbar searchPlaceholder="Search item or category…" /><DataTable headers={["Item", "Category", "Unit", "Inward", "Outward", "Available Stock", "Minimum Stock", "Status"]}>{list.map((row) => <tr key={row.item} className="cursor-pointer hover:bg-foreground/[0.04]" onClick={() => onSelect(row)}><Td><Button variant="link" className="h-auto p-0 text-left font-medium text-foreground hover:text-brand">{row.item}</Button></Td><Td><Badge variant="secondary">{row.category}</Badge></Td><Td>{row.unit}</Td><Td>{row.inward.toLocaleString()}</Td><Td>{row.outward.toLocaleString()}</Td><Td strong>{row.available.toLocaleString()}</Td><Td muted>{row.minimum.toLocaleString()}</Td><Td><StatusBadge status={stockStatus(row)} /></Td></tr>)}</DataTable></SectionShell>;
}

function ItemsPage({ search, onAdd }: { search: string; onAdd: () => void }) { const items = stockItems.filter((item) => item.item.toLowerCase().includes(search.toLowerCase())); return <SectionShell title="Items" description="Manage item names, categories, units, and reorder thresholds." actions={<Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={onAdd}><Plus /> Add Item</Button>}><DataTable headers={["Item", "Category", "Unit", "Minimum Stock", "Rate", "Updated", "Actions"]}>{items.map((item) => <tr key={item.item} className="hover:bg-foreground/[0.03]"><Td strong>{item.item}</Td><Td><Badge variant="secondary">{item.category}</Badge></Td><Td>{item.unit}</Td><Td>{item.minimum}</Td><Td>₹{item.rate.toLocaleString("en-IN")}</Td><Td muted>24 Mar 2024</Td><Td><Button variant="ghost" size="icon" aria-label={`Edit ${item.item}`} onClick={onAdd}><Pencil /></Button></Td></tr>)}</DataTable></SectionShell>; }

function CategoriesPage() { const categories = [{ name: "Cement", count: 18, value: "₹8.4L", updated: "Today" }, { name: "Steel", count: 24, value: "₹18.2L", updated: "Yesterday" }, { name: "Tiles", count: 32, value: "₹6.1L", updated: "21 Mar" }, { name: "Electrical", count: 46, value: "₹4.8L", updated: "20 Mar" }, { name: "Plumbing", count: 28, value: "₹3.7L", updated: "19 Mar" }, { name: "Hardware", count: 54, value: "₹2.2L", updated: "18 Mar" }]; return <SectionShell title="Categories" description="Six material groups keep the site store easy to scan." actions={<Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={() => toast.success("Category form opened")}><Plus /> Add Category</Button>}><div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">{categories.map((category, index) => <div key={category.name} className="rounded-xl border border-edge-soft bg-panel-muted/60 p-4"><div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand"><Package /></div><Button variant="ghost" size="icon" aria-label={`Edit ${category.name}`} onClick={() => toast(`${category.name} category`, { description: "Edit controls opened." })}><MoreHorizontal /></Button></div><h3 className="mt-4 font-display font-semibold text-foreground">{category.name}</h3><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-muted-foreground">Items</p><p className="mt-1 font-medium text-foreground">{category.count}</p></div><div><p className="text-xs text-muted-foreground">Stock value</p><p className="mt-1 font-medium text-foreground">{category.value}</p></div></div><p className="mt-4 text-[11px] text-muted-foreground">Updated {category.updated}</p></div>)}</div></SectionShell>; }

function VendorsPage() { const vendors = [{ name: "Bharat Cement Co.", category: "Cement", contact: "Mohan Bhat", phone: "+91 98800 12345", orders: 18, status: "Preferred" }, { name: "Shree Steel Depot", category: "Steel", contact: "Anil Shah", phone: "+91 98220 44321", orders: 12, status: "Preferred" }, { name: "Voltline Electricals", category: "Electrical", contact: "Sanjay Rao", phone: "+91 99881 22445", orders: 8, status: "Active" }, { name: "Prime Pipe Traders", category: "Plumbing", contact: "Kiran Nair", phone: "+91 97421 56212", orders: 10, status: "Active" }]; return <SectionShell title="Vendors" description="Approved suppliers and their latest purchase activity." actions={<Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={() => toast.success("Vendor form opened")}><Plus /> Add Vendor</Button>}><DataTable headers={["Vendor", "Category", "Contact", "Phone", "Orders", "Status", "Actions"]}>{vendors.map((vendor) => <tr key={vendor.name} className="hover:bg-foreground/[0.03]"><Td strong>{vendor.name}</Td><Td><Badge variant="secondary">{vendor.category}</Badge></Td><Td>{vendor.contact}</Td><Td>{vendor.phone}</Td><Td>{vendor.orders}</Td><Td><Badge className="border-success/20 bg-success/15 text-success">{vendor.status}</Badge></Td><Td><Button variant="ghost" size="icon" aria-label={`Edit ${vendor.name}`} onClick={() => toast(vendor.name, { description: "Vendor actions opened." })}><MoreHorizontal /></Button></Td></tr>)}</DataTable></SectionShell>; }

function RequisitionPage({ onSubmit }: { onSubmit: () => void }) { return <div className="grid gap-4 lg:grid-cols-[1fr_340px]"><section className="app-glass rounded-xl p-5"><div className="mb-5"><h2 className="font-display font-semibold text-foreground">New Requisition</h2><p className="mt-0.5 text-xs text-muted-foreground">Request materials for a block, flat, or custom site location.</p></div><RequisitionForm onSubmit={onSubmit} /></section><RequisitionAside /></div>; }

function RequisitionForm({ onSubmit, compact = false }: { onSubmit: () => void; compact?: boolean }) { const [location, setLocation] = useState("Block + Flat"); const [quantity, setQuantity] = useState("80"); const available = 1470; const exceeded = Number(quantity) > available; return <div className="space-y-5"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Location</p><div className="grid grid-cols-3 gap-2">{["Block + Flat", "Block Only", "Custom Location"].map((option) => <Button type="button" key={option} variant={location === option ? "default" : "outline"} className={cn("h-10 border-edge", location === option ? "bg-brand text-brand-foreground hover:bg-brand" : "bg-panel/40")} onClick={() => setLocation(option)}>{option}</Button>)}</div></div><div className="grid gap-4 sm:grid-cols-2">{location !== "Custom Location" && <Field label="Block No"><Select defaultValue="B"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="A">Block A</SelectItem><SelectItem value="B">Block B</SelectItem><SelectItem value="C">Block C</SelectItem></SelectContent></Select></Field>}{location === "Block + Flat" && <Field label="Flat No"><Input defaultValue="402" /></Field>}{location === "Custom Location" && <Field label="Custom Location"><Input placeholder="e.g. Basement pump room" /></Field>}<Field label="Requested By"><Input defaultValue="Ravi Kumar" /></Field><Field label="Date"><Input type="date" defaultValue="2024-03-25" /></Field></div><div className="rounded-xl border border-edge-soft bg-panel-muted/50 p-4"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-medium text-foreground">Requested items</p><p className="text-xs text-muted-foreground">Available stock is checked before submission.</p></div><Button type="button" variant="outline" size="sm" className="border-edge bg-panel/40" onClick={() => toast("Item row added", { description: "Choose another material below." })}><Plus /> Add item</Button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Item"><Select defaultValue="steel"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="steel">TMT Steel 12mm</SelectItem><SelectItem value="cement">OPC Cement 43</SelectItem><SelectItem value="tiles">Glossy Tiles 600mm</SelectItem><SelectItem value="pipe">PVC Pipe 1 inch</SelectItem></SelectContent></Select></Field><Field label="Available Stock"><div className="flex h-9 items-center rounded-md border border-edge bg-foreground/[0.03] px-3 text-sm text-success">{available.toLocaleString()} kg available</div></Field><Field label="Requested Quantity"><Input type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={exceeded ? "border-danger" : ""} /><p className={cn("mt-1 text-[11px]", exceeded ? "text-danger" : "text-muted-foreground")}>{exceeded ? "Quantity cannot exceed available stock" : "Maximum 1,470 kg"}</p></Field><Field label="Unit"><Select defaultValue="kg"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="bags">bags</SelectItem><SelectItem value="pcs">pcs</SelectItem><SelectItem value="box">box</SelectItem></SelectContent></Select></Field></div></div><Field label="Note"><textarea className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Add a note for the store manager…" /></Field><div className="flex flex-wrap justify-end gap-2"><Button type="button" variant="outline" className="border-edge bg-panel/40" onClick={() => toast.success("Draft saved", { description: "REQ-240325-01 saved as draft." })}>Save Draft</Button><Button type="button" disabled={exceeded || !quantity || Number(quantity) <= 0} className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={onSubmit}><Check /> Submit Requisition</Button></div></div>; }

function RequisitionAside() { return <section className="app-glass h-fit rounded-xl p-5"><p className="text-[11px] uppercase tracking-[0.2em] text-brand">Request guide</p><h3 className="mt-2 font-display text-lg font-semibold text-foreground">Keep the store moving</h3><div className="mt-5 space-y-4">{[["01", "Choose location", "Block and flat identify where material is going."], ["02", "Check availability", "Requests above available stock cannot be submitted."], ["03", "Submit for approval", "The Store Manager can approve, issue, or reject." ]].map(([number, title, description]) => <div className="flex gap-3" key={number}><div className="grid size-7 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-semibold text-brand">{number}</div><div><p className="text-sm font-medium text-foreground">{title}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p></div></div>)}</div><div className="mt-6 rounded-lg border border-brand/20 bg-brand/10 p-3 text-xs leading-5 text-brand">Current store balance supports this request. Issue quantities will be recorded against the selected flat.</div></section>; }

function HistoryPage() { const [rows, setRows] = useState(requisitions); const changeStatus = (id: string, status: string) => { setRows((current) => current.map((row) => row.id === id ? { ...row, status } : row)); toast.success("Requisition status updated"); }; return <SectionShell title="Requisition History" description="Track every site material request from draft to issue." actions={<Button variant="outline" className="border-edge bg-panel/40" onClick={() => toast.success("Requisitions exported")}><Download /> Export CSV</Button>}><DataTable headers={["Requisition ID", "Block", "Flat", "Requested By", "Items", "Quantity", "Date", "Status", "Actions"]}>{rows.map((row) => <tr key={row.id} className="hover:bg-foreground/[0.03]"><Td strong>{row.id}</Td><Td>{row.block}</Td><Td>{row.flat}</Td><Td>{row.requestedBy}</Td><Td>{row.items}</Td><Td>{row.quantity}</Td><Td muted>{row.date}</Td><Td><StatusBadge status={row.status} /></Td><Td><Select value={row.status} onValueChange={(value) => changeStatus(row.id, value)}><SelectTrigger className="h-8 w-[112px] border-edge bg-panel/40 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Issued">Issued</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select></Td></tr>)}</DataTable></SectionShell>; }

function TransactionsPage({ search }: { search: string }) { const [type, setType] = useState("all"); const filtered = transactions.filter((row) => (type === "all" || row.type === type) && Object.values(row).some((value) => value.toLowerCase().includes(search.toLowerCase()))); return <SectionShell title="Stock Transactions" description="Search item-wise and flat-wise movement across the site store." actions={<div className="flex gap-2"><Button variant="outline" className="border-edge bg-panel/40" onClick={() => toast.success("CSV exported", { description: `${filtered.length} transactions included.` })}><Download /> Export CSV</Button><Button variant="outline" className="border-edge bg-panel/40" onClick={() => window.print()}><Printer /> Print</Button></div>}><div className="grid gap-2 border-b border-edge-soft p-4 sm:grid-cols-2 lg:grid-cols-6"><Input type="date" className="border-edge bg-foreground/[0.04]" /><Input placeholder="Block No" className="border-edge bg-foreground/[0.04]" /><Input placeholder="Flat No" className="border-edge bg-foreground/[0.04]" /><Select defaultValue="all"><SelectTrigger className="border-edge bg-foreground/[0.04]"><SelectValue placeholder="Item" /></SelectTrigger><SelectContent><SelectItem value="all">All items</SelectItem><SelectItem value="cement">OPC Cement 43</SelectItem><SelectItem value="steel">TMT Steel 12mm</SelectItem></SelectContent></Select><Select defaultValue="all" onValueChange={setType}><SelectTrigger className="border-edge bg-foreground/[0.04]"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="Inward">Inward</SelectItem><SelectItem value="Outward">Outward</SelectItem></SelectContent></Select><Input placeholder="User" className="border-edge bg-foreground/[0.04]" /></div><DataTable headers={["Date", "Transaction ID", "Type", "Item", "Quantity", "Block", "Flat", "User", "Reference"]}>{filtered.map((row) => <tr key={row.id} className="hover:bg-foreground/[0.03]"><Td muted>{row.date}</Td><Td strong>{row.id}</Td><Td><Badge className={cn("border", row.type === "Inward" ? "border-success/20 bg-success/15 text-success" : "border-brand/20 bg-brand/10 text-brand")}>{row.type}</Badge></Td><Td>{row.item}</Td><Td className={row.type === "Inward" ? "text-success" : "text-brand"}>{row.quantity}</Td><Td>{row.block}</Td><Td>{row.flat}</Td><Td>{row.user}</Td><Td muted>{row.ref}</Td></tr>)}</DataTable></SectionShell>; }

function StockReportPage() { return <SectionShell title="Stock Report" description="Opening + inward − outward + adjustments = closing stock." actions={<Button variant="outline" className="border-edge bg-panel/40" onClick={() => toast.success("Stock report exported")}><Download /> Export CSV</Button>}><DataTable headers={["Item", "Category", "Opening Stock", "Total Inward", "Total Outward", "Closing Stock", "Stock Value", "Status"]}>{stockItems.map((item) => <tr key={item.item} className="hover:bg-foreground/[0.03]"><Td strong>{item.item}</Td><Td><Badge variant="secondary">{item.category}</Badge></Td><Td>{Math.max(0, item.available - 110)}</Td><Td>{item.inward.toLocaleString()}</Td><Td>{item.outward.toLocaleString()}</Td><Td strong>{item.available.toLocaleString()}</Td><Td>₹{(item.available * item.rate).toLocaleString("en-IN")}</Td><Td><StatusBadge status={stockStatus(item)} /></Td></tr>)}</DataTable></SectionShell>; }

function UsersPage({ users, onAdd, onEdit, onToggle }: { users: typeof usersSeed; onAdd: () => void; onEdit: (user: (typeof usersSeed)[number]) => void; onToggle: (name: string) => void }) { return <SectionShell title="Users" description="Manage site-store access, roles, and assigned sites." actions={<Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={onAdd}><Plus /> Add User</Button>}><DataTable headers={["Name", "Email", "Phone", "Role", "Assigned Site", "Status", "Last Login", "Actions"]}>{users.map((user) => <tr key={user.email} className="hover:bg-foreground/[0.03]"><Td strong>{user.name}</Td><Td>{user.email}</Td><Td>{user.phone}</Td><Td><Badge variant="secondary">{user.role}</Badge></Td><Td>{user.site}</Td><Td><Button variant="ghost" size="sm" className={cn("h-7 px-2 text-xs", user.status === "Active" ? "text-success" : "text-muted-foreground")} onClick={() => onToggle(user.name)}>{user.status}</Button></Td><Td muted>{user.lastLogin}</Td><Td><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label={`Edit ${user.name}`} onClick={() => onEdit(user)}><Pencil /></Button><Button variant="ghost" size="icon" aria-label={`More actions for ${user.name}`} onClick={() => toast(user.name, { description: "User actions opened." })}><MoreHorizontal /></Button></div></Td></tr>)}</DataTable></SectionShell>; }

function RolesPage() { const permissions = ["Dashboard", "Purchase", "Stock", "Outward", "Reports", "Users", "Settings"]; const roles = ["Admin", "Store Manager", "Site Engineer", "Project Manager", "Management"]; const [matrix, setMatrix] = useState<Record<string, boolean>>(() => Object.fromEntries(roles.flatMap((role) => permissions.map((permission) => [`${role}-${permission}`, role === "Admin" || (role === "Store Manager" && ["Dashboard", "Purchase", "Stock", "Outward", "Reports"].includes(permission)) || (role === "Site Engineer" && ["Dashboard", "Stock", "Outward"].includes(permission)) || (role === "Project Manager" && ["Dashboard", "Reports", "Outward"].includes(permission)) || (role === "Management" && ["Dashboard", "Reports"].includes(permission))])))); const toggle = (key: string) => setMatrix((current) => ({ ...current, [key]: !current[key] })); return <SectionShell title="Roles & Permissions" description="Control which parts of the workspace each role can access." actions={<Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={() => toast.success("Role form opened")}><Plus /> Add Role</Button>}><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b border-edge-soft text-left text-[11px] uppercase tracking-wider text-muted-foreground"><th className="px-5 py-4 font-medium">Role</th>{permissions.map((permission) => <th key={permission} className="px-3 py-4 text-center font-medium">{permission}</th>)}</tr></thead><tbody className="divide-y divide-edge-soft">{roles.map((role) => <tr key={role} className="hover:bg-foreground/[0.03]"><td className="px-5 py-4 font-medium text-foreground">{role}</td>{permissions.map((permission) => { const key = `${role}-${permission}`; return <td key={permission} className="px-3 py-4 text-center"><Button variant="ghost" size="icon" className={cn("mx-auto rounded-full", matrix[key] ? "bg-success/15 text-success hover:bg-success/20" : "text-muted-foreground/40 hover:text-muted-foreground")} aria-label={`${role} ${permission} permission`} onClick={() => toggle(key)}>{matrix[key] ? <Check /> : <X />}</Button></td>; })}</tr>)}</tbody></table></div><div className="flex items-center gap-4 border-t border-edge-soft px-5 py-4 text-xs text-muted-foreground"><span className="flex items-center gap-2"><Check className="size-4 text-success" /> Access enabled</span><span className="flex items-center gap-2"><X className="size-4" /> Access disabled</span></div></SectionShell>; }

function PurchaseModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) { const [rows, setRows] = useState([{ item: "OPC Cement 43", category: "Cement", quantity: "500", unit: "bags", rate: "420" }]); const total = rows.reduce((sum, row) => sum + Number(row.quantity || 0) * Number(row.rate || 0), 0); return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-edge bg-panel text-foreground"><DialogHeader><DialogTitle className="font-display text-xl">Add Purchase / Inward</DialogTitle><DialogDescription>Record a vendor delivery and add one or more materials to stock.</DialogDescription></DialogHeader><div className="grid gap-4 sm:grid-cols-2"><Field label="Vendor"><Select defaultValue="bharat"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bharat">Bharat Cement Co.</SelectItem><SelectItem value="steel">Shree Steel Depot</SelectItem><SelectItem value="voltline">Voltline Electricals</SelectItem><SelectItem value="prime">Prime Pipe Traders</SelectItem></SelectContent></Select></Field><Field label="Date"><Input type="date" defaultValue="2024-03-25" /></Field><Field label="Invoice No"><Input placeholder="INV/KA/0932" /></Field><Field label="Evidence Attachment"><Input type="file" className="pt-1.5" /></Field></div><div className="rounded-xl border border-edge-soft bg-panel-muted/50 p-4"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-medium text-foreground">Purchase items</p><p className="text-xs text-muted-foreground">Add multiple materials to this invoice.</p></div><Button variant="outline" size="sm" className="border-edge bg-panel/40" onClick={() => setRows((current) => [...current, { item: "TMT Steel 12mm", category: "Steel", quantity: "", unit: "kg", rate: "68" }])}><Plus /> Add item</Button></div><div className="space-y-3">{rows.map((row, index) => <div className="grid items-end gap-2 sm:grid-cols-[1.3fr_1fr_.7fr_.7fr_.8fr_auto]" key={index}><Field label={index === 0 ? "Item" : undefined}><Select defaultValue={row.item === "OPC Cement 43" ? "cement" : "steel"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cement">OPC Cement 43</SelectItem><SelectItem value="steel">TMT Steel 12mm</SelectItem><SelectItem value="tiles">Glossy Tiles 600mm</SelectItem><SelectItem value="pipe">PVC Pipe 1 inch</SelectItem></SelectContent></Select></Field><Field label={index === 0 ? "Category" : undefined}><Input value={row.category} readOnly /></Field><Field label={index === 0 ? "Qty" : undefined}><Input value={row.quantity} onChange={(event) => setRows((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, quantity: event.target.value } : entry))} /></Field><Field label={index === 0 ? "Unit" : undefined}><Input value={row.unit} onChange={(event) => setRows((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, unit: event.target.value } : entry))} /></Field><Field label={index === 0 ? "Rate" : undefined}><Input value={row.rate} onChange={(event) => setRows((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, rate: event.target.value } : entry))} /></Field><Button variant="ghost" size="icon" className="mb-0.5" aria-label="Remove purchase item" disabled={rows.length === 1} onClick={() => setRows((current) => current.filter((_, entryIndex) => entryIndex !== index))}><Trash2 /></Button></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-edge-soft pt-4"><span className="text-sm text-muted-foreground">Total amount</span><span className="font-display text-xl font-bold text-brand">₹{total.toLocaleString("en-IN")}</span></div></div><Field label="Notes"><textarea className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Delivery notes, quality checks, or store remarks…" /></Field><DialogFooter><Button variant="outline" className="border-edge bg-panel/40" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={() => { onOpenChange(false); toast.success("Purchase added", { description: `₹${total.toLocaleString("en-IN")} posted to Central Store.` }); }}>Save Purchase</Button></DialogFooter></DialogContent></Dialog>; }

function StockDetails({ stock, onClose }: { stock: (typeof stockItems)[number] | null; onClose: () => void }) { return <Dialog open={Boolean(stock)} onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-w-lg border-edge bg-panel text-foreground"><DialogHeader><DialogTitle className="font-display text-xl">{stock?.item}</DialogTitle><DialogDescription>{stock?.category} · {stock?.unit} · Central Store</DialogDescription></DialogHeader>{stock && <><div className="grid grid-cols-3 gap-3">{[["Available", stock.available.toLocaleString(), "text-success"], ["Minimum", stock.minimum.toLocaleString(), "text-warning"], ["Stock value", `₹${(stock.available * stock.rate).toLocaleString("en-IN")}`, "text-brand"]].map(([label, value, color]) => <div key={String(label)} className="rounded-lg border border-edge-soft bg-panel-muted/60 p-3"><p className="text-[11px] text-muted-foreground">{label}</p><p className={cn("mt-1 font-display font-semibold", color as string)}>{value}</p></div>)}</div><div className="mt-5"><div className="flex items-center justify-between"><h3 className="font-medium text-foreground">Stock level</h3><StatusBadge status={stockStatus(stock)} /></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10"><div className={cn("h-full rounded-full", stock.available < stock.minimum / 2 ? "bg-danger" : "bg-brand")} style={{ width: `${Math.min(100, (stock.available / stock.minimum) * 100)}%` }} /></div></div><div className="mt-5"><h3 className="font-medium text-foreground">Recent transactions</h3><div className="mt-2 divide-y divide-edge-soft rounded-lg border border-edge-soft">{transactions.filter((txn) => txn.item === stock.item).length ? transactions.filter((txn) => txn.item === stock.item).map((txn) => <div className="flex items-center justify-between p-3 text-sm" key={txn.id}><span className="text-muted-foreground">{txn.date} · {txn.ref}</span><span className={txn.type === "Inward" ? "text-success" : "text-brand"}>{txn.quantity}</span></div>) : <p className="p-3 text-sm text-muted-foreground">No recent movement for this item.</p>}</div></div></>}</DialogContent></Dialog>; }

function UserModal({ open, onOpenChange, user, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; user: (typeof usersSeed)[number] | null; onSave: (user: (typeof usersSeed)[number]) => void }) { const [name, setName] = useState(user?.name ?? ""); const [email, setEmail] = useState(user?.email ?? ""); const [role, setRole] = useState(user?.role ?? "Site Engineer"); const [site, setSite] = useState(user?.site ?? "Tower B"); return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-xl border-edge bg-panel text-foreground"><DialogHeader><DialogTitle className="font-display text-xl">{user ? "Edit User" : "Add User"}</DialogTitle><DialogDescription>Assign access to the construction inventory workspace.</DialogDescription></DialogHeader><div className="grid gap-4 sm:grid-cols-2"><Field label="Name"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" /></Field><Field label="Email"><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.in" /></Field><Field label="Phone"><Input defaultValue={user?.phone ?? "+91 "} /></Field><Field label="Role"><Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Admin", "Store Manager", "Site Engineer", "Project Manager", "Management"].map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field><Field label="Assigned Site"><Select value={site} onValueChange={setSite}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Tower A", "Tower B", "Block B", "Central Store"].map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field></div><DialogFooter><Button variant="outline" className="border-edge bg-panel/40" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!name || !email} className="bg-gradient-to-br from-brand to-brand-strong text-brand-foreground hover:from-brand hover:to-brand-strong" onClick={() => onSave({ name, email, phone: user?.phone ?? "+91 00000 00000", role, site, status: user?.status ?? "Active", lastLogin: user?.lastLogin ?? "Never" })}><Check /> Save User</Button></DialogFooter></DialogContent></Dialog>; }

function RequisitionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) { return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-2xl border-edge bg-panel text-foreground"><DialogHeader><DialogTitle className="font-display text-xl">Quick Requisition</DialogTitle><DialogDescription>Start a new material request without leaving your current workspace.</DialogDescription></DialogHeader><RequisitionForm compact onSubmit={() => { onOpenChange(false); toast.success("Requisition submitted", { description: "REQ-240325-01 is waiting for approval." }); }} /></DialogContent></Dialog>; }

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) { return <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-sm"><thead><tr className="border-b border-edge-soft text-left text-[11px] uppercase tracking-wider text-muted-foreground">{headers.map((header) => <th key={header} className="px-5 py-3 font-medium">{header}</th>)}</tr></thead><tbody className="divide-y divide-edge-soft">{children}</tbody></table></div>; }
function Td({ children, muted = false, strong = false, className }: { children: React.ReactNode; muted?: boolean; strong?: boolean; className?: string }) { return <td className={cn("px-5 py-3", muted ? "text-muted-foreground" : "text-foreground", strong && "font-medium", className)}>{children}</td>; }
function Field({ label, children }: { label?: string; children: React.ReactNode }) { return <label className="block space-y-1.5">{label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}{children}</label>; }
function stockStatus(item: (typeof stockItems)[number]): Status { if (item.available === 0) return "Out of Stock"; if (item.available < item.minimum) return "Low Stock"; return "In Stock"; }
function StatusBadge({ status }: { status: string }) { const styles = status === "In Stock" || status === "Approved" || status === "Issued" ? "border-success/20 bg-success/15 text-success" : status === "Out of Stock" || status === "Rejected" ? "border-danger/20 bg-danger/15 text-danger" : "border-brand/20 bg-brand/10 text-brand"; return <Badge className={cn("border", styles)}>{status}</Badge>; }