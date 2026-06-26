const openai = require("../config/openai");
const ReportModel = require("../models/report.model");

const SYSTEM_PROMPT = `You are ClarityMed AI, a helpful medical assistant. You help users understand their medical reports, explain medical terms, and provide health information in simple language.

IMPORTANT RULES:
1. Always respond in clear, simple language anyone can understand
2. Never diagnose conditions — only explain and educate
3. Always remind users to consult a doctor for medical decisions
4. Be empathetic and supportive
5. If asked about specific report values, explain what they mean in context
6. Keep responses concise but helpful (2-4 paragraphs max)

DISCLAIMER: Always end your response with: "⚕️ Remember: This is informational only. Please consult your doctor for medical advice."`;

const chat = async (req, res) => {
  try {
    const { message, report_id, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    let reportContext = "";
    if (report_id) {
      const report = await ReportModel.getById(report_id, req.user.id);
      if (report) {
        const a = report.analysis || {};
        reportContext = `\n\nUser's Report Context (${a.report_type || "Medical Report"}):\nSummary: ${a.summary || "N/A"}\nKey Findings: ${a.findings?.slice(0, 5).map(f => `${f.parameter}: ${f.value} (${f.status})`).join(", ") || "N/A"}\nRed Flags: ${a.red_flags?.map(r => r.issue).join(", ") || "None"}`;
      }
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT + reportContext },
      ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 600,
      temperature: 0.5,
    });

    const reply = response.choices[0].message.content;
    res.json({ success: true, data: { reply } });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ success: false, message: "AI chat failed: " + err.message });
  }
};

module.exports = { chat };
