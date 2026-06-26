import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, Sun, Moon, LogOut, LayoutDashboard, FileText, Pill, Bell, Salad, User, MessageCircle, TrendingUp, Users, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/reports", icon: FileText, label: "Reports" },
  { path: "/medicines", icon: Pill, label: "Medicines" },
  { path: "/reminders", icon: Bell, label: "Reminders" },
  { path: "/diet", icon: Salad, label: "Diet" },
  { path: "/timeline", icon: TrendingUp, label: "Timeline" },
  { path: "/ask-ai", icon: MessageCircle, label: "Ask AI" },
  { path: "/family", icon: Users, label: "Family" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); nav("/login"); };

  return (
    <>
      <nav style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)", padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, position: "sticky", top: 0, zIndex: 200 }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: "var(--accent-green-light)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "0.5px solid var(--accent-green-border)" }}>
            <Heart size={16} color="var(--accent-green)" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>ClarityMed</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }} className="desktop-nav">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 500, color: location.pathname === item.path ? "var(--accent-green)" : "var(--text-secondary)", background: location.pathname === item.path ? "var(--accent-green-light)" : "transparent", transition: "all 0.2s", whiteSpace: "nowrap" }}>
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button onClick={toggleTheme} style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border)", borderRadius: 8, padding: "6px", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-secondary)" }}>
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <button onClick={handleLogout} style={{ background: "var(--accent-red-light)", border: "0.5px solid var(--accent-red)", borderRadius: 8, padding: "6px", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--accent-red)" }} title="Logout">
            <LogOut size={15} />
          </button>
          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(o => !o)} className="mobile-menu-btn" style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border)", borderRadius: 8, padding: "6px", cursor: "pointer", display: "none", alignItems: "center" }}>
            {mobileOpen ? <X size={16} color="var(--text-secondary)" /> : <Menu size={16} color="var(--text-secondary)" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div style={{ position: "fixed", top: 58, left: 0, right: 0, bottom: 0, zIndex: 199, background: "rgba(0,0,0,0.4)" }} onClick={() => setMobileOpen(false)}>
          <div style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)", padding: "0.5rem" }} onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500, color: location.pathname === item.path ? "var(--accent-green)" : "var(--text-secondary)", background: location.pathname === item.path ? "var(--accent-green-light)" : "transparent", marginBottom: 2 }}>
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
