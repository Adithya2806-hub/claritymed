import { useState, useEffect } from "react";
import { Users, Plus, Trash2, User, ChevronRight, Heart } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Family() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", relation: "parent", age: "", gender: "", blood_group: "" });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/family").then(res => setMembers(res.data.data || [])).catch(() => {});
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/family", form);
      setMembers(m => [...m, { ...form, id: res.data.data.id, reports: [] }]);
      setForm({ name: "", relation: "parent", age: "", gender: "", blood_group: "" });
      setShowForm(false);
      toast.success(`${form.name} added to family!`);
    } catch { toast.error("Failed to add member"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from family?`)) return;
    await api.delete(`/family/${id}`);
    setMembers(m => m.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("Removed");
  };

  const relationColors = {
    parent: "var(--accent-green)", spouse: "var(--accent-purple)",
    child: "var(--accent-yellow)", sibling: "var(--accent-red)", other: "var(--text-secondary)"
  };

  const relationEmoji = {
    parent: "👨‍👩‍👧", spouse: "💑", child: "👶", sibling: "👫", other: "👤"
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>Family Profiles</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Manage health profiles for your family members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><Plus size={15} /> Add Member</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "1.25rem", border: "0.5px solid var(--accent-green)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>Add Family Member</h3>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Name *</label>
                <input className="input" placeholder="e.g. Rajesh (Dad)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Relation</label>
                <select className="input" value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}>
                  <option value="parent">Parent</option>
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Age</label>
                <input className="input" type="number" placeholder="45" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Gender</label>
                <select className="input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Blood Group</label>
                <select className="input" value={form.blood_group} onChange={e => setForm(f => ({ ...f, blood_group: e.target.value }))}>
                  <option value="">Unknown</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Adding..." : "Add Member"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {members.length === 0 && !showForm ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <Users size={48} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.4 }} />
          <h3 style={{ color: "var(--text-primary)", marginBottom: 6 }}>No family members added</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: "1rem" }}>Add family members to track their health separately</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ display: "inline-flex" }}><Plus size={14} /> Add First Member</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {members.map(m => (
            <div key={m.id} className="card" style={{ cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", border: selected?.id === m.id ? "0.5px solid var(--accent-green)" : "0.5px solid var(--border)" }}
              onClick={() => setSelected(s => s?.id === m.id ? null : m)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, background: `${relationColors[m.relation]}20`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {relationEmoji[m.relation] || "👤"}
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(m.id, m.name); }} style={{ background: "var(--accent-red-light)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}>
                  <Trash2 size={13} color="var(--accent-red)" />
                </button>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{m.name}</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: `${relationColors[m.relation]}20`, color: relationColors[m.relation], textTransform: "capitalize" }}>{m.relation}</span>
                {m.age && <span className="badge badge-purple">{m.age} yrs</span>}
                {m.blood_group && <span className="badge badge-normal">{m.blood_group}</span>}
                {m.gender && <span style={{ fontSize: 12, color: "var(--text-muted)", padding: "2px 8px" }}>{m.gender}</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--accent-green)" }}>
                <Heart size={12} />
                <span>View health details</span>
                <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="card" style={{ marginTop: "1.25rem", border: "0.5px solid var(--accent-green)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ width: 40, height: 40, background: "var(--accent-green-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {relationEmoji[selected.relation]}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{selected.name}'s Health</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.relation} • {selected.age ? `${selected.age} years` : "Age not set"}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/reports/upload" className="btn btn-primary" style={{ fontSize: 13, textDecoration: "none" }}>📄 Analyze Report for {selected.name}</a>
            <a href="/reminders" className="btn btn-secondary" style={{ fontSize: 13, textDecoration: "none" }}>🔔 Set Reminder</a>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
            💡 Tip: When uploading a report for a family member, mention their name in the report hint field.
          </p>
        </div>
      )}
    </div>
  );
}
