import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage, LANGUAGE_OPTIONS } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Search, LogOut, Shield, Menu, X,
  User, ChevronDown, Settings, Bell, Sparkles, BarChart3, Check, Trash2,
  Globe,
} from "lucide-react";

interface NavItem {
  label: string;
  labelKey: string;
  path: string;
  icon: React.ElementType;
}

const userNav: NavItem[] = [
  { label: "Dashboard", labelKey: "nav.dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Submit Complaint", labelKey: "nav.submit", path: "/submit", icon: FileText },
  { label: "Track Complaints", labelKey: "nav.track", path: "/track", icon: Search },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", labelKey: "nav.dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "All Complaints", labelKey: "nav.all_complaints", path: "/admin/complaints", icon: FileText },
  { label: "Analytics", labelKey: "nav.analytics", path: "/admin", icon: BarChart3 },
  { label: "Settings", labelKey: "nav.settings", path: "/admin", icon: Settings },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { language, setLanguage, t } = useLanguage();

  const nav = user?.role === "admin" ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeAllDropdowns = () => {
    setProfileOpen(false);
    setNotifOpen(false);
    setLangOpen(false);
  };

  const notifTypeColor: Record<string, string> = {
    success: "bg-success",
    info: "bg-primary",
    warning: "bg-warning",
    error: "bg-destructive",
  };

  const currentLang = LANGUAGE_OPTIONS.find(l => l.value === language);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
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

      <div className="px-5 pt-5 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "hsl(220, 15%, 40%)" }}>{t("nav.navigation")}</span>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-1">
        {nav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.labelKey}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-nav-item ${active ? "active" : ""}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{t(item.labelKey)}</span>
              {item.labelKey === "nav.dashboard" && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

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
          <span>{t("nav.logout")}</span>
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
                {t(nav.find((n) => n.path === location.pathname)?.labelKey || "nav.dashboard")}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); setProfileOpen(false); }}
                className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-muted transition-colors text-sm"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline text-xs font-medium text-muted-foreground">{currentLang?.flag}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl overflow-hidden z-50"
                    style={{ boxShadow: "var(--shadow-elevated)" }}
                  >
                    <div className="p-1.5">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => { setLanguage(lang.value); setLangOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                            language === lang.value ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.label}</span>
                          {language === lang.value && <Check className="w-3.5 h-3.5 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setLangOpen(false); }}
                className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center badge-glow">
                    {unreadCount > 9 ? "9+" : unreadCount}
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
                      <p className="text-sm font-semibold text-foreground">{t("notif.title")}</p>
                      <div className="flex items-center gap-1.5">
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                            <Check className="w-3 h-3" /> {t("notif.mark_read")}
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={clearAll} className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 ml-2">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">{t("notif.empty")}</p>
                        </div>
                      ) : (
                        <div className="p-1.5 space-y-0.5">
                          {notifications.slice(0, 15).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                                n.read ? "hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notifTypeColor[n.type]}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium text-foreground ${!n.read ? "font-semibold" : ""}`}>{n.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                  {new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-8 bg-border mx-1 hidden sm:block" />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setLangOpen(false); }}
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
                        {t("nav.logout")}
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
