import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Activity, MessageSquare } from 'lucide-react';
import { getMyBookings, getInteractionLog } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Card from '../components/Card';
import Button from '../components/Button';
import TranscriptModal from './TranscriptModal';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadBookings = async () => {
            try {
                const data = await getMyBookings(user.id);
                setBookings(data);
            } catch (error) {
                console.error("Failed to load bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBookings();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'bookings',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    console.log('Change received!', payload);
                    setBookings((prev) =>
                        prev.map((b) => b.id === payload.new.id ? { ...b, ...payload.new } : b)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, navigate]);

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleViewTranscript = async (bookingId) => {
        try {
            const log = await getInteractionLog(bookingId);
            if (log) {
                setSelectedLog(log);
                setShowModal(true);
            } else {
                alert("No transcript found for this booking.");
            }
        } catch (error) {
            console.error("Error fetching transcript:", error);
            alert("Failed to load transcript.");
        }
    };

    return (
        <div className={`container fade-in ${styles.container}`}>
            <header className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className={styles.title}>My Bookings</h1>
                    <Button onClick={signOut} variant="secondary" size="sm">
                        Logout
                    </Button>
                </div>
                <p className={styles.subtitle}>Track your appointments and history.</p>
            </header>

            {loading ? (
                <div className={styles.emptyState}>Loading your history...</div>
            ) : bookings.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No bookings found.</p>
                    <Button onClick={() => navigate('/')} variant="secondary" className={styles.backBtn}>
                        Book your first appointment
                    </Button>
                </div>
            ) : (
                <div className={styles.bookingList}>
                    {bookings.map((booking) => (
                        <Card key={booking.id} className={styles.bookingCard}>
                            <div className={styles.clinicInfo}>
                                <div className={styles.clinicName}>{booking.clinics?.name || 'Clinic'}</div>
                                <div className={styles.dateTime}>
                                    <Calendar size={14} /> {formatDate(booking.appointment_time)}
                                </div>
                                <div className={styles.dateTime}>
                                    <MapPin size={14} /> {booking.clinics?.address || 'Unknown Address'}
                                </div>
                            </div>

                            <div className={styles.queueBadge}>
                                {booking.status === 'confirmed' && (
                                    <div className={styles.liveIndicator}>
                                        <div className={styles.liveDot} />
                                        <span>Live Tracking</span>
                                    </div>
                                )}

                                {booking.queue_position ? (
                                    <div className={styles.queueDetails}>
                                        <span className={styles.queueNumber}>#{booking.queue_position}</span>
                                        <span className={styles.waitTime}>
                                            ~{booking.estimated_wait_mins || 15} mins wait
                                        </span>
                                    </div>
                                ) : (
                                    <div className={`${styles.status} ${styles.statusConfirmed}`}>
                                        {booking.status}
                                    </div>
                                )}

                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className={styles.transcriptBtn}
                                    onClick={() => handleViewTranscript(booking.id)}
                                >
                                    <MessageSquare size={14} style={{ marginRight: '4px' }} />
                                    View AI Transcript
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {showModal && (
                <TranscriptModal
                    log={selectedLog}
                    onClose={() => setShowModal(false)}
                />
            )}

            <div className={styles.footer}>
                <Button
                    onClick={() => navigate('/')}
                    variant="secondary"
                    fullWidth
                    className={styles.backBtn}
                >
                    <ArrowLeft size={18} /> Back to Home
                </Button>
            </div>
        </div>
    );
}
