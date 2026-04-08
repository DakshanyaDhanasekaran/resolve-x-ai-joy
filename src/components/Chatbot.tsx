import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const FAQ_BUTTONS = [
  "How to submit a complaint?",
  "How to track my complaint?",
  "What is complaint status?",
  "How long does resolution take?",
  "What are the complaint categories?",
  "How to contact support?",
];

const BOT_RESPONSES: Record<string, string> = {
  "how to submit a complaint?":
    "To submit a complaint:\n\n1️⃣ Go to **Submit Complaint** from the sidebar\n2️⃣ Fill in the title, description, and location\n3️⃣ Select a category and priority level\n4️⃣ Optionally upload an image\n5️⃣ Click **Submit**\n\nYou'll receive a confirmation notification! 🎉",
  "how to track my complaint?":
    "To track your complaints:\n\n1️⃣ Navigate to **Track Complaints** in the sidebar\n2️⃣ You'll see all your submitted complaints\n3️⃣ Use the search bar or filters to find specific ones\n4️⃣ Click on a complaint to see its timeline\n\nYou can monitor status changes in real-time! 📊",
  "what is complaint status?":
    "Complaints go through these stages:\n\n🟡 **Pending** – Submitted, awaiting review\n🔵 **In Progress** – Being actively worked on\n🟢 **Resolved** – Issue has been fixed\n🔴 **Rejected** – Could not be processed\n\nYou'll get notified whenever the status changes!",
  "how long does resolution take?":
    "Resolution times vary by priority:\n\n⚡ **High Priority** – 1-2 business days\n⏳ **Medium Priority** – 3-5 business days\n📅 **Low Priority** – 5-7 business days\n\nComplex issues may take longer. Check your complaint timeline for updates!",
  "what are the complaint categories?":
    "Available categories include:\n\n🔧 **Maintenance** – Facility repairs\n⚡ **Electrical** – Power/wiring issues\n💧 **Plumbing** – Water-related problems\n🧹 **Sanitation** – Cleanliness concerns\n🔒 **Security** – Safety issues\n📋 **Others** – General complaints\n\nSelect the most relevant category when submitting!",
  "how to contact support?":
    "You can reach support through:\n\n📧 **Email**: support@resolvex.com\n📞 **Phone**: 1-800-RESOLVE\n💬 **Chat**: You're already here! 😄\n\nFor emergencies, check the **Emergency Contacts** section on your dashboard.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key.replace("?", "").slice(0, 15))) return value;
  }
  const keywords: Record<string, string> = {
    submit: BOT_RESPONSES["how to submit a complaint?"],
    track: BOT_RESPONSES["how to track my complaint?"],
    status: BOT_RESPONSES["what is complaint status?"],
    time: BOT_RESPONSES["how long does resolution take?"],
    long: BOT_RESPONSES["how long does resolution take?"],
    categor: BOT_RESPONSES["what are the complaint categories?"],
    contact: BOT_RESPONSES["how to contact support?"],
    support: BOT_RESPONSES["how to contact support?"],
    help: "I can help you with:\n\n• Submitting complaints\n• Tracking complaint status\n• Understanding resolution times\n• Complaint categories\n• Contacting support\n\nTry asking one of the quick questions below! 👇",
    hello: "Hello! 👋 I'm the Resolve X assistant. How can I help you today? Try one of the quick questions below!",
    hi: "Hi there! 👋 I'm here to help with your complaints. What would you like to know?",
  };
  for (const [key, value] of Object.entries(keywords)) {
    if (lower.includes(key)) return value;
  }
  return "I'm not sure about that. Try asking about:\n\n• How to submit a complaint\n• How to track complaints\n• Complaint statuses\n• Resolution times\n\nOr click one of the quick buttons below! 💡";
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! 👋 I'm the Resolve X assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const botMsg: Message = {
        id: `msg-${Date.now()}-bot`,
        text: response,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
            style={{ boxShadow: "var(--shadow-elevated)", height: "min(520px, calc(100vh - 10rem))" }}
          >
            {/* Header */}
            <div className="gradient-primary px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary-foreground">Resolve X Assistant</p>
                <p className="text-[11px] text-primary-foreground/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                <X className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === "bot" ? "bg-primary/10" : "gradient-primary"
                  }`}>
                    {msg.sender === "bot" ? (
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-primary-foreground" />
                    )}
                  </div>
                  <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>
                        {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={j}>{part.slice(2, -2)}</strong>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                        {i < msg.text.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick buttons */}
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap max-h-20 overflow-y-auto">
              {FAQ_BUTTONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <ChevronRight className="w-3 h-3" />
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border px-3 py-2.5 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 text-sm bg-muted rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-40 hover:shadow-md transition-shadow"
              >
                <Send className="w-4 h-4 text-primary-foreground" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
