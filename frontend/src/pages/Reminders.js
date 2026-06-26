import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Calendar, Stethoscope, TestTube, RefreshCw } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

const typeIcons = { test: TestTube, doctor: Stethoscope, revisit: RefreshCw, general: Bell };
const typeColors = { test: "var(--accent-purple)", doctor: "var(--accent-green)", revisit: "var(--accent-yellow)", general: "var(--text-secondary)" };
const typeBg = { test: "var(--accent-purple-light)", doctor: "var(--accent-green-light)", revisit: "var(--accent-yellow-light)", general: "var(--bg-primary)" };

const SUGGESTED_TESTS = [
  { name: "CBC Blood Count", freq: "6months" }, { name: "Blood Sugar Fasting", freq: "3months" },
  { name: "HbA1c", freq: "3months" }, { name: "Lipid Profile", freq: "6months" },
  { name: "Thyroid TSH", freq: "yearly" }, { name: "Vitamin D", freq: "6months" },
  { name: "Liver Function LFT", freq: "6months" }, { name: "Kidney Function KFT", freq: "6months" },
  { name: "Full Body Checkup", freq: "yearly" }, { name: "Eye Test", freq: "yearly" },
];

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "test", title: "", description: "", reminder_date: "", frequency: "once" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/reminders").then(res => setReminders(res.data.data || []));
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/reminders", form);
      setReminders(r => [...r, { ...form, id: res.data.data.id, is_active: 1 }]);
      setForm({ type: "test", title: "", description: "", reminder_date: "", frequency: "once" });
      setShowForm(false);
      toast.success("Reminder set!");
    } catch { toast.error("Failed to set reminder"); }
    finally { setLoading(false); }
  };

  const quickAdd = async test => {
    const date = new Date();
    date.setMonth(date.getMonth() + (test.freq === "3months" ? 3 : test.freq === "6months" ? 6 : 12));
    try {
      const payload = { type: "test", title: test.name, reminder_date: date.toISOString().slice(0, 16), frequency: test.freq };
      const res = await api.post("/reminders", payload);
      setReminders(r => [...r, { ...payload, id: res.data.data.id, is_active: 1 }]);
      toast.success(`${test.name} reminder set!`);
    } catch { toast.error("Failed"); }
  };

  const handleToggle = async (id, current) => {
    await api.patch(`/reminders/${id}/toggle`, { is_active: current ? 0 : 1 });
    setReminders(r => r.map(x => x.id === id ? { ...x, is_active: current ? 0 : 1 } : x));
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete reminder?")) return;
    await api.delete(`/reminders/${id}`);
    setReminders(r => r.filter(x => x.id !== id));
    toast.success("Deleted");
  };

  const isUpcoming = r => new Date(r.reminder_date) > new Date();
  const upcoming = reminders.filter(isUpcoming);
  const past = reminders.filter(r => !isUpcoming(r));

  const ReminderCard = ({ r }) => {
    const Icon = typeIcons[r.type] || Bell;
    return (
      <div className="card" style={{ display: "flex", gap: 12, alignItems: "center", opacity: r.is_active ? 1 : 0.5 }}>
        <div style={{ width: 40, height: 40, background: typeBg[r.type], borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={18} color={typeColors[r.type]} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{r.title}</div>
          {r.description && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{r.description}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={11} /> {new Date(r.reminder_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </span>
            <span className="badge badge-purple" style={{ fontSize: 11 }}>{r.frequency}</span>
            <span className={`badge ${r.type === "doctor" || r.type === "revisit" ? "badge-normal" : "badge-purple"}`} style={{ fontSize: 11 }}>{r.type}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <div onClick={() => handleToggle(r.id, r.is_active)} style={{ width: 40, height: 22, background: r.is_active ? "var(--accent-green)" : "var(--border)", borderRadius: 11, position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
            <div style={{ width: 16, height: 16, background: "white", borderRadius: "50%", position: "absolute", top: 3, left: r.is_active ? 21 : 3, transition: "left 0.2s" }} />
          </div>
          <button onClick={() => handleDelete(r.id)} style={{ background: "var(--accent-red-light)", border: "none", borderRadius: 8, padding: 7, cursor: "pointer" }}>
            <Trash2 size={13} color="var(--accent-red)" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>Reminders</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Tests, doctor visits, and medicine reminders</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={15} /> Add Reminder</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "1.25rem", border: "0.5px solid var(--accent-green)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>New Reminder</h3>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="test">🧪 Lab Test</option>
                  <option value="doctor">👨‍⚕️ Doctor Visit</option>
                  <option value="revisit">🔄 Revisit</option>
                  <option value="general">🔔 General</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Frequency</label>
                <select className="input" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                  <option value="once">Once</option>
                  <option value="monthly">Monthly</option>
                  <option value="3months">Every 3 months</option>
                  <option value="6months">Every 6 months</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Title *</label>
              <input className="input" placeholder="e.g. CBC Blood Test" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Date & Time *</label>
              <input className="input" type="datetime-local" value={form.reminder_date} onChange={e => setForm(f => ({ ...f, reminder_date: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Notes (optional)</label>
              <input className="input" placeholder="Any additional notes" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Setting..." : "Set Reminder"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Suggested Tests */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>⚡ Quick Add Routine Tests</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SUGGESTED_TESTS.map(t => (
            <button key={t.name} onClick={() => quickAdd(t)} style={{ fontSize: 12, padding: "5px 12px", background: "var(--accent-purple-light)", color: "var(--accent-purple)", border: "0.5px solid var(--accent-purple)", borderRadius: 20, cursor: "pointer", transition: "opacity 0.2s" }}>
              + {t.name}
            </button>
          ))}
        </div>
      </div>

      {upcoming.length > 0 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>📅 Upcoming ({upcoming.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{upcoming.map(r => <ReminderCard key={r.id} r={r} />)}</div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-secondary)" }}>Past ({past.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{past.map(r => <ReminderCard key={r.id} r={r} />)}</div>
        </div>
      )}

      {reminders.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <Bell size={48} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.4 }} />
          <h3 style={{ color: "var(--text-primary)", marginBottom: 6 }}>No reminders set</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Set reminders for tests, doctor visits, and more</p>
        </div>
      )}
    </div>
  );
}
