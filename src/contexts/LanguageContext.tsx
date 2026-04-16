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

  // User Dashboard
  "dash.welcome": { en: "Welcome back", ta: "மீண்டும் வரவேற்கிறோம்", hi: "वापसी पर स्वागत है" },
  "dash.overview": { en: "Here's an overview of your complaints", ta: "உங்கள் புகார்களின் கண்ணோட்டம்", hi: "आपकी शिकायतों का अवलोकन" },
  "dash.new_complaint": { en: "New Complaint", ta: "புதிய புகார்", hi: "नई शिकायत" },
  "dash.total": { en: "Total Complaints", ta: "மொத்த புகார்கள்", hi: "कुल शिकायतें" },
  "dash.pending": { en: "Pending", ta: "நிலுவையில்", hi: "लंबित" },
  "dash.in_progress": { en: "In Progress", ta: "நடைபெறுகிறது", hi: "प्रगति में" },
  "dash.resolved": { en: "Resolved", ta: "தீர்க்கப்பட்டது", hi: "हल किया गया" },
  "dash.rejected": { en: "Rejected", ta: "நிராகரிக்கப்பட்டது", hi: "अस्वीकृत" },
  "dash.recent": { en: "Recent Complaints", ta: "சமீபத்திய புகார்கள்", hi: "हाल की शिकायतें" },
  "dash.view_all": { en: "View all", ta: "அனைத்தையும் காண", hi: "सभी देखें" },
  "dash.no_complaints": { en: "No complaints yet", ta: "இன்னும் புகார்கள் இல்லை", hi: "अभी तक कोई शिकायत नहीं" },
  "dash.no_complaints_sub": { en: "Submit your first complaint to get started", ta: "தொடங்க உங்கள் முதல் புகாரை சமர்ப்பிக்கவும்", hi: "शुरू करने के लिए अपनी पहली शिकायत दर्ज करें" },
  "dash.resolution_rate": { en: "Resolution Rate", ta: "தீர்வு விகிதம்", hi: "समाधान दर" },
  "dash.avg_resolution": { en: "Avg. Resolution", ta: "சராசரி தீர்வு", hi: "औसत समाधान" },
  "dash.status_overview": { en: "Status Overview", ta: "நிலை கண்ணோட்டம்", hi: "स्थिति अवलोकन" },
  "dash.status_overview_desc": { en: "Distribution of your complaint statuses", ta: "உங்கள் புகார் நிலைகளின் விநியோகம்", hi: "आपकी शिकायत स्थितियों का वितरण" },
  "dash.by_category": { en: "By Category", ta: "வகை வாரியாக", hi: "श्रेणी अनुसार" },
  "dash.by_category_desc": { en: "Complaints grouped by type", ta: "வகை வாரியாக குழுவாக்கப்பட்ட புகார்கள்", hi: "प्रकार के अनुसार शिकायतें" },
  "dash.your_activity": { en: "Your Activity", ta: "உங்கள் செயல்பாடு", hi: "आपकी गतिविधि" },
  "dash.your_activity_desc": { en: "Complaints submitted over time", ta: "காலப்போக்கில் சமர்ப்பிக்கப்பட்ட புகார்கள்", hi: "समय के साथ दर्ज शिकायतें" },
  "dash.all_time": { en: "All time", ta: "முழு நேரம்", hi: "कुल समय" },
  "dash.awaiting": { en: "Awaiting review", ta: "மதிப்பாய்வுக்காக காத்திருக்கிறது", hi: "समीक्षा के लिए प्रतीक्षा" },
  "dash.being_handled": { en: "Being handled", ta: "கையாளப்படுகிறது", hi: "कार्रवाई हो रही है" },
  "dash.completed": { en: "Completed", ta: "நிறைவடைந்தது", hi: "पूर्ण" },
  "dash.no_data": { en: "No data yet", ta: "இன்னும் தரவு இல்லை", hi: "अभी तक कोई डेटा नहीं" },
  "dash.no_submitted": { en: "No complaints submitted yet", ta: "இன்னும் புகார்கள் சமர்ப்பிக்கப்படவில்லை", hi: "अभी तक कोई शिकायत दर्ज नहीं" },

  // Submit
  "submit.title": { en: "Submit a Complaint", ta: "ஒரு புகார் அளிக்கவும்", hi: "शिकायत दर्ज करें" },
  "submit.subtitle": { en: "Describe your issue and we'll handle the rest", ta: "உங்கள் பிரச்சினையை விவரிக்கவும், மீதியை நாங்கள் கவனிப்போம்", hi: "अपनी समस्या का वर्णन करें और बाकी हम संभालेंगे" },
  "submit.field_title": { en: "Title", ta: "தலைப்பு", hi: "शीर्षक" },
  "submit.field_title_placeholder": { en: "Brief title of your complaint", ta: "உங்கள் புகாரின் சுருக்கமான தலைப்பு", hi: "शिकायत का संक्षिप्त शीर्षक" },
  "submit.field_desc": { en: "Description", ta: "விளக்கம்", hi: "विवरण" },
  "submit.field_desc_placeholder": { en: "Describe the issue in detail...", ta: "பிரச்சினையை விரிவாக விவரிக்கவும்...", hi: "समस्या का विस्तार से वर्णन करें..." },
  "submit.field_location": { en: "Location", ta: "இடம்", hi: "स्थान" },
  "submit.field_location_placeholder": { en: "Where is the issue located?", ta: "பிரச்சினை எங்கே உள்ளது?", hi: "समस्या कहाँ स्थित है?" },
  "submit.field_category": { en: "Category", ta: "வகை", hi: "श्रेणी" },
  "submit.field_category_placeholder": { en: "Select category", ta: "வகையைத் தேர்ந்தெடுக்கவும்", hi: "श्रेणी चुनें" },
  "submit.field_phone": { en: "Phone Number", ta: "தொலைபேசி எண்", hi: "फ़ोन नंबर" },
  "submit.field_email": { en: "Email (optional)", ta: "மின்னஞ்சல் (விருப்பம்)", hi: "ईमेल (वैकल्पिक)" },
  "submit.field_image": { en: "Attach Image (optional)", ta: "படம் இணைக்க (விருப்பம்)", hi: "छवि संलग्न करें (वैकल्पिक)" },
  "submit.image_click": { en: "Click to upload image", ta: "படத்தைப் பதிவேற்ற கிளிக் செய்யவும்", hi: "छवि अपलोड करने के लिए क्लिक करें" },
  "submit.image_size": { en: "JPG, PNG up to 5MB", ta: "JPG, PNG 5MB வரை", hi: "JPG, PNG 5MB तक" },
  "submit.image_too_large": { en: "Image must be less than 5MB", ta: "படம் 5MB க்கும் குறைவாக இருக்க வேண்டும்", hi: "छवि 5MB से कम होनी चाहिए" },
  "submit.phone_min": { en: "Phone number must be at least 10 digits", ta: "தொலைபேசி எண் குறைந்தது 10 இலக்கங்கள் இருக்க வேண்டும்", hi: "फ़ोन नंबर कम से कम 10 अंकों का होना चाहिए" },
  "submit.phone_max": { en: "Phone number is too long", ta: "தொலைபேசி எண் மிகவும் நீளமாக உள்ளது", hi: "फ़ोन नंबर बहुत लंबा है" },
  "submit.button": { en: "Submit Complaint", ta: "புகார் அளிக்கவும்", hi: "शिकायत दर्ज करें" },
  "submit.submitting": { en: "Submitting...", ta: "சமர்ப்பிக்கிறது...", hi: "प्रस्तुत हो रहा है..." },
  "submit.success": { en: "Complaint submitted successfully!", ta: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!", hi: "शिकायत सफलतापूर्वक दर्ज की गई!" },
  "submit.success_track": { en: "You can track it from the Track Complaints page.", ta: "புகார்களை கண்காணிக்க பக்கத்திலிருந்து கண்காணிக்கலாம்.", hi: "आप ट्रैक शिकायत पेज से इसे ट्रैक कर सकते हैं।" },
  "submit.complaint_id": { en: "Your complaint ID is", ta: "உங்கள் புகார் எண்", hi: "आपकी शिकायत आईडी है" },

  // Track
  "track.title": { en: "Track Complaints", ta: "புகார்களை கண்காணிக்க", hi: "शिकायत ट्रैक करें" },
  "track.subtitle": { en: "Monitor the status of your submitted complaints", ta: "உங்கள் சமர்ப்பிக்கப்பட்ட புகார்களின் நிலையை கண்காணிக்கவும்", hi: "अपनी दर्ज की गई शिकायतों की स्थिति देखें" },
  "track.search": { en: "Search by title or ID...", ta: "தலைப்பு அல்லது ID மூலம் தேடுங்கள்...", hi: "शीर्षक या ID से खोजें..." },
  "track.view_details": { en: "View details", ta: "விவரங்கள் காண", hi: "विवरण देखें" },
  "track.no_results": { en: "No complaints found", ta: "புகார்கள் இல்லை", hi: "कोई शिकायत नहीं मिली" },
  "track.no_results_sub": { en: "Try adjusting your search or filters", ta: "உங்கள் தேடல் அல்லது வடிப்பானை மாற்றி முயற்சிக்கவும்", hi: "अपनी खोज या फ़िल्टर बदलकर देखें" },
  "track.complaints_found": { en: "complaints found", ta: "புகார்கள் கண்டறியப்பட்டன", hi: "शिकायतें मिलीं" },
  "track.complaint_found": { en: "complaint found", ta: "புகார் கண்டறியப்பட்டது", hi: "शिकायत मिली" },
  "track.updated": { en: "Updated", ta: "புதுப்பிக்கப்பட்டது", hi: "अपडेट किया गया" },
  "track.image": { en: "Image", ta: "படம்", hi: "छवि" },

  // Admin Dashboard
  "admin.dashboard": { en: "Admin Dashboard", ta: "நிர்வாக டாஷ்போர்டு", hi: "एडमिन डैशबोर्ड" },
  "admin.realtime": { en: "Real-time analytics and complaint management", ta: "நிகழ்நேர பகுப்பாய்வு மற்றும் புகார் மேலாண்மை", hi: "रीयल-टाइम एनालिटिक्स और शिकायत प्रबंधन" },
  "admin.manage_all": { en: "Manage All", ta: "அனைத்தையும் நிர்வகி", hi: "सभी प्रबंधित करें" },
  "admin.complaint_trends": { en: "Complaint Trends", ta: "புகார் போக்குகள்", hi: "शिकायत रुझान" },
  "admin.trends_sub": { en: "Submitted vs resolved over time", ta: "காலப்போக்கில் சமர்ப்பிக்கப்பட்டவை vs தீர்க்கப்பட்டவை", hi: "समय के साथ दर्ज बनाम हल" },
  "admin.status_distribution": { en: "Status Distribution", ta: "நிலை விநியோகம்", hi: "स्थिति वितरण" },
  "admin.status_sub": { en: "Current complaint breakdown", ta: "தற்போதைய புகார் பிரிவு", hi: "वर्तमान शिकायत विश्लेषण" },
  "admin.by_category": { en: "Complaints by Category", ta: "வகை வாரியாக புகார்கள்", hi: "श्रेणी अनुसार शिकायतें" },
  "admin.category_sub": { en: "Distribution across complaint types", ta: "புகார் வகைகளின் விநியோகம்", hi: "शिकायत प्रकारों में वितरण" },
  "admin.priority_breakdown": { en: "Priority Breakdown", ta: "முன்னுரிமை பிரிவு", hi: "प्राथमिकता विश्लेषण" },
  "admin.priority_sub": { en: "Complaint severity levels", ta: "புகார் தீவிர நிலைகள்", hi: "शिकायत गंभीरता स्तर" },
  "admin.latest": { en: "Latest Complaints", ta: "சமீபத்திய புகார்கள்", hi: "नवीनतम शिकायतें" },
  "admin.latest_sub": { en: "Most recent submissions", ta: "மிக சமீபத்திய சமர்ப்பிப்புகள்", hi: "सबसे हाल की शिकायतें" },
  "admin.daily": { en: "Daily", ta: "தினசரி", hi: "दैनिक" },
  "admin.weekly": { en: "Weekly", ta: "வாராந்திர", hi: "साप्ताहिक" },
  "admin.high_priority": { en: "High Priority", ta: "உயர் முன்னுரிமை", hi: "उच्च प्राथमिकता" },
  "admin.open": { en: "open", ta: "திறந்த", hi: "खुला" },
  "admin.needs_attention": { en: "Needs attention", ta: "கவனம் தேவை", hi: "ध्यान देने योग्य" },
  "admin.view_all": { en: "View all →", ta: "அனைத்தையும் காண →", hi: "सभी देखें →" },
  "admin.submitted": { en: "Submitted", ta: "சமர்ப்பிக்கப்பட்டது", hi: "दर्ज किया गया" },

  // Admin Complaints
  "admin_complaints.title": { en: "All Complaints", ta: "அனைத்து புகார்கள்", hi: "सभी शिकायतें" },
  "admin_complaints.subtitle": { en: "Manage and update complaint statuses", ta: "புகார் நிலைகளை நிர்வகிக்கவும் புதுப்பிக்கவும்", hi: "शिकायत स्थिति प्रबंधित और अपडेट करें" },
  "admin_complaints.search": { en: "Search by title, ID, email or phone...", ta: "தலைப்பு, ID, மின்னஞ்சல் அல்லது தொலைபேசி மூலம் தேடுங்கள்...", hi: "शीर्षक, ID, ईमेल या फ़ोन से खोजें..." },
  "admin_complaints.status": { en: "Status", ta: "நிலை", hi: "स्थिति" },
  "admin_complaints.category": { en: "Category", ta: "வகை", hi: "श्रेणी" },
  "admin_complaints.no_results": { en: "No complaints match your filters", ta: "உங்கள் வடிப்பான்களுடன் பொருந்தும் புகார்கள் இல்லை", hi: "आपके फ़िल्टर से कोई शिकायत मेल नहीं खाती" },

  // Complaint Detail
  "detail.back": { en: "Back", ta: "பின்செல்", hi: "वापस" },
  "detail.not_found": { en: "Complaint not found", ta: "புகார் கிடைக்கவில்லை", hi: "शिकायत नहीं मिली" },
  "detail.not_found_sub": { en: "The complaint you're looking for doesn't exist or has been removed.", ta: "நீங்கள் தேடும் புகார் இல்லை அல்லது நீக்கப்பட்டுள்ளது.", hi: "आप जो शिकायत ढूंढ रहे हैं वह मौजूद नहीं है या हटा दी गई है।" },
  "detail.go_back": { en: "Go back to dashboard", ta: "டாஷ்போர்டுக்கு திரும்பு", hi: "डैशबोर्ड पर वापस जाएं" },
  "detail.description": { en: "Description", ta: "விளக்கம்", hi: "विवरण" },
  "detail.evidence": { en: "Attached Evidence", ta: "இணைக்கப்பட்ட ஆதாரம்", hi: "संलग्न प्रमाण" },
  "detail.timeline": { en: "Status Timeline", ta: "நிலை காலவரிசை", hi: "स्थिति टाइमलाइन" },
  "detail.contact_info": { en: "Contact Information", ta: "தொடர்பு தகவல்", hi: "संपर्क जानकारी" },
  "detail.complaint_id": { en: "Complaint ID", ta: "புகார் எண்", hi: "शिकायत आईडी" },
  "detail.priority": { en: "Priority", ta: "முன்னுரிமை", hi: "प्राथमिकता" },
  "detail.submitted_on": { en: "Submitted on", ta: "சமர்ப்பிக்கப்பட்ட தேதி", hi: "दर्ज किया गया" },
  "detail.last_updated": { en: "Last Updated", ta: "கடைசி புதுப்பிப்பு", hi: "अंतिम अपडेट" },

  // Emergency
  "emergency.title": { en: "Emergency Contacts", ta: "அவசர தொடர்புகள்", hi: "आपातकालीन संपर्क" },
  "emergency.subtitle": { en: "For urgent assistance, call immediately", ta: "அவசர உதவிக்கு, உடனடியாக அழைக்கவும்", hi: "तत्काल सहायता के लिए, तुरंत कॉल करें" },
  "emergency.police": { en: "Police", ta: "காவல்துறை", hi: "पुलिस" },
  "emergency.ambulance": { en: "Ambulance", ta: "ஆம்புலன்ஸ்", hi: "एम्बुलेंस" },
  "emergency.fire": { en: "Fire Service", ta: "தீயணைப்பு சேவை", hi: "अग्निशमन सेवा" },
  "emergency.women": { en: "Women Helpline", ta: "பெண்கள் உதவி எண்", hi: "महिला हेल्पलाइन" },

  // Notifications
  "notif.title": { en: "Notifications", ta: "அறிவிப்புகள்", hi: "सूचनाएँ" },
  "notif.mark_read": { en: "Mark all read", ta: "அனைத்தையும் படித்ததாக குறி", hi: "सभी को पढ़ा हुआ चिह्नित करें" },
  "notif.empty": { en: "No notifications yet", ta: "இன்னும் அறிவிப்புகள் இல்லை", hi: "अभी तक कोई सूचना नहीं" },
  "notif.complaint_submitted": { en: "Complaint Submitted", ta: "புகார் சமர்ப்பிக்கப்பட்டது", hi: "शिकायत दर्ज की गई" },
  "notif.status_updated": { en: "Status Updated", ta: "நிலை புதுப்பிக்கப்பட்டது", hi: "स्थिति अपडेट की गई" },

  // Common
  "common.all": { en: "All", ta: "அனைத்தும்", hi: "सभी" },
  "common.continue": { en: "Continue", ta: "தொடரவும்", hi: "जारी रखें" },
  "common.days": { en: "days", ta: "நாட்கள்", hi: "दिन" },
  "common.vs_last_week": { en: "vs last week", ta: "கடந்த வாரம் vs", hi: "पिछले सप्ताह बनाम" },
  "common.id": { en: "ID", ta: "எண்", hi: "आईडी" },
  "common.title": { en: "Title", ta: "தலைப்பு", hi: "शीर्षक" },
  "common.user": { en: "User", ta: "பயனர்", hi: "उपयोगकर्ता" },
  "common.status": { en: "Status", ta: "நிலை", hi: "स्थिति" },
  "common.priority": { en: "Priority", ta: "முன்னுரிமை", hi: "प्राथमिकता" },
  "common.category": { en: "Category", ta: "வகை", hi: "श्रेणी" },
  "common.complaints": { en: "Complaints", ta: "புகார்கள்", hi: "शिकायतें" },

  // Settings
  "settings.title": { en: "Settings", ta: "அமைப்புகள்", hi: "सेटिंग्स" },
  "settings.subtitle": { en: "Manage your account and preferences", ta: "உங்கள் கணக்கு மற்றும் விருப்பங்களை நிர்வகிக்கவும்", hi: "अपना खाता और प्राथमिकताएँ प्रबंधित करें" },
  "settings.save": { en: "Save Changes", ta: "மாற்றங்களை சேமிக்கவும்", hi: "परिवर्तन सहेजें" },
  "settings.saved": { en: "Settings saved", ta: "அமைப்புகள் சேமிக்கப்பட்டன", hi: "सेटिंग्स सहेजी गईं" },
  "settings.saved_desc": { en: "Your preferences have been updated.", ta: "உங்கள் விருப்பங்கள் புதுப்பிக்கப்பட்டன.", hi: "आपकी प्राथमिकताएँ अपडेट की गईं।" },
  "settings.profile": { en: "Profile", ta: "சுயவிவரம்", hi: "प्रोफ़ाइल" },
  "settings.profile_desc": { en: "Manage your account details", ta: "உங்கள் கணக்கு விவரங்களை நிர்வகிக்கவும்", hi: "अपने खाते का विवरण प्रबंधित करें" },
  "settings.name": { en: "Full Name", ta: "முழு பெயர்", hi: "पूरा नाम" },
  "settings.email": { en: "Email Address", ta: "மின்னஞ்சல் முகவரி", hi: "ईमेल पता" },
  "settings.role": { en: "Role", ta: "பங்கு", hi: "भूमिका" },
  "settings.language": { en: "Language", ta: "மொழி", hi: "भाषा" },
  "settings.language_desc": { en: "Choose your preferred language", ta: "உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்", hi: "अपनी पसंदीदा भाषा चुनें" },
  "settings.select_language": { en: "Display Language", ta: "காட்சி மொழி", hi: "प्रदर्शन भाषा" },
  "settings.notifications": { en: "Notifications", ta: "அறிவிப்புகள்", hi: "सूचनाएँ" },
  "settings.notifications_desc": { en: "Configure how you receive alerts", ta: "எச்சரிக்கைகளை எவ்வாறு பெறுவது என்பதை உள்ளமைக்கவும்", hi: "अलर्ट कैसे प्राप्त करें कॉन्फ़िगर करें" },
  "settings.email_notif": { en: "Email Notifications", ta: "மின்னஞ்சல் அறிவிப்புகள்", hi: "ईमेल सूचनाएँ" },
  "settings.email_notif_desc": { en: "Receive updates via email", ta: "மின்னஞ்சல் வழியாக புதுப்பிப்புகளைப் பெறவும்", hi: "ईमेल के माध्यम से अपडेट प्राप्त करें" },
  "settings.push_notif": { en: "Push Notifications", ta: "புஷ் அறிவிப்புகள்", hi: "पुश सूचनाएँ" },
  "settings.push_notif_desc": { en: "Get browser push notifications", ta: "உலாவி புஷ் அறிவிப்புகளைப் பெறவும்", hi: "ब्राउज़र पुश सूचनाएँ प्राप्त करें" },
  "settings.status_notif": { en: "Status Change Alerts", ta: "நிலை மாற்ற எச்சரிக்கைகள்", hi: "स्थिति परिवर्तन अलर्ट" },
  "settings.status_notif_desc": { en: "Alert when complaint status changes", ta: "புகார் நிலை மாறும்போது எச்சரிக்கை", hi: "शिकायत स्थिति बदलने पर अलर्ट" },
  "settings.system": { en: "System", ta: "அமைப்பு", hi: "सिस्टम" },
  "settings.system_desc": { en: "System-level preferences", ta: "அமைப்பு நிலை விருப்பங்கள்", hi: "सिस्टम स्तर की प्राथमिकताएँ" },
  "settings.auto_assign": { en: "Auto-assign Complaints", ta: "புகார்களை தானாக ஒதுக்கு", hi: "शिकायतें स्वचालित रूप से असाइन करें" },
  "settings.auto_assign_desc": { en: "Automatically assign new complaints to available agents", ta: "புதிய புகார்களை கிடைக்கும் முகவர்களுக்கு தானாக ஒதுக்கவும்", hi: "नई शिकायतें उपलब्ध एजेंटों को स्वचालित रूप से असाइन करें" },
  "settings.appearance": { en: "Appearance", ta: "தோற்றம்", hi: "दिखावट" },
  "settings.appearance_desc": { en: "Customize the look and feel", ta: "தோற்றத்தை தனிப்பயனாக்கவும்", hi: "लुक और फील को कस्टमाइज़ करें" },
  "settings.theme": { en: "Theme", ta: "தீம்", hi: "थीम" },
  "settings.light": { en: "Light", ta: "ஒளி", hi: "लाइट" },
  "settings.dark": { en: "Dark", ta: "இருள்", hi: "डार्क" },
  "settings.system_theme": { en: "System", ta: "அமைப்பு", hi: "सिस्टम" },

  // Future
  "future.title": { en: "Coming Soon", ta: "விரைவில் வரும்", hi: "जल्द आ रहा है" },
  "future.aadhaar": { en: "Aadhaar / e-Sevai Integration", ta: "ஆதார் / e-Sevai ஒருங்கிணைப்பு", hi: "आधार / e-Sevai एकीकरण" },
  "future.email_notif": { en: "Email Notification System", ta: "மின்னஞ்சல் அறிவிப்பு அமைப்பு", hi: "ईमेल सूचना प्रणाली" },
  "future.ai_chatbot": { en: "Advanced AI Chatbot (NLP)", ta: "மேம்பட்ட AI சாட்பாட் (NLP)", hi: "उन्नत AI चैटबॉट (NLP)" },
  "future.real_backend": { en: "Real Backend Database & Auth", ta: "உண்மையான பின்தள தரவுத்தளம் & அங்கீகாரம்", hi: "वास्तविक बैकएंड डेटाबेस और प्रमाणीकरण" },
  "future.mobile_app": { en: "Mobile Application Support", ta: "மொபைல் பயன்பாட்டு ஆதரவு", hi: "मोबाइल एप्लिकेशन सपोर्ट" },

  // Login
  "login.title": { en: "User Login", ta: "பயனர் உள்நுழைவு", hi: "उपयोगकर्ता लॉगिन" },
  "login.admin_title": { en: "Admin Login", ta: "நிர்வாக உள்நுழைவு", hi: "एडमिन लॉगिन" },
  "login.email": { en: "Email", ta: "மின்னஞ்சல்", hi: "ईमेल" },
  "login.password": { en: "Password", ta: "கடவுச்சொல்", hi: "पासवर्ड" },
  "login.button": { en: "Login", ta: "உள்நுழை", hi: "लॉगिन" },
  "login.no_account": { en: "Don't have an account?", ta: "கணக்கு இல்லையா?", hi: "खाता नहीं है?" },
  "login.register": { en: "Register", ta: "பதிவு செய்யவும்", hi: "रजिस्टर करें" },
  "login.back_home": { en: "Back to Home", ta: "முகப்புக்கு திரும்பு", hi: "होम पर वापस जाएं" },

  // Register
  "register.title": { en: "Create Account", ta: "கணக்கை உருவாக்கு", hi: "खाता बनाएं" },
  "register.name": { en: "Full Name", ta: "முழு பெயர்", hi: "पूरा नाम" },
  "register.button": { en: "Register", ta: "பதிவு செய்யவும்", hi: "रजिस्टर करें" },
  "register.has_account": { en: "Already have an account?", ta: "ஏற்கனவே கணக்கு உள்ளதா?", hi: "पहले से खाता है?" },
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
