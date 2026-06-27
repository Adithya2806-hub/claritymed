import { useState, useEffect } from "react";
import { Salad, RefreshCw, AlertCircle, Droplets, Dumbbell } from "lucide-react";
import api from "../utils/api";

export default function Diet() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlan = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get("/diet");
      setPlan(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate diet plan");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPlan(); }, []);

  const meals = plan ? [
    { key: "breakfast", label: "🌅 Breakfast", time: "7:00 - 8:00 AM" },
    { key: "morning_snack", label: "☕ Morning Snack", time: "10:00 - 11:00 AM" },
    { key: "lunch", label: "☀️ Lunch", time: "12:30 - 1:30 PM" },
    { key: "evening_snack", label: "🍵 Evening Snack", time: "4:00 - 5:00 PM" },
    { key: "dinner", label: "🌙 Dinner", time: "7:00 - 8:00 PM" },
  ] : [];

  const getBMIColor = bmi => bmi < 18.5 ? "var(--accent-yellow)" : bmi < 25 ? "var(--accent-green)" : bmi < 30 ? "var(--accent-yellow)" : "var(--accent-red)";

  return (
    <div style={{ padding: "1.5rem", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>Personalized Diet Plan</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>AI-generated based on your profile and reports</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchPlan} disabled={loading}>
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Regenerate
        </button>
      </div>

      <div className="disclaimer" style={{ marginBottom: "1.5rem" }}>
        <AlertCircle size={14} style={{ flexShrink: 0 }} />
        <span>Diet suggestions are AI-generated based on your health data. Consult a nutritionist or doctor before making significant dietary changes.</span>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent-green)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p>Generating your personalized diet plan...</p>
        </div>
      )}

      {error && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <Salad size={40} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.4 }} />
          <h3 style={{ color: "var(--text-primary)", marginBottom: 6 }}>Cannot generate diet plan</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: "1rem" }}>{error}</p>
          <a href="/profile" className="btn btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>Update Profile</a>
        </div>
      )}

      {plan && !loading && (
        <>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>
            {[
              { label: "BMI", value: plan.bmi, unit: plan.bmi_category, color: getBMIColor(plan.bmi) },
              { label: "Daily Calories", value: plan.daily_calories, unit: "kcal", color: "var(--accent-purple)" },
              { label: "Protein", value: `${plan.macros?.protein_g}g`, unit: "per day", color: "var(--accent-green)" },
              { label: "Water Intake", value: `${plan.water_intake_liters}L`, unit: "per day", color: "var(--accent-yellow)" },
            ].map(s => (
              <div key={s.label} className="card">
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.unit}</div>
              </div>
            ))}
          </div>

          {/* Meal Plan */}
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>Daily Meal Plan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {meals.map(meal => {
                const items = plan.meal_plan?.[meal.key] || [];
                if (!items.length) return null;
                const totalCal = items.reduce((s, i) => s + (i.calories || 0), 0);
                return (
                  <div key={meal.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{meal.label}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>{meal.time}</span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--accent-purple)", background: "var(--accent-purple-light)", padding: "2px 8px", borderRadius: 20 }}>{totalCal} kcal</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 12, borderLeft: "2px solid var(--border)" }}>
                      {items.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>• {item.item}</span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.portion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.25rem" }}>
            {/* Foods to eat */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem", color: "var(--accent-green)" }}>✅ Foods to Eat</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {plan.foods_to_eat?.map((f, i) => <span key={i} className="badge badge-normal">{f}</span>)}
              </div>
            </div>
            {/* Foods to avoid */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem", color: "var(--accent-red)" }}>❌ Foods to Avoid</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {plan.foods_to_avoid?.map((f, i) => <span key={i} className="badge badge-critical">{f}</span>)}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Hydration */}
            <div className="card" style={{ background: "var(--accent-green-light)", borderColor: "var(--accent-green-border)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <Droplets size={16} color="var(--accent-green)" />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Hydration</h3>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Drink {plan.water_intake_liters}L of water daily — spread throughout the day</p>
            </div>
            {/* Exercise */}
            <div className="card">
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <Dumbbell size={16} color="var(--accent-purple)" />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Exercise</h3>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{plan.exercise_recommendation}</p>
            </div>
          </div>

          {plan.special_notes?.length > 0 && (
            <div className="card" style={{ marginTop: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>📋 Special Notes</h3>
              {plan.special_notes.map((n, i) => <p key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>• {n}</p>)}
            </div>
          )}
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 0.8s linear infinite; }`}</style>
    </div>
  );
}
