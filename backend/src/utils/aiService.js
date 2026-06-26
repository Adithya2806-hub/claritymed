const openai = require("../config/openai");
const { fileToBase64, getMimeType } = require("./fileExtractor");

const DISCLAIMER = {
  general: "This analysis is AI-generated for informational purposes only. It does not constitute medical advice. Please consult a qualified healthcare professional for diagnosis and treatment.",
  recovery: "Recovery time is an AI estimate only. Actual duration varies based on individual health, treatment adherence, and doctor guidance.",
  xray: "X-Ray analysis by AI is not a substitute for radiologist review. Always get imaging reports reviewed by a certified medical professional.",
  diet: "Diet suggestions are AI-generated based on your reports. Consult a nutritionist or doctor before making significant dietary changes.",
};

const analyzeReport = async (filePath, mimeType, extractedText, reportType) => {
  const isImage = mimeType !== "application/pdf";

  const systemPrompt = `You are ClarityMed AI, an expert medical report analyzer. 
Analyze medical reports and provide clear, simple explanations for patients.
Always respond in valid JSON format only. No markdown, no extra text.
Be compassionate, clear, and avoid overly technical jargon.`;

  const userPrompt = `Analyze this medical report and return a JSON object with exactly this structure:
{
  "report_type": "detected report type (e.g. CBC Blood Test, X-Ray Chest, Lipid Profile, etc.)",
  "summary": "2-3 sentence simple summary of overall findings",
  "health_score": <number 0-100 based on results>,
  "severity": "normal | warning | critical",
  "findings": [
    {
      "parameter": "parameter name",
      "value": "patient value",
      "normal_range": "normal range",
      "status": "normal | high | low | abnormal",
      "explanation": "simple explanation of what this means"
    }
  ],
  "red_flags": [
    {
      "issue": "what is wrong",
      "severity": "warning | critical",
      "immediate_actions": ["action 1", "action 2"],
      "explanation": "why this is concerning"
    }
  ],
  "recovery_time": {
    "estimate": "estimated recovery time or management timeline",
    "stages": ["stage 1 description", "stage 2 description"],
    "disclaimer": "${DISCLAIMER.recovery}"
  },
  "missing_tests": [
    {
      "test_name": "test name",
      "reason": "why this test is recommended",
      "frequency": "how often"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "doctor_visit": "urgent | soon | routine | not_required",
  "disclaimer": "${DISCLAIMER.general}"
}

${extractedText ? `Report text content:\n${extractedText}` : "Analyze the uploaded image/document directly."}
Report type hint: ${reportType || "auto-detect"}`;

  try {
    let response;

    if (isImage) {
      const base64 = fileToBase64(filePath);
      const imageMediaType = mimeType;

      response = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 2000,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageMediaType};base64,${base64}`,
                  detail: "high",
                },
              },
              { type: "text", text: userPrompt },
            ],
          },
        ],
      });
    } else {
      response = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 2000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });
    }

    const content = response.choices[0].message.content.trim();
    const cleaned = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("AI analysis error:", err.message);
    throw new Error("AI analysis failed: " + err.message);
  }
};

const generateDietPlan = async (userData, reportSummaries) => {
  const bmi = userData.weight && userData.height
    ? (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1)
    : null;

  const prompt = `Generate a personalized diet plan for this patient and return valid JSON only:

Patient Profile:
- Age: ${userData.age || "unknown"}
- Weight: ${userData.weight || "unknown"} kg
- Height: ${userData.height || "unknown"} cm
- BMI: ${bmi || "unknown"}
- Gender: ${userData.gender || "unknown"}
- Food preference: ${userData.food_pref || "non-vegetarian"}
- Health goal: ${userData.health_goal || "maintain"}
- Allergies: ${userData.allergies || "none"}
- Blood group: ${userData.blood_group || "unknown"}

Recent Report Findings: ${reportSummaries || "No reports yet"}

Return JSON with this structure:
{
  "bmi": ${bmi || null},
  "bmi_category": "underweight | normal | overweight | obese",
  "daily_calories": <number>,
  "water_intake_liters": <number>,
  "meals": {
    "breakfast": {"time": "7-8 AM", "foods": ["food1", "food2"], "avoid": ["item1"]},
    "mid_morning": {"time": "10-11 AM", "foods": ["food1"], "avoid": []},
    "lunch": {"time": "12-1 PM", "foods": ["food1", "food2"], "avoid": ["item1"]},
    "evening": {"time": "4-5 PM", "foods": ["food1"], "avoid": []},
    "dinner": {"time": "7-8 PM", "foods": ["food1", "food2"], "avoid": ["item1"]}
  },
  "foods_to_eat": ["food1", "food2"],
  "foods_to_avoid": ["food1", "food2"],
  "supplements": [{"name": "supplement", "reason": "why", "note": "consult doctor"}],
  "exercise": ["exercise recommendation 1", "exercise recommendation 2"],
  "special_notes": ["note based on medical conditions"],
  "disclaimer": "${DISCLAIMER.diet}"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1500,
      messages: [
        { role: "system", content: "You are a medical nutritionist AI. Return valid JSON only." },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0].message.content.trim();
    const cleaned = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Diet plan generation failed: " + err.message);
  }
};

const askMedicalQuestion = async (question, reportContext) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `You are ClarityMed AI assistant. Answer medical questions based on the patient's reports.
Always add: "Please consult your doctor for personalized medical advice."
Be clear, compassionate, and avoid overly technical terms.`,
        },
        {
          role: "user",
          content: `Patient's report context: ${reportContext || "No reports available yet"}
          
Question: ${question}`,
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (err) {
    throw new Error("AI chat failed: " + err.message);
  }
};

module.exports = { analyzeReport, generateDietPlan, askMedicalQuestion, DISCLAIMER };
