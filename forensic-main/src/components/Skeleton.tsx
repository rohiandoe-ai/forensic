import styles from './Skeleton.module.css';

interface SkeletonProps {
    type?: 'text' | 'textShort' | 'title' | 'card' | 'circle' | 'rect';
    count?: number;
}

export default function Skeleton({ type = 'text', count = 1 }: SkeletonProps) {
    const typeClass = styles[type] || styles.text;
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`${styles.skeleton} ${typeClass}`} />
            ))}
        </>
    );
}
