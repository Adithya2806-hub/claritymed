import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");
  const [isXray, setIsXray] = useState(false);
  const [bodyPart, setBodyPart] = useState("chest");
  const inputRef = useRef();
  const nav = useNavigate();

  const handleFile = f => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) { toast.error("Only PDF and image files allowed"); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error("File too large. Max 10MB"); return; }
    setFile(f);
  };

  const handleDrop = e => {
    e.preventDefault(); setDrag(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) { toast.error("Please select a file"); return; }
    setLoading(true);
    const form = new FormData();
    form.append("report", file);
    form.append("report_hint", hint);
    if (isXray) { form.append("is_xray", "true"); form.append("body_part", bodyPart); }
    try {
      const res = await api.post("/reports/analyze", form, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Report analyzed successfully!");
      nav(`/reports/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: 680, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Analyze Report</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: "1.5rem" }}>Upload any medical report, prescription, or X-ray for AI analysis</p>

      <div className="disclaimer" style={{ marginBottom: "1.5rem" }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>AI analysis is for informational purposes only. Always consult a qualified healthcare professional for medical advice.</span>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        style={{ border: `2px dashed ${drag ? "var(--accent-green)" : file ? "var(--accent-purple)" : "var(--border)"}`, borderRadius: "var(--radius)", padding: "2.5rem 1.5rem", textAlign: "center", cursor: "pointer", background: drag ? "var(--accent-green-light)" : file ? "var(--accent-purple-light)" : "var(--bg-primary)", transition: "all 0.2s", marginBottom: "1.25rem" }}
      >
        <input ref={inputRef} type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        {file ? (
          <div>
            <div style={{ width: 48, height: 48, background: "var(--accent-purple-light)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <FileText size={24} color="var(--accent-purple)" />
            </div>
            <p style={{ fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>{file.name}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button onClick={e => { e.stopPropagation(); setFile(null); }} style={{ marginTop: 10, background: "var(--accent-red-light)", color: "var(--accent-red)", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <X size={12} /> Remove
            </button>
          </div>
        ) : (
          <div>
            <div style={{ width: 56, height: 56, background: "var(--border)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Upload size={26} color="var(--text-muted)" />
            </div>
            <p style={{ fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>Drop your file here</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>or click to browse</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Supports PDF, JPG, PNG, WEBP • Max 10MB</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: "1rem", color: "var(--text-primary)" }}>Report Options</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Report type hint (optional)</label>
            <select className="input" value={hint} onChange={e => setHint(e.target.value)}>
              <option value="">Auto-detect</option>
              <option value="CBC Blood Report">CBC Blood Report</option>
              <option value="Lipid Profile">Lipid Profile</option>
              <option value="Thyroid Panel">Thyroid Panel</option>
              <option value="Liver Function Test">Liver Function Test</option>
              <option value="Kidney Function Test">Kidney Function Test</option>
              <option value="Diabetes Report">Diabetes Report</option>
              <option value="Prescription">Prescription</option>
              <option value="X-Ray Report">X-Ray Report</option>
              <option value="MRI Report">MRI Report</option>
              <option value="Urine Report">Urine Report</option>
              <option value="Discharge Summary">Discharge Summary</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="xray" checked={isXray} onChange={e => setIsXray(e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="xray" style={{ fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>This is an X-Ray image (direct image analysis)</label>
          </div>

          {isXray && (
            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Body part</label>
              <select className="input" value={bodyPart} onChange={e => setBodyPart(e.target.value)}>
                <option value="chest">Chest</option>
                <option value="spine">Spine</option>
                <option value="knee">Knee</option>
                <option value="hip">Hip</option>
                <option value="hand">Hand/Wrist</option>
                <option value="skull">Skull</option>
                <option value="abdomen">Abdomen</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !file} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            Analyzing with AI... this may take 30-60 seconds
          </span>
        ) : (
          <><Upload size={16} /> Analyze Report</>
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
