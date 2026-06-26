import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, ArrowLeft, Clock, Pill, Salad, AlertCircle, Activity, ListChecks, Trash2 } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const map = { normal: "badge-normal", low: "badge-warning", high: "badge-warning", critical: "badge-critical" };
  return <span className={`badge ${map[status] || "badge-purple"}`}>{status?.toUpperCase()}</span>;
};

const SeverityIcon = ({ s }) => s === "critical"
  ? <AlertTriangle size={16} color="var(--accent-red)" />
  : <AlertTriangle size={16} color="var(--accent-yellow)" />;

export default function ReportDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("findings");

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then(res => setReport(res.data.data))
      .catch(() => { toast.error("Report not found"); nav("/reports"); })
      .finally(() => setLoading(false));
  }, [id, nav]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this report?")) return;
    await api.delete(`/reports/${id}`);
    toast.success("Report deleted");
    nav("/reports");
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading analysis...</div>;
  if (!report) return null;

  const a = report.analysis || {};
  const tabs = [
    { id: "findings", label: "Findings", show: a.findings?.length > 0 },
    { id: "redflags", label: "🚨 Red Flags", show: a.red_flags?.length > 0 },
    { id: "medicines", label: "Medicines", show: a.medicines?.length > 0 },
    { id: "recovery", label: "Recovery", show: !!a.recovery_timeline },
    { id: "diet", label: "Diet Tips", show: !!a.diet_suggestions },
    { id: "missing", label: "Missing Tests", show: a.missing_tests?.length > 0 },
  ].filter(t => t.show);

  return (
    <div style={{ padding: "1.5rem", maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <button onClick={() => nav("/reports")} style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex" }}>
          <ArrowLeft size={16} color="var(--text-secondary)" />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>{a.report_type || report.file_name}</h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(report.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
        </div>
        {report.health_score && (
          <div style={{ textAlign: "center", background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "8px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: report.health_score >= 75 ? "var(--accent-green)" : report.health_score >= 50 ? "var(--accent-yellow)" : "var(--accent-red)" }}>{report.health_score}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Health Score</div>
          </div>
        )}
        <button onClick={handleDelete} className="btn btn-danger"><Trash2 size={14} /></button>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer" style={{ marginBottom: "1.25rem" }}>
        <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>This is AI-generated analysis for informational purposes only. Not a substitute for professional medical advice. Please consult a qualified healthcare professional.</span>
      </div>

      {/* Summary */}
      {a.summary && (
        <div className="card" style={{ marginBottom: "1.25rem", background: "var(--accent-green-light)", borderColor: "var(--accent-green-border)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Activity size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7 }}>{a.summary}</p>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {a.next_steps?.length > 0 && (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "0.75rem" }}>
            <ListChecks size={16} color="var(--accent-purple)" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Recommended Next Steps</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {a.next_steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ width: 20, height: 20, background: "var(--accent-purple-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--accent-purple)", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 4, marginBottom: "1rem", overflowX: "auto", paddingBottom: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "0.5px solid", borderColor: tab === t.id ? "var(--accent-green)" : "var(--border)", background: tab === t.id ? "var(--accent-green-light)" : "var(--bg-card)", color: tab === t.id ? "var(--accent-green)" : "var(--text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="card">
            {/* Findings */}
            {tab === "findings" && a.findings?.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: i < a.findings.length - 1 ? "0.5px solid var(--border-light)" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{f.parameter}</span>
                    <StatusBadge status={f.status} />
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{f.explanation}</p>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Normal range: {f.normal_range}</span>
                </div>
                <div style={{ textAlign: "right", marginLeft: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: f.status === "normal" ? "var(--accent-green)" : f.status === "critical" ? "var(--accent-red)" : "var(--accent-yellow)" }}>{f.value}</div>
                </div>
              </div>
            ))}

            {/* Red Flags */}
            {tab === "redflags" && a.red_flags?.map((r, i) => (
              <div key={i} style={{ padding: "14px", marginBottom: 10, background: r.severity === "critical" ? "var(--accent-red-light)" : "var(--accent-yellow-light)", borderRadius: 10, border: `0.5px solid ${r.severity === "critical" ? "var(--accent-red)" : "var(--accent-yellow)"}` }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <SeverityIcon s={r.severity} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{r.issue}</span>
                  <span className={`badge ${r.severity === "critical" ? "badge-critical" : "badge-warning"}`}>{r.severity?.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>{r.explanation}</p>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>⚡ Immediate Actions:</p>
                  {r.immediate_actions?.map((action, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                      <CheckCircle size={12} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Medicines */}
            {tab === "medicines" && a.medicines?.map((m, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < a.medicines.length - 1 ? "0.5px solid var(--border-light)" : "none" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, background: "var(--accent-purple-light)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Pill size={18} color="var(--accent-purple)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: "var(--accent-green)", marginBottom: 4 }}>🎯 {m.purpose}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>💊 Dosage: {m.dosage}</div>
                    {m.side_effects?.length > 0 && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>⚠️ Side effects: {m.side_effects.join(", ")}</div>}
                    {m.precautions?.length > 0 && <div style={{ fontSize: 12, color: "var(--accent-yellow)", marginTop: 4 }}>🔔 {m.precautions.join(". ")}</div>}
                  </div>
                </div>
              </div>
            ))}

            {/* Recovery */}
            {tab === "recovery" && a.recovery_timeline && (
              <div>
                <div className="disclaimer" style={{ marginBottom: "1rem" }}>
                  <Clock size={14} style={{ flexShrink: 0 }} />
                  <span>{a.recovery_timeline.disclaimer}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--accent-green)", marginBottom: "1rem" }}>Estimated: {a.recovery_timeline.estimated_duration}</div>
                {a.recovery_timeline.stages?.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 28, height: 28, background: "var(--accent-green-light)", border: "2px solid var(--accent-green)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--accent-green)", flexShrink: 0 }}>{i + 1}</div>
                      {i < a.recovery_timeline.stages.length - 1 && <div style={{ width: 2, flex: 1, background: "var(--border)", margin: "4px 0", minHeight: 20 }} />}
                    </div>
                    <div style={{ paddingBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{s.period}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.expectation}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Diet */}
            {tab === "diet" && a.diet_suggestions && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Salad size={16} color="var(--accent-green)" />
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Diet Recommendations</h4>
                </div>
                {a.diet_suggestions.foods_to_eat?.length > 0 && (
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--accent-green)", marginBottom: 6 }}>✅ Foods to eat</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {a.diet_suggestions.foods_to_eat.map((f, i) => <span key={i} className="badge badge-normal">{f}</span>)}
                    </div>
                  </div>
                )}
                {a.diet_suggestions.foods_to_avoid?.length > 0 && (
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--accent-red)", marginBottom: 6 }}>❌ Foods to avoid</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {a.diet_suggestions.foods_to_avoid.map((f, i) => <span key={i} className="badge badge-critical">{f}</span>)}
                    </div>
                  </div>
                )}
                {a.diet_suggestions.hydration && <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>💧 {a.diet_suggestions.hydration}</p>}
              </div>
            )}

            {/* Missing Tests */}
            {tab === "missing" && a.missing_tests?.map((t, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < a.missing_tests.length - 1 ? "0.5px solid var(--border-light)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 3 }}>{t.test_name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{t.reason}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Frequency: {t.frequency}</div>
                  </div>
                  <span className={`badge ${t.urgency === "urgent" ? "badge-critical" : t.urgency === "soon" ? "badge-warning" : "badge-normal"}`}>{t.urgency}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
