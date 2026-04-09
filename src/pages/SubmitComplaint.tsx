import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints, CATEGORIES, ComplaintCategory } from "@/contexts/ComplaintContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MapPin, AlignLeft, CheckCircle, Send, Tag, Camera, X, ImageIcon, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SubmitComplaint = () => {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const { addNotification } = useNotifications();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ComplaintCategory>("Others");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
      return false;
    }
    if (cleaned.length > 15) {
      setPhoneError("Phone number is too long");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phone)) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const id = addComplaint({
      title, description, location, category,
      userEmail: user?.email || "",
      phone,
      ...(contactEmail ? { contactEmail } : {}),
      ...(image ? { image } : {}),
    });
    setLoading(false);
    setSuccess(id);
    setTitle("");
    setDescription("");
    setLocation("");
    setCategory("Others");
    setPhone("");
    setContactEmail("");
    setImage(null);
    addNotification({
      title: "Complaint Submitted",
      message: `Your complaint "${title}" (${id}) has been submitted successfully.`,
      type: "success",
      complaintId: id,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="page-header">{t("submit.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("submit.subtitle")}</p>
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
              <p className="font-semibold text-foreground">{t("submit.success")}</p>
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
              <FileText className="w-4 h-4 text-primary" /> {t("submit.field_title")}
            </label>
            <Input placeholder="Brief title of your complaint" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> {t("submit.field_category")}
            </label>
            <Select value={category} onValueChange={(val) => setCategory(val as ComplaintCategory)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-primary" /> {t("submit.field_desc")}
            </label>
            <Textarea placeholder="Describe the issue in detail..." rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {t("submit.field_location")}
            </label>
            <Input placeholder="Where is the issue located?" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> {t("submit.field_phone")} <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. 9876543210"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (phoneError) validatePhone(e.target.value); }}
              required
              className={phoneError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
          </div>

          {/* Email (optional) */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> {t("submit.field_email")}
            </label>
            <Input placeholder="your.email@example.com" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" /> {t("submit.field_image")}
            </label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {image ? (
              <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
                <img src={image} alt="Preview" className="w-full max-h-56 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-destructive/20 transition-colors"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Click to upload image</p>
                <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
              </button>
            )}
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground h-11 gap-2" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {t("submit.submitting")}
              </span>
            ) : (
              <><Send className="w-4 h-4" /> {t("submit.button")}</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
