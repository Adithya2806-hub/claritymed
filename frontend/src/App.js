import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import UploadReport from "./pages/UploadReport";
import ReportDetail from "./pages/ReportDetail";
import Medicines from "./pages/Medicines";
import Reminders from "./pages/Reminders";
import Diet from "./pages/Diet";
import Profile from "./pages/Profile";
import AskAI from "./pages/AskAI";
import Timeline from "./pages/Timeline";
import Family from "./pages/Family";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent-green)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Loading ClarityMed...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => (
  <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
    <Navbar />
    <main>{children}</main>
  </div>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />
      <Route path="/reports/upload" element={<PrivateRoute><Layout><UploadReport /></Layout></PrivateRoute>} />
      <Route path="/reports/:id" element={<PrivateRoute><Layout><ReportDetail /></Layout></PrivateRoute>} />
      <Route path="/medicines" element={<PrivateRoute><Layout><Medicines /></Layout></PrivateRoute>} />
      <Route path="/reminders" element={<PrivateRoute><Layout><Reminders /></Layout></PrivateRoute>} />
      <Route path="/diet" element={<PrivateRoute><Layout><Diet /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
      <Route path="/ask-ai" element={<PrivateRoute><Layout><AskAI /></Layout></PrivateRoute>} />
      <Route path="/timeline" element={<PrivateRoute><Layout><Timeline /></Layout></PrivateRoute>} />
      <Route path="/family" element={<PrivateRoute><Layout><Family /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "0.5px solid var(--border)", fontSize: 13 },
              success: { iconTheme: { primary: "var(--accent-green)", secondary: "white" } },
              error: { iconTheme: { primary: "var(--accent-red)", secondary: "white" } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
