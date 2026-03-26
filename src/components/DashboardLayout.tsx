import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Search, LogOut, Shield, Menu, X,
  User, ChevronDown, Settings, Users, Bell, Sparkles, BarChart3,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const userNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Submit Complaint", path: "/submit", icon: FileText },
  { label: "Track Complaints", path: "/track", icon: Search },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "All Complaints", path: "/admin/complaints", icon: FileText },
  { label: "Analytics", path: "/admin", icon: BarChart3 },
  { label: "Settings", path: "/admin", icon: Settings },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { complaints } = useComplaints();
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const highPriorityCount = complaints.filter((c) => c.priority === "High" && c.status !== "Resolved").length;

  const nav = user?.role === "admin" ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: "hsl(220, 30%, 20%)" }}>
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
          <Shield className="w-5 h-5" style={{ color: "hsl(0, 0%, 100%)" }} />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight" style={{ color: "hsl(0, 0%, 100%)" }}>Resolve X</span>
          <span className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "hsl(220, 15%, 55%)" }}>
            <Sparkles className="w-3 h-3" />
            {user?.role === "admin" ? "Admin Panel" : "User Portal"}
          </span>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "hsl(220, 15%, 40%)" }}>Navigation</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {nav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-nav-item ${active ? "active" : ""}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.label === "Dashboard" && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-3 border-t" style={{ borderColor: "hsl(220, 30%, 20%)" }}>
        <div className="flex items-center gap-3 px-4 py-2.5 mb-2 rounded-lg" style={{ background: "hsl(220, 30%, 16%)" }}>
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-sm">
            <User className="w-4 h-4" style={{ color: "hsl(0, 0%, 100%)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "hsl(0, 0%, 100%)" }}>{user?.name}</p>
            <p className="text-[11px] truncate" style={{ color: "hsl(220, 15%, 50%)" }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-nav-item w-full text-left" style={{ color: "hsl(0, 72%, 65%)" }}>
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:block w-[260px] sidebar-nav fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: "hsl(0, 0%, 0%)" }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[260px] sidebar-nav z-50 lg:hidden"
            >
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted/10 transition-colors" style={{ color: "hsl(220, 15%, 65%)" }}>
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-[260px]">
        <header className="sticky top-0 z-20 bg-card/85 backdrop-blur-xl border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-foreground leading-none">
                {nav.find((n) => n.path === location.pathname)?.label || "Dashboard"}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center badge-glow">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl overflow-hidden z-50"
                    style={{ boxShadow: "var(--shadow-elevated)" }}
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Notifications</p>
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {pendingCount + (highPriorityCount > 0 ? 1 : 0)} new
                      </span>
                    </div>
                    <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                      {pendingCount > 0 && (
                        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-warning/8 hover:bg-warning/12 transition-colors cursor-default">
                          <div className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-foreground">{pendingCount} pending complaint{pendingCount !== 1 ? "s" : ""}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting review and action</p>
                          </div>
                        </div>
                      )}
                      {highPriorityCount > 0 && (
                        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-destructive/8 hover:bg-destructive/12 transition-colors cursor-default">
                          <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-foreground">{highPriorityCount} high priority unresolved</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Requires immediate attention</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                        <div className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">System running smoothly</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">All services operational</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-border mx-1 hidden sm:block" />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center ring-2 ring-primary/20">
                  <User className="w-4 h-4" style={{ color: "hsl(0, 0%, 100%)" }} />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-sm font-medium text-foreground block leading-none">{user?.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-xl overflow-hidden z-50"
                    style={{ boxShadow: "var(--shadow-elevated)" }}
                  >
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wide">{user?.role}</span>
                    </div>
                    <div className="p-1.5">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
