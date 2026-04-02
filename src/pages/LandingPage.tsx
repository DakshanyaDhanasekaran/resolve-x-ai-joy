import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, User, ShieldCheck, ArrowRight, BarChart3, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const features = [
    { icon: Zap, title: "AI-Powered", desc: "Intelligent complaint routing and priority assignment" },
    { icon: BarChart3, title: "Real-time Analytics", desc: "Track trends and performance with live dashboards" },
    { icon: Clock, title: "Fast Resolution", desc: "Streamlined workflows for quicker complaint handling" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5" style={{ color: "hsl(0, 0%, 100%)" }} />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Resolve X</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gradient-primary text-primary-foreground">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" /> AI-Driven Complaint Management
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight max-w-3xl mx-auto">
            Resolve complaints <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>faster & smarter</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
            Submit, track, and manage complaints with an intelligent platform designed for seamless resolution.
          </p>
        </motion.div>

        {/* Login options */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/login" className="w-full sm:w-auto">
            <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[260px]">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <User className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Login as User</h3>
              <p className="text-sm text-muted-foreground mb-4">Submit and track your complaints</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                Continue <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          <Link to="/admin-login" className="w-full sm:w-auto">
            <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[260px]">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-md">
                <ShieldCheck className="w-7 h-7" style={{ color: "hsl(0, 0%, 100%)" }} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Login as Admin</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage and resolve all complaints</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                Continue <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-primary/20 transition-all"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Resolve X. AI-Driven Complaint Management System.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
