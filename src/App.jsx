import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// App pages
import Dashboard from "@/pages/Dashboard";
import NGOs from "@/pages/NGOs";
import Beneficiaries from "@/pages/Beneficiaries";
import Marketers from "@/pages/Marketers";
import Profile from "@/pages/Profile";
import PlatformSettings from "@/pages/PlatformSettings";
import UsersManagement from "@/pages/UsersManagement";
import ResearcherWorkspace from "@/pages/ResearcherWorkspace";
import BeneficiaryDetail from "@/pages/BeneficiaryDetail";
import TechnicalOverview from "@/pages/TechnicalOverview";

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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ngos" element={<NGOs />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/marketers" element={<Marketers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<PlatformSettings />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/researcher" element={<ResearcherWorkspace />} />
          <Route path="/beneficiaries/detail" element={<BeneficiaryDetail />} />
          {/* Dev-only engineer handover page */}
          {import.meta.env.DEV && <Route path="/dev/overview" element={<TechnicalOverview />} />}
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;