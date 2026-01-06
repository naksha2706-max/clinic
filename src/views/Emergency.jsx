import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShieldAlert, Ambulance, Phone } from 'lucide-react'; // Changed 'Radio' to 'ShieldAlert' effectively
import Button from '../components/Button';
import styles from './Emergency.module.css';

// Simulation steps
const userSteps = [
    { icon: <ShieldAlert />, text: "Locating user..." },
    { icon: <Bell />, text: "Notifying Family (Mom, Dad)..." },
    { icon: <ShieldAlert />, text: "Alerting Nearby Clinics..." }, // Reused icon
    { icon: <Ambulance />, text: "Dispatching Ambulance..." },
];

export default function Emergency() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [clinics, setClinics] = useState([]);
    const [steps, setSteps] = useState([
        { icon: <ShieldAlert />, text: "Locating user..." },
        { icon: <Bell />, text: "Notifying Family (Mom, Dad)..." },
        { icon: <ShieldAlert />, text: "Alerting Nearby Clinics..." },
        { icon: <Ambulance />, text: "Dispatching Ambulance..." },
    ]);

    useEffect(() => {
        import('../lib/api').then(({ getEmergencyClinics }) => {
            getEmergencyClinics().then(data => {
                setClinics(data);
                setSteps(prev => {
                    const newSteps = [...prev];
                    newSteps[2].text = `Alerting ${data.length} Nearby Clinics...`;
                    return newSteps;
                });
            }).catch(console.error);
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev < steps.length) return prev + 1;
                clearInterval(timer);
                return prev;
            });
        }, 1500);
        return () => clearInterval(timer);
    }, [steps.length]);

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
