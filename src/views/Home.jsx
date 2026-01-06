import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import MicButton from '../components/MicButton';
import styles from './Home.module.css';

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
    const [isListening, setIsListening] = useState(false);
    const [symptomText, setSymptomText] = useState('');

    const handleMicClick = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support Voice Recognition. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        setIsListening(true);

        recognition.onstart = () => {
            console.log("Listening...");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSymptomText(prev => prev ? prev + " " + transcript : transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            alert("Could not hear you. Please try again or type.");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleAnalyze = () => {
        if (symptomText.trim()) {
            navigate('/analysis', { state: { symptoms: symptomText, user } });
        }
    };

    return (
        <div className={`container fade-in ${styles.container}`}>
            <header className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h1 className={styles.title}>Hi {user?.name ? user.name.split(' ')[0] : 'there'},<br />How are you feeling?</h1>
                    <Button onClick={() => navigate('/dashboard')} variant="secondary" size="sm">
                        History
                    </Button>
                </div>
                <p className={styles.subtitle}>Describe your symptoms to find the right care.</p>
            </header>

            <main className={styles.inputSection}>
                <MicButton
                    isListening={isListening}
                    onClick={handleMicClick}
                    size={40}
                />

                <div className={styles.orDivider}>OR</div>

                <div className={styles.textInputArea}>
                    <Input
                        multiline
                        placeholder="Type your symptoms here (e.g., 'fever for 3 days')..."
                        value={symptomText}
                        onChange={(e) => setSymptomText(e.target.value)}
                    />
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleAnalyze} disabled={!symptomText.trim()}>
                            Find Help <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>
            </main>

            <footer className={styles.emergencyWrapper}>
                <Button
                    variant="emergency"
                    fullWidth
                    className={styles.emergencyBtn}
                    onClick={() => navigate('/emergency')}
                >
                    <AlertTriangle size={20} />
                    Emergency Alert
                </Button>
            </footer>
        </div>
    );
}
