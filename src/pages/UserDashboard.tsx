import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Clock, CheckCircle, AlertTriangle, Plus, ArrowRight,
  TrendingUp, TrendingDown, Minus, Tag, Zap, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Sparkline from "@/components/Sparkline";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import AnimatedCounter from "@/components/AnimatedCounter";
import EmergencyContacts from "@/components/EmergencyContacts";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(220, 15%, 90%)",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 4px 12px hsl(220 30% 12% / 0.08)",
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { complaints, isLoading } = useComplaints();
  const { t } = useLanguage();

  if (isLoading) return <DashboardSkeleton />;

  const userComplaints = complaints.filter((c) => c.userEmail === user?.email);
  const pending = userComplaints.filter((c) => c.status === "Pending").length;
  const inProgress = userComplaints.filter((c) => c.status === "In Progress").length;
  const resolved = userComplaints.filter((c) => c.status === "Resolved").length;

  const avgResolutionDays = userComplaints.length > 0 ? 4.2 : 0;

  const stats = [
    {
      label: t("dash.total"), value: userComplaints.length, icon: FileText,
      color: "text-primary", bg: "bg-primary/10", cardClass: "stat-card-primary",
      change: 12, sparkData: [1, 2, 1, 3, 2, 4, 3], sparkColor: "hsl(220, 70%, 50%)",
      subtitle: t("dash.all_time")
    },
    {
      label: t("dash.pending"), value: pending, icon: Clock,
      color: "text-warning", bg: "bg-warning/10", cardClass: "stat-card-warning",
      change: -5, sparkData: [3, 2, 4, 3, 2, 1, 2], sparkColor: "hsl(38, 92%, 55%)",
      subtitle: t("dash.awaiting")
    },
    {
      label: t("dash.in_progress"), value: inProgress, icon: AlertTriangle,
      color: "text-accent", bg: "bg-accent/10", cardClass: "stat-card-accent",
      change: 0, sparkData: [1, 1, 2, 1, 2, 2, 1], sparkColor: "hsl(200, 80%, 50%)",
      subtitle: t("dash.being_handled")
    },
    {
      label: t("dash.resolved"), value: resolved, icon: CheckCircle,
      color: "text-success", bg: "bg-success/10", cardClass: "stat-card-success",
      change: 25, sparkData: [0, 1, 1, 2, 2, 3, 4], sparkColor: "hsl(152, 60%, 42%)",
      subtitle: t("dash.completed")
    },
  ];

  const pieData = [
    { name: t("dash.pending"), value: pending, color: "hsl(38, 92%, 55%)" },
    { name: t("dash.in_progress"), value: inProgress, color: "hsl(200, 80%, 50%)" },
    { name: t("dash.resolved"), value: resolved, color: "hsl(152, 60%, 42%)" },
  ].filter((d) => d.value > 0);

  const categoryMap = new Map<string, number>();
  userComplaints.forEach((c) => {
    categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));

  const activityData = userComplaints
    .map((c) => ({
      date: new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: 1,
    }))
    .reduce<{ date: string; count: number }[]>((acc, cur) => {
      const existing = acc.find((a) => a.date === cur.date);
      if (existing) existing.count += 1;
      else acc.push({ ...cur });
      return acc;
    }, [])
    .sort((a, b) => new Date(`${a.date} 2026`).getTime() - new Date(`${b.date} 2026`).getTime());

  const ChangeIndicator = ({ change }: { change: number }) => {
    if (change > 0) return <span className="flex items-center gap-0.5 text-xs font-semibold text-success"><TrendingUp className="w-3 h-3" />+{change}%</span>;
    if (change < 0) return <span className="flex items-center gap-0.5 text-xs font-semibold text-destructive"><TrendingDown className="w-3 h-3" />{change}%</span>;
    return <span className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground"><Minus className="w-3 h-3" />0%</span>;
  };

  const resolutionRate = userComplaints.length > 0 ? Math.round((resolved / userComplaints.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">{t("dash.welcome")}, {user?.name} 👋</h1>
          <p className="text-muted-foreground mt-1">{t("dash.overview")}</p>
        </div>
        <Link to="/submit">
          <Button className="gradient-primary text-primary-foreground gap-2 h-11 px-5 shadow-md hover:shadow-lg transition-shadow">
            <Plus className="w-4 h-4" /> {t("dash.new_complaint")}
          </Button>
        </Link>
      </div>

      {/* Quick stats bar */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
            <Zap className="w-4 h-4" style={{ color: "hsl(0,0%,100%)" }} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("dash.resolution_rate")}</p>
            <p className="text-sm font-bold text-foreground"><AnimatedCounter end={resolutionRate} />%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Timer className="w-4 h-4" style={{ color: "hsl(0,0%,100%)" }} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("dash.avg_resolution")}</p>
            <p className="text-sm font-bold text-foreground">{avgResolutionDays} {t("common.days")}</p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards with sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={`stat-card ${stat.cardClass} group`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{stat.subtitle}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-md`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-extrabold text-foreground leading-none tabular-nums">
                  <AnimatedCounter end={stat.value} />
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <ChangeIndicator change={stat.change} />
                  <span className="text-[10px] text-muted-foreground">{t("common.vs_last_week")}</span>
                </div>
              </div>
              <div className="w-24 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkline data={stat.sparkData} color={stat.sparkColor} height={48} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div
          className="lg:col-span-2 chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">{t("dash.status_overview")}</h3>
          <p className="text-xs text-muted-foreground mb-4">{t("dash.status_overview_desc")}</p>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {pieData.map((d) => {
                  const pct = userComplaints.length > 0 ? Math.round((d.value / userComplaints.length) * 100) : 0;
                  return (
                    <div key={d.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-foreground font-medium">{d.name}</span>
                        </div>
                        <span className="text-xs font-bold text-foreground">{d.value} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <motion.div
                          className="h-1.5 rounded-full"
                          style={{ backgroundColor: d.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <FileText className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">{t("dash.no_data")}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="lg:col-span-3 chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" /> {t("dash.by_category")}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{t("dash.by_category_desc")}</p>
          {categoryData.length > 0 ? (
            <div className="space-y-3">
              {categoryData.map((cat, idx) => {
                const pct = userComplaints.length > 0 ? (cat.count / userComplaints.length) * 100 : 0;
                const colors = [
                  "hsl(220, 70%, 50%)", "hsl(38, 92%, 55%)", "hsl(152, 60%, 42%)",
                  "hsl(0, 72%, 55%)", "hsl(200, 80%, 50%)", "hsl(280, 60%, 55%)", "hsl(170, 55%, 45%)"
                ];
                return (
                  <div key={cat.name} className="group/bar">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-foreground font-medium">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{cat.count}</span>
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{Math.round(pct)}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="h-2.5 rounded-full transition-all group-hover/bar:h-3"
                        style={{ backgroundColor: colors[idx % colors.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Tag className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">{t("dash.no_submitted")}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Activity timeline chart */}
      {activityData.length > 1 && (
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">{t("dash.your_activity")}</h3>
          <p className="text-xs text-muted-foreground mb-4">{t("dash.your_activity_desc")}</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="userActivityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="count" stroke="hsl(220, 70%, 50%)" fill="url(#userActivityGrad)" strokeWidth={2.5} name={t("common.complaints")} dot={{ r: 3.5, fill: "hsl(220, 70%, 50%)", strokeWidth: 2, stroke: "hsl(0, 0%, 100%)" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent complaints */}
      <motion.div
        className="bg-card border border-border rounded-xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">{t("dash.recent")}</h2>
          <Link to="/track" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline transition-colors">
            {t("dash.view_all")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {userComplaints.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t("dash.no_complaints")}</p>
            <p className="text-xs mt-1">{t("dash.no_complaints_sub")}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {userComplaints.slice(0, 5).map((c, i) => (
              <Link key={c.id} to={`/complaint/${c.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{c.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground font-mono">{c.id}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-xs text-muted-foreground">{c.category}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-xs text-muted-foreground">{c.location}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Emergency Contacts */}
      <EmergencyContacts />
    </div>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-warning/15 text-warning border-warning/20",
    "In Progress": "bg-accent/15 text-accent border-accent/20",
    Resolved: "bg-success/15 text-success border-success/20",
    Rejected: "bg-destructive/15 text-destructive border-destructive/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
};

export default UserDashboard;
