import { motion } from "framer-motion";
import { Phone, Shield, Flame, Truck, Building2, AlertTriangle } from "lucide-react";

const contacts = [
  { name: "Police", number: "100", icon: Shield, color: "bg-blue-500/15 text-blue-600", ringColor: "ring-blue-500/20" },
  { name: "Ambulance", number: "108", icon: Truck, color: "bg-red-500/15 text-red-600", ringColor: "ring-red-500/20" },
  { name: "Fire Service", number: "101", icon: Flame, color: "bg-orange-500/15 text-orange-600", ringColor: "ring-orange-500/20" },
  { name: "Local Authority", number: "1800-XXX-XXXX", icon: Building2, color: "bg-purple-500/15 text-purple-600", ringColor: "ring-purple-500/20" },
];

const EmergencyContacts = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="bg-card border border-destructive/20 rounded-xl overflow-hidden"
    style={{ boxShadow: "0 0 20px hsl(0 72% 55% / 0.06)" }}
  >
    <div className="px-5 py-4 border-b border-destructive/15 bg-destructive/5 flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-lg bg-destructive/15 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Emergency Contacts</h3>
        <p className="text-[11px] text-muted-foreground">For urgent assistance, call immediately</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
      {contacts.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 border border-border hover:border-destructive/30 hover:shadow-sm transition-all group"
        >
          <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center ring-2 ${c.ringColor} group-hover:scale-110 transition-transform`}>
            <c.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{c.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{c.number}</p>
          </div>
          <a
            href={`tel:${c.number}`}
            className="w-9 h-9 rounded-lg bg-success/15 text-success flex items-center justify-center hover:bg-success hover:text-success-foreground transition-all shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-4 h-4" />
          </a>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default EmergencyContacts;
