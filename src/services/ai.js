import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: In a production app, you should never expose your API key in the frontend code.
// Ideally, call a backend that calls this API. For this MVP,// Keys are now in .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeSymptoms(symptoms, doctorList = []) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are CareSync AI, an intelligent clinical triage and care-routing assistant.

Your task is to analyze a patient's complaint and return a STRICT JSON object.

You must:
1. Identify the most likely medical condition or disease (do NOT guess rare diseases).
2. Classify severity based on symptoms.
3. Recommend the correct specialist.
4. Select suitable nearby doctors ONLY from the provided doctor list.
5. Decide the next action (appointment or emergency).

Severity rules:
- "low" → mild, non-urgent symptoms
- "moderate" → needs medical attention soon
- "high" → urgent, same-day consultation
- "critical" → life-threatening, emergency required

Allowed actions:
- "appointment"
- "emergency"

Output rules (VERY IMPORTANT):
- Return ONLY valid JSON
- Do NOT include explanations
- Do NOT add markdown
- Do NOT add text outside JSON
- Follow the exact schema shown in examples

-------------------
FEW-SHOT EXAMPLES
-------------------

Input Complaint:
"I have chest pain, sweating, and shortness of breath"

Available Doctors:
[
  { "name": "Dr. Arun Kumar", "specialist": "cardiologist", "distance_km": 2.1 },
  { "name": "Dr. Meena Rao", "specialist": "general physician", "distance_km": 1.3 }
]

Expected JSON Output:
{
  "probable_disease": "acute coronary syndrome",
  "severity": "critical",
  "specialist": "cardiologist",
  "risk_score": 9,
  "recommended_action": "emergency",
  "nearby_doctors": [
    {
      "name": "Dr. Arun Kumar",
      "specialist": "cardiologist",
      "distance_km": 2.1
    }
  ]
}

-------------------

Input Complaint:
"I have mild fever, sore throat, and cold for two days"

Available Doctors:
[
  { "name": "Dr. Ramesh Patel", "specialist": "general physician", "distance_km": 0.8 },
  { "name": "Dr. Sneha Iyer", "specialist": "ENT", "distance_km": 1.9 }
]

Expected JSON Output:
{
  "probable_disease": "viral upper respiratory infection",
  "severity": "low",
  "specialist": "general physician",
  "risk_score": 2,
  "recommended_action": "appointment",
  "nearby_doctors": [
    {
      "name": "Dr. Ramesh Patel",
      "specialist": "general physician",
      "distance_km": 0.8
    }
  ]
}

-------------------
NOW PROCESS THE FOLLOWING CASE
-------------------

Input Complaint:
"${symptoms}"

Available Doctors:
${JSON.stringify(doctorList, null, 2)}

Return STRICT JSON only.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cleanup if the model adds markdown formatting
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        // Fallback mock data in case of error
        return {
            probable_disease: "Unknown Condition",
            severity: "moderate",
            specialist: "General Medicine",
            risk_score: 5,
            recommended_action: "appointment",
            nearby_doctors: doctorList.slice(0, 2)
        };
    }
}
