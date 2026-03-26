import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Search, LogOut, Shield, Menu, X,
  User, ChevronDown, Settings, Users, Bell,
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
  { label: "Manage Users", path: "/admin", icon: Users },
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

  const nav = user?.role === "admin" ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: "hsl(220, 30%, 20%)" }}>
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
          <Shield className="w-5 h-5" style={{ color: "hsl(0, 0%, 100%)" }} />
        </div>
        <div>
          <span className="font-bold text-base" style={{ color: "hsl(0, 0%, 100%)" }}>Resolve X</span>
          <span className="block text-xs" style={{ color: "hsl(220, 15%, 55%)" }}>
            {user?.role === "admin" ? "Admin Panel" : "User Portal"}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
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
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-3 border-t" style={{ borderColor: "hsl(220, 30%, 20%)" }}>
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <User className="w-4 h-4" style={{ color: "hsl(0, 0%, 100%)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "hsl(0, 0%, 100%)" }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: "hsl(220, 15%, 55%)" }}>{user?.email}</p>
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
      <aside className="hidden lg:block w-64 sidebar-nav fixed inset-y-0 left-0 z-30">
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
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 sidebar-nav z-50 lg:hidden"
            >
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4" style={{ color: "hsl(220, 15%, 65%)" }}>
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground leading-none">
                {nav.find((n) => n.path === location.pathname)?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl p-3 z-50"
                    style={{ boxShadow: "var(--shadow-elevated)" }}
                  >
                    <p className="text-sm font-semibold text-foreground mb-2">Notifications</p>
                    {pendingCount > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-warning/10">
                          <div className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-foreground">{pendingCount} pending complaint{pendingCount !== 1 ? "s" : ""}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Require attention</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-foreground">System running smoothly</p>
                            <p className="text-xs text-muted-foreground mt-0.5">All services operational</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">No new notifications</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4" style={{ color: "hsl(0, 0%, 100%)" }} />
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block">{user?.name}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl p-2 z-50"
                    style={{ boxShadow: "var(--shadow-elevated)" }}
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold capitalize">{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-lg hover:bg-muted transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
