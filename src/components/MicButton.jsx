import { Mic } from 'lucide-react';
import styles from './MicButton.module.css';

export default function MicButton({ isListening, onClick, size = 32 }) {
    return (
        <div className={styles.container}>
            <button
                className={`${styles.circle} ${isListening ? styles.listening : ''}`}
                onClick={onClick}
                aria-label="Toggle voice input"
            >
                <Mic size={size} />
            </button>
            <span className={styles.label}>
                {isListening ? 'Listening...' : 'Tap to Speak'}
            </span>
        </div>
    );
}
