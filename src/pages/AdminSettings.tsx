import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, LANGUAGE_OPTIONS } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Settings, User, Globe, Bell, Shield, Palette, Save, Check,
  Monitor, Moon, Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [statusNotif, setStatusNotif] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [theme, setTheme] = useState("system");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = () => {
    toast({ title: t("settings.saved"), description: t("settings.saved_desc") });
  };

  const sections = [
    {
      icon: User,
      titleKey: "settings.profile",
      descKey: "settings.profile_desc",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("settings.name")}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("settings.email")}</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("settings.role")}</label>
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-bold uppercase tracking-wide">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Globe,
      titleKey: "settings.language",
      descKey: "settings.language_desc",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("settings.select_language")}</label>
            <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    <span className="flex items-center gap-2">{l.flag} {l.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      titleKey: "settings.notifications",
      descKey: "settings.notifications_desc",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("settings.email_notif")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.email_notif_desc")}</p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("settings.push_notif")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.push_notif_desc")}</p>
            </div>
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("settings.status_notif")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.status_notif_desc")}</p>
            </div>
            <Switch checked={statusNotif} onCheckedChange={setStatusNotif} />
          </div>
        </div>
      ),
    },
    {
      icon: Shield,
      titleKey: "settings.system",
      descKey: "settings.system_desc",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("settings.auto_assign")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.auto_assign_desc")}</p>
            </div>
            <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
          </div>
        </div>
      ),
    },
    {
      icon: Palette,
      titleKey: "settings.appearance",
      descKey: "settings.appearance_desc",
      content: (
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground mb-1.5 block">{t("settings.theme")}</label>
          <div className="flex gap-3">
            {[
              { value: "light", icon: Sun, label: t("settings.light") },
              { value: "dark", icon: Moon, label: t("settings.dark") },
              { value: "system", icon: Monitor, label: t("settings.system_theme") },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  theme === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                <opt.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{opt.label}</span>
                {theme === opt.value && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Settings className="w-5 h-5" style={{ color: "hsl(0,0%,100%)" }} />
            </div>
            {t("settings.title")}
          </h1>
          <p className="text-muted-foreground mt-1.5">{t("settings.subtitle")}</p>
        </div>
        <Button onClick={handleSave} className="gradient-primary text-primary-foreground gap-2 h-11 px-5">
          <Save className="w-4 h-4" /> {t("settings.save")}
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.titleKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{t(section.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground">{t(section.descKey)}</p>
                </div>
              </div>
              {section.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;
