import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking, saveInteractionLog } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Phone, Check, Activity, Clock } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Booking.module.css';
import { simulateNegotiation } from '../services/negotiation';
import { triggerOutboundCall } from '../services/vapi';

export default function Booking() {
    const { user } = useAuth();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('calling'); // calling, negotiating, confirmed
    const [transcript, setTranscript] = useState([]);
    const [queuePosition, setQueuePosition] = useState(5);
    const [realCallMode, setRealCallMode] = useState(false);
    const [targetPhone, setTargetPhone] = useState('');
    const [callStatus, setCallStatus] = useState('');
    const doctor = state?.doctor;
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!doctor) return;
        if (realCallMode) return; // Don't run simulation if in real mode

        let isMounted = true;

        const runNegotiation = async () => {
            // Initial connection delay
            await new Promise(r => setTimeout(r, 1500));
            if (!isMounted) return;
            setStatus('negotiating');

            const userProfile = state?.user || {};
            const generator = simulateNegotiation(doctor, userProfile);

            for await (const msg of generator) {
                if (!isMounted) break;

                if (msg.action === 'confirm') {
                    // Create booking in Supabase
                    try {
                        const newBooking = await createBooking({
                            clinic_id: doctor.id,
                            user_id: user?.id,
                            patient_name: state?.user?.name || 'Guest',
                            patient_contact: state?.user?.phone || 'Simulated',
                            patient_email: state?.user?.email,
                            emergency_contact_name: state?.user?.emergencyContact,
                            medical_history_summary: state?.user?.medicalHistory,
                            symptoms: state?.symptoms || state?.user?.symptoms || 'Not specified',
                            appointment_time: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // +30 mins
                            status: 'confirmed'
                        });

                        // Save the transcript log
                        await saveInteractionLog({
                            booking_id: newBooking.id,
                            transcript: JSON.stringify(transcript),
                            summary: state?.analysisResult?.assessment?.summary || 'Booking via AI Simulation',
                            severity_score: 1 // Default/Placeholder
                        });

                        setStatus('confirmed');
                    } catch (err) {
                        console.error("Booking or Log creation failed:", err);
                        setStatus('confirmed');
                    }
                } else {
                    setTranscript(prev => [...prev, msg]);
                }
            }
        };

        // Only run simulation if specifically requested or default?
        // Let's default to asking the user what to do since we have Vapi now.
        // The initial status is 'calling', which will show the mode selection.
        // The simulation will be triggered by `startSimulation` or directly by the button.
        // If the status is already 'negotiating' (e.g., from a direct button click), run the simulation.
        if (status === 'negotiating' && !realCallMode) {
            runNegotiation();
        }
        return () => { isMounted = false; };
    }, [doctor, state, realCallMode, status, user]);

    const handleRealCall = async () => {
        if (!targetPhone) {
            alert("Please enter a phone number to test the real agent.");
            return;
        }
        setRealCallMode(true);
        setStatus('negotiating');
        setCallStatus('Initiating Call...');

        try {
            const userProfile = state?.user || { name: 'Test User', symptoms: 'Test Symptoms' };
            await triggerOutboundCall(targetPhone, {
                doctorName: doctor.name,
                userName: userProfile.name,
                symptoms: userProfile.symptoms
            });
            setCallStatus(`Calling ${targetPhone}... Listen to your phone!`);
            // We can't easily deliver the transcript in this mode without a backend
            setTranscript([{ speaker: "System", text: "AI Agent is dialing the real physical phone number..." }]);

            // Assume success after 10s for demo flow
            setTimeout(async () => {
                try {
                    await createBooking({
                        clinic_id: doctor.id,
                        user_id: user?.id,
                        patient_name: state?.user?.name || 'Guest',
                        patient_contact: targetPhone || state?.user?.phone || 'Real Call',
                        patient_email: state?.user?.email,
                        emergency_contact_name: state?.user?.emergencyContact,
                        medical_history_summary: state?.user?.medicalHistory,
                        symptoms: state?.symptoms || state?.user?.symptoms || 'Not specified',
                        appointment_time: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // +1 hour
                        status: 'confirmed'
                    });
                } catch (err) {
                    console.error("Booking creation failed:", err);
                }
                setStatus('confirmed');
            }, 15000);

        } catch (error) {
            console.error(error);
            setCallStatus("Call Failed: " + error.message);
            setTranscript(prev => [...prev, { speaker: "Error", text: "Could not dial. Check Vapi config or use a valid number." }]);
        }
    };

    // Auto-scroll to bottom of transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    // Simulated Queue Movement
    useEffect(() => {
        if (status === 'confirmed' && queuePosition > 1) {
            const timer = setInterval(() => {
                setQueuePosition(prev => Math.max(1, prev - 1));
            }, 3000); // Move up every 3 seconds
            return () => clearInterval(timer);
        }
    }, [status, queuePosition]);

    if (!doctor) return <div>Error: No doctor selected</div>;

    const startSimulation = () => {
        // Just trigger the useEffect logic by state reset or similar
        // For MVP, we'll just reload the simulation logic
        setStatus('negotiating'); // This will trigger the simulation useEffect
    };

    return (
        <div className={`container fade-in ${styles.container}`}>
            {status === 'calling' && !realCallMode ? (
                <div className={styles.modeSelection}>
                    <h2 className={styles.status}>Choose Booking Agent</h2>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexDirection: 'column' }}>
                        <Button onClick={startSimulation}>
                            Run AI Simulation (Chat)
                        </Button>
                        <div className={styles.realCallBox}>
                            <Input
                                placeholder="+1 555 123 4567"
                                value={targetPhone}
                                onChange={(e) => setTargetPhone(e.target.value)}
                                label="Enter Clinic/Test Phone Number"
                            />
                            <Button variant="emergency" onClick={handleRealCall}>
                                <Phone size={18} /> Make Real AI Call
                            </Button>
                        </div>
                    </div>
                </div>
            ) : status !== 'confirmed' ? (
                <>
                    <div className={styles.header}>
                        <div className={`${styles.pulseIcon} ${status === 'negotiating' ? styles.active : ''}`}>
                            <Phone size={32} />
                        </div>
                        <h2 className={styles.status}>
                            {realCallMode ? "Live AI Voice Call" : "AI Negotiating..."}
                        </h2>
                        {realCallMode && <p>{callStatus}</p>}
                    </div>

                    <div className={styles.transcriptBox} ref={scrollRef}>
                        {transcript.length === 0 && (
                            <div className={styles.connecting}>Connecting to {doctor.clinic}...</div>
                        )}
                        {transcript.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`${styles.message} ${msg.speaker === 'Agent' ? styles.agent : styles.receptionist}`}
                            >
                                <div className={styles.speakerLabel}>{msg.speaker}</div>
                                <div className={styles.text}>{msg.text}</div>
                            </div>
                        ))}
                        {!realCallMode && status === 'negotiating' && (
                            <div className={styles.typingIndicator}>
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.visualizer}>
                        <Activity className={styles.wave} />
                        <span>AI Voice Active</span>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.successHeader}>
                        <div className={styles.successIcon}>
                            <Check size={48} strokeWidth={3} />
                        </div>
                        <h2 className={styles.status}>Booked!</h2>
                    </div>

                    <div className={styles.queueCard}>
                        <div className={styles.queueHeader}>Live Queue Status</div>
                        <div className={styles.queueBody}>
                            <div className={styles.queueNumber}>#{queuePosition}</div>
                            <div className={styles.queueLabel}>Your Position</div>
                            <div className={styles.estTime}>
                                <Clock size={16} /> Est. Wait: {queuePosition * 5} mins
                            </div>
                        </div>
                    </div>

                    <div className={styles.ticket}>
                        <div className={styles.ticketRow}>
                            <span className={styles.label}>Doctor</span>
                            <span className={styles.value}>{doctor.name}</span>
                        </div>
                        <div className={styles.ticketRow}>
                            <span className={styles.label}>Time</span>
                            <span className={styles.value}>Negotiated Slot</span>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button onClick={() => navigate('/')} variant="secondary" fullWidth>
                            Return Home
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
