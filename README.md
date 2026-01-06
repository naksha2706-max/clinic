# CareSync AI: Smart Clinic Booking & Emergency Assistance Platform

**CareSync AI** is an intelligent healthcare orchestration platform designed to bridge the gap between patients and medical services. By leveraging cutting-edge Generative AI and Voice-over-IP technologies, it automates the most stressful parts of medical management: symptom triage, appointment negotiation, and emergency response.

---

## 🚀 Key Features to Watch

### 🧠 1. AI Symptom Analysis (Google Gemini)
Unlike simple forms, CareSync uses an **LLM-driven engine** to analyze patient symptoms in real-time. It doesn't just record data; it evaluates severity, estimates urgency, and recommends the exact specialist needed, reducing misdiagnosis and wait times.

### 🎙️ 2. Autonomous AI Voice Agent (Vapi.ai)
The platform features a unique **AI Negotiator**. When a slot isn't available, the AI can initiate a simulated voice call to the clinic's receptionist. It negotiates appointment times based on the patient's schedule and the clinic's availability, providing a hands-free booking experience.

### 🚨 3. Smart Emergency "Safe-Net"
A single-click Emergency Alert system that triggers a multi-channel response:
- **Instant SOS:** Notifies pre-set family contacts.
- **Clinic Outreach:** Alerts the nearest medical centers with the patient's medical ID.
- **Ambulance Dispatch:** Shares real-time location data for rapid response.

### 📅 4. Dynamic Queue & Fallback System
Real-time tracking of clinic queues. If a primary clinic is overbooked, the system automatically identifies and suggests fallback options with better availability, ensuring patients are seen as quickly as possible.

---

## 🛠️ The Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite (HMR), Vanilla CSS (Modular) |
| **Intelligence** | Google Gemini (Symptom Processing) |
| **Voice Interface** | Vapi.ai (Autonomous Voice Interaction) |
| **Database/Auth** | Supabase (Secure Patient Data & Appointment Logs) |
| **Icons & UI** | Lucide React |

---

## 🧩 Architecture Overview

CareSync AI operates as a coordinated ecosystem:
1.  **Frontend Interface:** A sleek, reactive React application for patient interaction.
2.  **Logic Layer:** React Services handle the heavy lifting, orchestrating calls between the UI and external APIs.
3.  **Data Layer:** Supabase provides a robust, real-time backend for storing medical histories and booking statuses securely.

---

## 🛠️ Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone [repository-url]
    cd clinic
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Configuration:**
    Create a `.env` file and add your credentials:
    ```env
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    VITE_GEMINI_API_KEY=your_key
    VITE_VAPI_PUBLIC_KEY=your_key
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🎯 Impact Statement
CareSync AI is built with the vision of **democratizing healthcare access**. By automating administrative hurdles and providing instant emergency support, we allow medical professionals to focus on what matters most: **saving lives.**
