import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints, Complaint } from "@/contexts/ComplaintContext";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/pages/UserDashboard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, MapPin, Calendar, Tag, ImageIcon, X, CheckCircle, AlertTriangle, FileText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardSkeleton from "@/components/DashboardSkeleton";

const TIMELINE_STEPS = ["Pending", "In Progress", "Resolved"];
const STEP_ICONS: Record<string, React.ElementType> = {
  "Pending": Clock,
  "In Progress": AlertTriangle,
  "Resolved": CheckCircle,
};
const STEP_COLORS: Record<string, string> = {
  "Pending": "bg-warning text-warning-foreground",
  "In Progress": "bg-accent text-accent-foreground",
  "Resolved": "bg-success text-success-foreground",
};

const StatusTimeline = ({ complaint }: { complaint: Complaint }) => {
  const currentIdx = TIMELINE_STEPS.indexOf(complaint.status);
  const isRejected = complaint.status === "Rejected";

  return (
    <div className="flex items-center gap-0 mt-4">
      {TIMELINE_STEPS.map((step, i) => {
        const Icon = STEP_ICONS[step];
        const done = !isRejected && i <= currentIdx;
        const active = !isRejected && i === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                done ? STEP_COLORS[step] : "bg-muted text-muted-foreground"
              } ${active ? "ring-2 ring-offset-2 ring-primary" : ""}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-1.5 font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mt-[-14px] rounded-full ${
                !isRejected && i < currentIdx ? "bg-primary" : "bg-border"
              }`} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <div className="flex flex-col items-center ml-2">
          <div className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center ring-2 ring-offset-2 ring-destructive">
            <X className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-1.5 font-medium text-destructive">Rejected</span>
        </div>
      )}
    </div>
  );
};

const TrackComplaints = () => {
  const { user } = useAuth();
  const { complaints, isLoading } = useComplaints();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  if (isLoading) return <DashboardSkeleton />;

  const userComplaints = complaints.filter((c) => c.userEmail === user?.email);
  const filtered = userComplaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["All", "Pending", "In Progress", "Resolved", "Rejected"];
  const priorityColor: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Track Complaints</h1>
        <p className="text-muted-foreground mt-1">Monitor the status of your submitted complaints</p>
      </div>

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
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                statusFilter === s ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} complaint{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground" style={{ boxShadow: "var(--shadow-card)" }}>
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No complaints found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
              style={{ boxShadow: "var(--shadow-card)" }}
              onClick={() => setSelectedComplaint(selectedComplaint?.id === c.id ? null : c)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-primary font-bold">{c.id}</span>
                    <span className={`text-xs font-semibold ${priorityColor[c.priority]}`}>● {c.priority}</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />{c.category}
                    </span>
                    {c.image && (
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-xs font-medium text-primary flex items-center gap-1">
                        <ImageIcon className="w-2.5 h-2.5" /> Image
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={c.status} />
                  <Link to={`/complaint/${c.id}`} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline" onClick={(e) => e.stopPropagation()}>
                    View details <ExternalLink className="w-3 h-3" />
                  </Link>
                  {c.updatedAt !== c.createdAt && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Updated {new Date(c.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {selectedComplaint?.id === c.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                      {c.image && (
                        <div className="rounded-xl overflow-hidden border border-border bg-muted">
                          <img src={c.image} alt="Complaint" className="w-full max-h-64 object-cover" />
                        </div>
                      )}
                      <StatusTimeline complaint={c} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackComplaints;
