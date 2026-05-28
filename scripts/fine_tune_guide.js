const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();

// WARNING: You need a Gemini API Key with tuning permissions (enabled in Google AI Studio)
const API_KEY = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function startTuning() {
    try {
        console.log("🚀 Starting Gemini 1.5 Flash Fine-Tuning Process...");

        // In a real environment, you would use the 'GoogleGenerativeAI' library
        // to upload the 'fine_tuning_dataset.jsonl' to Google Cloud Storage or 
        // directly through the AI Studio Tuning interface.

        console.log("\nStep 1: Go to Google AI Studio (https://aistudio.google.com/)");
        console.log("Step 2: Click on 'Create New' -> 'Tuned Model'");
        console.log("Step 3: Upload 'fine_tuning_dataset.jsonl'");
        console.log("Step 4: Select 'gemini-1.5-flash-001' as the base model.");
        console.log("Step 5: Once training is complete, copy your Tuned Model ID (e.g., 'tunedModels/my-model-123')");

        console.log("\n--- NEXT STEPS ---");
        console.log("After tuning, update your 'src/services/ai.js' line 11:");
        console.log("const model = genAI.getGenerativeModel({ model: 'tunedModels/YOUR_MODEL_ID' });");

    } catch (error) {
        console.error("❌ Tuning initiation failed:", error);
    }
}

startTuning();
