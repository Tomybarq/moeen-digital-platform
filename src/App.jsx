import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TenantProvider } from "@/context/TenantContext";
import { MotionProvider } from "@/context/MotionContext";

// Auth pages
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// App pages
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import NGOs from "@/pages/NGOs";
import NGOPerformance from "@/pages/NGOPerformance";
import Beneficiaries from "@/pages/Beneficiaries";
import Marketers from "@/pages/Marketers";
import Profile from "@/pages/Profile";
import PlatformSettings from "@/pages/PlatformSettings";
import UsersManagement from "@/pages/UsersManagement";
import ResearcherWorkspace from "@/pages/ResearcherWorkspace";
import BeneficiaryDetail from "@/pages/BeneficiaryDetail";
import Forbidden from "@/pages/Forbidden";
import TechnicalOverview from "@/pages/TechnicalOverview";
import AuditLogs from "@/pages/AuditLogs";
import Reports from "@/pages/Reports";
import MarketerDashboard from "@/pages/MarketerDashboard";

// Layout
import AppLayout from "@/components/layout/AppLayout";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">جاري التحميل…</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    } else if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ngos" element={<NGOs />} />
          <Route path="/ngo-performance" element={<NGOPerformance />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/marketers" element={<Marketers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/marketer-dashboard" element={<MarketerDashboard />} />
          <Route path="/settings" element={<PlatformSettings />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/researcher" element={<ResearcherWorkspace />} />
          <Route path="/beneficiaries/detail" element={<BeneficiaryDetail />} />
          <Route path="/forbidden" element={<Forbidden />} />
          {/* Dev-only engineer handover page */}
          {import.meta.env.DEV && <Route path="/dev/overview" element={<TechnicalOverview />} />}
        </Route>
      </Route>

      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <AuthProvider>
          <TenantProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <AuthenticatedApp />
              </Router>
              <Toaster />
            </QueryClientProvider>
          </TenantProvider>
        </AuthProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}

export default App;