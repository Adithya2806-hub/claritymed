require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { testConnection } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });
app.use("/api", limiter);

app.get("/", (req, res) => res.json({
  success: true,
  message: "ClarityMed API 🏥",
  version: "2.0.0",
  endpoints: {
    auth: "/api/auth",
    reports: "/api/reports",
    medicines: "/api/medicines",
    reminders: "/api/reminders",
    diet: "/api/diet",
    chat: "/api/chat",
    family: "/api/family",
  }
}));

app.get("/health", (req, res) => res.json({ success: true, status: "OK", timestamp: new Date().toISOString() }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/medicines", require("./routes/medicine.routes"));
app.use("/api/reminders", require("./routes/reminder.routes"));
app.use("/api/diet", require("./routes/diet.routes"));
app.use("/api/chat", require("./routes/chat.routes"));
app.use("/api/family", require("./routes/family.routes"));

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log("🏥 ClarityMed API running at http://localhost:" + PORT);
    console.log("📝 Environment: " + (process.env.NODE_ENV || "development"));
  });
};

start();
