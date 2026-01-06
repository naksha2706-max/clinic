import Vapi from '@vapi-ai/web';

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const vapi = new Vapi(PUBLIC_KEY);

// System Prompt for the AI Agent
const ASSISTANT_CONFIG = {
    model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful medical clinic receptionist. You are receiving a call from a patient who wants to book an appointment. Ask for their name and preferred time. Be polite and concise."
            }
        ]
    },
    voice: {
        provider: "11labs",
        voiceId: "burt" // A standard male voice
    },
    firstMessage: "Hello, this is the Clinic AI. How can I help you today?"
};

/**
 * Starts a browser-based voice call with the AI (User <-> AI).
 */
export async function startBrowserCall(userProfile) {
    try {
        // We can dynamically update the prompt based on the user
        const dynamicConfig = {
            ...ASSISTANT_CONFIG,
            model: {
                ...ASSISTANT_CONFIG.model,
                messages: [
                    {
                        role: "system",
                        content: `You are a medical assistant helping ${userProfile?.name || 'a patient'}. They have symptoms: ${userProfile?.symptoms || 'General checkup'}. Guide them through the booking process.`
                    }
                ]
            }
        };

        await vapi.start(dynamicConfig);
        return vapi; // Return instance to attach listeners
    } catch (error) {
        console.error("Failed to start Vapi call:", error);
        throw error;
    }
}

/**
 * Triggers a REAL outbound phone call to a physical number (AI -> Phone).
 * NOTE: This requires a Private Key usually, but we will try with the provided key.
 * If the key is Public, this might fail with 401/403.
 * 
 * @param {string} phoneNumber - The number to call (E.164 format e.g., +15551234567)
 * @param {object} context - Data to give the AI context (doctor name, patient name)
 */
export async function triggerOutboundCall(phoneNumber, context) {
    const url = "https://api.vapi.ai/call/phone";

    // Prompt for the AI when IF IT CALLS THE CLINIC on behalf of the user
    // "Act as the Patient's Agent talking to a Receptionist"
    const agentPrompt = `
    You are an AI Booking Agent calling a clinic on behalf of a patient named ${context.userName || 'John Doe'}.
    You wish to book an appointment with ${context.doctorName}.
    The patient's symptoms are: "${context.symptoms}".
    Negotiate a time slot for today.
    `;

    const body = {
        phoneNumberId: "DEFAULT_PHONE_NUMBER_ID", // Vapi provides a default or you need to buy one
        customer: {
            number: phoneNumber, // The CLINIC'S number
        },
        assistant: {
            ...ASSISTANT_CONFIG,
            model: {
                ...ASSISTANT_CONFIG.model,
                messages: [
                    { role: "system", content: agentPrompt }
                ]
            },
            firstMessage: "Hello, I am calling to book an appointment for a patient."
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${PUBLIC_KEY}`, // Using the key provided
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Call failed");
        }

        return await response.json(); // Returns call details
    } catch (error) {
        console.error("Outbound Call Error:", error);
        throw error;
    }
}

export const stopCall = () => {
    vapi.stop();
};
