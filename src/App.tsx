import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PongLanding from "./pages/PongLanding";
import PongTutorial from "./pages/PongTutorial";
import PongTest from "./pages/PongTest";
import SnakeLanding from "./pages/SnakeLanding";
// import SnakeTutorial from "./pages/SnakeTutorial";
// import SnakeTest from "./pages/SnakeTest";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { BookLoader } from "./components/BookLoader";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  if (isLoading) return <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}><span className="text-muted-foreground">Loading...</span></div>;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  if (isLoading) return <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}><span className="text-muted-foreground">Loading...</span></div>;
  if (isSignedIn) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Splash Screen Overlay */}
        {showSplash && <BookLoader onComplete={() => setShowSplash(false)} />}
        
        {/* Main App Content - Hidden strictly while splash is showing to prevent scroll/interaction, but loads in background */}
        <div className={showSplash ? "h-screen overflow-hidden opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-500 delay-200"}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/games/pong" element={<ProtectedRoute><PongLanding /></ProtectedRoute>} />
                <Route path="/games/pong/tutorial" element={<ProtectedRoute><PongTutorial /></ProtectedRoute>} />
                <Route path="/games/pong/test" element={<ProtectedRoute><PongTest /></ProtectedRoute>} />
                <Route path="/games/snake" element={<ProtectedRoute><SnakeLanding /></ProtectedRoute>} />
                {/* <Route path="/games/snake/tutorial" element={<ProtectedRoute><SnakeTutorial /></ProtectedRoute>} /> */}
                {/* <Route path="/games/snake/test" element={<ProtectedRoute><SnakeTest /></ProtectedRoute>} /> */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
