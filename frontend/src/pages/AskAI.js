import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, FileText, AlertCircle, Trash2 } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function AskAI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm ClarityMed AI 🏥 I can help you understand your medical reports, explain medicines, answer health questions, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    api.get("/reports").then(res => setReports(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        message: input.trim(),
        report_id: selectedReport || null,
        history: messages.slice(-10),
      });
      setMessages(m => [...m, { role: "assistant", content: res.data.data.reply }]);
    } catch (err) {
      toast.error("AI response failed");
      setMessages(m => [...m, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Chat cleared! How can I help you?" }]);
  };

  const suggestions = [
    "What does high creatinine mean?",
    "Explain my CBC report values",
    "What foods should I avoid with diabetes?",
    "What is HbA1c and why is it important?",
    "How long does it take to recover from anemia?",
    "What are the side effects of Metformin?",
  ];

  return (
    <div style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column", maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" }}>Ask AI</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Chat about your health and reports</p>
        </div>
        <button onClick={clearChat} className="btn btn-secondary" style={{ fontSize: 12 }}>
          <Trash2 size={13} /> Clear
        </button>
      </div>

      {/* Report selector */}
      {reports.length > 0 && (
        <div style={{ marginBottom: "0.75rem", display: "flex", gap: 8, alignItems: "center" }}>
          <FileText size={14} color="var(--text-muted)" />
          <select className="input" style={{ flex: 1, fontSize: 13 }} value={selectedReport} onChange={e => setSelectedReport(e.target.value)}>
            <option value="">Chat without a report context</option>
            {reports.map(r => (
              <option key={r.id} value={r.id}>{r.report_type || r.file_name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="disclaimer" style={{ marginBottom: "0.75rem", fontSize: 11 }}>
        <AlertCircle size={12} style={{ flexShrink: 0 }} />
        <span>AI responses are for informational purposes only. Not a substitute for professional medical advice.</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "var(--accent-purple-light)" : "var(--accent-green-light)", border: `0.5px solid ${msg.role === "user" ? "var(--accent-purple)" : "var(--accent-green-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {msg.role === "user" ? <User size={16} color="var(--accent-purple)" /> : <Bot size={16} color="var(--accent-green)" />}
            </div>
            <div style={{ maxWidth: "75%", background: msg.role === "user" ? "var(--accent-purple-light)" : "var(--bg-card)", border: `0.5px solid ${msg.role === "user" ? "var(--accent-purple)" : "var(--border)"}`, borderRadius: msg.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px", padding: "10px 14px", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-green-light)", border: "0.5px solid var(--accent-green-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={16} color="var(--accent-green)" />
            </div>
            <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "4px 12px 12px 12px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", animation: `bounce 1s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ marginTop: "0.75rem", marginBottom: "0.5rem" }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Suggested questions:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} style={{ fontSize: 12, padding: "5px 10px", background: "var(--bg-card)", color: "var(--text-secondary)", border: "0.5px solid var(--border)", borderRadius: 20, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.color = "var(--accent-green)"; }}
                onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-secondary)"; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: "0.75rem" }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="Ask anything about your health or reports..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ background: "var(--accent-green)", border: "none", borderRadius: 10, padding: "0 16px", cursor: "pointer", display: "flex", alignItems: "center", opacity: loading || !input.trim() ? 0.5 : 1 }}>
          <Send size={16} color="white" />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
