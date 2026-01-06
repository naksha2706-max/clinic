import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './BasicInfo.module.css';

export default function BasicInfo() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'select',
        insurance: 'select',
        phone: '',
        email: '',
        emergencyContact: '',
        medicalHistory: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (!formData.name.trim()) alert("Please enter your name.");
        else if (!formData.age) alert("Please enter your age.");
        else if (formData.gender === 'select') alert("Please select a gender.");
        else if (!formData.phone.trim()) alert("Please enter your phone number.");
        else if (!formData.email.trim()) alert("Please enter your email.");
        else {
            // Navigate to Home (Symptom Input) with user data
            navigate('/home', { state: { user: formData } });
        }
    };

    return (
        <div className={`fade-in ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Tell us about yourself</h1>
                <p className={styles.subtitle}>
                    This helps our AI provide personalized recommendations.
                </p>
            </div>

            <div className={styles.form}>
                <Input
                    label="Full Name"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                />

                <div className={styles.row}>
                    <Input
                        label="Age"
                        name="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={handleChange}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Gender</label>
                        <select
                            name="gender"
                            className={styles.select}
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="select" disabled>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Insurance Provider (Optional)</label>
                    <select
                        name="insurance"
                        className={styles.select}
                        value={formData.insurance}
                        onChange={handleChange}
                    >
                        <option value="select">I'll pay out of pocket</option>
                        <option value="blue_cross">Blue Cross</option>
                        <option value="aetna">Aetna</option>
                        <option value="united">United Healthcare</option>
                        <option value="medicare">Medicare</option>
                    </select>
                </div>

                <div className={styles.row}>
                    <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+1 555 000 0000"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <Input
                    label="Emergency Contact (Name & Phone)"
                    name="emergencyContact"
                    placeholder="Jane Doe: +1 555 111 2222"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Previous Medical Reports / History Summary</label>
                    <textarea
                        name="medicalHistory"
                        className={styles.textarea}
                        placeholder="e.g. Mild asthma, allergic to penicillin..."
                        value={formData.medicalHistory}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>
            </div>

            <div className={styles.footer}>
                <Button
                    fullWidth
                    onClick={handleNext}
                >
                    Next Step <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
}
