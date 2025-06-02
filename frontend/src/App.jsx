import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

export default function App() {
  const { isCheckingAuth, authUser, checkAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(onlineUsers);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex item-center justify-center h-screen">
        <Loader className="size-7 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="font-display">
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* SignUp */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Profile */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}
