import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { StatusBadge } from "@/pages/UserDashboard";
import { motion } from "framer-motion";
import { Search, Clock, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

const TrackComplaints = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const userComplaints = complaints.filter((c) => c.userEmail === user?.email);
  const filtered = userComplaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

  const priorityColor: Record<string, string> = {
    Low: "text-success",
    Medium: "text-warning",
    High: "text-destructive",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Track Complaints</h1>
        <p className="text-muted-foreground mt-1">Monitor the status of your submitted complaints</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Complaint cards */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground" style={{ boxShadow: "var(--shadow-card)" }}>
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No complaints found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary font-bold">{c.id}</span>
                    <span className={`text-xs font-semibold ${priorityColor[c.priority]}`}>● {c.priority}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={c.status} />
                  {c.updatedAt !== c.createdAt && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Updated {new Date(c.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackComplaints;
