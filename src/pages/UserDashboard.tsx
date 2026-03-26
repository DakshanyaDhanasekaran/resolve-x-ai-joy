import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Clock, CheckCircle, AlertTriangle, Plus, ArrowRight,
  TrendingUp, TrendingDown, Minus, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Sparkline from "@/components/Sparkline";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const UserDashboard = () => {
  const { user } = useAuth();
  const { complaints, isLoading } = useComplaints();

  if (isLoading) return <DashboardSkeleton />;

  const userComplaints = complaints.filter((c) => c.userEmail === user?.email);
  const pending = userComplaints.filter((c) => c.status === "Pending").length;
  const inProgress = userComplaints.filter((c) => c.status === "In Progress").length;
  const resolved = userComplaints.filter((c) => c.status === "Resolved").length;

  // Simulated percentage changes
  const stats = [
    {
      label: "Total Complaints", value: userComplaints.length, icon: FileText,
      color: "text-primary", bg: "bg-primary/10",
      change: 12, sparkData: [1, 2, 1, 3, 2, 4, 3], sparkColor: "hsl(220, 70%, 50%)"
    },
    {
      label: "Pending", value: pending, icon: Clock,
      color: "text-warning", bg: "bg-warning/10",
      change: -5, sparkData: [3, 2, 4, 3, 2, 1, 2], sparkColor: "hsl(38, 92%, 55%)"
    },
    {
      label: "In Progress", value: inProgress, icon: AlertTriangle,
      color: "text-accent", bg: "bg-accent/10",
      change: 0, sparkData: [1, 1, 2, 1, 2, 2, 1], sparkColor: "hsl(200, 80%, 50%)"
    },
    {
      label: "Resolved", value: resolved, icon: CheckCircle,
      color: "text-success", bg: "bg-success/10",
      change: 25, sparkData: [0, 1, 1, 2, 2, 3, 4], sparkColor: "hsl(152, 60%, 42%)"
    },
  ];

  // Status pie data
  const pieData = [
    { name: "Pending", value: pending, color: "hsl(38, 92%, 55%)" },
    { name: "In Progress", value: inProgress, color: "hsl(200, 80%, 50%)" },
    { name: "Resolved", value: resolved, color: "hsl(152, 60%, 42%)" },
  ].filter((d) => d.value > 0);

  // Category breakdown
  const categoryMap = new Map<string, number>();
  userComplaints.forEach((c) => {
    categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));

  const ChangeIndicator = ({ change }: { change: number }) => {
    if (change > 0) return <span className="flex items-center gap-0.5 text-xs font-semibold text-success"><TrendingUp className="w-3 h-3" />+{change}%</span>;
    if (change < 0) return <span className="flex items-center gap-0.5 text-xs font-semibold text-destructive"><TrendingDown className="w-3 h-3" />{change}%</span>;
    return <span className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground"><Minus className="w-3 h-3" />0%</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Welcome back, {user?.name} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your complaints</p>
        </div>
        <Link to="/submit">
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> New Complaint
          </Button>
        </Link>
      </div>

      {/* Stat cards with sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-foreground leading-none">{stat.value}</p>
                <div className="mt-1.5">
                  <ChangeIndicator change={stat.change} />
                </div>
              </div>
              <div className="w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                <Sparkline data={stat.sparkData} color={stat.sparkColor} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Status overview */}
        <motion.div
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Status Overview</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 15%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-bold text-foreground ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
          )}
        </motion.div>

        {/* Category breakdown */}
        <motion.div
          className="lg:col-span-3 bg-card border border-border rounded-xl p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" /> By Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="space-y-3">
              {categoryData.map((cat) => {
                const pct = userComplaints.length > 0 ? (cat.count / userComplaints.length) * 100 : 0;
                return (
                  <div key={cat.name} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground font-medium">{cat.name}</span>
                      <span className="text-xs text-muted-foreground">{cat.count} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No complaints submitted yet</p>
          )}
        </motion.div>
      </div>

      {/* Recent complaints */}
      <motion.div
        className="bg-card border border-border rounded-xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Recent Complaints</h2>
          <Link to="/track" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {userComplaints.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No complaints yet. Submit your first complaint!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {userComplaints.slice(0, 5).map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.id} · {c.category} · {c.location}</p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-warning/15 text-warning",
    "In Progress": "bg-accent/15 text-accent",
    Resolved: "bg-success/15 text-success",
    Rejected: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
};

export default UserDashboard;
