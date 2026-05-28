import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShieldAlert, Ambulance, Phone } from 'lucide-react'; // Changed 'Radio' to 'ShieldAlert' effectively
import Button from '../components/Button';
import styles from './Emergency.module.css';

// Initial state for simulation steps

export default function Emergency() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [steps, setSteps] = useState([
        { icon: <ShieldAlert />, text: "Locating user..." },
        { icon: <Bell />, text: "Notifying Family (Mom, Dad)..." },
        { icon: <ShieldAlert />, text: "Alerting Nearby Clinics..." },
        { icon: <Ambulance />, text: "Dispatching Ambulance..." },
    ]);

    useEffect(() => {
        import('../lib/api').then(({ getEmergencyClinics }) => {
            getEmergencyClinics().then(data => {
                // setClinics(data);
                setSteps(prev => {
                    const newSteps = [...prev];
                    newSteps[2].text = `Alerting ${data.length} Nearby Clinics...`;
                    return newSteps;
                });
            }).catch(console.error);
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const { user } = navigate.state || {}; // Try to get user from state

        const runEmergency = async () => {
            try {
                const { initiateEmergencyResponse } = await import('../services/emergency');
                const result = await initiateEmergencyResponse({
                    user_id: user?.id,
                    name: user?.name || 'Anonymous'
                });

                if (isMounted) {
                    // Update steps based on real data
                    setSteps(prev => [
                        { icon: <ShieldAlert />, text: "Location Secured: Bangalore" },
                        { icon: <Bell />, text: "Family Notified (SMS Sent)" },
                        { icon: <ShieldAlert />, text: `${result.clinics.length} Nearby Clinics Alerted` },
                        { icon: <Ambulance />, text: "Ambulance Dispatch Confirmed" },
                    ]);

                    // Trigger the progress animation
                    let stage = 0;
                    const timer = setInterval(() => {
                        stage++;
                        if (stage <= 4) setProgress(stage);
                        else clearInterval(timer);
                    }, 1200);
                }
            } catch (error) {
                console.error("Emergency fail", error);
            }
        };

        runEmergency();
        return () => { isMounted = false; };
    }, [navigate]);

    return (
        <div className={`container fade-in ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Emergency Alert</h1>
                <p className={styles.subtitle}>Help is on the way.</p>
            </div>

            <div className={styles.statusList}>
                {steps.map((step, index) => {
                    let statusClass = '';
                    if (index < progress) statusClass = styles.done;
                    else if (index === progress) statusClass = styles.active;

                    return (
                        <div key={index} className={`${styles.statusItem} ${statusClass}`}>
                            <div className={styles.icon}>{step.icon}</div>
                            <span>{step.text}</span>
                            {index < progress && <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>}
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <Button
                    variant="emergency"
                    fullWidth
                    onClick={() => window.location.href = 'tel:911'}
                >
                    <Phone /> Call Emergency Services
                </Button>
                <Button
                    className={styles.cancelBtn}
                    fullWidth
                    onClick={() => navigate('/')}
                >
                    I am safe (Cancel)
                </Button>
            </div>
        </div>
    );
}
