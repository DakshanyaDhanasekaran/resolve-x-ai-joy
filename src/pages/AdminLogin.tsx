import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (email.toLowerCase() !== "admin@gmail.com") {
      setLoading(false);
      setError("Access denied. This login is for administrators only.");
      return;
    }

    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ background: "linear-gradient(135deg, hsl(220, 40%, 10%), hsl(220, 60%, 18%))" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8" style={{ color: "hsl(0, 0%, 100%)" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "hsl(0, 0%, 100%)" }}>Admin Portal</h1>
              <p className="text-sm" style={{ color: "hsl(220, 15%, 55%)" }}>Resolve X Management</p>
            </div>
          </div>
          <p className="text-lg font-medium mb-4" style={{ color: "hsl(220, 15%, 80%)" }}>
            Manage complaints, view analytics, and oversee the entire resolution process.
          </p>
          <div className="space-y-3 mt-8">
            {["Full complaint management", "Real-time analytics dashboard", "Status updates & notifications"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm" style={{ color: "hsl(220, 15%, 65%)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" style={{ color: "hsl(0, 0%, 100%)" }} />
            </div>
            <span className="text-2xl font-bold text-foreground">Admin Portal</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator Access
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Admin Sign In</h2>
          <p className="text-muted-foreground mb-8">Access the management dashboard</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="admin@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground h-11" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In as Admin</span>
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Not an admin? <Link to="/login" className="text-primary font-medium hover:underline">User Login</Link>
          </p>

          <div className="mt-8 p-4 rounded-lg bg-muted text-xs text-muted-foreground">
            <p className="font-medium mb-1">Admin Credentials:</p>
            <p>Email: admin@gmail.com / Password: any (min 4 chars)</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
