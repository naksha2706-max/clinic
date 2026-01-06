import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './Results.module.css';

export default function Results() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Use real data if available, otherwise fallback (or show empty)
    const analysis = state?.analysisResult?.assessment;
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const { getClinics } = await import('../lib/api');
                const allClinics = await getClinics();

                const recommendedSpecialties = analysis?.recommended_specialties || [];

                // Filter clinics based on recommended specialties if available
                let filteredClinics = allClinics;
                if (recommendedSpecialties.length > 0) {
                    filteredClinics = allClinics.filter(clinic =>
                        recommendedSpecialties.some(spec =>
                            clinic.specialty?.toLowerCase().includes(spec.toLowerCase()) ||
                            spec.toLowerCase().includes(clinic.specialty?.toLowerCase())
                        )
                    );
                }

                // If no matches found after filtering, show all but maybe a "general" subset or just all
                if (filteredClinics.length === 0) filteredClinics = allClinics;

                // Transform Supabase data to match UI component
                const mappedDoctors = filteredClinics.map(clinic => ({
                    id: clinic.id,
                    name: `Dr. Available (${clinic.specialty || 'General'})`,
                    specialty: clinic.specialty || 'General Practice',
                    clinic: clinic.name,
                    wait: "10-20 min",
                    price: "$50",
                    distance: "1.2 miles",
                    insurance: true,
                    address: clinic.address
                }));
                setDoctors(mappedDoctors);
            } catch (error) {
                console.error("Failed to fetch clinics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClinics();
    }, [analysis]);

    return (
        <div className={`container fade-in ${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.analysisSummary}>
                    <div className={styles.summaryTitle}>AI Assessment</div>
                    <div className={styles.summaryText}>
                        Severity: <strong>{analysis?.severity || 'Assessing...'}</strong> • Urgency: <strong>{analysis?.urgency || 'Review'}</strong>
                    </div>
                    <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#475569' }}>
                        {analysis?.summary || `Based on: "${state?.symptoms || 'General Checkup'}"`}
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>Recommended Specialists</h2>
            </div>

            <div className={styles.list}>
                {doctors.map((doc) => (
                    <Card key={doc.id} className={styles.doctorCard}>
                        <div className={styles.doctorHeader}>
                            <div>
                                <div className={styles.name}>{doc.name}</div>
                                <div className={styles.specialty}>{doc.specialty} • {doc.clinic}</div>
                            </div>
                            {doc.insurance && (
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
                ))}
            </div>
        </div>
    );
}
