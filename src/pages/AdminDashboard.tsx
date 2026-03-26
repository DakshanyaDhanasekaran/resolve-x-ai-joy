import { useComplaints } from "@/contexts/ComplaintContext";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { complaints } = useComplaints();
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const stats = [
    { label: "Total Complaints", value: total, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "In Progress", value: inProgress, icon: AlertTriangle, color: "text-accent", bg: "bg-accent/10" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  ];

  const recentComplaints = complaints.slice(0, 5);

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
