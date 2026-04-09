import { useParams, Link } from "react-router-dom";
import { useComplaints, Complaint } from "@/contexts/ComplaintContext";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/pages/UserDashboard";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, MapPin, Calendar, Tag, ImageIcon,
  CheckCircle, AlertTriangle, FileText, User, Phone, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TIMELINE_STEPS = ["Pending", "In Progress", "Resolved"];
const STEP_ICONS: Record<string, React.ElementType> = {
  Pending: Clock,
  "In Progress": AlertTriangle,
  Resolved: CheckCircle,
};
const STEP_COLORS: Record<string, string> = {
  Pending: "bg-warning text-warning-foreground",
  "In Progress": "bg-accent text-accent-foreground",
  Resolved: "bg-success text-success-foreground",
};

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { complaints } = useComplaints();
  const { user } = useAuth();

  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Complaint not found</p>
        <Link to={user?.role === "admin" ? "/admin/complaints" : "/track"}>
          <Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="w-4 h-4" /> Go Back</Button>
        </Link>
      </div>
    );
  }

  const currentIdx = TIMELINE_STEPS.indexOf(complaint.status);
  const isRejected = complaint.status === "Rejected";
  const priorityColor: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to={user?.role === "admin" ? "/admin/complaints" : "/track"}>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to complaints
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono text-primary font-bold">{complaint.id}</span>
                <span className={`text-xs font-semibold ${priorityColor[complaint.priority]}`}>● {complaint.priority}</span>
                <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" />{complaint.category}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground">{complaint.title}</h1>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</h3>
            <p className="text-sm text-foreground leading-relaxed">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Location</p>
                <p className="font-medium text-foreground">{complaint.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Submitted</p>
                <p className="font-medium text-foreground">{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Submitted By</p>
                <p className="font-medium text-foreground">{complaint.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Contact info */}
          {(complaint.phone || complaint.contactEmail) && (
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Contact Information</h3>
              <div className="flex flex-wrap gap-4">
                {complaint.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${complaint.phone}`} className="font-medium text-primary hover:underline">{complaint.phone}</a>
                  </div>
                )}
                {complaint.contactEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${complaint.contactEmail}`} className="font-medium text-primary hover:underline">{complaint.contactEmail}</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {complaint.image && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Attached Image
              </h3>
              <div className="rounded-xl overflow-hidden border border-border bg-muted">
                <img src={complaint.image} alt="Complaint" className="w-full max-h-80 object-cover" />
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Status Timeline</h3>
            <div className="relative pl-6 space-y-6">
              {TIMELINE_STEPS.map((step, i) => {
                const Icon = STEP_ICONS[step];
                const done = !isRejected && i <= currentIdx;
                const active = !isRejected && i === currentIdx;
                const historyEntry = complaint.statusHistory?.find((h) => h.status === step);
                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="relative"
                  >
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`absolute left-[-18px] top-10 w-0.5 h-full ${!isRejected && i < currentIdx ? "bg-primary" : "bg-border"}`} />
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`absolute left-[-24px] w-8 h-8 rounded-full flex items-center justify-center ${
                        done ? STEP_COLORS[step] : "bg-muted text-muted-foreground"
                      } ${active ? "ring-2 ring-offset-2 ring-primary" : ""}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="ml-2">
                        <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{step}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {historyEntry
                            ? new Date(historyEntry.timestamp).toLocaleString()
                            : done && step === "Pending"
                            ? `Submitted on ${new Date(complaint.createdAt).toLocaleDateString()}`
                            : !done
                            ? "Awaiting"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {isRejected && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                  className="relative"
                >
                  <div className="flex items-start gap-3">
                    <div className="absolute left-[-24px] w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center ring-2 ring-offset-2 ring-destructive">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-semibold text-destructive">Rejected</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(complaint.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintDetail;
