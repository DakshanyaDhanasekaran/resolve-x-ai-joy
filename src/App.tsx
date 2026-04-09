import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ComplaintProvider } from "@/contexts/ComplaintContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import Register from "@/pages/Register";
import UserDashboard from "@/pages/UserDashboard";
import SubmitComplaint from "@/pages/SubmitComplaint";
import TrackComplaints from "@/pages/TrackComplaints";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminComplaints from "@/pages/AdminComplaints";
import ComplaintDetail from "@/pages/ComplaintDetail";
import NotFound from "@/pages/NotFound";
import Chatbot from "@/components/Chatbot";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: "admin" | "user" }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Login />} />
      <Route path="/admin-login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <AdminLogin />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* User routes */}
      <Route path="/dashboard" element={<ProtectedRoute role="user"><DashboardLayout><UserDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/submit" element={<ProtectedRoute role="user"><DashboardLayout><SubmitComplaint /></DashboardLayout></ProtectedRoute>} />
      <Route path="/track" element={<ProtectedRoute role="user"><DashboardLayout><TrackComplaints /></DashboardLayout></ProtectedRoute>} />
      <Route path="/complaint/:id" element={<ProtectedRoute><DashboardLayout><ComplaintDetail /></DashboardLayout></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/complaints" element={<ProtectedRoute role="admin"><DashboardLayout><AdminComplaints /></DashboardLayout></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <ComplaintProvider>
            <NotificationProvider>
              <BrowserRouter>
                <AppRoutes />
                <Chatbot />
              </BrowserRouter>
            </NotificationProvider>
          </ComplaintProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
