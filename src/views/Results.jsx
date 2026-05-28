import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './Results.module.css';

export default function Results() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // AI Response Data
    const analysis = state?.analysisResult;
    const disease = analysis?.probable_disease;
    const severity = analysis?.severity;
    const riskScore = analysis?.risk_score;
    const action = analysis?.recommended_action;

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!analysis) {
            setLoading(false);
            return;
        }

        // Map AI-recommended doctors back to the full doctor object the UI expects
        const recommendedDoctors = (analysis.nearby_doctors || []).map((doc, index) => {
            const queueInMins = (doc.current_queue || 0) * 10 + 5; // 10 min per patient + 5 min base
            return {
                id: doc.id || index,
                name: doc.name,
                specialist: doc.specialist,
                clinic: "Recommendation",
                wait: `${queueInMins} min`,
                price: "$40-$60",
                distance: `${doc.distance_km} km`,
                insurance: true,
                isAvailable: doc.available ?? true
            };
        });

        setDoctors(recommendedDoctors);
        setLoading(false);
    }, [analysis]);

    if (loading) {
        return (
            <div className={`container fade-in ${styles.container}`}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Finding the best care for you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`container fade-in ${styles.container}`}>
            <div className={styles.header}>
                <div className={`${styles.analysisSummary} glass`}>
                    <div className={styles.summaryTitle}>AI Assessment: {disease || 'Analyzing...'}</div>
                    <div className={styles.summaryText}>
                        Severity: <strong style={{ textTransform: 'capitalize' }}>{severity || 'Unknown'}</strong> •
                        Risk Score: <strong>{riskScore}/10</strong> •
                        Action: <strong style={{ textTransform: 'capitalize' }}>{action || 'Consult'}</strong>
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>Recommended Specialists</h2>
            </div>

            <div className={styles.list}>
                {doctors.length === 0 ? (
                    <div className={styles.noResults}>No matching specialists found in your area.</div>
                ) : (
                    doctors.map((doc) => (
                        <Card key={doc.id} className={`${styles.doctorCard} glass`}>
                            <div className={styles.doctorHeader}>
                                <div>
                                    <div className={styles.name}>{doc.name}</div>
                                    <div className={styles.specialty}>{doc.specialist} • {doc.clinic}</div>
                                </div>
                                {!doc.isAvailable && (
                                    <span className={`${styles.tag} ${styles.busy}`}>
                                        Clinically Busy
                                    </span>
                                )}
                                {doc.insurance && doc.isAvailable && (
                                    <span className={`${styles.tag} ${styles.insuranceMatch}`}>
                                        Insurance Match
                                    </span>
                                )}
                            </div>

                            <div className={styles.meta}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} /> Wait: {doc.wait}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={14} /> {doc.distance}
                                </span>
                            </div>

                            <div className={styles.actionRow}>
                                <span className={styles.price}>Consultation: {doc.price}</span>
                                <Button size="sm" onClick={() => navigate('/booking', { state: { doctor: doc, user: state?.user, symptoms: state?.symptoms } })}>
                                    Book Now
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
