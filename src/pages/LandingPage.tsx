import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, User, ShieldCheck, ArrowRight, BarChart3, Zap, Clock, Rocket, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, LANGUAGE_OPTIONS } from "@/contexts/LanguageContext";

const LandingPage = () => {
  const { t, language, setLanguage } = useLanguage();

  const features = [
    { icon: Zap, title: "AI-Powered", desc: "Intelligent complaint routing and priority assignment" },
    { icon: BarChart3, title: "Real-time Analytics", desc: "Track trends and performance with live dashboards" },
    { icon: Clock, title: "Fast Resolution", desc: "Streamlined workflows for quicker complaint handling" },
  ];

  const futureFeatures = [
    { key: "future.aadhaar", icon: "🆔" },
    { key: "future.email_notif", icon: "📧" },
    { key: "future.ai_chatbot", icon: "🤖" },
    { key: "future.real_backend", icon: "🗄️" },
    { key: "future.mobile_app", icon: "📱" },
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
          {/* Language selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  language === lang.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground">{t("landing.signin")}</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gradient-primary text-primary-foreground">{t("landing.getstarted")}</Button>
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
            {t("landing.title")} <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>{t("landing.highlight")}</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
            {t("landing.subtitle")}
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
              <h3 className="text-lg font-bold text-foreground mb-1">{t("landing.user_login")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("landing.user_desc")}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                {t("common.continue")} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          <Link to="/admin-login" className="w-full sm:w-auto">
            <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[260px]">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-md">
                <ShieldCheck className="w-7 h-7" style={{ color: "hsl(0, 0%, 100%)" }} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{t("landing.admin_login")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("landing.admin_desc")}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                {t("common.continue")} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
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

      {/* Future roadmap */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-2xl p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Rocket className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">{t("future.title")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureFeatures.map((f) => (
              <div key={f.key} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm font-medium text-foreground">{t(f.key)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Resolve X. AI-Driven Complaint Management System.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
