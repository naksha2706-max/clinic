import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: In a production app, you should never expose your API key in the frontend code.
// Ideally, call a backend that calls this API. For this MVP,// Keys are now in .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeSymptoms(symptoms, userProfile) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are a smart medical assistant AI for a clinic booking app.
        
        User Profile:
        Age: ${userProfile?.age || 'Unknown'}
        Gender: ${userProfile?.gender || 'Unknown'}
        Insurance: ${userProfile?.insurance || 'None'}

        Patient's Complaint: "${symptoms}"

        Task: Analyze the severity and recommend the top 2-3 medical specialties the patient should visit.
        
        Return the response strictly as a valid JSON object with the following structure:
        {
            "assessment": {
                "severity": "Mild" | "Moderate" | "Severe" | "Critical",
                "urgency": "Routine" | "Urgent" | "Emergency",
                "summary": "Short 1-sentence analysis of the symptoms",
                "recommended_specialties": ["Specialty 1", "Specialty 2"]
            }
        }
        Return ONLY the JSON. No preamble, no markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cleanup if the model adds markdown formatting
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        // Fallback mock data in case of error (or missing API key)
        return {
            assessment: {
                severity: "Unknown",
                urgency: "Consultation Required",
                summary: "Could not analyze. Please see a doctor."
            },
            doctors: [
                {
                    id: 99,
                    name: "Dr. Fallback",
                    specialty: "General Medicine",
                    clinic: "City Clinic",
                    wait: "15 min",
                    price: "$50",
                    distance: "1.0 miles",
                    insurance: true
                }
            ]
        };
    }
}
