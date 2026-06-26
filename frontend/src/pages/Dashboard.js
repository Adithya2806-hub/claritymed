import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Pill, Bell, Salad, Upload, AlertTriangle, CheckCircle, TrendingUp, MessageCircle, Users, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/reports").catch(() => ({ data: { data: [] } })),
      api.get("/medicines").catch(() => ({ data: { data: [] } })),
      api.get("/reminders").catch(() => ({ data: { data: [] } })),
    ]).then(([r, m, rem]) => {
      setReports(r.data.data || []);
      setMedicines(m.data.data || []);
      setReminders(rem.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const avgScore = reports.filter(r => r.health_score).length
    ? Math.round(reports.filter(r => r.health_score).reduce((s, r) => s + r.health_score, 0) / reports.filter(r => r.health_score).length)
    : null;
  const activeMeds = medicines.filter(m => m.is_active).length;
  const upcomingReminders = reminders.filter(r => r.is_active && new Date(r.reminder_date) > new Date()).length;

  const getScoreColor = s => s >= 75 ? "var(--accent-green)" : s >= 50 ? "var(--accent-yellow)" : "var(--accent-red)";
  const getScoreLabel = s => s >= 75 ? "Good" : s >= 50 ? "Fair" : "Needs attention";

  const stats = [
    { label: "Health Score", value: avgScore ? `${avgScore}/100` : "—", sub: avgScore ? getScoreLabel(avgScore) : "Upload a report", color: avgScore ? getScoreColor(avgScore) : "var(--text-muted)", icon: TrendingUp },
    { label: "Reports", value: reports.length, sub: "Analyzed total", color: "var(--accent-purple)", icon: FileText },
    { label: "Active Medicines", value: activeMeds, sub: `of ${medicines.length} total`, color: "var(--accent-green)", icon: Pill },
    { label: "Reminders", value: upcomingReminders, sub: "Upcoming", color: "var(--accent-yellow)", icon: Bell },
  ];

  const quickActions = [
    { to: "/reports/upload", icon: Upload, label: "Analyze Report", color: "var(--accent-green)", bg: "var(--accent-green-light)" },
    { to: "/ask-ai", icon: MessageCircle, label: "Ask AI", color: "var(--accent-purple)", bg: "var(--accent-purple-light)" },
    { to: "/diet", icon: Salad, label: "Diet Plan", color: "var(--accent-yellow)", bg: "var(--accent-yellow-light)" },
    { to: "/timeline", icon: Activity, label: "Timeline", color: "var(--accent-green)", bg: "var(--accent-green-light)" },
    { to: "/medicines", icon: Pill, label: "Medicines", color: "var(--accent-red)", bg: "var(--accent-red-light)" },
    { to: "/family", icon: Users, label: "Family", color: "var(--accent-purple)", bg: "var(--accent-purple-light)" },
  ];

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Here's your health overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>
        {stats.map(s => (
          <div key={s.label} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 30, height: 30, background: `${s.color}20`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={15} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.875rem", color: "var(--text-primary)" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
          {quickActions.map(a => (
            <Link key={a.to} to={a.to} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 10px", background: a.bg, border: `0.5px solid ${a.color}30`, borderRadius: 10, transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}>
              <div style={{ width: 36, height: 36, background: "white", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <a.icon size={18} color={a.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", textAlign: "center" }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Recent Reports */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Recent Reports</h2>
            <Link to="/reports" style={{ fontSize: 12, color: "var(--accent-green)", textDecoration: "none" }}>View all</Link>
          </div>
          {reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--text-muted)", fontSize: 13 }}>
              <FileText size={28} style={{ marginBottom: 6, opacity: 0.3 }} />
              <p>No reports yet</p>
              <Link to="/reports/upload" style={{ color: "var(--accent-green)", fontSize: 12 }}>Upload your first report →</Link>
            </div>
          ) : reports.slice(0, 4).map(r => (
            <Link key={r.id} to={`/reports/${r.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "0.5px solid var(--border-light)", textDecoration: "none" }}>
              <div style={{ width: 30, height: 30, background: "var(--accent-purple-light)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={13} color="var(--accent-purple)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.report_type || r.file_name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              {r.health_score && <span style={{ fontSize: 13, fontWeight: 700, color: getScoreColor(r.health_score) }}>{r.health_score}</span>}
            </Link>
          ))}
        </div>

        {/* Today's Medicines + Upcoming Reminders */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Today's Medicines</h2>
              <Link to="/medicines" style={{ fontSize: 12, color: "var(--accent-green)", textDecoration: "none" }}>Manage</Link>
            </div>
            {medicines.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "0.75rem 0" }}>No medicines added</p>
            ) : medicines.slice(0, 3).map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "0.5px solid var(--border-light)" }}>
                <Pill size={14} color={m.is_active ? "var(--accent-green)" : "var(--text-muted)"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.times?.join(", ") || "No times set"}</div>
                </div>
                {m.is_active ? <CheckCircle size={13} color="var(--accent-green)" /> : <AlertTriangle size={13} color="var(--text-muted)" />}
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Upcoming Reminders</h2>
              <Link to="/reminders" style={{ fontSize: 12, color: "var(--accent-green)", textDecoration: "none" }}>View all</Link>
            </div>
            {upcomingReminders === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "0.75rem 0" }}>No upcoming reminders</p>
            ) : reminders.filter(r => r.is_active && new Date(r.reminder_date) > new Date()).slice(0, 3).map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "0.5px solid var(--border-light)" }}>
                <Bell size={13} color="var(--accent-yellow)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(r.reminder_date).toLocaleDateString()}</div>
                </div>
                <span className="badge badge-warning" style={{ fontSize: 10 }}>{r.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
