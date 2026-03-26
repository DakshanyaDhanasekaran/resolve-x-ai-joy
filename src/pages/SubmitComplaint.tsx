import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MapPin, AlignLeft, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SubmitComplaint = () => {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const id = addComplaint({ title, description, location, userEmail: user?.email || "" });
    setLoading(false);
    setSuccess(id);
    setTitle("");
    setDescription("");
    setLocation("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="page-header">Submit a Complaint</h1>
        <p className="text-muted-foreground mt-1">Describe your issue and we'll handle the rest</p>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-success/10 border border-success/20 rounded-xl p-5 flex items-start gap-3"
          >
            <CheckCircle className="w-6 h-6 text-success mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Complaint submitted successfully!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your complaint ID is <span className="font-mono font-bold text-primary">{success}</span>. You can track it from the Track Complaints page.
              </p>
            </div>
            <button onClick={() => setSuccess(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Title
            </label>
            <Input placeholder="Brief title of your complaint" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-primary" /> Description
            </label>
            <Textarea placeholder="Describe the issue in detail..." rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Location
            </label>
            <Input placeholder="Where is the issue located?" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground h-11 gap-2" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <><Send className="w-4 h-4" /> Submit Complaint</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
