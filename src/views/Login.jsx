import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Login.module.css';

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                alert("Check your email for the confirmation link!");
            } else {
                const { error } = await signIn({ email, password });
                if (error) throw error;
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fade-in ${styles.container}`}>
            <header className={styles.header}>
                <h1 className={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
                <p className={styles.subtitle}>
                    {isSignUp ? 'Join the smart clinic network' : 'Securely access your health dashboard'}
                </p>
            </header>

            {error && <div className={styles.error}>{error}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                </Button>
            </form>

            <p className={styles.toggleText}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                    className={styles.toggleLink}
                    onClick={() => setIsSignUp(!isSignUp)}
                >
                    {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
}
