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
            // Visual step progress (keep it moving while loading)
            const interval = setInterval(() => {
                setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
            }, 1000);

            try {
                // Real API Call
                const result = await analyzeSymptoms(symptoms, user);

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
                // Navigate anyway (the service handles fallback generally, but just in case)
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
