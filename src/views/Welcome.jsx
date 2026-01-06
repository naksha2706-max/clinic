import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import styles from './Welcome.module.css';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className={`fade-in ${styles.container}`}>
            <div className={styles.brand}>
                <Activity size={64} className={styles.logoIcon} />
                <h1 className={styles.title}>
                    Care<span className={styles.highlight}>Connect</span>
                </h1>
                <p className={styles.subtitle}>
                    Your AI-powered health companion. Smart booking, instant analysis, and emergency support.
                </p>
            </div>

            <div className={styles.actions}>
                <Button
                    fullWidth
                    onClick={() => navigate('/details')}
                    style={{ height: '56px', fontSize: '1.125rem' }}
                >
                    Get Started <ArrowRight size={20} />
                </Button>

                <button
                    className={styles.emergencyBtn}
                    onClick={() => navigate('/emergency')}
                    style={{ color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Emergency Situation? Tap here.
                </button>
            </div>
        </div>
    );
}
