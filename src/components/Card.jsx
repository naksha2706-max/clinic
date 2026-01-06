import styles from './Card.module.css';

export default function Card({ children, className = '', interactive = false, ...props }) {
    return (
        <div
            className={`${styles.card} ${interactive ? styles.interactive : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
