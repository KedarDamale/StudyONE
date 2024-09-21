import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LandingPage from "./pages/LandingPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import MaintenancePage from "./pages/underDevMaintainance";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const StyledRoute = ({ children }) => (
  <div
    className="min-h-screen bg-gradient-to-br
  from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
  >
    <FloatingShape
      color="bg-green-500"
      size="w-64 h-64"
      top="-5%"
      left="10%"
      delay={0}
    />
    <FloatingShape
      color="bg-emerald-500"
      size="w-48 h-48"
      top="70%"
      left="80%"
      delay={5}
    />
    <FloatingShape
      color="bg-lime-500"
      size="w-32 h-32"
      top="40%"
      left="-10%"
      delay={2}
    />
    {children}
  </div>
);

const NormalRoute = ({ children }) => (
  <div className="min-h-screen items-center justify-center relative overflow-hidden">
    {children}
  </div>
);

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <StyledRoute>
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            </StyledRoute>
          }
        />
        <Route
          path="/login"
          element={
            <StyledRoute>
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            </StyledRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <StyledRoute>
              <EmailVerificationPage />
            </StyledRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <StyledRoute>
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            </StyledRoute>
          }
        />
        <Route
          path="/404"
          element={
            <StyledRoute>
              <NotFoundPage />
            </StyledRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <StyledRoute>
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            </StyledRoute>
          }
        />
        <Route
          path="/underDevMaintainance"
          element={
            <StyledRoute>
              <MaintenancePage />
            </StyledRoute>
          }
        />
        {/* catch all routes */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
