import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Analysis.module.css';
import { analyzeSymptoms } from '../services/ai';

const steps = [
    "Analyzing symptoms...",
    "Determining severity level...",
    "Checking insurance coverage...",
    "Finding best specialists...",
];

export default function Analysis() {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const { symptoms, user } = location.state || {}; // Safety check

        const runAnalysis = async () => {
            // Visual step progress
            const interval = setInterval(() => {
                setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
            }, 1000);

            try {
                // 1. Fetch all clinics first
                const { getClinics } = await import('../lib/api');
                const allClinics = await getClinics();

                // Map to the format the AI prompt expects, but include ID and Queue for tracking
                const doctorList = allClinics.map(c => ({
                    id: c.id,
                    name: c.name,
                    specialist: c.specialty || 'general physician',
                    distance_km: (Math.random() * 5 + 0.5).toFixed(1), // Random distance 0.5 - 5.5km
                    current_queue: c.current_queue || 0,
                    available: c.is_available ?? true
                }));

                // 2. Real AI Call with doctors
                const result = await analyzeSymptoms(symptoms, doctorList);

                if (isMounted) {
                    clearInterval(interval);
                    // Pass the real result to the next page
                    navigate('/results', {
                        state: {
                            ...location.state,
                            analysisResult: result
                        }
                    });
                }
            } catch (error) {
                console.error("Analysis failed", error);
                if (isMounted) navigate('/results', { state: location.state });
            }
        };

        if (symptoms) {
            runAnalysis();
        } else {
            // If no symptoms (direct access), go back
            navigate('/');
        }

        return () => { isMounted = false; };
    }, [navigate, location.state]);

    return (
        <div className={`container fade-in ${styles.container}`}>
            <div className={styles.loader}>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
            </div>
            <h2 className={styles.status}>{steps[step]}</h2>
            <p className={styles.substatus}>AI is processing your health data safely.</p>
        </div>
    );
}
