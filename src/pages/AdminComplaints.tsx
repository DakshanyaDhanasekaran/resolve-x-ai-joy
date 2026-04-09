import { useState, useMemo } from "react";
import { useComplaints, Complaint, CATEGORIES } from "@/contexts/ComplaintContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Tag, ImageIcon, X, Eye, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardSkeleton from "@/components/DashboardSkeleton";

type SortKey = "id" | "title" | "priority" | "status" | "createdAt";
type SortDir = "asc" | "desc";

const PRIORITY_ORDER: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
const STATUS_ORDER: Record<string, number> = { Pending: 1, "In Progress": 2, Resolved: 3, Rejected: 4 };

const AdminComplaints = () => {
  const { complaints, updateStatus, isLoading } = useComplaints();
  const { addNotification } = useNotifications();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [imageModal, setImageModal] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = complaints.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone || "").includes(search);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchCategory = categoryFilter === "All" || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id": cmp = a.id.localeCompare(b.id); break;
        case "title": cmp = a.title.localeCompare(b.title); break;
        case "priority": cmp = (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0); break;
        case "status": cmp = (STATUS_ORDER[a.status] || 0) - (STATUS_ORDER[b.status] || 0); break;
        case "createdAt": cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [complaints, search, statusFilter, categoryFilter, sortKey, sortDir]);

  if (isLoading) return <DashboardSkeleton />;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />;
  };

  const handleStatusChange = (id: string, newStatus: Complaint["status"], title: string) => {
    updateStatus(id, newStatus);
    addNotification({
      title: "Status Updated",
      message: `Complaint "${title}" (${id}) status changed to ${newStatus}.`,
      type: newStatus === "Resolved" ? "success" : newStatus === "Rejected" ? "error" : "info",
      complaintId: id,
    });
  };

  const statuses: Complaint["status"][] = ["Pending", "In Progress", "Resolved", "Rejected"];
  const statusBg: Record<string, string> = {
    Pending: "bg-warning/15 text-warning", "In Progress": "bg-accent/15 text-accent",
    Resolved: "bg-success/15 text-success", Rejected: "bg-destructive/15 text-destructive",
  };
  const priorityColor: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">{t("nav.all_complaints")}</h1>
        <p className="text-muted-foreground mt-1">Manage, filter, and update complaint statuses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by title, ID, user, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <Tag className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[t("common.all"), ...statuses].map((s, i) => (
            <button
              key={s}
              onClick={() => setStatusFilter(i === 0 ? "All" : s)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-1 ${
                statusFilter === (i === 0 ? "All" : s) ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {i === 0 && <Filter className="w-3 h-3" />}
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} complaint{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th onClick={() => toggleSort("id")} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1">ID <SortIcon column="id" /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">IMG</th>
                <th onClick={() => toggleSort("title")} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1">Title <SortIcon column="title" /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User / Contact</th>
                <th onClick={() => toggleSort("priority")} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1">Priority <SortIcon column="priority" /></span>
                </th>
                <th onClick={() => toggleSort("status")} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1">Status <SortIcon column="status" /></span>
                </th>
                <th onClick={() => toggleSort("createdAt")} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors hidden sm:table-cell">
                  <span className="flex items-center gap-1">Date <SortIcon column="createdAt" /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono text-primary font-bold whitespace-nowrap">{c.id}</td>
                  <td className="px-4 py-3">
                    {c.image ? (
                      <button
                        onClick={() => setImageModal(c.image!)}
                        className="w-10 h-10 rounded-lg overflow-hidden border border-border hover:border-primary/40 hover:shadow-md transition-all group relative"
                      >
                        <img src={c.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                          <Eye className="w-3 h-3 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground max-w-[160px] truncate">{c.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium">{c.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground">{c.userEmail}</div>
                    {c.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground/70 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${c.phone}`} className="hover:text-primary">{c.phone}</a>
                      </div>
                    )}
                    {c.contactEmail && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground/70 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{c.contactEmail}</span>
                      </div>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold ${priorityColor[c.priority]}`}>● {c.priority}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBg[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Select value={c.status} onValueChange={(val) => handleStatusChange(c.id, val as Complaint["status"], c.title)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs">
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
          <div className="p-12 text-center text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t("track.no_results")}</p>
            <p className="text-xs mt-1">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setImageModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setImageModal(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <img src={imageModal} alt="Complaint" className="max-w-full max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminComplaints;
