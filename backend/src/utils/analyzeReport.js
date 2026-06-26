const openai = require("../config/openai");

const SYSTEM_PROMPT = `You are ClarityMed AI, an expert medical report analyzer. Your job is to analyze medical reports and explain them in simple, clear language that any patient can understand.

IMPORTANT DISCLAIMERS TO ALWAYS INCLUDE:
- This is AI-generated analysis for informational purposes only
- Not a substitute for professional medical advice
- Always consult a qualified healthcare professional

You must respond ONLY in valid JSON format with this exact structure:
{
  "report_type": "string (e.g. CBC Blood Report, X-Ray Chest, Thyroid Panel, Prescription, etc.)",
  "summary": "2-3 sentence plain English summary of the report",
  "findings": [
    {
      "parameter": "parameter name",
      "value": "value with unit",
      "normal_range": "normal range",
      "status": "normal|low|high|critical",
      "explanation": "simple explanation of what this means"
    }
  ],
  "red_flags": [
    {
      "severity": "critical|warning",
      "issue": "what is wrong",
      "immediate_actions": ["action 1", "action 2"],
      "explanation": "why this matters"
    }
  ],
  "medicines": [
    {
      "name": "medicine name",
      "purpose": "what it treats",
      "dosage": "how much and when",
      "side_effects": ["side effect 1", "side effect 2"],
      "precautions": ["precaution 1"]
    }
  ],
  "recovery_timeline": {
    "estimated_duration": "e.g. 2-4 weeks",
    "stages": [
      { "period": "Week 1", "expectation": "what to expect" }
    ],
    "disclaimer": "This is an AI-estimated timeline. Actual recovery varies based on individual health, treatment adherence, and doctor guidance."
  },
  "missing_tests": [
    {
      "test_name": "test name",
      "reason": "why it might be needed",
      "urgency": "routine|soon|urgent",
      "frequency": "how often to get it"
    }
  ],
  "diet_suggestions": {
    "foods_to_eat": ["food 1", "food 2"],
    "foods_to_avoid": ["food 1", "food 2"],
    "hydration": "water intake recommendation",
    "supplements": ["supplement 1"]
  },
  "overall_health_score": 75,
  "health_score_explanation": "explanation of the score",
  "next_steps": ["step 1", "step 2", "step 3"]
}`;

const analyzeReport = async (extractedText, reportHint = "", userProfile = {}) => {
  const userContext = userProfile.age
    ? `Patient Profile: Age ${userProfile.age}, Weight ${userProfile.weight}kg, Height ${userProfile.height}cm, Gender ${userProfile.gender}.`
    : "";

  const prompt = `${userContext}

Analyze this medical report and provide detailed insights:

${reportHint ? `Report Type Hint: ${reportHint}` : ""}

Report Content:
${extractedText}

Provide a thorough analysis. If this is a prescription, focus on medicines array. If it's a blood report, focus on findings. If it's an X-ray report, explain imaging findings clearly. Always check for red flags.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    max_tokens: 3000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content;
  return JSON.parse(raw);
};

const analyzeXray = async (base64Image, bodyPart = "chest") => {
  const prompt = `Analyze this ${bodyPart} X-ray image and provide medical insights in JSON format.

Focus on:
- Visible abnormalities or findings
- Bone/tissue density
- Any areas of concern
- Comparison to normal appearance

Respond in the same JSON structure as a medical report analysis.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: "high" },
          },
        ],
      },
    ],
    max_tokens: 3000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

const generateDietPlan = async (userProfile, reports = []) => {
  const prompt = `Generate a personalized diet plan for this patient:

Profile:
- Age: ${userProfile.age}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm
- BMI: ${(userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1)}
- Gender: ${userProfile.gender}
- Health Goal: ${userProfile.goal || "maintain health"}
- Food Preference: ${userProfile.food_preference || "no restriction"}
- Allergies: ${userProfile.allergies || "none"}

Medical Conditions from reports: ${reports.join(", ") || "none specified"}

Respond in JSON:
{
  "bmi": number,
  "bmi_category": "string",
  "daily_calories": number,
  "macros": { "protein_g": number, "carbs_g": number, "fat_g": number },
  "meal_plan": {
    "breakfast": [{ "item": "string", "portion": "string", "calories": number }],
    "morning_snack": [{ "item": "string", "portion": "string", "calories": number }],
    "lunch": [{ "item": "string", "portion": "string", "calories": number }],
    "evening_snack": [{ "item": "string", "portion": "string", "calories": number }],
    "dinner": [{ "item": "string", "portion": "string", "calories": number }]
  },
  "foods_to_eat": ["food 1", "food 2"],
  "foods_to_avoid": ["food 1", "food 2"],
  "water_intake_liters": number,
  "supplements": ["supplement 1"],
  "exercise_recommendation": "string",
  "special_notes": ["note based on medical conditions"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { analyzeReport, analyzeXray, generateDietPlan };
