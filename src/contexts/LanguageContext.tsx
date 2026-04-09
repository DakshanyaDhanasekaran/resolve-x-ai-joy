import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Language = "en" | "ta" | "hi";

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", ta: "டாஷ்போர்டு", hi: "डैशबोर्ड" },
  "nav.submit": { en: "Submit Complaint", ta: "புகார் அளிக்க", hi: "शिकायत दर्ज करें" },
  "nav.track": { en: "Track Complaints", ta: "புகார்களை கண்காணிக்க", hi: "शिकायत ट्रैक करें" },
  "nav.all_complaints": { en: "All Complaints", ta: "அனைத்து புகார்கள்", hi: "सभी शिकायतें" },
  "nav.analytics": { en: "Analytics", ta: "பகுப்பாய்வு", hi: "विश्लेषण" },
  "nav.settings": { en: "Settings", ta: "அமைப்புகள்", hi: "सेटिंग्स" },
  "nav.logout": { en: "Logout", ta: "வெளியேறு", hi: "लॉग आउट" },
  "nav.navigation": { en: "Navigation", ta: "வழிசெலுத்தல்", hi: "नेविगेशन" },

  // Landing
  "landing.title": { en: "Resolve complaints", ta: "புகார்களை தீர்க்கவும்", hi: "शिकायतों का समाधान करें" },
  "landing.highlight": { en: "faster & smarter", ta: "வேகமாக & புத்திசாலியாக", hi: "तेज़ और स्मार्ट" },
  "landing.subtitle": { en: "Submit, track, and manage complaints with an intelligent platform designed for seamless resolution.", ta: "தடையில்லா தீர்வுக்காக வடிவமைக்கப்பட்ட நுண்ணறிவு தளத்துடன் புகார்களை சமர்ப்பிக்கவும், கண்காணிக்கவும், நிர்வகிக்கவும்.", hi: "निर्बाध समाधान के लिए डिज़ाइन किए गए बुद्धिमान प्लेटफॉर्म के साथ शिकायतें दर्ज करें, ट्रैक करें और प्रबंधित करें।" },
  "landing.user_login": { en: "Login as User", ta: "பயனராக உள்நுழை", hi: "उपयोगकर्ता के रूप में लॉगिन" },
  "landing.admin_login": { en: "Login as Admin", ta: "நிர்வாகியாக உள்நுழை", hi: "एडमिन के रूप में लॉगिन" },
  "landing.user_desc": { en: "Submit and track your complaints", ta: "உங்கள் புகார்களை சமர்ப்பிக்கவும் கண்காணிக்கவும்", hi: "अपनी शिकायतें दर्ज करें और ट्रैक करें" },
  "landing.admin_desc": { en: "Manage and resolve all complaints", ta: "அனைத்து புகார்களையும் நிர்வகிக்கவும் தீர்க்கவும்", hi: "सभी शिकायतों का प्रबंधन और समाधान करें" },
  "landing.signin": { en: "Sign In", ta: "உள்நுழை", hi: "साइन इन" },
  "landing.getstarted": { en: "Get Started", ta: "தொடங்கு", hi: "शुरू करें" },

  // Dashboard
  "dash.welcome": { en: "Welcome back", ta: "மீண்டும் வரவேற்கிறோம்", hi: "वापसी पर स्वागत है" },
  "dash.overview": { en: "Here's an overview of your complaints", ta: "உங்கள் புகார்களின் கண்ணோட்டம்", hi: "आपकी शिकायतों का अवलोकन" },
  "dash.new_complaint": { en: "New Complaint", ta: "புதிய புகார்", hi: "नई शिकायत" },
  "dash.total": { en: "Total Complaints", ta: "மொத்த புகார்கள்", hi: "कुल शिकायतें" },
  "dash.pending": { en: "Pending", ta: "நிலுவையில்", hi: "लंबित" },
  "dash.in_progress": { en: "In Progress", ta: "நடைபெறுகிறது", hi: "प्रगति में" },
  "dash.resolved": { en: "Resolved", ta: "தீர்க்கப்பட்டது", hi: "हल किया गया" },
  "dash.recent": { en: "Recent Complaints", ta: "சமீபத்திய புகார்கள்", hi: "हाल की शिकायतें" },
  "dash.view_all": { en: "View all", ta: "அனைத்தையும் காண", hi: "सभी देखें" },
  "dash.no_complaints": { en: "No complaints yet", ta: "இன்னும் புகார்கள் இல்லை", hi: "अभी तक कोई शिकायत नहीं" },
  "dash.resolution_rate": { en: "Resolution Rate", ta: "தீர்வு விகிதம்", hi: "समाधान दर" },
  "dash.avg_resolution": { en: "Avg. Resolution", ta: "சராசரி தீர்வு", hi: "औसत समाधान" },
  "dash.status_overview": { en: "Status Overview", ta: "நிலை கண்ணோட்டம்", hi: "स्थिति अवलोकन" },
  "dash.by_category": { en: "By Category", ta: "வகை வாரியாக", hi: "श्रेणी अनुसार" },
  "dash.your_activity": { en: "Your Activity", ta: "உங்கள் செயல்பாடு", hi: "आपकी गतिविधि" },

  // Submit
  "submit.title": { en: "Submit a Complaint", ta: "ஒரு புகார் அளிக்கவும்", hi: "शिकायत दर्ज करें" },
  "submit.subtitle": { en: "Describe your issue and we'll handle the rest", ta: "உங்கள் பிரச்சினையை விவரிக்கவும், மீதியை நாங்கள் கவனிப்போம்", hi: "अपनी समस्या का वर्णन करें और बाकी हम संभालेंगे" },
  "submit.field_title": { en: "Title", ta: "தலைப்பு", hi: "शीर्षक" },
  "submit.field_desc": { en: "Description", ta: "விளக்கம்", hi: "विवरण" },
  "submit.field_location": { en: "Location", ta: "இடம்", hi: "स्थान" },
  "submit.field_category": { en: "Category", ta: "வகை", hi: "श्रेणी" },
  "submit.field_phone": { en: "Phone Number", ta: "தொலைபேசி எண்", hi: "फ़ोन नंबर" },
  "submit.field_email": { en: "Email (optional)", ta: "மின்னஞ்சல் (விருப்பம்)", hi: "ईमेल (वैकल्पिक)" },
  "submit.field_image": { en: "Attach Image (optional)", ta: "படம் இணைக்க (விருப்பம்)", hi: "छवि संलग्न करें (वैकल्पिक)" },
  "submit.button": { en: "Submit Complaint", ta: "புகார் அளிக்கவும்", hi: "शिकायत दर्ज करें" },
  "submit.submitting": { en: "Submitting...", ta: "சமர்ப்பிக்கிறது...", hi: "प्रस्तुत हो रहा है..." },
  "submit.success": { en: "Complaint submitted successfully!", ta: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!", hi: "शिकायत सफलतापूर्वक दर्ज की गई!" },

  // Track
  "track.title": { en: "Track Complaints", ta: "புகார்களை கண்காணிக்க", hi: "शिकायत ट्रैक करें" },
  "track.subtitle": { en: "Monitor the status of your submitted complaints", ta: "உங்கள் சமர்ப்பிக்கப்பட்ட புகார்களின் நிலையை கண்காணிக்கவும்", hi: "अपनी दर्ज की गई शिकायतों की स्थिति देखें" },
  "track.search": { en: "Search by title or ID...", ta: "தலைப்பு அல்லது ID மூலம் தேடுங்கள்...", hi: "शीर्षक या ID से खोजें..." },
  "track.view_details": { en: "View details", ta: "விவரங்கள் காண", hi: "विवरण देखें" },
  "track.no_results": { en: "No complaints found", ta: "புகார்கள் இல்லை", hi: "कोई शिकायत नहीं मिली" },

  // Admin
  "admin.dashboard": { en: "Admin Dashboard", ta: "நிர்வாக டாஷ்போர்டு", hi: "एडमिन डैशबोर्ड" },
  "admin.realtime": { en: "Real-time analytics and complaint management", ta: "நிகழ்நேர பகுப்பாய்வு மற்றும் புகார் மேலாண்மை", hi: "रीयल-टाइम एनालिटिक्स और शिकायत प्रबंधन" },
  "admin.manage_all": { en: "Manage All", ta: "அனைத்தையும் நிர்வகி", hi: "सभी प्रबंधित करें" },
  "admin.complaint_trends": { en: "Complaint Trends", ta: "புகார் போக்குகள்", hi: "शिकायत रुझान" },
  "admin.status_distribution": { en: "Status Distribution", ta: "நிலை விநியோகம்", hi: "स्थिति वितरण" },
  "admin.by_category": { en: "Complaints by Category", ta: "வகை வாரியாக புகார்கள்", hi: "श्रेणी अनुसार शिकायतें" },
  "admin.priority_breakdown": { en: "Priority Breakdown", ta: "முன்னுரிமை பிரிவு", hi: "प्राथमिकता विश्लेषण" },
  "admin.latest": { en: "Latest Complaints", ta: "சமீபத்திய புகார்கள்", hi: "नवीनतम शिकायतें" },

  // Emergency
  "emergency.title": { en: "Emergency Contacts", ta: "அவசர தொடர்புகள்", hi: "आपातकालीन संपर्क" },
  "emergency.police": { en: "Police", ta: "காவல்துறை", hi: "पुलिस" },
  "emergency.ambulance": { en: "Ambulance", ta: "ஆம்புலன்ஸ்", hi: "एम्बुलेंस" },
  "emergency.fire": { en: "Fire Service", ta: "தீயணைப்பு சேவை", hi: "अग्निशमन सेवा" },
  "emergency.women": { en: "Women Helpline", ta: "பெண்கள் உதவி எண்", hi: "महिला हेल्पलाइन" },

  // Notifications
  "notif.title": { en: "Notifications", ta: "அறிவிப்புகள்", hi: "सूचनाएँ" },
  "notif.mark_read": { en: "Mark all read", ta: "அனைத்தையும் படித்ததாக குறி", hi: "सभी को पढ़ा हुआ चिह्नित करें" },
  "notif.empty": { en: "No notifications yet", ta: "இன்னும் அறிவிப்புகள் இல்லை", hi: "अभी तक कोई सूचना नहीं" },

  // Common
  "common.all": { en: "All", ta: "அனைத்தும்", hi: "सभी" },
  "common.continue": { en: "Continue", ta: "தொடரவும்", hi: "जारी रखें" },
  "common.days": { en: "days", ta: "நாட்கள்", hi: "दिन" },
  "common.vs_last_week": { en: "vs last week", ta: "கடந்த வாரம் vs", hi: "पिछले सप्ताह बनाम" },

  // Future
  "future.title": { en: "Coming Soon", ta: "விரைவில் வரும்", hi: "जल्द आ रहा है" },
  "future.aadhaar": { en: "Aadhaar / e-Sevai Integration", ta: "ஆதார் / e-Sevai ஒருங்கிணைப்பு", hi: "आधार / e-Sevai एकीकरण" },
  "future.email_notif": { en: "Email Notification System", ta: "மின்னஞ்சல் அறிவிப்பு அமைப்பு", hi: "ईमेल सूचना प्रणाली" },
  "future.ai_chatbot": { en: "Advanced AI Chatbot (NLP)", ta: "மேம்பட்ட AI சாட்பாட் (NLP)", hi: "उन्नत AI चैटबॉट (NLP)" },
  "future.real_backend": { en: "Real Backend Database & Auth", ta: "உண்மையான பின்தள தரவுத்தளம் & அங்கீகாரம்", hi: "वास्तविक बैकएंड डेटाबेस और प्रमाणीकरण" },
  "future.mobile_app": { en: "Mobile Application Support", ta: "மொபைல் பயன்பாட்டு ஆதரவு", hi: "मोबाइल एप्लिकेशन सपोर्ट" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const LANGUAGE_OPTIONS: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { value: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("resolve-x-language");
    return (stored as Language) || "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("resolve-x-language", lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || translations[key]?.en || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
