import styles from './Input.module.css';

export default function Input({ label, error, multiline = false, className = '', ...props }) {
    const Component = multiline ? 'textarea' : 'input';

    return (
        <div className={`${styles.wrapper} ${className}`}>
            {label && <label className={styles.label}>{label}</label>}
            <Component
                className={`${styles.input} ${multiline ? styles.textarea : ''}`}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}
