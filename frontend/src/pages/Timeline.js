import { useState, useEffect } from "react";
import { TrendingUp, Activity, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../utils/api";

export default function Timeline() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("health_score");

  useEffect(() => {
    api.get("/reports").then(async res => {
      const list = res.data.data || [];
      const detailed = await Promise.all(
        list.slice(0, 20).map(r => api.get(`/reports/${r.id}`).then(d => d.data.data).catch(() => null))
      );
      setReports(detailed.filter(Boolean));
    }).finally(() => setLoading(false));
  }, []);

  const timelineData = reports.map(r => {
    const a = r.analysis || {};
    const findings = a.findings || [];
    const getValue = name => {
      const f = findings.find(f => f.parameter?.toLowerCase().includes(name.toLowerCase()));
      return f ? parseFloat(f.value) || null : null;
    };
    return {
      date: new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      report_type: r.report_type || "Report",
      health_score: r.health_score || null,
      hemoglobin: getValue("hemoglobin") || getValue("hgb"),
      glucose: getValue("glucose") || getValue("sugar"),
      cholesterol: getValue("cholesterol"),
      creatinine: getValue("creatinine"),
      tsh: getValue("tsh") || getValue("thyroid"),
    };
  }).reverse();

  const metrics = [
    { key: "health_score", label: "Health Score", color: "#16a34a", unit: "/100" },
    { key: "hemoglobin", label: "Hemoglobin", color: "#7c3aed", unit: "g/dL" },
    { key: "glucose", label: "Blood Glucose", color: "#d97706", unit: "mg/dL" },
    { key: "cholesterol", label: "Cholesterol", color: "#dc2626", unit: "mg/dL" },
    { key: "creatinine", label: "Creatinine", color: "#0891b2", unit: "mg/dL" },
    { key: "tsh", label: "TSH (Thyroid)", color: "#9333ea", unit: "mIU/L" },
  ];

  const activeMetric = metrics.find(m => m.key === selectedMetric);
  const chartData = timelineData.filter(d => d[selectedMetric] !== null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
        <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}{activeMetric?.unit}</p>
        ))}
      </div>
    );
  };

  const latestScores = reports.slice(0, 5).map(r => ({
    type: r.report_type || "Report",
    score: r.health_score,
    date: new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
  }));

  const avgScore = reports.filter(r => r.health_score).length
    ? Math.round(reports.filter(r => r.health_score).reduce((s, r) => s + r.health_score, 0) / reports.filter(r => r.health_score).length)
    : null;

  const getScoreColor = s => s >= 75 ? "var(--accent-green)" : s >= 50 ? "var(--accent-yellow)" : "var(--accent-red)";

  return (
    <div style={{ padding: "1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>Health Timeline</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Track your health values over time</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading timeline...</div>
      ) : reports.length < 2 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <TrendingUp size={48} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.4 }} />
          <h3 style={{ color: "var(--text-primary)", marginBottom: 6 }}>Not enough data yet</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Upload at least 2 reports to see your health timeline</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>
            <div className="card">
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Average Score</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: avgScore ? getScoreColor(avgScore) : "var(--text-muted)" }}>{avgScore || "—"}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>across {reports.length} reports</div>
            </div>
            <div className="card">
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Latest Score</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: reports[0]?.health_score ? getScoreColor(reports[0].health_score) : "var(--text-muted)" }}>
                {reports[0]?.health_score || "—"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>most recent</div>
            </div>
            <div className="card">
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Reports Tracked</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--accent-purple)" }}>{reports.length}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>total uploaded</div>
            </div>
            <div className="card">
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Trend</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent-green)" }}>
                {reports.length >= 2 && reports[0]?.health_score && reports[1]?.health_score
                  ? reports[0].health_score > reports[1].health_score ? "↑ Improving" : reports[0].health_score < reports[1].health_score ? "↓ Declining" : "→ Stable"
                  : "—"}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Activity size={16} color="var(--accent-green)" />
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Value Over Time</h3>
              </div>
              <select className="input" style={{ width: "auto", fontSize: 13 }} value={selectedMetric} onChange={e => setSelectedMetric(e.target.value)}>
                {metrics.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>

            {chartData.length < 2 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)", fontSize: 13 }}>
                Not enough data for {activeMetric?.label}. Upload more reports with this value.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    name={activeMetric?.label}
                    stroke={activeMetric?.color}
                    strokeWidth={2.5}
                    dot={{ fill: activeMetric?.color, strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Health Score per Report */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>Health Score by Report</h3>
            {latestScores.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < latestScores.length - 1 ? "0.5px solid var(--border-light)" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{s.type}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.date}</div>
                </div>
                {s.score ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 120, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${s.score}%`, height: "100%", background: getScoreColor(s.score), borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: getScoreColor(s.score), minWidth: 32 }}>{s.score}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>No score</span>
                )}
              </div>
            ))}
          </div>

          <div className="disclaimer" style={{ marginTop: "1rem" }}>
            <AlertCircle size={13} style={{ flexShrink: 0 }} />
            <span>Health scores and trends are AI-estimated. Consult your doctor for clinical interpretation.</span>
          </div>
        </>
      )}
    </div>
  );
}
