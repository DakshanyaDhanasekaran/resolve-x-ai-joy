import { useState } from "react";
import { useComplaints, Complaint } from "@/contexts/ComplaintContext";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminComplaints = () => {
  const { complaints, updateStatus } = useComplaints();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses: Complaint["status"][] = ["Pending", "In Progress", "Resolved", "Rejected"];
  const statusBg: Record<string, string> = {
    Pending: "bg-warning/15 text-warning",
    "In Progress": "bg-accent/15 text-accent",
    Resolved: "bg-success/15 text-success",
    Rejected: "bg-destructive/15 text-destructive",
  };
  const priorityColor: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">All Complaints</h1>
        <p className="text-muted-foreground mt-1">Manage and update complaint statuses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...statuses].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "All" && <Filter className="w-3 h-3" />}
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-primary font-bold whitespace-nowrap">{c.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground max-w-[200px] truncate">{c.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{c.location}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.userEmail}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${priorityColor[c.priority]}`}>● {c.priority}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBg[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Select value={c.status} onValueChange={(val) => updateStatus(c.id, val as Complaint["status"])}>
                      <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">No complaints found</div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
