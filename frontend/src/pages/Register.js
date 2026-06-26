import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", weight: "", height: "", gender: "", food_preference: "no restriction", goal: "maintain health", allergies: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = async e => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      toast.success("Welcome to ClarityMed!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, background: "var(--accent-green-light)", borderRadius: 14, border: "0.5px solid var(--accent-green-border)", marginBottom: 12 }}>
            <Heart size={24} color="var(--accent-green)" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>ClarityMed</h1>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
            {[1, 2].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? "var(--accent-green)" : "var(--border)", transition: "background 0.3s" }} />
            ))}
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4, color: "var(--text-primary)" }}>
            {step === 1 ? "Create account" : "Health profile"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            {step === 1 ? "Basic information to get started" : "Helps us personalize your diet plan (optional)"}
          </p>

          <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {step === 1 ? (
              <>
                <div><label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Full name</label><input className="input" placeholder="Adithya Vardhan" value={form.name} onChange={e => set("name", e.target.value)} required /></div>
                <div><label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Email</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} required /></div>
                <div><label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Password</label><input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set("password", e.target.value)} required minLength={6} /></div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div><label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Age</label><input className="input" type="number" placeholder="25" value={form.age} onChange={e => set("age", e.target.value)} /></div>
                  <div><label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Weight (kg)</label><input className="input" type="number" placeholder="70" value={form.weight} onChange={e => set("weight", e.target.value)} /></div>
                  <div><label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Height (cm)</label><input className="input" type="number" placeholder="175" value={form.height} onChange={e => set("height", e.target.value)} /></div>
                </div>
                <div><label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Gender</label>
                  <select className="input" value={form.gender} onChange={e => set("gender", e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Food preference</label>
                  <select className="input" value={form.food_preference} onChange={e => set("food_preference", e.target.value)}>
                    <option value="no restriction">No restriction</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="non-vegetarian">Non-vegetarian</option>
                  </select>
                </div>
                <div><label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Health goal</label>
                  <select className="input" value={form.goal} onChange={e => set("goal", e.target.value)}>
                    <option value="maintain health">Maintain health</option>
                    <option value="lose weight">Lose weight</option>
                    <option value="gain weight">Gain weight</option>
                    <option value="build muscle">Build muscle</option>
                  </select>
                </div>
                <div><label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Allergies (optional)</label><input className="input" placeholder="e.g. peanuts, dairy" value={form.allergies} onChange={e => set("allergies", e.target.value)} /></div>
              </>
            )}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              {loading ? "Creating account..." : step === 1 ? "Continue" : "Create account"}
            </button>
            {step === 2 && <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ width: "100%", justifyContent: "center" }}>Back</button>}
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: "1.25rem" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--accent-green)", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
