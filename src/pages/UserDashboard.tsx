import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, AlertTriangle, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const userComplaints = complaints.filter((c) => c.userEmail === user?.email);
  const pending = userComplaints.filter((c) => c.status === "Pending").length;
  const inProgress = userComplaints.filter((c) => c.status === "In Progress").length;
  const resolved = userComplaints.filter((c) => c.status === "Resolved").length;

  const stats = [
    { label: "Total Complaints", value: userComplaints.length, icon: FileText, color: "text-primary" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning" },
    { label: "In Progress", value: inProgress, icon: AlertTriangle, color: "text-accent" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-success" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className="stat-card" variants={cardVariants} initial="hidden" animate="visible" custom={i}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent complaints */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Complaints</h2>
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
              <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.id} · {c.location}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>
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
