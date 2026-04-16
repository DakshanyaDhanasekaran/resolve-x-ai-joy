import { useMemo, useState } from "react";
import { useComplaints, CATEGORIES } from "@/contexts/ComplaintContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  FileText, Clock, CheckCircle, AlertTriangle, TrendingUp,
  TrendingDown, Minus, Activity, Timer, Zap, BarChart3, Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area, LineChart, Line,
} from "recharts";
import Sparkline from "@/components/Sparkline";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import EmptyChart from "@/components/EmptyChart";
import AnimatedCounter from "@/components/AnimatedCounter";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(220, 15%, 90%)",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 4px 12px hsl(220 30% 12% / 0.08)",
  padding: "8px 12px",
};

const CATEGORY_COLORS = [
  "hsl(220, 70%, 50%)", "hsl(38, 92%, 55%)", "hsl(152, 60%, 42%)",
  "hsl(0, 72%, 55%)", "hsl(200, 80%, 50%)", "hsl(280, 60%, 55%)", "hsl(170, 55%, 45%)",
];

const AdminDashboard = () => {
  const { complaints, isLoading } = useComplaints();
  const { t } = useLanguage();
  const [trendView, setTrendView] = useState<"daily" | "weekly">("daily");

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    CATEGORIES.forEach((cat) => map.set(cat, 0));
    complaints.forEach((c) => map.set(c.category, (map.get(c.category) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, count], i) => ({ name, count, fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))
      .filter((d) => d.count > 0);
  }, [complaints]);

  const weeklyTrend = useMemo(() => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const now = new Date();
    return weeks.map((week, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (3 - i) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      const submitted = complaints.filter((c) => {
        const d = new Date(c.createdAt);
        return d >= weekStart && d < weekEnd;
      }).length;
      const resolvedCount = complaints.filter((c) => {
        const d = new Date(c.updatedAt);
        return c.status === "Resolved" && d >= weekStart && d < weekEnd;
      }).length;
      return { week, submitted, resolved: resolvedCount };
    });
  }, [complaints]);

  const dailyTrend = useMemo(() => {
    const trendMap = new Map<string, { date: string; submitted: number; resolved: number }>();
    complaints.forEach((c) => {
      const day = new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!trendMap.has(day)) trendMap.set(day, { date: day, submitted: 0, resolved: 0 });
      const entry = trendMap.get(day)!;
      entry.submitted += 1;
      if (c.status === "Resolved") entry.resolved += 1;
    });
    return Array.from(trendMap.values()).sort(
      (a, b) => new Date(`${a.date} 2026`).getTime() - new Date(`${b.date} 2026`).getTime()
    );
  }, [complaints]);

  if (isLoading) return <DashboardSkeleton />;

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const rejected = complaints.filter((c) => c.status === "Rejected").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const avgResolutionDays = 3.8;
  const highPriorityCount = complaints.filter((c) => c.priority === "High" && c.status !== "Resolved").length;

  const stats = [
    { label: "Total Complaints", value: total, icon: FileText, color: "text-primary", bg: "bg-primary/10", cardClass: "stat-card-primary", change: 18, sparkData: [3, 5, 4, 7, 6, 8, 10, 12], sparkColor: "hsl(220, 70%, 50%)", subtitle: "All time" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning", bg: "bg-warning/10", cardClass: "stat-card-warning", change: -8, sparkData: [5, 4, 6, 5, 3, 4, 3, 5], sparkColor: "hsl(38, 92%, 55%)", subtitle: "Needs attention" },
    { label: "In Progress", value: inProgress, icon: AlertTriangle, color: "text-accent", bg: "bg-accent/10", cardClass: "stat-card-accent", change: 15, sparkData: [1, 2, 2, 3, 2, 3, 2, 3], sparkColor: "hsl(200, 80%, 50%)", subtitle: "Being handled" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-success", bg: "bg-success/10", cardClass: "stat-card-success", change: 32, sparkData: [1, 1, 2, 2, 3, 3, 4, 3], sparkColor: "hsl(152, 60%, 42%)", subtitle: "Completed" },
  ];

  const pieData = [
    { name: "Pending", value: pending, color: "hsl(38, 92%, 55%)" },
    { name: "In Progress", value: inProgress, color: "hsl(200, 80%, 50%)" },
    { name: "Resolved", value: resolved, color: "hsl(152, 60%, 42%)" },
    { name: "Rejected", value: rejected, color: "hsl(0, 72%, 55%)" },
  ].filter((d) => d.value > 0);

  const priorityData = [
    { priority: "High", count: complaints.filter((c) => c.priority === "High").length, fill: "hsl(0, 72%, 55%)" },
    { priority: "Medium", count: complaints.filter((c) => c.priority === "Medium").length, fill: "hsl(38, 92%, 55%)" },
    { priority: "Low", count: complaints.filter((c) => c.priority === "Low").length, fill: "hsl(152, 60%, 42%)" },
  ];

  const recentComplaints = complaints.slice(0, 6);

  const ChangeIndicator = ({ change }: { change: number }) => {
    if (change > 0) return <span className="flex items-center gap-0.5 text-xs font-semibold text-success"><TrendingUp className="w-3 h-3" />+{change}%</span>;
    if (change < 0) return <span className="flex items-center gap-0.5 text-xs font-semibold text-destructive"><TrendingDown className="w-3 h-3" />{change}%</span>;
    return <span className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground"><Minus className="w-3 h-3" />0%</span>;
  };

  const trendData = trendView === "daily" ? dailyTrend : weeklyTrend;
  const trendXKey = trendView === "daily" ? "date" : "week";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Activity className="w-5 h-5" style={{ color: "hsl(0,0%,100%)" }} />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1.5">Real-time analytics and complaint management</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/complaints">
            <Button className="gradient-primary text-primary-foreground gap-2 h-11 px-5 shadow-md hover:shadow-lg transition-shadow">
              <BarChart3 className="w-4 h-4" /> Manage All
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick metrics bar */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
            <Zap className="w-4 h-4" style={{ color: "hsl(0,0%,100%)" }} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Resolution Rate</p>
            <p className="text-sm font-bold text-success"><AnimatedCounter end={resolutionRate} />%</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Timer className="w-4 h-4" style={{ color: "hsl(0,0%,100%)" }} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg. Resolution</p>
            <p className="text-sm font-bold text-foreground">{avgResolutionDays} days</p>
          </div>
        </div>
        {highPriorityCount > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="w-8 h-8 rounded-lg gradient-destructive flex items-center justify-center" style={{ background: "var(--gradient-destructive)" }}>
              <AlertTriangle className="w-4 h-4" style={{ color: "hsl(0,0%,100%)" }} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">High Priority</p>
              <p className="text-sm font-bold text-destructive">{highPriorityCount} open</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className={`stat-card ${stat.cardClass} group`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
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
                  <span className="text-[10px] text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-24 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkline data={stat.sparkData} color={stat.sparkColor} height={48} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1: Trend + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div className="lg:col-span-2 chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Complaint Trends</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Submitted vs resolved over time</p>
            </div>
            <div className="flex bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setTrendView("daily")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${trendView === "daily" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Calendar className="w-3 h-3 inline mr-1" />Daily
              </button>
              <button
                onClick={() => setTrendView("weekly")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${trendView === "weekly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Calendar className="w-3 h-3 inline mr-1" />Weekly
              </button>
            </div>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              {trendView === "daily" ? (
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="gradS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.2} /><stop offset="100%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.2} /><stop offset="100%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" vertical={false} />
                  <XAxis dataKey={trendXKey} tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="submitted" stroke="hsl(220, 70%, 50%)" fill="url(#gradS)" strokeWidth={2.5} name="Submitted" dot={{ r: 3.5, fill: "hsl(220, 70%, 50%)", strokeWidth: 2, stroke: "hsl(0, 0%, 100%)" }} />
                  <Area type="monotone" dataKey="resolved" stroke="hsl(152, 60%, 42%)" fill="url(#gradR)" strokeWidth={2.5} name="Resolved" dot={{ r: 3.5, fill: "hsl(152, 60%, 42%)", strokeWidth: 2, stroke: "hsl(0, 0%, 100%)" }} />
                </AreaChart>
              ) : (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" vertical={false} />
                  <XAxis dataKey={trendXKey} tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="submitted" stroke="hsl(220, 70%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(220, 70%, 50%)", strokeWidth: 2, stroke: "hsl(0, 0%, 100%)" }} name="Submitted" />
                  <Line type="monotone" dataKey="resolved" stroke="hsl(152, 60%, 42%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(152, 60%, 42%)", strokeWidth: 2, stroke: "hsl(0, 0%, 100%)" }} name="Resolved" />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </motion.div>

        {/* Pie chart */}
        <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">Status Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Current complaint breakdown</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none" animationDuration={1000}>
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((d) => {
                  const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                  return (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-foreground font-medium">{d.name}</span>
                      </div>
                      <span className="text-xs font-bold text-foreground">{d.value} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : <EmptyChart height={200} />}
        </motion.div>
      </div>

      {/* Charts row 2: Category + Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">Complaints by Category</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribution across complaint types</p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} layout="vertical" barSize={18} margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} width={85} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} name="Complaints" animationDuration={1200}>
                  {categoryData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart height={260} />}
        </motion.div>

        <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">Priority Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">Complaint severity levels</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priorityData} barSize={52}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" vertical={false} />
              <XAxis dataKey="priority" tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Complaints" animationDuration={1200}>
                {priorityData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent table */}
      <motion.div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Latest Complaints</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Most recent submissions</p>
          </div>
          <Link to="/admin/complaints" className="text-xs text-primary font-semibold hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="table-header">ID</th>
                <th className="table-header">Title</th>
                <th className="table-header hidden md:table-cell">Category</th>
                <th className="table-header">User</th>
                <th className="table-header">Status</th>
                <th className="table-header">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentComplaints.map((c) => {
                const pc: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };
                const sb: Record<string, string> = { Pending: "bg-warning/15 text-warning border-warning/20", "In Progress": "bg-accent/15 text-accent border-accent/20", Resolved: "bg-success/15 text-success border-success/20", Rejected: "bg-destructive/15 text-destructive border-destructive/20" };
                return (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="table-cell font-mono text-primary font-bold">{c.id}</td>
                    <td className="table-cell font-medium text-foreground max-w-[180px] truncate group-hover:text-primary transition-colors">{c.title}</td>
                    <td className="table-cell text-muted-foreground hidden md:table-cell"><span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium">{c.category}</span></td>
                    <td className="table-cell text-muted-foreground">{c.userEmail}</td>
                    <td className="table-cell"><span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sb[c.status]}`}>{c.status}</span></td>
                    <td className={`table-cell font-semibold ${pc[c.priority]}`}>● {c.priority}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
