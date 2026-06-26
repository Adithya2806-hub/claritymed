import { Link } from "react-router-dom";
import { Heart, Shield, Zap, FileText, Pill, Bell, Salad, TrendingUp, MessageCircle, Users, Moon, Sun, CheckCircle, AlertTriangle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  const features = [
    { icon: FileText, title: "Any Report Analyzed", desc: "Blood, urine, thyroid, cardiac, hormone, cancer markers, X-rays and more — all explained in simple language", color: "var(--accent-purple)" },
    { icon: AlertTriangle, title: "Red Flag Alerts", desc: "Instantly detects dangerous values with severity levels and immediate action steps to take", color: "var(--accent-red)" },
    { icon: Salad, title: "Personalized Diet Plan", desc: "AI generates a complete meal plan based on your weight, height, and medical report values", color: "var(--accent-green)" },
    { icon: Pill, title: "Medicine Alarms", desc: "Add medicines from prescriptions, set alarm times, and toggle ON/OFF with one tap", color: "var(--accent-yellow)" },
    { icon: Bell, title: "Smart Reminders", desc: "Test reminders, doctor visits, and revisit reminders — never miss an important health check", color: "var(--accent-purple)" },
    { icon: TrendingUp, title: "Health Timeline", desc: "Track your health values over time with interactive charts and trend analysis", color: "var(--accent-green)" },
    { icon: MessageCircle, title: "Ask AI Chat", desc: "Chat with AI about your reports, ask health questions, and get instant explanations", color: "var(--accent-red)" },
    { icon: Users, title: "Family Profiles", desc: "Manage health profiles for all family members — parents, spouse, children — in one place", color: "var(--accent-yellow)" },
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up and fill in your health profile — height, weight, food preferences" },
    { num: "02", title: "Upload Report", desc: "Upload any medical report, prescription, or X-ray as PDF or image" },
    { num: "03", title: "Get AI Analysis", desc: "AI explains everything in simple language — findings, red flags, recovery time" },
    { num: "04", title: "Take Action", desc: "Follow the diet plan, set medicine alarms, and schedule test reminders" },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: "var(--accent-green-light)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "0.5px solid var(--accent-green-border)" }}>
            <Heart size={18} color="var(--accent-green)" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>ClarityMed</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={toggleTheme} style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border)", borderRadius: 8, padding: "7px", cursor: "pointer", display: "flex" }}>
            {theme === "light" ? <Moon size={16} color="var(--text-secondary)" /> : <Sun size={16} color="var(--text-secondary)" />}
          </button>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: 13 }}>Sign in</Link>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 13 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "5rem 2rem 4rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent-green-light)", border: "0.5px solid var(--accent-green-border)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "var(--accent-green)", fontWeight: 500, marginBottom: "1.5rem" }}>
          <Zap size={12} /> Powered by GPT-4o AI
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
          Understand Your Medical Reports in <span style={{ color: "var(--accent-green)" }}>Simple Language</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 580, margin: "0 auto 2rem" }}>
          Upload any medical report, prescription, or X-ray. ClarityMed AI explains everything — red flags, medicines, diet plan, and recovery timeline.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 15, padding: "12px 24px" }}>Start for Free <span style={{ marginLeft: 4 }}>→</span></Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: 15, padding: "12px 24px" }}>Sign In</Link>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: "1rem" }}>No credit card required • Free to use</p>
      </section>

      {/* Disclaimer Banner */}
      <div style={{ background: "var(--accent-yellow-light)", borderTop: "0.5px solid var(--accent-yellow)", borderBottom: "0.5px solid var(--accent-yellow)", padding: "10px 2rem", textAlign: "center", fontSize: 13, color: "var(--accent-yellow)" }}>
        ⚠️ ClarityMed is for informational purposes only and does not provide medical advice. Always consult a qualified healthcare professional.
      </div>

      {/* Features */}
      <section style={{ padding: "4rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Everything You Need</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>One platform for all your medical report needs</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}>
              <div style={{ width: 40, height: 40, background: `${f.color}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "4rem 2rem", background: "var(--bg-card)", borderTop: "0.5px solid var(--border)", borderBottom: "0.5px solid var(--border)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>How It Works</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Get your report analyzed in under 60 seconds</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 52, height: 52, background: "var(--accent-green-light)", border: "2px solid var(--accent-green)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 16, fontWeight: 700, color: "var(--accent-green)" }}>{s.num}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types */}
      <section style={{ padding: "4rem 2rem", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Supports Every Report Type</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {["CBC Blood Report", "Lipid Profile", "Thyroid Panel", "Liver Function (LFT)", "Kidney Function (KFT)", "HbA1c", "Vitamin D/B12", "Hormone Tests", "Cancer Markers", "Cardiac Reports", "X-Ray", "MRI Report", "Ultrasound", "ECG", "Urine Routine", "Prescription", "Discharge Summary", "Vaccination Records"].map((t, i) => (
            <span key={i} style={{ fontSize: 13, padding: "5px 12px", background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 20, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle size={12} color="var(--accent-green)" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4rem 2rem", textAlign: "center", background: "var(--accent-green-light)", borderTop: "0.5px solid var(--accent-green-border)" }}>
        <div style={{ width: 56, height: 56, background: "white", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "var(--shadow-md)" }}>
          <Heart size={28} color="var(--accent-green)" />
        </div>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Start Understanding Your Health Today</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: "2rem" }}>Join thousands who use ClarityMed to understand their medical reports</p>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: 15, padding: "12px 32px", display: "inline-flex" }}>
          <Shield size={16} /> Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "1.5rem 2rem", borderTop: "0.5px solid var(--border)", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Built by <strong style={{ color: "var(--text-secondary)" }}>Adithya Vardhan Reddy T</strong> • ClarityMed is for informational purposes only
        </p>
      </footer>
    </div>
  );
}
