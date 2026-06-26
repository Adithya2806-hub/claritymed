# ClarityMed 🏥

AI-powered medical report analyzer — understand any medical report in simple language.

**Built by:** Adithya Vardhan Reddy T

---

## Live Demo
- **Frontend:** https://claritymed.vercel.app (after deployment)
- **Backend API:** https://claritymed-api.up.railway.app (after deployment)

---

## Features — All 5 Phases Complete

### Phase 1 — Core ✅
- JWT Authentication (Login / Register)
- Upload any medical report (PDF or image)
- AI analysis of every report type (Blood, Urine, Thyroid, Cardiac, Hormone, Cancer markers, Discharge summary, Prescription)
- X-Ray direct image analysis
- Red flag alerts with severity levels + immediate action steps
- Estimated recovery timeline with disclaimer
- Missing test detector
- Report history

### Phase 2 — Health Intelligence ✅
- Height / Weight / BMI profile
- Personalized diet plan (breakfast to dinner)
- Foods to eat and avoid based on reports
- Overall health score (0–100)
- Health score per report

### Phase 3 — Reminders ✅
- Medicine alarms with ON/OFF toggle
- Test reminders (monthly / 3 months / 6 months / yearly)
- Doctor visit reminders
- Revisit reminders
- Quick-add routine tests

### Phase 4 — Advanced ✅
- Ask AI chat with report context
- Health timeline with interactive charts
- Family profiles (parents, spouse, children)
- Doctor directory integration
- Medicine interaction awareness

### Phase 5 — Polish ✅
- PWA support (installable on mobile)
- Full landing page
- Light / Dark theme toggle (warm/friendly ↔ dark/premium)
- Mobile-responsive navbar with hamburger menu
- Smooth animations and transitions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| AI | OpenAI GPT-4o |
| File Processing | Multer, pdf-parse, Tesseract.js |
| Auth | JWT + bcryptjs |
| Deployment | Railway (Backend + DB), Vercel (Frontend) |

---

## Project Structure

```
claritymed/
├── backend/
│   ├── src/
│   │   ├── config/         db.js, openai.js
│   │   ├── controllers/    auth, report, medicine, reminder, diet, chat, family
│   │   ├── middleware/      auth, upload, errorHandler
│   │   ├── models/         user, report, medicine, reminder, family
│   │   ├── routes/         all routes
│   │   ├── utils/          extractText, analyzeReport
│   │   └── index.js
│   ├── sql/schema.sql
│   └── package.json
└── frontend/
    ├── public/             manifest.json, index.html
    └── src/
        ├── components/     Navbar
        ├── context/        AuthContext, ThemeContext
        ├── pages/          Landing, Login, Register, Dashboard,
        │                   Reports, UploadReport, ReportDetail,
        │                   Medicines, Reminders, Diet, Profile,
        │                   AskAI, Timeline, Family
        ├── utils/          api.js
        └── App.js
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |
| POST | /api/reports/analyze | Upload + analyze report |
| GET | /api/reports | List reports |
| GET | /api/reports/:id | Get report details |
| DELETE | /api/reports/:id | Delete report |
| GET | /api/medicines | List medicines |
| POST | /api/medicines | Add medicine |
| PATCH | /api/medicines/:id/toggle | Toggle alarm |
| DELETE | /api/medicines/:id | Delete |
| GET | /api/reminders | List reminders |
| POST | /api/reminders | Add reminder |
| PATCH | /api/reminders/:id/toggle | Toggle |
| DELETE | /api/reminders/:id | Delete |
| GET | /api/diet | Personalized diet plan |
| POST | /api/chat | Ask AI |
| GET | /api/family | List family members |
| POST | /api/family | Add member |
| DELETE | /api/family/:id | Remove member |

---

## Local Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill: DB_PASSWORD, JWT_SECRET, OPENAI_API_KEY
mysql -u root -p < sql/schema.sql
npm run dev
# Runs at http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
# .env already has REACT_APP_API_URL=http://localhost:5000/api
npm start
# Runs at http://localhost:3000
```

---

## Deployment

### Backend → Railway
1. New project → Deploy from GitHub repo
2. Add MySQL database service
3. Run `sql/schema.sql` in Railway MySQL query tab
4. Set environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, OPENAI_API_KEY)
5. Generate domain

### Frontend → Vercel
1. Import GitHub repo
2. Set `REACT_APP_API_URL` to your Railway backend URL
3. Deploy

---

## AI Disclaimers

All AI-generated content in ClarityMed is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making any health decisions.

---

## Author

**Adithya Vardhan Reddy T**
CSE Student — Built for portfolio and internship submission
