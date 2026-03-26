import { useComplaints } from "@/contexts/ComplaintContext";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";

const AdminDashboard = () => {
  const { complaints } = useComplaints();
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const rejected = complaints.filter((c) => c.status === "Rejected").length;

  const stats = [
    { label: "Total Complaints", value: total, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "In Progress", value: inProgress, icon: AlertTriangle, color: "text-accent", bg: "bg-accent/10" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  ];

  // Status distribution for pie chart
  const pieData = [
    { name: "Pending", value: pending, color: "hsl(38, 92%, 55%)" },
    { name: "In Progress", value: inProgress, color: "hsl(200, 80%, 50%)" },
    { name: "Resolved", value: resolved, color: "hsl(152, 60%, 42%)" },
    { name: "Rejected", value: rejected, color: "hsl(0, 72%, 55%)" },
  ].filter((d) => d.value > 0);

  // Priority distribution for bar chart
  const priorityData = [
    { priority: "High", count: complaints.filter((c) => c.priority === "High").length, fill: "hsl(0, 72%, 55%)" },
    { priority: "Medium", count: complaints.filter((c) => c.priority === "Medium").length, fill: "hsl(38, 92%, 55%)" },
    { priority: "Low", count: complaints.filter((c) => c.priority === "Low").length, fill: "hsl(152, 60%, 42%)" },
  ];

  // Trend data — group by date
  const trendMap = new Map<string, { date: string; submitted: number; resolved: number }>();
  complaints.forEach((c) => {
    const day = new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!trendMap.has(day)) trendMap.set(day, { date: day, submitted: 0, resolved: 0 });
    const entry = trendMap.get(day)!;
    entry.submitted += 1;
    if (c.status === "Resolved") entry.resolved += 1;
  });
  const trendData = Array.from(trendMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const recentComplaints = complaints.slice(0, 5);

  const chartCardClass = "bg-card border border-border rounded-xl p-5";
  const chartShadow = { boxShadow: "var(--shadow-card)" };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of all complaints and system status</p>
        </div>
        <Link to="/admin/complaints">
          <Button className="gradient-primary text-primary-foreground gap-2">
            <TrendingUp className="w-4 h-4" /> View All Complaints
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <div className="mt-2 w-full bg-muted rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${stat.color.replace("text-", "bg-")}`}
                style={{ width: `${total > 0 ? (stat.value / total) * 100 : 0}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Complaint trend area chart */}
        <motion.div
          className={chartCardClass}
          style={chartShadow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-base font-semibold text-foreground mb-4">Complaint Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 15%, 90%)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Area type="monotone" dataKey="submitted" stroke="hsl(220, 70%, 50%)" fill="url(#gradSubmitted)" strokeWidth={2} name="Submitted" />
              <Area type="monotone" dataKey="resolved" stroke="hsl(152, 60%, 42%)" fill="url(#gradResolved)" strokeWidth={2} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status distribution pie chart */}
        <motion.div
          className={chartCardClass}
          style={chartShadow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-base font-semibold text-foreground mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 15%, 90%)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "13px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Priority bar chart */}
      <motion.div
        className={chartCardClass}
        style={chartShadow}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-base font-semibold text-foreground mb-4">Complaints by Priority</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={priorityData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
            <XAxis dataKey="priority" tick={{ fontSize: 13, fill: "hsl(220, 10%, 50%)" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 15%, 90%)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Complaints">
              {priorityData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Complaints</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentComplaints.map((c) => {
                const priorityColor: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };
                const statusBg: Record<string, string> = {
                  Pending: "bg-warning/15 text-warning",
                  "In Progress": "bg-accent/15 text-accent",
                  Resolved: "bg-success/15 text-success",
                  Rejected: "bg-destructive/15 text-destructive",
                };
                return (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-primary font-bold">{c.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{c.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{c.userEmail}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBg[c.status]}`}>{c.status}</span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${priorityColor[c.priority]}`}>● {c.priority}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
