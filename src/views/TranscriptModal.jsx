import { X, MessageSquare, ShieldCheck, Activity } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './TranscriptModal.module.css';

export default function TranscriptModal({ log, onClose }) {
    if (!log) return null;

    // Parse transcript if it's a string, otherwise use as is
    const transcript = typeof log.transcript === 'string'
        ? JSON.parse(log.transcript)
        : log.transcript;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`fade-in ${styles.modal}`} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <MessageSquare className={styles.icon} />
                        <h2>Negotiation Transcript</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.content}>
                    {log.summary && (
                        <Card className={styles.summaryCard}>
                            <div className={styles.summaryHeader}>
                                <ShieldCheck size={18} className={styles.summaryIcon} />
                                <h3>AI Outcome Summary</h3>
                            </div>
                            <p className={styles.summaryText}>{log.summary}</p>
                            {log.severity_score && (
                                <div className={styles.severity}>
                                    <Activity size={14} />
                                    <span>AI Urgency Rating: <strong>{log.severity_score}/10</strong></span>
                                </div>
                            )}
                        </Card>
                    )}

                    <div className={styles.chatContainer}>
                        {Array.isArray(transcript) ? (
                            transcript.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`${styles.message} ${msg.role === 'assistant' ? styles.agent : styles.receptionist}`}
                                >
                                    <div className={styles.roleLabel}>
                                        {msg.role === 'assistant' ? 'AI Agent' : 'Clinic Staff'}
                                    </div>
                                    <div className={styles.bubble}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyText}>No detailed transcript available.</p>
                        )}
                    </div>
                </div>

                <footer className={styles.footer}>
                    <Button onClick={onClose} fullWidth>Close Viewer</Button>
                </footer>
            </div>
        </div>
    );
}
