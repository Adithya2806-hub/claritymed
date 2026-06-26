import { useState } from "react";
import { User, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", age: user?.age || "", weight: user?.weight || "", height: user?.height || "", gender: user?.gender || "", food_preference: user?.food_preference || "no restriction", goal: user?.goal || "maintain health", allergies: user?.allergies || "" });
  const [loading, setLoading] = useState(false);

  const bmi = form.weight && form.height ? (form.weight / Math.pow(form.height / 100, 2)).toFixed(1) : null;
  const bmiLabel = bmi ? (bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese") : null;
  const bmiColor = bmi ? (bmi < 18.5 ? "var(--accent-yellow)" : bmi < 25 ? "var(--accent-green)" : bmi < 30 ? "var(--accent-yellow)" : "var(--accent-red)") : null;

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/auth/profile", form);
      setUser(u => ({ ...u, ...form }));
      toast.success("Profile updated!");
    } catch { toast.error("Update failed"); }
    finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ padding: "1.5rem", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>Profile Settings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Your health profile helps generate personalized recommendations</p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ textAlign: "center", marginBottom: "1.25rem", padding: "2rem" }}>
        <div style={{ width: 72, height: 72, background: "var(--accent-green-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "2px solid var(--accent-green-border)" }}>
          <User size={32} color="var(--accent-green)" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{user?.name}</h2>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{user?.email}</p>
        {bmi && (
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: "var(--bg-primary)", border: "0.5px solid var(--border)", borderRadius: 20, padding: "4px 14px", marginTop: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>BMI</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: bmiColor }}>{bmi}</span>
            <span style={{ fontSize: 12, color: bmiColor }}>{bmiLabel}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>Personal Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Full name</label>
              <input className="input" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Age</label>
                <input className="input" type="number" placeholder="25" value={form.age} onChange={e => set("age", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Gender</label>
                <select className="input" value={form.gender} onChange={e => set("gender", e.target.value)}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Weight (kg)</label>
                <input className="input" type="number" step="0.1" placeholder="70" value={form.weight} onChange={e => set("weight", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Height (cm)</label>
                <input className="input" type="number" placeholder="175" value={form.height} onChange={e => set("height", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>Diet Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Food preference</label>
              <select className="input" value={form.food_preference} onChange={e => set("food_preference", e.target.value)}>
                <option value="no restriction">No restriction</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-vegetarian</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Health goal</label>
              <select className="input" value={form.goal} onChange={e => set("goal", e.target.value)}>
                <option value="maintain health">Maintain health</option>
                <option value="lose weight">Lose weight</option>
                <option value="gain weight">Gain weight</option>
                <option value="build muscle">Build muscle</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Allergies</label>
              <input className="input" placeholder="e.g. peanuts, dairy, gluten" value={form.allergies} onChange={e => set("allergies", e.target.value)} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
          <Save size={15} /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
