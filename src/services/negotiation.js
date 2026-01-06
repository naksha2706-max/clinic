import { GoogleGenerativeAI } from "@google/generative-ai";

// Keys are now in .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Simulates a negotiation between a Patient Agent and a Clinic Receptionist.
 * Returns a generator or callback-based stream of messages.
 */
export async function* simulateNegotiation(doctor, userProfile) {
    const patientName = userProfile?.name || "the patient";

    // Initial context
    const context = `
    Characters:
    1. Agent (Patient's AI): Polite, urgent, trying to book for ${patientName}.
    2. Receptionist (Clinic AI): Busy but helpful, checking schedule for ${doctor.name}.
    
    Setting: Phone call.
    Goal: Book an appointment as soon as possible.
    Constraint: The first slot might be taken, negotiate for the next best one (e.g. 15-30 mins later).
    
    Generate a 4-turn dialogue (2 exchanges each).
    Format: JSON Array of objects [{ "speaker": "Agent"|"Receptionist", "text": "..." }]
    `;

    try {
        const prompt = `${context} \n\n Generate the JSON dialogue now:`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const dialogue = JSON.parse(jsonStr);

        // Yield each message with a simulated delay for realism
        for (const msg of dialogue) {
            await new Promise(r => setTimeout(r, 1500)); // Delay for reading speed
            yield msg;
        }

        // Final confirmation yield
        await new Promise(r => setTimeout(r, 1000));
        yield { speaker: "System", text: "Appointment Confirmed", action: "confirm" };

    } catch (error) {
        console.error("Negotiation Error", error);
        // Fallback dialogue
        yield { speaker: "Agent", text: `Hi, I'd like to book an appointment with ${doctor.name}.` };
        await new Promise(r => setTimeout(r, 1500));
        yield { speaker: "Receptionist", text: "Let me check... We are quite busy." };
        await new Promise(r => setTimeout(r, 1500));
        yield { speaker: "Receptionist", text: "We have a slot opening in 20 minutes. Is that okay?" };
        await new Promise(r => setTimeout(r, 1500));
        yield { speaker: "Agent", text: "Yes, that works perfectly. Please book it." };
        await new Promise(r => setTimeout(r, 1000));
        yield { speaker: "System", text: "Appointment Confirmed", action: "confirm" };
    }
}
