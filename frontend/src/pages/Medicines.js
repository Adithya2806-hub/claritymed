import { useState, useEffect } from "react";
import { Pill, Plus, Trash2, Clock, AlertCircle } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", purpose: "", dosage: "", times: ["08:00"] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/medicines").then(res => setMedicines(res.data.data || []));
  }, []);

  const addTime = () => setForm(f => ({ ...f, times: [...f.times, "12:00"] }));
  const removeTime = i => setForm(f => ({ ...f, times: f.times.filter((_, idx) => idx !== i) }));
  const setTime = (i, v) => setForm(f => ({ ...f, times: f.times.map((t, idx) => idx === i ? v : t) }));

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/medicines", form);
      setMedicines(m => [{ ...form, id: res.data.data.id, is_active: 1, created_at: new Date() }, ...m]);
      setForm({ name: "", purpose: "", dosage: "", times: ["08:00"] });
      setShowForm(false);
      toast.success("Medicine added!");
    } catch { toast.error("Failed to add medicine"); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id, current) => {
    await api.patch(`/medicines/${id}/toggle`, { is_active: current ? 0 : 1 });
    setMedicines(m => m.map(x => x.id === id ? { ...x, is_active: current ? 0 : 1 } : x));
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this medicine?")) return;
    await api.delete(`/medicines/${id}`);
    setMedicines(m => m.filter(x => x.id !== id));
    toast.success("Deleted");
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>Medicine Alarms</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Manage your medicine schedule</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={15} /> Add Medicine</button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: "1.25rem", border: "0.5px solid var(--accent-green)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>Add New Medicine</h3>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Medicine name *</label>
                <input className="input" placeholder="e.g. Metformin 500mg" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Purpose</label>
                <input className="input" placeholder="e.g. For diabetes" value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Dosage</label>
              <input className="input" placeholder="e.g. 1 tablet after meals" value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Alarm times</label>
                <button type="button" onClick={addTime} style={{ fontSize: 12, color: "var(--accent-green)", background: "none", border: "none", cursor: "pointer" }}>+ Add time</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {form.times.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-primary)", border: "0.5px solid var(--border)", borderRadius: 8, padding: "4px 8px" }}>
                    <Clock size={13} color="var(--accent-green)" />
                    <input type="time" value={t} onChange={e => setTime(i, e.target.value)} style={{ border: "none", background: "transparent", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                    {form.times.length > 1 && <button type="button" onClick={() => removeTime(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-red)", fontSize: 16, lineHeight: 1 }}>×</button>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Adding..." : "Add Medicine"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="disclaimer" style={{ marginBottom: "1.25rem" }}>
        <AlertCircle size={14} style={{ flexShrink: 0 }} />
        <span>Always follow your doctor's prescription. Do not start or stop medicines without medical advice.</span>
      </div>

      {medicines.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <Pill size={48} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.4 }} />
          <h3 style={{ color: "var(--text-primary)", marginBottom: 6 }}>No medicines added</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Add your medicines to set up reminders</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {medicines.map(m => (
            <div key={m.id} className="card" style={{ display: "flex", gap: 14, alignItems: "center", opacity: m.is_active ? 1 : 0.6 }}>
              <div style={{ width: 44, height: 44, background: m.is_active ? "var(--accent-green-light)" : "var(--bg-primary)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "0.5px solid var(--border)" }}>
                <Pill size={20} color={m.is_active ? "var(--accent-green)" : "var(--text-muted)"} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>{m.name}</div>
                {m.purpose && <div style={{ fontSize: 12, color: "var(--accent-green)", marginBottom: 4 }}>{m.purpose}</div>}
                {m.dosage && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{m.dosage}</div>}
                {m.times?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {m.times.map((t, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, background: "var(--bg-primary)", border: "0.5px solid var(--border)", borderRadius: 6, padding: "2px 8px", color: "var(--text-secondary)" }}>
                        <Clock size={11} /> {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                {/* Toggle Switch */}
                <div onClick={() => handleToggle(m.id, m.is_active)} style={{ width: 44, height: 24, background: m.is_active ? "var(--accent-green)" : "var(--border)", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                  <div style={{ width: 18, height: 18, background: "white", borderRadius: "50%", position: "absolute", top: 3, left: m.is_active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
                <button onClick={() => handleDelete(m.id)} style={{ background: "var(--accent-red-light)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer" }}>
                  <Trash2 size={14} color="var(--accent-red)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
