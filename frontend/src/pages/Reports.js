import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Upload, Trash2, Search } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/reports").then(res => setReports(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this report?")) return;
    await api.delete(`/reports/${id}`);
    setReports(r => r.filter(x => x.id !== id));
    toast.success("Deleted");
  };

  const filtered = reports.filter(r =>
    r.report_type?.toLowerCase().includes(search.toLowerCase()) ||
    r.file_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getScoreColor = s => s >= 75 ? "var(--accent-green)" : s >= 50 ? "var(--accent-yellow)" : "var(--accent-red)";

  return (
    <div style={{ padding: "1.5rem", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>Medical Reports</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{reports.length} report{reports.length !== 1 ? "s" : ""} analyzed</p>
        </div>
        <Link to="/reports/upload" className="btn btn-primary"><Upload size={15} /> Analyze New Report</Link>
      </div>

      {reports.length > 0 && (
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input" style={{ paddingLeft: 38 }} placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <FileText size={48} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.4 }} />
          <h3 style={{ color: "var(--text-primary)", marginBottom: 6 }}>{search ? "No matching reports" : "No reports yet"}</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: "1rem" }}>Upload your first medical report to get AI-powered insights</p>
          <Link to="/reports/upload" className="btn btn-primary" style={{ display: "inline-flex" }}><Upload size={14} /> Upload Report</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(r => (
            <Link key={r.id} to={`/reports/${r.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ display: "flex", alignItems: "center", gap: 14, transition: "transform 0.15s, box-shadow 0.15s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ width: 44, height: 44, background: "var(--accent-purple-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={20} color="var(--accent-purple)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.report_type || "Medical Report"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.file_name} • {new Date(r.created_at).toLocaleDateString("en-IN")}</div>
                </div>
                {r.health_score && (
                  <div style={{ textAlign: "center", padding: "4px 12px", background: `${getScoreColor(r.health_score)}15`, borderRadius: 8 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: getScoreColor(r.health_score) }}>{r.health_score}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>score</div>
                  </div>
                )}
                <button onClick={e => handleDelete(r.id, e)} style={{ background: "var(--accent-red-light)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex", flexShrink: 0 }}>
                  <Trash2 size={14} color="var(--accent-red)" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
