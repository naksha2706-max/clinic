import { triggerEmergency, getEmergencyClinics } from '../lib/api';

/**
 * Orchestrates the multi-channel emergency response.
 * 1. Logs to Supabase
 * 2. Simulates SMS/Email outreach
 * 3. Alerts nearest clinics
 */
export async function initiateEmergencyResponse(patientData) {
    console.log("🚨 Emergency Response Initiated", patientData);

    const results = {
        alertId: null,
        channels: [],
        clinics: []
    };

    try {
        // 1. Get Location (Simulated for this MVP)
        const location = { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore

        // 2. Log to DB
        const alert = await triggerEmergency({
            user_id: patientData.user_id,
            patient_name: patientData.name || 'Anonymous Patient',
            location_lat: location.lat,
            location_lng: location.lng,
            status: 'triggered',
            channels_notified: ['Family', 'Local Clinic']
        });
        results.alertId = alert.id;

        // 3. Find Nearby Emergency Clinics
        const clinics = await getEmergencyClinics();
        results.clinics = clinics;

        // 4. Multi-channel Simulation (Wait times for UI realism)
        await new Promise(r => setTimeout(r, 1000));
        results.channels.push('Family notified via SMS');

        await new Promise(r => setTimeout(r, 1000));
        results.channels.push(`${clinics.length} Nearby Clinics Alerted`);

        await new Promise(r => setTimeout(r, 1000));
        results.channels.push('Ambulance Dispatch requested');

        return results;
    } catch (error) {
        console.error("Emergency Service Error:", error);
        throw error;
    }
}
